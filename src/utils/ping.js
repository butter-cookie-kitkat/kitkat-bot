import isReachable from 'is-reachable';

export async function ping(host) {
  const startTime = Date.now();

  const available = await isReachable(host);

  return {
    available,
    responseTime: available ? Date.now() - startTime : null,
  };
}
