package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Long> {

    // Todas as evidências de uma denúncia
    List<Evidencia> findByDenunciaOrderByDataUploadDesc(Denuncia denuncia);

    // Por tipo de ficheiro (imagem, vídeo, documento)
    List<Evidencia> findByDenunciaAndTipo(Denuncia denuncia, String tipo);

    // Eliminar todas as evidências de uma denúncia (cascade manual se necessário)
    void deleteByDenuncia(Denuncia denuncia);
}
