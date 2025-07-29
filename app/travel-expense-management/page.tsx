import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  PiArrowRightBold,
  PiChartLineUpBold,
  PiCurrencyDollarBold,
  PiLightningBold,
  PiShieldCheckBold,
  PiClockBold,
  PiTrendUpBold,
  PiCheckCircleBold,
} from "react-icons/pi"

import BankConnection from "@/components/marketing/bank-connection"

export const metadata: Metadata = {
  title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
  description:
    "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
  keywords:
    "travel expense management, business travel expenses, automated expense reporting, AI expense tracking, corporate travel costs, expense automation",
  openGraph: {
    title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
    url: "https://suitpax.com/travel-expense-management",
    siteName: "Suitpax",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suitpax Travel Expense Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Expense Management | Suitpax - AI-Powered Business Travel Platform",
    description:
      "Simplify your business travel expense management with Suitpax's AI-powered tools, automated reporting, and seamless bank integrations. Reduce costs by up to 30%.",
    images: ["/twitter-image.png"],
    creator: "@suitpax",
  },
  alternates: {
    canonical: "https://suitpax.com/travel-expense-management",
  },
}

export default function TravelExpenseManagement() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
              <PiCurrencyDollarBold className="mr-1 h-3 w-3" />
              Gestión de Gastos de Viaje
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
              Automatiza la gestión de
              <br />
              <span className="text-gray-600">gastos de viaje</span>
            </h1>
            <p className="text-lg font-light text-gray-700 mb-8 max-w-3xl">
              Transforma la manera en que tu empresa maneja los gastos de viaje con nuestra plataforma de IA que
              automatiza el seguimiento, la aprobación y el reembolso de gastos empresariales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="#connect-bank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-black text-white font-medium transition-all hover:bg-gray-900 shadow-lg"
              >
                Conectar banco
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border border-gray-200 text-black font-medium transition-all hover:bg-gray-50 shadow-sm"
              >
                Ver características
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-5xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-lg">
              <Image
                src="/business-expense.png"
                alt="Panel de gestión de gastos de viaje"
                width={1200}
                height={675}
                className="w-full h-auto rounded-xl shadow-sm"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <PiTrendUpBold className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Ahorro promedio</p>
                  <p className="text-2xl font-bold text-black">30%</p>
                  <p className="text-xs text-gray-500">en gastos de viaje</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter mb-6">
              Optimiza tu flujo de trabajo
              <br />
              <span className="text-gray-600">de gastos empresariales</span>
            </h2>
            <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
              Nuestra plataforma elimina el papeleo manual y automatiza todo el proceso desde la transacción hasta el
              reembolso, ahorrando tiempo y reduciendo errores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Benefit 1 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <PiLightningBold className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-4">Captura Automática</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Importa y categoriza automáticamente las transacciones desde tus cuentas financieras conectadas. Sin más
                recibos perdidos o entrada manual de datos.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-gray-600">
                <PiCheckCircleBold className="h-4 w-4 mr-2 text-gray-400" />
                Integración bancaria en tiempo real
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <PiShieldCheckBold className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-4">Cumplimiento de Políticas</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Marca automáticamente los gastos que no cumplen con las políticas de viaje de tu empresa. Mantén el
                control y la transparencia en cada transacción.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-gray-600">
                <PiCheckCircleBold className="h-4 w-4 mr-2 text-gray-400" />
                Alertas inteligentes de política
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <PiChartLineUpBold className="h-7 w-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-4">Reportes Inteligentes</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Genera informes detallados de gastos con solo unos clics y obtén insights sobre patrones de gasto para
                optimizar tu presupuesto de viajes.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-gray-600">
                <PiCheckCircleBold className="h-4 w-4 mr-2 text-gray-400" />
                Analytics avanzados incluidos
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-center mb-12">
              Proceso simplificado en 4 pasos
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Conecta",
                  description: "Vincula tus cuentas bancarias y tarjetas corporativas de forma segura",
                },
                {
                  step: "02",
                  title: "Viaja",
                  description: "Realiza tus gastos de viaje normalmente, sin cambios en tu rutina",
                },
                {
                  step: "03",
                  title: "Automatiza",
                  description: "La IA categoriza y procesa automáticamente todos los gastos",
                },
                {
                  step: "04",
                  title: "Aprueba",
                  description: "Revisa y aprueba los reportes generados automáticamente",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bank Connection Section */}
      <div id="connect-bank">
        <BankConnection />
      </div>

      {/* ROI Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
                <PiChartLineUpBold className="mr-1 h-3 w-3" />
                Calculadora ROI
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter mb-6">
                Calcula tu ahorro
                <br />
                <span className="text-gray-600">potencial</span>
              </h2>
              <p className="text-lg font-light text-gray-700 mb-8">
                Nuestros clientes típicamente ahorran 30% en gastos de viaje a través de mejor cumplimiento de
                políticas, procesamiento automatizado y tarifas negociadas.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Reduce tiempo de procesamiento en 75%",
                  "Disminuye costos de viaje hasta 30%",
                  "Elimina 99% de errores en reportes",
                  "Mejora satisfacción de empleados",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <PiCheckCircleBold className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-light">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#connect-bank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-black text-white font-medium transition-all hover:bg-gray-900 shadow-lg"
              >
                Comenzar ahora
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-lg">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Procesamiento manual</p>
                    <p className="text-lg font-bold text-gray-900">€28.50</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-400 h-3 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Costo promedio por reporte de gastos</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Con automatización Suitpax</p>
                    <p className="text-lg font-bold text-gray-900">€7.25</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-700 h-3 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                  <p className="text-xs text-gray-700">75% reducción de costos</p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Ahorro anual para 100 empleados</p>
                    <p className="text-2xl font-bold text-black">€63,750</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Basado en promedio de 15 reportes de gastos por empleado anualmente
                  </p>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <PiClockBold className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Tiempo ahorrado</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">1,200 horas/año</p>
                  <p className="text-xs text-gray-500">Equivalente a 30 semanas de trabajo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter mb-6">
              ¿Listo para transformar la gestión
              <br />
              <span className="text-gray-400">de gastos de tu empresa?</span>
            </h2>
            <p className="text-white/70 font-light mb-8 max-w-3xl mx-auto text-lg">
              Únete a miles de empresas que han simplificado la gestión de gastos de viaje con Suitpax. Comienza tu
              transformación digital hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#connect-bank"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-black font-medium transition-all hover:bg-gray-100 shadow-lg"
              >
                Conectar banco
                <PiArrowRightBold className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-transparent border border-white/20 text-white font-medium transition-all hover:bg-white/10"
              >
                Ver precios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
