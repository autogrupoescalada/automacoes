// import { signUpAction } from "@/app/actions";
//  import { FormMessage, type Message } from "@/components/form-message";
// import { SmtpMessage } from "../smtp-message";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Link from "next/link";


export default function SignUpPage() {

  return (
    <>
      <div className="container flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Criar Nova Conta</h1>
            <p className="text-muted-foreground">
              Para criar uma nova conta, entre em contato com o administrador do sistema.
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Já possui uma conta?{" "}
              <Link className="font-medium hover:underline" href="/entrar">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
