package br.ufal.ic.odontolog.utils;

import br.ufal.ic.odontolog.config.JwtProperties;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.time.Instant;
import java.util.Date;
import java.util.List;


public class JwtUtil {
    private final Algorithm algorithm;
    private final String issuer;
    private final long expirationSeconds;

    public JwtUtil(JwtProperties props) {
        this.algorithm = Algorithm.HMAC256(props.getSecret());
        this.issuer = props.getIssuer();
        this.expirationSeconds = props.getExpirationSeconds();
    }

    public String generateToken(String username, List<String> roles) {
        Instant now = Instant.now();
        return JWT.create()
                .withIssuer(issuer)
                .withSubject(username)
                .withClaim("roles", roles)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plusSeconds(expirationSeconds)))
                .sign(algorithm);
    }

    public DecodedJWT verify(String token) {
        return JWT.require(algorithm)
                .withIssuer(issuer)
                .build()
                .verify(token);
    }

    public String getUsername(DecodedJWT jwt) {
        return jwt.getSubject();
    }

    public List<String> getRoles(DecodedJWT jwt) {
        return jwt.getClaim("roles").asList(String.class);
    }
}