import { useAuth } from "@/lib/auth";
import Logo from "@/components/ui/logo";
import { useQuery } from "@tanstack/react-query";

interface Streamer {
  id: number;
  username: string;
  title: string;
  thumbnail: string;
  viewers: number;
}

export default function HeroBanner() {
  const { user } = useAuth();
  const { data: streamers, isLoading } = useQuery<Streamer[]>({
    queryKey: ["/api/streamers/live"],
    staleTime: 60000, // 1 minute
  });

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
    <section className="relative mt-0 mb-8 overflow-hidden border-b border-fury-gold" style={{ backgroundColor: "#000000" }}>
      {/* Hero banner with logo */}
      
      {/* Live streamers section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-teko text-white">Ao vivo agora</h2>
          <button className="bg-transparent text-fury-gold hover:underline font-medium">
            VER TUDO
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border border-gray-800 rounded-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-800" />
                <div className="p-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : (
            displayedStreamers.map((streamer) => (
              <div key={streamer.id} className="relative group cursor-pointer">
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  AO VIVO
                </div>
                <img 
                  src={streamer.thumbnail} 
                  alt={streamer.username} 
                  className="w-full h-48 object-cover rounded-sm" 
                />
                <div className="absolute bottom-2 left-2 text-white text-xs">
                  {streamer.viewers.toLocaleString()} espectadores
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
