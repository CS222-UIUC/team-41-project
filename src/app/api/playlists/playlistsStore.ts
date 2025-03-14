import { Playlist } from "./types";

const initialTrack = {
  id: 12345,
  title: "Initial Track",
  permalink_url: "https://soundcloud.com/initial-track",
  artwork_url: "https://example.com/artwork.jpg",
  duration: 300000,
  user: {
    username: "artist1",
    avatar_url: "https://example.com/avatar.jpg",
  },
  stream_url: "https://soundcloud.com/initial-track/stream",
};

export const playlists: Playlist[] = [
  {
    id: "54321",
    name: "Initial Playlist",
    userId: "user1",
    tracks: [initialTrack],
  },
];
