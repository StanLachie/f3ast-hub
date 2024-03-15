<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	let first_name = data.client?.first_name;
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Personal Info</h1>
		<p class="text-neutral-600">Update your personal details here.</p>

		<div class="my-6 flex flex-col gap-4">
			<div
				class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
			>
				<div class="flex-1">
					<h2 class="text-lg font-semibold">First Name</h2>
					<p class="text-neutral-600">Your legal first name.</p>
				</div>
				<div class="relative flex-1">
					<input bind:value={first_name} type="text" placeholder="John" class="input h-full p-4" />
					{#if first_name !== data.client?.first_name}
						<button
							transition:fade={{
								duration: 100
							}}
							class="btn-primary absolute bottom-[10px] right-[10px] !p-1"
						>
							<Icon icon="material-symbols-light:save-outline" class="h-6 w-6" />
						</button>
					{/if}
				</div>
			</div>
			<div
				class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
			>
				<div class="flex-1">
					<h2 class="text-lg font-semibold">Last Name</h2>
					<p class="text-neutral-600">Your legal surname.</p>
				</div>
				<input value={data.client?.last_name} type="text" placeholder="Doe" class="input flex-1" />
			</div>
			<div
				class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
			>
				<div class="flex-1">
					<h2 class="text-lg font-semibold">Email</h2>
					<p class="text-neutral-600">Your email address.</p>
				</div>
				<input
					value={data.client?.email}
					type="email"
					placeholder="johndoe@email.com"
					class="input flex-1"
				/>
			</div>
		</div>
	</div>

	<div>
		<h1 class="mb-2 text-3xl font-semibold">Contact Preferences</h1>
		<p class="text-neutral-600">Update your personal details here.</p>

		<div class="my-6 flex flex-col gap-4">
			<div
				class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row"
			>
				<div class="flex-1">
					<h2 class="text-lg font-semibold">Receive Emails</h2>
					<p class="text-neutral-600">Receive promotional emails.</p>
				</div>

				<div class="flex items-center gap-3 md:flex-row-reverse">
					<input type="checkbox" class="h-4 w-4" />
					<p class="text-neutral-600">Yes, I want to receive emails.</p>
				</div>
			</div>
		</div>
	</div>
</div>
