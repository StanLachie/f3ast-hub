<script lang="ts">
	import DragList from '$lib/components/DragList.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	export let isChangingOrder = false;

	let formattedCategories = data.categories
		.sort((a, b) => a.sortingIndex - b.sortingIndex)
		.map((category) => {
			return {
				id: category.sortingIndex,
				dbId: category.id,
				name: category.name
			};
		});

	const handleConsider = (e: any) => {
		formattedCategories = e.detail.items;
	};

	const handleFinalize = async (e: any) => {
		if (isChangingOrder) return;
		formattedCategories = e.detail.items;
		await handleEditCategoryOrder();
	};

	const handleDeleteCategory = async (id: number) => {
		const res = await fetch(`/api/category/delete`, {
			method: 'DELETE',
			body: JSON.stringify({ id })
		});

		if (res.ok) {
			formattedCategories = formattedCategories.filter((category) => category.id !== id);

			location.reload();
		}
	};

	const handleEditCategoryOrder = async () => {
		isChangingOrder = true;
		const res = await fetch(`/api/category/editOrder`, {
			method: 'PUT',
			body: JSON.stringify({
				categories: formattedCategories.map((category, index) => {
					return {
						dbId: category.dbId,
						sortingIndex: index
					};
				})
			})
		});

		if (res.ok) {
			isChangingOrder = false;
		}
	};
</script>

<meta:head>
	<title>Dashboard | Menu Editor</title>
</meta:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Menu Editor</h1>
		<p class="text-neutral-600">Make changes to your menu here.</p>

		<div class="my-6 flex flex-col gap-4">
			<div
				class="grid w-full grid-cols-4 gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
			>
				<div class="col-span-full md:col-span-2">
					<h2 class="text-lg font-semibold">Category</h2>
					<p class="text-neutral-600">Create a new category for your menu items.</p>
				</div>
				<form
					method="post"
					action="?/createCategory"
					class="col-span-full flex gap-2 md:col-span-2"
				>
					<input name="name" type="text" class="input flex-1" placeholder="Name" />
					<button type="submit" class={`btn-primary`}> Create </button>
				</form>
				<div
					class="col-span-full grid grid-cols-1 gap-2"
					use:dndzone={{
						items: formattedCategories,
						flipDurationMs: 100,
						dropTargetStyle: {},
						dragDisabled: isChangingOrder
					}}
					on:consider={handleConsider}
					on:finalize={handleFinalize}
				>
					{#each formattedCategories as item (item.id)}
						<form
							on:submit={(e) => {
								e.preventDefault();
								handleDeleteCategory(item.dbId);
							}}
							class="col-span-full flex items-center gap-2"
							animate:flip={{ duration: 100 }}
						>
							<div class={`btn-outline`} draggable="true">
								<Icon icon="carbon:drag-vertical" class="h-5 w-5" />
							</div>
							<input name="name" class="input flex-1" value={item.name} />
							<button type="submit" class={`btn-danger`} draggable="false">
								<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" draggable="false" />
							</button>
						</form>
					{/each}
				</div>
			</div>
			<div
				class="grid w-full grid-cols-4 gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
			>
				<div class="col-span-full md:col-span-2">
					<h2 class="text-lg font-semibold">Item</h2>
					<p class="text-neutral-600">Create a new item for your menu.</p>
				</div>
				<form
					method="post"
					action="?/createItem"
					class="col-span-full grid grid-cols-4 gap-2 md:col-span-2"
				>
					<input name="name" type="text" class="input col-span-3" placeholder="Name" />
					<input name="price" type="number" class="input" placeholder="Price" />
					<select name="category" class="input col-span-3">
						{#each formattedCategories as category (category.id)}
							<option value={category.dbId}>{category.name}</option>
						{/each}
					</select>
					<button type="submit" class={`btn-primary`}> Create </button>
				</form>
				<div class="col-span-full md:col-span-2">
					<h2 class="text-md font-semibold">Current Menu:</h2>
				</div>
				<div class="col-span-full grid grid-cols-1 gap-2">
					{#each data?.menuItems as item}
						<form class="flex gap-2">
							<input type="text" class="input flex-[3]" value={item.name} />
							<input type="number" class="input flex-1" value={item.price} step={0.1} />
							<button type="submit" class={`btn-danger`} draggable="false">
								<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" draggable="false" />
							</button>
						</form>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
