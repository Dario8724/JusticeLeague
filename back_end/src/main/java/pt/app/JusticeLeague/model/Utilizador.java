package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "utilizador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilizador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uti_id")
    private Long id;

    @Column(name = "nome", length = 100)
    private String nome;

    @Column(name = "email", length = 150, unique = true)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "genero", length = 10)
    private String genero;

    @Column(name = "telemovel", length = 20)
    private String telemovel;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", columnDefinition = "ENUM('UTILIZADOR','PSP') DEFAULT 'UTILIZADOR'")
    @Builder.Default
    private TipoUtilizador tipo = TipoUtilizador.UTILIZADOR;

    @Column(name = "estado")
    @Builder.Default
    private Boolean estado = true;

    @Column(name = "verificado")
    @Builder.Default
    private Boolean verificado = false;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;


    @OneToOne(mappedBy = "utilizador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AgentePsp agentePsp;

    @OneToMany(mappedBy = "utilizador", fetch = FetchType.LAZY)
    private List<Denuncia> denuncias;

    @OneToMany(mappedBy = "utilizador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notificacao> notificacoes;

    @OneToMany(mappedBy = "utilizador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Chat> mensagens;



    public enum TipoUtilizador {
        UTILIZADOR, PSP
    }


    @PrePersist
    protected void onCreate() {
        if (this.criadoEm == null) {
            this.criadoEm = LocalDateTime.now();
        }
    }
}
