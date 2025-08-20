"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Copy, Check, GitBranch, Terminal, BookOpen, Box, Package } from "lucide-react"
import { Label } from "@/components/ui/label"
import { LucideProps } from "lucide-react"

// --- DATA STRUCTURES ---

interface CheatSheetItem {
  command: string
  description: string
  sinhala: string
  example?: string
  category: string
}

interface CheatSheet {
  label: string
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  commands: CheatSheetItem[]
}

// --- COMMAND DEFINITIONS ---

const gitCommands: CheatSheetItem[] = [
  // Existing commands...
  { command: "git init", description: "Initialize a new Git repository", sinhala: "නව Git repository එකක් ආරම්භ කරන්න", example: "git init", category: "Setup" },
  { command: "git clone <url>", description: "Clone a repository from remote", sinhala: "දුරස්ථ repository එකක් copy කරන්න", example: "git clone https://github.com/user/repo.git", category: "Setup" },
  { command: "git add <file>", description: "Add file to staging area", sinhala: "file එකක් staging area එකට එකතු කරන්න", example: "git add index.html", category: "Basic" },
  { command: "git add .", description: "Add all files to staging area", sinhala: "සියලුම files staging area එකට එකතු කරන්න", example: "git add .", category: "Basic" },
  { command: "git commit -m 'message'", description: "Commit changes with message", sinhala: "වෙනස්කම් message එකක් සමඟ commit කරන්න", example: "git commit -m 'Add new feature'", category: "Basic" },
  { command: "git status", description: "Check repository status", sinhala: "repository එකේ තත්වය පරීක්ෂා කරන්න", example: "git status", category: "Basic" },
  { command: "git log", description: "View commit history", sinhala: "commit ඉතිහාසය බලන්න", example: "git log --oneline --graph", category: "Basic" },
  { command: "git push origin <branch>", description: "Push changes to remote branch", sinhala: "වෙනස්කම් remote branch එකට push කරන්න", example: "git push origin main", category: "Remote" },
  { command: "git pull", description: "Pull latest changes from remote", sinhala: "remote එකෙන් නවතම වෙනස්කම් pull කරන්න", example: "git pull origin main", category: "Remote" },
  { command: "git branch", description: "List all branches", sinhala: "සියලුම branches ලැයිස්තුව", example: "git branch -a", category: "Branching" },
  { command: "git checkout <branch>", description: "Switch to branch", sinhala: "branch එකට මාරු වන්න", example: "git checkout develop", category: "Branching" },
  { command: "git checkout -b <branch>", description: "Create and switch to new branch", sinhala: "නව branch එකක් සාදා එයට මාරු වන්න", example: "git checkout -b feature/login", category: "Branching" },
  { command: "git merge <branch>", description: "Merge branch into current branch", sinhala: "branch එක වර්තමාන branch එකට merge කරන්න", example: "git merge feature/login", category: "Branching" },
  { command: "git stash", description: "Temporarily save uncommitted changes", sinhala: "commit නොකළ වෙනස්කම් තාවකාලිකව save කරන්න", example: "git stash push -m 'work in progress'", category: "Advanced" },
  { command: "git stash pop", description: "Apply and remove latest stash", sinhala: "අවසාන stash එක apply කර remove කරන්න", example: "git stash pop", category: "Advanced" },
  { command: "git diff", description: "Show changes between commits, commit and working tree, etc.", sinhala: "commits, working tree අතර වෙනස්කම් පෙන්වන්න", example: "git diff HEAD~1", category: "Advanced" },
  
  // New "Power User" Git Commands
  {
    command: "git reflog",
    description: "Show a log of reference changes (e.g., HEAD changes). Your safety net!",
    sinhala: "Reference වෙනස්වීම් වල log එක බලන්න (උදා: HEAD වෙනස්වීම්). ඔබේ ආරක්ෂක දැල!",
    example: "git reflog",
    category: "Power User",
  },
  {
    command: "git rebase -i HEAD~<n>",
    description: "Interactively rebase the last <n> commits (squash, edit, reorder).",
    sinhala: "අවසාන commits <n> ගණන interactiveව rebase කරන්න (squash, edit, reorder).",
    example: "git rebase -i HEAD~3",
    category: "Power User",
  },
  {
    command: "git bisect",
    description: "Find the commit that introduced a bug using binary search.",
    sinhala: "Binary search මගින් bug එකක් හඳුන්වා දුන් commit එක සොයාගන්න.",
    example: "git bisect start; git bisect bad; git bisect good <commit-hash>",
    category: "Power User",
  },
  {
    command: "git cherry-pick <commit-hash>",
    description: "Apply the changes from a specific commit onto the current branch.",
    sinhala: "වෙනත් branch එකක commit එකක් වත්මන් branch එකට apply කරන්න.",
    example: "git cherry-pick a1b2c3d4",
    category: "Power User",
  },
  {
    command: "git reset --soft HEAD~1",
    description: "Uncommit changes, keeping them in the staging area.",
    sinhala: "අවසන් commit එක අහෝසි කර, වෙනස්කම් staging area එකේ තබන්න.",
    example: "git reset --soft HEAD~1",
    category: "Advanced",
  },
];

