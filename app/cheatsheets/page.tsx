"use client";
import { Navbar1 } from "@/components/navbar1";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { RegexPlayground } from "@/components/regex-playground";
import { BookOpen, Code2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheatSheets } from "@/components/cheat-sheets";

export default function RegexPage() {
  return (
    <>
      <Navbar1 />
      <div className="min-h-screen mt-10 sm:mt-20">
        <main className="container mx-auto px-2 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
          <div className="relative w-full max-w-7xl p-4 sm:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
          
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Developer Cheat Sheets
              </h1>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
              Quick reference for Git commands and Linux basics in Sinhala and English
            </p>

            {/* The actual playground */}
            <CheatSheets />
          </div>
        </main>
      </div>
      <StackedCircularFooter />
    </>
  );
}