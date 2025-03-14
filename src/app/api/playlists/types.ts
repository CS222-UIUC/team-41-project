import { SoundCloudTrack } from "../soundcloud/types";

export interface Playlist {
    id: string;
    name: string;
    userId: string;
    tracks: SoundCloudTrack[];
}
