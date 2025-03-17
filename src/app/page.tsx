import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-max flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
          Grupo Escalada
        </h1>
        <p className="text-xl font-title">Automações</p>
        <Button asChild size="lg">
          <Link href="/entrar">Entrar</Link>
        </Button>
      </div>
    </div>
  );
}
