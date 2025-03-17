import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@utils/supabase/server";
import { User } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Por favor atualize o arquivo .env.local com a chave anônima e url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/nova-conta">Criar conta</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User size={16} />
        {user.email}
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sair
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/entrar">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/nova-conta">Criar conta</Link>
      </Button>
    </div>
  );
}
