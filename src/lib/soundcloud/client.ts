import { SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_API_URL } from "@/config/constants";

class SoundCloudClient {
  private clientId: string;
  private baseUrl: string;

  constructor() {
    this.clientId = SOUNDCLOUD_CLIENT_ID;
    this.baseUrl = SOUNDCLOUD_API_URL;
  }

  async search(query: string) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      q: query,
    });

    const response = await fetch(`${this.baseUrl}/tracks?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch from SoundCloud API");
    }

    return response.json();
  }

  async getTrack(trackId: string) {
    const params = new URLSearchParams({
      client_id: this.clientId,
    });

    const response = await fetch(`${this.baseUrl}/tracks/${trackId}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch track");
    }

    return response.json();
  }
}

export const soundCloudClient = new SoundCloudClient();
