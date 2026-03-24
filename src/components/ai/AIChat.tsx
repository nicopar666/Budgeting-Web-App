"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UserFinancialContext {
  incomeThisMonth: number;
  expensesThisMonth: number;
  balance: number;
  savingsRate: number;
  topCategories: { category: string; amount: number }[];
  budgetsOver: string[];
  savingsGoals: { name: string; progress: number }[];
}

const financialKnowledge: Record<string, { keywords: string[]; response: string }> = {
  budget: {
    keywords: ["budget", "budgeting", "plan", "planning"],
    response: "To create a good budget, try the 50/30/20 rule: 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. Start by tracking all expenses for a month to understand your spending habits."
  },
  savings: {
    keywords: ["save", "saving", "save money", "accumulate"],
    response: "Effective savings strategies: 1) Pay yourself first - automate transfers to savings 2) Set specific, measurable goals 3) Use the 24-hour rule for impulse purchases 4) Cut unused subscriptions 5) Try no-spend challenges 6) Cook at home more often"
  },
  debt: {
    keywords: ["debt", "loan", "credit", "borrow", "pay off"],
    response: "Debt payoff strategies: 1) Snowball method - pay smallest debt first for motivation 2) Avalanche method - pay highest interest first to save money 3) Pay more than minimums 4) Consider balance transfer for lower rates 5) Avoid new debt while paying off old"
  },
  investing: {
    keywords: ["invest", "investment", "stock", " ETF", "fund", "return"],
    response: "Before investing: Build 3-6 month emergency fund first. Then consider: Index funds (diversified, low fees), ETFs, bonds for stability. Start early - compound interest is powerful. Consider your risk tolerance and investment timeline."
  },
  expense: {
    keywords: ["expense", "spend", "spending", "cut cost", "reduce"],
    response: "To reduce expenses: Track every spending for a week. Identify patterns. Cancel unused subscriptions. Use cashback apps. Buy generic brands. Negotiate bills (internet, insurance). Meal prep. Use public transport when possible."
  },
  income: {
    keywords: ["income", "earn", "salary", "make money", "side hustle"],
    response: "Ways to increase income: Ask for a raise (prepare achievements). Develop market skills. Start a side hustle. Freelance. Invest in certifications. Passive income: dividends, rental, digital products. Multiple income streams reduce risk."
  },
  emergency: {
    keywords: ["emergency", "fund", "rainy day", "safety net"],
    response: "An emergency fund should cover 3-6 months of expenses. Start small - even $1,000 helps with small emergencies. Keep it in a high-yield savings account, separate from daily spending. Build it gradually with automatic deposits."
  },
  retirement: {
    keywords: ["retire", "retirement", "pension", "401k", " ira"],
    response: "Retirement planning: Start as early as possible. Max out employer 401(k) match. Consider Roth IRA for tax-free growth. Diversify investments. Aim for 15-20% of income. The power of compound interest means starting early matters more than amount."
  },
  credit: {
    keywords: ["credit score", "credit report", "fico", "credit rating"],
    response: "Boost your credit score: Pay bills on time (35% of score). Keep credit utilization below 30%. Don't close old accounts. Don't apply for too much credit at once. Check report annually for errors. Become an authorized user to build history."
  },
  tax: {
    keywords: ["tax", "taxes", "deduction", "refund", "filing"],
    response: "Tax tips: Contribute to retirement accounts (tax-deductible). Track business expenses if self-employed. Consider HSA for health costs. Donations to charity. Home office if working remotely. Keep receipts. Consider consulting a tax professional."
  },
  overspending: {
    keywords: ["overspend", "too much", "control", "discipline", "addicted"],
    response: "Combat overspending: Delete shopping apps. Use cash for discretionary purchases. Wait 24-48 hours before non-essential buys. Find free alternatives for entertainment. Unsubscribe from store emails. Identify triggers. Practice mindful spending."
  },
  categories: {
    keywords: ["category", "categories", "track", "group"],
    response: "Track spending by category to find savings opportunities. Common categories: Housing, Transport, Food, Utilities, Insurance, Healthcare, Entertainment, Personal, Education, Savings. Review monthly to see where money goes."
  }
};

function analyzeUserContext(context: UserFinancialContext | null | undefined): string {
  if (!context) return "";
  
  const responses: string[] = [];
  
  if (context.balance < 0) {
    responses.push("⚠️ Your expenses exceed your income this month. Consider reviewing your spending to get back on track.");
  } else if (context.savingsRate < 10) {
    responses.push("💡 Your savings rate is below 20%. Try to increase it by cutting non-essential expenses.");
  } else if (context.savingsRate >= 20) {
    responses.push("🎉 Great job! You're saving 20% or more of your income.");
  }
  
  if (context.budgetsOver.length > 0) {
    responses.push(`⚠️ You've exceeded your budget for: ${context.budgetsOver.join(", ")}. Consider reducing spending in these areas.`);
  }
  
  if (context.topCategories.length > 0) {
    const top = context.topCategories[0];
    responses.push(`📊 Your biggest expense this month is ${top.category} (${formatCurrency(top.amount)}). Is this expected?`);
  }
  
  if (context.savingsGoals.length > 0) {
    const goal = context.savingsGoals.find(g => g.progress >= 75 && g.progress < 100);
    if (goal) {
      responses.push(`🎯 You're close to reaching your "${goal.name}" goal! Keep going!`);
    }
  }
  
  return responses.join("\n\n");
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

function findBestMatch(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  for (const data of Object.values(financialKnowledge)) {
    for (const keyword of data.keywords) {
      if (lowerQuery.includes(keyword)) {
        return data.response;
      }
    }
  }
  
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "how are you", "what can you do"];
  if (greetings.some(g => lowerQuery.includes(g))) {
    return "Hello! I'm your AI financial assistant. I can help with budgeting, saving, debt, investing, and more. I can also analyze your spending patterns if you share your financial data. What would you like to know?";
  }
  
  const thanks = ["thank", "thanks", "appreciate"];
  if (thanks.some(t => lowerQuery.includes(t))) {
    return "You're welcome! Feel free to ask if you have more financial questions. I'm here to help!";
  }
  
  return "I specialize in financial advice. Try asking about budgeting, saving money, paying off debt, investing, or managing expenses. I can also provide personalized insights if you share your financial situation!";
}

function getAIResponse(userMessage: string, userContext?: UserFinancialContext | null): string {
  const baseResponse = findBestMatch(userMessage);
  const contextInsights = analyzeUserContext(userContext ?? null);
  
  if (contextInsights) {
    return baseResponse + "\n\n" + contextInsights;
  }
  
  return baseResponse;
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI Financial Assistant. I can help you with:\n\n• 💰 Budgeting strategies\n• 💳 Debt repayment tips\n• 📈 Investment basics\n• 🎯 Savings goals\n• 📊 Spending analysis\n• And much more!\n\nAsk me anything about personal finance, or tell me about your income/expenses for personalized advice!",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const userContext: UserFinancialContext = {
        incomeThisMonth: 0,
        expensesThisMonth: 0,
        balance: 0,
        savingsRate: 0,
        topCategories: [],
        budgetsOver: [],
        savingsGoals: []
      };
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(currentInput, userContext),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {open && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] flex flex-col shadow-xl border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">AI Financial Assistant</h3>
                <p className="text-xs text-muted-foreground">Smart financial guidance</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about finances..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
