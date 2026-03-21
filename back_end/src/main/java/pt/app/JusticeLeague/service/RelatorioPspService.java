package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.request.RelatorioPspRequest;
import pt.app.JusticeLeague.model.AgentePsp;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.RelatorioPsp;
import pt.app.JusticeLeague.model.Utilizador;
import pt.app.JusticeLeague.repository.AgentePspRepository;
import pt.app.JusticeLeague.repository.DenunciaRepository;
import pt.app.JusticeLeague.repository.RelatorioPspRepository;
import pt.app.JusticeLeague.security.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RelatorioPspService {

    @Autowired
    private RelatorioPspRepository relatorioPspRepository;

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private AgentePspRepository agentePspRepository;

    @Autowired
    private AuthUtils authUtils;

    @Transactional
    public void criarRelatorio(Long denunciaId, RelatorioPspRequest req) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        AgentePsp psp = agentePspRepository.findByUtilizador(quemPediu)
                .orElseThrow(() -> new RuntimeException("Agente PSP não encontrado."));

        if (relatorioPspRepository.existsByDenuncia(d)) {
            throw new RuntimeException("Denúncia já possui um relatório.");
        }

        RelatorioPsp r = RelatorioPsp.builder()
                .denuncia(d)
                .psp(psp)
                .descricao(req.getDescricao())
                .acaoTomada(req.getAcaoTomada())
                .dataRegisto(LocalDateTime.now())
                .build();

        relatorioPspRepository.save(r);
        
        // Mudar estado para RESOLVIDO ao criar relatório final
        d.setEstado(Denuncia.EstadoDenuncia.RESOLVIDO);
        denunciaRepository.save(d);
    }
}
