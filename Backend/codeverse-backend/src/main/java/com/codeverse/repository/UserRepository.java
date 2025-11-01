package com.codeverse.repository;

import com.codeverse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used by UserDetailsService
    Optional<User> findByUsername(String username);

    // Used by AuthController for login (as requested by frontend)
    Optional<User> findByUsernameOrEmail(String username, String email);

    // Used by AuthController for registration
    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}