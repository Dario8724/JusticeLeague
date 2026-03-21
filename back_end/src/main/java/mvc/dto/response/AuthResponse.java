package mvc.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tipo;        // "UTILIZADOR" ou "PSP"
    private String nome;
    private String email;
    private boolean verificado;
    private Long utilizadorId;
}
