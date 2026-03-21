package mvc.dto.request;

import lombok.*;
import mvc.model.Denuncia.EstadoDenuncia;
import mvc.model.Denuncia.GrauPerigo;

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
