export function available(available) {
  return available ? '_Online_ :green_circle:' : '_Offline_ :red_circle:';
}

export function responseTime(responseTime) {
  if (responseTime) {
    return `_${responseTime}ms_ ${responseTimeEmoji(responseTime)}`;
  }

  return '_N/A_';
}

export function responseTimeEmoji(responseTime) {
  if (responseTime < 3000) {
    return ':sunny:';
  } else if (responseTime < 10000) {
    return ':cloud_rain:';
  } else if (responseTime <= 60000) {
    return ':thunder_cloud_rain:';
  }

  return ':fire:';
}
