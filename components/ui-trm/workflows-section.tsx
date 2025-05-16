"use client"

import { motion } from "framer-motion"
import {
  PiHandshakeBold,
  PiUsersBold,
  PiLinkBold,
  PiEnvelopeSimpleBold,
  PiCheckCircleBold,
  PiChatCircleBold,
  PiCalendarCheckBold,
  PiChartBarBold,
  PiPhoneBold,
  PiAirplaneTakeoffBold,
  PiCurrencyDollarBold,
  PiPresentationChartBold,
} from "react-icons/pi"
import { SiNike, SiLoom, SiElevenlabs, SiVercel, SiAmazon, SiRockstargames } from "react-icons/si"
import { WorkflowCard } from "./workflow-card"
import type { Workflow } from "./types"

export const WorkflowsSection = () => {
  // Datos de workflows internos
  const workflows: Workflow[] = [
    {
      name: "Nike",
      logo: <SiNike className="w-full h-full text-white" />,
      domain: "nike.com",
      location: "Portland, Oregon",
      steps: [
        {
          title: "Initial Contact",
          icon: <PiChatCircleBold />,
          description: "First conversation with Nike team",
          user: {
            name: "Sarah Johnson",
            position: "Travel Manager",
            email: "s.johnson@nike.com",
            phone: "+1 (503) 555-1234",
            image: "/community/ashton-blackwell.webp",
          },
        },
        {
          title: "Meeting Setup",
          icon: <PiCalendarCheckBold />,
          description: "Schedule product demo with decision makers",
          user: {
            name: "Michael Chen",
            position: "Procurement Director",
            email: "m.chen@nike.com",
            phone: "+1 (503) 555-6789",
            image: "/community/jordan-burgess.webp",
          },
        },
        {
          title: "Proposal Sent",
          icon: <PiEnvelopeSimpleBold />,
          description: "Send custom travel management proposal",
          user: {
            name: "Lily Williams",
            position: "VP Operations",
            email: "l.williams@nike.com",
            phone: "+1 (503) 555-4321",
            image: "/community/bec-ferguson.webp",
          },
        },
        {
          title: "Travel Booking",
          icon: <PiAirplaneTakeoffBold />,
          description: "Book flights to Portland HQ",
          user: {
            name: "Mark Jones",
            position: "CEO",
            email: "m.jones@nike.com",
            phone: "+1 (503) 555-8765",
            image: "/community/nicolas-trevino.webp",
          },
        },
      ],
    },
    {
      name: "Loom",
      logo: <SiLoom className="w-full h-full text-white" />,
      domain: "loom.com",
      location: "San Francisco",
      steps: [
        {
          title: "Lead Generation",
          icon: <PiUsersBold />,
          description: "Identified key stakeholders",
          user: {
            name: "Alex Rivera",
            position: "Sales Director",
            email: "a.rivera@loom.com",
            phone: "+1 (415) 555-2345",
            image: "/community/owen-harding.webp",
          },
        },
        {
          title: "Product Demo",
          icon: <PiLinkBold />,
          description: "Virtual product demonstration",
          user: {
            name: "Jamie Lee",
            position: "Product Manager",
            email: "j.lee@loom.com",
            phone: "+1 (415) 555-7890",
            image: "/community/isobel-fuller.webp",
          },
        },
        {
          title: "Contract Review",
          icon: <PiHandshakeBold />,
          description: "Legal team reviewing terms",
          user: {
            name: "Taylor Smith",
            position: "Legal Counsel",
            email: "t.smith@loom.com",
            phone: "+1 (415) 555-3456",
            image: "/community/adil-floyd.webp",
          },
        },
        {
          title: "Implementation",
          icon: <PiCheckCircleBold />,
          description: "Setting up travel management system",
          user: {
            name: "Jordan Patel",
            position: "IT Director",
            email: "j.patel@loom.com",
            phone: "+1 (415) 555-9012",
            image: "/community/byron-robertson.webp",
          },
        },
      ],
    },
    {
      name: "ElevenLabs",
      logo: <SiElevenlabs className="w-full h-full text-white" />,
      domain: "elevenlabs.io",
      location: "New York City",
      steps: [
        {
          title: "Referral",
          icon: <PiHandshakeBold />,
          description: "Introduced through mutual connection",
          user: {
            name: "Mia Rodriguez",
            position: "Business Development",
            email: "m.rodriguez@elevenlabs.io",
            phone: "+1 (212) 555-5678",
            image: "/community/ashton-blackwell.webp",
          },
        },
        {
          title: "Needs Assessment",
          icon: <PiChartBarBold />,
          description: "Analyzing voice AI travel requirements",
          user: {
            name: "Noah Kim",
            position: "AI Solutions Architect",
            email: "n.kim@elevenlabs.io",
            phone: "+1 (212) 555-8901",
            image: "/community/jordan-burgess.webp",
          },
        },
        {
          title: "Proposal",
          icon: <PiEnvelopeSimpleBold />,
          description: "Custom AI voice solution presentation",
          user: {
            name: "Emma Chen",
            position: "Product Lead",
            email: "e.chen@elevenlabs.io",
            phone: "+1 (212) 555-2345",
            image: "/community/bec-ferguson.webp",
          },
        },
        {
          title: "Integration",
          icon: <PiCheckCircleBold />,
          description: "Implementing voice AI for travel bookings",
          user: {
            name: "Liam Johnson",
            position: "Integration Specialist",
            email: "l.johnson@elevenlabs.io",
            phone: "+1 (212) 555-6789",
            image: "/community/nicolas-trevino.webp",
          },
        },
      ],
    },
    {
      name: "Vercel",
      logo: <SiVercel className="w-full h-full text-white" />,
      domain: "vercel.com",
      location: "San Francisco",
      steps: [
        {
          title: "Inbound Request",
          icon: <PiEnvelopeSimpleBold />,
          description: "Team reached out via website",
          user: {
            name: "Sophia Martinez",
            position: "Operations Manager",
            email: "s.martinez@vercel.com",
            phone: "+1 (415) 555-3456",
            image: "/community/isobel-fuller.webp",
          },
        },
        {
          title: "Discovery Call",
          icon: <PiPhoneBold />,
          description: "Initial requirements gathering",
          user: {
            name: "Ethan Wilson",
            position: "Engineering Lead",
            email: "e.wilson@vercel.com",
            phone: "+1 (415) 555-7890",
            image: "/community/owen-harding.webp",
          },
        },
        {
          title: "Proposal",
          icon: <PiHandshakeBold />,
          description: "Tailored travel management solution",
          user: {
            name: "Olivia Brown",
            position: "Finance Director",
            email: "o.brown@vercel.com",
            phone: "+1 (415) 555-1234",
            image: "/community/adil-floyd.webp",
          },
        },
        {
          title: "Onboarding",
          icon: <PiCheckCircleBold />,
          description: "Setting up accounts and training",
          user: {
            name: "William Davis",
            position: "HR Manager",
            email: "w.davis@vercel.com",
            phone: "+1 (415) 555-5678",
            image: "/community/byron-robertson.webp",
          },
        },
      ],
    },
    {
      name: "Amazon",
      logo: <SiAmazon className="w-full h-full text-white" />,
      domain: "amazon.com",
      location: "Seattle, Washington",
      steps: [
        {
          title: "Enterprise Outreach",
          icon: <PiChatCircleBold />,
          description: "Initial contact with procurement team",
          user: {
            name: "Daniel Park",
            position: "Global Travel Director",
            email: "d.park@amazon.com",
            phone: "+1 (206) 555-4321",
            image: "/community/scott-clayton.webp",
          },
        },
        {
          title: "Budget Analysis",
          icon: <PiCurrencyDollarBold />,
          description: "Travel spend assessment and optimization",
          user: {
            name: "Rachel Green",
            position: "Finance Manager",
            email: "r.green@amazon.com",
            phone: "+1 (206) 555-8765",
            image: "/community/ammar-foley.webp",
          },
        },
        {
          title: "Executive Presentation",
          icon: <PiPresentationChartBold />,
          description: "Solution presentation to leadership",
          user: {
            name: "Thomas Wright",
            position: "VP Corporate Services",
            email: "t.wright@amazon.com",
            phone: "+1 (206) 555-9876",
            image: "/community/adil-floyd.webp",
          },
        },
        {
          title: "Global Rollout",
          icon: <PiAirplaneTakeoffBold />,
          description: "Implementing solution across regions",
          user: {
            name: "Jennifer Lopez",
            position: "Implementation Lead",
            email: "j.lopez@amazon.com",
            phone: "+1 (206) 555-5432",
            image: "/community/isobel-fuller.webp",
          },
        },
      ],
    },
    {
      name: "Rockstar Games",
      logo: <SiRockstargames className="w-full h-full text-white" />,
      domain: "rockstargames.com",
      location: "New York City",
      steps: [
        {
          title: "Initial Inquiry",
          icon: <PiChatCircleBold />,
          description: "First contact from game development team",
          user: {
            name: "Jason Miller",
            position: "Studio Director",
            email: "j.miller@rockstargames.com",
            phone: "+1 (212) 555-7890",
            image: "/community/scott-clayton.webp",
          },
        },
        {
          title: "Requirements Analysis",
          icon: <PiChartBarBold />,
          description: "Analyzing global team travel needs",
          user: {
            name: "Victoria Chen",
            position: "Operations Lead",
            email: "v.chen@rockstargames.com",
            phone: "+1 (212) 555-3456",
            image: "/community/bec-ferguson.webp",
          },
        },
        {
          title: "Custom Solution",
          icon: <PiHandshakeBold />,
          description: "Tailored travel solution for game studios",
          user: {
            name: "Robert Garcia",
            position: "Finance Director",
            email: "r.garcia@rockstargames.com",
            phone: "+1 (212) 555-6789",
            image: "/community/adil-floyd.webp",
          },
        },
        {
          title: "Global Implementation",
          icon: <PiAirplaneTakeoffBold />,
          description: "Rolling out to studios worldwide",
          user: {
            name: "Samantha Lee",
            position: "Global Mobility Manager",
            email: "s.lee@rockstargames.com",
            phone: "+1 (212) 555-9012",
            image: "/community/isobel-fuller.webp",
          },
        },
      ],
    },
  ]

  return (
    <motion.div
      key="workflows"
      className="content-workflows space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Workflows Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white">Active Workflows</h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-[10px] font-medium text-white tracking-wide border border-white/20">
            <div className="w-4 h-4 rounded-md bg-black flex items-center justify-center text-white mr-2">
              <PiHandshakeBold className="h-2.5 w-2.5" />
            </div>
            {workflows.length} WORKFLOWS
          </span>
        </div>
      </div>

      {/* Mini Workflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {workflows.map((workflow, i) => (
          <WorkflowCard key={i} workflow={workflow} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
