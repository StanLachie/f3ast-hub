<script lang="ts">
	import SettingSkeleton from './SettingSkeleton.svelte';

	export let title: string;
	export let description: string;
	export let loading: boolean = false;
	export let select: {
		name: string;
		type: string;
		value: string;
		placeholder: string;
		options: string[];
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
		<div class="flex flex-1 gap-3">
			<select
				class="input flex-1 p-3"
				name={select.name}
				value={select.value}
				placeholder={select.placeholder}
				on:change={select.func}
			>
				{#each select.options as option}
					<option value={option}>{option.toLocaleUpperCase()}</option>
				{/each}
			</select>
		</div>
	</div>
{:else}
	<SettingSkeleton />
{/if}
