package pt.app.JusticeLeague.controller;

import pt.app.JusticeLeague.dto.response.EvidenciaResponse;
import pt.app.JusticeLeague.service.EvidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}
