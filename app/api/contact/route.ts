import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Brevo API configuration
const BREVO_API_KEY = "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"
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = contactSchema.parse(body)

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: "Suitpax Contact Form",
        email: "noreply@suitpax.com",
      },
      to: [
        {
          email: "hello@suitpax.com",
          name: "Suitpax Team",
        },
      ],
      replyTo: {
        email: validatedData.email,
        name: validatedData.name,
      },
      subject: `New Contact Form Submission: ${validatedData.subject}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Name:</strong>
                <span style="margin-left: 10px; color: #333;">${validatedData.name}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Email:</strong>
                <span style="margin-left: 10px; color: #333;">${validatedData.email}</span>
              </div>
              
              ${
                validatedData.company
                  ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #555;">Company:</strong>
                  <span style="margin-left: 10px; color: #333;">${validatedData.company}</span>
                </div>
              `
                  : ""
              }
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Subject:</strong>
                <span style="margin-left: 10px; color: #333;">${validatedData.subject}</span>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #555;">Message:</strong>
                <div style="margin-top: 10px; padding: 15px; background: #f8f9fa; border-radius: 5px; color: #333; line-height: 1.6;">
                  ${validatedData.message.replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>This message was sent from the Suitpax contact form at ${new Date().toLocaleString()}.</p>
              </div>
            </div>
          </div>
        </div>
      `,
    }

    // Send email via Brevo
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Brevo API error:", errorData)
      throw new Error(`Brevo API error: ${response.status}`)
    }

    // Send confirmation email to user
    const confirmationEmailData = {
      sender: {
        name: "Suitpax Team",
        email: "hello@suitpax.com",
      },
      to: [
        {
          email: validatedData.email,
          name: validatedData.name,
        },
      ],
      subject: "Thank you for contacting Suitpax - We'll be in touch soon!",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Suitpax!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hi ${validatedData.name},</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to us! We've received your message about "<strong>${validatedData.subject}</strong>" and our team will get back to you within 24 hours.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0; font-size: 16px;">Your Message:</h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  ${validatedData.message.replace(/\n/g, "<br>")}
                </p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                In the meantime, feel free to explore our platform and learn more about how Suitpax can transform your business travel management.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://suitpax.com" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Visit Suitpax
                </a>
              </div>
              
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p><strong>Best regards,</strong><br>The Suitpax Team</p>
                <p>Email: hello@suitpax.com<br>Website: https://suitpax.com</p>
              </div>
            </div>
          </div>
        </div>
      `,
    }

    // Send confirmation email
    await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(confirmationEmailData),
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    })
  } catch (error) {
    console.error("Contact form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your form data and try again.",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Sorry, there was an error sending your message. Please try again or email us directly at hello@suitpax.com",
      },
      { status: 500 },
    )
  }
}
