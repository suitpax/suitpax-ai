"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PiUsersBold } from "react-icons/pi"
import { SiMarriott, SiBritishairways, SiElevenlabs, SiAirbnb, SiSouthwestairlines, SiNike } from "react-icons/si"
import { ContactCard } from "./contact-card"
import type { ContactProps } from "./types"

export const ContactsSection = () => {
  // Modificar los contactos para reemplazar las repeticiones de Airbnb y Vercel con contactos de ElevenLabs y Nike

  // Reemplazar el array de contactos con este nuevo array:
  const contacts: ContactProps[] = [
    {
      name: "Sarah Johnson",
      position: "Travel Manager",
      company: "Marriott",
      companyIcon: <SiMarriott className="w-full h-full text-white" />,
      email: "sarah.j@marriott.com",
      phone: "+1 (555) 123-4567",
      image: "/community/ashton-blackwell.webp",
      badge: "Active Client",
    },
    {
      name: "Michael Chen",
      position: "Procurement Director",
      company: "British Airways",
      companyIcon: <SiBritishairways className="w-full h-full text-white" />,
      email: "m.chen@ba.com",
      phone: "+44 (20) 7946-0123",
      image: "/community/jordan-burgess.webp",
      badge: "Key Decision Maker",
    },
    {
      name: "James Wilson",
      position: "Voice AI Director",
      company: "ElevenLabs",
      companyIcon: <SiElevenlabs className="w-full h-full text-white" />,
      email: "j.wilson@elevenlabs.io",
      phone: "+1 (415) 555-8901",
      image: "/community/byron-robertson.webp",
      badge: "New Lead",
    },
    {
      name: "David Thompson",
      position: "Corporate Partnerships",
      company: "Southwest",
      companyIcon: <SiSouthwestairlines className="w-full h-full text-white" />,
      email: "d.thompson@southwest.com",
      phone: "+1 (214) 555-7890",
      image: "/community/nicolas-trevino.webp",
      badge: "Partnership",
    },
    {
      name: "Olivia Parker",
      position: "Sports Travel Manager",
      company: "Nike",
      companyIcon: <SiNike className="w-full h-full text-white" />,
      email: "o.parker@nike.com",
      phone: "+1 (503) 555-4321",
      image: "/community/isobel-fuller.webp",
      badge: "Active Client",
    },
    {
      name: "Robert Miller",
      position: "Travel Coordinator",
      company: "Airbnb",
      companyIcon: <SiAirbnb className="w-full h-full text-white" />,
      email: "r.miller@airbnb.com",
      phone: "+1 (415) 555-6789",
      image: "/community/scott-clayton.webp",
      badge: "Prospect",
    },
  ]

  const [showPlaygroundContact, setShowPlaygroundContact] = useState(false)

  // Find the playground contact if it exists
  const playgroundContact = contacts.find((contact) => contact.isPlayground)
  // Filter out the playground contact from the regular contacts
  const regularContacts = contacts.filter((contact) => !contact.isPlayground)

  return (
    <motion.div
      key="contacts"
      className="content-contacts space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Contacts Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white">Key Contacts</h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-xl bg-white/10 px-3 py-1 text-[10px] font-medium text-white tracking-wide border border-white/20">
            <div className="w-4 h-4 rounded-md bg-black flex items-center justify-center text-white mr-2">
              <PiUsersBold className="h-2.5 w-2.5" />
            </div>
            342 TOTAL
          </span>
        </div>
      </div>

      {/* Contacts in vertical grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {regularContacts.map((contact, index) => (
          <ContactCard key={index} contact={contact} delay={index * 0.1} />
        ))}

        {playgroundContact && (
          <ContactCard
            contact={showPlaygroundContact ? playgroundContact : { ...playgroundContact, isPlayground: true }}
            delay={regularContacts.length * 0.1}
            onClick={() => setShowPlaygroundContact(!showPlaygroundContact)}
          />
        )}
      </div>
    </motion.div>
  )
}
