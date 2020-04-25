export const version = {
  description: 'Outputs the Kitkat Bot version information.',
  command: async () => {
    console.log(JSON.stringify(process.env, null, ' '));
  }
};
