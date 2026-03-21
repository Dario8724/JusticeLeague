package pt.app.JusticeLeague.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import pt.app.JusticeLeague.model.Denuncia.EstadoDenuncia;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtualizarEstadoRequest {

    @NotNull(message = "Estado obrigatório")
    private EstadoDenuncia estado;

    private String observacao; // nota interna do agente PSP
}
