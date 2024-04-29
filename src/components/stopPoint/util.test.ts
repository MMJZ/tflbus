import { getStopLetterAndSize, compareBusNumbers } from './util';

describe('stopPoint utils', () => {
	test.each([
		['A', 'A', 'single'],
		['W', 'W', 'singleW'],
		['WW', 'WW', 'triple'],
    ['W10', 'W10', 'triple'],
    ['WA', 'WA', 'triple'],
    ['AB', 'AB', 'double']
	])(
		'generates stop letter data for %s',
		(input: string, expectedOutput: string, expectedSize: string) => {
			const data = getStopLetterAndSize(input);

			if (data === undefined) {
				throw new Error('fix me later');
			}

			const { stopLetter, stopLetterSize } = data;
			expect(stopLetter).toEqual(expectedOutput);
			expect(stopLetterSize).toEqual(expectedSize);
		},
	);

  const lessthan = (x: number) => (x < 0);
	lessthan.toString = () => '<'; // oh god no
  const equal = (x: number) => x === 0;
	equal.toString = () => '=='; // lol he did it again
  const greaterthan = (x: number) => x > 0;
	greaterthan.toString = () => '>'; // too spicy

  test.each([
    ['1', lessthan, '2'],
    ['K1', greaterthan, '2'],
    ['K1', lessthan, 'K2'],
		['K1', lessthan, 'N2'],
		['Z1', lessthan, 'SL2'],
		['X15A', equal, 'X15A'],
		['X15A', lessthan, 'X15B'],
		['N21', greaterthan, 'SL3'],
		['SL4', greaterthan, 'SL3'],
		['15', greaterthan, '14A'],
  ])('%s %s %s', (a: string, comp: (x: number) => boolean, b: string) => {
    expect(comp(compareBusNumbers(a, b))).toBeTruthy();
  });
});
