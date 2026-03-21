package pt.app.JusticeLeague.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "Email obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Password obrigatória")
    private String password;
}
