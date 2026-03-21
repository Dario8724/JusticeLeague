package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "agente_psp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentePsp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "psp_id")
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uti_id", nullable = false)
    private Utilizador utilizador;

    @Column(name = "codigo_acesso", nullable = false, length = 255)
    private String codigoAcesso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "esquadra_id")
    private Esquadra esquadra;



    @OneToMany(mappedBy = "pspResponsavel", fetch = FetchType.LAZY)
    private List<Denuncia> denunciasAtribuidas;

    @OneToMany(mappedBy = "psp", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RelatorioPsp> relatorios;
}
