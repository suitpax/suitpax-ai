import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message, subject } = await request.json()

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: "Suitpax Contact <contact@suitpax.com>",
      to: ["hello@suitpax.com"],
      subject: subject || `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 600;">
              Nuevo Mensaje de Contacto
            </h1>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <div style="margin-bottom: 30px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                Información del Contacto
              </h2>
              <p style="margin: 8px 0; color: #6b7280;"><strong>Nombre:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #6b7280;"><strong>Email:</strong> ${email}</p>
              ${company ? `<p style="margin: 8px 0; color: #6b7280;"><strong>Empresa:</strong> ${company}</p>` : ""}
            </div>
            
            <div>
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                Mensaje
              </h2>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #e5e7eb;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Este mensaje fue enviado desde el formulario de contacto de Suitpax
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Error enviando email:", error)
      return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 })
    }

    // Email de confirmación al usuario
    await resend.emails.send({
      from: "Suitpax <noreply@suitpax.com>",
      to: [email],
      subject: "Hemos recibido tu mensaje - Suitpax",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              ¡Gracias por contactarnos!
            </h1>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Hola <strong>${name}</strong>,
            </p>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e5e7eb;">
              <p style="color: #374151; margin: 0; font-weight: 600;">Tu mensaje:</p>
              <p style="color: #6b7280; margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Mientras tanto, puedes explorar más sobre nuestras soluciones de viajes de negocio en 
              <a href="https://suitpax.com" style="color: #374151; text-decoration: none; font-weight: 600;">suitpax.com</a>
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Equipo Suitpax | Revolucionando los viajes de negocio
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ message: "Mensaje enviado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en API de contacto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
