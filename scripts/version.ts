import fs from 'fs';
import pkg from '../package.json';
import { version } from '../bot/utils/version';

fs.writeFileSync('./package.json', JSON.stringify({
  ...pkg,
  sha: version.sha(process.env.SOURCE_VERSION),
}, null, 2));
