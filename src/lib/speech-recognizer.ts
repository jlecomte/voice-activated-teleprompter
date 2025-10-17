type SubscriberFunction = (
  final_transcript: string,
  interim_transcript: string,
) => void

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

const resolveSpeechRecognitionConstructor = (): (new () => SpeechRecognition) | null => {
  if (typeof window === "undefined") {
    return null
  }

  return (
    window.SpeechRecognition ??
    window.webkitSpeechRecognition ??
    null
  )
}

export default class SpeechRecognizer {
  private recognizer: SpeechRecognition
  private subscribers: SubscriberFunction[] = []
  private shouldListen = false
  private restartTimer: number | null = null

  constructor(language: string = "en-US") {
    const SpeechRecognitionConstructor = resolveSpeechRecognitionConstructor()

    if (!SpeechRecognitionConstructor) {
      throw new Error("Speech recognition API is not available in this browser")
    }

    this.recognizer = new SpeechRecognitionConstructor()

    this.recognizer.lang = language
    this.recognizer.continuous = true
    this.recognizer.interimResults = true

    this.recognizer.onresult = e => {
      let final_transcript = ""
      let interim_transcript = ""

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const result = e.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          final_transcript += transcript
        } else {
          interim_transcript += transcript
        }
      }

      for (let subscriber of this.subscribers) {
        subscriber(final_transcript, interim_transcript)
      }
    }

    this.recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("Speech recognition error", event)
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        this.shouldListen = false
        return
      }

      if (this.shouldListen) {
        this.scheduleRestart()
      }
    }

    this.recognizer.onend = () => {
      if (this.shouldListen) {
        this.scheduleRestart()
      }
    }
  }

  start(): void {
    this.shouldListen = true
    this.clearRestartTimer()

    try {
      this.recognizer.start()
    } catch (error) {
      console.warn("Speech recognition start failed", error)
      if (this.shouldListen) {
        this.scheduleRestart()
      }
    }
  }

  stop(): void {
    this.shouldListen = false
    this.clearRestartTimer()
    this.recognizer.stop()
  }

  onresult(subscriber: SubscriberFunction): void {
    this.subscribers.push(subscriber)
  }

  setLanguage(language: string): void {
    const wasListening = this.shouldListen
    if (wasListening) {
      this.stop()
    }
    this.recognizer.lang = language
    if (wasListening) {
      this.start()
    }
  }

  private scheduleRestart() {
    this.clearRestartTimer()
    const restartDelayMs = 500

    this.restartTimer = window.setTimeout(() => {
      if (this.shouldListen) {
        try {
          this.recognizer.start()
        } catch (error) {
          console.warn("Speech recognition restart failed", error)
          this.scheduleRestart()
        }
      }
    }, restartDelayMs)
  }

  private clearRestartTimer() {
    if (this.restartTimer !== null) {
      clearTimeout(this.restartTimer)
      this.restartTimer = null
    }
  }
}
