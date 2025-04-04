"use client";

import { useState } from "react";
import Upload from "@/components/admin/Upload";
import SongReview from "@/components/admin/SongReview";
import SongLibrary from "@/components/admin/SongLibrary";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "review" | "library">("upload");
  const [uploadType, setUploadType] = useState<"playlist" | "track">("playlist");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "review" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Review Songs
        </button>
        <button
          onClick={() => setActiveTab("library")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "library" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Library
        </button>
      </div>

      {activeTab === "upload" ? (
        <div className="space-y-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadType("playlist")}
              className={`px-4 py-2 rounded cursor-pointer ${
                uploadType === "playlist" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Upload Playlist
            </button>
            <button
              onClick={() => setUploadType("track")}
              className={`px-4 py-2 rounded cursor-pointer ${
                uploadType === "track" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Upload Track
            </button>
          </div>
          <Upload type={uploadType} service="spotify" />
        </div>
      ) : activeTab === "review" ? (
        <SongReview />
      ) : (
        <SongLibrary />
      )}
    </div>
  );
}
