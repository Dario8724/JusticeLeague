package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "not_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uti_id")
    private Utilizador utilizador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "den_id")
    private Denuncia denuncia;

    @Column(name = "mensagem", nullable = false, length = 255)
    private String mensagem;

    @Column(name = "tipo", length = 50)
    private String tipo;

    @Column(name = "lida")
    @Builder.Default
    private Boolean lida = false;

    @Column(name = "data_envio", updatable = false)
    private LocalDateTime dataEnvio;

    @PrePersist
    protected void onCreate() {
        if (this.dataEnvio == null) {
            this.dataEnvio = LocalDateTime.now();
        }
    }
}
