import {
  SiAnthropic,
  SiGoogledrive,
  SiSlack,
  SiBrex,
  SiGmail,
  SiNotion,
  SiExpensify,
  SiRevolut,
  SiIntercom,
  SiBritishairways,
  SiAmericanairlines,
  SiUber,
  SiLyft,
  SiAirbnb,
  SiZoom,
  SiGooglecalendar,
} from "react-icons/si"
import Image from "next/image"

export interface UltraIntegrationProps {
  className?: string
  width?: string
  height?: string
  showConnections?: boolean
  lineMarkerSize?: number
  animateText?: boolean
  animateLines?: boolean
  animateMarkers?: boolean
  title?: string
  subtitle?: string
}

const UltraIntegration = ({
  className,
  width = "100%",
  height = "100%",
  showConnections = true,
  animateText = true,
  lineMarkerSize = 18,
  animateLines = true,
  animateMarkers = true,
  title = "Ultra Integration Platform",
  subtitle = "Unified API ecosystem powering global business travel operations",
}: UltraIntegrationProps) => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={40}
                height={10}
                className="h-2.5 w-auto mr-1"
              />
              MCP
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Enterprise Ready
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none">
            {title}
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-600 max-w-2xl mb-6">{subtitle}</p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mb-6 sm:mb-8">
            Our proprietary Multi-Channel Platform connects your business to 400+ airlines, premium hotels worldwide,
            and dozens of enterprise services through a unified API ecosystem, delivering seamless expense management
            and data integration for global travel operations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-16 mb-8">
          <div
            className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-1.5 sm:gap-2 max-w-3xl mx-auto"
            role="list"
            aria-label="Supported services and integrations"
          >
            <div
              key={0}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiRevolut
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Revolut</span>
            </div>
            <div
              key={1}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiIntercom
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Intercom</span>
            </div>
            <div
              key={2}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiBritishairways
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">British Airways</span>
            </div>
            <div
              key={3}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiAmericanairlines
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">American Airlines</span>
            </div>
            <div
              key={4}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiUber
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Uber</span>
            </div>
            <div
              key={5}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiLyft
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Lyft</span>
            </div>
            <div
              key={6}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiAirbnb
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Airbnb for Work</span>
            </div>
            <div
              key={7}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiGoogledrive
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Google Drive</span>
            </div>
            <div
              key={8}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiSlack
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Slack</span>
            </div>
            <div
              key={9}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiZoom
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Zoom</span>
            </div>
            <div
              key={10}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiAnthropic
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Anthropic</span>
            </div>
            <div
              key={11}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiExpensify
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Expensify</span>
            </div>
            <div
              key={12}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiGmail
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Gmail</span>
            </div>
            <div
              key={13}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiNotion
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Notion</span>
            </div>
            <div
              key={14}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiGooglecalendar
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Google Calendar</span>
            </div>
            <div
              key={15}
              className="flex flex-col items-center justify-center bg-gray-100 p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-sm aspect-square"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2), 0 0 3px rgba(255, 255, 255, 0.1)" }}
              role="listitem"
            >
              <SiBrex
                className="h-6 w-6 sm:h-7 sm:w-7 mb-0.5 text-gray-600"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))" }}
              />
              <span className="text-[5px] sm:text-[6px] font-medium text-gray-700">Brex</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UltraIntegration
