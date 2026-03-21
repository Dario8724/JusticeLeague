package pt.app.JusticeLeague.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioPspRequest {

    @NotBlank(message = "Descrição obrigatória")
    private String descricao;

    @NotBlank(message = "Ação tomada obrigatória")
    private String acaoTomada;
}
