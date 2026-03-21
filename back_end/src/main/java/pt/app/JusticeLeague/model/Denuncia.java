package pt.app.JusticeLeague.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "denuncia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Denuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "den_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uti_id")
    private Utilizador utilizador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_id", nullable = false)
    private TipoDenuncia tipo;

    @Column(name = "descricao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_ocorrencia")
    private LocalDateTime dataOcorrencia;

    @Column(name = "data_registo", updatable = false)
    private LocalDateTime dataRegisto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('PENDENTE','EM_ANALISE','RESOLVIDO') DEFAULT 'PENDENTE'")
    @Builder.Default
    private EstadoDenuncia estado = EstadoDenuncia.PENDENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "grau_perigo", columnDefinition = "ENUM('BAIXO','MEDIO','ALTO')")
    private GrauPerigo grauPerigo;

    @Column(name = "anonimato")
    @Builder.Default
    private Boolean anonimato = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loc_id")
    private Localizacao localizacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "esquadra_id")
    private Esquadra esquadra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "psp_responsavel_id")
    private AgentePsp pspResponsavel;



    @OneToMany(mappedBy = "denuncia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evidencia> evidencias;

    @OneToMany(mappedBy = "denuncia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Chat> mensagensChat;

    @OneToMany(mappedBy = "denuncia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notificacao> notificacoes;

    @OneToOne(mappedBy = "denuncia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private RelatorioPsp relatorioPsp;



    public enum EstadoDenuncia {
        PENDENTE, EM_ANALISE, RESOLVIDO
    }

    public enum GrauPerigo {
        BAIXO, MEDIO, ALTO
    }



    @PrePersist
    protected void onCreate() {
        if (this.dataRegisto == null) {
            this.dataRegisto = LocalDateTime.now();
        }
    }
}
