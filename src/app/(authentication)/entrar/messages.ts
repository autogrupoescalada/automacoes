export const loginMessages = {
    "Invalid login credentials": "Credenciais inválidas",
    "Password reset email sent": "Email de redefinição de senha enviado",
    "Sua licença está inativa": "Sua licença está inativa",
    // Adicione novas mensagens aqui facilmente
  } as const;
  
  export type LoginMessageKey = keyof typeof loginMessages;
  
  export function getLoginMessage(message: string): string {
    return (
      (loginMessages as Record<string, string>)[message] ??
      "Erro ao acessar. Tente novamente."
    );
  }
  