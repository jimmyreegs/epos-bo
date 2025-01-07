package com.regtech.eposbo.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class WebController {

    private final Set<String> availableLocales;

    public WebController(@Value("${app.available-locales}") String locales) {
        this.availableLocales = Arrays.stream(locales.split(","))
                .map(String::trim)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private String getSystemLanguage(HttpServletRequest request) {
        if (request.getCookies() != null) {
            Optional<Cookie> localeCookie = Arrays.stream(request.getCookies())
                    .filter(c -> "systemLanguage".equals(c.getName()))
                    .findFirst();
            if (localeCookie.isPresent()) {
                String locale = localeCookie.get().getValue();
                if (availableLocales.contains(locale)) {
                    return locale;
                }
            }
        }
        return "en"; // Default locale if no cookie or invalid locale
    }

    @PostMapping("/setLocale")
    public String setLocale(@RequestParam String locale, HttpServletResponse response, Model model, HttpServletRequest request) {
        if (availableLocales.contains(locale)) {
            Cookie localeCookie = new Cookie("systemLanguage", locale);
            localeCookie.setMaxAge(365 * 24 * 60 * 60); // 1 year
            localeCookie.setPath("/"); // Make cookie available across the application
            response.addCookie(localeCookie);
        }
        String systemLanguage = getSystemLanguage(request);
        model.addAttribute("systemLanguage", systemLanguage);
        model.addAttribute("availableLocales", availableLocales);
        model.addAttribute("content", "home-content");
        return "home";
    }

    @GetMapping("/home")
    public String home(Model model, HttpServletRequest request) {
        String systemLanguage = getSystemLanguage(request);
        model.addAttribute("systemLanguage", systemLanguage);
        model.addAttribute("availableLocales", availableLocales);
        model.addAttribute("content", "home-content");
        return "home";
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("content", "index-content");
        return "index";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("content", "login-content");
        return "login";
    }
}