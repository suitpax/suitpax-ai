// Detección simple de idioma basada en patrones comunes
interface LanguageDetection {
  code: string
  speechCode: string
  name: string
  nativeName: string
  confidence: number
}

const LANGUAGE_PATTERNS = {
  "es-ES": {
    patterns: [
      /\b(el|la|los|las|un|una|de|del|en|con|por|para|que|es|son|está|están|hola|gracias|por favor)\b/gi,
      /\b(vuelo|hotel|viaje|reserva|aeropuerto|avión)\b/gi,
    ],
    name: "Spanish",
    nativeName: "Español",
  },
  "en-US": {
    patterns: [
      /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|that|this|is|are|was|were|hello|thanks|please)\b/gi,
      /\b(flight|hotel|travel|booking|airport|plane)\b/gi,
    ],
    name: "English",
    nativeName: "English",
  },
  "fr-FR": {
    patterns: [
      /\b(le|la|les|un|une|de|du|des|en|avec|pour|que|est|sont|bonjour|merci|s'il vous plaît)\b/gi,
      /\b(vol|hôtel|voyage|réservation|aéroport|avion)\b/gi,
    ],
    name: "French",
    nativeName: "Français",
  },
  "de-DE": {
    patterns: [
      /\b(der|die|das|ein|eine|von|mit|für|dass|ist|sind|hallo|danke|bitte)\b/gi,
      /\b(flug|hotel|reise|buchung|flughafen|flugzeug)\b/gi,
    ],
    name: "German",
    nativeName: "Deutsch",
  },
}

export function detectLanguage(text: string): LanguageDetection {
  if (!text || text.trim().length < 3) {
    return {
      code: "en-US",
      speechCode: "en-US",
      name: "English",
      nativeName: "English",
      confidence: 0.5,
    }
  }

  const results: Array<{ code: string; confidence: number }> = []

  for (const [langCode, langData] of Object.entries(LANGUAGE_PATTERNS)) {
    let matches = 0
    let totalWords = 0

    for (const pattern of langData.patterns) {
      const patternMatches = text.match(pattern) || []
      matches += patternMatches.length
    }

    const words = text.split(/\s+/).filter((word) => word.length > 2)
    totalWords = words.length

    const confidence = totalWords > 0 ? Math.min(matches / totalWords, 1) : 0

    results.push({ code: langCode, confidence })
  }

  // Encontrar el idioma con mayor confianza
  const bestMatch = results.reduce((best, current) => (current.confidence > best.confidence ? current : best))

  const langData = LANGUAGE_PATTERNS[bestMatch.code as keyof typeof LANGUAGE_PATTERNS]

  return {
    code: bestMatch.code,
    speechCode: bestMatch.code,
    name: langData.name,
    nativeName: langData.nativeName,
    confidence: bestMatch.confidence,
  }
}

export function getSupportedLanguages() {
  return Object.entries(LANGUAGE_PATTERNS).map(([code, data]) => ({
    code,
    speechCode: code,
    name: data.name,
    nativeName: data.nativeName,
  }))
}
