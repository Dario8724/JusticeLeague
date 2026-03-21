package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "relatorio_psp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioPsp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rel_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "den_id", nullable = false)
    private Denuncia denuncia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "psp_id", nullable = false)
    private AgentePsp psp;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "acao_tomada", columnDefinition = "TEXT")
    private String acaoTomada;

    @Column(name = "data_registo", updatable = false)
    private LocalDateTime dataRegisto;

    @PrePersist
    protected void onCreate() {
        if (this.dataRegisto == null) {
            this.dataRegisto = LocalDateTime.now();
        }
    }
}
