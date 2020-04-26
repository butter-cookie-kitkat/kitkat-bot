export function available(status) {
  return status.available ? '_Online_ :green_circle:' : '_Offline_ :red_circle:';
}

export function responseTime(status) {
  if (status.responseTime) {
    return `_${status.responseTime}ms_ ${responseTimeEmoji(status)}`;
  }

  return '_N/A_';
}

export function responseTimeEmoji(status) {
  if (status.responseTime < 3000) {
    return ':sunny:';
  } else if (status.responseTime < 10000) {
    return ':cloud_rain:';
  } else if (status.responseTime <= 60000) {
    return ':thunder_cloud_rain:';
  }

  return ':fire:';
}
