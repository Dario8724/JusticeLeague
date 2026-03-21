package pt.app.JusticeLeague.service;

import pt.app.JusticeLeague.dto.request.LoginRequest;
import pt.app.JusticeLeague.dto.request.RegisterRequest;
import pt.app.JusticeLeague.dto.response.AuthResponse;
import pt.app.JusticeLeague.model.Utilizador;
import pt.app.JusticeLeague.model.Utilizador.TipoUtilizador;
import pt.app.JusticeLeague.repository.UtilizadorRepository;
import pt.app.JusticeLeague.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (utilizadorRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email já está em uso.");
        }

        Utilizador u = Utilizador.builder()
                .nome(req.getNome())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .dataNascimento(req.getDataNascimento())
                .genero(req.getGenero())
                .telemovel(req.getTelemovel())
                .tipo(TipoUtilizador.UTILIZADOR)
                .estado(true)
                .verificado(false)
                .build();

        u = utilizadorRepository.save(u);

        try {
            emailService.sendWelcomeEmail(u.getEmail(), u.getNome());
        } catch (Exception ignored) {
        }

        String token = jwtUtil.generateToken(u.getEmail(), u.getTipo().name(), u.getId());

        return new AuthResponse(
                token,
                u.getTipo().name(),
                u.getNome(),
                u.getEmail(),
                u.getVerificado(),
                u.getId()
        );
    }

    public AuthResponse login(LoginRequest req) {
        Utilizador u = utilizadorRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas."));

        if (!passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            throw new RuntimeException("Credenciais inválidas.");
        }

        if (!Boolean.TRUE.equals(u.getEstado())) {
            throw new RuntimeException("Conta desativada. Contacte o suporte.");
        }

        String token = jwtUtil.generateToken(u.getEmail(), u.getTipo().name(), u.getId());

        return new AuthResponse(
                token,
                u.getTipo().name(),
                u.getNome(),
                u.getEmail(),
                u.getVerificado(),
                u.getId()
        );
    }

    // Login específico para PSP pode ter lógica extra se necessário
    public AuthResponse loginPsp(LoginRequest req) {
        AuthResponse res = login(req);
        if (!"PSP".equals(res.getTipo())) {
            throw new RuntimeException("Acesso restrito a agentes PSP.");
        }
        return res;
    }
}
