package pt.app.JusticeLeague.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import pt.app.JusticeLeague.dto.request.ChatMensagemRequest;
import pt.app.JusticeLeague.dto.response.ChatMensagemResponse;
import pt.app.JusticeLeague.model.Chat;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.Utilizador;
import pt.app.JusticeLeague.repository.ChatRepository;
import pt.app.JusticeLeague.repository.DenunciaRepository;
import pt.app.JusticeLeague.security.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private AuthUtils authUtils;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${openai.base-url:https://api.openai.com/v1}")
    private String openAiBaseUrl;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    @Value("${openai.chat.max-history:12}")
    private int openAiMaxHistory;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Transactional
    public ChatMensagemResponse enviarMensagem(Long denunciaId, ChatMensagemRequest req) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        Utilizador quemPediu = authUtils.getUtilizadorAtual();

        Chat c = Chat.builder()
                .denuncia(d)
                .utilizador(authUtils.isPsp() ? null : quemPediu) // se for PSP, utilizador é null no BD
                .mensagem(req.getMensagem())
                .dataEnvio(LocalDateTime.now())
                .build();

        c = chatRepository.save(c);
        return ChatMensagemResponse.from(c);
    }

    @Transactional
    public List<ChatMensagemResponse> enviarMensagemComApoio(Long denunciaId, ChatMensagemRequest req) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        if (!temAcessoAoChat(d, quemPediu)) {
            throw new RuntimeException("Acesso negado.");
        }

        Chat mensagemUserOuPsp = Chat.builder()
                .denuncia(d)
                .utilizador(authUtils.isPsp() ? null : quemPediu)
                .mensagem(req.getMensagem())
                .dataEnvio(LocalDateTime.now())
                .build();
        mensagemUserOuPsp = chatRepository.save(mensagemUserOuPsp);

        ChatMensagemResponse r1 = ChatMensagemResponse.from(mensagemUserOuPsp);

        if (authUtils.isPsp()) {
            return List.of(r1);
        }

        String resposta;
        try {
            resposta = gerarRespostaApoio(d);
        } catch (Exception e) {
            resposta = "Neste momento não consigo gerar uma resposta automática. Se estiver em perigo imediato, contacta 112.";
        }

        Chat mensagemApoio = Chat.builder()
                .denuncia(d)
                .utilizador(null)
                .mensagem(resposta)
                .dataEnvio(LocalDateTime.now())
                .build();
        mensagemApoio = chatRepository.save(mensagemApoio);

        return List.of(r1, ChatMensagemResponse.from(mensagemApoio));
    }

    public List<ChatMensagemResponse> listarMensagens(Long denunciaId) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        // Verificar acesso
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        if (!temAcessoAoChat(d, quemPediu)) {
            throw new RuntimeException("Acesso negado.");
        }

        return chatRepository.findByDenunciaOrderByDataEnvioAsc(d)
                .stream()
                .map(ChatMensagemResponse::from)
                .collect(Collectors.toList());
    }

    private boolean temAcessoAoChat(Denuncia d, Utilizador quemPediu) {
        if (authUtils.isPsp()) {
            return true;
        }
        if (quemPediu == null) {
            return false;
        }
        return d.getUtilizador() != null && d.getUtilizador().getId().equals(quemPediu.getId());
    }

    private String gerarRespostaApoio(Denuncia d) throws Exception {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            throw new RuntimeException("OPENAI_API_KEY não configurada.");
        }

        List<Chat> ultimas = chatRepository.findUltimasMensagens(d, PageRequest.of(0, Math.max(1, openAiMaxHistory)));
        Collections.reverse(ultimas);

        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "És um assistente de apoio da plataforma SafeNet. Responde em português (PT-PT), de forma calma e prática. Não solicites dados sensíveis (morada completa, documentos, passwords). Se houver risco imediato, recomenda contactar 112. Dá passos concretos e recursos úteis."
        ));

        for (Chat c : ultimas) {
            String role = c.getUtilizador() != null ? "user" : "assistant";
            messages.add(Map.of(
                    "role", role,
                    "content", c.getMensagem() == null ? "" : c.getMensagem()
            ));
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", openAiModel);
        payload.put("messages", messages);
        payload.put("temperature", 0.3);

        String body = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(openAiBaseUrl + "/chat/completions"))
                .timeout(Duration.ofSeconds(25))
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("Falha ao obter resposta do serviço de apoio.");
        }

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode content = root.path("choices").path(0).path("message").path("content");
        String text = content.isTextual() ? content.asText() : null;
        if (text == null || text.isBlank()) {
            throw new RuntimeException("Resposta vazia do serviço de apoio.");
        }
        return text.trim();
    }
}
