import { DiscordBot } from "@butter-cookie-kitkat/discord-core";

export type CommandRegistrator = (bot: DiscordBot) => void;
export type CommandGroups = {
  [key: string]: CommandRegistrator;
};
