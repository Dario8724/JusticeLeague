package pt.app.JusticeLeague.controller;

import jakarta.validation.Valid;
import pt.app.JusticeLeague.dto.request.ChatMensagemRequest;
import pt.app.JusticeLeague.dto.response.ChatMensagemResponse;
import pt.app.JusticeLeague.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/{denunciaId}")
    public ResponseEntity<ChatMensagemResponse> enviar(@PathVariable Long denunciaId, @Valid @RequestBody ChatMensagemRequest req) {
        return ResponseEntity.ok(chatService.enviarMensagem(denunciaId, req));
    }

    @GetMapping("/{denunciaId}")
    public ResponseEntity<List<ChatMensagemResponse>> listar(@PathVariable Long denunciaId) {
        return ResponseEntity.ok(chatService.listarMensagens(denunciaId));
    }
}
