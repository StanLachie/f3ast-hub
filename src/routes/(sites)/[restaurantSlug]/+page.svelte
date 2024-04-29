<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import themes from '$lib/themes.js';
	import ScrollButton from '$lib/components/restaurants/ScrollButton.svelte';
	import ThemeStore from '$lib/stores/ThemeStore';
	import SocialButton from '$lib/components/restaurants/SocialButton.svelte';
	import CategoryFinder from '$lib/components/restaurants/CategoryFinder.svelte';
	import ItemCard from '$lib/components/restaurants/ItemCard.svelte';
	import Meta from '$lib/components/utils/Meta.svelte';

	export let data: PageData;

	let currentTheme = themes.default;
	ThemeStore.subscribe((value) => {
		currentTheme = value;
	});

	let scrollContainers: HTMLDivElement[] = [];
</script>

<Meta title={data.restaurant.name} description={`${data.restaurant.name} @ F3AST`} />

<div class="relative">
	<img
		src={data.restaurant.banner}
		alt={`${data.restaurant.name} Banner`}
		class="h-44 w-full rounded-lg object-cover sm:h-52 md:h-64"
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

	<div class="mt-2 flex gap-3">
		{#if data.restaurant.facebook}
			<SocialButton url={data.restaurant.facebook} icon="ic:baseline-facebook" />
		{/if}
		{#if data.restaurant.tiktok}
			<SocialButton url={data.restaurant.tiktok} icon="ic:baseline-tiktok" />
		{/if}
		{#if data.restaurant.instagram}
			<SocialButton url={data.restaurant.instagram} icon="ant-design:instagram-filled" />
		{/if}
		{#if data.restaurant.twitter}
			<SocialButton url={data.restaurant.twitter} icon="icon-park-solid:twitter" />
		{/if}
	</div>
</div>
<div class="sticky top-2 mt-6">
	<CategoryFinder
		categories={data.categories
			.sort((a, b) => a.sortingIndex - b.sortingIndex)
			.map((category) => category.name)}
	/>
</div>
<div class="mt-6 space-y-6">
	{#each data.categories.sort((a, b) => a.sortingIndex - b.sortingIndex) as category, index}
		<div class="space-y-3" id={category.name}>
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-semibold">{category.name}</h1>
				<div class="flex gap-3">
					<ScrollButton scrollContainer={scrollContainers[index]} amount={-156} direction="left" />
					<ScrollButton scrollContainer={scrollContainers[index]} amount={156} direction="right" />
				</div>
			</div>
			<div class="no-scrollbar flex gap-3 overflow-x-auto" bind:this={scrollContainers[index]}>
				{#if category.MenuItems.length === 0}
					<div class="my-12 w-full text-center">
						<p class={currentTheme.colors.secondaryText}>No items in this category.</p>
					</div>
				{:else}
					{#each category.MenuItems.sort((a, b) => a.sortingIndex - b.sortingIndex) as item}
						<ItemCard
							item={{
								name: item.name,
								price: item.price,
								img: item?.img || undefined
							}}
						/>
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>
