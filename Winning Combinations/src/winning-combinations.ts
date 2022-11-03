
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

function call(lines: number[]): WinningCombinationsResult {
  let symbol: number | undefined;
  let sequence: number = 0;
  const symbolIndex: Array<number> = [];
  const result: [number, number[]][] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] < combinatorConfig.nonPayingSymbols[0]) {
      if (lines[i] !== symbol) {
        if (([...new Set(lines.slice(i, i + 3).filter(e => e !== 0))].length === 1 || (lines.slice(i, i + 3).reduce((pV, cV)=> pV + cV) === 0)) && i + 2 < lines.length) {
          symbol = lines.slice(i, i + 3).find(e => e !== 0);
          sequence = combinatorConfig.minToSequence;
          if (lines.slice(i, i + 4).filter(e => e !== 0).every(e => e === lines[i + 3] || lines[i + 3] === 0) && i + 3 < lines.length) {
            symbol = lines.slice(i, i + 4).find(e => e !== 0);
            sequence++;
            if (lines.slice(i, i + 5).filter(e => e !== 0).every(e => e === lines[i + 4] || lines[i + 4] === 0) && i + 4 < lines.length) {
              symbol = lines.slice(i, i + 5).find(e => e !== 0);
              sequence++;
              if (lines.slice(i).filter(e => e !== 0).every(e => e === lines[i + 5] || lines[i + 5] === 0) && i + 5 < lines.length) {
                symbol = lines.slice(i).find(e => e !== 0);
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
        symbol = 0;
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
