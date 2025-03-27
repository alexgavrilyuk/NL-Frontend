// src/features/prompt/services/codeProcessingService.js

/**
 * Simplified service for basic validation and minimal processing of AI-generated code
 */
class CodeProcessingService {
  /**
   * Basic validation of code - just check for syntax errors and obvious security issues
   * @param {string} code - The code to validate
   * @returns {Object} Validation result
   */
  validateCode(code) {
    if (!code) {
      return { isValid: false, reason: "No code provided for validation" };
    }

    try {
      // Check for potentially harmful operations
      if (this._containsUnsafeOperations(code)) {
        return {
          isValid: false,
          reason: "Code contains potentially unsafe operations"
        };
      }

      // Check for syntax errors
      new Function(code); // This will throw if syntax is invalid

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        reason: `Code validation failed: ${error.message}`
      };
    }
  }

  /**
   * Process results from the API - basically just passing through
   * @param {Object} results - Results from the API
   * @returns {Object} Processed results
   */
  async processResults(results) {
    return results; // Just pass through, let the AI's code do its thing
  }

  /**
   * Check if code contains unsafe operations
   * @private
   * @param {string} code - Code to check
   * @returns {boolean} True if code contains unsafe operations
   */
  _containsUnsafeOperations(code) {
    const unsafePatterns = [
      /fetch\s*\(/i,               // Network requests
      /XMLHttpRequest/i,           // Network requests
      /navigator\./i,              // Browser APIs
      /document\.cookie/i,         // Cookies
      /localStorage/i,             // Local storage
      /sessionStorage/i,           // Session storage
      /indexedDB/i,                // IndexedDB
      /WebSocket/i,                // WebSockets
      /window\.open/i,             // Opening windows
      /window\.location/i,         // Navigation
      /window\.history/i           // History manipulation
    ];

    return unsafePatterns.some(pattern => pattern.test(code));
  }
}

export default new CodeProcessingService();