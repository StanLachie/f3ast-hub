<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import SettingHead from '$lib/components/dashboard/SettingHead.svelte';
	import Meta from '$lib/components/utils/Meta.svelte';
	import SettingList from '$lib/components/dashboard/SettingList.svelte';

	export let data: PageData;
	const { pageData } = data;

	export let isChangingOrder = false;

	let formattedCategories: any[] = [];
	let formattedItems: any[] = [];
	let galleryImages: any;

	let initialLoading = true;
	let isSaving = false;
	let isReordering = false;

	let currentCategory: any | null = null;
	let currentItem: any | null = null;

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

		initialLoading = false;
	});

	const handleCreateItem = async (event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name') || !formData.get('price') || !formData.get('category')) return;

		isSaving = true;

		let newItem: {
			id: number;
			dbId: number;
			name: string;
			description: string;
			price: number;
			img: string;
			category: number;
		} = {
			id: new Date().getTime(),
			dbId: new Date().getTime(),
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			price: parseFloat(formData.get('price') as string),
			img: formData.get('img') as string,
			category: parseFloat(formData.get('category') as string)
		};

		const res = await fetch(`/api/menu/item`, {
			method: 'POST',
			body: JSON.stringify(newItem)
		});

		if (res.ok) {
			let data = await res.json();

			newItem = data.item;

			newItem.dbId = newItem.id;
			newItem.id = formattedItems.length + 1;
			newItem.category = data.item.categoryId;

			formattedItems.push(newItem);
			closeModal();
		} else {
			alert('Failed to create item. Please try again.');
		}

		isSaving = false;
	};

	const handleCreateCategory = async (event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name')) return;

		isSaving = true;

		let newCategory: {
			id: number;
			dbId: number;
			name: string;
			description: string;
		};

		newCategory = {
			id: new Date().getTime(),
			dbId: new Date().getTime(),
			name: formData.get('name') as string,
			description: formData.get('description') as string
		};

		const res = await fetch(`/api/menu/category`, {
			method: 'POST',
			body: JSON.stringify(newCategory)
		});

		if (res.ok) {
			let data = await res.json();

			newCategory = data.category;

			newCategory.dbId = newCategory.id;
			newCategory.id = formattedCategories.length + 1;

			formattedCategories.push(newCategory);
			closeModal();
		}

		isSaving = false;
	};

	const handleUpdateItem = async (id: number, event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name') || !formData.get('price') || !formData.get('category')) return;

		isSaving = true;

		let updatedItem: {
			id: number;
			dbId: number;
			name: string;
			description: string;
			price: number;
			img: string;
			category: number;
		} = {
			id: id,
			dbId: id,
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			price: parseFloat(formData.get('price') as string),
			img: formData.get('img') as string,
			category: parseFloat(formData.get('category') as string)
		};

		const res = await fetch(`/api/menu/item?id=${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedItem)
		});

		if (res.ok) {
			let data = await res.json();

			updatedItem = data.item;

			updatedItem.dbId = updatedItem.id;
			updatedItem.id = data.item.sortingIndex;
			updatedItem.category = data.item.categoryId;

			formattedItems = formattedItems.map((item) => (item.dbId === id ? updatedItem : item));
			closeModal();
		} else {
			alert('Failed to update item. Please try again.');
		}

		isSaving = false;
	};

	const handleUpdateCategory = async (id: number, event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name')) return;

		isSaving = true;

		let updatedCategory = {
			id: id,
			dbId: id,
			name: formData.get('name') as string,
			description: formData.get('description') as string
		};

		const res = await fetch(`/api/menu/category?id=${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedCategory)
		});

		if (res.ok) {
			let data = await res.json();

			updatedCategory = data.category;

			updatedCategory.dbId = updatedCategory.id;
			updatedCategory.id = data.category.sortingIndex;

			formattedCategories = formattedCategories.map((category) =>
				category.dbId === id ? updatedCategory : category
			);
			closeModal();
		} else {
			alert('Failed to update category. Please try again.');
		}

		isSaving = false;
	};

	const handleDeleteItem = async (id: number) => {
		const res = await fetch(`/api/menu/item?id=${id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			formattedItems = formattedItems.filter((item) => item.dbId !== id);
			closeModal();
		} else {
			alert('Failed to delete item. Please try again.');
		}

		isSaving = false;
	};

	const handleDeleteCategory = async (id: number) => {
		isSaving = true;
		const res = await fetch(`/api/menu/category`, {
			method: 'DELETE',
			body: JSON.stringify({
				id
			})
		});

		if (res.ok) {
			formattedCategories = formattedCategories.filter((category) => category.dbId !== id);
			closeModal();
		} else {
			alert('Failed to delete category. Please try again.');
		}

		isSaving = false;
	};

	const handleEditCategoryOrder = async () => {
		isReordering = true;
		const res = await fetch(`/api/menu/category/reorder`, {
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
			isReordering = false;
		}
	};

	const handleEditItemOrder = async () => {
		isReordering = true;
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
			isReordering = false;
		} else {
			alert('Something went wrong. Please try again.');
		}
	};

	let openModal = '';
	const closeModal = () => {
		openModal = '';
	};
</script>

{#if isReordering}
	<div
		in:fly={{ x: 100, duration: 200, easing: quintOut }}
		out:fly={{ x: 100, duration: 200, easing: quintOut }}
		class="fixed bottom-4 right-4 z-50 flex flex-nowrap items-center justify-center gap-3 rounded-lg border border-neutral-400 bg-white px-3 py-2 shadow-sm"
	>
		<Icon icon="mingcute:loading-3-fill" class="h-5 w-5 animate-spin text-emerald-500" />
		<span class="text-nowrap font-semibold">Updating order...</span>
	</div>
{/if}

<SettingHead title="Your Menu" description="Make changes to your menu here." />

<SettingList
	title="Categories"
	description="Create & edit categories for your restaurant's menu."
	loading={initialLoading}
	action={{
		name: 'Create Category',
		type: 'primary',
		href: '/dashboard/menu/category/create',
		createFunc: () => {
			openModal = 'categoryCreate';
		},
		editFunc: async (id) => {
			openModal = 'categoryEdit';

			currentCategory = formattedCategories.find((category) => category.dbId === id);
		},
		deleteFunc: async (id) => {
			if (!window) return;
			const confirm = window.confirm('Are you sure you want to delete this category?');
			if (!confirm) return;
			const res = await fetch(`/api/menu/category`, {
				method: 'DELETE',
				body: JSON.stringify({
					id
				})
			});

			if (res.ok) {
				formattedCategories = formattedCategories.filter((category) => category.dbId !== id);
				closeModal();
			} else {
				alert('Failed to delete category. Please try again.');
			}
		}
	}}
	reorderUrl="/api/menu/category/reorder"
	listItems={formattedCategories}
/>

<SettingList
	title="Items"
	description="Create & edit menu items for your restaurant."
	loading={initialLoading}
	action={{
		name: 'Create Item',
		type: 'primary',
		href: '/dashboard/menu/item/create',
		createFunc: () => {
			openModal = 'itemCreate';
		},
		editFunc: async (id) => {
			openModal = 'itemEdit';

			currentItem = formattedItems.find((item) => item.dbId === id);
		},
		deleteFunc: async (id) => {
			if (!window) return;
			const confirm = window.confirm('Are you sure you want to delete this item?');
			if (!confirm) return;
			const res = await fetch(`/api/menu/item`, {
				method: 'DELETE',
				body: JSON.stringify({
					id
				})
			});

			if (res.ok) {
				formattedItems = formattedItems.filter((item) => item.dbId !== id);
				closeModal();
			} else {
				alert('Failed to delete item. Please try again.');
			}
		}
	}}
	reorderUrl="/api/menu/item/reorder"
	listItems={formattedItems}
/>

<Modal open={openModal === 'categoryCreate'} onClose={closeModal}>
	<form
		class="flex flex-col gap-3"
		on:submit={(e) => {
			e.preventDefault();
			handleCreateCategory(e);
		}}
	>
		<input name="name" type="text" class="input" placeholder="Name" />
		<textarea class="input" placeholder="Description"></textarea>
		<button type="submit" disabled={isSaving} class="btn-primary"
			>{isSaving ? 'Creating...' : 'Create'}</button
		>
	</form>
</Modal>

<Modal open={openModal === 'categoryEdit'} onClose={closeModal}>
	<form
		class="flex flex-col gap-3"
		on:submit={(e) => {
			e.preventDefault();
			if (!currentCategory) return;

			handleUpdateCategory(currentCategory.dbId, e);
		}}
	>
		<input
			name="name"
			type="text"
			bind:value={currentCategory.name}
			class="input"
			placeholder="Name"
		/>
		<textarea class="input" bind:value={currentCategory.description} placeholder="Description"
		></textarea>
		<button type="submit" disabled={isSaving} class="btn-primary"
			>{isSaving ? 'Updating...' : 'Update'}</button
		>
	</form>
</Modal>

<Modal open={openModal === 'itemCreate'} onClose={closeModal}>
	<form
		class="flex flex-col gap-3"
		on:submit={(e) => {
			e.preventDefault();
			handleCreateItem(e);
		}}
	>
		<input name="name" type="text" class="input" placeholder="Name" />
		<div class="flex items-center">
			<div class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold">$</div>
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
		<button type="submit" disabled={isSaving} class="btn-primary"
			>{isSaving ? 'Creating...' : 'Create'}</button
		>
	</form>
</Modal>

<Modal open={openModal === 'itemEdit'} onClose={closeModal}>
	<form
		class="flex flex-col gap-3"
		on:submit={(e) => {
			e.preventDefault();

			if (!currentItem) return;

			handleUpdateItem(currentItem.dbId, e);
		}}
	>
		<input name="name" type="text" bind:value={currentItem.name} class="input" placeholder="Name" />
		<div class="flex items-center">
			<div class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold">$</div>
			<input
				name="price"
				type="number"
				class="input rounded-l-none"
				placeholder="Price"
				bind:value={currentItem.price}
				step="0.10"
			/>
		</div>
		<select name="category" class="input" value={currentItem.category}>
			{#each formattedCategories as category (category.dbId)}
				<option value={category.dbId}>{category.name}</option>
			{/each}
		</select>
		<!-- <input name="img" class="input" placeholder="Image URL" value={currentItem.img} /> -->
		<textarea class="input" bind:value={currentItem.description} placeholder="Description"
		></textarea>
		<button type="submit" disabled={isSaving} class="btn-primary"
			>{isSaving ? 'Updating...' : 'Update'}</button
		>
	</form>
</Modal>

<!-- <div class="col-span-full flex justify-end md:col-span-2">
	<button
		type="submit"
		class="btn-primary w-full md:w-auto"
		on:click={() => {
			openModal = 'categoryCreate';
		}}
	>
		Create Category
	</button>

	
</div> -->
<!-- <div
	class="col-span-full grid grid-cols-1 gap-2"
	use:dndzone={{
		items: formattedCategories,
		flipDurationMs: 100,
		dropTargetStyle: {},
		dragDisabled: isChangingOrder || openModal !== ''
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

			

			<button type="submit" class={`btn-danger !p-2`} draggable="false">
				<Icon icon="mingcute:delete-2-fill" class="h-5 w-5" draggable="false" />
			</button>
		</form>
	{/each}
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

		<Modal open={openModal === 'itemCreate'} onClose={closeModal}>
			<form
				class="flex cursor-default flex-col gap-3"
				on:submit={(e) => {
					e.preventDefault();
					handleCreateItem(e);
				}}
			>
				<input name="name" type="text" class="input" placeholder="Name" />
				<div class="flex items-center">
					<div class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold">
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
				<button type="submit" disabled={isSaving} class="btn-primary"
					>{isSaving ? 'Creating...' : 'Create'}</button
				>
			</form>
		</Modal>
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
					<Modal open={openModal === `item-${item.dbId}`} onClose={closeModal}>
						<form
							class="flex flex-col gap-3"
							on:submit={(e) => {
								e.preventDefault();
								handleUpdateItem(item.dbId, e);
							}}
						>
							<input name="name" type="text" class="input" placeholder="Name" value={item.name} />
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
							<button type="submit" disabled={isSaving} class="btn-primary"
								>{isSaving ? 'Saving...' : 'Save'}</button
							>
						</form>
					</Modal>
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
</div> -->
