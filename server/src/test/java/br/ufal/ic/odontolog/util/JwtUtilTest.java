package br.ufal.ic.odontolog.util;

import br.ufal.ic.odontolog.config.JwtProperties;
import br.ufal.ic.odontolog.utils.JwtUtil;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private static JwtUtil newUtil(String secret, String issuer, long expSeconds) {
        var props = new JwtProperties();
        props.setSecret(secret);
        props.setIssuer(issuer);
        props.setExpirationSeconds(expSeconds);
        return new JwtUtil(props);
    }

    @Test
    @DisplayName("Gera e valida token com subject e roles")
    void generateAndVerify() {
        var jwtUtil = newUtil("test-secret", "odontolog-test", 600);

        String token = jwtUtil.generateToken("user@test.com", List.of("ROLE_USER", "ROLE_ADMIN"));
        assertThat(token).isNotBlank();

        DecodedJWT jwt = jwtUtil.verify(token);
        assertThat(jwt.getSubject()).isEqualTo("user@test.com");
        assertThat(jwt.getClaim("roles").asList(String.class))
                .containsExactlyInAnyOrder("ROLE_USER", "ROLE_ADMIN");
        assertThat(jwt.getIssuer()).isEqualTo("odontolog-test");
        assertThat(jwt.getExpiresAt()).isNotNull();
        assertThat(jwt.getIssuedAt()).isNotNull();
        assertThat(jwt.getAlgorithm()).isEqualTo("HS256"); // cabeçalho alg esperado
    }

    @Test
    @DisplayName("Helpers getUsername/getRoles retornam claims corretas")
    void helpersReturnExpected() {
        var jwtUtil = newUtil("secret-helpers", "issuer-helpers", 300);
        String token = jwtUtil.generateToken("helpers@test.com", List.of("ROLE_USER"));
        DecodedJWT jwt = jwtUtil.verify(token);

        assertThat(jwtUtil.getUsername(jwt)).isEqualTo("helpers@test.com");
        assertThat(jwtUtil.getRoles(jwt)).containsExactly("ROLE_USER");
    }

    @Test
    @DisplayName("Falha ao verificar com password errado")
    void verifyFailsWithWrongSecret() {
        var utilA = newUtil("secret-A", "same-issuer", 300);
        var utilB = newUtil("secret-B", "same-issuer", 300); // segredo diferente

        String token = utilA.generateToken("user@test.com", List.of("ROLE_USER"));

        assertThatThrownBy(() -> utilB.verify(token))
                .isInstanceOf(JWTVerificationException.class);
    }

    @Test
    @DisplayName("Falha ao verificar com issuer diferente")
    void verifyFailsWithWrongIssuer() {
        var utilIssuer1 = newUtil("same-secret", "issuer-1", 300);
        var utilIssuer2 = newUtil("same-secret", "issuer-2", 300);

        String token = utilIssuer1.generateToken("user@test.com", List.of("ROLE_USER"));

        assertThatThrownBy(() -> utilIssuer2.verify(token))
                .isInstanceOf(JWTVerificationException.class);
    }

    @Test
    @DisplayName("Token expirado deve lançar TokenExpiredException")
    void expiredTokenShouldFail() {
        var jwtUtil = newUtil("exp-secret", "exp-issuer", -1);
        String token = jwtUtil.generateToken("user@test.com", List.of("ROLE_USER"));

        assertThatThrownBy(() -> jwtUtil.verify(token))
                .isInstanceOf(TokenExpiredException.class);
    }

    @Test
    @DisplayName("Token malformado deve falhar na verificação")
    void malformedTokenShouldFail() {
        var jwtUtil = newUtil("any-secret", "any-issuer", 300);

        assertThatThrownBy(() -> jwtUtil.verify("not-a-jwt"))
                .isInstanceOf(JWTVerificationException.class);
    }

    @Test
    @DisplayName("Token adulterado (assinatura inválida) deve falhar")
    void tamperedTokenShouldFail() {
        var jwtUtil = newUtil("sig-secret", "sig-issuer", 300);
        String token = jwtUtil.generateToken("user@test.com", List.of("ROLE_USER"));


        String tampered = token.substring(0, token.length() - 2) + "xx";

        assertThatThrownBy(() -> jwtUtil.verify(tampered))
                .isInstanceOf(JWTVerificationException.class);
    }

    @Test
    @DisplayName("Roles vazias geram claim vazia")
    void emptyRolesAreAllowed() {
        var jwtUtil = newUtil("empty-roles", "issuer", 300);
        String token = jwtUtil.generateToken("user@test.com", List.of());
        DecodedJWT jwt = jwtUtil.verify(token);

        var roles = jwt.getClaim("roles").asList(String.class);
        assertThat(roles).isNotNull();
        assertThat(roles).isEmpty();
    }
}
