"use client";
import { Navbar1 } from "@/components/navbar1";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { Code2 } from "lucide-react";
import { RegexPlayground } from "@/components/regex-playground"

export default function RegexPage() {
  return (
    <>
      <Navbar1 />
      <div className="min-h-screen mt-20">
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div
            className="w-full max-w-7xl p-3 md:p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Regex Playground</h1>
            </div>
            <p className="text-gray-300 text-base mb-6">
              Test and debug regular expressions with real-time matching and highlighting
            </p>
            <RegexPlayground />
          </div>
        </main>
      </div>
      <StackedCircularFooter />
    </>
  );
}
