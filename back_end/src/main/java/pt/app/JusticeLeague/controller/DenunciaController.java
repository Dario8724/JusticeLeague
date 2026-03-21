package pt.app.JusticeLeague.controller;

import jakarta.validation.Valid;
import pt.app.JusticeLeague.dto.request.AtualizarEstadoRequest;
import pt.app.JusticeLeague.dto.request.DenunciaRequest;
import pt.app.JusticeLeague.dto.request.FiltrosDenunciaRequest;
import pt.app.JusticeLeague.dto.response.DenunciaResponse;
import pt.app.JusticeLeague.dto.response.PageResponse;
import pt.app.JusticeLeague.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/denuncias")
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    // Criar denúncia (apenas cidadãos)
    @PostMapping
    @PreAuthorize("hasRole('UTILIZADOR')")
    public ResponseEntity<DenunciaResponse> criar(@Valid @RequestBody DenunciaRequest req) {
        return ResponseEntity.ok(denunciaService.criarDenuncia(req));
    }

    // Listar minhas denúncias (cidadão)
    @GetMapping("/minhas")
    @PreAuthorize("hasRole('UTILIZADOR')")
    public ResponseEntity<List<DenunciaResponse>> listarMinhas() {
        return ResponseEntity.ok(denunciaService.listarMinhas());
    }

    // Obter denúncia por ID (dono ou PSP)
    @GetMapping("/{id}")
    public ResponseEntity<DenunciaResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(denunciaService.getById(id));
    }

    // Listar denúncias com filtros (apenas PSP)
    @GetMapping
    @PreAuthorize("hasRole('PSP')")
    public ResponseEntity<PageResponse<DenunciaResponse>> listarComFiltros(FiltrosDenunciaRequest req) {
        return ResponseEntity.ok(denunciaService.listarComFiltros(req));
    }

    // Atualizar estado (apenas PSP)
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('PSP')")
    public ResponseEntity<DenunciaResponse> atualizarEstado(@PathVariable Long id, @Valid @RequestBody AtualizarEstadoRequest req) {
        return ResponseEntity.ok(denunciaService.atualizarEstado(id, req));
    }

    // Atribuir agente (apenas PSP)
    @PostMapping("/{id}/atribuir/{pspId}")
    @PreAuthorize("hasRole('PSP')")
    public ResponseEntity<DenunciaResponse> atribuirAgente(@PathVariable Long id, @PathVariable Long pspId) {
        return ResponseEntity.ok(denunciaService.atribuirAgente(id, pspId));
    }
}
