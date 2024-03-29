<script lang="ts">
	import ThemeStore from '$lib/stores/ThemeStore';
	import themes from '$lib/themes.js';
	import Icon from '@iconify/svelte';

	let currentTheme = themes.default;
	ThemeStore.subscribe((value) => {
		currentTheme = value;
	});

	export let categories: string[] = [];

	let activeCategory = categories[0];

	const handleCategoryChange = (category: string) => {
		activeCategory = category;

		const categoryElement = document.getElementById(category);
		const categoryScroll = document.getElementById('scroller');
		const scrollBtn = document.getElementById('scrollBtn'); // This seems unused in your snippet.
		const categoryButton = document.getElementById(`category-${category}`);

		// Ensure elements are available before proceeding
		if (!categoryElement || !categoryScroll || !categoryButton) return;

		// Smooth scroll to the category element
		categoryElement.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});

		// Additional delay to ensure the scroll into view action is completed
		setTimeout(() => {
			let scrollOffset = categoryButton.offsetLeft - categoryScroll.scrollLeft;

			// Special handling for the first category to ensure full visibility
			if (category === categories[0]) {
				scrollOffset = 0; // Adjust as necessary to align with your UI requirements
			} else if (category === categories[categories.length - 1]) {
				scrollOffset += categoryButton.offsetWidth;
			} else {
				// Adjust for other categories if necessary, e.g., aligning them to a specific position
				scrollOffset -= categoryButton.offsetWidth;
			}

			categoryScroll.scrollTo({
				left: scrollOffset,
				behavior: 'smooth'
			});
		}, 100); // Consider adjusting delay based on testing with your UI for smoothness
	};
</script>

<div
	class="flex {currentTheme.colors.primaryBorder} sticky top-6 overflow-hidden rounded-lg border-2"
>
	{#if categories.indexOf(activeCategory) !== 0}
		<button
			id="scrollBtn"
			class="px-3 {currentTheme.colors.primaryText} {currentTheme.colors.primaryBackground}"
			on:click={() => handleCategoryChange(categories[categories.indexOf(activeCategory) - 1])}
		>
			<Icon icon={`mingcute:left-fill`} class="h-5 w-5" />
		</button>
	{/if}
	<div
		id="scroller"
		class="no-scrollbar flex w-full overflow-x-scroll {currentTheme.colors.defaultBackground}"
	>
		<div class="flex flex-grow">
			{#each categories as category}
				<button
					id={`category-${category}`}
					on:click={() => handleCategoryChange(category)}
					class={`
                cursor-pointer text-nowrap px-3 py-2 font-semibold 
                ${activeCategory === category && ` ${currentTheme.colors.primaryText} ${currentTheme.colors.primaryBackground}`}
            `}
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
	{#if categories.indexOf(activeCategory) !== categories.length - 1}
		<button
			class="flex-shrink-0 px-3 {currentTheme.colors.primaryText} {currentTheme.colors
				.primaryBackground}"
			on:click={() => handleCategoryChange(categories[categories.indexOf(activeCategory) + 1])}
		>
			<Icon icon={`mingcute:right-fill`} class="h-5 w-5" />
		</button>
	{/if}
</div>
