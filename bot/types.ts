import { EmbedField } from "discord.js";

export class KitkatBotCommandError extends Error {
  public embedOptions: EmbedOptions;

  constructor(message: string, embedOptions: EmbedOptions = {}) {
    super(message);

    this.embedOptions = embedOptions;
  }
}

export interface EmbedOptions {
  fields?: EmbedField[];
}
