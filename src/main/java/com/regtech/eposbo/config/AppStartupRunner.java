package com.regtech.eposbo.config;

import com.regtech.eposbo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AppStartupRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findById(1L).isEmpty()) { // Check for user with ID 1
            System.out.println("No user with ID 1 found. Please access /setup URL to create the initial admin user.");
        } else {
            System.out.println("User with ID 1 found.");
        }
    }
}