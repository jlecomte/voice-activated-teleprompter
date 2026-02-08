# Voice-Activated Teleprompter

I do not charge anything to create and maintain these open-source projects. But if you would like to say "thanks" for this project, feel free to send any amount through Paypal using the button below. I appreciate your support!

[![](donate.png)](https://www.paypal.com/donate/?hosted_button_id=49UXY8F6VVYFA)

This web-based single-page application (SPA) is a voice-activated teleprompter, i.e., it automatically scrolls the text you are reading as you are reading it. It is built using [Vite](https://vitejs.dev/), [React](https://react.dev/), [Redux](https://redux.js.org/), and [Bulma](https://bulma.io/). I routinely use it with my [Elgato Prompter](https://www.elgato.com/us/en/p/prompter) to create [my own YouTube videos](https://www.youtube.com/@darkskygeek). Such software already exists, but it is either rather expensive, or not robust enough. For example, the free online software created by Teleprompter Mirror [[link](https://telepromptermirror.com/telepromptersoftware.htm)] easily gets confused if you go off script or mispronounce too many words, and as a result, it will stop auto-scrolling. This is why I built this app.

**Note:** It supports Dutch, English, French, German, Italian, Brazilian Portuguese, and Spanish speech recognition. The app automatically detects your browser language and defaults accordingly, but you can manually select your preferred language using the dropdown in the toolbar. It was tested only in the Chrome web browser and may not work in other web browsers!

You can try it live [here](https://jlecomte.github.io/voice-activated-teleprompter/dist/).

**Instructions:** Once you've opened the live demo, click on the `Edit` button in the toolbar. Paste your script into the content area and click on the `Edit` button again to validate. Then, click on the `Play` button in the toolbar and start reading your script. If you need to take a break, you can click on the `Stop` button at any time, and then later resume the transcription by clicking on the `Play` button again. You can also click on individual words in your script to reset the transcription to a specific index in case you need to re-read a section of your script.

**Hints:** You can add inline hints to your script by wrapping text in square brackets, e.g. `[pause here]` or `[look at camera]`. Hints are displayed in the teleprompter text but are ignored by the speech recognition engine, so they won't interfere with auto-scrolling.

**Keyboard Shortcuts:** While the teleprompter is running (not in edit mode), the following keyboard shortcuts are available:

| Key | Action |
|-----|--------|
| `Space` | Start/stop the teleprompter |
| `Escape` | Stop the teleprompter |
| `Arrow Up` | Jump back 15 words |
| `Arrow Down` | Jump forward 15 words |
| `Arrow Left` | Jump back 5 words |
| `Arrow Right` | Jump forward 5 words |
