export class DiscordError extends Error {
  constructor(message, userMessage) {
    super(message);
    this.userMessage = userMessage || message;
  }
}
