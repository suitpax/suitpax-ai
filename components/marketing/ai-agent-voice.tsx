import type React from "react"
import VantaCloudsBackground from "../vanta-clouds-background"

interface AiAgentVoiceProps {
  children: React.ReactNode
}

const AiAgentVoice: React.FC<AiAgentVoiceProps> = ({ children }) => {
  return <VantaCloudsBackground>{children}</VantaCloudsBackground>
}

export default AiAgentVoice
