export interface SoundCloudTrack {
  id: string;
  title: string;
  permalink_url: string;
  duration: number;
  access?: "playable" | "preview" | "blocked";
}

export interface SearchResponse {
  collection: SoundCloudTrack[];
}
