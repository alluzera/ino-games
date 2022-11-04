
type WinningCombinationsResult = [number, number[]][];

type CombinatorConfig = {
  minToSequence: number;
  wildSymbol: number;
  payingSymbols: Array<number>;
  nonPayingSymbols: Array<number>;
}

/**
 * Combinator configuration. Has all information needed to check a winning combination.
 * @param minToSequence It's the minimum number of paying symbols on sequence to form a pay line.
 * @param wildSymbol It's the wild symbol. It forms a pay line with any other paying symbol.
 * @param payingSymbols They're the the paying symbols, they form a pay line with a sequence.
 * @param nonPayingSymbols They're the non-paying symbols, they don't form any pay line.
 */
const combinatorConfig: CombinatorConfig = {
  minToSequence: 3,
  wildSymbol: 0,
  payingSymbols: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  nonPayingSymbols: [10, 11, 12, 13, 14, 15],
};

/**
 * This functin check if the next symbol is valid for the actual sequence of symbols.
 * This function receives an array relative to the slot machine input, and two indexs.
 * @param lines The actual Array of numbers on input the slot machine.
 * @param idx Index of the slot machine input that is being tested.
 * @param nextIndex Index that limit the size of the sample of the input to be a valid sequence.
 * @returns number representing the symbol for the actual sequence.
 */
function checkNextSymbol(lines: number[], idx: number, nextIndex: number): boolean {
  const nextSymbols = lines.slice(idx, idx + nextIndex + 1);
  const currentSymbol = lines[idx + nextIndex];

  return (nextSymbols.filter(e => e !== 0).every(e => e === currentSymbol || currentSymbol === 0) && idx + nextIndex < lines.length);
}

function call(lines: number[]): WinningCombinationsResult {
  const result: WinningCombinationsResult = [];
  const symbolIndex: Array<number> = [];
  let symbol: number | undefined;
  let sequence: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line < combinatorConfig.nonPayingSymbols[0]) {
      if (line !== symbol) {
        const currentSymbols = lines.slice(i, i + 3);
        const currentSequence = new Set(currentSymbols.filter(e => e !== combinatorConfig.wildSymbol));
        const symbolsSum = currentSymbols.reduce((pV, cV)=> pV + cV);

        if ((currentSequence.size === 1 || symbolsSum === 0) && i + 2 < lines.length) {
          symbol = currentSymbols.find(e => e !== combinatorConfig.wildSymbol);
          sequence = combinatorConfig.minToSequence;

          if (checkNextSymbol(lines, i, sequence)) {
            symbol = lines.slice(i, i + 4).find(e => e !== combinatorConfig.wildSymbol);
            sequence++;
            if (checkNextSymbol(lines, i, sequence)) {
              symbol = lines.slice(i, i + 5).find(e => e !== combinatorConfig.wildSymbol);
              sequence++;
              if (checkNextSymbol(lines, i, sequence)) {
                symbol = lines.slice(i).find(e => e !== combinatorConfig.wildSymbol);
                sequence++;
              }
            }
          }
        }
      }
    }
    if (sequence) {
      for (let j = 0; j < sequence; j++) {
        symbolIndex[j] = i + j;
      }
      if (!symbol) {
        symbol = combinatorConfig.wildSymbol;
      }
      result.push([symbol, [...symbolIndex]]);
      if (sequence + i === lines.length) {
        break;
      }
      sequence = 0;
    }
  }
  return result;
}

export const WinningCombinations = { call };
