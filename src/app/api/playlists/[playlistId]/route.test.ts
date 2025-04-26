import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GET, PUT, DELETE } from "./route";

// mock prisma
jest.mock('@/lib/db', () => ({
    playlist: {
        findUnique: jest.fn(),
    },
    song: {
        findUnique: jest.fn(),
    },
    playlistSong: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Playlist API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /playlist/:playlistId", () => {
        it("should return a playlist when valid playlistId is provided", async () => {
            const playlistId = "valid-id";
            const mockPlaylist = {
                id: playlistId,
                songs: [{ song: { id: "song-1", title: "Song One" } }],
            };

            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue(mockPlaylist);

            const response = await GET({} as NextRequest, {
                params: Promise.resolve({ playlistId }),
            });

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(mockPlaylist);
        });

        it("should return 400 when playlistId is missing", async () => {
            const response = await GET({} as NextRequest, { params: Promise.resolve({ playlistId: "" }) });
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Missing playlistId" });
        });

        it("should return 404 when playlist not found", async () => {
            const playlistId = "invalid-id";

            (prisma.song.findUnique as jest.Mock).mockResolvedValue({ id: "song-id" });
            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue(null);

            const response = await GET({} as NextRequest, {
                params: Promise.resolve({ playlistId }),
            });

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ error: "Playlist not found" });
        });
    });

    describe("PUT /playlist/:playlistId", () => {
        it("should add a song to the playlist", async () => {
            const playlistId = "playlist-id";
            const songId = "song-id";
            const mockSong = { id: songId, title: "New Song" };
            const mockPlaylist = { id: playlistId };
            const mockEntry = { playlistId, songId };

            (prisma.song.findUnique as jest.Mock).mockResolvedValue(mockSong);
            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue(mockPlaylist);
            (prisma.playlistSong.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.playlistSong.create as jest.Mock).mockResolvedValue(mockEntry);

            const request = {
                json: () => Promise.resolve({ songId }),
            } as NextRequest;

            const response = await PUT(request, { params: Promise.resolve({ playlistId }) });

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(mockEntry);
        });

        it("should return 400 when playlistId or songId is missing", async () => {
            const request = { json: () => Promise.resolve({}) } as NextRequest;
            const response = await PUT(request, { params: Promise.resolve({ playlistId: "" }) });

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Missing playlistId or songId" });
        });

        it("should return 404 when song is not found", async () => {
            const playlistId = "valid-id";
            const songId = "invalid-song-id";
            (prisma.song.findUnique as jest.Mock).mockResolvedValue(null);

            const request = {
                json: () => Promise.resolve({ songId }),
            } as NextRequest;

            const response = await PUT(request, { params: Promise.resolve({ playlistId }) });

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ error: "Song not found" });
        });

        it("should return 404 when playlist not found", async () => {
            const playlistId = "invalid-id";
            const songId = "song-id";
            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue(null);

            const request = {
                json: () => Promise.resolve({ songId }),
            } as NextRequest;

            const response = await PUT(request, { params: Promise.resolve({ playlistId }) });

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ error: "Playlist not found" });
        });

        it("should return 400 when song already exists in playlist", async () => {
            const playlistId = "playlist-id";
            const songId = "song-id";

            (prisma.song.findUnique as jest.Mock).mockResolvedValue({ id: songId });
            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue({ id: playlistId });
            (prisma.playlistSong.findUnique as jest.Mock).mockResolvedValue({ playlistId, songId });

            const request = {
                json: () => Promise.resolve({ songId }),
            } as NextRequest;

            const response = await PUT(request, { params: Promise.resolve({ playlistId }) });

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Song already exists in playlist" });
        });
    });

    describe("DELETE /playlist/:playlistId", () => {
        it("should delete a song from the playlist", async () => {
            const playlistId = "playlist-id";
            const songId = "song-id";

            (prisma.playlistSong.findUnique as jest.Mock).mockResolvedValue({ playlistId, songId });
            (prisma.playlistSong.delete as jest.Mock).mockResolvedValue({ success: true });

            const request = {
                json: () => Promise.resolve({ songId }),
            } as NextRequest;

            const response = await DELETE(request, { params: Promise.resolve({ playlistId }) });

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ success: true });
        });

        it("should return 400 when playlistId or songId is missing", async () => {
            const request = { json: () => Promise.resolve({}) } as NextRequest;
            const response = await DELETE(request, { params: Promise.resolve({ playlistId: "" }) });

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ error: "Missing playlistId or songId" });
        });

        it("should return 404 when song is not found in playlist", async () => {
            const playlistId = "playlist-id";
            const songId = "song-id";

            (prisma.playlistSong.findUnique as jest.Mock).mockResolvedValue(null);

            const request = {
                json: () => Promise.resolve({ songId }),
            } as NextRequest;

            const response = await DELETE(request, { params: Promise.resolve({ playlistId }) });

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ error: "Song not found in playlist" });
        });
    });
});
