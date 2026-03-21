package pt.app.JusticeLeague.controller;

import jakarta.validation.Valid;
import pt.app.JusticeLeague.dto.request.LoginRequest;
import pt.app.JusticeLeague.dto.request.RegisterRequest;
import pt.app.JusticeLeague.dto.response.AuthResponse;
import pt.app.JusticeLeague.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/login/psp")
    public ResponseEntity<AuthResponse> loginPsp(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.loginPsp(req));
    }
}
