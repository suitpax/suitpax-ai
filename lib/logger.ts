import { createClient } from "@/lib/supabase/server"

export interface LogEntry {
  level: "info" | "warn" | "error" | "debug"
  message: string
  correlationId?: string
  userId?: string
  metadata?: Record<string, any>
  timestamp: string
  service: string
  endpoint?: string
  duration?: number
  statusCode?: number
}

class Logger {
  private service: string
  private correlationId: string

  constructor(service = "suitpax-api") {
    this.service = service
    this.correlationId = this.generateCorrelationId()
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async log(entry: Omit<LogEntry, "timestamp" | "service" | "correlationId">) {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      service: this.service,
      correlationId: this.correlationId,
    }

    // Console logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, logEntry.metadata)
    }

    // Store in Supabase for production monitoring
    if (process.env.NODE_ENV === "production") {
      try {
        const supabase = createClient()
        await supabase.from("system_logs").insert({
          level: logEntry.level,
          message: logEntry.message,
          correlation_id: logEntry.correlationId,
          user_id: logEntry.userId,
          metadata: logEntry.metadata,
          service: logEntry.service,
          endpoint: logEntry.endpoint,
          duration: logEntry.duration,
          status_code: logEntry.statusCode,
        })
      } catch (error) {
        console.error("Failed to log to database:", error)
      }
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log({ level: "info", message, metadata })
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log({ level: "warn", message, metadata })
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log({ level: "error", message, metadata })
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log({ level: "debug", message, metadata })
  }

  // API request logging
  async logRequest(endpoint: string, method: string, userId?: string, metadata?: Record<string, any>) {
    const startTime = Date.now()

    return {
      correlationId: this.correlationId,
      end: (statusCode: number, additionalMetadata?: Record<string, any>) => {
        const duration = Date.now() - startTime
        this.log({
          level: statusCode >= 400 ? "error" : "info",
          message: `${method} ${endpoint} - ${statusCode}`,
          userId,
          endpoint,
          duration,
          statusCode,
          metadata: { ...metadata, ...additionalMetadata },
        })
      },
    }
  }

  setCorrelationId(id: string) {
    this.correlationId = id
  }
}

export const logger = new Logger()
export default Logger
