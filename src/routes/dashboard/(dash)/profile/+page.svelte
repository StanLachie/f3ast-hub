<script async script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import Meta from '$lib/components/utils/Meta.svelte';
	import SettingHead from '$lib/components/dashboard/SettingHead.svelte';
	import SettingInput from '$lib/components/dashboard/SettingInput.svelte';

	export let data: PageData;
	const { layoutData } = data;

	let initialLoading = true;

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

		initialLoading = false;
	});

	let promotionalEmailForm: HTMLFormElement;
</script>

<SettingHead title="Personal Info" description="Update your personal details here." />

<SettingInput
	title="First Name"
	description="Your legal first name."
	loading={initialLoading}
	initialValue={personalInfo.first_name}
	input={{
		name: 'firstName',
		type: 'text',
		value: personalInfo.first_name,
		placeholder: 'John',
		submitUrl: '/api/profile/firstName'
	}}
/>

<SettingInput
	title="Last Name"
	description="Your legal last name."
	loading={initialLoading}
	initialValue={personalInfo.last_name}
	input={{
		name: 'lastName',
		type: 'text',
		value: personalInfo.last_name,
		placeholder: 'Doe',
		submitUrl: '/api/profile/lastName'
	}}
/>