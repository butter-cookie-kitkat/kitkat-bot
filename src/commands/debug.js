export const kill = {
  name: 'kill',
  description: 'Kills the bot.',
  command: async () => {
    console.log('Killing the bot.');
    process.exit();
  },
};

export default [
  kill,
].map((command) => ({
  ...command,
  group: 'Debug',
  disabled: !!process.env.IS_LIVE,
}));
