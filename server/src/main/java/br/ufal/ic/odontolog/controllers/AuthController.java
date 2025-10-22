package br.ufal.ic.odontolog.controllers;

import br.ufal.ic.odontolog.dtos.ChangePasswordRequestDTO;
import br.ufal.ic.odontolog.dtos.LoginRequest;
import br.ufal.ic.odontolog.dtos.LoginResponse;
import br.ufal.ic.odontolog.dtos.UserResponseDTO;
import br.ufal.ic.odontolog.mappers.UserMapper;
import br.ufal.ic.odontolog.models.User;
import br.ufal.ic.odontolog.services.UserService;
import br.ufal.ic.odontolog.utils.JwtUtil;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authManager;
  private final JwtUtil jwtUtil;
  private final UserMapper userMapper;
  private final UserService userService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    Authentication authentication =
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

    UserDetails principal = (UserDetails) authentication.getPrincipal();
    List<String> roles =
        principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

    String token = jwtUtil.generateToken(principal.getUsername(), roles);
    return ResponseEntity.ok(new LoginResponse(token));
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponseDTO> me(@AuthenticationPrincipal User user) {
    if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    user.setPassword(null); // extra defensivo
    return ResponseEntity.ok(userMapper.toResponseDTO(user));
  }

  @PostMapping("/change-password")
  @PreAuthorize("hasAnyRole('STUDENT', 'SUPERVISOR')")
  public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDTO req) {
    userService.changePassword(req);
    return ResponseEntity.noContent().build();
  }
}
