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
		createFunc?: () => void;
		editFunc?: (id: number) => void;
		deleteFunc?: (id: number) => void;
	};
	export let reorderUrl: string;
	export let listItems: any[] = [];

	let dragDisabled = true;
	let reordering = false;

	const handleConsider = (event: any) => {
		listItems = event.detail.items;
	};

	const handleFinalize = async (event: any) => {
		listItems = event.detail.items;

		if (reorderUrl) {
			reordering = true;

			await fetch(reorderUrl, {
				method: 'PUT',
				body: JSON.stringify({
					items: listItems
				})
			});

			reordering = false;
		}

		dragDisabled = true;
	};
</script>

{#if !loading}
	<div
		class="flex w-full flex-col gap-4 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
	>
		<div class="flex flex-1 flex-col items-center gap-3 md:flex-row md:items-center">
			<div class="w-full flex-1 md:w-auto">
				<h2 class="text-lg font-semibold">{title}</h2>
				<p class="text-neutral-600">{description}</p>
			</div>
			<button
				type="submit"
				class="btn-primary h-full w-full md:w-auto"
				on:click={action.createFunc}
			>
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
					dropFromOthersDisabled: true,
					dragDisabled
				}}
				on:consider={(e) => handleConsider(e)}
				on:finalize={(e) => handleFinalize(e)}
			>
				{#each listItems as item (item.id)}
					<div
						id={`${title}-item`}
						class="col-span-full flex items-center gap-2"
						animate:flip={{ duration: 100 }}
					>
						<button
							class="btn-outline h-[42px] w-[42px] bg-white !p-2"
							on:mousedown={() => {
								if (reordering) return;
								dragDisabled = false;
							}}
							on:mouseup={() => {
								if (reordering) return;
								dragDisabled = true;
							}}
							on:touchstart={() => {
								if (reordering) return;
								dragDisabled = false;
							}}
							on:touchend={() => {
								if (reordering) return;
								dragDisabled = true;
							}}
						>
							<Icon icon="uil:draggabledots" class="h-5 w-5" />
						</button>
						<input class="input flex-1 bg-white" disabled value={item.name} />
						<button
							class="btn-outline flex h-[42px] w-[42px] justify-center bg-white !p-2"
							on:click={() => {
								if (!action.editFunc) return;
								action.editFunc(item.dbId);
							}}
						>
							<Icon icon="mingcute:edit-2-fill" class="h-5 w-5" />
						</button>
						<button
							class="btn-danger flex h-[42px] w-[42px] justify-center !p-2"
							on:click={() => {
								if (!action.deleteFunc) return;
								action.deleteFunc(item.dbId);
							}}
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
