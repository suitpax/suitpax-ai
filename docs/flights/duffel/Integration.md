# DocumentaciÃ³n de IntegraciÃ³n con Duffel API

## IntroducciÃ³n

Esta documentaciÃ³n describe la implementaciÃ³n de la integraciÃ³n con Duffel API para bÃºsqueda y reserva de vuelos, siguiendo todas las mejores prÃ¡cticas recomendadas por Duffel.

## Ãndice

1. [ConfiguraciÃ³n General](#configuraciÃ³n-general)
2. [Endpoints Implementados](#endpoints-implementados)
3. [BÃºsqueda de Vuelos](#bÃºsqueda-de-vuelos)
4. [Tarifas Privadas](#tarifas-privadas)
5. [VisualizaciÃ³n de Condiciones](#visualizaciÃ³n-de-condiciones)
6. [VisualizaciÃ³n de Escalas](#visualizaciÃ³n-de-escalas)
7. [Programas de Fidelidad](#programas-de-fidelidad)
8. [Webhooks](#webhooks)
9. [Base de Datos](#base-de-datos)
10. [Mejores PrÃ¡cticas](#mejores-prÃ¡cticas)

## ConfiguraciÃ³n General

### ConfiguraciÃ³n del Cliente

La integraciÃ³n utiliza un cliente Duffel centralizado para estandarizar todas las peticiones:

\`\`\`typescript
// lib/duffel.ts
import { Duffel } from "@duffel/api";

export const createDuffelClient = (options?: { 
  token?: string; 
  environment?: 'test' | 'production';
}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const token = options?.token || process.env.DUFFEL_API_KEY || "";
  const environment = options?.environment || (isProduction ? 'production' : 'test');
  
  // Usar cliente en cachÃ© si existe...
}
\`\`\`

### Variables de Entorno Requeridas

\`\`\`
DUFFEL_API_KEY=duffel_test_...       # Clave API de Duffel
DUFFEL_WEBHOOK_SECRET=whsec_...       # Secreto para verificar webhooks
\`\`\`

## Endpoints Implementados

| Endpoint                                      | MÃ©todo | DescripciÃ³n                                             |
|-----------------------------------------------|--------|---------------------------------------------------------|
| `/api/flights/duffel/search`                  | POST   | BÃºsqueda optimizada de vuelos con todas las mejores prÃ¡cticas |
| `/api/flights/duffel/private-fares`           | POST   | BÃºsqueda de vuelos con tarifas privadas                |
| `/api/flights/duffel/conditions`              | GET    | Obtener condiciones detalladas de ofertas y Ã³rdenes    |
| `/api/flights/duffel/stops`                   | GET    | Obtener informaciÃ³n detallada de escalas               |
| `/api/flights/duffel/loyalty`                 | GET, POST, DELETE | GestiÃ³n de programas de fidelidad personales |
| `/api/flights/duffel/airports`                | GET    | BÃºsqueda de aeropuertos (incluye bÃºsqueda por Ã¡rea)    |
| `/api/flights/duffel/airlines`                | GET    | BÃºsqueda de aerolÃ­neas                                 |
| `/api/flights/duffel/offers/[offerId]`        | GET    | Obtener detalles de una oferta especÃ­fica              |
| `/api/flights/duffel/orders/[orderId]`        | GET    | Obtener detalles de una orden especÃ­fica               |
| `/api/flights/duffel/baggage`                 | GET, POST, DELETE | GestiÃ³n de servicios de equipaje            |
| `/api/flights/duffel/seats`                   | GET, POST, DELETE | GestiÃ³n de selecciÃ³n de asientos            |
| `/api/flights/duffel/order-cancellations`     | GET, POST, PUT, DELETE | GestiÃ³n de cancelaciones de Ã³rdenes    |
| `/api/flights/duffel/order-changes`           | GET, POST, PUT   | GestiÃ³n de cambios en Ã³rdenes                |
| `/api/flights/duffel/webhooks`                | POST   | Receptor de webhooks de Duffel                         |

## BÃºsqueda de Vuelos

La implementaciÃ³n de bÃºsqueda de vuelos incluye todas las mejores prÃ¡cticas recomendadas por Duffel:

### CaracterÃ­sticas Principales

- **Cacheo de datos:** ImplementaciÃ³n de cachÃ© para aerolÃ­neas y aeropuertos
- **PaginaciÃ³n:** Soporte para paginaciÃ³n con tokens `after` y `before`
- **Enriquecimiento de datos:** Enriquecimiento de ofertas con informaciÃ³n de aerolÃ­neas y aeropuertos
- **Manejo de errores:** Tratamiento estandarizado de errores de Duffel
- **OptimizaciÃ³n de rendimiento:** Procesamiento paralelo con `Promise.all`
- **Opciones avanzadas:** Soporte para filtrado, ordenaciÃ³n y criterios especÃ­ficos

### Ejemplo de Uso

\`\`\`typescript
// Ejemplo de peticiÃ³n de bÃºsqueda optimizada
const searchRequest = {
  origin: "MAD",
  destination: "LHR",
  departure_date: "2025-10-01",
  return_date: "2025-10-08",
  passengers: {
    adults: 1
  },
  cabin_class: "economy",
  use_loyalty_programs: true,
  max_connections: 1
};

// POST /api/flights/duffel/search
\`\`\`

## Tarifas Privadas

La integraciÃ³n soporta bÃºsqueda con tarifas privadas (corporativas y programas de fidelidad):

### CaracterÃ­sticas

- **Programas de fidelidad personales:** Asociados a cada usuario
- **CÃ³digos corporativos:** Soporte para diferentes tipos (corporate_code, tour_code, discount_code)
- **VisualizaciÃ³n de descuentos:** CÃ¡lculo y visualizaciÃ³n de descuentos respecto a tarifas pÃºblicas

### Ejemplo de Uso

\`\`\`typescript
// Ejemplo de bÃºsqueda con tarifas privadas
const privateSearchRequest = {
  origin: "MAD",
  destination: "LHR",
  departure_date: "2025-10-01",
  passengers: {
    adults: 1
  },
  use_loyalty_programs: true,
  use_corporate_codes: true
};

// POST /api/flights/duffel/private-fares
\`\`\`

## VisualizaciÃ³n de Condiciones

ImplementaciÃ³n optimizada para visualizar condiciones de ofertas y Ã³rdenes:

### CaracterÃ­sticas

- **InformaciÃ³n de reembolso:** PolÃ­ticas detalladas de reembolso con penalizaciones
- **Cambios permitidos:** InformaciÃ³n sobre cambios permitidos y sus costos
- **Equipaje incluido:** Detalle de equipaje incluido por tipo de pasajero
- **Textos amigables:** GeneraciÃ³n de textos legibles para el usuario final

### Ejemplo de Uso

\`\`\`typescript
// Obtener condiciones de una oferta
// GET /api/flights/duffel/conditions?offer_id=off_123

// Obtener condiciones de una orden
// GET /api/flights/duffel/conditions?order_id=ord_123
\`\`\`

## VisualizaciÃ³n de Escalas

ImplementaciÃ³n completa para visualizar informaciÃ³n detallada de escalas:

### CaracterÃ­sticas

- **Detalle de aeropuertos:** InformaciÃ³n completa de aeropuertos de escala
- **Tiempos de conexiÃ³n:** CÃ¡lculo de tiempos entre vuelos
- **ClasificaciÃ³n de conexiones:** ClasificaciÃ³n por duraciÃ³n (corta, estÃ¡ndar, larga)
- **DetecciÃ³n de conexiones nocturnas:** IdentificaciÃ³n de conexiones que requieren pasar la noche

### Ejemplo de Uso

\`\`\`typescript
// Obtener detalles de escalas de una oferta
// GET /api/flights/duffel/stops?offer_id=off_123

// Obtener detalles de escalas de un slice especÃ­fico
// GET /api/flights/duffel/stops?offer_id=off_123&slice_id=sli_123
\`\`\`

## Programas de Fidelidad

La integraciÃ³n incluye soporte completo para programas de fidelidad personales:

### CaracterÃ­sticas

- **GestiÃ³n completa:** CreaciÃ³n, actualizaciÃ³n y eliminaciÃ³n de programas
- **MÃºltiples aerolÃ­neas:** Soporte para todas las aerolÃ­neas disponibles en Duffel
- **Datos detallados:** Almacenamiento de informaciÃ³n completa del titular de la cuenta
- **IntegraciÃ³n con bÃºsqueda:** Uso automÃ¡tico en bÃºsquedas cuando se solicita

### Ejemplo de Uso

\`\`\`typescript
// Crear un programa de fidelidad personal
const loyaltyProgram = {
  type: "loyalty_program",
  airline_iata_code: "IB",
  account_number: "123456789",
  account_holder_title: "mr",
  account_holder_first_name: "John",
  account_holder_last_name: "Doe"
};

// POST /api/flights/duffel/loyalty
\`\`\`

## Webhooks

La integraciÃ³n incluye un sistema completo para manejar webhooks de Duffel:

### CaracterÃ­sticas

- **VerificaciÃ³n de firma:** ComprobaciÃ³n criptogrÃ¡fica de la autenticidad del webhook
- **Registro de eventos:** Almacenamiento de todos los eventos recibidos
- **ActualizaciÃ³n automÃ¡tica:** SincronizaciÃ³n del estado de Ã³rdenes y servicios
- **Manejo de errores:** Tratamiento robusto de errores durante el procesamiento

### Eventos Soportados

- `order.created`
- `order.updated`
- `order.cancelled`
- `payment.created`
- `payment.updated`
- `passenger.updated`
- `service.created`
- `service.updated`
- `order_change_request.created`
- `order_change_request.updated`

## Base de Datos

La implementaciÃ³n incluye un esquema de base de datos completo para Supabase:

### Tablas Principales

- `flight_searches`: Registro de bÃºsquedas realizadas
- `flight_bookings`: Reservas de vuelos
- `user_loyalty_programs`: Programas de fidelidad de usuarios
- `user_corporate_codes`: CÃ³digos corporativos de usuarios
- `order_cancellations`: Registro de cancelaciones de Ã³rdenes
- `order_changes`: Registro de cambios en Ã³rdenes
- `webhook_events`: Registro de eventos webhook recibidos
- `airport_cache`: CachÃ© de datos de aeropuertos
- `airline_cache`: CachÃ© de datos de aerolÃ­neas

### Seguridad

- **Row Level Security (RLS):** PolÃ­ticas de seguridad a nivel de fila para proteger datos
- **ActualizaciÃ³n automÃ¡tica:** Triggers para mantener campos de fecha actualizados
- **Ãndices optimizados:** Ãndices para consultas frecuentes

## Mejores PrÃ¡cticas

La implementaciÃ³n sigue todas las mejores prÃ¡cticas recomendadas por Duffel:

### BÃºsqueda de Vuelos

- **client_request_tracking_id:** Uso de IDs de seguimiento para todas las peticiones
- **Filtrado por aerolÃ­neas:** Soporte para preferencias y exclusiones
- **Manejo de moneda:** Soporte para bÃºsquedas en diferentes monedas

### Tarifas Privadas

- **MÃºltiples programas:** EnvÃ­o de todos los programas de fidelidad aplicables
- **CÃ³digos corporativos:** InclusiÃ³n de cÃ³digos corporativos cuando estÃ¡n disponibles
- **VisualizaciÃ³n de descuentos:** ComparaciÃ³n con tarifas pÃºblicas

### Aeropuertos

- **BÃºsqueda por Ã¡rea:** ImplementaciÃ³n de bÃºsqueda por coordenadas y radio
- **PuntuaciÃ³n inteligente:** Algoritmo de puntuaciÃ³n para ordenar resultados
- **CachÃ© eficiente:** Sistema de cachÃ© con expiraciÃ³n para mejorar rendimiento

### Condiciones y Escalas

- **Procesamiento detallado:** ExtracciÃ³n de toda la informaciÃ³n relevante
- **Textos amigables:** GeneraciÃ³n de textos legibles para el usuario final
- **DetecciÃ³n de caracterÃ­sticas:** IdentificaciÃ³n de conexiones nocturnas, cambios de terminal, etc.

## GuÃ­a de MigraciÃ³n

Para implementar esta integraciÃ³n en un proyecto existente:

1. Ejecutar el script de migraciÃ³n de base de datos `migrations/duffel_schema.sql`
2. Configurar las variables de entorno necesarias
3. Copiar los archivos de API a la estructura del proyecto
4. Actualizar el cliente de Duffel centralizado
5. Implementar los componentes de frontend necesarios para interactuar con la API

## Recursos Adicionales

- [DocumentaciÃ³n oficial de Duffel API](https://duffel.com/docs)
- [GuÃ­a de mejores prÃ¡cticas de bÃºsqueda](https://duffel.com/docs/guides/following-search-best-practices)
- [GuÃ­a de tarifas privadas](https://duffel.com/docs/guides/accessing-private-fares)
- [GuÃ­a de programas de fidelidad corporativos](https://duffel.com/docs/guides/adding-corporate-loyalty-programme-accounts)
- [GuÃ­a de visualizaciÃ³n de condiciones](https://duffel.com/docs/guides/displaying-offer-and-order-conditions)
- [GuÃ­a de visualizaciÃ³n de escalas](https://duffel.com/docs/guides/displaying-stops)
- [GuÃ­a de bÃºsqueda de aeropuertos por Ã¡rea](https://duffel.com/docs/guides/finding-airports-within-an-area)
