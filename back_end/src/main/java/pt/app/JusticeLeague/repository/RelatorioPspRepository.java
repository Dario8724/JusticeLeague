package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.AgentePsp;
import pt.app.JusticeLeague.model.Denuncia;
import pt.app.JusticeLeague.model.RelatorioPsp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelatorioPspRepository extends JpaRepository<RelatorioPsp, Long> {

    // Relatórios de uma denúncia específica
    List<RelatorioPsp> findByDenunciaOrderByDataRegistoDesc(Denuncia denuncia);

    // Relatórios feitos por um agente
    List<RelatorioPsp> findByPspOrderByDataRegistoDesc(AgentePsp psp);

    // Verificar se uma denúncia já tem relatório
    boolean existsByDenuncia(Denuncia denuncia);

    // Histórico completo de um agente com paginação
    Page<RelatorioPsp> findByPsp(AgentePsp psp, Pageable pageable);
}
