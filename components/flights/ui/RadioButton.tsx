"use client"

interface Props {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
}

export default function RadioButton({ checked, onChange, label }: Props) {
  return (
    <label className="radio">
      <span className="radio-input" data-checked={checked} onClick={() => onChange(!checked)} />
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  )
}