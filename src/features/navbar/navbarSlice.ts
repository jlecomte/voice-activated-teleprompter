import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export interface NavBarSliceState {
  status: "editing" | "started" | "stopped"
  horizontallyFlipped: boolean
  verticallyFlipped: boolean
  fontSize: number
  margin: number
  opacity: number
  scrollOffset: number
  language: string
}

export const SUPPORTED_LOCALES = {
  "en-US": "🇺🇸 English (USA)",
  "fr-FR": "🇫🇷 French (France)",
  "de-DE": "🇩🇪 German (Germany)",
  "it-IT": "🇮🇹 Italian (Italy)",
  "pt-BR": "🇧🇷 Portuguese (Brazil)",
  "es-ES": "🇪🇸 Spanish (Spain)",
}

// Detect browser language and default to pt-BR if Portuguese, otherwise en-US
const detectLanguage = (): string => {
  const savedLanguage = localStorage.getItem("teleprompter-language")
  if (savedLanguage) {
    return savedLanguage
  }

  if (SUPPORTED_LOCALES.hasOwnProperty(navigator.language)) {
    return navigator.language
  }

  // TODO: Try to find a "best match", for example if `navigator.language` is `fr-CA` or just `fr`...

  return "en-US"
}

const initialState: NavBarSliceState = {
  status: "stopped",
  horizontallyFlipped: false,
  verticallyFlipped: false,
  fontSize: 30,
  margin: 10,
  opacity: 80,
  scrollOffset: 100,
  language: detectLanguage(),
}

export const navbarSlice = createAppSlice({
  name: "navbar",

  // `createSlice` will infer the state type from the `initialState` argument
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    toggleEdit: create.reducer(state => {
      if (state.status === "editing") {
        state.status = "stopped"
      } else {
        state.status = "editing"
      }
    }),

    start: create.reducer(state => {
      state.status = "started"
    }),

    stop: create.reducer(state => {
      state.status = "stopped"
    }),

    flipHorizontally: create.reducer(state => {
      state.horizontallyFlipped = !state.horizontallyFlipped
    }),

    flipVertically: create.reducer(state => {
      state.verticallyFlipped = !state.verticallyFlipped
    }),

    setFontSize: create.reducer((state, action: PayloadAction<number>) => {
      state.fontSize = action.payload
    }),

    setMargin: create.reducer((state, action: PayloadAction<number>) => {
      state.margin = action.payload
    }),

    setOpacity: create.reducer((state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    }),

    setScrollOffset: create.reducer((state, action: PayloadAction<number>) => {
      state.scrollOffset = action.payload
    }),

    setLanguage: create.reducer((state, action: PayloadAction<string>) => {
      state.language = action.payload
      localStorage.setItem("teleprompter-language", action.payload)
    }),
  }),

  selectors: {
    selectStatus: state => state.status,
    selectFontSize: state => state.fontSize,
    selectMargin: state => state.margin,
    selectHorizontallyFlipped: state => state.horizontallyFlipped,
    selectVerticallyFlipped: state => state.verticallyFlipped,
    selectOpacity: state => state.opacity,
    selectScrollOffset: state => state.scrollOffset,
    selectLanguage: state => state.language,
  },
})

// Action creators are generated for each case reducer function.
export const {
  toggleEdit,
  start,
  stop,
  flipHorizontally,
  flipVertically,
  setFontSize,
  setMargin,
  setOpacity,
  setScrollOffset,
  setLanguage,
} = navbarSlice.actions

export const {
  selectStatus,
  selectFontSize,
  selectMargin,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectOpacity,
  selectScrollOffset,
  selectLanguage,
} = navbarSlice.selectors
