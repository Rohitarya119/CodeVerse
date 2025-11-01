package com.codeverse.controller;

import com.codeverse.dto.request.LoginRequest;
import com.codeverse.dto.request.RegisterRequest;
import com.codeverse.dto.response.ApiResponse;
import com.codeverse.dto.response.LoginResponse;
import com.codeverse.dto.response.UserDto;
import com.codeverse.entity.User;
import com.codeverse.repository.UserRepository;
import com.codeverse.security.jwt.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        // Get User details from the authentication principal
        User userDetails = (User) authentication.getPrincipal();

        // We must fetch the user again to get all details, or cast safely
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        // Create the response DTOs
        UserDto userDto = new UserDto(user);

        // This matches the { token, user } structure in LoginPage.jsx
        return ResponseEntity.ok(new LoginResponse(jwt, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName(),
                registerRequest.getSkillLevel()
        );

        userRepository.save(user);

        // This matches the { success: true } check in RegisterPage.jsx
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully!"));
    }
}