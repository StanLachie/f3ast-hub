<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let variant: 'outline' | 'primary' = 'primary';
	export let to: string | undefined = undefined;
	export let onClick: () => void = () => {};

	const buttonBase =
		'py-2 px-3 font-semibold shadow-sm text-sm rounded-lg hover:scale-[97.5%] transition-all';

	const variantStyles = {
		primary: twMerge(buttonBase, 'bg-emerald-300 text-emerald-950 hover:bg-emerald-400 border-emerald-300 border'),
		outline: twMerge(buttonBase, 'hover:bg-neutral-100 border')
	};
</script>

<a href={to}>
	<button on:click={onClick} class={twMerge(`${variantStyles[variant]}`, `${$$restProps.class}`)}>
		<slot />
	</button>
</a>
