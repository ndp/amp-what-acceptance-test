
import _expectedMatches from './expected-results.json' assert { type: "json" }
const expectedMatches = _expectedMatches as Record<string, string|string[]>

/**
 * For a given query, `q`, what are some of the results?
 * 
 * Currently returned in no particular order.
 */
export function expectedMatchesFor(q: string) {
  return [(expectedMatches[q.toLowerCase()]) || q].flat()
}

