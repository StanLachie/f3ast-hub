import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import { uploadImageAndPrompt } from '$lib/open-ai';

export const POST: RequestHandler = async ({ request }) => {
    const { base64Image, prompt } = await request.json();
    const result = await uploadImageAndPrompt(base64Image, prompt);
    return json(result);
};
