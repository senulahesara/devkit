"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Copy, Check, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RegexMatch {
  match: string
  index: number
  groups: string[]
}

export function RegexPlayground() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b")
  const [testString, setTestString] = useState(
    "Contact us at support@example.com or sales@company.org for more information."
  )
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const regexResult = useMemo(() => {
    try {
      if (!pattern) {
        setError(null)
        return { matches: [], regex: null }
      }

      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case "global":
              return "g"
            case "ignoreCase":
              return "i"
            case "multiline":
              return "m"
            case "dotAll":
              return "s"
            case "unicode":
              return "u"
            case "sticky":
              return "y"
            default:
              return ""
          }
        })
        .join("")

      const regex = new RegExp(pattern, flagString)
      const matches: RegexMatch[] = []

      if (flags.global) {
        let match
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          })
          if (!flags.global) break
        }
      } else {
        const match = regex.exec(testString)
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      setError(null)
      return { matches, regex }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regular expression")
      return { matches: [], regex: null }
    }
  }, [pattern, testString, flags])

  const highlightedText = useMemo(() => {
    if (!testString || regexResult.matches.length === 0) {
      return testString
    }

    let result = ""
    let lastIndex = 0

    regexResult.matches.forEach((match, i) => {
      result += testString.slice(lastIndex, match.index)
      result += `<mark class="bg-blue-500/30 text-blue-900 dark:text-blue-100 px-1 rounded" data-match="${i}">${match.match}</mark>`
      lastIndex = match.index + match.match.length
    })

    result += testString.slice(lastIndex)
    return result
  }, [testString, regexResult.matches])

  const copyRegex = async () => {
    const flagString = Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag]) => {
        switch (flag) {
          case "global":
            return "g"
          case "ignoreCase":
            return "i"
          case "multiline":
            return "m"
          case "dotAll":
            return "s"
          case "unicode":
            return "u"
          case "sticky":
            return "y"
          default:
            return ""
        }
      })
      .join("")

    const regexString = `/${pattern}/${flagString}`
    await navigator.clipboard.writeText(regexString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const commonPatterns = [
    { name: "Email", pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b" },
    {
      name: "URL",
      pattern:
        "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    },
    { name: "Phone", pattern: "\\+?[1-9]\\d{1,14}" },
    { name: "IPv4", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b" },
    { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
    { name: "Hex Color", pattern: "#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}" },
  ]

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pattern Input */}
        <Card> <CardHeader> <CardTitle className="flex items-center justify-between"> Regular Expression <Button variant="outline" size="sm" onClick={copyRegex} className="flex items-center gap-2 bg-transparent" > {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied!" : "Copy"} </Button> </CardTitle> <CardDescription> Enter your regex pattern </CardDescription> </CardHeader> <CardContent className="space-y-4"> <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="font-mono" /> <div> <Label className="text-sm font-medium">Flags</Label> <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2"> {Object.entries(flags).map(([flag, enabled]) => (<div key={flag} className="flex items-center space-x-2"> <Checkbox id={flag} checked={enabled} onCheckedChange={(checked) => setFlags((prev) => ({ ...prev, [flag]: checked as boolean }))} /> <Label htmlFor={flag} className="text-sm capitalize"> {flag === "ignoreCase" ? "Ignore Case" : flag === "dotAll" ? "Dot All" : flag} </Label> </div>))} </div> </div> {error && (<Alert variant="destructive"> <AlertCircle className="h-4 w-4" /> <AlertDescription>{error}</AlertDescription> </Alert>)} </CardContent> </Card>



        {/* Test String Input */}
        <Card>
          <CardHeader>
            <CardTitle>Test String</CardTitle>
            <CardDescription>Enter text to test against your pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test..."
              className="min-h-[200px] font-mono"
            />
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highlighted Text */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Highlighted Matches
              <Badge variant="secondary">{regexResult.matches.length} matches</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-words min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </CardContent>
        </Card>

        {/* Match Details */}
        <Card>
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[220px] pr-3">
              {regexResult.matches.length === 0 ? (
                <p className="text-muted-foreground text-sm">No matches found</p>
              ) : (
                regexResult.matches.map((match, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Match {index + 1}</Badge>
                      <span className="text-xs text-muted-foreground">Index: {match.index}</span>
                    </div>
                    <div className="font-mono text-sm bg-background p-2 rounded border">
                      {match.match}
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Capture Groups:</p>
                        {match.groups.map((group, groupIndex) => (
                          <div
                            key={groupIndex}
                            className="text-xs font-mono bg-background p-1 rounded border mb-1"
                          >
                            Group {groupIndex + 1}: {group || "(empty)"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Common Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Common Patterns
          </CardTitle>
          <CardDescription>Click to use these frequently used regex patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonPatterns.map((item) => (
              <Button
                key={item.name}
                variant="outline"
                className="justify-start h-auto p-3 bg-transparent"
                onClick={() => setPattern(item.pattern)}
              >
                <div className="text-left w-full">
                  <div className="font-medium">{item.name}</div>
                  <div
                    className="text-xs text-muted-foreground font-mono truncate"
                    title={item.pattern}
                  >
                    {item.pattern}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
