import { useEffect, useRef } from "react"
import { escape } from "html-escaper"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setContent, setFinalTranscriptIndex, setInterimTranscriptIndex } from "./contentSlice"

import {
  selectStatus,
  selectHorizontallyFlipped,
  selectVerticallyFlipped,
  selectFontSize,
  selectMargin,
  selectOpacity,
} from "../navbar/navbarSlice"

import {
  selectRawText,
  selectTextElements,
  selectFinalTranscriptIndex,
  selectInterimTranscriptIndex,
} from "./contentSlice"

import { startTeleprompter, stopTeleprompter } from "../../app/thunks"

export const Content = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectStatus)
  const fontSize = useAppSelector(selectFontSize)
  const margin = useAppSelector(selectMargin)
  const opacity = useAppSelector(selectOpacity)
  const horizontallyFlipped = useAppSelector(selectHorizontallyFlipped)
  const verticallyFlipped = useAppSelector(selectVerticallyFlipped)
  const rawText = useAppSelector(selectRawText)
  const textElements = useAppSelector(selectTextElements)
  const finalTranscriptIndex = useAppSelector(selectFinalTranscriptIndex)
  const interimTranscriptIndex = useAppSelector(selectInterimTranscriptIndex)

  const style = {
    fontSize: `${fontSize}px`,
    padding: `0 ${margin}px`,
  }

  const containerRef = useRef<null | HTMLDivElement>(null)
  const lastRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      if (lastRef.current) {
        containerRef.current.scrollTo({
          top: lastRef.current.offsetTop - 100,
          behavior: "smooth",
        })
      } else {
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      const maxIndex = textElements.length - 1;

      if (event.code === "Escape") {
        event.preventDefault();
        dispatch(stopTeleprompter());
      } else if (event.code === "Space") {
        event.preventDefault(); // Prevents scrolling when space is pressed
        if (status === "stopped") {
          dispatch(startTeleprompter());
        } else if (status === "started") {
          dispatch(stopTeleprompter());
        }
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        dispatch(setFinalTranscriptIndex(Math.max(-1, finalTranscriptIndex - 15)));
        dispatch(setInterimTranscriptIndex(Math.max(-1, interimTranscriptIndex - 15)));
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        dispatch(setFinalTranscriptIndex(Math.max(-1, finalTranscriptIndex - 5)));
        dispatch(setInterimTranscriptIndex(Math.max(-1, interimTranscriptIndex - 5)));
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        dispatch(setFinalTranscriptIndex(Math.min(maxIndex, finalTranscriptIndex + 15)));
        dispatch(setInterimTranscriptIndex(Math.min(maxIndex, interimTranscriptIndex + 15)));
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        dispatch(setFinalTranscriptIndex(Math.min(maxIndex, finalTranscriptIndex + 5)));
        dispatch(setInterimTranscriptIndex(Math.min(maxIndex, interimTranscriptIndex + 5)));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
     return () => {
     window.removeEventListener("keydown", handleKeyPress);
    };
  })

  return (
    <main className="content-area">
      {status === "editing" ? (
        <textarea
          className="content"
          style={style}
          value={rawText}
          onChange={e => dispatch(setContent(e.target.value || ""))}
        />
      ) : (
        <div
          className="content"
          ref={containerRef}
          style={{
            ...style,
            opacity: opacity / 100,
            transform: `scale(${horizontallyFlipped ? "-1" : "1"}, ${verticallyFlipped ? "-1" : "1"})`,
          }}
        >
          {textElements.map((textElement, index, array) => {
            const itemProps =
              interimTranscriptIndex > 0 &&
              index === Math.min(interimTranscriptIndex + 2, array.length - 1)
                ? { ref: lastRef }
                : {}
            return (
              <span
                key={textElement.index}
                onClick={() => {
                  dispatch(setFinalTranscriptIndex(index - 1))
                  dispatch(setInterimTranscriptIndex(index - 1))
                }}
                className={
                  finalTranscriptIndex > 0 &&
                  textElement.index <= finalTranscriptIndex + 1
                    ? "final-transcript"
                    : interimTranscriptIndex > 0 &&
                        textElement.index <= interimTranscriptIndex + 1
                      ? "interim-transcript"
                      : "has-text-white"
                }
                {...itemProps}
                dangerouslySetInnerHTML={{
                  __html: escape(textElement.value).replace(/\n/g, "<br>"),
                }}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
