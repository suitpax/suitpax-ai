"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  PiXBold,
  PiCreditCardBold,
  PiAirplaneTakeoffBold,
  PiWalletBold,
  PiArrowUpRightBold,
  PiArrowDownLeftBold,
} from "react-icons/pi"

interface BankConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  bankName: string
  userName: string
}

// Lista de saludos alternativos
const greetingNames = ["Jules", "Sam", "Zion", "Alex", "Morgan", "Taylor", "Jordan", "Riley", "Casey", "Avery"]

// Lista de usuarios disponibles
const users = [
  {
    name: "Maya",
    role: "Business Travel",
    image: "/agents/agent-1.png",
  },
  {
    name: "Luna",
    role: "AI Engineer",
    image: "/agents/agent-2.png",
  },
  {
    name: "Sophia",
    role: "Notetaker",
    image: "/agents/agent-3.png",
  },
  {
    name: "Emma",
    role: "Expense Management",
    image: "/agents/agent-4.png",
  },
  {
    name: "Olivia",
    role: "VIP Airport",
    image: "/agents/agent-5.png",
  },
  {
    name: "Marcus",
    role: "Flights",
    image: "/agents/agent-6.png",
  },
  {
    name: "Hank",
    role: "Support Agent",
    image: "/agents/agent-7.png",
  },
  {
    name: "Noah",
    role: "Integrations",
    image: "/agents/agent-8.png",
  },
]

// Sample transactions for wallet
const recentTransactions = [
  {
    id: 1,
    type: "expense",
    description: "Uber to Airport",
    amount: "$24.50",
    date: "Today",
    category: "Transportation",
    icon: PiAirplaneTakeoffBold,
  },
  {
    id: 2,
    type: "expense",
    description: "Hotel Booking - Marriott",
    amount: "$345.00",
    date: "Yesterday",
    category: "Accommodation",
    icon: PiCreditCardBold,
  },
  {
    id: 3,
    type: "refund",
    description: "Flight Refund - Delta",
    amount: "$210.75",
    date: "Apr 5",
    category: "Travel",
    icon: PiArrowDownLeftBold,
  },
]

export const BankConnectionModal = ({ isOpen, onClose, bankName, userName }: BankConnectionModalProps) => {
  const [currentUser, setCurrentUser] = useState(0)
  const [greetingName, setGreetingName] = useState(userName)
  const [currentBenefit, setCurrentBenefit] = useState(0)
  const [walletBalance, setWalletBalance] = useState("$2,450.75")
  const [availableCredit, setAvailableCredit] = useState("$7,500.00")

  // Seleccionar un usuario aleatorio cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * users.length)
      setCurrentUser(randomIndex)

      // Seleccionar un nombre de saludo aleatorio
      const randomName =
        Math.random() > 0.5 ? userName : greetingNames[Math.floor(Math.random() * greetingNames.length)]
      setGreetingName(randomName)

      // Rotar los beneficios financieros
      const benefitInterval = setInterval(() => {
        setCurrentBenefit((prev) => (prev + 1) % 3)
      }, 4000)

      return () => {
        clearInterval(benefitInterval)
      }
    }
  }, [isOpen, userName])

  if (!isOpen) return null

  const user = users[currentUser]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></motion.div>

      <motion.div
        className="bg-white rounded-lg border border-gray-200 shadow-2xl p-6 max-w-sm w-full relative z-10"
        layoutId="connectionModal"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-700">Secure wallet connection</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <PiXBold className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Agent and greeting section */}
        <div className="flex items-center gap-3 mb-4 bg-gray-100/80 p-2.5 rounded-xl border border-gray-200/80">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-200/80">
            <Image
              src={user.image || "/placeholder.svg"}
              alt={user.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-medium text-sm">Hey {greetingName}!</h3>
            <p className="text-gray-600 text-xs">
              Your {bankName} wallet is ready. I'm {user.name}, your {user.role} specialist.
            </p>
          </div>
        </div>

        {/* Wallet balance section */}
        <div className="bg-gray-100/80 rounded-xl p-3 mb-3 border border-gray-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PiWalletBold className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-800">Suitpax Wallet</span>
            </div>
            <div className="bg-gray-300 px-2.5 py-0.25 rounded-md border border-gray-400/50 hover:bg-gray-400 transition-colors flex items-center justify-center">
              <span className="text-[9px] font-medium text-black">Active</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-[10px] text-gray-600">Available Balance</p>
              <p className="text-lg font-bold text-gray-800">{walletBalance}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600">Available Credit</p>
              <p className="text-sm font-medium text-gray-600">{availableCredit}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[10px] font-medium py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors">
              <PiArrowUpRightBold className="h-2.5 w-2.5" />
              Send Money
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[10px] font-medium py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors">
              <PiArrowDownLeftBold className="h-2.5 w-2.5" />
              Request
            </button>
          </div>
        </div>

        {/* Virtual card section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 mb-3 border border-gray-200/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-300/20 rounded-full -mt-12 -mr-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-300/10 rounded-full -mb-8 -ml-8"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1.5">
                <PiCreditCardBold className="h-3.5 w-3.5 text-gray-700" />
                <span className="text-xs font-medium text-gray-800">Virtual Card</span>
              </div>
              <div className="bg-gray-300 px-2.5 py-0.25 rounded-md border border-gray-400/50 hover:bg-gray-400 transition-colors flex items-center justify-center">
                <span className="text-[9px] font-medium text-black">Business</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-[10px] text-gray-600 mb-0.5">Card Number</p>
              <p className="text-xs text-gray-800 font-mono">•••• •••• •••• 4582</p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">Expiry</p>
                <p className="text-xs text-gray-800">05/28</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">CVV</p>
                <p className="text-xs text-gray-800">•••</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">Status</p>
                <div className="flex items-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse"></div>
                  <p className="text-xs text-gray-800">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="py-1.5 px-3 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium border border-gray-300 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Close
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="py-1.5 px-3 bg-transparent text-black rounded-lg text-xs font-medium border border-black hover:bg-gray-100 transition-colors"
          >
            Manage Wallet
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BankConnectionModal
