package com.codeverse.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
public class AppErrorController implements ErrorController {

    @RequestMapping("/error")
    public RedirectView handleError(HttpServletRequest request) {
        Object statusObj = request.getAttribute("jakarta.servlet.error.status_code");
        int status = statusObj instanceof Integer ? (Integer) statusObj : 500;
        String message = "Unexpected error";
        Object msg = request.getAttribute("jakarta.servlet.error.message");
        if (msg != null) {
            message = String.valueOf(msg);
        } else if (status == HttpStatus.UNAUTHORIZED.value()) {
            message = "Unauthorized";
        } else if (status == HttpStatus.FORBIDDEN.value()) {
            message = "Forbidden";
        }
        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return new RedirectView("http://localhost:5173/login?error=" + encoded);
    }
}


