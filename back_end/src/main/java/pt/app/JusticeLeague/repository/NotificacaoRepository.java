package pt.app.JusticeLeague.repository;

import pt.app.JusticeLeague.model.Notificacao;
import pt.app.JusticeLeague.model.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    // Todas as notificações de um utilizador, mais recentes primeiro
    List<Notificacao> findByUtilizadorOrderByDataEnvioDesc(Utilizador utilizador);

    // Apenas não lidas — para o badge do sino
    List<Notificacao> findByUtilizadorAndLidaFalse(Utilizador utilizador);

    // Contar não lidas — para o contador no navbar
    long countByUtilizadorAndLidaFalse(Utilizador utilizador);

    // Marcar todas como lidas de uma vez
    @Modifying
    @Transactional
    @Query("UPDATE Notificacao n SET n.lida = true WHERE n.utilizador = :utilizador")
    void marcarTodasComoLidas(@Param("utilizador") Utilizador utilizador);
}
