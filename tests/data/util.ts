
import _expectedMatches from './expected-results.json' assert { type: "json" }
const expectedMatches = _expectedMatches as Record<string, string|string[]>

export function expectedMatchesFor(q: string) {
  console.log('q', q.toLowerCase())
  console.log('match? ', expectedMatches[q.toLowerCase()])
  return [(expectedMatches[q.toLowerCase()]) || q].flat()
}

