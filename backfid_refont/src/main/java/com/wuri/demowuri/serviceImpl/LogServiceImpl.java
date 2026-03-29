package com.wuri.demowuri.serviceImpl;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.wuri.demowuri.services.LogService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class LogServiceImpl implements LogService {


      @Override
    public List<String> readCurrentLogFile(String logFilePath){
      
        List<String> logLines =new ArrayList<>();

        try(BufferedReader reader =new BufferedReader(new FileReader (logFilePath))){
            String line;
            while ((line=reader.readLine())!=null){
                logLines.add(line);
            }
        }catch (IOException e){
            e.printStackTrace();
        }
        return logLines;

    }

    @Override
    public List<String> readLogFileByDate(String logDirectory,String date){
        List<String> logLines=new ArrayList<>();
        String fileName= "demowuri."+date+".log";
        Path logPath=Paths.get(logDirectory, fileName);
        if(!Files.exists(logPath)){
            System.err.println("Fichier de log introuvable : "+logPath);
            return logLines;
        }
        try (BufferedReader reader =new BufferedReader(new FileReader(logPath.toFile()))){
            String line;
            while ((line=reader.readLine())!=null){
                logLines.add(line);
            }
        }catch (IOException e){
            e.printStackTrace();
        }
        return logLines;

    }
    
}
