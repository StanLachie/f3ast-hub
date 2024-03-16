<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<meta:head>
	<title>Dashboard | Restaurant</title>
</meta:head>

{#if data.subscription?.status === 'active'}
	<h1>{data.restaurant.name}</h1>
	<p>{data.restaurant.bio}</p>
{:else}
	<div class="flex min-h-full items-center justify-center">
		<div class="flex flex-col items-center gap-2">
			<h1 class="text-4xl font-bold text-emerald-300">
				{data.restaurant.name} is currently inactive
			</h1>
			<p class="text-lg font-semibold text-neutral-600">
				Please check the restaurant's billing page to reactivate.
			</p>
		</div>
	</div>
{/if}
