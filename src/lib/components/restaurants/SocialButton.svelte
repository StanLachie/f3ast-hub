<script lang="ts">
	import ThemeStore from '$lib/stores/ThemeStore';
	import themes from '$lib/themes';
	import Icon from '@iconify/svelte';

	let currentTheme = themes.default;
	ThemeStore.subscribe((value) => {
		currentTheme = value;
	});

	export let icon: string;
	export let url: string;
</script>

<button
	on:click={() => {
		window.open(url, '_blank');
	}}
	class={currentTheme.components.socialButton}
>
	<Icon {icon} class="h-6 w-6" />
</button>
