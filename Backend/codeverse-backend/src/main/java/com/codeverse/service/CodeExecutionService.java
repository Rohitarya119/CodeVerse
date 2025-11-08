package com.codeverse.service;

import com.codeverse.dto.response.CodeExecutionResponse;
import org.springframework.stereotype.Service;

@Service
public class CodeExecutionService {

    public CodeExecutionResponse executeCode(String code) {
        CodeExecutionResponse response = new CodeExecutionResponse();
        
        try {
            // Simple placeholder implementation until GraalVM dependency is fixed
            response.setOutput("Code execution is temporarily disabled while we fix dependencies.");
            
            // For demonstration purposes, echo back the code that would be executed
            response.setOutput(response.getOutput() + "\n\nReceived code:\n" + code);
            
        } catch (Exception e) {
            response.setError("An unexpected error occurred: " + e.getMessage());
        }
        return response;
    }
}