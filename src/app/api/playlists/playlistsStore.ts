import { Playlist } from "@prisma/client";

export const playlists: Playlist[] = [
  {
    id: "1",
    name: "Summer Vibes",
    createdBy: "user1",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "2",
    name: "Workout Mix",
    createdBy: "user1",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "3",
    name: "Chill Lofi",
    createdBy: "user2",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Party Hits",
    createdBy: "user3",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "5",
    name: "Study Focus",
    createdBy: "user2",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
  },
];
