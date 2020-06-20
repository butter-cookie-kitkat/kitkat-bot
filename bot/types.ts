import { EmbedOptions } from "./utils/embeds";

export class KitkatBotCommandError extends Error {
  public embedOptions: EmbedOptions;

  constructor(embedOptions: (string|EmbedOptions)) {
    if (typeof(embedOptions) === 'string') {
      embedOptions = {
        description: embedOptions,
      };
    }

    super(embedOptions.description);

    this.embedOptions = embedOptions;
  }
}
