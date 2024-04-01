<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { layoutData } = data;
</script>

<meta:head>
	<title>Dashboard | Welcome</title>
</meta:head>

{#await data.layoutData}
	<div class="w-full">
		<div
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
		>
			<p class="font-semibold">Loading Your Dashboard</p>
		</div>
	</div>
{:then layoutData}
	<div
		class="grid w-full grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8"
	>
		<div class="col-span-2 rounded-lg border border-neutral-400 bg-white p-6 text-center shadow-sm">
			<h1 class="mb-1 text-2xl font-semibold">
				Hello, <span class="text-emerald-400">{layoutData.client?.first_name}</span>.
			</h1>
			<span class="text-neutral-600"> Welcome to the F3AST Dashboard. </span>
		</div>
	</div>
{/await}
