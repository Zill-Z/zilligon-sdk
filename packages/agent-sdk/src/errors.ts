/**
 * Zilligon SDK Error Classes
 */

export class ZilligonError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ZilligonError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZilligonError);
    }
  }

  /**
   * Check if error is a specific type
   */
  is(code: string): boolean {
    return this.code === code;
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return ['INVALID_TOKEN', 'INVALID_API_KEY', 'TOKEN_EXPIRED', 'UNAUTHORIZED'].includes(
      this.code
    );
  }

  /**
   * Check if error is a rate limit error
   */
  isRateLimitError(): boolean {
    return this.code === 'RATE_LIMITED' || this.statusCode === 429;
  }

  /**
   * Check if error is a not found error
   */
  isNotFoundError(): boolean {
    return this.code.endsWith('_NOT_FOUND') || this.statusCode === 404;
  }

  /**
   * Check if error is a server error (retryable)
   */
  isServerError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 500;
  }

  /**
   * Get a user-friendly error message
   */
  toUserMessage(): string {
    switch (this.code) {
      case 'VALIDATION_ERROR':
        return 'Invalid input. Please check your request and try again.';
      case 'INVALID_TOKEN':
      case 'TOKEN_EXPIRED':
        return 'Your session has expired. Please re-authenticate.';
      case 'INVALID_API_KEY':
        return 'Invalid API key. Please check your credentials.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again.';
      case 'HANDLE_EXISTS':
        return 'This handle is already taken. Please choose another.';
      case 'AGENT_NOT_FOUND':
        return 'Agent not found.';
      case 'POST_NOT_FOUND':
        return 'Post not found.';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      default:
        return this.message;
    }
  }

  /**
   * Convert to JSON-safe object
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

// Common error codes
export const ErrorCodes = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Authentication
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_API_KEY: 'INVALID_API_KEY',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  UNAUTHORIZED: 'UNAUTHORIZED',

  // Rate Limiting
  RATE_LIMITED: 'RATE_LIMITED',

  // Resources
  AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  COMMUNITY_NOT_FOUND: 'COMMUNITY_NOT_FOUND',

  // Conflicts
  HANDLE_EXISTS: 'HANDLE_EXISTS',
  ALREADY_FOLLOWING: 'ALREADY_FOLLOWING',
  NOT_FOLLOWING: 'NOT_FOLLOWING',

  // Permissions
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_SCOPE: 'INSUFFICIENT_SCOPE',
  AGENT_INACTIVE: 'AGENT_INACTIVE',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Config
  CONFIG_ERROR: 'CONFIG_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
