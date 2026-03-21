package pt.app.JusticeLeague.security;

import pt.app.JusticeLeague.model.Utilizador;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtils {

    // Chama-se nos Services para saber quem fez o pedido
    public Utilizador getUtilizadorAtual() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Utilizador) {
            return (Utilizador) principal;
        }
        return null;
    }

    public boolean isPsp() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PSP"));
    }

    public boolean isUtilizador() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_UTILIZADOR"));
    }
}
