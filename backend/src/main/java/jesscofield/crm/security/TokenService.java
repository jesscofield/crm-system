package jesscofield.crm.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jesscofield.crm.domain.user.User;
import java.util.Date;

@Service
public class TokenService {

    @Value("${jwt.signing.key}")
    private String signingKey;

    @Value("${jwt.issuer}")
    private String issuer;

    public String createToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("username", user.getFullName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(SignatureAlgorithm.HS512, signingKey)
                .setIssuer(issuer)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(signingKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}