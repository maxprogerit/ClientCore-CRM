package com.clientcore.crm.controller;

import com.clientcore.crm.security.JwtService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/public/auth")
public class AuthController {
    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        List<String> roles = switch (request.email()) {
            case "admin@clientcore.ai" -> List.of("ROLE_ADMIN", "ROLE_MANAGER");
            case "manager@clientcore.ai" -> List.of("ROLE_MANAGER");
            default -> List.of("ROLE_USER");
        };
        String token = jwtService.issueToken(request.email(), roles);
        return Map.of(
                "token", token,
                "roles", roles,
                "workspace", "ClientCore Enterprise"
        );
    }

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
}
