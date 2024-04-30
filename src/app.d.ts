import { Item, DndEvent } from 'svelte-dnd-action';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { MenuCategory, Subscription } from '@prisma/client';

interface Restaurant {
	id: number;
	active: boolean;
	name: string;
	address: string;
	bio: string;
	banner: string;
	logo: string;
	instagram: string;
	facebook: string;
	twitter: string;
	tiktok: string;
	ClientAccount: ClientAccount[];
	MenuCategory: MenuCategory[];
	Subscription: Subscription;
}

interface ClientAccount {
	id: number;
	email: string;
	stripeId: string;
	createdAt: string;
	updatedAt: string;
	restaurantId: number;
	first_name: string;
	last_name: string;
	promotional_emails: boolean;
	Restaurant: Restaurant;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{
				session: Session | null;
				user: User | null;
			}>;
			getClientAccount: () => Promise<{
				clientAccount: ClientAccount | null;
				restaurant: Restaurant | null;
			}>;
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
