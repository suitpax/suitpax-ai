"use client"

import { motion } from "framer-motion"
import { PiSparkle, PiPhone, PiMicrophone, PiSpeakerHigh, PiGlobe } from "react-icons/pi"

export default function AIVoiceCallingHub() {
  return (
    <section className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            <PiSparkle className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">Voice AI Technology</em>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none mb-4">
            AI Voice <em className="font-serif italic text-emerald-950">Calling Hub</em>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mx-auto">
            Natural voice conversations with AI agents for instant travel bookings, changes, and support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PiPhone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Natural Conversations</h3>
                  <p className="text-sm font-light text-gray-600">
                    Speak naturally to book flights, hotels, and manage your entire business travel itinerary.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PiMicrophone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Multi-language Support</h3>
                  <p className="text-sm font-light text-gray-600">
                    Communicate in over 50 languages with real-time translation and cultural context awareness.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PiSpeakerHigh className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Instant Processing</h3>
                  <p className="text-sm font-light text-gray-600">
                    Real-time voice processing with sub-second response times for immediate travel assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PiGlobe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-black mb-2">24/7 Availability</h3>
                  <p className="text-sm font-light text-gray-600">
                    Always-on voice assistance across all time zones with consistent service quality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Voice Interface Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-sm"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiMicrophone className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter text-black mb-2">Try Voice Booking</h3>
              <p className="text-sm font-medium text-gray-500">
                <em className="font-serif italic">Tap to start speaking</em>
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>You:</strong> "Book me a flight from New York to London next Tuesday, business class"
                </p>
              </div>

              <div className="bg-black rounded-2xl p-4">
                <p className="text-sm text-white">
                  <strong>AI Agent:</strong> "I found 3 business class options. British Airways at 8:30 PM for $2,847
                  fits your company policy. Shall I book it?"
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>You:</strong> "Yes, book it and add lounge access"
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  <strong>✓ Booked:</strong> Flight confirmed with lounge access. Confirmation sent to your email.
                </p>
              </div>
            </div>

            <button className="w-full mt-6 py-3 px-4 bg-black text-white font-medium rounded-2xl hover:bg-gray-800 transition-colors tracking-tight flex items-center justify-center group">
              <PiPhone className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Start Voice Call
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">50+</div>
            <div className="text-xs font-medium text-gray-500">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">&lt;500ms</div>
            <div className="text-xs font-medium text-gray-500">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">99.9%</div>
            <div className="text-xs font-medium text-gray-500">Voice Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-medium tracking-tighter text-black mb-1">24/7</div>
            <div className="text-xs font-medium text-gray-500">Always Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