const linuxCommands: CheatSheetItem[] = [
  // Existing commands...
  { command: "ls -la", description: "List directory contents with details", sinhala: "directory එකේ අන්තර්ගතය විස්තරාත්මකව", example: "ls -la", category: "Navigation" },
  { command: "cd <directory>", description: "Change directory", sinhala: "directory එක වෙනස් කරන්න", example: "cd /home/user", category: "Navigation" },
  { command: "pwd", description: "Print working directory", sinhala: "වර්තමාන directory එක පෙන්වන්න", example: "pwd", category: "Navigation" },
  { command: "mkdir -p <path>", description: "Create directory including parent dirs", sinhala: "parent directories සමඟ directory එකක් සාදන්න", example: "mkdir -p project/src/components", category: "File Operations" },
  { command: "rm -rf <directory>", description: "Remove directory and contents (dangerous)", sinhala: "directory එක සහ අන්තර්ගතය ඉවත් කරන්න (අනතුරුදායක)", example: "rm -rf old-project/", category: "File Operations" },
  { command: "cp -r <source> <dest>", description: "Copy directory recursively", sinhala: "directory එකක් recursively copy කරන්න", example: "cp -r project/ backup/", category: "File Operations" },
  { command: "mv <source> <dest>", description: "Move or rename file/directory", sinhala: "file/directory එකක් move හෝ rename කරන්න", example: "mv old.txt new.txt", category: "File Operations" },
  { command: "touch <file>", description: "Create empty file or update timestamp", sinhala: "හිස් file එකක් සාදන්න හෝ timestamp යාවකාලීන කරන්න", example: "touch newfile.txt", category: "File Operations" },
  { command: "cat <file>", description: "Display file contents", sinhala: "file එකේ අන්තර්ගතය පෙන්වන්න", example: "cat readme.txt", category: "File Viewing" },
  { command: "less <file>", description: "View file contents page by page", sinhala: "file එකේ අන්තර්ගතය පිටුවෙන් පිටුව බලන්න", example: "less large-file.log", category: "File Viewing" },
  { command: "tail -f <file>", description: "Follow a file's content in real-time", sinhala: "file එකක අන්තර්ගතය real-time බලන්න", example: "tail -f app.log", category: "File Viewing" },
  { command: "grep -r <pattern> <dir>", description: "Search for pattern recursively in a directory", sinhala: "directory එකක pattern එකක් recursively සොයන්න", example: "grep -r 'API_KEY' .", category: "Search" },
  { command: "find <path> -name <pattern>", description: "Find files by name pattern", sinhala: "නම් pattern එකෙන් files සොයන්න", example: "find . -name '*.js'", category: "Search" },
  { command: "ps aux", description: "List running processes", sinhala: "ක්‍රියාත්මක processes ලැයිස්තුව", example: "ps aux | grep node", category: "System" },
  { command: "kill -9 <pid>", description: "Force terminate a process by ID", sinhala: "ID එකෙන් process එකක් බලහත්කාරයෙන් terminate කරන්න", example: "kill -9 1234", category: "System" },
  { command: "chmod +x <file>", description: "Make a file executable", sinhala: "file එකක් executable කරන්න", example: "chmod +x script.sh", category: "Permissions" },
  
  // New "Power User" Linux Commands
  {
    command: "xargs",
    description: "Build and execute command lines from standard input.",
    sinhala: "Standard input එකෙන් command lines ගොඩනගා execute කරන්න.",
    example: "find . -name '*.log' | xargs rm",
    category: "Power User",
  },
  {
    command: "lsof -i :<port>",
    description: "List processes using a specific network port.",
    sinhala: " নির্দিষ্ট network port එකක් භාවිතා කරන processes ලැයිස්තුගත කරන්න.",
    example: "lsof -i :3000",
    category: "Power User",
  },
  {
    command: "history | grep <cmd>",
    description: "Search your command history.",
    sinhala: "ඔබේ command ඉතිහාසය සොයන්න.",
    example: "history | grep docker",
    category: "Power User",
  },
  {
    command: "df -h",
    description: "Display disk space usage in human-readable format.",
    sinhala: "තැටි ඉඩ භාවිතය මිනිසුන්ට කියවිය හැකි ආකාරයෙන් පෙන්වන්න.",
    example: "df -h",
    category: "System",
  },
];

