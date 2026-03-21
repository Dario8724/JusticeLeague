package pt.app.JusticeLeague.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Nome obrigatório")
    @Size(min = 2, max = 100)
    private String nome;

    @NotBlank(message = "Email obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Password obrigatória")
    @Size(min = 8, message = "Password deve ter no mínimo 8 caracteres")
    private String password;

    private LocalDate dataNascimento;
    private String genero;

    @Pattern(regexp = "^[0-9+\\s]{9,20}$", message = "Telemóvel inválido")
    private String telemovel;
}
