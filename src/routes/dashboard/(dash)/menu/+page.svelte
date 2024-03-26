<script lang="ts">
	import DragList from '$lib/components/DragList.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { json } from '@sveltejs/kit';

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

	let formattedItems = data.menuItems
		.sort((a, b) => a.sortingIndex - b.sortingIndex)
		.map((item) => {
			return {
				id: item.sortingIndex,
				dbId: item.id,
				name: item.name,
				price: item.price,
				category: item.categoryId
			};
		});

	const handleConsider = (e: any, type: 'category' | 'item') => {
		if (type === 'category') {
			formattedCategories = e.detail.items;
		} else if (type === 'item') {
			formattedItems = e.detail.items;
		}
	};

	const handleFinalize = async (e: any, type: 'category' | 'item') => {
		if (isChangingOrder) return;
		if (type === 'category') {
			formattedCategories = e.detail.items;
			await handleEditCategoryOrder();
		} else if (type === 'item') {
			formattedItems = e.detail.items;
			// Here, you'd have a similar function for handling item order changes
			await handleEditItemOrder();
		}
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

	const handleEditItemOrder = async () => {
		isChangingOrder = true;
		const res = await fetch(`/api/item/editOrder`, {
			method: 'PUT',
			body: JSON.stringify({
				items: formattedItems.map((item, index) => {
					return {
						dbId: item.dbId,
						sortingIndex: index
					};
				})
			})
		});

		if (res.ok) {
			isChangingOrder = false;
		}
	};

	let openModal = '';
	const closeModal = () => {
		openModal = '';
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
					<h2 class="text-lg font-semibold">Categories</h2>
					<p class="text-neutral-600">Create & edit categories for your restaurant's menu.</p>
				</div>
				<div class="col-span-full flex justify-end md:col-span-2">
					<button
						type="submit"
						class="btn-primary w-full md:w-auto"
						on:click={() => {
							openModal = 'categoryCreate';
						}}
					>
						Create Category
					</button>
					{#if openModal === 'categoryCreate'}
						<Modal open={true} onClose={closeModal}>
							<form class="flex flex-col gap-3" method="post" action="?/createCategory">
								<input name="name" type="text" class="input" placeholder="Name" />
								<textarea class="input" placeholder="Description"></textarea>
								<button type="submit" class="btn-primary"> Create </button>
							</form>
						</Modal>
					{/if}
				</div>
				<div
					class="col-span-full grid grid-cols-1 gap-2"
					use:dndzone={{
						items: formattedCategories,
						flipDurationMs: 100,
						dropTargetStyle: {},
						dragDisabled: isChangingOrder
					}}
					on:consider={(e) => handleConsider(e, 'category')}
					on:finalize={(e) => handleFinalize(e, 'category')}
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
							<div class={`btn-outline bg-white !p-2`} draggable="true">
								<Icon icon="carbon:drag-vertical" class="h-5 w-5" />
							</div>
							<input name="name" class="input flex-1" value={item.name} />
							<button
								type="button"
								class={`btn-primary !p-2`}
								draggable="false"
								on:click={() => {
									openModal = `category-${item.dbId}`;
								}}
							>
								<Icon icon="mingcute:edit-2-fill" class="h-5 w-5" draggable="false" />
							</button>
							{#if openModal === `category-${item.dbId}`}
								<Modal open={true} onClose={closeModal}>
									<form
										class="flex flex-col gap-3"
										method="post"
										action={`?/editCategory&id=${item.dbId}`}
									>
										<input
											name="name"
											type="text"
											class="input"
											placeholder="Name"
											value={item.name}
										/>
										<textarea class="input" placeholder="Description"></textarea>
										<button type="submit" class="btn-primary"> Save </button>
									</form>
								</Modal>
							{/if}
							<button type="submit" class={`btn-danger !p-2`} draggable="false">
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
					<h2 class="text-lg font-semibold">Items</h2>
					<p class="text-neutral-600">Create & edit menu items for your restaurant.</p>
				</div>
				<div class="col-span-full flex justify-end md:col-span-2">
					<button
						type="submit"
						class="btn-primary w-full md:w-auto"
						on:click={() => {
							openModal = 'itemCreate';
						}}
					>
						Create Item
					</button>
					{#if openModal === 'itemCreate'}
						<Modal open={true} onClose={closeModal}>
							<form class="flex flex-col gap-3" method="post" action="?/createCategory">
								<input name="name" type="text" class="input" placeholder="Name" />
								<input name="price" type="number" class="input" placeholder="Price" />

								<textarea class="input" placeholder="Description"></textarea>
								<button type="submit" class="btn-primary"> Create </button>
							</form>
						</Modal>
					{/if}
				</div>
				<div
					class="col-span-full grid grid-cols-1 gap-2"
					use:dndzone={{
						items: formattedItems,
						flipDurationMs: 100,
						dropTargetStyle: {},
						dragDisabled: isChangingOrder
					}}
					on:consider={(e) => handleConsider(e, 'item')}
					on:finalize={(e) => handleFinalize(e, 'item')}
				>
					{#each formattedItems as item (item.id)}
						<form
							on:submit={(e) => {
								e.preventDefault();
								handleDeleteCategory(item.dbId);
							}}
							class="col-span-full flex items-center gap-2"
							animate:flip={{ duration: 100 }}
						>
							<div class={`btn-outline bg-white !p-2`} draggable="true">
								<Icon icon="carbon:drag-vertical" class="h-5 w-5" />
							</div>
							<input name="name" class="input flex-1" value={item.name} />
							<button
								type="button"
								class={`btn-primary !p-2`}
								draggable="false"
								on:click={() => {
									openModal = `item-${item.dbId}`;
								}}
							>
								<Icon icon="mingcute:edit-2-fill" class="h-5 w-5" draggable="false" />
							</button>
							{#if openModal === `item-${item.dbId}`}
								<Modal open={true} onClose={closeModal}>
									<form
										class="flex flex-col gap-3"
										on:submit={(e) => {
											if (e.target.name.value && e.target.price.value && e.target.category.value) {
												fetch(`/api/item/edit`, {
													method: 'PUT',
													body: JSON.stringify({
														item: {
															dbId: item.dbId,
															name: e.target.name.value,
															price: e.target.price.value,
															category: e.target.category.value
														}
													})
												});
											}
										}}
									>
										<input
											name="name"
											type="text"
											class="input"
											placeholder="Name"
											value={item.name}
										/>
										<input
											name="price"
											type="number"
											class="input"
											step="0.1"
											placeholder="Price"
											value={item.price}
										/>

										<select name="category" class="input" value={item.category}>
											{#each formattedCategories as category (category.dbId)}
												<option value={category.dbId}>{category.name}</option>
											{/each}
										</select>

										<textarea class="input" placeholder="Description"></textarea>
										<button type="submit" class="btn-primary"> Save </button>
									</form>
								</Modal>
							{/if}
							<button type="submit" class={`btn-danger !p-2`} draggable="false">
								<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" draggable="false" />
							</button>
						</form>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
