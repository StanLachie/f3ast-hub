<script lang="ts">
	import Icon from '@iconify/svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	export let listItems = [
		{
			id: 1,
			name: 'Item 1'
		},
		{
			id: 2,
			name: 'Item 2'
		},
		{
			id: 3,
			name: 'Item 3'
		}
	];

	export let handleChange = () => {};

	const handleConsider = (e: any) => {
		listItems = e.detail.items;
	};

	const handleFinalize = (e: any) => {
		handleChange();
		listItems = e.detail.items;
	};
</script>

<section
	class="grid grid-cols-1 gap-2"
	use:dndzone={{ items: listItems, flipDurationMs: 100, dropTargetStyle: {} }}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each listItems as item (item.id)}
		<div class="col-span-full flex items-center gap-2" animate:flip={{ duration: 100 }}>
			<div>
				<button class={`btn-outline`} draggable="true">
					<Icon icon="carbon:drag-vertical" class="h-5 w-5" />
				</button>
			</div>
			<input class="input flex-1" value={item.name} />
			<button class={`btn-danger`} draggable="false">
				<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" draggable="false" />
			</button>
		</div>
	{/each}
</section>
