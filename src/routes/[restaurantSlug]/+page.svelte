<script lang="ts">
	import Hero from '$lib/components/blocks/restaurant/Hero.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Hero />
<h1>{data.restaurant.name}</h1>
