import { mande } from 'mande';

const api = mande(`/.netlify/functions`);

// export function getSchedule(params: { event: string; type: string }) {
//   return api.get<ScheduledGame[]>('schedule', { query: params });
// }

export function getNextGame(params: { current: string }) {
  return api.get<string>('nextGame', { query: params });
}
