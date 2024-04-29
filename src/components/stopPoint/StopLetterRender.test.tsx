import { render } from '@testing-library/preact';
import { StopLetterRender } from './StopLetterRender';
import { getStopLetterAndSize } from './util';
import { vi } from 'vitest';

describe('stop letter render', () => {
	test('handles empty', () => {
		window.alert = vi.fn();
		expect(() => render(<StopLetterRender stopLetter="" scale={1} />)).toThrow(
			'failed to render stop: stop letter length must be 1, 2, or 3',
		);
		expect(window.alert).toHaveBeenCalledOnce();
	});

	test.each([['A'], ['W'], ['Z'], ['WW'], ['A1'], ['-'], ['>']])(
		'renders stop %s',
		(letter) => {
			const { container, getByText } = render(
				<StopLetterRender stopLetter={letter} scale={1} />,
			);

			const data = getStopLetterAndSize(letter);

			if (data === undefined) {
				expect(container).toBeEmptyDOMElement();
				return;
			}

			const { stopLetter, stopLetterSize } = data;

			expect(getByText(stopLetter)).toBeInTheDocument();
			expect(getByText(stopLetter)).toHaveClass(stopLetterSize);

			expect(container.firstElementChild).toHaveClass('letterWrapper');
		},
	);
});
