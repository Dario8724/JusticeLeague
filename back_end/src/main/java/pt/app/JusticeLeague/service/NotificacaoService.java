package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.response.NotificacaoResponse;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.Notificacao;
import pt.app.JusticeLeague.model.Utilizador;
import pt.app.JusticeLeague.repository.NotificacaoRepository;
import pt.app.JusticeLeague.security.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private AuthUtils authUtils;

    @Transactional
    public void criarNotificacao(Utilizador u, Denuncia d, String msg, String tipo) {
        if (u == null) return; // se anónimo não envia notif
        
        Notificacao n = Notificacao.builder()
                .utilizador(u)
                .denuncia(d)
                .mensagem(msg)
                .tipo(tipo)
                .lida(false)
                .dataEnvio(LocalDateTime.now())
                .build();

        notificacaoRepository.save(n);
    }

    public List<NotificacaoResponse> listarMinhas() {
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        return notificacaoRepository.findByUtilizadorOrderByDataEnvioDesc(quemPediu)
                .stream()
                .map(NotificacaoResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void marcarComoLida(Long id) {
        Notificacao n = notificacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada."));
        
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        if (!n.getUtilizador().getId().equals(quemPediu.getId())) {
            throw new RuntimeException("Acesso negado.");
        }

        n.setLida(true);
        notificacaoRepository.save(n);
    }

    @Transactional
    public void marcarTodasLidas() {
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        notificacaoRepository.marcarTodasComoLidas(quemPediu);
    }
}
