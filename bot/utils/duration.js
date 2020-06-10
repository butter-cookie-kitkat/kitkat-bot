import moment from 'moment';

import { Concat } from './concat';

export class Duration {
  static humanize(milliseconds) {
    const duration = moment.duration(milliseconds);

    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return Concat.join(
      hours ? `${hours}h` : null,
      minutes ? `${minutes}m` : null,
      seconds ? `${seconds}s` : null,
    );
  }
}
