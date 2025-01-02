import { OPEN_AI_API_KEY } from "$env/static/private";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY as string,
});

const responseFormat = {
  type: "json_schema" as const,
  json_schema: {
    name: "menu_response",
    schema: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              existingId: {
                type: ["number", "null"],
                description:
                  "ID of an existing category or null for new categories.",
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Name of the menu item.",
                    },
                    price: {
                      type: "number",
                      description:
                        "Price of the item, 0 if price is not visible.",
                    },
                  },
                  required: ["name", "price"],
                  additionalProperties: false,
                },
                description: "Array of menu items within the category.",
              },
            },
            required: ["name", "existingId", "items"],
            additionalProperties: false,
          },
          description: "Array of categories containing menu items.",
        },
      },
      required: ["categories"],
      additionalProperties: false,
    },
    strict: true,
  },
};

export async function uploadImageAndPrompt(
  base64Image: string,
  prompt: string
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: responseFormat,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: { url: `${base64Image}` },
            },
          ],
        },
      ],
    });
    return response.choices[0];
  } catch (error) {
    console.error("Error uploading image to OpenAI:", error);
    throw error;
  }
}
