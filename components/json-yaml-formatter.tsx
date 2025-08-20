"use client"
import { useState, useMemo, useRef } from "react"
import type React from "react"
import YAML from "js-yaml"
import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { yaml } from "@codemirror/lang-yaml"
import { githubDark } from "@uiw/codemirror-theme-github"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
  Copy,
  Check,
  Download,
  Upload,
  ArrowRightLeft,
  Minimize2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Loader2,
  Link,
} from "lucide-react"

export function JsonYamlFormatter() {
  const [activeTab, setActiveTab] = useState<"json" | "yaml">("json")
  const [input, setInput] = useState(`{
  "name": "DevKit Lanka",
  "version": "1.0.0",
  "description": "A handy toolkit for developers",
  "features": [
    "Regex Playground",
    "JSON/YAML Formatter",
    "Boilerplate Generator",
    "Developer Cheat Sheets"
  ],
  "config": {
    "theme": "dark",
    "offline": true,
    "responsive": true
  }
}`)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedMinified, setCopiedMinified] = useState(false)

  // New State for new features
  const [indentation, setIndentation] = useState<number>(2)
  const [urlInput, setUrlInput] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatResult = useMemo(() => {
    try {
      if (!input.trim()) {
        setError(null)
        return { formatted: "", minified: "", converted: "" }
      }

      let parsed: any
      let formatted: string
      let minified: string
      let converted: string

      if (activeTab === "json") {
        parsed = JSON.parse(input)
        formatted = JSON.stringify(parsed, null, indentation)
        minified = JSON.stringify(parsed)
        // Use the robust js-yaml library for conversion
        converted = YAML.dump(parsed, { indent: indentation })
      } else { // activeTab is 'yaml'
        // Use the robust js-yaml library for parsing
        parsed = YAML.load(input)
        if (typeof parsed === 'undefined' || parsed === null) {
          throw new Error("YAML content is empty or invalid.")
        }
        formatted = YAML.dump(parsed, { indent: indentation })
        minified = JSON.stringify(parsed) // "Minified" YAML is best represented as minified JSON
        converted = JSON.stringify(parsed, null, indentation)
      }

      setError(null)
      return { formatted, minified, converted }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Invalid ${activeTab.toUpperCase()} format`
      setError(errorMessage)
      return { formatted: input, minified: "", converted: "" }
    }
  }, [input, activeTab, indentation])

  const isValid = !error && input.trim().length > 0

  const handleConvert = () => {
    if (!isValid) return
    const newTab = activeTab === "json" ? "yaml" : "json"
    setInput(formatResult.converted)
    setActiveTab(newTab)
  }

  const copyToClipboard = async (text: string, type: "formatted" | "minified") => {
    await navigator.clipboard.writeText(text)
    if (type === 'formatted') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      setCopiedMinified(true)
      setTimeout(() => setCopiedMinified(false), 2000)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Smart tab switching based on file extension
      if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        setActiveTab('yaml')
      } else if (file.name.endsWith('.json')) {
        setActiveTab('json')
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
      }
      reader.readAsText(file)
    }
    // Reset file input to allow uploading the same file again
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleFetchUrl = async () => {
    if (!urlInput) {
      setFetchError("Please enter a URL.")
      return
    }
    setIsFetching(true)
    setFetchError(null)
    try {
      const response = await fetch(urlInput)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.text()
      // A simple heuristic to guess the content type
      try {
        JSON.parse(data)
        setActiveTab("json")
      } catch (e) {
        setActiveTab("yaml")
      }
      setInput(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data."
      setFetchError(`Error fetching from URL: ${errorMessage}. Check CORS policy and URL validity.`)
    } finally {
      setIsFetching(false)
    }
  }

  const getSampleData = (type: "json" | "yaml") => {
    if (activeTab !== type) {
      setActiveTab(type)
    }
    setInput(sampleData[type])
  }

  const sampleData = {
    json: `{
  "name": "DevKit Lanka",
  "version": "1.0.0",
  "description": "A handy toolkit for developers",
  "features": [
    "Regex Playground",
    "JSON/YAML Formatter",
    "Boilerplate Generator"
  ],
  "config": {
    "theme": "dark",
    "responsive": true
  }
}`,
    yaml: `name: DevKit Lanka
version: 1.0.0
description: A handy toolkit for developers
features:
  - Regex Playground
  - JSON/YAML Formatter
  - Boilerplate Generator
config:
  theme: dark
  responsive: true
`,
  }

  const currentFormat = activeTab.toUpperCase()
  const targetFormat = activeTab === 'json' ? 'YAML' : 'JSON'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Fetch from URL
          </CardTitle>
          <CardDescription>
            Enter a URL to fetch JSON or YAML data directly from an API endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <div className="flex-grow space-y-1">
              <Input
                type="url"
                placeholder="https://api.example.com/data.json"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isFetching}
              />
              {fetchError && (
                <p className="text-xs text-destructive">{fetchError}</p>
              )}
            </div>
            <Button onClick={handleFetchUrl} disabled={isFetching}>
              {isFetching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Fetch
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "json" | "yaml")}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <TabsList className="grid w-full sm:w-fit grid-cols-2">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => getSampleData('json')}>JSON Sample</Button>
            <Button variant="ghost" size="sm" onClick={() => getSampleData('yaml')}>YAML Sample</Button>
            <Badge variant={isValid ? "default" : "destructive"} className="flex items-center gap-1">
              {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentFormat} Input
                <TooltipProvider>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Upload File</TooltipContent>
                    </Tooltip>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.yaml,.yml,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setInput("")}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear Input</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <CodeMirror
                  value={input}
                  height="450px"
                  theme={githubDark}
                  extensions={[activeTab === "json" ? json() : yaml()]}
                  onChange={(value) => setInput(value)}
                  className="border rounded-md"
                />
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="break-words">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Formatted Output
                <div className="flex items-center gap-2">
                  <Label htmlFor="indentation" className="text-sm font-medium">Indent</Label>
                  <Select
                    value={String(indentation)}
                    onValueChange={(val) => setIndentation(Number(val))}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="Indent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeMirror
                value={isValid ? formatResult.formatted : `// Fix the error in the input to see the formatted output`}
                readOnly
                height="450px"
                theme={githubDark}
                extensions={[activeTab === "json" ? json() : yaml()]}
                className="border rounded-md bg-muted"
              />
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Button onClick={handleConvert} disabled={!isValid}>
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Convert to {targetFormat}
                </Button>
                <div className="flex-grow" />
                {activeTab === 'json' &&
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formatResult.minified, "minified")}
                    disabled={!isValid}
                  >
                    {copiedMinified ? <Check className="w-4 h-4 mr-2" /> : <Minimize2 className="w-4 h-4 mr-2" />}
                    {copiedMinified ? "Copied!" : "Copy Minified"}
                  </Button>
                }
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formatResult.formatted, "formatted")}
                  disabled={!isValid}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(formatResult.formatted, `formatted.${activeTab}`)}
                  disabled={!isValid}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}