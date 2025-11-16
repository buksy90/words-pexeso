/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T,>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

export function voidWarning(..._args: any[]): void {
  console.warn(..._args);
}