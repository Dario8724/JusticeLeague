package pt.app.JusticeLeague.security;

import pt.app.JusticeLeague.model.Utilizador;
import pt.app.JusticeLeague.repository.UtilizadorRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Sem token — deixa passar (o SecurityConfig decide se a rota é pública)
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"erro\": \"Token inválido ou expirado.\"}");
            return;
        }

        String email  = jwtUtil.extractEmail(token);
        String tipo   = jwtUtil.extractTipo(token);

        Utilizador utilizador = utilizadorRepository.findByEmail(email)
                .orElse(null);

        if (utilizador == null || !Boolean.TRUE.equals(utilizador.getEstado())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"erro\": \"Utilizador inativo ou não encontrado.\"}");
            return;
        }

        // Atribuir role ao Spring Security  (ROLE_UTILIZADOR ou ROLE_PSP)
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + tipo)
        );

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(utilizador, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);
        chain.doFilter(request, response);
    }
}
