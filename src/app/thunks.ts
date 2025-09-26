import type { AppThunk } from "./store"
import { start, stop } from "../features/navbar/navbarSlice"
import {
  setFinalTranscriptIndex,
  setInterimTranscriptIndex,
} from "../features/content/contentSlice"
import SpeechRecognizer from "../lib/speech-recognizer"
import { computeSpeechRecognitionTokenIndex } from "../lib/speech-matcher"

let speechRecognizer: SpeechRecognizer | null = null

export const startTeleprompter = (): AppThunk => (dispatch, getState) => {
  dispatch(start())

  const { language } = getState().navbar
  speechRecognizer = new SpeechRecognizer(language)

  speechRecognizer.onresult(
    (final_transcript: string, interim_transcript: string) => {
      const {
        textElements,
        finalTranscriptIndex: lastFinalTranscriptIndex,
        interimTranscriptIndex: lastInterimTranscriptIndex,
      } = getState().content

      if (final_transcript !== "") {
        const finalTranscriptIndex = computeSpeechRecognitionTokenIndex(
          final_transcript,
          textElements,
          lastFinalTranscriptIndex,
        )
        dispatch(setFinalTranscriptIndex(finalTranscriptIndex))
      }

      if (interim_transcript !== "") {
        const interimTranscriptIndex = computeSpeechRecognitionTokenIndex(
          interim_transcript,
          textElements,
          lastFinalTranscriptIndex,
        )
        dispatch(setInterimTranscriptIndex(interimTranscriptIndex))
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

  dispatch(stop())
}

export const changeLanguage = (language: string): AppThunk => dispatch => {
  if (speechRecognizer !== null) {
    speechRecognizer.setLanguage(language)
  }
}
