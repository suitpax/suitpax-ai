"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface CardFormProps {
  onSubmit?: (card: { cardholder: string; number: string; expMonth: string; expYear: string; cvc: string }) => void
}

export default function CardForm({ onSubmit }: CardFormProps) {
  const [cardholder, setCardholder] = useState("")
  const [number, setNumber] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")

  return (
    <div className="space-y-3">
      <div>
        <Label>Cardholder name</Label>
        <Input value={cardholder} onChange={(e) => setCardholder(e.target.value)} />
      </div>
      <div>
        <Label>Card number</Label>
        <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>MM</Label>
          <Input value={expMonth} onChange={(e) => setExpMonth(e.target.value)} placeholder="MM" />
        </div>
        <div>
          <Label>YYYY</Label>
          <Input value={expYear} onChange={(e) => setExpYear(e.target.value)} placeholder="YYYY" />
        </div>
        <div>
          <Label>CVC</Label>
          <Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => onSubmit?.({ cardholder, number, expMonth, expYear, cvc })} className="bg-black text-white hover:bg-gray-800">Submit</Button>
      </div>
    </div>
  )
}

