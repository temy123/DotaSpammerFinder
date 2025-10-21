import { setActivePinia, createPinia } from 'pinia';
import { useSearchStore } from './search';
import { describe, it, expect, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('https://api.opendota.com/api/players/:playerId', ({ params }) => {
    const { playerId } = params;
    if (playerId === '12345') {
      return HttpResponse.json({
        profile: {
          account_id: 12345,
          personaname: 'Test Player',
        },
      });
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('fetches player data successfully', async () => {
    const store = useSearchStore();
    await store.fetchPlayerData('12345');
    expect(store.playerData).not.toBeNull();
    expect(store.playerData.profile.personaname).toBe('Test Player');
    expect(store.error).toBeNull();
  });

  it('handles errors when fetching player data', async () => {
    const store = useSearchStore();
    await store.fetchPlayerData('invalid-id');
    expect(store.playerData).toBeNull();
    expect(store.error).not.toBeNull();
  });
});