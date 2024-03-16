<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let sidebarItems = [
		{
			name: 'Dashboard',
			icon: 'mingcute:home-2-fill',
			link: '/dashboard/welcome'
		},
		{
			name: 'Restaurant',
			icon: 'mingcute:shop-fill',
			link: '/dashboard/restaurant'
		},
		{
			name: 'Billing',
			icon: 'mingcute:bank-card-fill',
			link: '/dashboard/billing'
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

	$: currentRoute = $page.url.pathname;
</script>

<div class=" flex min-h-screen w-screen">
	<div
		class="fixed flex h-dvh min-w-16 flex-col justify-between border-r border-neutral-400 bg-white"
	>
		<div class="flex flex-col divide-y divide-neutral-400 border-b border-neutral-400">
			<div class="flex h-16 cursor-default items-center justify-center font-norwester text-xl">
				F3AST
			</div>
			{#each sidebarItems as item}
				<a
					href={item.link}
					title={item.name}
					class="group flex h-16 items-center justify-center text-2xl hover:bg-neutral-100"
				>
					<Icon
						icon={item.icon}
						class={`${currentRoute === item.link ? 'scale-[120%] text-emerald-300' : ''} transition-all group-hover:scale-[125%]`}
					/>
				</a>
			{/each}
		</div>
		<div class="flex flex-col divide-y divide-neutral-400 border-t border-neutral-400">
			{#each accountItems as item}
				<a
					href={item.link}
					title={item.name}
					class="group flex h-16 items-center justify-center text-2xl hover:bg-neutral-100"
				>
					<Icon
						icon={item.icon}
						class={`${currentRoute === item.link ? 'scale-[120%] text-emerald-300' : ''} transition-all group-hover:scale-[125%]`}
					/>
				</a>
			{/each}
		</div>
	</div>
	<div class="ml-16 flex-grow overflow-y-auto bg-neutral-100 p-2 sm:p-8 md:p-16">
		<slot />
	</div>
</div>
