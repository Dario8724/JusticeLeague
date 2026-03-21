package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.Chat;
import pt.app.JusticeLeague.model.Denuncia;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Histórico de mensagens de uma denúncia, ordenado por data
    List<Chat> findByDenunciaOrderByDataEnvioAsc(Denuncia denuncia);

    // Contar mensagens não lidas (mensagens do PSP para o utilizador)
    @Query(""" 
        SELECT COUNT(c) FROM Chat c 
        WHERE c.denuncia = :denuncia 
          AND c.utilizador IS NULL 
    """)
    long countMensagensPsp(@Param("denuncia") Denuncia denuncia);

    // Últimas N mensagens de uma denúncia
    @Query(""" 
        SELECT c FROM Chat c 
        WHERE c.denuncia = :denuncia 
        ORDER BY c.dataEnvio DESC 
    """)
    List<Chat> findUltimasMensagens(@Param("denuncia") Denuncia denuncia, Pageable pageable);
}
