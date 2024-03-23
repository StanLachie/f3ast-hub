<script lang="ts">
	import Hero from '$lib/components/blocks/restaurant/Hero.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { scrollable } from '$lib/scroll.js';
	import themes from '$lib/themes.js';
	import ScrollButton from '$lib/components/restaurants/ScrollButton.svelte';
	import { getContext } from 'svelte';
	import ThemeStore from '$lib/stores/ThemeStore';
	import SocialButton from '$lib/components/restaurants/SocialButton.svelte';

	export let data: PageData;

	let currentTheme = themes.default;
	ThemeStore.subscribe((value) => {
		currentTheme = value;
	});

	let scrollContainers: HTMLDivElement[] = [];
</script>

<meta:head>
	<title>{data.restaurant.name}</title>
</meta:head>

<div class="relative">
	<img
		src={data.restaurant.banner}
		alt={`${data.restaurant.name} Banner`}
		class="h-44 w-full rounded-lg object-cover sm:h-48 md:h-60"
	/>
	<div
		class="absolute inset-0 rounded-lg bg-gradient-to-t from-gray-900 via-transparent to-transparent"
	></div>
	<img
		src={data.restaurant.logo}
		alt={`${data.restaurant.name} Logo`}
		class="absolute bottom-4 left-4 h-20 w-20 rounded-full border-4 border-white bg-white object-cover sm:h-24 sm:w-24"
	/>
</div>
<div class="mt-6 flex flex-col gap-1">
	<h1 class="text-2xl font-semibold">
		{data.restaurant.name}
	</h1>
	<div class="group flex items-center gap-1 {currentTheme.colors.secondaryText}">
		<Icon icon="ion:location" class="h-4 w-4 group-hover:text-neutral-600" />
		<a
			href={`https://www.google.com/maps/search/?api=1&query=${data.restaurant.address}`}
			target="_blank"
			rel="noopener noreferrer"
			class=" font-semibold group-hover:text-gray-700"
		>
			{data.restaurant.address}
		</a>
	</div>
	<div class="text-pr max-w-xl text-sm {currentTheme.colors.secondaryText}">
		{data.restaurant.bio}
	</div>

	<div>
		<SocialButton url="https://www.facebook.com/swagmanspies/" icon="mingcute:facebook-fill" />
		<SocialButton url="https://www.facebook.com/swagmanspies/" icon="mingcute:ins-line" />
	</div>
</div>
<div class="mt-6 space-y-6">
	{#each data.categories.sort((a, b) => a.sortingIndex - b.sortingIndex) as category, index}
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-semibold">{category.name}</h1>
				<div class="flex gap-3">
					<ScrollButton scrollContainer={scrollContainers[index]} amount={-156} direction="left" />
					<ScrollButton scrollContainer={scrollContainers[index]} amount={156} direction="right" />
				</div>
			</div>
			<div class="no-scrollbar flex gap-3 overflow-x-auto" bind:this={scrollContainers[index]}>
				{#each category.MenuItems as item}
					<div class="flex min-w-36 flex-col gap-1">
						<img src={item.img} alt={item.name} class="h-36 w-36 rounded-lg object-cover" />
						<div class="flex flex-col">
							<span class="text-md font-semibold">{item.name}</span>
							<span class={currentTheme.colors.secondaryText}>${item.price.toFixed(2)}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
