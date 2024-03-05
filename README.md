# Voice-Activated Teleprompter

I do not charge anything to create and maintain these open-source projects. But if you would like to say "thanks" for this project, feel free to send any amount through Paypal using the button below. I appreciate your support!

[![](donate.png)](https://www.paypal.com/donate/?hosted_button_id=49UXY8F6VVYFA)

This web-based single-page application (SPA) is a voice-activated teleprompter, i.e., it automatically scrolls the text you are reading as you are reading it. It is built using [Vite](https://vitejs.dev/), [React](https://react.dev/), [Redux](https://redux.js.org/), and [Bulma](https://bulma.io/). I routinely use it with my [Elgato Prompter](https://www.elgato.com/us/en/p/prompter) to create [my own YouTube videos](https://www.youtube.com/@darkskygeek). Such software already exists, but it is either rather expensive, or not robust enough. For example, the free online software created by Teleprompter Mirror [[link](https://telepromptermirror.com/telepromptersoftware.htm)] easily gets confused if you go off script or mispronounce too many words, and as a result, it will stop auto-scrolling. This is why I built this app.

**Note:** It is currently hard-coded to recognize American English speech (`en-US` locale) and was tested only in the Chrome web browser. It will likely not work in other web browsers!

You can try it live [here](https://jlecomte.github.io/voice-activated-teleprompter/dist/).
