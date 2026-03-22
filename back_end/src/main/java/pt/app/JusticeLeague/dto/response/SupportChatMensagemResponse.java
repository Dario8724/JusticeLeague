package pt.app.JusticeLeague.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pt.app.JusticeLeague.model.SupportChatMessage;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportChatMensagemResponse {

    private Long id;
    private String mensagem;
    private LocalDateTime dataEnvio;
    private String remetente;

    public static SupportChatMensagemResponse from(SupportChatMessage m) {
        SupportChatMensagemResponse r = new SupportChatMensagemResponse();
        r.setId(m.getId());
        r.setMensagem(m.getMensagem());
        r.setDataEnvio(m.getDataEnvio());
        r.setRemetente(m.getRemetente());
        return r;
    }
}
