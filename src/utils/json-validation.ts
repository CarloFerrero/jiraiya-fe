export const validateJsonSchema = (schema: string): { isValid: boolean; error?: string } => {
  try {
    // Basic JSON validation
    const parsed = JSON.parse(schema);
    
    // Check if it's a valid JSON Schema
    if (typeof parsed !== 'object' || parsed === null) {
      return { isValid: false, error: 'Schema must be a JSON object' };
    }
    
    // Check for required JSON Schema properties
    if (!parsed.type && !parsed.properties && !parsed.$schema) {
      return { isValid: false, error: 'Invalid JSON Schema: missing type, properties, or $schema' };
    }
    
    return { isValid: true };
  } catch (e) {
    return { 
      isValid: false, 
      error: e instanceof Error ? e.message : 'Invalid JSON format' 
    };
  }
};

export const validateJsonAgainstSchema = (json: string, schema: string): { isValid: boolean; error?: string } => {
  try {
    const jsonData = JSON.parse(json);
    const schemaData = JSON.parse(schema);
    
    // Basic validation - in a real app you'd use a proper JSON Schema validator like Ajv
    // For now, we'll do basic structure validation
    if (schemaData.type === 'object' && schemaData.properties) {
      const required = schemaData.required || [];
      
      for (const field of required) {
        if (!(field in jsonData)) {
          return { isValid: false, error: `Missing required field: ${field}` };
        }
      }
    }
    
    return { isValid: true };
  } catch (e) {
    return { 
      isValid: false, 
      error: e instanceof Error ? e.message : 'Invalid JSON format' 
    };
  }
};

export const formatJson = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return json;
  }
};
