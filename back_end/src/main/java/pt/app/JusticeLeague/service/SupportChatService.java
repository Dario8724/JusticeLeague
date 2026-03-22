package pt.app.JusticeLeague.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pt.app.JusticeLeague.dto.request.ChatMensagemRequest;
import pt.app.JusticeLeague.dto.response.SupportChatMensagemResponse;
import pt.app.JusticeLeague.model.SupportChatMessage;
import pt.app.JusticeLeague.repository.SupportChatMessageRepository;

@Service
public class SupportChatService {

    @Autowired
    private SupportChatMessageRepository supportChatMessageRepository;

    public Map<String, String> criarSessao() {
        Map<String, String> res = new HashMap<>();
        res.put("sessionId", UUID.randomUUID().toString());
        return res;
    }

    public List<SupportChatMensagemResponse> listarMensagens(String sessionId) {
        return supportChatMessageRepository.findBySessionIdOrderByDataEnvioAsc(sessionId)
                .stream()
                .map(SupportChatMensagemResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SupportChatMensagemResponse> enviarMensagem(String sessionId, ChatMensagemRequest req) {
        SupportChatMessage userMsg = SupportChatMessage.builder()
                .sessionId(sessionId)
                .remetente("UTILIZADOR")
                .mensagem(req.getMensagem())
                .build();
        userMsg = supportChatMessageRepository.save(userMsg);

        SupportChatMessage apoioMsg = SupportChatMessage.builder()
                .sessionId(sessionId)
                .remetente("APOIO")
                .mensagem("Mensagem recebida. Se houver perigo imediato, liga 112. Caso contrário, descreve o que aconteceu e em que plataforma.")
                .build();
        apoioMsg = supportChatMessageRepository.save(apoioMsg);

        return List.of(
                SupportChatMensagemResponse.from(userMsg),
                SupportChatMensagemResponse.from(apoioMsg)
        );
    }
}
