import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { validateOpenAIConfig } from "./config/openai";
import { validateOCRConfig } from "./config/ocr";

// Validate security configuration on startup
const validateSecurityConfig = () => {
  const errors: string[] = [];
  
  if (!validateOpenAIConfig()) {
    errors.push('OpenAI configuration is invalid');
  }
  
  if (!validateOCRConfig()) {
    errors.push('OCR configuration is invalid');
  }
  
  if (errors.length > 0) {
    console.error('Security configuration errors:', errors);
    // In production, you might want to show a user-friendly error
    if (import.meta.env.PROD) {
      console.error('Application cannot start due to configuration errors');
    }
  }
};

// Run validation
validateSecurityConfig();

createRoot(document.getElementById("root")!).render(<App />);
