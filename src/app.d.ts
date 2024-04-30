import { Item, DndEvent } from 'svelte-dnd-action';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
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
