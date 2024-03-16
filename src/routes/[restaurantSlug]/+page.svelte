<script lang="ts">
	import Hero from '$lib/components/blocks/restaurant/Hero.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
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
<div class="mt-2 flex flex-col">
	<h1 class="text-2xl font-semibold">
		{data.restaurant.name}
	</h1>
	<div class="group flex items-center gap-1 text-neutral-500">
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
	<div class="text-pr mt-2 max-w-xl text-sm text-neutral-500">
		{data.restaurant.bio}
	</div>
</div>
<div class="mt-8 flex flex-col gap-4">
	{#each data.categories as category}
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-semibold">{category.name}</h1>
			{#each category.MenuItems as item}
				<div class="flex items-center justify-between">
					<div class="flex flex-col">
						<h2 class="text-lg font-semibold">{item.name}</h2>
						<p class="text-neutral-500">${item.price.toFixed(2)}</p>
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
