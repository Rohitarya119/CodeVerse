package com.codeverse.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthRedirectController {

    @GetMapping("/api/auth/oauth2/google")
    public ResponseEntity<Void> redirectToGoogle() {
        String url = "http://localhost:8081/oauth2/authorization/google?prompt=select_account";
        return ResponseEntity.status(302).header(HttpHeaders.LOCATION, url).build();
    }

    @GetMapping("/api/auth/oauth2/github")
    public ResponseEntity<Void> redirectToGithub(@RequestParam(value = "login", required = false) String login) {
        String base = "http://localhost:8081/oauth2/authorization/github";
        String url = base;
        if (StringUtils.hasText(login)) {
            url = base + "?login=" + login.trim();
        }
        return ResponseEntity.status(302).header(HttpHeaders.LOCATION, url).build();
    }
}


