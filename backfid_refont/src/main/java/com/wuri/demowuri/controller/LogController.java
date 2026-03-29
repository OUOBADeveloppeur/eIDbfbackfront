package com.wuri.demowuri.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wuri.demowuri.services.LogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @GetMapping("current")
    public ResponseEntity<List<String>> getCurrentLog() {
        String currentLogFilePath = "logs/demowuri.log";
        List<String> logs = logService.readCurrentLogFile(currentLogFilePath);
        return ResponseEntity.ok(logs);

    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<String>> getLogByDate(@PathVariable String date) {
        List<String> logs = logService.readLogFileByDate("logs", date);

        if (logs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of("Aucun log trouvé pour cette date"));
        }
        return ResponseEntity.ok(logs);
    }

}
