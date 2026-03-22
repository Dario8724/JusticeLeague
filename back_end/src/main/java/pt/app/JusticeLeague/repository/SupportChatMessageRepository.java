package pt.app.JusticeLeague.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pt.app.JusticeLeague.model.SupportChatMessage;

public interface SupportChatMessageRepository extends JpaRepository<SupportChatMessage, Long> {
    List<SupportChatMessage> findBySessionIdOrderByDataEnvioAsc(String sessionId);
}
