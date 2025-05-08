'use client';

import React, { useEffect, useRef } from 'react';
import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIWrapperProps {
  spec: any;
}

// This component wraps SwaggerUI to prevent strict mode warnings
const SwaggerUIWrapper: React.FC<SwaggerUIWrapperProps> = ({ spec }) => {
  // Use a ref to track if we've displayed the warning
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (!hasWarnedRef.current) {
      // Save the original console.error
      const originalConsoleError = console.error;
      
      // Override console.error to filter out specific React warnings
      console.error = (...args: any[]) => {
        // Filter out the UNSAFE_ warnings from Swagger UI
        if (
          args.length > 0 && 
          typeof args[0] === 'string' && 
          (args[0].includes('UNSAFE_') || 
           args[0].includes('componentWillReceiveProps') ||
           args[0].includes('componentWillMount'))
        ) {
          return;
        }
        
        // Pass through all other errors
        return originalConsoleError(...args);
      };
      
      // Flag that we've handled the warning
      hasWarnedRef.current = true;
      
      // Cleanup function
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);

  // Only render the SwaggerUI if we have a spec
  if (!spec) {
    return null;
  }

  return (
    <div className="swagger-ui-wrapper">
      <SwaggerUIReact 
        spec={spec} 
        docExpansion="list"
        deepLinking={true}
      />
    </div>
  );
};

export default SwaggerUIWrapper; 