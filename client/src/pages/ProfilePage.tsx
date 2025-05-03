import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderPinwheel } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  fullName: z.string().min(1, { message: "Nome completo é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().min(11, { message: "CPF deve ter 11 dígitos" }).max(14),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
  zipCode: z.string().min(1, { message: "CEP é obrigatório" }),
  phoneNumber: z.string().min(1, { message: "Telefone é obrigatório" }),
  gameInterests: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

const documentsSchema = z.object({
  idDocument: z.any().optional(),
});

const preferencesSchema = z.object({
  preferredGame: z.string().optional(),
  favoriteTeam: z.string().optional(),
  notifications: z.boolean().default(true),
  newsletter: z.boolean().default(true),
});

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
      phoneNumber: user?.phoneNumber || "",
      gameInterests: user?.gameInterests || [],
      bio: user?.bio || "",
    },
  });

  const documentsForm = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {},
  });

  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredGame: user?.preferredGame || "",
      favoriteTeam: user?.favoriteTeam || "",
      notifications: user?.notifications !== false,
      newsletter: user?.newsletter !== false,
    },
  });

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDocumentsSubmit = async (data: z.infer<typeof documentsSchema>) => {
    toast({
      title: "Documento enviado",
      description: "O documento será validado em breve.",
    });
  };

  const onPreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast({
        title: "Preferências atualizadas com sucesso!",
        description: "Suas preferências foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar preferências",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const gameOptions = [
    { id: "csgo", label: "CS:GO" },
    { id: "valorant", label: "Valorant" },
    { id: "lol", label: "League of Legends" },
    { id: "apex", label: "Apex Legends" },
    { id: "freefire", label: "Free Fire" },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 font-teko">Perfil do Usuário</h1>
          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="bg-gray-800 text-white">
              <TabsTrigger value="profile" className="data-[state=active]:bg-fury-gold data-[state=active]:text-black">
                Informações Pessoais
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-fury-gold data-[state=active]:text-black">
                Documentos
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-fury-gold data-[state=active]:text-black">
                Preferências
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="border-fury-gold/30 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                  <CardDescription className="text-gray-400">
                    Atualize suas informações de contato e endereço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Nome Completo</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="Seu nome completo" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="seu@email.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">CPF</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="000.000.000-00" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Telefone</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="(00) 00000-0000" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Endereço</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="Rua, número, complemento" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Cidade</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="Sua cidade" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Estado</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="Seu estado" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">CEP</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="00000-000" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <FormField
                          control={profileForm.control}
                          name="gameInterests"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-white">Interesses em jogos</FormLabel>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {gameOptions.map((game) => (
                                  <FormField
                                    key={game.id}
                                    control={profileForm.control}
                                    name="gameInterests"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={game.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(game.id)}
                                              onCheckedChange={(checked) => {
                                                const values = field.value || [];
                                                return checked
                                                  ? field.onChange([...values, game.id])
                                                  : field.onChange(
                                                      values.filter((value) => value !== game.id)
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-white font-normal cursor-pointer">
                                            {game.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Biografia</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="bg-black border-gray-700 text-white min-h-[100px]" 
                                placeholder="Conte um pouco sobre você..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="gold-gradient text-black font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? <LoaderPinwheel className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isLoading ? "Salvando..." : "Salvar Informações"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card className="border-fury-gold/30 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">Envio de Documentos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Envie seus documentos para validação de identidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...documentsForm}>
                    <form onSubmit={documentsForm.handleSubmit(onDocumentsSubmit)} className="space-y-4">
                      <FormField
                        control={documentsForm.control}
                        name="idDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Documento de Identidade (RG ou CNH)</FormLabel>
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-black hover:bg-gray-900">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400">
                                      <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG ou PDF (Max. 5MB)</p>
                                  </div>
                                  <input 
                                    id="dropzone-file" 
                                    type="file" 
                                    className="hidden"
                                    onChange={(e) => field.onChange(e.target.files?.[0] || null)} 
                                  />
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="gold-gradient text-black font-semibold"
                      >
                        Enviar Documento
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card className="border-fury-gold/30 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">Preferências</CardTitle>
                  <CardDescription className="text-gray-400">
                    Personalize sua experiência na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...preferencesForm}>
                    <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
                      <FormField
                        control={preferencesForm.control}
                        name="preferredGame"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Jogo Preferido</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-black border-gray-700 text-white">
                                  <SelectValue placeholder="Selecione seu jogo preferido" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black border-gray-700 text-white">
                                <SelectItem value="csgo">CS:GO</SelectItem>
                                <SelectItem value="valorant">Valorant</SelectItem>
                                <SelectItem value="lol">League of Legends</SelectItem>
                                <SelectItem value="apex">Apex Legends</SelectItem>
                                <SelectItem value="freefire">Free Fire</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="favoriteTeam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Time Favorito</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-black border-gray-700 text-white">
                                  <SelectValue placeholder="Selecione seu time favorito" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black border-gray-700 text-white">
                                <SelectItem value="csgo">FURIA CS:GO</SelectItem>
                                <SelectItem value="valorant">FURIA Valorant</SelectItem>
                                <SelectItem value="lol">FURIA LoL</SelectItem>
                                <SelectItem value="apex">FURIA Apex</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <FormField
                          control={preferencesForm.control}
                          name="notifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-white">
                                  Notificações
                                </FormLabel>
                                <p className="text-sm text-gray-400">
                                  Receber notificações sobre novos eventos e conteúdos
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="newsletter"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-white">
                                  Newsletter
                                </FormLabel>
                                <p className="text-sm text-gray-400">
                                  Receber e-mails com notícias e ofertas exclusivas
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="gold-gradient text-black font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? <LoaderPinwheel className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isLoading ? "Salvando..." : "Salvar Preferências"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
