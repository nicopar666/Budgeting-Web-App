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

const financialAdvice: Record<string, string> = {
  "budget": "To create a good budget, follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Track your expenses for a month first to understand your spending habits.",
  "save": "Here are some tips to save money: 1) Set specific savings goals 2) Automate your savings 3) Cut unnecessary subscriptions 4) Use the 24-hour rule for impulse purchases 5) Meal prep instead of eating out.",
  "debt": "To pay off debt faster: 1) Pay more than minimum payments 2) Use the debt snowball method (smallest first) or avalanche method (highest interest first) 3) Consider consolidating debt 4) Avoid taking on new debt.",
  "invest": "Before investing, build an emergency fund of 3-6 months expenses. Then consider low-cost index funds, diversified ETFs, or consult a financial advisor for personalized advice based on your risk tolerance.",
  "expense": "To reduce expenses: 1) Track all spending 2) Identify areas to cut 3) Use coupons and cashback apps 4) Cancel unused subscriptions 5) Buy generic brands 6) Negotiate bills like insurance and internet.",
  "income": "To increase income: 1) Ask for a raise 2) Develop new skills 3) Start a side hustle 4) Freelance in your expertise 5) Invest in education/certifications 6) Consider remote work opportunities.",
  "default": "I'm here to help with your financial questions! Ask me about budgeting, saving, debt management, investing, or any money-related topics. What would you like to know?",
};

function getAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes("budget") || message.includes("budgeting")) {
    return financialAdvice.budget;
  }
  if (message.includes("save") || message.includes("saving") || message.includes("save money")) {
    return financialAdvice.save;
  }
  if (message.includes("debt") || message.includes("loan") || message.includes("credit")) {
    return financialAdvice.debt;
  }
  if (message.includes("invest") || message.includes("investment") || message.includes("stock")) {
    return financialAdvice.invest;
  }
  if (message.includes("expense") || message.includes("spend") || message.includes("cut cost")) {
    return financialAdvice.expense;
  }
  if (message.includes("income") || message.includes("earn") || message.includes("salary")) {
    return financialAdvice.income;
  }
  
  return financialAdvice.default;
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your financial assistant. Ask me anything about budgeting, saving, investing, or managing your finances!",
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
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {open && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] flex flex-col shadow-xl border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm">AI Financial Assistant</h3>
                <p className="text-xs text-slate-500">Online</p>
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
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <Bot className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Bot className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
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
