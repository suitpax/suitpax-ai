import { Duffel } from "@duffel/api";

/**
 * Crea cliente Duffel con configuración dinámica según el environment
 */
export const createDuffelClient = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const token = isProduction 
    ? process.env.DUFFEL_PRODUCTION_API_KEY 
    : process.env.DUFFEL_API_KEY;
    
  const environment = isProduction ? 'production' : 'test';
  
  if (!token) {
    throw new Error(`Duffel API key not configured for ${environment} environment`);
  }

  console.log(`Duffel client created for ${environment} environment`);

  return new Duffel({
    token,
    environment: environment as 'test' | 'production'
  });
};

/**
 * Manejo centralizado de errores de Duffel
 */
export const handleDuffelError = (error: any) => {
  console.error("Duffel API Error:", error);
  
  if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
    return { 
      success: false,
      error: "API authentication failed", 
      error_code: "AUTH_FAILED",
      status: 401 
    };
  }
  
  if (error.message?.includes('rate limit')) {
    return { 
      success: false,
      error: "Too many requests. Please try again in a moment.", 
      error_code: "RATE_LIMIT",
      status: 429 
    };
  }

  if (error.message?.includes('airport not found')) {
    return { 
      success: false,
      error: "Invalid airport codes", 
      error_code: "AIRPORT_NOT_FOUND",
      status: 400 
    };
  }

  if (error.message?.includes('no offers available')) {
    return { 
      success: true,
      offers: [],
      message: "No flights available for selected dates",
      status: 200 
    };
  }
  
  return { 
    success: false,
    error: "Service temporarily unavailable", 
    error_code: "SERVICE_ERROR",
    status: 500 
  };
};

/**
 * Configurar método de pago según environment
 */
export const getPaymentMethod = (currency: string, amount: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // En producción, usar BSP cash si tienes acreditación IATA
    // O implementar integración con procesador de pagos real
    return {
      type: "arc_bsp_cash",
      currency,
      amount
    };
  } else {
    // En test/sandbox, usar balance ilimitado
    return {
      type: "balance",
      currency,
      amount
    };
  }
};
