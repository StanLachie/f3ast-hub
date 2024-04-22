<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;
	const { pageData } = data;

	export let isChangingOrder = false;

	let formattedCategories: any[] = [];
	let formattedItems: any[] = [];
	let galleryImages: any;

	onMount(async () => {
		formattedCategories = (await pageData).categories
			.sort((a, b) => a.sortingIndex - b.sortingIndex)
			.map((category) => {
				return {
					id: category.sortingIndex,
					dbId: category.id,
					name: category.name
				};
			});

		formattedItems = (await pageData).menuItems
			.sort((a, b) => a.sortingIndex - b.sortingIndex)
			.map((item) => {
				return {
					id: item.sortingIndex,
					dbId: item.id,
					name: item.name,
					price: item.price,
					img: item.img,
					description: item.description,
					category: item.categoryId
				};
			});

		galleryImages = (await pageData).gallery;
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

	const handleCreateItem = async (event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name') || !formData.get('price') || !formData.get('category')) return;

		const res = await fetch(`/api/menu/item`, {
			method: 'POST',
			body: JSON.stringify({
				name: formData.get('name'),
				description: formData.get('description'),
				price: parseFloat(formData.get('price') as string),
				img: formData.get('img'),
				categoryId: parseFloat(formData.get('category') as string)
			})
		});

		if (res.ok) {
			location.reload();
		}
	};

	const handleUpdateItem = async (id: number, event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name') || !formData.get('price') || !formData.get('category')) return;

		console.log(formData.get('img'));

		const res = await fetch(`/api/menu/item?id=${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				id: id,
				name: formData.get('name'),
				description: formData.get('description'),
				img: formData.get('img'),
				price: parseFloat(formData.get('price') as string),
				categoryId: parseFloat(formData.get('category') as string)
			})
		});

		if (res.ok) {
			location.reload();
		}
	};

	const handleDeleteItem = async (id: number) => {
		const res = await fetch(`/api/menu/item?id=${id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			location.reload();
		}
	};

	const handleDeleteCategory = async (id: number) => {
		const res = await fetch(`/api/category/delete`, {
			method: 'DELETE',
			body: JSON.stringify({ id })
		});

		if (res.ok) {
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
		const res = await fetch(`/api/menu/item/reorder`, {
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
							<form
								class="flex cursor-default flex-col gap-3"
								on:submit={(e) => {
									e.preventDefault();
									handleCreateItem(e);
								}}
							>
								<input name="name" type="text" class="input" placeholder="Name" />
								<div class="flex items-center">
									<div
										class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold"
									>
										$
									</div>
									<input
										name="price"
										type="number"
										class="input rounded-l-none"
										placeholder="Price"
										step="0.10"
									/>
								</div>
								<select name="category" class="input cursor-pointer">
									{#each formattedCategories as category (category.dbId)}
										<option value={category.dbId}>{category.name}</option>
									{/each}
								</select>
								<input name="img" class="input" placeholder="Image URL" />
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
						dragDisabled: isChangingOrder || openModal !== ''
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
							<div>
								{#if openModal === `item-${item.dbId}`}
									<Modal open={true} onClose={closeModal}>
										<form
											class="flex flex-col gap-3"
											on:submit={(e) => {
												e.preventDefault();
												handleUpdateItem(item.dbId, e);
											}}
										>
											<input
												name="name"
												type="text"
												class="input"
												placeholder="Name"
												value={item.name}
											/>
											<div class="flex items-center">
												<div
													class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold"
												>
													$
												</div>
												<input
													name="price"
													type="number"
													class="input rounded-l-none"
													placeholder="Price"
													value={item.price}
													step="0.10"
												/>
											</div>

											<select name="category" class="input" value={item.category}>
												{#each formattedCategories as category (category.dbId)}
													<option value={category.dbId}>{category.name}</option>
												{/each}
											</select>

											<input name="img" hidden value={item.img} />

											<div class="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto">
												{#each galleryImages as menuImage}
													<button
														class="relative flex items-center justify-center"
														on:click={(e) => {
															e.preventDefault();
															if (
																item.img ===
																`https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/render/image/public/client-assets/${menuImage.name}`
															) {
																item.img = null;
															} else {
																item.img = `https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/render/image/public/client-assets/${menuImage.name}`;
															}
														}}
													>
														{#if item.img === `https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/render/image/public/client-assets/${menuImage.name}`}
															<div
																class="absolute flex h-full w-full items-center justify-center rounded-lg bg-neutral-950 opacity-50"
															></div>
															<Icon
																icon="mingcute:check-circle-line"
																class="absolute h-8 w-8 text-emerald-400"
															/>
														{/if}

														<img
															src={`https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/render/image/public/client-assets/${menuImage.name}?width=100&height=100`}
															alt="Menu Item"
															class="w-full cursor-pointer rounded-lg object-cover"
														/>
													</button>
												{/each}
											</div>

											<textarea
												name="description"
												class="input"
												placeholder="Description"
												value={item.description}
											></textarea>
											<button type="submit" class="btn-primary"> Save </button>
										</form>
									</Modal>
								{/if}
							</div>
							<button
								type="button"
								class={`btn-danger !p-2`}
								draggable="false"
								on:click={(e) => {
									e.preventDefault();
									handleDeleteItem(item.dbId);
								}}
							>
								<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" draggable="false" />
							</button>
						</form>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
