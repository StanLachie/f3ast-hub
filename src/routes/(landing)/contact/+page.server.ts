import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { sendEmail } from "$lib/sendEmail";

export const actions: Actions = {
  contact: async ({ request }) => {
    const data = await request.formData();

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;

    if (!name || !email || !subject || !message) {
      return fail(400, {
        error: true,
        message: "Please fill out all fields.",
      });
    }

    try {
      await sendEmail(
        "lachlan@f3ast.com",
        "Lachlan @ F3AST",
        "noreply@f3ast.com",
        name,
        email,
        subject,
        null,
        message
      ).then(async () => {
        await sendEmail(
          email,
          name,
          "noreply@f3ast.com",
          "Public Inquiries @ F3AST",
          null,
          `We've received your message.`,
          null,
          "Thanks for contacting us. We'll get back to you as soon as possible.\n\nBest regards,\nF3AST"
        )
          .then(() => {
            return { success: true };
          })
          .catch((error) => {
            return { success: false, message: error.message };
          });
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      return fail(500, {
        error: true,
        message: "Failed to send the message. Please try again later.",
      });
    }
  },
};
