export interface SoundCloudTrack {
  id: string;
  title: string;
  permalinkUrl: string;
  duration: number;
  access?: "playable" | "preview" | "blocked";
}

export interface SearchResponse {
  collection: SoundCloudTrack[];
}
