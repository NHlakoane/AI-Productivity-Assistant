const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/*
  We keep several models available.

  If one model is temporarily unavailable or experiencing
  high demand, the application automatically tries the next one.
*/
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
];

async function generateWithModel(model, systemPrompt, contents) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },

        contents,
      }),
    }
  );

  const data = await response.json();

  return {
    response,
    data,
  };
}

function extractText(data) {
  return data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
}

async function generateAIResponse(systemPrompt, contents) {
  if (!API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY is missing. Check your .env file."
    );
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const { response, data } =
        await generateWithModel(
          model,
          systemPrompt,
          contents
        );

      if (response.ok) {
        const text = extractText(data);

        if (text) {
          console.log(
            `Gemini response generated using: ${model}`
          );

          return text;
        }

        lastError = new Error(
          `Gemini returned no text using ${model}.`
        );

        continue;
      }

      const status = response.status;
      const message =
        data?.error?.message ||
        `Gemini request failed with status ${status}`;

      console.warn(
        `Gemini model ${model} failed:`,
        message
      );

      /*
        429 = rate limit
        500 = server error
        503 = temporarily unavailable / high demand

        These are exactly the situations where we want
        to try another model.
      */
      if (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503
      ) {
        lastError = new Error(message);
        continue;
      }

      /*
        For other errors, such as authentication problems,
        don't blindly try every model.
      */
      throw new Error(message);
    } catch (error) {
      console.warn(
        `Model ${model} failed:`,
        error.message
      );

      lastError = error;
    }
  }

  throw new Error(
    lastError?.message ||
      "All Gemini models are temporarily unavailable. Please try again."
  );
}


/*
  Used by Email, Meeting Notes, Task Planner,
  Research Assistant and the Career tools.
*/
export async function askClaude(
  systemPrompt,
  userMessage
) {
  return generateAIResponse(
    systemPrompt,
    [
      {
        role: "user",
        parts: [
          {
            text: userMessage,
          },
        ],
      },
    ]
  );
}


/*
  Used by the AI Workplace Chatbot.
*/
export async function askGeminiChat(
  systemPrompt,
  messages
) {
  const contents = messages.map((message) => ({
    role:
      message.role === "assistant"
        ? "model"
        : message.role,

    parts: [
      {
        text: message.content,
      },
    ],
  }));

  return generateAIResponse(
    systemPrompt,
    contents
  );
}