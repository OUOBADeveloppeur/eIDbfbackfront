
package com.wuri.demowuri.services;


import java.util.List;

public interface LogService {

   List<String> readLogFileByDate(String logDirectory,String date);
   List<String> readCurrentLogFile(String logFilePath);
}


