"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle, AlertCircle, User, Mail, Building, MessageSquare } from "lucide-react"

interface FormData {
  name: string
  email: string
  company: string
  message: string
  subject: string
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error"
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
    subject: "",
  })

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: "error",
        message: "Por favor, completa todos los campos requeridos.",
      })
      return
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Por favor, introduce un email válido.",
      })
      return
    }

    setStatus({ type: "loading", message: "Procesando tu mensaje..." })

    // Simular envío (sin backend real)
    setTimeout(() => {
      setStatus({
        type: "success",
        message:
          "¡Gracias por tu interés! Nos pondremos en contacto contigo pronto. Por ahora, puedes contactarnos directamente en hello@suitpax.com",
      })

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
        subject: "",
      })

      // Opcional: Enviar datos a analytics o guardar en localStorage
      if (typeof window !== "undefined") {
        const contactData = {
          ...formData,
          timestamp: new Date().toISOString(),
        }
        console.log("Contact form submission:", contactData)

        // Guardar en localStorage para referencia
        const existingContacts = JSON.parse(localStorage.getItem("suitpax_contacts") || "[]")
        existingContacts.push(contactData)
        localStorage.setItem("suitpax_contacts", JSON.stringify(existingContacts))
      }
    }, 2000)
  }

  return (
    <section className="pt-12 pb-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
              <em className="font-serif italic">Contact Us</em>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
              <em className="font-serif italic">Let's Transform Your</em>
              <br />
              <span className="text-gray-700">Business Travel</span>
            </h2>
            <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
              Descubre cómo Suitpax puede revolucionar la gestión de viajes de tu empresa. Nuestro equipo está listo
              para ayudarte.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-medium tracking-tighter mb-4">
                <em className="font-serif italic">¿Por qué elegir Suitpax?</em>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Ahorro garantizado:</strong> Reduce costos de viaje hasta un 30%
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">IA avanzada:</strong> Agentes inteligentes que aprenden de tus
                    preferencias
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Soporte 24/7:</strong> Asistencia completa en cualquier momento
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 font-light">
                    <strong className="font-medium">Integración total:</strong> Compatible con tus sistemas existentes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-medium tracking-tighter mb-3">
                <em className="font-serif italic">Contacto directo</em>
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <strong>Email:</strong> hello@suitpax.com
                </p>
                <p className="text-gray-600">
                  <strong>LinkedIn:</strong> /company/suitpax
                </p>
                <p className="text-gray-600">
                  <strong>Horario:</strong> Lun-Vie 9:00-18:00 CET
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>💡 Nota:</strong> Este es un formulario de demostración. Para contacto real, escríbenos
                directamente a{" "}
                <a href="mailto:hello@suitpax.com" className="underline font-medium">
                  hello@suitpax.com
                </a>
              </p>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6"
            >
              {/* Asunto */}
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Asunto</em>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                  required
                >
                  <option value="">Selecciona un tema</option>
                  <option value="Demo del producto">Demo del producto</option>
                  <option value="Información comercial">Información comercial</option>
                  <option value="Soporte técnico">Soporte técnico</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Prensa y medios">Prensa y medios</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Nombre completo</em>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Email corporativo</em>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="tu.email@empresa.com"
                    required
                  />
                </div>
              </div>

              {/* Empresa */}
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Empresa</em>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Mensaje</em>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200 bg-white/80 resize-none"
                    placeholder="Cuéntanos sobre tu empresa y cómo podemos ayudarte..."
                    required
                  />
                </div>
              </div>

              {/* Estado del formulario */}
              {status.type !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 p-3 rounded-xl ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : status.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {status.type === "success" && <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  {status.type === "error" && <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  {status.type === "loading" && (
                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{status.message}</span>
                </motion.div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {status.type === "loading" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <em className="font-serif italic">Enviar mensaje</em>
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al enviar este formulario, aceptas que nos pongamos en contacto contigo sobre nuestros servicios.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
