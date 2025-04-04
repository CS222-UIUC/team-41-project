export interface UpdateSongData {
  status: "approved" | "denied";
  soundcloudId?: string;
  permalinkUrl?: string;
  duration?: number;
}

export interface SoundCloudData {
  id: string;
  title: string;
  permalink_url: string;
  duration: number;
}
