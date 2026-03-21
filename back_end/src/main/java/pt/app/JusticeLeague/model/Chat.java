package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "den_id", nullable = false)
    private Denuncia denuncia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uti_id")
    private Utilizador utilizador;

    @Column(name = "mensagem", nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_envio", updatable = false)
    private LocalDateTime dataEnvio;

    @PrePersist
    protected void onCreate() {
        if (this.dataEnvio == null) {
            this.dataEnvio = LocalDateTime.now();
        }
    }
}
