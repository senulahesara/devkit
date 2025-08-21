"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Copy, Check, Info, Replace } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

interface RegexMatch {
  match: string
  index: number
  groups: string[]
}

export function RegexPlayground() {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+\\.\\w+)\\b")
  const [testString, setTestString] = useState(
    "Contact us at support@example.com or sales@company.org for more information."
  )
  const [substitution, setSubstitution] = useState("user-$1@$2")
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
  const [hoveredMatchIndex, setHoveredMatchIndex] = useState<number | null>(null)

  const regexResult = useMemo(() => {
    try {
      if (!pattern) {
        setError(null)
        return { matches: [], regex: null }
      }

      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => {
          const flagMap: { [key: string]: string } = {
            global: "g",
            ignoreCase: "i",
            multiline: "m",
            dotAll: "s",
            unicode: "u",
            sticky: "y",
          }
          return flagMap[key] || ""
        })
        .join("")

      const regex = new RegExp(pattern, flagString)
      const matches: RegexMatch[] = []

      // Use matchAll for a cleaner global match implementation
      if (flags.global) {
        for (const match of testString.matchAll(regex)) {
          matches.push({
            match: match[0],
            index: match.index ?? 0,
            groups: Array.from(match).slice(1),
          })
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
      const isHovered = i === hoveredMatchIndex
      const highlightClass = isHovered
        ? "bg-yellow-400/50 ring-2 ring-yellow-500"
        : "bg-blue-500/30 text-blue-900 dark:text-blue-100"

      result += testString.slice(lastIndex, match.index)
      result += `<mark class="${highlightClass} px-1 rounded transition-all duration-150" data-match-index="${i}">${match.match}</mark>`
      lastIndex = match.index + match.match.length
    })

    result += testString.slice(lastIndex)
    return result
  }, [testString, regexResult.matches, hoveredMatchIndex])

  const substitutionResult = useMemo(() => {
    if (!regexResult.regex || error) {
      return testString
    }
    try {
      return testString.replace(regexResult.regex, substitution)
    } catch (e) {
      return "Error in substitution pattern."
    }
  }, [testString, substitution, regexResult, error])

  const copyRegex = async () => {
    const flagString = Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => ({ global: "g", ignoreCase: "i", multiline: "m", dotAll: "s", unicode: "u", sticky: "y" }[key] || ""))
      .join("")

    const regexString = `/${pattern}/${flagString}`
    await navigator.clipboard.writeText(regexString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cheatsheetData = {
    "Common Tokens": [
      { token: ".", description: "Any character except newline" },
      { token: "\\w", description: "Any word character (a-z, A-Z, 0-9, _)" },
      { token: "\\d", description: "Any digit (0-9)" },
      { token: "\\s", description: "Any whitespace character" },
      { token: "\\b", description: "Word boundary" },
      { token: "^", description: "Start of string (or line with 'm' flag)" },
      { token: "$", description: "End of string (or line with 'm' flag)" },
    ],
    "Quantifiers": [
      { token: "*", description: "0 or more times" },
      { token: "+", description: "1 or more times" },
      { token: "?", description: "0 or 1 time (optional)" },
      { token: "{n}", description: "Exactly n times" },
      { token: "{n,}", description: "n or more times" },
      { token: "{n,m}", description: "Between n and m times" },
    ],
    "Groups & Lookarounds": [
      { token: "(...)", description: "Capturing group" },
      { token: "(?:...)", description: "Non-capturing group" },
      { token: "[...]", description: "Character set" },
      { token: "(?=...)", description: "Positive lookahead" },
      { token: "(?!...)", description: "Negative lookahead" },
    ],
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Regular Expression
              <Button variant="outline" size="sm" onClick={copyRegex} className="flex items-center gap-2 bg-transparent">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </CardTitle>
            <CardDescription>Enter your regex pattern below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." />
            <div>
              <Label className="text-sm font-medium">Flags</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <div key={flag} className="flex items-center space-x-2">
                    <Checkbox id={flag} checked={enabled} onCheckedChange={(checked) => setFlags((prev) => ({ ...prev, [flag]: checked as boolean }))} />
                    <Label htmlFor={flag} className="text-sm font-normal capitalize cursor-pointer">
                      {flag.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test String</CardTitle>
            <CardDescription>Enter the text you want to test your pattern against.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter text to test..." className="min-h-[225px]" />
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Highlighted Matches
              <Badge variant="secondary">{regexResult.matches.length} {regexResult.matches.length === 1 ? 'match' : 'matches'}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] w-full">
              <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words min-h-full" dangerouslySetInnerHTML={{ __html: highlightedText }} />
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Match Details</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-3">
              {regexResult.matches.length === 0 ? (
                <p className="text-muted-foreground text-sm flex items-center justify-center h-full">No matches found.</p>
              ) : (
                regexResult.matches.map((match, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg mb-2 transition-colors hover:bg-muted-foreground/10" onMouseEnter={() => setHoveredMatchIndex(index)} onMouseLeave={() => setHoveredMatchIndex(null)}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Match {index + 1}</Badge>
                      <span className="text-xs text-muted-foreground">Index: {match.index}</span>
                    </div>
                    <div className="text-sm bg-background p-2 rounded border break-all">{match.match}</div>
                    {match.groups.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Capture Groups:</p>
                        {match.groups.map((group, groupIndex) => (
                          <div key={groupIndex} className="text-xs bg-background p-1.5 rounded border mb-1 flex items-baseline">
                            <Badge variant="secondary" className="mr-2">{groupIndex + 1}</Badge>
                            <span className="break-all">{group === undefined ? <i className="text-muted-foreground">undefined</i> : group || <i className="text-muted-foreground">(empty)</i>}</span>
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

      {/* NEW: Substitution Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Replace className="w-5 h-5" />
            Substitution
          </CardTitle>
          <CardDescription>Replace the matched text using a substitution pattern. Use $1, $2, etc. for capture groups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="substitution-input">Replacement Pattern</Label>
            <Input id="substitution-input" value={substitution} onChange={(e) => setSubstitution(e.target.value)} placeholder="Enter substitution..." className=" mt-2" />
          </div>
          <div>
            <Label>Result</Label>
            <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words min-h-[60px] mt-2">
              {substitutionResult}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Patterns & Cheatsheet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Common Patterns
            </CardTitle>
            <CardDescription>Click to use a frequently used regex pattern.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Email", pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b" },
                { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
                { name: "IPv4 Address", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b" },
                { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
              ].map((item) => (
                <Button key={item.name} variant="outline" className="justify-start h-auto p-3 bg-transparent text-left" onClick={() => setPattern(item.pattern)}>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground truncate w-full mt-1" title={item.pattern}>{item.pattern}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NEW: Regex Cheatsheet */}
        <Card>
          <CardHeader>
            <CardTitle>Regex Quick Reference</CardTitle>
            <CardDescription>A quick guide to common regex syntax.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              {Object.entries(cheatsheetData).map(([title, items]) => (
                <div key={title} className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">{title}</h4>
                  <Table>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.token}>
                          <TableCell className="font-bold p-2 w-1/3">{item.token}</TableCell>
                          <TableCell className="p-2">{item.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}