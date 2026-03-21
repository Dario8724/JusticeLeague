package pt.app.JusticeLeague.dto.response;

import lombok.*;
import pt.app.JusticeLeague.model.Chat;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMensagemResponse {

    private Long id;
    private String mensagem;
    private LocalDateTime dataEnvio;
    private String remetente;   // "UTILIZADOR" ou "PSP"
    private String nomeRemetente;

    public static ChatMensagemResponse from(Chat c) {
        ChatMensagemResponse r = new ChatMensagemResponse();
        r.setId(c.getId());
        r.setMensagem(c.getMensagem());
        r.setDataEnvio(c.getDataEnvio());

        if (c.getUtilizador() != null) {
            r.setRemetente("UTILIZADOR");
            r.setNomeRemetente(c.getUtilizador().getNome());
        } else {
            r.setRemetente("PSP");
            r.setNomeRemetente("Agente PSP");
        }
        return r;
    }
}
