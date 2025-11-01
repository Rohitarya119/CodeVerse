package com.codeverse.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String username; // Frontend sends username or email here

    @NotBlank
    private String password;
}