const dockerCommands: CheatSheetItem[] = [
  { command: "docker ps", description: "List running containers", sinhala: "ක්‍රියාත්මක වන containers ලැයිස්තුව", example: "docker ps -a", category: "Management" },
  { command: "docker images", description: "List all local images", sinhala: "සියලුම local images ලැයිස්තුව", example: "docker images", category: "Management" },
  { command: "docker build -t <name> .", description: "Build an image from a Dockerfile", sinhala: "Dockerfile එකකින් image එකක් build කරන්න", example: "docker build -t my-app:latest .", category: "Lifecycle" },
  { command: "docker run <image>", description: "Run a command in a new container", sinhala: "නව container එකක command එකක් run කරන්න", example: "docker run -d -p 8080:80 nginx", category: "Lifecycle" },
  { command: "docker stop <id|name>", description: "Stop one or more running containers", sinhala: "ක්‍රියාත්මක වන container එකක් හෝ කිහිපයක් නවත්වන්න", example: "docker stop my-container", category: "Lifecycle" },
  { command: "docker rm <id|name>", description: "Remove one or more containers", sinhala: "container එකක් හෝ කිහිපයක් ඉවත් කරන්න", example: "docker rm my-container", category: "Cleanup" },
  { command: "docker rmi <id|name>", description: "Remove one or more images", sinhala: "image එකක් හෝ කිහිපයක් ඉවත් කරන්න", example: "docker rmi my-image", category: "Cleanup" },
  { command: "docker exec -it <name> <cmd>", description: "Run a command in a running container", sinhala: "ක්‍රියාත්මක වන container එකක command එකක් run කරන්න", example: "docker exec -it my-container bash", category: "Interaction" },
  { command: "docker-compose up -d", description: "Start services in detached mode", sinhala: "සේවා detached mode එකෙන් ආරම්භ කරන්න", example: "docker-compose up -d", category: "Compose" },
  { command: "docker-compose down", description: "Stop and remove containers, networks", sinhala: "containers, networks නවතා ඉවත් කරන්න", example: "docker-compose down -v", category: "Compose" },
  { command: "docker logs -f <name>", description: "Fetch the logs of a container", sinhala: "container එකක logs ලබාගන්න", example: "docker logs -f my-app-container", category: "Interaction" },
];

const npmCommands: CheatSheetItem[] = [
  { command: "npm install <pkg>", description: "Install a package", sinhala: "package එකක් install කරන්න", example: "npm install react", category: "Dependencies" },
  { command: "npm install", description: "Install all dependencies from package.json", sinhala: "package.json හි සියලු dependencies install කරන්න", example: "npm i", category: "Dependencies" },
  { command: "npm uninstall <pkg>", description: "Uninstall a package", sinhala: "package එකක් uninstall කරන්න", example: "npm uninstall lodash", category: "Dependencies" },
  { command: "npm run <script>", description: "Run a script defined in package.json", sinhala: "package.json හි script එකක් run කරන්න", example: "npm run dev", category: "Scripts" },
  { command: "npm init -y", description: "Initialize a new project without prompts", sinhala: "ප්‍රශ්න කිරීමකින් තොරව නව project එකක් ආරම්භ කරන්න", example: "npm init -y", category: "Project" },
  { command: "npm ci", description: "Clean Install: Install dependencies from package-lock.json", sinhala: "Clean Install: package-lock.json වෙතින් install කරන්න", example: "npm ci", category: "Power User" },
  { command: "npm outdated", description: "Check for outdated packages", sinhala: "කල් ඉකුත් වූ packages පරීක්ෂා කරන්න", example: "npm outdated", category: "Dependencies" },
  { command: "npm audit fix", description: "Scan your project for vulnerabilities and fix them", sinhala: "අවදානම් සඳහා project එක scan කර ඒවා fix කරන්න", example: "npm audit fix --force", category: "Project" },
  { command: "npx <command>", description: "Execute a package without installing it globally", sinhala: "package එකක් global install නොකර execute කරන්න", example: "npx create-react-app my-app", category: "Power User" },
  { command: "pnpm overrides", description: "Force a specific version of a transitive dependency", sinhala: "Transitive dependency එකක නිශ්චිත version එකක් බලකරන්න", example: "pnpm overrides add react@^17.0.0", category: "Power User" },
];

