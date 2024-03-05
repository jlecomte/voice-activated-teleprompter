import { type TextElement, tokenize } from "./word-tokenizer"
import { levenshteinDistance } from "./levenshtein"

// This is the "secret sauce" of this whole project: a robust algorithm to match
// the reference text and the speech recognized text using the levenshtein distance.
export const computeSpeechRecognitionTokenIndex = (
  recognized: string,
  reference: TextElement[],
  lastRecognizedTokenIndex: number,
) => {
  // Tokenize the recognized input:
  const recognized_tokens = tokenize(recognized).filter(
    element => element.type === "TOKEN",
  )

  // Convert the tokens back to a string:
  const comparison_string = recognized_tokens
    .reduce(
      (accumulator, currentToken) => accumulator + " " + currentToken.value,
      "",
    )
    .replace(/\s+/, " ")
    .trim()

  if (lastRecognizedTokenIndex < 0) {
    lastRecognizedTokenIndex = 0
  }

  // Now, let's pick the next few tokens from the reference text starting at the last recognized token index.
  // To simplify, we'll pluck recognized_tokens.length * 2 + 10, and we'll filter out the delimiters:
  const reference_tokens = reference
    .slice(
      lastRecognizedTokenIndex,
      lastRecognizedTokenIndex + recognized_tokens.length * 2 + 10,
    )
    .filter(element => element.type === "TOKEN")

  // Now, compute the levenshtein distances between the comparison string
  // and each possible substring created from the reference tokens:
  const distances: number[] = []

  let i = 0

  while (++i <= reference_tokens.length) {
    const reference_substring = reference_tokens
      .slice(0, i)
      .reduce(
        (accumulator, currentToken) => accumulator + " " + currentToken.value,
        "",
      )
      .replace(/\s+/, " ")
      .trim()
    distances.push(levenshteinDistance(comparison_string, reference_substring))
  }

  // Find the index of the minimum distance:
  const index = distances.indexOf(Math.min(...distances))

  // Trace that back to the token object:
  const token = reference_tokens[index]

  if (token) {
    return token.index
  }

  return lastRecognizedTokenIndex
}
