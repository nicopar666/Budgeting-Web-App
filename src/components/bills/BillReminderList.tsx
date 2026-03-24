"use client";

import { useState } from "react";
import { Plus, Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBillReminder, deleteBillReminder, markBillPaid, markBillUnpaid } from "@/actions/billReminderActions";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BillReminder {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  lastPaid: Date | null;
}

interface BillReminderListProps {
  reminders: BillReminder[];
}

export function BillReminderList({ reminders: initialReminders }: BillReminderListProps) {
  const [reminders, setReminders] = useState(initialReminders);
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      await createBillReminder(formData);
      toast.success("Bill reminder added");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to add bill reminder");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this bill reminder?")) return;
    try {
      await deleteBillReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
      toast.success("Bill reminder deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  async function handleTogglePaid(id: string, isPaid: boolean) {
    try {
      if (isPaid) {
        await markBillUnpaid(id);
        setReminders(reminders.map(r => r.id === id ? { ...r, isPaid: false } : r));
      } else {
        await markBillPaid(id);
        setReminders(reminders.map(r => r.id === id ? { ...r, isPaid: true } : r));
      }
      toast.success(isPaid ? "Marked as unpaid" : "Marked as paid");
    } catch (error) {
      toast.error("Failed to update");
    }
  }

  const categories = ["Utilities", "Rent", "Internet", "Phone", "Insurance", "Subscription", "Other"];
  const upcomingBills = reminders.filter(r => !r.isPaid && r.dueDay >= new Date().getDate() && r.dueDay <= new Date().getDate() + 7);
  const totalUnpaid = reminders.filter(r => !r.isPaid).reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card className="glass animate-fade-in">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Bill Reminders</CardTitle>
          <p className="text-sm text-muted-foreground">
            {totalUnpaid > 0 ? `Total upcoming: ${formatCurrency(totalUnpaid)}` : "No unpaid bills"}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bill Reminder</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bill Name</Label>
                <Input id="name" name="name" placeholder="e.g., Electric Bill" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₱)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDay">Due Day (1-31)</Label>
                <Input id="dueDay" name="dueDay" type="number" min="1" max="31" placeholder="15" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Add Reminder</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No bill reminders yet. Add one to track upcoming payments!</p>
        ) : (
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    reminder.isPaid ? "bg-secondary/50 border-border/50" : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTogglePaid(reminder.id, reminder.isPaid)}
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        reminder.isPaid ? "bg-primary border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {reminder.isPaid && <Check className="h-3 w-3 text-primary-foreground" />}
                    </button>
                    <div>
                      <p className={`font-medium ${reminder.isPaid ? "line-through text-muted-foreground" : ""}`}>
                        {reminder.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: Day {reminder.dueDay} • {reminder.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${reminder.isPaid ? "text-muted-foreground" : ""}`}>
                      {formatCurrency(reminder.amount)}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {upcomingBills.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-amber-500">
              <Bell className="h-4 w-4" />
              <span>{upcomingBills.length} bill(s) due this week</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}