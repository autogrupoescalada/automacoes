import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default async function ProtectedPage() {
  // Define the cards for different sections
  const cards = [
    {
      title: "Histórico de Chats",
      description: "Visualize e gerencie históricos de conversas",
      icon: <MessageSquare className="h-7 w-7 text-primary" />,
      href: "/area/chats",
    }
  ];

  return (
    <>
      <div className="flex flex-col gap-2 min-w-full min-h-full px-10 items-center">
        <h2 className="text-3xl font-semibold font-title">Interfaces de Automação</h2>
        <p className="text-muted-foreground text-xs">
          Bem-vindo à área administrativa. Selecione uma das opções abaixo para visualizar as interfaces de automação.
        </p>
        <div className="w-full max-w-72 border-t my-8" />

        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="block group max-w-72">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {card.icon}
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground pt-0">
                <span className="group-hover:text-primary group-hover:underline transition-colors">
                  Acessar →
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
