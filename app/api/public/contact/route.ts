import { type NextRequest, NextResponse } from "next/server"

// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_API_URL = "https://api.brevo.com/v3"

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function POST(request: NextRequest) {
  if (!BREVO_API_KEY) {
    console.error("Brevo API key is not configured.")
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error. The contact form is temporarily unavailable.",
      },
      { status: 500 },
    )
  }

  try {
    const body: ContactFormData = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // 1. Send internal notification email to Suitpax Team
    const internalEmailData = {
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
        email: email,
        name: name,
      },
      subject: `New Contact Form: ${name}`,
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #000 0%, #333 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">New Contact Message</h1>
          </div>
          
          <div style="padding: 40px 30px; background: white; margin: 0 20px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Contact Details</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="margin-bottom: 12px;">
                  <strong style="color: #555; font-size: 14px;">Name:</strong>
                  <div style="color: #333; font-size: 16px; margin-top: 4px;">${name}</div>
                </div>
                
                <div style="margin-bottom: 12px;">
                  <strong style="color: #555; font-size: 14px;">Email:</strong>
                  <div style="color: #333; font-size: 16px; margin-top: 4px;">${email}</div>
                </div>
              </div>
              
              <div>
                <strong style="color: #555; font-size: 14px;">Message:</strong>
                <div style="margin-top: 8px; padding: 20px; background: #f8f9fa; border-radius: 12px; color: #333; line-height: 1.6; font-size: 15px;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
            </div>
            
            <div style="padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 13px; text-align: center;">
              <p style="margin: 0;">Sent from Suitpax contact form • ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    }

    const internalEmailResponse = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(internalEmailData),
    })

    if (!internalEmailResponse.ok) {
      const errorData = await internalEmailResponse.json()
      console.error("Brevo API error (Internal Email):", errorData)
      throw new Error(`Brevo API error: ${internalEmailResponse.status}`)
    }
    console.log("Internal contact email sent successfully.")

    // 2. Add contact to Brevo list
    const contactResponse = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name.split(" ")[0] || name,
          LASTNAME: name.split(" ").slice(1).join(" ") || "",
        },
        listIds: [2], // Default contact list
        updateEnabled: true,
      }),
    })

    if (!contactResponse.ok) {
      console.warn("Brevo API warning (Add Contact):", await contactResponse.json())
    } else {
      console.log("Contact added/updated in Brevo successfully.")
    }

    // 3. Send confirmation email to the user
    const confirmationEmailData = {
      sender: {
        name: "Suitpax Team",
        email: "hello@suitpax.com",
      },
      to: [
        {
          email: email,
          name: name,
        },
      ],
      subject: "Thank you for contacting Suitpax",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://suitpax.com/logo/suitpax-cloud-logo.webp" alt="Suitpax" style="height: 40px;">
          </div>
          
          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Thank you for reaching out!</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi ${name},
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We've received your message and our team will get back to you within 24 hours during business days.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; font-size: 18px; margin-bottom: 10px;">Your Message:</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
              "${message}"
            </p>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            In the meantime, feel free to explore our platform and learn more about how Suitpax can transform your business travel experience.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://suitpax.com/auth/signup" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
              Start Free Trial
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              The Suitpax Team
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 10px;">
              2261 Market Street STE 86661, San Francisco, CA 94114
            </p>
          </div>
        </div>
      `,
    }

    await fetch(`${BREVO_API_URL}/smtp/email`, {
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
