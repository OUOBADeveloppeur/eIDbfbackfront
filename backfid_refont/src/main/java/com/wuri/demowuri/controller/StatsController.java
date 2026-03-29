package com.wuri.demowuri.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wuri.demowuri.dto.StatsDto;
import com.wuri.demowuri.serviceImpl.StatsServiceImpl;

@RestController
@RequestMapping("/api/v1/stats")
public class StatsController {

    private final StatsServiceImpl statsService;

    public StatsController(StatsServiceImpl statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/counts")
    public StatsDto getCounts() {
        return new StatsDto(
            statsService.countPersonnes(),
            statsService.countUsers(),
            statsService.countAutorites(),
            statsService.countEservices()
        );
    }
}

