<script lang="ts">
	import type { PageData } from './$types';
	import SettingHead from '$lib/components/dashboard/SettingHead.svelte';
	import SettingAction from '$lib/components/dashboard/SettingAction.svelte';
</script>

<SettingHead title="Billing" description="Update your billing details here." />

<SettingAction
	title="Update Billing"
	description="Update your billing details here."
	loading={false}
	action={{
		name: 'Update',
		type: 'primary',
		href: '/dashboard/billing'
	}}
/>
