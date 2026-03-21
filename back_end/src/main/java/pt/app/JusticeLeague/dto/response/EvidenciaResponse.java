package pt.app.JusticeLeague.dto.response;

import lombok.*;
import pt.app.JusticeLeague.model.Evidencia;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaResponse {

    private Long id;
    private String ficheiro;     // URL ou path para download
    private String tipo;
    private String descricao;
    private LocalDateTime dataUpload;

    public static EvidenciaResponse from(Evidencia e) {
        EvidenciaResponse r = new EvidenciaResponse();
        r.setId(e.getId());
        r.setFicheiro("/api/evidencias/download/" + e.getId());
        r.setTipo(e.getTipo());
        r.setDescricao(e.getDescricao());
        r.setDataUpload(e.getDataUpload());
        return r;
    }
}
