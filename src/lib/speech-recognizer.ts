type SubscriberFunction = (
  final_transcript: string,
  interim_transcript: string,
) => void

export default class SpeechRecognizer {
  private recognizer: SpeechRecognition
  private subscribers: SubscriberFunction[] = []
  private shouldListen: Boolean = false

  constructor(language: string = "en-US") {
    this.recognizer = new webkitSpeechRecognition()

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

    this.recognizer.onend = () => {
      if (this.shouldListen) {
        this.recognizer.start()
      }
    }
  }

  start(): void {
    this.shouldListen = true
    this.recognizer.start()
  }

  stop(): void {
    this.shouldListen = false
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
}
