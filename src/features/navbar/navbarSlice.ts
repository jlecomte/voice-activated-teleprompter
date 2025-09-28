import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

export interface NavBarSliceState {
  status: "editing" | "started" | "stopped"
  horizontallyFlipped: boolean
  verticallyFlipped: boolean
  fontSize: number
  margin: number
  opacity: number
  language: string
}

// Detect browser language and default to pt-BR if Portuguese, otherwise en-US
const detectLanguage = (): string => {
  const savedLanguage = localStorage.getItem("teleprompter-language")
  if (savedLanguage) return savedLanguage

  const browserLang = navigator.language || navigator.languages?.[0] || "en-US"
  return browserLang.startsWith("pt") ? "pt-BR" : "en-US"
}

const initialState: NavBarSliceState = {
  status: "stopped",
  horizontallyFlipped: false,
  verticallyFlipped: false,
  fontSize: 30,
  margin: 10,
  opacity: 80,
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
  setLanguage,
} = navbarSlice.actions

export const {
  selectStatus,
  selectFontSize,
  selectMargin,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectOpacity,
  selectLanguage,
} = navbarSlice.selectors
