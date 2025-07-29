"use client"

export function detectLanguage(text: string): { language: string; speechCode: string; confidence: number } {
  const spanishWords = [
    "el",
    "la",
    "de",
    "que",
    "y",
    "a",
    "en",
    "un",
    "es",
    "se",
    "no",
    "te",
    "lo",
    "le",
    "da",
    "su",
    "por",
    "son",
    "con",
    "para",
    "al",
    "una",
    "su",
    "del",
    "las",
    "los",
  ]
  const englishWords = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let spanishCount = 0
  let englishCount = 0

  words.forEach((word) => {
    if (spanishWords.includes(word)) spanishCount++
    if (englishWords.includes(word)) englishCount++
  })

  const total = spanishCount + englishCount
  if (total === 0) {
    return { language: "English", speechCode: "en-US", confidence: 0 }
  }

  if (spanishCount > englishCount) {
    return {
      language: "Spanish",
      speechCode: "es-ES",
      confidence: spanishCount / total,
    }
  } else {
    return {
      language: "English",
      speechCode: "en-US",
      confidence: englishCount / total,
    }
  }
}
