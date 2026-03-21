package pt.app.JusticeLeague.controller;

import pt.app.JusticeLeague.dto.response.EvidenciaResponse;
import pt.app.JusticeLeague.service.EvidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import pt.app.JusticeLeague.model.Evidencia;

import java.util.List;

@RestController
@RequestMapping("/api/evidencias")
public class EvidenciaController {

    @Autowired
    private EvidenciaService evidenciaService;

    @PostMapping("/upload/{denunciaId}")
    @PreAuthorize("hasRole('UTILIZADOR')")
    public ResponseEntity<EvidenciaResponse> upload(
            @PathVariable Long denunciaId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String descricao) {
        return ResponseEntity.ok(evidenciaService.upload(denunciaId, file, descricao));
    }

    @GetMapping("/denuncia/{denunciaId}")
    public ResponseEntity<List<EvidenciaResponse>> listar(@PathVariable Long denunciaId) {
        return ResponseEntity.ok(evidenciaService.listarPorDenuncia(denunciaId));
    }

    @GetMapping("/download/{evidenciaId}")
    public ResponseEntity<byte[]> download(@PathVariable Long evidenciaId) {
        Evidencia ev = evidenciaService.getById(evidenciaId);
        byte[] bytes = ev.getConteudo() != null ? ev.getConteudo() : new byte[0];
        String contentType = (ev.getTipo() != null && !ev.getTipo().trim().isEmpty()) ? ev.getTipo() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        String filename = (ev.getFicheiro() != null && !ev.getFicheiro().trim().isEmpty()) ? ev.getFicheiro() : ("evidencia-" + evidenciaId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename.replace("\"", "") + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(bytes.length)
                .body(bytes);
    }
}
