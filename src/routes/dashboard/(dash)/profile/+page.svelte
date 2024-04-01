<script async script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let data: PageData;
	const { layoutData } = data;

	let personalInfo = {
		first_name: '',
		last_name: ''
	};
	let contactPreferences = {
		promotional_emails: false
	};

	// Set the personal info
	onMount(async () => {
		personalInfo = {
			first_name: (await layoutData).client?.first_name ?? '',
			last_name: (await layoutData).client?.last_name ?? ''
		};
		contactPreferences = {
			promotional_emails: (await layoutData).client?.promotional_emails ?? false
		};
	});

	let promotionalEmailForm: HTMLFormElement;
</script>

<meta:head>
	<title>Dashboard | Profile</title>
</meta:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Personal Info</h1>
		<p class="text-neutral-600">Update your personal details here.</p>
		<div class="my-6 flex flex-col gap-4">
			{#await data.layoutData}
				<div
					class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
				>
					<p class="font-semibold">Loading Your Personal Info</p>
				</div>
			{:then layoutData}
				<div
					class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
				>
					<div class="flex-1">
						<h2 class="text-lg font-semibold">First Name</h2>
						<p class="text-neutral-600">Your legal first name.</p>
					</div>
					<form
						class="relative flex-1"
						method="post"
						use:enhance={() => {
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
					>
						<input
							bind:value={personalInfo.first_name}
							name="firstName"
							type="text"
							placeholder="John"
							class="input h-full p-4"
						/>
						{#if personalInfo.first_name !== layoutData.client?.first_name}
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
						<h2 class="text-lg font-semibold">Last Name</h2>
						<p class="text-neutral-600">Your legal last name.</p>
					</div>
					<form
						class="relative flex-1"
						method="POST"
						use:enhance={() => {
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
					>
						<input
							bind:value={personalInfo.last_name}
							name="lastName"
							type="text"
							placeholder="Doe"
							class="input h-full p-4"
						/>
						{#if personalInfo.last_name !== layoutData.client?.last_name}
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
			{/await}
		</div>
	</div>

	<div>
		<h1 class="mb-2 text-3xl font-semibold">Contact Preferences</h1>
		<p class="text-neutral-600">Update your personal details here.</p>

		{#await data.layoutData}
			<div
				class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
			>
				<p class="font-semibold">Loading Your Contact Preferences</p>
			</div>
		{:then layoutData}
			<div class="my-6 flex flex-col gap-4">
				<div
					class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
				>
					<div class="flex-1">
						<h2 class="text-lg font-semibold">Receive Emails</h2>
						<p class="text-neutral-600">Receive promotional emails.</p>
					</div>

					<form
						bind:this={promotionalEmailForm}
						class="flex items-center gap-3 md:flex-row-reverse"
						method="POST"
						use:enhance={() => {
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
					>
						<input
							name="promotionalEmails"
							type="checkbox"
							class="h-4 w-4"
							bind:checked={contactPreferences.promotional_emails}
							on:change={() =>
								promotionalEmailForm.dispatchEvent(new Event('submit', { bubbles: true }))}
						/>
						<p class="text-neutral-600">Yes, I want to receive emails.</p>
					</form>
				</div>
			</div>
		{/await}
	</div>
</div>
