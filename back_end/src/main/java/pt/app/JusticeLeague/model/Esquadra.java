package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "esquadra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Esquadra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "esq_id")
    private Long id;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "distrito", length = 100)
    private String distrito;

    @Column(name = "concelho", length = 100)
    private String concelho;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "contacto", length = 20)
    private String contacto;

    @Column(name = "especializada_ciber")
    @Builder.Default
    private Boolean especializadaCiber = true;



    @OneToMany(mappedBy = "esquadra", fetch = FetchType.LAZY)
    private List<AgentePsp> agentes;

    @OneToMany(mappedBy = "esquadra", fetch = FetchType.LAZY)
    private List<Denuncia> denuncias;
}
