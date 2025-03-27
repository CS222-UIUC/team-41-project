export interface SoundCloudTrack {
  id: number;
  title: string;
  permalink_url: string;
  artwork_url: string | null;
  duration: number;
  user: {
    username: string;
    avatar_url: string | null;
  };
  stream_url: string;
}

export interface SearchResponse {
  collection: SoundCloudTrack[];
}
