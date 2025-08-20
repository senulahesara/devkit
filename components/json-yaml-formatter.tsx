"use client"
import { useState, useMemo } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Copy,
  Check,
  Download,
  Upload,
  ArrowRightLeft,
  Minimize2,
  Maximize2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Label } from "@/components/ui/label"

// Simple YAML parser/stringifier (basic implementation)
const parseYAML = (yamlString: string): any => {
  try {
    // This is a very basic YAML parser - in a real app you'd use a proper library
    const lines = yamlString.trim().split("\n")
    const result: any = {}
    let currentKey = ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue

      if (trimmed.includes(":")) {
        const [key, ...valueParts] = trimmed.split(":")
        const value = valueParts.join(":").trim()

        if (value === "") {
          currentKey = key.trim()
          result[currentKey] = {}
        } else {
          // Handle different value types
          let parsedValue: any = value
          if (value === "true") parsedValue = true
          else if (value === "false") parsedValue = false
          else if (value === "null") parsedValue = null
          else if (!isNaN(Number(value)) && value !== "") parsedValue = Number(value)
          else if (value.startsWith('"') && value.endsWith('"')) {
            parsedValue = value.slice(1, -1)
          }

          result[key.trim()] = parsedValue
        }
      }
    }

    return result
  } catch (error) {
    throw new Error("Invalid YAML format")
  }
}

const stringifyYAML = (obj: any, indent = 0): string => {
  const spaces = "  ".repeat(indent)
  let result = ""

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result += `${spaces}${key}:\n`
      result += stringifyYAML(value, indent + 1)
    } else if (Array.isArray(value)) {
      result += `${spaces}${key}:\n`
      for (const item of value) {
        if (typeof item === "object") {
          result += `${spaces}  -\n`
          result += stringifyYAML(item, indent + 2)
        } else {
          result += `${spaces}  - ${item}\n`
        }
      }
    } else {
      const stringValue = typeof value === "string" ? `"${value}"` : String(value)
      result += `${spaces}${key}: ${stringValue}\n`
    }
  }

  return result
}

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
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)
  const [copied, setCopied] = useState(false)

  const formatResult = useMemo(() => {
    try {
      if (!input.trim()) {
        setError(null)
        setIsValid(true)
        return { formatted: "", minified: "", converted: "" }
      }

      let parsed: any
      let formatted: string
      let minified: string
      let converted: string

      if (activeTab === "json") {
        // Parse and format JSON
        parsed = JSON.parse(input)
        formatted = JSON.stringify(parsed, null, 2)
        minified = JSON.stringify(parsed)
        converted = stringifyYAML(parsed)
      } else {
        // Parse and format YAML
        parsed = parseYAML(input)
        formatted = stringifyYAML(parsed)
        minified = stringifyYAML(parsed).replace(/\n\s*/g, " ").trim()
        converted = JSON.stringify(parsed, null, 2)
      }

      setError(null)
      setIsValid(true)
      return { formatted, minified, converted }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Invalid ${activeTab.toUpperCase()} format`
      setError(errorMessage)
      setIsValid(false)
      return { formatted: input, minified: "", converted: "" }
    }
  }, [input, activeTab])

  const handleFormat = (type: "formatted" | "minified") => {
    if (type === "formatted") {
      setOutput(formatResult.formatted)
    } else {
      setOutput(formatResult.minified)
    }
  }

  const handleConvert = () => {
    setOutput(formatResult.converted)
    setActiveTab(activeTab === "json" ? "yaml" : "json")
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
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
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
      }
      reader.readAsText(file)
    }
  }

  const sampleData = {
    json: `{
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
}`,
    yaml: `name: "DevKit Lanka"
version: "1.0.0"
description: "A handy toolkit for developers"
features:
  - "Regex Playground"
  - "JSON/YAML Formatter"
  - "Boilerplate Generator"
  - "Developer Cheat Sheets"
config:
  theme: "dark"
  offline: true
  responsive: true`,
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "json" | "yaml")}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant={isValid ? "default" : "destructive"} className="flex items-center gap-1">
              {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>
        </div>

        <TabsContent value="json" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  JSON Input
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(sampleData.json)}
                      className="bg-transparent"
                    >
                      Sample
                    </Button>
                    <Label htmlFor="json-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="json-upload"
                      type="file"
                      accept=".json,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </CardTitle>
                <CardDescription>Paste or upload your JSON data</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="min-h-[400px] text-sm"
                />
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Formatted Output
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("formatted")}
                      disabled={!isValid}
                      className="bg-transparent"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Format
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("minified")}
                      disabled={!isValid}
                      className="bg-transparent"
                    >
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Minify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConvert}
                      disabled={!isValid}
                      className="bg-transparent"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      To YAML
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Formatted and validated JSON</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output || formatResult.formatted}
                  readOnly
                  className="min-h-[400px] text-sm bg-muted"
                />
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output || formatResult.formatted)}
                    className="bg-transparent"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(output || formatResult.formatted, "formatted.json")}
                    className="bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yaml" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  YAML Input
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(sampleData.yaml)}
                      className="bg-transparent"
                    >
                      Sample
                    </Button>
                    <Label htmlFor="yaml-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="yaml-upload"
                      type="file"
                      accept=".yaml,.yml,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </CardTitle>
                <CardDescription>Paste or upload your YAML data</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your YAML here..."
                  className="min-h-[400px] text-sm"
                />
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Formatted Output
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormat("formatted")}
                      disabled={!isValid}
                      className="bg-transparent"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Format
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConvert}
                      disabled={!isValid}
                      className="bg-transparent"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      To JSON
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Formatted and validated YAML</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output || formatResult.formatted}
                  readOnly
                  className="min-h-[400px] text-sm bg-muted"
                />
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output || formatResult.formatted)}
                    className="bg-transparent"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(output || formatResult.formatted, "formatted.yaml")}
                    className="bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
