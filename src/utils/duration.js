import moment from 'moment';

import { concat } from './concat';

export function humanize(milliseconds) {
  const duration = moment.duration(milliseconds);

  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return concat(
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    seconds ? `${seconds}s` : null,
  );
}
