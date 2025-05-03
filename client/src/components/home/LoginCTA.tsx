import { Link } from "wouter";
import { useAuth } from "@/lib/auth";

export default function LoginCTA() {
  const { user } = useAuth();

  // Don't show login CTA for authenticated users
  if (user) {
    return null;
  }

  return (
    <section className="py-12 border-b border-fury-gold">
      <div className="container mx-auto px-4 text-center">
        <p className="text-white text-xl mb-4 font-rajdhani">
          Faça <span className="text-fury-gold font-semibold">login</span> e acesse conteúdos <span className="text-fury-gold font-semibold">exclusivos</span>
        </p>
        <Link href="/login">
          <span className="gold-gradient px-8 py-3 rounded-sm inline-block mt-4 font-rajdhani text-black font-semibold hover:shadow-lg transition-shadow cursor-pointer">
            ENTRAR AGORA
          </span>
        </Link>
      </div>
    </section>
  );
}
