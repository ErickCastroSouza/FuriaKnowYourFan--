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

const loginSchema = z.object({
  username: z.string().min(1, { message: "Nome de usuário é obrigatório" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      await login(data.username, data.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à FURIA.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
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
            <CardTitle className="text-2xl text-white font-rajdhani">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com sua conta para acessar conteúdos exclusivos
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
                <Button 
                  type="submit" 
                  className="w-full gold-gradient text-black font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <LoaderPinwheel className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-2 bg-gray-800" />
            <p className="text-sm text-gray-400 text-center mt-2">
              Não tem uma conta?{" "}
              <a
                onClick={() => navigate("/register")}
                className="text-fury-gold hover:underline cursor-pointer"
              >
                Cadastre-se
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
