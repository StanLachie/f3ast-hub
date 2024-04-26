<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	import SettingHead from '$lib/components/dashboard/SettingHead.svelte';
	import SettingList from '$lib/components/dashboard/SettingList.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { quintOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';

	interface Category {
		id: number;
		dbId: number;
		name: string;
		description: string | null;
		sortingIndex: number;
	}

	interface MenuItem {
		id: number;
		dbId: number;
		name: string;
		price: number;
		img: string | null;
		categoryId: number | null;
		description: string | null;
		sortingIndex: number;
	}

	export let data: PageData;
	const { pageData } = data;

	export let isChangingOrder = false;

	let formattedCategories: Category[] = [];
	let formattedItems: MenuItem[] = [];

	let initialLoading = true;
	let isUploadingImage = false;
	let isSaving = false;
	let isReordering = false;

	let previewImage: string | null = null;

	let currentCategory: Category | null = null;
	let currentItem: MenuItem | null = null;

	onMount(async () => {
		const categories = (await pageData)?.categories;
		formattedCategories = categories
			? categories
					.sort((a, b) => a.sortingIndex - b.sortingIndex)
					.map((category) => ({
						id: category.sortingIndex,
						dbId: category.id,
						name: category.name,
						description: category.description,
						sortingIndex: category.sortingIndex
					}))
			: [];

		const items = (await pageData)?.menuItems;
		formattedItems = items
			? items
					.sort((a, b) => a.sortingIndex - (b.sortingIndex ?? 0))
					.map((item) => ({
						id: item.sortingIndex,
						dbId: item.id,
						name: item.name,
						price: item.price,
						img: item.img,
						description: item.description,
						categoryId: item.categoryId,
						sortingIndex: item.sortingIndex
					}))
			: [];

		initialLoading = false;
	});

	const handleCreateItem = async (event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name') || !formData.get('price') || !formData.get('category')) return;

		isSaving = true;

		let newItem: Partial<MenuItem> = {
			id: new Date().getTime(),
			dbId: new Date().getTime(),
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			price: parseFloat(formData.get('price') as string),
			img: formData.get('img') as string,
			categoryId: parseFloat(formData.get('category') as string)
		};

		const res = await fetch(`/api/menu/item`, {
			method: 'POST',
			body: JSON.stringify(newItem)
		});

		if (res.ok) {
			let { item }: { item: MenuItem } = await res.json();

			if (!data) return;

			newItem = item;

			newItem.dbId = newItem.id ?? 0;
			newItem.id = formattedItems.length + 1 ?? 0;
			newItem.sortingIndex = item.sortingIndex;
			newItem.categoryId = item.categoryId;

			formattedItems.push({
				...newItem,
				id: newItem.id,
				dbId: newItem.dbId,
				name: newItem.name ?? '',
				price: newItem.price ?? 0,
				img: newItem.img ?? null,
				description: newItem.description ?? null,
				categoryId: newItem.categoryId,
				sortingIndex: newItem.sortingIndex
			});
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

		let newCategory: Partial<Category> = {
			id: new Date().getTime(),
			dbId: new Date().getTime(),
			name: formData.get('name') as string
		};

		const res = await fetch(`/api/menu/category`, {
			method: 'POST',
			body: JSON.stringify(newCategory)
		});

		if (res.ok) {
			let { category }: { category: Category } = await res.json();

			newCategory = category;

			newCategory.dbId = newCategory.id ?? 0;
			newCategory.id = formattedCategories.length + 1;
			newCategory.sortingIndex = category.sortingIndex;

			formattedCategories.push({
				...newCategory,
				id: newCategory.id,
				dbId: newCategory.dbId,
				name: newCategory.name ?? '',
				description: newCategory.description ?? null,
				sortingIndex: newCategory.sortingIndex
			});
			closeModal();
		}

		isSaving = false;
	};

	const handleUpdateItem = async (id: number, event: Event) => {
		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		if (!formData.get('name') || !formData.get('price') || !formData.get('category')) return;

		console.log(formData.get('img'));

		let updatedItem: Partial<MenuItem> = {
			id: id,
			dbId: id,
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			price: parseFloat(formData.get('price') as string),
			img: previewImage || (formData.get('img') as string),
			categoryId: parseFloat(formData.get('category') as string)
		};

		const res = await fetch(`/api/menu/item?id=${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedItem)
		});

		if (res.ok) {
			let { item }: { item: MenuItem } = await res.json();

			updatedItem = item;

			updatedItem.dbId = item.id;
			updatedItem.id = item.sortingIndex;
			updatedItem.categoryId = item.categoryId;

			formattedItems = formattedItems.map((item) =>
				item.dbId === id
					? {
							...updatedItem,
							id: item.id,
							dbId: item.dbId,
							sortingIndex: item.sortingIndex,
							categoryId: item.categoryId,
							name: updatedItem.name ?? item.name,
							price: updatedItem.price ?? item.price,
							img: previewImage ?? updatedItem.img ?? item.img,
							description: updatedItem.description ?? item.description
						}
					: item
			);
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

		let updatedCategory: Partial<Category> = {
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
			let { category }: { category: Category } = await res.json();

			updatedCategory = category;

			updatedCategory.dbId = category.id;
			updatedCategory.id = category.sortingIndex;
			updatedCategory.sortingIndex = category.sortingIndex;

			formattedCategories = formattedCategories.map((category) =>
				category.dbId === id
					? {
							...updatedCategory,
							id: category.id,
							dbId: category.dbId,
							name: updatedCategory.name ?? category.name,
							description: updatedCategory.description ?? category.description,
							sortingIndex: updatedCategory.sortingIndex ?? category.sortingIndex
						}
					: category
			);
			closeModal();
		} else {
			alert('Failed to update category. Please try again.');
		}

		isSaving = false;
	};

	const handleFileChange = async (event: Event) => {
		const file = (event.target as HTMLInputElement)?.files?.[0];
		if (file) {
			isUploadingImage = true;
			const formData = new FormData();
			formData.append('menuImageFile', file);
			// formData.append('id', currentItem?.dbId);

			await fetch('/api/menu/item/cover', {
				method: 'POST',
				body: formData
			})
				.then(async (response) => {
					if (response.ok) {
						console.log('Image uploaded successfully');
						if (!currentItem) return;

						previewImage = (await response.json()).url;
					} else {
						console.error('Failed to upload image');
					}
				})
				.catch((error) => {
					console.error('Error uploading image:', error);
				})
				.finally(() => {
					isUploadingImage = false;
				});
		}
	};

	let openModal = '';
	const closeModal = () => {
		openModal = '';
		previewImage = null;
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

			currentCategory = formattedCategories.find((category) => category.dbId === id) || null;
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

			currentItem = formattedItems.find((item) => item.dbId === id) || null;
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
		<span class="mb-2 text-2xl font-semibold"> Create Category </span>
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
		{#if currentCategory}
			<span class="mb-2 text-2xl font-semibold"> Update {currentCategory.name} </span>
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
		{/if}
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
		<span class="mb-2 text-2xl font-semibold"> Create Item </span>
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
		{#if currentItem}
			<input
				name="name"
				type="text"
				bind:value={currentItem.name}
				class="input"
				placeholder="Name"
			/>
			<div class="flex items-center justify-center">
				{#if isUploadingImage}
					<div
						class="flex aspect-square w-full animate-pulse items-center justify-center rounded-xl bg-neutral-200 text-6xl font-bold"
					>
						<Icon icon="mingcute:loading-3-fill" class="h-32 w-32 animate-spin text-emerald-500" />
					</div>
				{:else if currentItem.img || previewImage}
					<form id="img-form" class="group relative w-full" enctype="multipart/form-data">
						<input id="img" type="file" accept="image/*" on:change={handleFileChange} hidden />
						<img
							src={previewImage || currentItem.img}
							alt=""
							class="aspect-square w-full cursor-pointer rounded-xl border border-neutral-400 object-cover"
						/>
						<button
							on:click={(e) => {
								e.stopPropagation();
								e.preventDefault();

								document.getElementById('img')?.click();
							}}
							class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-neutral-800 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
						>
							<Icon icon="mingcute:edit-2-fill" class="h-1/3 w-1/3 text-emerald-500" />
						</button>
					</form>
				{:else}
					<form id="img-form" class="w-full" enctype="multipart/form-data">
						<input id="img" type="file" accept="image/*" on:change={handleFileChange} hidden />
						<button
							class={`flex aspect-square w-full items-center justify-center rounded-xl bg-neutral-200 text-6xl font-bold`}
							on:click={(e) => {
								e.stopPropagation();
								e.preventDefault();

								document.getElementById('img')?.click();
							}}
						>
							{currentItem.name
								.split(' ')
								.map((word) => word[0])
								.join('')}
						</button>
					</form>
				{/if}
			</div>
			<input name="img" type="text" bind:value={currentItem.img} hidden />

			<div class="flex items-center">
				<div class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold">
					$
				</div>
				<input
					name="price"
					type="number"
					class="input rounded-l-none"
					placeholder="Price"
					bind:value={currentItem.price}
					step="0.10"
				/>
			</div>
			<select name="category" class="input" value={currentItem.categoryId}>
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
		{/if}
	</form>
</Modal>
