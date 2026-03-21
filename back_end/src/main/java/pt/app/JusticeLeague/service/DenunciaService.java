package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.request.AtualizarEstadoRequest;
import pt.app.JusticeLeague.dto.request.DenunciaRequest;
import pt.app.JusticeLeague.dto.request.FiltrosDenunciaRequest;
import pt.app.JusticeLeague.dto.response.DenunciaResponse;
import pt.app.JusticeLeague.dto.response.PageResponse;
import pt.app.JusticeLeague.model.*;
import pt.app.JusticeLeague.repository.*;
import pt.app.JusticeLeague.security.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DenunciaService {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private TipoDenunciaRepository tipoDenunciaRepository;

    @Autowired
    private LocalizacaoRepository localizacaoRepository;

    @Autowired
    private EsquadraRepository esquadraRepository;

    @Autowired
    private AgentePspRepository agentePspRepository;

    @Autowired
    private AuthUtils authUtils;

    @Autowired
    private EmailService emailService;

    @Transactional
    public DenunciaResponse criarDenuncia(DenunciaRequest req) {
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        if (quemPediu == null) {
            throw new RuntimeException("Utilizador não autenticado.");
        }

        TipoDenuncia tipo = tipoDenunciaRepository.findById(req.getTipoId())
                .orElseThrow(() -> new RuntimeException("Tipo de denúncia inválido."));

        Localizacao loc = null;
        if (req.getLatitude() != null && req.getLongitude() != null) {
            loc = Localizacao.builder()
                    .latitude(req.getLatitude())
                    .longitude(req.getLongitude())
                    .endereco(req.getEndereco())
                    .distrito(req.getDistrito())
                    .concelho(req.getConcelho())
                    .build();
            loc = localizacaoRepository.save(loc);
        }

        Esquadra esquadra = null;
        if (req.getEsquadraId() != null) {
            esquadra = esquadraRepository.findById(req.getEsquadraId())
                    .orElse(null);
        }

        Denuncia d = Denuncia.builder()
                .utilizador(Boolean.TRUE.equals(req.getAnonimato()) ? null : quemPediu)
                .tipo(tipo)
                .descricao(req.getDescricao())
                .dataOcorrencia(req.getDataOcorrencia())
                .dataRegisto(LocalDateTime.now())
                .estado(Denuncia.EstadoDenuncia.PENDENTE)
                .grauPerigo(req.getGrauPerigo())
                .anonimato(req.getAnonimato())
                .localizacao(loc)
                .esquadra(esquadra)
                .build();

        d = denunciaRepository.save(d);
        return DenunciaResponse.from(d);
    }

    public List<DenunciaResponse> listarMinhas() {
        Utilizador quemPediu = authUtils.getUtilizadorAtual();
        return denunciaRepository.findByUtilizadorOrderByDataRegistoDesc(quemPediu)
                .stream()
                .map(DenunciaResponse::from)
                .collect(Collectors.toList());
    }

    public DenunciaResponse getById(Long id) {
        Denuncia d = denunciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        Utilizador quemPediu = authUtils.getUtilizadorAtual();

        // Verificar se é o dono ou PSP
        boolean isOwner = d.getUtilizador() != null && d.getUtilizador().getId().equals(quemPediu.getId());
        boolean isPsp = authUtils.isPsp();

        if (!isOwner && !isPsp) {
            throw new RuntimeException("Acesso negado.");
        }

        return DenunciaResponse.from(d);
    }

    public PageResponse<DenunciaResponse> listarComFiltros(FiltrosDenunciaRequest req) {
        Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), Sort.by(req.getSort()).descending());

        Page<Denuncia> page = denunciaRepository.findByFiltros(
                req.getEstado(),
                req.getGrauPerigo(),
                req.getEsquadraId(),
                pageable
        );

        return PageResponse.from(page.map(DenunciaResponse::from));
    }

    @Transactional
    public DenunciaResponse atualizarEstado(Long id, AtualizarEstadoRequest req) {
        Denuncia d = denunciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        d.setEstado(req.getEstado());
        
        // Notificar utilizador por email se não for anónimo
        if (d.getUtilizador() != null) {
            emailService.sendDenunciaUpdateEmail(d.getUtilizador().getEmail(), d.getId(), d.getEstado().name());
        }
        
        d = denunciaRepository.save(d);
        return DenunciaResponse.from(d);
    }

    @Transactional
    public DenunciaResponse atribuirAgente(Long denunciaId, Long pspId) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        AgentePsp psp = agentePspRepository.findById(pspId)
                .orElseThrow(() -> new RuntimeException("Agente PSP não encontrado."));

        d.setPspResponsavel(psp);
        d.setEstado(Denuncia.EstadoDenuncia.EM_ANALISE);

        d = denunciaRepository.save(d);
        return DenunciaResponse.from(d);
    }
}
