"use client";
import { Navbar1 } from "@/components/navbar1";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { RegexPlayground } from "@/components/regex-playground";
import { Code2, HelpCircle } from "lucide-react";
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

export default function RegexPage() {
  return (
    <>
      <Navbar1 />
      <div className="min-h-screen mt-10 sm:mt-20">
        <main className="container mx-auto px-2 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
          <div className="relative w-full max-w-7xl p-4 sm:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
            {/* Help / How-to dialog */}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="absolute cursor-pointer top-3 right-3 sm:top-6 sm:right-6 h-10 w-10 sm:h-auto sm:w-auto p-2 sm:px-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white hidden sm:flex"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="hidden sm:inline ml-2">How to Use</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] rounded-lg bg-gray-900/90 border-white/20 text-gray-200 backdrop-blur-lg">
                <DialogHeader className="pr-10">
                  <DialogTitle className="text-lg sm:text-2xl text-white break-words">
                    Welcome to the Regex Playground! A Simple Guide
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    If you're new to Regular Expressions, this step-by-step tour will help you get productive fast.
                  </DialogDescription>
                </DialogHeader>

                {/* Scrollable on small screens */}
                <ScrollArea className="max-h-[70vh] sm:max-h-[75vh] pr-2 sm:pr-4">
                  <div className="space-y-6 py-4 text-gray-300 text-sm sm:text-base leading-relaxed">

                    {/* What is Regex */}
                    <section>
                      <h3 className="text-xl font-semibold text-white mb-2">So, What is Regex?</h3>
                      <p>
                        Think of Regex (Regular Expressions) as a <strong>super-powered Find &amp; Replace</strong>. You describe a pattern (like
                        "find <code>cat</code>, <code>cats</code>, or <code>caterpillar</code>") and Regex finds every match for that pattern in your text—optionally replacing it too.
                      </p>
                    </section>

                    {/* Main sections */}
                    <section>
                      <h3 className="text-xl font-semibold text-white mb-2">1) The Main Sections: Your Workspace</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>Regular Expression</strong> — Type your pattern here. Example: <code>\d</code> matches any digit (0–9).
                        </li>
                        <li>
                          <strong>Test String</strong> — Paste or type the text you want to search.
                        </li>
                        <li>
                          <strong>Highlighted Matches</strong> — Shows your Test String again with matches highlighted. A badge displays the total match count.
                        </li>
                        <li>
                          <strong>Match Details</strong> — A list of all matches with their <em>index</em> (start position) and any <em>capture groups</em> (parts inside <code>(...)</code>).
                          <div className="mt-2 rounded-md border border-white/20 bg-black/30 p-3 text-sm">
                            Cool tip: hover a match in <em>Match Details</em> to spotlight it in <em>Highlighted Matches</em> above.
                          </div>
                        </li>
                      </ul>
                    </section>

                    {/* Flags */}
                    <section>
                      <h3 className="text-xl font-semibold text-white mb-2">2) The Power-Ups: Understanding Flags</h3>
                      <p className="mb-3">Flags tweak how your pattern searches. Toggle them as needed:</p>
                      <div className="border border-white/20 rounded-md overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b-white/20 hover:bg-white/10">
                              <TableHead className="text-white">Flag Name</TableHead>
                              <TableHead className="text-center text-white">Letter</TableHead>
                              <TableHead className="text-white">What it Does (Simple)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-b-white/20 hover:bg-white/10">
                              <TableCell className="font-medium">Global</TableCell>
                              <TableCell className="text-center font-mono">g</TableCell>
                              <TableCell>Find <strong>all</strong> matches, not just the first.</TableCell>
                            </TableRow>
                            <TableRow className="border-b-white/20 hover:bg-white/10">
                              <TableCell className="font-medium">Ignore Case</TableCell>
                              <TableCell className="text-center font-mono">i</TableCell>
                              <TableCell>Case-insensitive search (e.g., <code>cat</code> matches <code>CAT</code>).</TableCell>
                            </TableRow>
                            <TableRow className="border-b-white/20 hover:bg-white/10">
                              <TableCell className="font-medium">Multiline</TableCell>
                              <TableCell className="text-center font-mono">m</TableCell>
                              <TableCell>
                                Makes <code>^</code> and <code>$</code> match the start/end of <em>each line</em>, not just the whole string.
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-b-white/20 hover:bg-white/10">
                              <TableCell className="font-medium">DotAll</TableCell>
                              <TableCell className="text-center font-mono">s</TableCell>
                              <TableCell>
                                Lets <code>.</code> match newlines too (normally it doesn't).
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-b-white/20 hover:bg-white/10">
                              <TableCell className="font-medium">Unicode</TableCell>
                              <TableCell className="text-center font-mono">u</TableCell>
                              <TableCell>
                                Enables full Unicode mode (useful for emojis, non‑Latin scripts, and precise escapes).
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-white/10">
                              <TableCell className="font-medium">Sticky</TableCell>
                              <TableCell className="text-center font-mono">y</TableCell>
                              <TableCell>
                                Matches only at the engine's current position (<code>lastIndex</code>)—great for incremental parsing.
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </section>

                    {/* Advanced features */}
                    <section>
                      <h3 className="text-xl font-semibold text-white mb-2">3) Advanced Features</h3>
                      <div className="space-y-5">
                        <div>
                          <h4 className="font-semibold text-white">A. Substitution (Find &amp; Replace)</h4>
                          <p>
                            Use capture groups <code>(...)</code> in your pattern and reference them in the replacement using <code>$1</code>, <code>$2</code>, etc.
                          </p>
                          <div className="mt-3 p-3 bg-black/30 border border-white/20 rounded-md text-sm">
                            <p className="font-semibold">Example:</p>
                            <ul className="list-disc list-inside mt-1 font-mono text-xs space-y-1">
                              <li>Test String: <code>My name is John Doe.</code></li>
                              <li>Pattern: <code>(\w+)\s(\w+)</code></li>
                              <li>Replacement: <code>$2, $1</code></li>
                              <li>Result: <code>Doe, John</code></li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">B. Common Patterns</h4>
                          <p>
                            Quickly load presets like <em>Email</em>, <em>URL</em>, <em>Phone</em>, and more. Click one to auto‑fill the Regular Expression box.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">C. Regex Quick Reference</h4>
                          <p>
                            Handy cheatsheet for tokens like <code>\w</code> (word), <code>\d</code> (digit), <code>\s</code> (whitespace),
                            quantifiers like <code>+</code> / <code>*</code> / <code>?</code>, and anchors <code>^</code> / <code>$</code>.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Walkthrough */}
                    <section>
                      <h3 className="text-xl font-semibold text-white mb-2">Putting It All Together: A Quick Walkthrough</h3>
                      <p className="mb-2">
                        Goal: list the usernames from email addresses in the text below.
                      </p>
                      <div className="rounded-md border border-white/20 bg-black/30 p-3 text-sm space-y-2">
                        <div>
                          <p className="font-semibold">1) Paste into Test String</p>
                          <pre className="mt-1 whitespace-pre-wrap break-words">Contact support@example.com and sales@company.org for help.</pre>
                        </div>
                        <div>
                          <p className="font-semibold">2) Type this pattern</p>
                          <pre className="mt-1 overflow-x-auto"><code>(\w+)@</code></pre>
                          <p className="mt-1">This captures one or more word characters before the <code>@</code>.</p>
                        </div>
                        <div>
                          <p className="font-semibold">3) Enable the <code>g</code> (Global) flag</p>
                          <p>We want <em>all</em> matches, not just the first.</p>
                        </div>
                        <div>
                          <p className="font-semibold">4) Read the results</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              <strong>Highlighted Matches</strong>: <code>support@</code> and <code>sales@</code>
                            </li>
                            <li>
                              <strong>Match Details</strong>: two matches — Group 1 is <code>support</code> and <code>sales</code>.
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p className="mt-3">That's it! You're extracting real information with a tiny pattern.</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-white mb-2">You're Ready 🎉</h3>
                      <p>
                        Regex can look tricky at first, but a few patterns go a long way. Explore, tweak flags, and check <em>Match Details</em> to learn quickly.
                      </p>
                    </section>

                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Regex Playground
              </h1>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
              Test and debug regular expressions with real-time matching and highlighting
            </p>

            {/* The actual playground */}
            <RegexPlayground />
          </div>
        </main>
      </div>
      <StackedCircularFooter />
    </>
  );
}