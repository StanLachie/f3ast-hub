import { BREVO_API_KEY } from '$env/static/private';

export const sendEmail = async (
	toEmail: string,
	toName: string | null,
	fromEmail: string,
	fromName: string,
	subject: string,
	html: string | null,
	text: string | null
) => {
	// Validate input parameters
	if (!toEmail || !fromEmail || !subject) {
		throw new Error('Missing required email parameters.');
	}
	if (!html && !text) {
		throw new Error('No message content provided.');
	}

	try {
		const response = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': BREVO_API_KEY
			},
			body: JSON.stringify({
				sender: {
					name: fromName,
					email: fromEmail
				},
				to: [
					{
						email: toEmail,
						name: toName
					}
				],
				...(html ? { htmlContent: html } : { textContent: text || '' }),
				subject
			})
		});

		// Check if the request was successful
		if (!response.ok) {
			const errorData = await response.json();

			console.log(errorData);

			throw new Error(`Failed to send email: ${errorData.message}`);
		}
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Email sending failed due to an unexpected error.');
	}
};
