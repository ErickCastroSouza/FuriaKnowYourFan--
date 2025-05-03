import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Streamer {
  id: number;
  username: string;
  title: string;
  thumbnail: string;
  viewers: number;
}

export default function LiveStreamerSection() {
  const { data: streamers, isLoading } = useQuery({
    queryKey: ["/api/streamers/live"],
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-teko text-2xl text-white">Ao vivo agora</h2>
            <Link href="/streamers">
              <a className="text-fury-gold text-sm font-medium hover:underline">VER TUDO</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-800 rounded-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-800" />
                <div className="p-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Placeholder streamers if API returns no data
  const placeholderStreamers: Streamer[] = [
    {
      id: 1,
      username: "FURIA_Player1",
      title: "Treinando para o próximo torneio!",
      thumbnail: "https://cdn.pixabay.com/photo/2020/05/11/15/38/programming-5158624_960_720.jpg",
      viewers: 1200,
    },
    {
      id: 2,
      username: "FURIA_Player2",
      title: "Jogando com o time",
      thumbnail: "https://cdn.pixabay.com/photo/2021/09/07/07/11/game-6603047_960_720.jpg",
      viewers: 1200,
    },
    {
      id: 3,
      username: "FURIA_Player3",
      title: "Stream com fãs - vem jogar!",
      thumbnail: "https://cdn.pixabay.com/photo/2022/10/30/16/08/streamers-7557669_960_720.jpg",
      viewers: 1200,
    },
  ];

  const displayedStreamers = streamers || placeholderStreamers;

  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-teko text-2xl text-white">Ao vivo agora</h2>
          <Link href="/streamers">
            <a className="text-fury-gold text-sm font-medium hover:underline">VER TUDO</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedStreamers.map((streamer) => (
            <div key={streamer.id} className="border border-gray-800 hover:border-fury-gold transition-colors duration-300 rounded-md overflow-hidden">
              <div className="relative">
                <img 
                  src={streamer.thumbnail} 
                  alt={streamer.username} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-4 py-1 rounded-sm live-indicator pl-6">
                  AO VIVO
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm truncate">{streamer.viewers.toLocaleString()} espectadores</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
