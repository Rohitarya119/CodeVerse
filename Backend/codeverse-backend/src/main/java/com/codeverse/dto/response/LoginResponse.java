package com.codeverse.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;

    public LoginResponse(String accessToken, UserDto user) {
        this.token = accessToken;
        this.user = user;
    }
}