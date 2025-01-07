package com.regtech.eposbo.controller;

import com.regtech.eposbo.model.Role;
import com.regtech.eposbo.model.User;
import com.regtech.eposbo.repository.RoleRepository;
import com.regtech.eposbo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
public class SetupController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/setup")
    public String setupForm(Model model) {
        if (userRepository.findById(1L).isPresent()) { // Check for user with ID 1
            return "redirect:/login";
        }
        model.addAttribute("user", new User());
        return "setup";
    }

    @PostMapping("/setup")
    public String createAdminUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        if (userRepository.findById(1L).isPresent()) { // Prevent creating multiple initial users
            return "redirect:/login";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);

        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN");
        if (adminRole.isEmpty()){
            Role role = new Role();
            role.setName("ROLE_ADMIN");
            roleRepository.save(role);
            adminRole = roleRepository.findByName("ROLE_ADMIN");
        }
        user.setRoles(List.of(adminRole.get()));
        userRepository.save(user);

        redirectAttributes.addFlashAttribute("message", "Admin user created successfully. Please login.");
        return "redirect:/login";
    }
}