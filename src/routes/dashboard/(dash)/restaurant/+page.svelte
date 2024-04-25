<script lang="ts">
	import themes from '$lib/themes';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import SettingAction from '$lib/components/dashboard/SettingAction.svelte';
	import SettingInput from '$lib/components/dashboard/SettingInput.svelte';
	import SettingSelect from '$lib/components/dashboard/SettingSelect.svelte';
	import SettingHead from '$lib/components/dashboard/SettingHead.svelte';

	export let data: PageData;
	const { layoutData } = data;

	let initialLoading = true;

	$: restaurantInfo = {
		published: false,
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
			published: (await layoutData).restaurant?.published ?? false,
			name: (await layoutData).restaurant?.name ?? '',
			theme: (await layoutData).restaurant?.theme ?? '',
			address: (await layoutData).restaurant?.address ?? ''
		};

		initialLoading = false;
	});
</script>

<SettingHead title="Restaurant Info" description="Update your restaurant's details here." />

{#if restaurantInfo.published}
	<SettingAction
		title="Publish"
		description="Whether your restaurant is published or not."
		loading={initialLoading}
		action={{
			name: 'Unpublish',
			type: 'danger',
			func: async () => {
				if (!window) return;

				const confirm = window.confirm('Are you sure you want to unpublish your restaurant?');

				if (!confirm) return;

				await fetch('/api/restaurant/published', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ value: false })
				});

				restaurantInfo.published = false;
			}
		}}
	/>
{:else}
	<SettingAction
		title="Publish"
		description="Whether your restaurant is published or not."
		loading={initialLoading}
		action={{
			name: 'Publish',
			type: 'primary',
			func: async () => {
				if (!window) return;

				const confirm = window.confirm('Are you sure you want to publish your restaurant?');

				if (!confirm) return;

				await fetch('/api/restaurant/published', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ value: true })
				});

				restaurantInfo.published = true;
			}
		}}
	/>
{/if}

<SettingInput
	title="Name"
	description="Your restaurant's name."
	loading={initialLoading}
	initialValue={restaurantInfo.name}
	input={{
		name: 'name',
		type: 'text',
		value: restaurantInfo.name,
		placeholder: "John's Diner",
		submitUrl: '/api/restaurant/name'
	}}
/>
<SettingSelect
	title="Theme"
	description="Your restaurant's theme."
	loading={initialLoading}
	initialValue={restaurantInfo.theme}
	select={{
		name: 'theme',
		type: 'text',
		value: restaurantInfo.theme,
		placeholder: 'Default',
		options: Object.keys(themes),
		submitUrl: '/api/restaurant/theme'
	}}
/>
<SettingInput
	title="Address"
	description="Your restaurant's address."
	loading={initialLoading}
	initialValue={restaurantInfo.address}
	input={{
		name: 'address',
		type: 'text',
		value: restaurantInfo.address,
		placeholder: '123 Main St.',
		submitUrl: '/api/restaurant/address'
	}}
/>
