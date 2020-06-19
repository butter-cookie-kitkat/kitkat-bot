import moment from 'moment';

import { concat } from './concat';

class Duration {
  humanize(milliseconds: number): string {
    const duration = moment.duration(milliseconds);

    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return concat.join(
      hours ? `${hours}h` : null,
      minutes ? `${minutes}m` : null,
      seconds ? `${seconds}s` : null,
    );
  }
}

export const duration = new Duration();
