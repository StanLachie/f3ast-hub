<script lang="ts">
	import SettingSkeleton from './SettingSkeleton.svelte';
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let title: string;
	export let description: string;
	export let loading: boolean = false;
	export let initialValue: string;
	export let select: {
		name: string;
		type: string;
		value: string;
		placeholder: string;
		options: string[];
		submitUrl: string;
	};

	let updating = false;

	let saveChanges = async () => {
		if (!select.submitUrl) return;

		updating = true;

		await fetch(select.submitUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ value: select.value })
		});

		initialValue = select.value;

		updating = false;
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
				bind:value={select.value}
				placeholder={select.placeholder}
			>
				{#each select.options as option}
					<option value={option}>{option.toLocaleUpperCase()}</option>
				{/each}
			</select>
			{#if initialValue !== select.value}
				<button
					class="btn-primary w-[50px]"
					on:click={saveChanges}
					disabled={select.value === initialValue}
					transition:slide={{ duration: 250, axis: 'x' }}
				>
					<Icon
						icon={updating ? 'mingcute:loading-3-fill' : 'mingcute:save-2-fill'}
						class={updating ? 'h-6 w-6 animate-spin' : 'h-6 w-6'}
					/>
				</button>
			{/if}
		</div>
	</div>
{:else}
	<SettingSkeleton />
{/if}
