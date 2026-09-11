import { type TextElement, tokenize } from "./word-tokenizer"
import { levenshteinDistance } from "./levenshtein"

// This is the "secret sauce" of this whole project: a robust algorithm to
// match the reference text and the speech recognized text using the
// levenshtein distance.
//
// The match is found with a sliding-window comparison instead of growing
// prefixes only, so long texts and repeated passages (e.g. choruses) no
// longer cause the position to stall or jump backward.

// Maximum edit distance, as a fraction of the comparison string length,
// for a match to be accepted at all. Generous, because spoken (and sung)
// input is often slurred or mispronounced.
const CONFIDENCE_THRESHOLD = 0.50

// Per-token penalty added to matches that end behind the last known
// position. Helps pick the right occurrence when passages repeat.
const FORWARD_BIAS = 0.15

/**
 * Searches for the best matching position using a sliding window approach.
 * Compares the recognized text against each same-length substring in the
 * reference, and also against growing prefixes (useful at the very start
 * of the window).
 */
const findBestMatch = (
  comparison_string: string,
  recognizedCount: number,
  reference: TextElement[],
  startIndex: number,
  windowSize: number,
  lastKnownPosition: number,
): { index: number; distance: number } => {
  const reference_tokens = reference
    .slice(startIndex, startIndex + windowSize)
    .filter(element => element.type === "TOKEN")

  if (reference_tokens.length === 0) {
    return { index: -1, distance: Infinity }
  }

  const distances: number[] = []
  const adjustedDistances: number[] = [] // distances with forward bias applied

  // Sliding window: compare the recognized text against each substring of
  // the same length
  const windowLen = Math.min(recognizedCount, reference_tokens.length)

  for (let start = 0; start <= reference_tokens.length - windowLen; start++) {
    const reference_substring = reference_tokens
      .slice(start, start + windowLen)
      .reduce((acc, tok) => acc + " " + tok.value, "")
      .replace(/\s+/, " ")
      .trim()
    const dist = levenshteinDistance(comparison_string, reference_substring)
    distances.push(dist)

    // Apply forward bias: penalize matches that would move position backward
    const matchEndToken = reference_tokens[start + windowLen - 1]
    const tokensBack = lastKnownPosition - matchEndToken.index
    const bias = tokensBack > 0 ? tokensBack * FORWARD_BIAS : 0
    adjustedDistances.push(dist + bias)
  }

  // Also try growing prefixes from the start of the window (helps when the
  // recognized text is the first words of the window)
  for (
    let len = 1;
    len <= Math.min(recognizedCount * 2, reference_tokens.length);
    len++
  ) {
    const prefix = reference_tokens
      .slice(0, len)
      .reduce((acc, tok) => acc + " " + tok.value, "")
      .replace(/\s+/, " ")
      .trim()
    const dist = levenshteinDistance(comparison_string, prefix)
    distances.push(dist)

    const matchEndToken = reference_tokens[len - 1]
    const tokensBack = lastKnownPosition - matchEndToken.index
    const bias = tokensBack > 0 ? tokensBack * FORWARD_BIAS : 0
    adjustedDistances.push(dist + bias)
  }

  // Use adjusted distances for picking the best match, raw distances for
  // the threshold check
  const minAdjDist = Math.min(...adjustedDistances)
  const bestAdjIndex = adjustedDistances.indexOf(minAdjDist)
  const minDist = distances[bestAdjIndex] // raw distance at best adjusted position
  const threshold = comparison_string.length * CONFIDENCE_THRESHOLD

  if (minDist > threshold) {
    return { index: -1, distance: minDist }
  }

  // Map back from the distances array index to a reference token.
  // Sliding window entries come first, then prefix entries.
  const slidingCount = reference_tokens.length - windowLen + 1
  let token: TextElement

  if (bestAdjIndex < slidingCount) {
    // Match is in the sliding window — the matched substring ends at
    // bestAdjIndex + windowLen - 1
    token = reference_tokens[bestAdjIndex + windowLen - 1]
  } else {
    // Match is in the prefix section
    const prefixLen = bestAdjIndex - slidingCount + 1
    token = reference_tokens[prefixLen - 1]
  }

  return { index: token.index, distance: minDist }
}

export const computeSpeechRecognitionTokenIndex = (
  recognized: string,
  reference: TextElement[],
  lastRecognizedTokenIndex: number,
) => {
  // Tokenize the recognized input:
  const recognized_tokens = tokenize(recognized).filter(
    element => element.type === "TOKEN",
  )

  if (recognized_tokens.length === 0) {
    return lastRecognizedTokenIndex
  }

  // Convert the tokens back to a string:
  const comparison_string = recognized_tokens
    .reduce((acc, tok) => acc + " " + tok.value, "")
    .replace(/\s+/, " ")
    .trim()

  const startIndex = Math.max(0, lastRecognizedTokenIndex)

  // Step 1: normal forward search, with a lookback for stale context — the
  // comparison string may contain words from before lastRecognizedTokenIndex
  // (accumulated in recentFinalWords), so they need to be matchable too
  const lookback = recognized_tokens.length
  const normalStart = Math.max(0, startIndex - lookback)
  const normalWindow = Math.max(recognized_tokens.length * 3, 30) + lookback

  const normalMatch = findBestMatch(
    comparison_string,
    recognized_tokens.length,
    reference,
    normalStart,
    normalWindow,
    lastRecognizedTokenIndex,
  )
  if (normalMatch.index >= 0) {
    return normalMatch.index
  }

  // Step 2: recovery — a wider window including tokens before the last
  // position, for when recognition dropped or jumped around
  const recoveryLookback = 50
  const recoveryLookahead = Math.max(recognized_tokens.length * 6, 120)
  const recoveryStart = Math.max(0, startIndex - recoveryLookback)

  const recoveryMatch = findBestMatch(
    comparison_string,
    recognized_tokens.length,
    reference,
    recoveryStart,
    recoveryLookback + recoveryLookahead,
    lastRecognizedTokenIndex,
  )
  if (recoveryMatch.index >= 0) {
    return recoveryMatch.index
  }

  // No confident match found — stay put rather than guess
  return lastRecognizedTokenIndex
}
