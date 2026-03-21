package pt.app.JusticeLeague.config;

import pt.app.JusticeLeague.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfig()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ---- Rotas públicas (sem token) ----
                .requestMatchers("/api/auth/register").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/login/psp").permitAll()
                .requestMatchers("/api/auth/verify").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/recursos/**").permitAll()

                // ---- Cidadão autenticado ----
                .requestMatchers("/api/auth/me").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers(HttpMethod.POST, "/api/denuncias").hasRole("UTILIZADOR")
                .requestMatchers(HttpMethod.GET,  "/api/denuncias/minhas").hasRole("UTILIZADOR")
                .requestMatchers(HttpMethod.GET,  "/api/denuncias/{id}").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers(HttpMethod.POST, "/api/evidencias/upload/**").hasRole("UTILIZADOR")
                .requestMatchers(HttpMethod.GET,  "/api/chat/**").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers(HttpMethod.POST, "/api/chat/**").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers("/api/notificacoes/**").hasAnyRole("UTILIZADOR", "PSP")

                // ---- Apenas PSP ----
                .requestMatchers("/api/psp/**").hasRole("PSP")
                .requestMatchers(HttpMethod.PATCH, "/api/denuncias/**").hasRole("PSP")
                .requestMatchers(HttpMethod.GET,   "/api/denuncias").hasRole("PSP")
                .requestMatchers("/api/relatorios/**").hasRole("PSP")

                // Qualquer outra rota requer autenticação
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfig() {
        CorsConfiguration config = new CorsConfiguration();

        // Em produção, substituir pelo domínio real do frontend SafeNet
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://safenet.pt"
        ));

        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
