package com.clientcore.crm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CrmDataController {

    @GetMapping("/dashboard/overview")
    public Map<String, Object> dashboardOverview() {
        return Map.of(
                "kpis", List.of(
                        Map.of("title", "Total Revenue", "value", "$2.84M", "change", "+18.4%"),
                        Map.of("title", "Active Deals", "value", "142", "change", "+9.2%"),
                        Map.of("title", "Win Rate", "value", "68.9%", "change", "+3.1%"),
                        Map.of("title", "Forecast", "value", "$1.12M", "change", "+12.5%")
                ),
                "aiInsights", List.of(
                        "Enterprise segment is trending +26% QoQ.",
                        "Renewal risk detected in 3 strategic accounts.",
                        "Best conversion window: Tue–Thu, 10:00–13:00."
                ),
                "notifications", List.of(
                        Map.of("type", "deal", "message", "Acme Global moved to Contract Review"),
                        Map.of("type", "task", "message", "Quarterly forecasting report due today"),
                        Map.of("type", "meeting", "message", "Board pipeline sync starts in 20 minutes")
                )
        );
    }

    @GetMapping("/clients")
    public List<Map<String, Object>> clients() {
        return List.of(
                Map.of("name", "Acme Global", "segment", "Enterprise", "score", 94, "status", "Active", "mrr", 128000),
                Map.of("name", "Northwind Labs", "segment", "Scale-up", "score", 86, "status", "At Risk", "mrr", 42000),
                Map.of("name", "Helio Agency", "segment", "Agency", "score", 91, "status", "Active", "mrr", 59000)
        );
    }

    @GetMapping("/deals")
    public Map<String, Object> deals() {
        return Map.of(
                "pipeline", Map.of(
                        "lead", 14,
                        "qualified", 20,
                        "proposal", 16,
                        "negotiation", 9,
                        "closedWon", 25
                ),
                "forecast", 1120000
        );
    }

    @GetMapping("/team")
    public List<Map<String, Object>> team() {
        return List.of(
                Map.of("name", "Sofia Martinez", "role", "VP Sales", "quotaAttainment", 121, "region", "NA"),
                Map.of("name", "Ethan Brown", "role", "Account Executive", "quotaAttainment", 108, "region", "EMEA"),
                Map.of("name", "Maya Chen", "role", "Customer Success Lead", "quotaAttainment", 114, "region", "APAC")
        );
    }
}
