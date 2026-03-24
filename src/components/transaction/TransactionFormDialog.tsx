"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransaction } from "@/actions/transactionActions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { categoryList } from "@/lib/categories";

const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().max(250).optional(),
  category: z.string().min(1, "Category is required"),
  date: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function TransactionFormDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "expense",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const watchType = watch("type");
  const watchCategory = watch("category");

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    try {
      const result = await createTransaction(formData);
      if (result?.budgetExceeded) {
        toast.error("Budget exceeded for this category in the current month.");
      } else {
        toast.success("Transaction added");
      }
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Transaction error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to add transaction");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
          <DialogDescription>Add income or expense</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                onValueChange={(value) => setValue("type", value as "income" | "expense")}
                value={watchType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input {...register("amount")} type="number" step="0.01" min="0" placeholder="0.00" />
              {errors.amount && (
                <p className="text-xs text-red-600">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                value={watchCategory || "Food"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input {...register("date")} type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input {...register("description")} placeholder="Add a note..." />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
