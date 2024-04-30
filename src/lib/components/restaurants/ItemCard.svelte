<script lang="ts">
	import ThemeStore from '$lib/stores/ThemeStore';
	import themes from '$lib/themes';

	export let item: {
		name: string;
		price: number;
		img?: string | undefined;
	};

	let currentTheme = themes.default;
	ThemeStore.subscribe((value) => {
		currentTheme = value;
	});
</script>

<div class="flex min-w-36 max-w-36 flex-col gap-1">
	{#if item.img}
		<img src={item.img} alt={item.name} class="h-36 w-36 rounded-lg object-cover" />
	{:else}
		<div
			class="flex h-36 w-36 items-center justify-center rounded-lg {currentTheme.colors
				.secondaryBackground} {currentTheme.colors.defaultText} text-3xl font-semibold"
		>
			{item.name
				.split(' ')
				.map((word) => word[0])
				.join('')}
		</div>
	{/if}

	<div class="flex flex-col">
		<span class="text-md font-semibold">{item.name}</span>
		<span class={currentTheme.colors.secondaryText}>${item.price.toFixed(2)}</span>
	</div>
</div>
