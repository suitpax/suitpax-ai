"use client"

import ChatInput from "./chat-input"

export default function TravelChatInput() {
  return <ChatInput onSend={(message) => console.log("TravelChatInput message:", message)} />
}