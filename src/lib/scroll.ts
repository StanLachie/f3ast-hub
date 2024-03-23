// scroll.js
export function scrollable(node: HTMLElement) {
	function scroll(direction: 'left' | 'right') {
		const SCROLL_AMOUNT = 200;
		const currentScroll = node.scrollLeft;
		const newScroll =
			direction === 'left' ? currentScroll - SCROLL_AMOUNT : currentScroll + SCROLL_AMOUNT;
		node.scrollTo({ left: newScroll, behavior: 'smooth' });
	}

	return {
		update(newDirection: 'left' | 'right') {
			scroll(newDirection);
		}
	};
}
