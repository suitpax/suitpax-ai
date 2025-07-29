import ContactForm from "@/components/marketing/contact-form"
import Image from "next/image"

export default function ContactPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/placeholder.svg?width=1920&height=1080"
        alt="background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <ContactForm />
      </div>
    </div>
  )
}
