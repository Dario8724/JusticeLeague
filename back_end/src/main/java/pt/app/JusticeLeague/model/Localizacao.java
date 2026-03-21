package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "localizacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loc_id")
    private Long id;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "endereco", length = 255)
    private String endereco;

    @Column(name = "distrito", length = 100)
    private String distrito;

    @Column(name = "concelho", length = 100)
    private String concelho;

    @OneToMany(mappedBy = "localizacao", fetch = FetchType.LAZY)
    private List<Denuncia> denuncias;
}
