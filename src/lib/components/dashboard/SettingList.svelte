<script lang="ts">
	import Icon from '@iconify/svelte';
	import SettingSkeleton from './SettingSkeleton.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let title: string;
	export let description: string;
	export let loading: boolean = false;
	export let action: {
		name: string;
		type: 'primary' | 'danger';
		href?: string;
		func?: () => void;
	};
	export let listItems: any[] = [];

	let dragDisabled = true;

	const handleConsider = (event: any) => {
		console.log(event.detail.items);
		listItems = event.detail.items;
	};

	const handleFinalize = (event: any) => {
		listItems = event.detail.items;

		dragDisabled = true;
	};
</script>

{#if !loading}
	<div
		class="flex w-full flex-col gap-4 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
	>
		<div class="flex flex-1 items-center">
			<div class="flex-1">
				<h2 class="text-lg font-semibold">{title}</h2>
				<p class="text-neutral-600">{description}</p>
			</div>
			<button type="submit" class="btn-primary h-full" on:click={action.func}>
				{action.name}
			</button>
		</div>

		{#if listItems.length > 0}
			<div
				class="flex flex-col gap-2"
				use:dndzone={{
					items: listItems,
					flipDurationMs: 100,
					dropTargetStyle: {},
					transformDraggedElement: (element) => {
						return element;
					},
					dragDisabled
				}}
				on:consider={handleConsider}
				on:finalize={handleFinalize}
			>
				{#each listItems as item (item.id)}
					<div class="flex items-center gap-2" animate:flip={{ duration: 250 }}>
						<button
							class="btn-outline h-[42px] w-[42px] bg-white !p-2"
							on:mousedown={() => {
								dragDisabled = false;
							}}
							on:mouseup={() => {
								dragDisabled = true;
							}}
							on:touchstart={() => {
								dragDisabled = false;
							}}
							on:touchend={() => {
								dragDisabled = true;
							}}
						>
							<Icon icon="uil:draggabledots" class="h-5 w-5" />
						</button>
						<input class="input flex-1" value={item.name} />
						<button
							class="btn-outline flex h-[42px] w-[42px] justify-center bg-white !p-2"
							on:click={() => {}}
						>
							<Icon icon="mingcute:edit-2-fill" class="h-5 w-5" />
						</button>
						<button
							class="btn-danger flex h-[42px] w-[42px] justify-center !p-2"
							on:click={() => {}}
						>
							<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<SettingSkeleton size="lg" />
{/if}
