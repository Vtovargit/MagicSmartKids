import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      return this.handleAxiosError(error);
    }
    
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'GENERIC_ERROR'
      };
    }
    
    return {
      message: 'Ha ocurrido un error inesperado',
      code: 'UNKNOWN_ERROR'
    };
  }

  private static handleAxiosError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const data = error.response?.data as any;

    // Network error
    if (!error.response) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: 'NETWORK_ERROR'
      };
    }

    // Server provided error message
    if (data?.message) {
      return {
        message: data.message,
        status,
        code: data.code || 'API_ERROR',
        details: data.details
      };
    }

    // Default messages based on status code
    switch (status) {
      case 400:
        return {
          message: 'Solicitud inválida. Verifica los datos enviados.',
          status,
          code: 'BAD_REQUEST'
        };
      case 401:
        return {
          message: 'No tienes autorización. Inicia sesión nuevamente.',
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: 'No tienes permisos para realizar esta acción.',
          status,
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: 'El recurso solicitado no fue encontrado.',
          status,
          code: 'NOT_FOUND'
        };
      case 409:
        return {
          message: 'Conflicto con el estado actual del recurso.',
          status,
          code: 'CONFLICT'
        };
      case 422:
        return {
          message: 'Los datos enviados no son válidos.',
          status,
          code: 'VALIDATION_ERROR',
          details: data?.errors
        };
      case 429:
        return {
          message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
          status,
          code: 'RATE_LIMIT'
        };
      case 500:
        return {
          message: 'Error interno del servidor. Intenta nuevamente más tarde.',
          status,
          code: 'INTERNAL_SERVER_ERROR'
        };
      case 502:
        return {
          message: 'El servidor no está disponible temporalmente.',
          status,
          code: 'BAD_GATEWAY'
        };
      case 503:
        return {
          message: 'Servicio no disponible. Intenta nuevamente más tarde.',
          status,
          code: 'SERVICE_UNAVAILABLE'
        };
      default:
        return {
          message: `Error del servidor (${status}). Intenta nuevamente más tarde.`,
          status,
          code: 'SERVER_ERROR'
        };
    }
  }

  static getFieldErrors(error: ApiError): Record<string, string> {
    if (error.code === 'VALIDATION_ERROR' && error.details) {
      const fieldErrors: Record<string, string> = {};
      
      if (Array.isArray(error.details)) {
        error.details.forEach((detail: any) => {
          if (detail.field && detail.message) {
            fieldErrors[detail.field] = detail.message;
          }
        });
      } else if (typeof error.details === 'object') {
        Object.keys(error.details).forEach(field => {
          const messages = error.details[field];
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = messages[0];
          } else if (typeof messages === 'string') {
            fieldErrors[field] = messages;
          }
        });
      }
      
      return fieldErrors;
    }
    
    return {};
  }

  static isNetworkError(error: ApiError): boolean {
    return error.code === 'NETWORK_ERROR';
  }

  static isAuthError(error: ApiError): boolean {
    return error.status === 401 || error.code === 'UNAUTHORIZED';
  }

  static isValidationError(error: ApiError): boolean {
    return error.code === 'VALIDATION_ERROR' || error.status === 422;
  }

  static isServerError(error: ApiError): boolean {
    return (error.status && error.status >= 500) || error.code === 'INTERNAL_SERVER_ERROR';
  }
}