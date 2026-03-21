package pt.app.JusticeLeague.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import pt.app.JusticeLeague.model.Denuncia.GrauPerigo;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DenunciaRequest {

    @NotNull(message = "Tipo de denúncia obrigatório")
    private Long tipoId;

    @NotBlank(message = "Descrição obrigatória")
    @Size(min = 20, message = "Descrição deve ter no mínimo 20 caracteres")
    private String descricao;

    private LocalDateTime dataOcorrencia;

    @NotNull(message = "Grau de perigo obrigatório")
    private GrauPerigo grauPerigo;

    @Builder.Default
    private Boolean anonimato = false;

    // Localização (opcional)
    private Double latitude;
    private Double longitude;
    private String endereco;
    private String distrito;
    private String concelho;

    private Long esquadraId; // esquadra preferida (opcional)
}
