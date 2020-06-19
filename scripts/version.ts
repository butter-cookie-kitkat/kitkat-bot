import fs from 'fs';
import pkg from '../package.json';

fs.writeFileSync('./package.json', JSON.stringify({
  ...pkg,
  sha: process.env.SOURCE_VERSION || 'unknown',
}, null, 2));
