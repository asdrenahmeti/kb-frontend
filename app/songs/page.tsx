"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Music2, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Song {
  id: string;
  artistName: string;
  songName: string;
  duration?: number;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: songs = [] } = useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/songs`)
        .then((res) => res.data),
  });

  const formatDuration = (duration?: number) => {
    if (!duration) return "-";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const filteredSongs = songs.filter((song) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      song.songName.toLowerCase().includes(searchTerm) ||
      song.artistName.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="container py-10 mt-16">
      <h1 className="text-2xl font-medium mb-6">Songs Library</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search songs or artists..."
          className="pl-10 max-w-[400px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredSongs.length === 0 ? (
        <div className="text-center py-10">
          <Music2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? "No songs found" : "No songs"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms"
              : "No songs have been added to the library yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Music2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {song.songName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {song.artistName}
                      </p>
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
