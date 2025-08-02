import { type NextRequest, NextResponse } from "next/server"
import * as brevo from "@getbrevo/brevo"
import { z } from "zod"

// Schema sincronizado con el formulario del frontend
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Verificar que la API key de Brevo esté configurada
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY no está configurada")
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error. Please try again later or contact us directly at hello@suitpax.com",
        },
        { status: 500 },
      )
    }

    // Initialize Brevo API
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

    // Prepare email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Company:</strong> ${validatedData.company || "Not provided"}</p>
      <p><strong>Subject:</strong> ${validatedData.subject}</p>
      
      <h3>Message:</h3>
      <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      
      <hr>
      <p><small>Sent from Suitpax Contact Form at ${new Date().toISOString()}</small></p>
    `

    // Send email to your team
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.to = [{ email: "hello@suitpax.com", name: "Suitpax Team" }]
    sendSmtpEmail.sender = { email: "noreply@suitpax.com", name: "Suitpax Contact Form" }
    sendSmtpEmail.subject = `New Contact: ${validatedData.subject} - ${validatedData.name}`
    sendSmtpEmail.htmlContent = emailContent
    sendSmtpEmail.replyTo = { email: validatedData.email, name: validatedData.name }

    await apiInstance.sendTransacEmail(sendSmtpEmail)

    // Send confirmation email to the user
    const confirmationEmail = new brevo.SendSmtpEmail()
    confirmationEmail.to = [{ email: validatedData.email, name: validatedData.name }]
    confirmationEmail.sender = { email: "hello@suitpax.com", name: "Suitpax Team" }
    confirmationEmail.subject = "Thank you for contacting Suitpax"
    confirmationEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Thank you for reaching out!</h2>
        <p>Hi ${validatedData.name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your message:</h3>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li><a href="https://suitpax.com/manifesto">Read our manifesto</a></li>
          <li><a href="https://suitpax.com/pricing">Check our pricing</a></li>
          <li><a href="https://cal.com/team/founders/partnership">Schedule a demo</a></li>
        </ul>
        
        <p>Best regards,<br>The Suitpax Team</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          Suitpax - AI-Powered Business Travel Platform<br>
          <a href="https://suitpax.com">suitpax.com</a>
        </p>
      </div>
    `

    await apiInstance.sendTransacEmail(confirmationEmail)

    // Add to Brevo contacts for marketing (optional)
    try {
      const contactsApi = new brevo.ContactsApi()
      contactsApi.setApiKey(brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

      const createContact = new brevo.CreateContact()
      createContact.email = validatedData.email
      createContact.attributes = {
        FIRSTNAME: validatedData.name.split(" ")[0],
        LASTNAME: validatedData.name.split(" ").slice(1).join(" ") || "",
        COMPANY: validatedData.company || "",
        CONTACT_SOURCE: "Website Contact Form",
        CONTACT_SUBJECT: validatedData.subject,
      }
      createContact.listIds = [1] // Add to your main contact list (adjust ID as needed)

      await contactsApi.createContact(createContact)
    } catch (contactError) {
      // Don't fail the whole request if contact creation fails
      console.warn("Failed to add contact to Brevo list:", contactError)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll be in touch soon.",
    })
  } catch (error) {
    console.error("Contact form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your form data",
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