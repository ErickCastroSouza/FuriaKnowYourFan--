import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderPinwheel, Users, ShoppingBag, Activity, User, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#FFD700', '#FFC107', '#F8E9A1', '#E6B35A', '#DAA520'];

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("week");

  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ["/api/admin/users/stats", timeframe],
  });
  
  const { data: usersByInterest, isLoading: isLoadingInterests } = useQuery({
    queryKey: ["/api/admin/users/interests", timeframe],
  });
  
  const { data: usersByLocation, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["/api/admin/users/locations", timeframe],
  });
  
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Placeholder data for testing
  const placeholderUserStats = {
    totalUsers: 1537,
    newUsers: 48,
    activeUsers: 632,
    conversionRate: 41.8
  };

  const placeholderUsersByInterest = [
    { name: "CS:GO", value: 45 },
    { name: "Valorant", value: 28 },
    { name: "League of Legends", value: 15 },
    { name: "Apex Legends", value: 8 },
    { name: "Free Fire", value: 4 }
  ];

  const placeholderUsersByLocation = [
    { name: "São Paulo", value: 420 },
    { name: "Rio de Janeiro", value: 240 },
    { name: "Minas Gerais", value: 186 },
    { name: "Rio Grande do Sul", value: 98 },
    { name: "Bahia", value: 62 }
  ];

  const placeholderUsers = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    registeredAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    interests: placeholderUsersByInterest.slice(0, Math.floor(Math.random() * 4) + 1).map(i => i.name)
  }));

  const displayedUserStats = userStats || placeholderUserStats;
  const displayedUsersByInterest = usersByInterest || placeholderUsersByInterest;
  const displayedUsersByLocation = usersByLocation || placeholderUsersByLocation;
  const displayedUsers = users || placeholderUsers;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const isLoading = isLoadingUserStats || isLoadingInterests || isLoadingLocations || isLoadingUsers;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoaderPinwheel className="h-10 w-10 animate-spin text-fury-gold" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white font-teko">Admin Dashboard</h1>
          <div className="flex items-center">
            <p className="text-gray-400 mr-2">Período:</p>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32 bg-black border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700 text-white">
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-fury-gold/30 bg-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-fury-gold mr-2" />
                <p className="text-2xl font-bold text-white">{displayedUserStats.totalUsers}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-fury-gold/30 bg-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Novos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-6 w-6 text-fury-gold mr-2" />
                <p className="text-2xl font-bold text-white">{displayedUserStats.newUsers}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-fury-gold/30 bg-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-fury-gold mr-2" />
                <p className="text-2xl font-bold text-white">{displayedUserStats.activeUsers}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-fury-gold/30 bg-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-fury-gold mr-2" />
                <p className="text-2xl font-bold text-white">{displayedUserStats.conversionRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-fury-gold/30 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Distribuição de Interesses</CardTitle>
              <CardDescription className="text-gray-400">
                Preferências dos usuários por jogo
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayedUsersByInterest}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {displayedUsersByInterest.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-fury-gold/30 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Distribuição Geográfica</CardTitle>
              <CardDescription className="text-gray-400">
                Localização dos usuários por estado
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayedUsersByLocation}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                  <YAxis tick={{ fill: '#ccc' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#FFD700' }} 
                    labelStyle={{ color: '#FFD700' }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Usuários" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-gray-800 text-white">
            <TabsTrigger value="users" className="data-[state=active]:bg-fury-gold data-[state=active]:text-black">
              Lista de Usuários
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-fury-gold data-[state=active]:text-black">
              Atividade Recente
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="border-fury-gold/30 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Usuários Registrados</CardTitle>
                <CardDescription className="text-gray-400">
                  Lista de todos os usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">ID</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Usuário</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Email</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Registro</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Interesses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-900">
                          <td className="px-4 py-3 text-white">{user.id}</td>
                          <td className="px-4 py-3 text-white">{user.username}</td>
                          <td className="px-4 py-3 text-white">{user.email}</td>
                          <td className="px-4 py-3 text-white">{formatDate(user.registeredAt)}</td>
                          <td className="px-4 py-3 text-white">
                            <div className="flex flex-wrap gap-1">
                              {user.interests.map((interest, index) => (
                                <span key={index} className="bg-gray-800 text-fury-gold text-xs px-2 py-1 rounded">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="border-fury-gold/30 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Atividade Recente</CardTitle>
                <CardDescription className="text-gray-400">
                  Últimos acessos e ações dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Usuário</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Ação</th>
                        <th className="px-4 py-2 text-left text-gray-400 font-medium">Data/Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-900">
                          <td className="px-4 py-3 text-white">{user.username}</td>
                          <td className="px-4 py-3 text-white">Login</td>
                          <td className="px-4 py-3 text-white">{formatDateTime(user.lastActive)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
