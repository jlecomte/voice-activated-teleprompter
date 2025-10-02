import { useEffect, useLayoutEffect, useRef } from "react"
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
  selectScrollOffset,
} from "../navbar/navbarSlice"

import {
  selectRawText,
  selectTextElements,
  selectFinalTranscriptIndex,
  selectInterimTranscriptIndex,
} from "./contentSlice"

export const Content = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectStatus)
  const fontSize = useAppSelector(selectFontSize)
  const margin = useAppSelector(selectMargin)
  const opacity = useAppSelector(selectOpacity)
  const scrollOffset = useAppSelector(selectScrollOffset)
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
  const bottomSpacerRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      if (lastRef.current) {
        containerRef.current.scrollTo({
          top: Math.max(lastRef.current.offsetTop - scrollOffset, 0),
          behavior: "smooth",
        })
      } else {
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }
  })

  useLayoutEffect(() => {
    if (!containerRef.current || !bottomSpacerRef.current) {
      return
    }

    const containerHeight = containerRef.current.clientHeight
    bottomSpacerRef.current.style.height = `${scrollOffset + containerHeight}px`
  }, [scrollOffset, textElements.length])

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
          <div
            aria-hidden="true"
            ref={bottomSpacerRef}
            style={{ height: 0, flexShrink: 0 }}
          />
        </div>
      )}
    </main>
  )
}
