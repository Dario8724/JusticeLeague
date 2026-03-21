package pt.app.JusticeLeague.controller;

import jakarta.validation.Valid;
import pt.app.JusticeLeague.dto.request.RelatorioPspRequest;
import pt.app.JusticeLeague.service.RelatorioPspService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
@PreAuthorize("hasRole('PSP')")
public class RelatorioPspController {

    @Autowired
    private RelatorioPspService relatorioPspService;

    @PostMapping("/{denunciaId}")
    public ResponseEntity<Void> criar(@PathVariable Long denunciaId, @Valid @RequestBody RelatorioPspRequest req) {
        relatorioPspService.criarRelatorio(denunciaId, req);
        return ResponseEntity.ok().build();
    }
}
