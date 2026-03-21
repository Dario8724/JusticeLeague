package pt.app.JusticeLeague.dto.request;

import lombok.*;
import pt.app.JusticeLeague.model.Denuncia.EstadoDenuncia;
import pt.app.JusticeLeague.model.Denuncia.GrauPerigo;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FiltrosDenunciaRequest {

    private EstadoDenuncia estado;
    private GrauPerigo grauPerigo;
    private Long esquadraId;
    
    @Builder.Default
    private int page = 0;
    
    @Builder.Default
    private int size = 20;
    
    @Builder.Default
    private String sort = "dataRegisto";
}
