<script lang="ts">
	import { enhance } from '$app/forms';
	import themes from '$lib/themes';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	let restaurantInfo = {
		name: data.restaurant.name,
		theme: data.restaurant.theme,
		address: data.restaurant.address
	};
</script>

<meta:head>
	<title>Dashboard | Restaurant</title>
</meta:head>

{#if data.subscription?.status === 'active'}
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
		<div>
			<h1 class="my-2 text-3xl font-semibold">Restaurant Info</h1>
			<p class="text-neutral-600">Update your restaurant's details here.</p>

			<div class="my-6 flex flex-col gap-4">
				<div
					class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
				>
					<div class="flex-1">
						<h2 class="text-lg font-semibold">Published</h2>
						<p class="text-neutral-600">Whether your restaurant is published or not.</p>
					</div>
					<form method="post" action="?/publish" class="">
						<button
							class={`btn-primary hover:bg-emerald-300 ${!data.restaurant.published && 'bg-red-300 hover:bg-red-400'}`}
							type="submit">{data.restaurant.published ? 'Published' : 'Not Published'}</button
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
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
					>
						<input
							bind:value={restaurantInfo.name}
							name="name"
							type="text"
							placeholder="John's Diner"
							class="input h-full p-4"
						/>
						{#if restaurantInfo.name !== data.restaurant?.name}
							<button
								transition:fade={{
									duration: 100
								}}
								class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
							>
								<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
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
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
					>
						<select
							bind:value={restaurantInfo.theme}
							name="theme"
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
						{#if restaurantInfo.theme !== data.restaurant?.theme}
							<button
								transition:fade={{
									duration: 100
								}}
								class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
							>
								<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
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
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
					>
						<input
							bind:value={restaurantInfo.address}
							name="address"
							type="text"
							placeholder="123 Main St."
							class="input h-full p-4"
						/>
						{#if restaurantInfo.address !== data.restaurant?.address}
							<button
								transition:fade={{
									duration: 100
								}}
								class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
							>
								<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
							</button>
						{/if}
					</form>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-full items-center justify-center">
		<div class="flex flex-col items-center gap-2">
			<h1 class="text-4xl font-bold text-emerald-300">
				{data.restaurant.name} is currently inactive
			</h1>
			<p class="text-lg font-semibold text-neutral-600">
				Please check the restaurant's billing page to reactivate.
			</p>
		</div>
	</div>
{/if}
