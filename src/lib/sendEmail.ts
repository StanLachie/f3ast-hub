import { json } from '@sveltejs/kit';
import { MAIL_USER, MAIL_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';

export const sendEmail = async (
	toEmail: string,
	fromEmail: string,
	subject: string,
	html: string | null,
	text: string | null
) => {
	if (!html && !text) {
		throw new Error('No message content provided.');
	}

	const transporter = nodemailer.createTransport({
		host: 'smtp-relay.brevo.com',
		port: 587,
		secure: false,
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS
		}
	});

	const emailOptions = {
		from: fromEmail,
		to: toEmail,
		subject: subject,
		...(html ? { html } : { text: text || '' })
	};

	transporter
		.sendMail(emailOptions)
		.then(() => {
			return json({
				success: true,
				message: 'Email sent successfully.'
			});
		})
		.catch((error) => {
			return json({
				success: false,
				message: `Error sending email: ${error.message}`
			});
		});
};
