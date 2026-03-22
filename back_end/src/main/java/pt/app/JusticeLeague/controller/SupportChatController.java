package pt.app.JusticeLeague.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pt.app.JusticeLeague.dto.request.ChatMensagemRequest;
import pt.app.JusticeLeague.dto.response.SupportChatMensagemResponse;
import pt.app.JusticeLeague.service.SupportChatService;

@RestController
@RequestMapping("/api/chat-apoio")
public class SupportChatController {

    @Autowired
    private SupportChatService supportChatService;

    @PostMapping("/sessions")
    public ResponseEntity<Map<String, String>> criarSessao() {
        return ResponseEntity.ok(supportChatService.criarSessao());
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<SupportChatMensagemResponse>> listar(@PathVariable String sessionId) {
        return ResponseEntity.ok(supportChatService.listarMensagens(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<SupportChatMensagemResponse>> enviar(
            @PathVariable String sessionId,
            @Valid @RequestBody ChatMensagemRequest req) {
        return ResponseEntity.ok(supportChatService.enviarMensagem(sessionId, req));
    }
}
