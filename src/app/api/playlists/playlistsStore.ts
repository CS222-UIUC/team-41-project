import { Playlist } from "./types";

// Define an initial track matching the SoundCloudTrack interface
const initialTrack = {
    id: 12345, // Use a number for the ID
    title: "Initial Track",
    permalink_url: "https://soundcloud.com/initial-track",
    artwork_url: "https://example.com/artwork.jpg", // Can be null if not available
    duration: 300000, // 5 minutes in milliseconds
    user: {
        username: "artist1",
        avatar_url: "https://example.com/avatar.jpg", // Can be null if not available
    },
    stream_url: "https://soundcloud.com/initial-track/stream",
};

// Initialize the playlists array with a playlist containing the initial track
export const playlists: Playlist[] = [
    {
        id: "54321",
        name: "Initial Playlist",
        userId: "user1",
        tracks: [initialTrack],
    },
];