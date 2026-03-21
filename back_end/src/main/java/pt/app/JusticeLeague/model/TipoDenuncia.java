package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "tipo_denuncia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoDenuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tipo_id")
    private Long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "descricao", length = 255)
    private String descricao;

    @OneToMany(mappedBy = "tipo", fetch = FetchType.LAZY)
    private List<Denuncia> denuncias;
}
