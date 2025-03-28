export interface SoundCloudTrack {
  id: number;
  title: string;
  permalink_url: string;
  artwork_url: string | null;
  duration: number;
  stream_url: string;
}

export interface SearchResponse {
  collection: SoundCloudTrack[];
}
