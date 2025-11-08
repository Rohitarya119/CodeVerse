package com.codeverse.security.oauth2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if (!"github".equalsIgnoreCase(registrationId)) {
            return oAuth2User;
        }

        Map<String, Object> attributes = new LinkedHashMap<>(oAuth2User.getAttributes());

        Object emailObj = attributes.get("email");
        String email = emailObj != null ? String.valueOf(emailObj) : null;

        if (email == null || email.isBlank()) {
            try {
                String primaryEmail = fetchGithubPrimaryEmail(userRequest.getAccessToken().getTokenValue());
                if (primaryEmail != null && !primaryEmail.isBlank()) {
                    attributes.put("email", primaryEmail);
                }
            } catch (Exception ex) {
                logger.warn("Failed to fetch primary email from GitHub API", ex);
            }
        }

        // Ensure there is a sensible name fallback
        Object nameObj = attributes.get("name");
        if (nameObj == null || String.valueOf(nameObj).isBlank()) {
            Object login = attributes.get("login");
            if (login != null) {
                attributes.put("name", String.valueOf(login));
            }
        }

        // Preserve authorities and name attribute key coming from the client registration
        String nameAttributeKey = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        if (nameAttributeKey == null || nameAttributeKey.isBlank()) {
            nameAttributeKey = "id"; // sensible default for GitHub
        }

        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, nameAttributeKey);
    }

    private String fetchGithubPrimaryEmail(String accessToken) {
        String url = "https://api.github.com/user/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "token " + accessToken);
        headers.set("Accept", "application/vnd.github+json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(url, HttpMethod.GET, entity, (Class<List<Map<String, Object>>>) (Class<?>) List.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            return null;
        }

        // Each element is a map: {email: string, primary: boolean, verified: boolean, visibility: string|null}
        List<Map<String, Object>> emails = response.getBody();
        String fallback = null;
        for (Map<String, Object> item : emails) {
            Object emailObj = item.get("email");
            if (emailObj == null) continue;
            String e = String.valueOf(emailObj);
            if (Boolean.TRUE.equals(item.get("primary")) && Boolean.TRUE.equals(item.get("verified"))) {
                return e;
            }
            if (fallback == null && Boolean.TRUE.equals(item.get("verified"))) {
                fallback = e;
            }
        }
        return fallback;
    }
}


