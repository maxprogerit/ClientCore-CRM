package com.clientcore.crm.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/public/realtime")
public class RealtimeController {

    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of("state", "connected", "timestamp", Instant.now().toString());
    }

    @MessageMapping("/updates")
    @SendTo("/topic/updates")
    public Map<String, String> updates(String message) {
        return Map.of("message", message, "timestamp", Instant.now().toString());
    }
}
