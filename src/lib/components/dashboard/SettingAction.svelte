<script lang="ts">
	import SettingSkeleton from './SettingSkeleton.svelte';

	export let title: string;
	export let description: string;
	export let loading: boolean = false;
	export let action: {
		name: string;
		type: 'primary' | 'danger';
		func: () => void;
	};
</script>

{#if !loading}
	<div
		class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
	>
		<div class="flex-1">
			<h2 class="text-lg font-semibold">{title}</h2>
			<p class="text-neutral-600">{description}</p>
		</div>
		<button class={`btn-${action.type}`} on:click={action.func}>
			{action.name}
		</button>
	</div>
{:else}
	<SettingSkeleton />
{/if}
