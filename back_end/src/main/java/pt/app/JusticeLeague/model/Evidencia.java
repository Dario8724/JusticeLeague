package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ev_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "den_id", nullable = false)
    private Denuncia denuncia;

    @Column(name = "ficheiro", nullable = false, length = 255)
    private String ficheiro;

    @Column(name = "tipo", length = 50)
    private String tipo;

    @Column(name = "descricao", length = 255)
    private String descricao;

    @Column(name = "data_upload", updatable = false)
    private LocalDateTime dataUpload;

    @PrePersist
    protected void onCreate() {
        if (this.dataUpload == null) {
            this.dataUpload = LocalDateTime.now();
        }
    }
}
