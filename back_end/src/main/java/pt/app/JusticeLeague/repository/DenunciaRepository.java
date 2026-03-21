package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.AgentePsp;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.Esquadra;
import pt.app.JusticeLeague.model.Utilizador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {

    // Listar denúncias de um utilizador (painel do cidadão)
    List<Denuncia> findByUtilizadorOrderByDataRegistoDesc(Utilizador utilizador);

    // Listar por estado — para o painel PSP
    List<Denuncia> findByEstadoOrderByDataRegistoDesc(Denuncia.EstadoDenuncia estado);

    // Listar por esquadra atribuída
    List<Denuncia> findByEsquadraOrderByDataRegistoDesc(Esquadra esquadra);

    // Listar por agente responsável
    List<Denuncia> findByPspResponsavel(AgentePsp agente);

    // Denúncias sem agente atribuído (fila de espera PSP)
    List<Denuncia> findByPspResponsavelIsNullAndEstado(Denuncia.EstadoDenuncia estado);

    // Filtrar por grau de perigo
    List<Denuncia> findByGrauPerigoOrderByDataRegistoDesc(Denuncia.GrauPerigo grau);

    // Painel PSP — filtro combinado com paginação
    @Query(""" 
        SELECT d FROM Denuncia d 
        WHERE (:estado IS NULL OR d.estado = :estado) 
          AND (:grau   IS NULL OR d.grauPerigo = :grau) 
          AND (:esquadraId IS NULL OR d.esquadra.id = :esquadraId) 
        ORDER BY d.dataRegisto DESC 
    """)
    Page<Denuncia> findByFiltros(
        @Param("estado")     Denuncia.EstadoDenuncia estado,
        @Param("grau")       Denuncia.GrauPerigo grau,
        @Param("esquadraId") Long esquadraId,
        Pageable pageable
    );

    // Estatísticas — contagem por estado
    @Query("SELECT d.estado, COUNT(d) FROM Denuncia d GROUP BY d.estado")
    List<Object[]> countByEstado();

    // Denúncias recentes nas últimas 24h (alertas urgentes)
    @Query("SELECT d FROM Denuncia d WHERE d.dataRegisto >= :desde AND d.grauPerigo = 'ALTO'")
    List<Denuncia> findUrgentesDesde(@Param("desde") LocalDateTime desde);
}
