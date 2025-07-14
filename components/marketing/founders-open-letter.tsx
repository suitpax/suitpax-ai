"use client"

import { PiArrowUpRightBold } from "react-icons/pi"
import { motion } from "framer-motion"
import Image from "next/image"

export function FoundersOpenLetter() {
  return (
    <section className="relative w-full py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-medium tracking-tighter text-black">Founders Open Letter</h2>
          <p className="mt-2 text-sm text-gray-600">
            A message from our founder about our vision and commitment to innovation
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 max-w-4xl rounded-2xl bg-black p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col space-y-8">
            {/* Azburillo */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/team/azburillo.jpeg"
                    alt="Antonio"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-medium text-white">Antonio Z. Burillo</h3>
                    <p className="text-xs text-gray-400">CEO & Founder</p>
                  </div>
                </div>
                <a
                  href="https://twitter.com/azburillo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
                >
                  <span>@azburillo</span>
                  <PiArrowUpRightBold className="h-3 w-3" />
                </a>
              </div>
              <div className="text-sm leading-relaxed text-gray-300">
                <p className="mb-4">
                  As a founder, I believe in creating technology that genuinely enhances human capabilities
                  rather than replacing them. This vision drove me to create Suitpax, where we're leveraging
                  AI to augment human decision-making in business travel.
                </p>
                <p className="mb-4">
                  Our mission is to revolutionize corporate travel by making it more efficient,
                  cost-effective, and enjoyable. We're building a platform that understands and adapts to
                  your unique travel needs, while ensuring compliance and maximizing cost savings.
                </p>
                <p>
                  Join us in shaping the future of business travel. Together, we can create a more
                  connected and efficient world of corporate travel.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FoundersOpenLetter