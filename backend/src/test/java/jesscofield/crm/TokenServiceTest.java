package jesscofield.crm;

import jesscofield.crm.domain.user.User;
import jesscofield.crm.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class TokenServiceTest {

    private TokenService tokenService;
    private User testUser;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();

        ReflectionTestUtils.setField(tokenService, "signingKey", "myTestSecretKeyForJWT1234567890");
        ReflectionTestUtils.setField(tokenService, "issuer", "test-issuer");

        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
    }

    @Test
    void createToken_ShouldReturnValidJwt() {
        String token = tokenService.createToken(testUser);

        assertNotNull(token);
        assertTrue(token.length() > 50);
    }

    @Test
    void getEmailFromToken_ShouldReturnCorrectEmail() {
        String token = tokenService.createToken(testUser);
        String email = tokenService.getEmailFromToken(token);

        assertEquals("test@example.com", email);
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        String token = tokenService.createToken(testUser);
        boolean isValid = tokenService.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        boolean isValid = tokenService.validateToken("invalid.token.here");

        assertFalse(isValid);
    }
}