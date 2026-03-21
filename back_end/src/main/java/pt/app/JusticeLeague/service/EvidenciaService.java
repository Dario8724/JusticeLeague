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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EvidenciaService {

    private final Path root = Paths.get("uploads");

    @Autowired
    private EvidenciaRepository evidenciaRepository;

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private AuthUtils authUtils;

    public void init() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar diretório de uploads.");
        }
    }

    @Transactional
    public EvidenciaResponse upload(Long denunciaId, MultipartFile file, String descricao) {
        Denuncia d = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        // Verificar se é o dono
        if (!d.getUtilizador().getId().equals(authUtils.getUtilizadorAtual().getId())) {
            throw new RuntimeException("Acesso negado.");
        }

        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            Evidencia ev = Evidencia.builder()
                    .denuncia(d)
                    .ficheiro(filename)
                    .tipo(file.getContentType())
                    .descricao(descricao)
                    .dataUpload(LocalDateTime.now())
                    .build();

            ev = evidenciaRepository.save(ev);
            return EvidenciaResponse.from(ev);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao guardar ficheiro: " + e.getMessage());
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
}
