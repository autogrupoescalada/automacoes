import { signInAction } from "@/app/actions";
// import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
// import { getLoginMessage } from "./messages";

export default function Login() {

  return (
    <div className="container flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Entrar</h1>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email" 
                type="email"
                placeholder="voce@exemplo.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  className="text-sm text-muted-foreground hover:underline"
                  href="/esqueci-senha"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Sua senha"
                required
              />
            </div>

            <SubmitButton 
              className="w-full" 
              pendingText="Entrando..." 
              formAction={signInAction}
            >
              Entrar
            </SubmitButton>
          </div>
          
          
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link className="font-medium hover:underline" href="/nova-conta">
              Criar conta
            </Link>
          </div>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Ao continuar, você concorda com nossos <a href="#" className="hover:underline">Termos de Serviço</a>{" "}
          e <a href="#" className="hover:underline">Política de Privacidade</a>.
        </div>
      </div>
    </div>
  );
}
