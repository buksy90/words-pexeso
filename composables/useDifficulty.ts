export function useDifficulty(difficulty: Difficulty) {
  const { active } = useCharacters();

  return {
    getPermittedLetters(correctWord: string): string[] {
      // Pick extra letters from available letters
      const extraLeters = active.value
            .filter((char) => !correctWord.includes(char))
            .sort(() => 0.5 - Math.random());

      switch (difficulty) {
        case 'medium':
          return shuffleArray(correctWord.split('').concat(extraLeters.slice(0, 2)))
        case 'hard':
          return shuffleArray(correctWord.split('').concat(extraLeters.slice(0, 5)))
        case 'easy':
        default:
          return shuffleArray(correctWord.split(''))
      }
    }
  }
}
