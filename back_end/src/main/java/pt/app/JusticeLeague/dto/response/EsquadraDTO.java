package pt.app.JusticeLeague.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EsquadraDTO {
    private Long id;
    private String nome;
    private String distrito;
    private String concelho;
    private Double latitude;
    private Double longitude;
    private String contacto;
    private Boolean especializadaCiber;
}
