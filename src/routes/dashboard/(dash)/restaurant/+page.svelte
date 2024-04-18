<script lang="ts">
	import { enhance } from '$app/forms';
	import themes from '$lib/themes';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	const { layoutData } = data;

	let restaurantInfo = {
		name: '',
		theme: '',
		address: ''
	};

	let submittingFields = {
		published: false,
		name: false,
		theme: false,
		address: false
	};

	onMount(async () => {
		restaurantInfo = {
			name: (await layoutData).restaurant?.name ?? '',
			theme: (await layoutData).restaurant?.theme ?? '',
			address: (await layoutData).restaurant?.address ?? ''
		};
	});
</script>

<meta:head>
	<title>Dashboard | Restaurant</title>
</meta:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Restaurant Info</h1>
		<p class="text-neutral-600">Update your restaurant's details here.</p>

		<div class="my-6 flex flex-col gap-4">
			{#await data.layoutData}
				<div class="w-full">
					<div
						class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
					>
						<p class="font-semibold">Loading Your Restaurant Info</p>
					</div>
				</div>
			{:then layoutData}
				{#if layoutData.subscription?.status === 'active'}
					<div
						class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
					>
						<div class="flex-1">
							<h2 class="text-lg font-semibold">Published</h2>
							<p class="text-neutral-600">Whether your restaurant is published or not.</p>
						</div>
						<form
							method="post"
							action="?/publish"
							use:enhance={() => {
								submittingFields.published = true;
								return async ({ update }) => {
									update({ reset: false });
									submittingFields.published = false;
								};
							}}
						>
							<button
								class={`btn-primary hover:bg-emerald-300 ${!layoutData.restaurant?.published && 'bg-red-300 hover:bg-red-400'}`}
								type="submit"
								>{submittingFields.published
									? 'Updating...'
									: layoutData.restaurant?.published
										? 'Published'
										: 'Unpublished'}</button
							>
						</form>
					</div>
					<div
						class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
					>
						<div class="flex-1">
							<h2 class="text-lg font-semibold">Name</h2>
							<p class="text-neutral-600">Your restaurant's name.</p>
						</div>
						<form
							class="relative flex-1"
							method="post"
							action="?/update"
							use:enhance={() => {
								submittingFields.name = true;
								return async ({ update }) => {
									update({ reset: false });
									submittingFields.name = false;
								};
							}}
						>
							<input
								bind:value={restaurantInfo.name}
								name="name"
								disabled={submittingFields.name}
								type="text"
								placeholder="John's Diner"
								class="input h-full p-4"
							/>
							{#if restaurantInfo.name !== layoutData.restaurant?.name}
								<button
									disabled={submittingFields.name}
									transition:fade={{
										duration: 100
									}}
									class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
								>
									{#if submittingFields.name}
										<Icon icon="mingcute:loading-3-fill" class="h-6 w-6 animate-spin" />
									{:else}
										<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
									{/if}
								</button>
							{/if}
						</form>
					</div>
					<!-- Theme -->
					<div
						class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
					>
						<div class="flex-1">
							<h2 class="text-lg font-semibold">Theme</h2>
							<p class="text-neutral-600">Your restaurant's theme.</p>
						</div>
						<form
							class="relative flex-1"
							method="post"
							action="?/update"
							use:enhance={() => {
								submittingFields.theme = true;
								return async ({ update }) => {
									update({ reset: false });
									submittingFields.theme = false;
								};
							}}
						>
							<select
								bind:value={restaurantInfo.theme}
								name="theme"
								disabled={submittingFields.theme}
								class="input h-full appearance-none p-4"
							>
								<option value="default">Default</option>
								<option value="dark">Dark</option>
								<option value="cream">Cream</option>
								<option value="pine">Pine</option>
								<option value="chocolate">Chocolate</option>
								<option value="ocean">Ocean</option>
								<option value="lavender">Lavender</option>
								<option value="amber">Amber</option>
								<option value="pluto">Pluto</option>
								<option value="bubblegum">Bubblegum</option>
								<option value="f3ast">F3AST</option>
							</select>
							{#if restaurantInfo.theme !== layoutData.restaurant?.theme}
								<button
									disabled={submittingFields.theme}
									transition:fade={{
										duration: 100
									}}
									class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
								>
									{#if submittingFields.theme}
										<Icon icon="mingcute:loading-3-fill" class="h-6 w-6 animate-spin" />
									{:else}
										<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
									{/if}
								</button>
							{/if}
						</form>
					</div>
					<div
						class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
					>
						<div class="flex-1">
							<h2 class="text-lg font-semibold">Address</h2>
							<p class="text-neutral-600">Your restaurant's address.</p>
						</div>
						<form
							class="relative flex-1"
							method="post"
							action="?/update"
							use:enhance={() => {
								submittingFields.address = true;
								return async ({ update }) => {
									update({ reset: false });
									submittingFields.address = false;
								};
							}}
						>
							<input
								bind:value={restaurantInfo.address}
								name="address"
								disabled={submittingFields.address}
								type="text"
								placeholder="123 Main St."
								class="input h-full p-4"
							/>
							{#if restaurantInfo.address !== layoutData.restaurant?.address}
								<button
									disabled={submittingFields.address}
									transition:fade={{
										duration: 100
									}}
									class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
								>
									{#if submittingFields.address}
										<Icon icon="mingcute:loading-3-fill" class="h-6 w-6 animate-spin" />
									{:else}
										<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
									{/if}
								</button>
							{/if}
						</form>
					</div>
				{:else}
					<div class="flex min-h-full items-center justify-center">
						<div class="flex flex-col items-center gap-2">
							<h1 class="text-4xl font-bold text-emerald-300">
								{layoutData.restaurant?.name} is currently inactive
							</h1>
							<p class="text-lg font-semibold text-neutral-600">
								Please check the restaurant's billing page to reactivate.
							</p>
						</div>
					</div>
				{/if}
			{/await}
		</div>
	</div>
</div>
