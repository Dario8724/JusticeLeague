package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.TipoDenuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoDenunciaRepository extends JpaRepository<TipoDenuncia, Long> {
}
