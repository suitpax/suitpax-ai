// Importamos la biblioteca Franc para detección de idiomas
import { franc } from "franc-min"
import ISO6391 from "iso-639-1"

// Mapa de códigos de idioma a códigos compatibles con ElevenLabs y reconocimiento de voz
const languageCodeMap: Record<string, { speechCode: string; name: string; nativeName: string }> = {
  eng: { speechCode: "en-US", name: "English", nativeName: "English" },
  spa: { speechCode: "es-ES", name: "Spanish", nativeName: "Español" },
  fra: { speechCode: "fr-FR", name: "French", nativeName: "Français" },
  deu: { speechCode: "de-DE", name: "German", nativeName: "Deutsch" },
  ita: { speechCode: "it-IT", name: "Italian", nativeName: "Italiano" },
  por: { speechCode: "pt-PT", name: "Portuguese", nativeName: "Português" },
  nld: { speechCode: "nl-NL", name: "Dutch", nativeName: "Nederlands" },
  rus: { speechCode: "ru-RU", name: "Russian", nativeName: "Русский" },
  jpn: { speechCode: "ja-JP", name: "Japanese", nativeName: "日本語" },
  cmn: { speechCode: "zh-CN", name: "Chinese", nativeName: "中文" },
  kor: { speechCode: "ko-KR", name: "Korean", nativeName: "한국어" },
}

// Idioma por defecto
const defaultLanguage = { speechCode: "en-US", name: "English", nativeName: "English" }

export interface DetectedLanguage {
  code: string
  speechCode: string
  name: string
  nativeName: string
  confidence: number
}

/**
 * Detecta el idioma de un texto dado
 * @param text Texto para detectar el idioma
 * @param minConfidence Confianza mínima requerida (0-1)
 * @returns Información del idioma detectado
 */
export function detectLanguage(text: string, minConfidence = 0.5): DetectedLanguage {
  if (!text || text.length < 10) {
    return {
      code: "eng",
      speechCode: defaultLanguage.speechCode,
      name: defaultLanguage.name,
      nativeName: defaultLanguage.nativeName,
      confidence: 1,
    }
  }

  try {
    // Detectar el idioma usando franc
    const [langCode, confidence] = franc(text, { minLength: 3, only: Object.keys(languageCodeMap) }) as [string, number]

    // Si la confianza es baja o no se detectó un idioma, usar el predeterminado
    if (langCode === "und" || confidence < minConfidence) {
      return {
        code: "eng",
        speechCode: defaultLanguage.speechCode,
        name: defaultLanguage.name,
        nativeName: defaultLanguage.nativeName,
        confidence: confidence,
      }
    }

    // Obtener información del idioma detectado
    const mappedLanguage = languageCodeMap[langCode] || defaultLanguage
    const iso639Name = ISO6391.getName(langCode.substring(0, 2))
    const iso639NativeName = ISO6391.getNativeName(langCode.substring(0, 2))

    return {
      code: langCode,
      speechCode: mappedLanguage.speechCode,
      name: iso639Name || mappedLanguage.name,
      nativeName: iso639NativeName || mappedLanguage.nativeName,
      confidence: confidence,
    }
  } catch (error) {
    console.error("Error detecting language:", error)
    return {
      code: "eng",
      speechCode: defaultLanguage.speechCode,
      name: defaultLanguage.name,
      nativeName: defaultLanguage.nativeName,
      confidence: 0,
    }
  }
}

/**
 * Verifica si un idioma es compatible con el reconocimiento de voz
 * @param languageCode Código del idioma a verificar
 * @returns Verdadero si el idioma es compatible
 */
export function isSupportedSpeechLanguage(languageCode: string): boolean {
  return Object.values(languageCodeMap).some((lang) => lang.speechCode === languageCode)
}

/**
 * Obtiene todos los idiomas soportados
 * @returns Lista de idiomas soportados
 */
export function getSupportedLanguages(): Array<{ speechCode: string; name: string; nativeName: string }> {
  return Object.values(languageCodeMap)
}
