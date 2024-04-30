<script lang="ts">
	import SettingHead from '$lib/components/dashboard/SettingHead.svelte';
	import Meta from '$lib/components/utils/Meta.svelte';
	import SettingAction from '$lib/components/dashboard/SettingAction.svelte';
</script>

<Meta
	title="Support"
	description="Need help with your restaurant? Running into issues? We're here to help."
/>

<SettingHead
	title="Support"
	description="Need help with your restaurant? Running into issues? We're here to help."
/>

<SettingAction
	title="Need to contact us?"
	description="Send us an email and we'll get back to you ASAP."
	loading={false}
	action={{
		name: 'Contact Us',
		type: 'primary',
		href: 'mailto:support@f3ast.com?subject=Client%20Support%20Needed%20%7C%20%40%201%20%7C%20%40%202%20%7C%20%40%203'
	}}
/>
