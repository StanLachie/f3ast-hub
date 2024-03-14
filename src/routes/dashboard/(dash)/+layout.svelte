<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let sidebarItems = [
		{
			name: 'Dashboard',
			icon: 'mingcute:home-2-fill',
			link: '/dashboard/welcome'
		}
	];

	let accountItems = [
		{
			name: 'Profile',
			icon: 'mingcute:user-3-fill',
			link: '/dashboard/profile'
		},
		{
			name: 'Logout',
			icon: 'mingcute:exit-line',
			link: '/dashboard/logout'
		}
	];
</script>

<div class="flex min-h-screen w-screen divide-x divide-neutral-400">
	<div class="flex h-screen w-16 flex-col justify-between bg-white">
		<div class="flex flex-col divide-y divide-neutral-400 border-b border-neutral-400">
			{#each sidebarItems as item}
				<a
					href={item.link}
					class="flex h-16 items-center justify-center text-2xl hover:bg-neutral-100"
				>
					<Icon icon={item.icon} />
				</a>
			{/each}
		</div>
		<div class="flex flex-col divide-y divide-neutral-400 border-t border-neutral-400">
			{#each accountItems as item}
				<a
					href={item.link}
					class="flex h-16 items-center justify-center text-2xl hover:bg-neutral-100"
				>
					<Icon icon={item.icon} />
				</a>
			{/each}
		</div>
	</div>
	<div>
		<slot />
	</div>
</div>
