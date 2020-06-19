import * as XIV from './xiv';

import { BatchJob } from './types';

export const batch_jobs: {
  [key: string]: BatchJob;
} = {
  ...XIV,
};
