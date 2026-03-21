package pt.app.JusticeLeague.dto.response;

import lombok.*;
import pt.app.JusticeLeague.model.Denuncia;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DenunciaResponse {

    private Long id;
    private Long tipoId;
    private String tipoNome;
    private String descricao;
    private LocalDateTime dataOcorrencia;
    private LocalDateTime dataRegisto;
    private String estado;
    private String grauPerigo;
    private Boolean anonimato;

    // Dados do utilizador — null se anónimo
    private String utilizadorNome;
    private String utilizadorEmail;

    // Localização
    private String endereco;
    private String distrito;
    private String concelho;
    private Double latitude;
    private Double longitude;

    // Esquadra atribuída
    private String esquadraNome;
    private Long esquadraId;

    // Agente responsável
    private String pspNome;
    private Long pspId;

    // Contagens
    private int totalEvidencias;
    private int totalMensagens;

    // Mapper estático — converte entidade → DTO
    public static DenunciaResponse from(Denuncia d) {
        DenunciaResponse r = new DenunciaResponse();
        r.setId(d.getId());
        if (d.getTipo() != null) {
            r.setTipoId(d.getTipo().getId());
            r.setTipoNome(d.getTipo().getNome());
        }
        r.setDescricao(d.getDescricao());
        r.setDataOcorrencia(d.getDataOcorrencia());
        r.setDataRegisto(d.getDataRegisto());
        r.setEstado(d.getEstado().name());
        r.setGrauPerigo(d.getGrauPerigo() != null ? d.getGrauPerigo().name() : null);
        r.setAnonimato(d.getAnonimato());

        // Só expõe dados do utilizador se não for anónimo
        if (!Boolean.TRUE.equals(d.getAnonimato()) && d.getUtilizador() != null) {
            r.setUtilizadorNome(d.getUtilizador().getNome());
            r.setUtilizadorEmail(d.getUtilizador().getEmail());
        }

        if (d.getLocalizacao() != null) {
            r.setEndereco(d.getLocalizacao().getEndereco());
            r.setDistrito(d.getLocalizacao().getDistrito());
            r.setConcelho(d.getLocalizacao().getConcelho());
            r.setLatitude(d.getLocalizacao().getLatitude());
            r.setLongitude(d.getLocalizacao().getLongitude());
        }

        if (d.getEsquadra() != null) {
            r.setEsquadraNome(d.getEsquadra().getNome());
            r.setEsquadraId(d.getEsquadra().getId());
        }

        if (d.getPspResponsavel() != null) {
            r.setPspNome(d.getPspResponsavel().getUtilizador().getNome());
            r.setPspId(d.getPspResponsavel().getId());
        }

        r.setTotalEvidencias(d.getEvidencias() != null ? d.getEvidencias().size() : 0);
        r.setTotalMensagens(d.getMensagensChat() != null ? d.getMensagensChat().size() : 0);

        return r;
    }
}
