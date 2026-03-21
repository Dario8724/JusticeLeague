package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilizadorRepository extends JpaRepository<Utilizador, Long> {

    Optional<Utilizador> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Utilizador> findByEstadoTrue();
    List<Utilizador> findByTipo(Utilizador.TipoUtilizador tipo);

    @Query("SELECT u FROM Utilizador u WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%',:nome,'%'))")
    List<Utilizador> findByNomeContaining(String nome);
}
