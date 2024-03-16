import { stripe } from '$lib/stripe';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BASE_URL } from '$env/static/private';
import prisma from '$lib/prisma';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	reactivate: async ({ locals }) => {
		const session = await locals.getSession();

		if (!session) {
			redirect(302, '/dashboard/login');
		}

		const client = await prisma.clientAccount.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!client) {
			redirect(302, '/dashboard/login');
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: client.restaurantId || 0
			}
		});

		if (!restaurant) {
			redirect(302, '/dashboard/login');
		}

		const stripeSession = await stripe.checkout.sessions.create({
			billing_address_collection: 'auto',
			line_items: [
				{
					price: 'price_1OYiywJkLTgCVE9z34dDdKwq',
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${BASE_URL}/dashboard/billing/reactivate?success=true&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${BASE_URL}/dashboard/billing/reactivate?canceled=true`,
			subscription_data: {
				metadata: {
					restaurantId: restaurant.id
				}
			}
		});

		if (!stripeSession.url) {
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		return redirect(303, stripeSession.url);
	},
	update: async ({ locals }) => {
		const session = await locals.getSession();

		if (!session) {
			redirect(302, '/dashboard/login');
		}

		const client = await prisma.clientAccount.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!client) {
			redirect(302, '/dashboard/login');
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: client.restaurantId || 0
			}
		});

		if (!restaurant) {
			redirect(302, '/dashboard/login');
		}

		const subscription = await prisma.subscription.findUnique({
			where: {
				restaurantId: restaurant.id
			}
		});

		if (!subscription) {
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		const stripeSession = await stripe.billingPortal.sessions.create({
			customer: subscription.stripeCustomerId,
			return_url: `${BASE_URL}/dashboard/billing`
		});

		return redirect(303, stripeSession.url);
	}
};
