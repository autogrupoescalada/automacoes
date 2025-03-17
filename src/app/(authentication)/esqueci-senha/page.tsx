import { forgotPasswordAction } from "@/app/actions";
// import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
// import { SmtpMessage } from "../smtp-message";


export default function ForgotPassword() {
  
  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Redefinir Senha</h1>
          <p className="text-sm text-secondary-foreground">
            Já tem uma conta?{" "}
            <Link className="text-primary underline" href="/entrar">
              Entrar
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="voce@exemplo.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Redefinir Senha
          </SubmitButton>
        </div>
      </form>
      {/* <SmtpMessage /> */}
    </>
  );
}
