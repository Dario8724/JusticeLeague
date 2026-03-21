package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.AgentePsp;
import pt.app.JusticeLeague.model.Esquadra;
import pt.app.JusticeLeague.model.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentePspRepository extends JpaRepository<AgentePsp, Long> {

    Optional<AgentePsp> findByUtilizador(Utilizador utilizador);
    boolean existsByUtilizador(Utilizador utilizador);
    List<AgentePsp> findByEsquadra(Esquadra esquadra);
    List<AgentePsp> findByEsquadraIsNull();

    @Query(""" 
        SELECT a FROM AgentePsp a 
        JOIN a.denunciasAtribuidas d 
        WHERE d.estado = 'PENDENTE' 
    """)
    List<AgentePsp> findAgentesComPendentes();
}
