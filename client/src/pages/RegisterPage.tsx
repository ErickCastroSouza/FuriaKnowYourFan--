import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Separator } from "@/components/ui/separator";
import { LoaderPinwheel } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/ui/logo";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      await register(data.username, data.password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à FURIA.",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Nome de usuário já existe ou ocorreu um erro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-4 border-fury-gold/30 bg-black">
          <CardHeader className="space-y-1 items-center">
            <Logo className="h-16 w-auto mb-2" />
            <CardTitle className="text-2xl text-white font-rajdhani">Crie sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Cadastre-se para acessar conteúdos exclusivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome de usuário</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-black border-gray-700 text-white" 
                          placeholder="Digite seu nome de usuário" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Senha</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-black border-gray-700 text-white" 
                          type="password" 
                          placeholder="Digite sua senha" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirmar senha</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-black border-gray-700 text-white" 
                          type="password" 
                          placeholder="Confirme sua senha" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full gold-gradient text-black font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <LoaderPinwheel className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-2 bg-gray-800" />
            <p className="text-sm text-gray-400 text-center mt-2">
              Já tem uma conta?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-fury-gold hover:underline cursor-pointer"
              >
                Entrar
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
