package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.request.ChatMensagemRequest;
import pt.app.JusticeLeague.dto.response.ChatMensagemResponse;
import pt.app.JusticeLeague.model.Chat;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.Utilizador;
import pt.app.JusticeLeague.repository.ChatRepository;
import pt.app.JusticeLeague.repository.DenunciaRepository;
import pt.app.JusticeLeague.security.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private AuthUtils authUtils;

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

    public List<ChatMensagemResponse> listarMensagens(Long denunciaId) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        // Verificar acesso
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        boolean isOwner = d.getUtilizador() != null && d.getUtilizador().getId().equals(quemPediu.getId());
        boolean isPsp = authUtils.isPsp();

        if (!isOwner && !isPsp) {
            throw new RuntimeException("Acesso negado.");
        }

        return chatRepository.findByDenunciaOrderByDataEnvioAsc(d)
                .stream()
                .map(ChatMensagemResponse::from)
                .collect(Collectors.toList());
    }
}
