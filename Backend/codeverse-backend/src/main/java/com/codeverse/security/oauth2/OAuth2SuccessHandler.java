package com.codeverse.security.oauth2;

import com.codeverse.entity.User;
import com.codeverse.repository.UserRepository;
import com.codeverse.security.jwt.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2SuccessHandler.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${FRONTEND_BASE_URL:http://localhost:5173}")
    private String frontendBaseUrl;

    @Autowired
    public OAuth2SuccessHandler(JwtTokenProvider jwtTokenProvider, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String getFrontendUrl() {
        return frontendBaseUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = null;
        if (authentication instanceof OAuth2AuthenticationToken token) {
            registrationId = token.getAuthorizedClientRegistrationId();
        }
        String extractedEmail = null;
        String extractedName = null;
        try {
            if (registrationId != null) {
                logger.info("OAuth2 login via provider: {}", registrationId);
            }
            extractedEmail = oAuth2User.getAttribute("email");
            extractedName = oAuth2User.getAttribute("name");
            if (extractedName == null || extractedName.isBlank()) {
                String given = oAuth2User.getAttribute("given_name");
                String family = oAuth2User.getAttribute("family_name");
                String combined = ((given != null ? given : "").trim() + " " + (family != null ? family : "").trim()).trim();
                if (!combined.isBlank()) {
                    extractedName = combined;
                }
            }
        } catch (Exception ignored) {
        }

        if (extractedEmail == null || extractedEmail.isEmpty()) {
            String frontendUrl = getFrontendUrl();
            String msg = URLEncoder.encode("Email not provided by OAuth2 provider", StandardCharsets.UTF_8);
            response.sendRedirect(frontendUrl + "/login?error=" + msg);
            return;
        }

        final String email = extractedEmail;
        final String name = extractedName;

        try {
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        String safeUsername;
                        try {
                            safeUsername = generateValidUniqueUsername(name, email);
                        } catch (Exception ex) {
                            safeUsername = "user_" + System.currentTimeMillis();
                        }
                        newUser.setUsername(safeUsername);
                        newUser.setFullName(name != null ? name : "");
                        newUser.setPassword(passwordEncoder.encode("OAUTH2_USER"));
                        newUser.setSkillLevel("Beginner"); // Default skill level
                        User savedUser = userRepository.save(newUser);
                        logger.info("New user created via OAuth2: {}", savedUser.getUsername());
                        return savedUser;
                    });

            String token = jwtTokenProvider.generateToken(user.getEmail());

            String frontendUrl = getFrontendUrl();
            if (token != null && !token.isEmpty()) {
                // Redirect to frontend OAuth callback with token
                response.sendRedirect(frontendUrl + "/oauth-callback?token=" + token);
            } else {
                String msg = URLEncoder.encode("Token generation failed", StandardCharsets.UTF_8);
                response.sendRedirect(frontendUrl + "/login?error=" + msg);
            }
        } catch (Exception e) {
            logger.error("OAuth2 sign-in failed", e);
            String frontendUrl = getFrontendUrl();
            String msg = URLEncoder.encode("OAuth2 sign-in failed", StandardCharsets.UTF_8);
            response.sendRedirect(frontendUrl + "/login?error=" + msg);
        }
    }

    private String generateValidUniqueUsername(String name, String email) {
        String base = (name != null && !name.isBlank()) ? name : email.split("@")[0];
        String cleaned = base
                .trim()
                .replaceAll("\\s+", "_")
                .replaceAll("[^A-Za-z0-9_]", "");
        if (cleaned.length() < 3) {
            cleaned = "user_" + System.currentTimeMillis();
        }
        if (cleaned.length() > 20) {
            cleaned = cleaned.substring(0, 20);
        }

        String candidate = cleaned;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            String basePart = cleaned.length() > 16 ? cleaned.substring(0, 16) : cleaned;
            candidate = basePart + (suffix++);
            if (candidate.length() > 20) {
                candidate = candidate.substring(0, 20);
            }
        }
        return candidate;
    }
}