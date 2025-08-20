"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { HelpCircle, ArrowRightLeft, Upload, Link, Trash2, Copy, Download, Minimize2 } from "lucide-react"

export function JsonYamlUserManual() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="absolute cursor-pointer top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 sm:h-auto sm:w-auto p-2 sm:px-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2">How to Use</span>
                </Button>
            </DialogTrigger>
            {/* ⬇️ Increased width and kept responsive scaling */}
            <DialogContent className="sm:max-w-6xl w-[95vw] max-h-[90vh] rounded-lg bg-gray-900/90 border-white/20 text-gray-200 backdrop-blur-lg">
                <DialogHeader className="pr-10">
                    <DialogTitle className="text-lg sm:text-2xl text-white break-words">
                        Welcome to the JSON/YAML Formatter! A Simple Guide
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        Tame messy data, convert formats, and validate your code in seconds. Here’s how it works.
                    </DialogDescription>
                </DialogHeader>

                {/* ⬇️ Scroll preserved inside modal */}
                <ScrollArea className="max-h-[70vh] sm:max-h-[75vh] pr-2 sm:pr-4">
                    <div className="space-y-6 py-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                        {/* What are JSON & YAML */}
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">What are JSON & YAML?</h3>
                            <p>
                                They are two ways to write structured data. Think of them as universal languages for APIs and configuration files.
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2">
                                <li><strong>JSON</strong> (JavaScript Object Notation) is compact and great for machines. It uses curly braces <code>{`{ }`}</code> and quotes.</li>
                                <li><strong>YAML</strong> (YAML Ain't Markup Language) is clean and great for humans. It uses indentation and no braces.</li>
                            </ul>
                            <p className="mt-2">This tool helps you clean up, validate, and switch between them effortlessly.</p>
                        </section>

                        {/* Main sections */}
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">1) Your Workspace: The Editors</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li>
                                    <strong>Input Editor</strong> — Paste your messy JSON or YAML here. It features syntax highlighting to help you read and edit.
                                </li>
                                <li>
                                    <strong>Output Editor</strong> — This is a read-only view of your data, instantly formatted and beautified.
                                </li>
                                <li>
                                    <strong>JSON / YAML Tabs</strong> — Select the format of the data you're pasting in the <strong>Input Editor</strong>. The tool adapts its validation and formatting rules accordingly.
                                </li>
                                <li>
                                    <strong>Validation Badge</strong> — A simple status check.
                                    <div className="mt-2 rounded-md border border-white/20 bg-black/30 p-3 text-sm">
                                        <code>Valid</code> means your code is perfect. <code>Invalid</code> means there's a syntax error, which will be described below the input editor so you can fix it.
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* Actions */}
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">2) The Control Panel: Your Actions</h3>
                            <p className="mb-3">These buttons give you full control over your data.</p>
                            <div className="border border-white/20 rounded-md overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableHead className="text-white">Action</TableHead>
                                            <TableHead className="text-center text-white">Icon</TableHead>
                                            <TableHead className="text-white">What it Does</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableCell className="font-medium">Fetch from URL</TableCell>
                                            <TableCell className="text-center font-mono flex justify-center"><Link size={18} /></TableCell>
                                            <TableCell>Pulls data directly from an API endpoint into the Input Editor.</TableCell>
                                        </TableRow>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableCell className="font-medium">Convert</TableCell>
                                            <TableCell className="text-center font-mono flex justify-center"><ArrowRightLeft size={18} /></TableCell>
                                            <TableCell>Swaps formats. Converts your input to the other format (JSON ↔ YAML) and updates the editor.</TableCell>
                                        </TableRow>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableCell className="font-medium">Indent Control</TableCell>
                                            <TableCell className="text-center font-mono">2 | 4 | 8</TableCell>
                                            <TableCell>Sets the number of spaces for indentation in the formatted output. (2 is standard).</TableCell>
                                        </TableRow>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableCell className="font-medium">Copy Minified (JSON only)</TableCell>
                                            <TableCell className="text-center font-mono flex justify-center"><Minimize2 size={18} /></TableCell>
                                            <TableCell>Copies the JSON to your clipboard as a single, compressed line without spaces.</TableCell>
                                        </TableRow>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableCell className="font-medium">Upload File</TableCell>
                                            <TableCell className="text-center font-mono flex justify-center"><Upload size={18} /></TableCell>
                                            <TableCell>Loads a <code>.json</code>, <code>.yaml</code>, or <code>.txt</code> file from your computer. The tool will auto-switch tabs for you.</TableCell>
                                        </TableRow>
                                        <TableRow className="border-b-white/20 hover:bg-white/10">
                                            <TableCell className="font-medium">Clear / Copy / Download</TableCell>
                                            <TableCell className="text-center font-mono flex justify-center gap-2"><Trash2 size={18} /><Copy size={18} /><Download size={18} /></TableCell>
                                            <TableCell>Basic utilities: Empty the input, copy the output, or download the output as a file.</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </section>

                        {/* Walkthrough */}
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">Putting It All Together: A Quick Walkthrough</h3>
                            <p className="mb-2">
                                Goal: Take a messy, single-line JSON string, format it, and convert it to clean YAML.
                            </p>
                            <div className="rounded-md border border-white/20 bg-black/30 p-3 text-sm space-y-3">
                                <div>
                                    <p className="font-semibold">1) Select the JSON tab and paste this into the Input Editor:</p>
                                    <pre className="mt-1 whitespace-pre-wrap break-words bg-black/50 p-2 rounded-md text-xs"><code>{`{"id":101, "user":"dev_lanka", "active": true, "roles":["admin", "editor"]}`}</code></pre>
                                </div>
                                <div>
                                    <p className="font-semibold">2) Observe the Output Editor</p>
                                    <p className="mt-1">Instantly, you'll see the same data, perfectly formatted and indented. The "Valid" badge will light up.</p>
                                </div>
                                <div>
                                    <p className="font-semibold">3) Click the "Convert to YAML" button</p>
                                    <p>The Input Editor's content is replaced with the YAML version, and the active tab automatically switches to YAML.</p>
                                </div>
                                <div>
                                    <p className="font-semibold">4) Download the result</p>
                                    <p>Click the "Download" button on the output side. You've just saved a clean <code>formatted.yaml</code> file.</p>
                                </div>
                            </div>
                            <p className="mt-3">That's it! You've validated, formatted, and converted data in just a few clicks.</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">You're Ready 🎉</h3>
                            <p>
                                This tool is built to be fast and intuitive. Whether you're debugging an API response or writing a config file, we've got your back.
                            </p>
                        </section>
                    </div>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
