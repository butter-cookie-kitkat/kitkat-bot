import fs from 'fs';
import pkg from '../package.json';

pkg.sha = process.env.SOURCE_VERSION;

fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
