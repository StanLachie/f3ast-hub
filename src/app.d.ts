import { Item, DndEvent } from 'svelte-dnd-action';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient;
			getSession: () => Promise<import('@supabase/supabase-js').Session | null>;
			getUser: () => Promise<{
				account: any;
				restaurant: any;
			} | null>;
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/public' {
	export const MAIL_USER: string;
	export const MAIL_PASS: string;
}

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent<Item>> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent<Item>> & { target: EventTarget & T }) => void;
	}
}

export {};
