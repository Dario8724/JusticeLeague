package pt.app.JusticeLeague.controller;

import pt.app.JusticeLeague.dto.response.NotificacaoResponse;
import pt.app.JusticeLeague.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listarMinhas() {
        return ResponseEntity.ok(notificacaoService.listarMinhas());
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarLida(@PathVariable Long id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/marcar-todas")
    public ResponseEntity<Void> marcarTodasLidas() {
        notificacaoService.marcarTodasLidas();
        return ResponseEntity.noContent().build();
    }
}
