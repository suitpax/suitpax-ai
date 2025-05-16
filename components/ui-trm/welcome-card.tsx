"use client"
import Image from "next/image"
import { PiCheckCircleBold, PiCalendarBold } from "react-icons/pi"

export const WelcomeCard = () => {
  return (
    <div className="bg-gradient-to-br from-black to-black/80 rounded-xl border border-white/10 p-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src="/agents/agent-5.png"
            alt="AI Assistant"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-medium tracking-tight text-white">Good morning, Alex!</h4>
          <p className="text-[10px] text-white/60 mt-0.5">
            I've prepared your travel dashboard. You have 3 pending tasks and 2 meetings today.
          </p>

          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-white/70">Weekly goal</span>
              <span className="text-[9px] font-medium text-white">68%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-0.5">
              <div className="bg-white h-0.5 rounded-full" style={{ width: "68%" }}></div>
            </div>
          </div>

          <div className="flex gap-2 mt-2.5">
            <button className="px-3 py-1.5 bg-white/10 text-white text-[9px] rounded-xl hover:bg-white/15 transition-colors flex items-center gap-1.5 border border-white/5">
              <PiCheckCircleBold className="w-3 h-3 text-white/80" />
              <span>View Tasks</span>
            </button>
            <button className="px-3 py-1.5 bg-black text-white text-[9px] rounded-xl hover:bg-black/80 transition-colors flex items-center gap-1.5 border border-white/5">
              <PiCalendarBold className="w-3 h-3 text-white/80" />
              <span>Meetings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-white/10">
        <p className="text-[9px] uppercase tracking-wider text-white/50 mb-1.5">Your team</p>
        <div className="flex gap-1.5">
          <div className="relative w-6 h-6 rounded-md overflow-hidden border border-white/10">
            <Image src="/community/jordan-burgess.webp" alt="Team Member" fill className="object-cover" />
          </div>
          <div className="relative w-6 h-6 rounded-md overflow-hidden border border-white/10">
            <Image src="/community/bec-ferguson.webp" alt="Team Member" fill className="object-cover" />
          </div>
          <div className="relative w-6 h-6 rounded-md overflow-hidden border border-white/10">
            <Image src="/community/nicolas-trevino.webp" alt="Team Member" fill className="object-cover" />
          </div>
          <div className="relative w-6 h-6 rounded-md overflow-hidden border border-white/10">
            <Image src="/community/isobel-fuller.webp" alt="Team Member" fill className="object-cover" />
          </div>
          <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-white/10 text-white text-[8px] border border-white/10">
            +3
          </div>
        </div>
      </div>
    </div>
  )
}
