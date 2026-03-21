package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.response.EvidenciaResponse;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.Evidencia;
import pt.app.JusticeLeague.repository.DenunciaRepository;
import pt.app.JusticeLeague.repository.EvidenciaRepository;
import pt.app.JusticeLeague.security.AuthUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvidenciaService {

    @Autowired
    private EvidenciaRepository evidenciaRepository;

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private AuthUtils authUtils;

    @Transactional
    public EvidenciaResponse upload(Long denunciaId, MultipartFile file, String descricao) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        // Verificar se é o dono
        if (d.getUtilizador() == null || authUtils.getUtilizadorAtual() == null || !d.getUtilizador().getId().equals(authUtils.getUtilizadorAtual().getId())) {
            throw new RuntimeException("Acesso negado.");
        }

        try {
            String originalName = file.getOriginalFilename();
            Evidencia ev = Evidencia.builder()
                    .denuncia(d)
                    .ficheiro(originalName != null && !originalName.trim().isEmpty() ? originalName : "upload")
                    .tipo(file.getContentType())
                    .tamanho(file.getSize())
                    .conteudo(file.getBytes())
                    .descricao(descricao)
                    .dataUpload(LocalDateTime.now())
                    .build();

            ev = evidenciaRepository.save(ev);
            return EvidenciaResponse.from(ev);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao guardar ficheiro (BD): " + e.getMessage());
        }
    }

    public List<EvidenciaResponse> listarPorDenuncia(Long denunciaId) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        return evidenciaRepository.findByDenunciaOrderByDataUploadDesc(d)
                .stream()
                .map(EvidenciaResponse::from)
                .collect(Collectors.toList());
    }

    public Evidencia getById(Long evidenciaId) {
        Evidencia ev = evidenciaRepository.findById(evidenciaId)
                .orElseThrow(() -> new RuntimeException("Evidência não encontrada."));

        if (authUtils.isPsp()) return ev;

        if (authUtils.isUtilizador()) {
            if (ev.getDenuncia() != null && ev.getDenuncia().getUtilizador() != null && authUtils.getUtilizadorAtual() != null) {
                if (ev.getDenuncia().getUtilizador().getId().equals(authUtils.getUtilizadorAtual().getId())) return ev;
            }
        }

        throw new RuntimeException("Acesso negado.");
    }
}
