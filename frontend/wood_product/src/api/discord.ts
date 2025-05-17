
import axios from "axios";

export async function sendDiscordMessage(
  message: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Get the webhook URL from environment variables
    const webhookUrl =
      import.meta.env.VITE_DISCORD_WEBHOOK_URL ||
      import.meta.env.REACT_APP_DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error(
        "Discord webhook URL is not defined in environment variables"
      );
      return { success: false, error: "Discord webhook configuration error" };
    }

    // Send to Discord webhook
    const response = await axios.post(
      webhookUrl,
      { content: message },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.error("Failed to send message to Discord:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send message to Discord",
    };
  }
}