// The main data object that drives the entire UI
const cheatSheetData: Record<string, CheatSheet> = {
  git: {
    label: "Git",
    icon: GitBranch,
    commands: gitCommands,
  },
  linux: {
    label: "Linux",
    icon: Terminal,
    commands: linuxCommands,
  },
  docker: {
    label: "Docker",
    icon: Box,
    commands: dockerCommands,
  },
  npm: {
    label: "npm/pnpm",
    icon: Package,
    commands: npmCommands,
  },
}

export function CheatSheets() {
  const [activeTab, setActiveTab] = useState(Object.keys(cheatSheetData)[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [copied, setCopied] = useState("")
  
  const sheetEntries = Object.entries(cheatSheetData);

  const currentSheet = cheatSheetData[activeTab]
  const currentCommands = currentSheet.commands

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSelectedCategory("all")
    setSearchTerm("")
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(currentCommands.map((cmd) => cmd.category)))
    return ["all", ...cats.sort()]
  }, [currentCommands])

  const filteredCommands = useMemo(() => {
    return currentCommands.filter((cmd) => {
      const matchesSearch =
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.sinhala.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || cmd.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [currentCommands, searchTerm, selectedCategory])

  const copyToClipboard = async (command: string) => {
    const baseCommand = command.replace(/<[^>]*>/g, '').trim()
    await navigator.clipboard.writeText(baseCommand)
    setCopied(command)
    setTimeout(() => setCopied(""), 2000)
  }

  const CommandCard = ({ cmd }: { cmd: CheatSheetItem }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline">{cmd.category}</Badge>
            <code className="bg-muted px-2 py-1 rounded text-sm">{cmd.command}</code>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(cmd.command)}
            className="h-8 w-8"
            aria-label={`Copy command: ${cmd.command}`}
          >
            {copied === cmd.command ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">English</Label>
            <p className="text-sm mt-1">{cmd.description}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">සිංහල</Label>
            <p className="text-sm mt-1 font-sans">{cmd.sinhala}</p>
          </div>
        </div>
        {cmd.example && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <Label className="text-xs font-medium text-muted-foreground">Example</Label>
            <code className="block text-sm mt-1">{cmd.example}</code>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const commonTriggerClasses = "data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=inactive]:bg-transparent text-muted-foreground flex-1 flex items-center gap-2 justify-center";

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          
          {/* 👇 BRO, THIS IS THE NEW RESPONSIVE LAYOUT FOR THE TABS 👇 */}

          {/* Mobile Layout: Two rows, visible only on small screens */}
          <div className="flex flex-col gap-1 md:hidden">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 gap-1">
              {sheetEntries.slice(0, 2).map(([key, { label, icon: Icon }]) => (
                <TabsTrigger key={key} value={key} className={commonTriggerClasses}>
                  <Icon className="w-4 h-4" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 gap-1">
              {sheetEntries.slice(2, 4).map(([key, { label, icon: Icon }]) => (
                <TabsTrigger key={key} value={key} className={commonTriggerClasses}>
                  <Icon className="w-4 h-4" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Desktop Layout: Single row, visible on medium screens and up */}
          <TabsList className="hidden md:grid w-fit grid-cols-4">
            {sheetEntries.map(([key, { label, icon: Icon }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search Input remains the same */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
              {category !== "all" && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {currentCommands.filter((cmd) => cmd.category === category).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {Object.keys(cheatSheetData).map((key) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid gap-4">
              {filteredCommands.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Commands Found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredCommands.map((cmd) => <CommandCard key={cmd.command} cmd={cmd} />)
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}