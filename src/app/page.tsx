import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, PiggyBank, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Budget<span className="text-primary">Pro</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          Track your income, manage budgets, and achieve your savings goals with powerful analytics.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mb-10">
          <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
            <TrendingUp className="h-6 w-6 text-emerald-500 mb-2" />
            <span className="text-sm font-medium">Track Income</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
            <PiggyBank className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium">Budgets</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
            <BarChart3 className="h-6 w-6 text-amber-500 mb-2" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">
            <Link href="/auth/login">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/auth/register">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
