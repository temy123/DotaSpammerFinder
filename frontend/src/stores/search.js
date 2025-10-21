import { defineStore } from 'pinia';
import axios from 'axios';

export const useSearchStore = defineStore('search', {
  state: () => ({
    isLoading: false,
    playerData: null,
    error: null,
  }),
  actions: {
    async fetchPlayerData(playerId) {
      this.isLoading = true;
      this.error = null;
      this.playerData = null;

      try {
        const response = await axios.get(`https://api.opendota.com/api/players/${playerId}`);
        const wlResponse = await axios.get(`https://api.opendota.com/api/players/${playerId}/wl`);

        this.playerData = {
          ...response.data,
          win: wlResponse.data.win,
          lose: wlResponse.data.lose,
        };
      } catch (error) {
        console.error(error);
        this.error = 'Failed to fetch player data. Please check the player ID and try again.';
      } finally {
        this.isLoading = false;
      }
    },
  },
});