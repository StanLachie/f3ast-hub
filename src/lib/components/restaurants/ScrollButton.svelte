<script lang="ts">
	import ThemeStore from '$lib/stores/ThemeStore';

	import themes from '$lib/themes.js';
	import Icon from '@iconify/svelte';

	let currentTheme = themes.default;
	ThemeStore.subscribe((value) => {
		currentTheme = value;
	});

	export let scrollContainer: HTMLDivElement;

	export let direction: 'left' | 'right';

	export let amount: number;
</script>

<button
	class={currentTheme.components.scrollButton}
	on:click={() => scrollContainer.scrollBy({ left: amount, behavior: 'smooth' })}
>
	<Icon icon={`mingcute:${direction}-fill`} class="h-5 w-5" />
</button>
