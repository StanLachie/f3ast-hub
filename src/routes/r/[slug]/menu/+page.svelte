<script lang="ts">
	import Hero from '../../../../components/blocks/restaurant/Hero.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Hero />
<h1>{data.restaurantInfo.name}</h1>
