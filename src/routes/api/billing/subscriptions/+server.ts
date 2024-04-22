import { createStripeClient } from '$lib/stripe';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import prisma from '$lib/prisma';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i] as number;
	}
	return buf;
}

export const POST: RequestHandler = async ({ request }) => {
	const _rawBody = await request.arrayBuffer();
	const payload = toBuffer(_rawBody);
	const signature = request.headers.get('stripe-signature') as string;
	const stripe = createStripeClient();
	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error(`⚠️ Webhook signature verification failed.`, err);
		throw error(400, 'Invalid request.');
	}

	switch (event.type) {
		case 'invoice.paid':
			{
				const subscriptionDetails = event.data.object.subscription_details;
				const restaurantId = subscriptionDetails?.metadata?.restaurantId;

				if (restaurantId) {
					const restaurant = await prisma.restaurant.findUnique({
						where: {
							id: parseInt(restaurantId)
						}
					});

					if (restaurant) {
						await prisma.restaurant.update({
							where: {
								id: restaurant.id
							},
							data: {
								active: true
							}
						});

						await prisma.subscription.upsert({
							where: {
								restaurantId: restaurant.id
							},
							update: {
								status: 'active',
								stripeSubscriptionId: (event.data.object.subscription as string) || '',
								stripeCustomerId: (event.data.object.customer as string) || ''
							},
							create: {
								restaurantId: restaurant.id,
								stripeSubscriptionId: (event.data.object.subscription as string) || '',
								stripeCustomerId: (event.data.object.customer as string) || '',
								status: 'active'
							}
						});
					}
				}
			}

			break;
		case 'invoice.payment_failed': {
			const subscriptionDetails = event.data.object.subscription_details;
			const restaurantId = subscriptionDetails?.metadata?.restaurantId;

			if (restaurantId) {
				const restaurant = await prisma.restaurant.findUnique({
					where: {
						id: parseInt(restaurantId)
					}
				});

				if (restaurant) {
					await prisma.restaurant.update({
						where: {
							id: restaurant.id
						},
						data: {
							active: false
						}
					});

					await prisma.subscription.update({
						where: {
							restaurantId: restaurant.id
						},
						data: {
							status: 'inactive'
						}
					});
				}
			}

			break;
		}
	}

	return json({ received: true });
};
