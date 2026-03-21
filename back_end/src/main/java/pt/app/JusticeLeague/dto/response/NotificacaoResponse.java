package pt.app.JusticeLeague.dto.response;

import lombok.*;
import pt.app.JusticeLeague.model.Notificacao;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificacaoResponse {

    private Long id;
    private String mensagem;
    private String tipo;
    private boolean lida;
    private LocalDateTime dataEnvio;
    private Long denunciaId;    // para redirecionar ao clicar

    public static NotificacaoResponse from(Notificacao n) {
        NotificacaoResponse r = new NotificacaoResponse();
        r.setId(n.getId());
        r.setMensagem(n.getMensagem());
        r.setTipo(n.getTipo());
        r.setLida(Boolean.TRUE.equals(n.getLida()));
        r.setDataEnvio(n.getDataEnvio());
        r.setDenunciaId(n.getDenuncia() != null ? n.getDenuncia().getId() : null);
        return r;
    }
}
