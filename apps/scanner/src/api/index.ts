import { mande } from 'mande';
import { Event } from '~/models/event';
import { ScheduledGame } from '~/models/scheduledGame';

const api = mande(`/.netlify/functions`);

export function getSchedule(params: { event: string; type: string }) {
  return api.get<ScheduledGame[]>('schedule', { query: params });
}

export function getEvents({ team, week }: { team?: number; week?: number }) {
  const params: Record<string, string | number> = {};

  if (team !== undefined) {
    params['team'] = team;
  }

  if (week) {
    params['week'] = week;
  }

  return api.get<Event[]>('events', { query: params });
}
