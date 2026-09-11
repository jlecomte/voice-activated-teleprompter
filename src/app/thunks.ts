import type { AppThunk } from "./store"
import { start, stop } from "../features/navbar/navbarSlice"
import {
  setFinalTranscriptIndex,
  setInterimTranscriptIndex,
} from "../features/content/contentSlice"
import SpeechRecognizer from "../lib/speech-recognizer"
import { computeSpeechRecognitionTokenIndex } from "../lib/speech-matcher"

let speechRecognizer: SpeechRecognizer | null = null

// Accumulate recent recognized words for more robust matching.
// Chrome's continuous mode delivers short chunks; without context,
// the matcher cannot reliably place 1-3 word fragments in a long text.
const RECENT_WORDS_MAX = 40
let recentFinalWords: string[] = []

export const startTeleprompter = (): AppThunk => (dispatch, getState) => {
  dispatch(start())
  recentFinalWords = []

  const { language } = getState().navbar
  speechRecognizer = new SpeechRecognizer(language)

  if (!speechRecognizer.getIsSupported()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Speech recognition is not supported in this browser. The teleprompter will work in manual mode only.",
      )
    }
    return
  }

  speechRecognizer.onresult(
    (final_transcript: string, interim_transcript: string) => {
      const {
        textElements,
        finalTranscriptIndex: lastFinalTranscriptIndex,
      } = getState().content

      if (final_transcript !== "") {
        // Add new words to the recent history
        const newWords = final_transcript
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 0)
        recentFinalWords.push(...newWords)
        if (recentFinalWords.length > RECENT_WORDS_MAX) {
          recentFinalWords = recentFinalWords.slice(-RECENT_WORDS_MAX)
        }

        // Match using accumulated context for better accuracy
        const contextString = recentFinalWords.join(" ")
        const finalTranscriptIndex = computeSpeechRecognitionTokenIndex(
          contextString,
          textElements,
          lastFinalTranscriptIndex,
        )
        dispatch(setFinalTranscriptIndex(finalTranscriptIndex - 1))

        // Trim history after a successful advance — keep enough context for
        // disambiguation, but not so much that stale words inflate the
        // comparison string
        if (finalTranscriptIndex > lastFinalTranscriptIndex) {
          recentFinalWords = recentFinalWords.slice(-5)
        }
      }

      if (interim_transcript !== "") {
        // Combine recent final words with the current interim text for
        // real-time tracking
        const interimWords = interim_transcript
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 0)
        const combined = [...recentFinalWords, ...interimWords].join(" ")
        const interimTranscriptIndex = computeSpeechRecognitionTokenIndex(
          combined,
          textElements,
          lastFinalTranscriptIndex,
        )
        dispatch(setInterimTranscriptIndex(interimTranscriptIndex - 1))
      }
    },
  )

  speechRecognizer.start()
}

export const stopTeleprompter = (): AppThunk => dispatch => {
  if (speechRecognizer !== null) {
    speechRecognizer.stop()
    speechRecognizer = null
  }

  recentFinalWords = []
  dispatch(stop())
}

export const changeLanguage = (language: string): AppThunk => dispatch => {
  if (speechRecognizer !== null) {
    speechRecognizer.setLanguage(language)
  }
}
