package com.regtech.eposbo.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/locale")
public class LocaleController {

    @PostMapping("/set")
    public ResponseEntity<String> setLocale(@RequestParam String locale, HttpServletResponse response) {
        Cookie localeCookie = new Cookie("systemLanguage", locale);
        localeCookie.setMaxAge(365 * 24 * 60 * 60); // Cookie expires in 1 year
        localeCookie.setPath("/"); // Make the cookie available across the application
        response.addCookie(localeCookie);
        return new ResponseEntity<>("Locale set successfully", HttpStatus.OK);
    }
}