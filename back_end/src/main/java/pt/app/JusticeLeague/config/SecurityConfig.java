package pt.app.JusticeLeague.config;

import java.util.Arrays;

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
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import pt.app.JusticeLeague.security.JwtFilter;

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
                // Rotas públicas (sem token)
                .requestMatchers("/", "/index.html", "/favicon.ico").permitAll()
                .requestMatchers("/pages/**", "/js/**", "/css/**", "/images/**").permitAll()
                .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/login/psp", "/api/auth/verify").permitAll()
                .requestMatchers("/api/chat-apoio/**").permitAll()
                .requestMatchers("/api/recursos/**").permitAll()
                .requestMatchers("/api/tipos-denuncia/**").permitAll()
                .requestMatchers("/api/esquadras/**").permitAll()
                .requestMatchers("/api/evidencias/download/**").hasAnyRole("UTILIZADOR", "PSP")
                //  Cidadão autenticado
                .requestMatchers("/api/auth/me").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers(HttpMethod.POST, "/api/denuncias").hasRole("UTILIZADOR")
                .requestMatchers(HttpMethod.GET, "/api/denuncias/minhas").hasRole("UTILIZADOR")
                .requestMatchers(HttpMethod.GET, "/api/denuncias/{id}").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers(HttpMethod.POST, "/api/evidencias/upload/**").hasRole("UTILIZADOR")
                .requestMatchers(HttpMethod.GET, "/api/chat/**").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers(HttpMethod.POST, "/api/chat/**").hasAnyRole("UTILIZADOR", "PSP")
                .requestMatchers("/api/notificacoes/**").hasAnyRole("UTILIZADOR", "PSP")
                // Apenas PSP
                .requestMatchers("/api/psp/**").hasRole("PSP")
                .requestMatchers(HttpMethod.PATCH, "/api/denuncias/**").hasRole("PSP")
                .requestMatchers(HttpMethod.GET, "/api/denuncias").hasRole("PSP")
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
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                registry.addRedirectViewController("/", "/pages/index.html");
                registry.addRedirectViewController("/index.html", "/pages/index.html");
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry
                        .addResourceHandler("/pages/**")
                        .addResourceLocations("file:../front_end/src/pages/")
                        .setCachePeriod(0);
                registry
                        .addResourceHandler("/js/**")
                        .addResourceLocations("file:../front_end/src/js/")
                        .setCachePeriod(0);
                registry
                        .addResourceHandler("/css/**")
                        .addResourceLocations("file:../front_end/src/css/")
                        .setCachePeriod(0);
                registry
                        .addResourceHandler("/images/**")
                        .addResourceLocations("file:../front_end/src/images/")
                        .setCachePeriod(0);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfig() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://safenet.pt"
        ));

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
