"use client"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, FileText, Settings, Package, FileArchive, Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import JSZip from "jszip"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Badge } from "./ui/badge"

// --- Type Definitions ---
interface ProjectConfig { name: string; description: string }
type SelectedFeatures = Record<string, boolean>
type FileGenerator = (config: ProjectConfig, features: SelectedFeatures) => string
interface Addon { id: string; name: string; description: string; files?: Record<string, FileGenerator>; packages?: any }
interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  files: Record<string, FileGenerator>
  addons?: Addon[]
}

// --- Helper to merge package.json properties ---
const generatePackageJson = (base: any, features: SelectedFeatures, addons: any[]) => {
  let pkg = { ...base }
  addons.forEach(addon => {
    if (features[addon.id] && addon.packages) {
      pkg.dependencies = { ...pkg.dependencies, ...addon.packages.dependencies }
      pkg.devDependencies = { ...pkg.devDependencies, ...addon.packages.devDependencies }
      pkg.scripts = { ...pkg.scripts, ...addon.packages.scripts }
    }
  })
  return JSON.stringify(pkg, null, 2)
}

// --- Addons Definitions ---
const commonJsAddons = {
  linter: { id: "linter", name: "ESLint + Prettier", description: "For code linting and formatting.", files: { ".eslintrc.json": () => JSON.stringify({ "extends": ["prettier"] }, null, 2), "prettier.config.js": () => `module.exports = { "semi": true, "singleQuote": true };` }, packages: { devDependencies: { "eslint": "^8", "prettier": "^3", "eslint-config-prettier": "^9" } } },
  prisma: { id: "prisma", name: "Prisma ORM", description: "Next-gen Node.js & TypeScript ORM.", files: { "prisma/schema.prisma": () => `generator client {\n  provider = "prisma-client-js"\n}\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}`, "lib/prisma.ts": () => `import { PrismaClient } from '@prisma/client';\nexport const prisma = new PrismaClient();`, ".env.example": () => `\nDATABASE_URL="postgresql://user:pass@localhost:5432/mydb"` }, packages: { dependencies: { "@prisma/client": "latest" }, devDependencies: { "prisma": "latest" }, scripts: { "db:push": "prisma db push" } } },
  docker: { id: "docker", name: "Dockerfile", description: "Containerize your application.", files: { "Dockerfile": () => `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nCMD ["npm", "start"]` } },
};

// --- Full Template Definitions with Addons ---
const templates: ProjectTemplate[] = [
  {
    id: "nextjs",
    name: "Next.js",
    description: "React framework with TypeScript & Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    addons: [
      { ...commonJsAddons.linter, files: { ".eslintrc.json": () => JSON.stringify({ extends: ["next/core-web-vitals", "prettier"] }, null, 2) } },
      commonJsAddons.prisma,
      { id: "nextauth", name: "NextAuth.js", description: "Authentication for Next.js.", files: { "app/api/auth/[...nextauth]/route.ts": () => `import NextAuth from "next-auth"\nimport GithubProvider from "next-auth/providers/github"\n\nexport const authOptions = {\n  providers: [\n    GithubProvider({\n      clientId: process.env.GITHUB_ID!,\n      clientSecret: process.env.GITHUB_SECRET!,\n    }),\n  ],\n}\n\nconst handler = NextAuth(authOptions)\n\nexport { handler as GET, handler as POST }`, ".env.example": () => `\nGITHUB_ID=\nGITHUB_SECRET=\nNEXTAUTH_SECRET=\nNEXTAUTH_URL=http://localhost:3000` }, packages: { dependencies: { "next-auth": "latest" } } },
      commonJsAddons.docker
    ],
    files: {
      "package.json": (config, features) => generatePackageJson({ name: config.name, private: true, scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" }, dependencies: { react: "^18", "react-dom": "^18", next: "14.2.3" }, devDependencies: { typescript: "^5", "@types/node": "^20", "@types/react": "^18", "@types/react-dom": "^18", postcss: "^8", tailwindcss: "^3.4.1", eslint: "^8", "eslint-config-next": "14.2.3" } }, features, templates.find(t => t.id === 'nextjs')!.addons!),
      ".gitignore": () => `.next/\nout/\nnode_modules/\n.env*.local`,
      "README.md": (c, f) => `# ${c.name}\n${c.description}\n## Getting Started\n\`\`\`bash\nnpm install && npm run dev\n\`\`\` ${f.prisma ? '\n### Prisma Setup\n1. Update `.env.local` with your database URL.\n2. Run `npx prisma db push`' : ''}`,
      "tsconfig.json": () => JSON.stringify({ compilerOptions: { lib: ["dom", "esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", jsx: "preserve", paths: { "@/*": ["./*"] } }, include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"], exclude: ["node_modules"] }, null, 2),
      "tailwind.config.ts": () => `import type { Config } from "tailwindcss";\nconst config: Config = { content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: {} }, plugins: [] };\nexport default config;`,
      "app/globals.css": () => `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
      "app/layout.tsx": c => `import "./globals.css";\nexport const metadata = { title: "${c.name}" };\nexport default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }`,
      "app/page.tsx": c => `export default function Home() { return <main className="flex min-h-screen flex-col items-center justify-center"><h1 className="text-4xl font-bold">Welcome to ${c.name}</h1></main>; }`,
    },
  },
  {
    id: "sveltekit",
    name: "SvelteKit",
    description: "Cybernetically enhanced web apps",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    addons: [commonJsAddons.linter, { ...commonJsAddons.prisma, files: { ...commonJsAddons.prisma.files, "src/lib/prisma.ts": commonJsAddons.prisma.files["lib/prisma.ts"] } }, commonJsAddons.docker],
    files: {
      "package.json": (config, features) => generatePackageJson({ name: config.name, private: true, scripts: { dev: "vite dev", build: "vite build", preview: "vite preview" }, devDependencies: { "@sveltejs/adapter-auto": "^3.0.0", "@sveltejs/kit": "^2.0.0", vite: "^5.0.3", svelte: "^4.2.7" }, type: "module" }, features, templates.find(t => t.id === 'sveltekit')!.addons!),
      ".gitignore": () => `.svelte-kit/\nbuild/\nnode_modules/\n.env*`,
      "README.md": c => `# ${c.name}\n\n${c.description}\n\n\`\`\`bash\nnpm install && npm run dev\n\`\`\``,
      "src/routes/+page.svelte": c => `<script lang="ts">\n import './styles.css';\n</script>\n<h1 class="text-4xl font-bold text-center mt-10">Welcome to ${c.name}</h1>`,
      "src/routes/styles.css": () => `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
      "tailwind.config.js": () => `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./src/**/*.{html,js,svelte,ts}'],\n  theme: { extend: {} },\n  plugins: [],\n};`,
      "postcss.config.js": () => `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };`,
      "svelte.config.js": () => `import adapter from '@sveltejs/adapter-auto';\nimport { vitePreprocess } from '@sveltejs/vite-plugin-svelte';\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n  preprocess: vitePreprocess(),\n  kit: { adapter: adapter() }\n};\n\nexport default config;`
    },
  },
  {
    id: "nodejs",
    name: "Node.js Express",
    description: "Express API with TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    addons: [commonJsAddons.linter, commonJsAddons.prisma, commonJsAddons.docker],
    files: {
      "package.json": (config, features) => generatePackageJson({ name: config.name, main: "dist/index.js", scripts: { start: "node dist/index.js", dev: "ts-node-dev src/index.ts", build: "tsc" }, dependencies: { cors: "^2.8.5", dotenv: "^16.3.1", express: "^4.18.2" }, devDependencies: { "@types/cors": "^2.8.13", "@types/express": "^4.17.17", "@types/node": "^20.4.5", "ts-node-dev": "^2.0.0", typescript: "^5.1.6" } }, features, templates.find(t => t.id === 'nodejs')!.addons!),
      ".gitignore": () => `node_modules/\ndist/\n.env`,
      "README.md": c => `# ${c.name}\n\n${c.description}\n\n\`\`\`bash\nnpm install && npm run dev\n\`\`\``,
      "tsconfig.json": () => JSON.stringify({ compilerOptions: { target: "ES6", module: "commonjs", outDir: "./dist", rootDir: "./src", strict: true, esModuleInterop: true } }, null, 2),
      ".env.example": () => `PORT=8080`,
      "src/app.ts": () => `import express from 'express';\nimport cors from 'cors';\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.get('/', (req, res) => res.json({ message: 'API is running!' }));\nexport default app;`,
      "src/index.ts": () => `import 'dotenv/config';\nimport app from './app';\nconst port = process.env.PORT || 8080;\napp.listen(port, () => console.log(\`Server listening on port \${port}\`));`,
    },
  },
  {
    id: "laravel",
    name: "PHP Laravel",
    description: "The PHP framework for web artisans",
    icon: "https://static.cdnlogo.com/logos/l/23/laravel.svg",
    addons: [
      { id: "pint", name: "Pint", description: "PHP code style fixer.", files: { "pint.json": () => JSON.stringify({ preset: "laravel" }, null, 2) }, packages: { devDependencies: { "laravel/pint": "^1.0" } } },
      { id: "docker", name: "Dockerfile", description: "Containerize your application.", files: { "Dockerfile": () => `FROM php:8.2-fpm\n# Basic setup...\nCOPY . /var/www\n# You'll need to configure Nginx/Apache` } },
    ],
    files: {
      "composer.json": (config, features) => generatePackageJson({ name: `acme/${config.name}`, type: "project", description: config.description, require: { php: "^8.1", "laravel/framework": "^10.10" } }, features, templates.find(t => t.id === 'laravel')!.addons!),
      ".gitignore": () => `/vendor/\n.env`,
      "README.md": c => `# ${c.name}\n\`\`\`bash\ncomposer install && cp .env.example .env && php artisan key:generate && php artisan serve\n\`\`\``,
    },
  },
  {
    id: "django",
    name: "Python Django",
    description: "The web framework for perfectionists",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    addons: [
      { id: "linter", name: "Black + Flake8", description: "Code formatting and linting.", files: { "pyproject.toml": () => `[tool.black]\nline-length = 88`, ".flake8": () => `[flake8]\nignore = E203, E501, W503` } },
      { id: "postgres", name: "PostgreSQL", description: "Switch from SQLite to PostgreSQL." },
      { id: "docker", name: "Docker Compose", description: "Containerize with web and DB services.", files: { "Dockerfile": c => `FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`, "docker-compose.yml": c => `version: '3.8'\nservices:\n  web:\n    build: .\n    command: python manage.py runserver 0.0.0.0:8000\n    volumes:\n      - .:/app\n    ports:\n      - "8000:8000"\n    depends_on:\n      - db\n    environment:\n      - DATABASE_URL=postgres://user:password@db:5432/dbname\n  db:\n    image: postgres:15\n    environment:\n      - POSTGRES_DB=dbname\n      - POSTGRES_USER=user\n      - POSTGRES_PASSWORD=password` } },
    ],
    files: {
      "requirements.txt": (c, f) => `Django>=4.0\npython-dotenv>=0.20${f.postgres ? '\ndj-database-url>=2.0\npsycopg2-binary>=2.9' : ''}${f.linter ? '\nblack>=23.0\nflake8>=6.0' : ''}`,
      ".gitignore": () => `__pycache__/\n*.pyc\n.env\ndb.sqlite3`,
      "README.md": c => `# ${c.name}\n\`\`\`bash\npip install -r requirements.txt && python manage.py migrate && python manage.py runserver\n\`\`\``,
      ".env.example": (c, f) => `SECRET_KEY='change-me'\nDEBUG=True${f.postgres ? '\nDATABASE_URL=postgres://user:password@localhost/dbname' : ''}`,
      "manage.py": c => `#!/usr/bin/env python\nimport os, sys\nif __name__ == "__main__":\n    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "${c.name}.settings")\n    from django.core.management import execute_from_command_line\n    execute_from_command_line(sys.argv)`,
      "${config.name}/settings.py": (c, f) => `from pathlib import Path\nimport os\nfrom dotenv import load_dotenv\nload_dotenv()\nBASE_DIR = Path(__file__).resolve().parent.parent\nSECRET_KEY = os.getenv('SECRET_KEY')\nDEBUG = os.getenv('DEBUG') == 'True'\nALLOWED_HOSTS = []\nINSTALLED_APPS = ['django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes', 'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles']\nROOT_URLCONF = '${c.name}.urls'\nWSGI_APPLICATION = '${c.name}.wsgi.application'\n${f.postgres ? "import dj_database_url\nDATABASES = {'default': dj_database_url.config(default=f'sqlite:///{BASE_DIR / 'db.sqlite3'}')}" : "DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}"}`,
    },
  },
  {
    id: "java-spring",
    name: "Java Spring Boot",
    description: "Enterprise-grade Java applications",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    addons: [
      { id: "devtools", name: "DevTools", description: "For automatic restarts and live reload." },
      { id: "postgres", name: "PostgreSQL", description: "Add PostgreSQL JDBC driver." },
      { id: "docker", name: "Dockerfile", description: "Containerize with a multi-stage build.", files: { "Dockerfile": () => `FROM openjdk:17-jdk-slim as build\nWORKDIR /app\nCOPY . .\nRUN ./mvnw package -DskipTests\n\nFROM openjdk:17-jre-slim\nWORKDIR /app\nCOPY --from=build /app/target/*.jar app.jar\nENTRYPOINT ["java", "-jar", "app.jar"]` } },
    ],
    files: {
      "pom.xml": (c, f) => `<?xml version="1.0" encoding="UTF-8"?>\n<project ...>\n\t<groupId>com.example</groupId>\n\t<artifactId>${c.name}</artifactId>\n\t<version>0.0.1</version>\n\t<dependencies>\n\t\t<dependency>\n\t\t\t<groupId>org.springframework.boot</groupId>\n\t\t\t<artifactId>spring-boot-starter-web</artifactId>\n\t\t</dependency>${f.devtools ? `\n\t\t<dependency>\n\t\t\t<groupId>org.springframework.boot</groupId>\n\t\t\t<artifactId>spring-boot-devtools</artifactId>\n\t\t\t<scope>runtime</scope>\n\t\t</dependency>` : ''}${f.postgres ? `\n\t\t<dependency>\n\t\t\t<groupId>org.postgresql</groupId>\n\t\t\t<artifactId>postgresql</artifactId>\n\t\t\t<scope>runtime</scope>\n\t\t</dependency>` : ''}\n\t</dependencies>\n</project>`,
      "src/main/resources/application.properties": (c, f) => `server.port=8080${f.postgres ? '\nspring.datasource.url=jdbc:postgresql://localhost:5432/db\nspring.datasource.username=user\nspring.datasource.password=pass' : ''}`,
      "README.md": c => `# ${c.name}\n\`\`\`bash\n./mvnw spring-boot:run\n\`\`\``,
    },
  },
];

// --- Main Component ---
export function BoilerplateGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [config, setConfig] = useState<ProjectConfig>({ name: "my-awesome-project", description: "A new project" });
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures>({});
  const [activeFile, setActiveFile] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  useEffect(() => { setSelectedFeatures({}); }, [selectedTemplate]);

  const generatedFiles = useMemo(() => {
    if (!currentTemplate) return {};
    let files: Record<string, string> = {};

    const resolveFilename = (filename: string) => filename.replace(/\${config\.name}/g, config.name);

    // Process base files and addon files
    const allFileGenerators = { ...currentTemplate.files };
    currentTemplate.addons?.forEach(addon => {
      if (selectedFeatures[addon.id] && addon.files) {
        Object.assign(allFileGenerators, addon.files);
      }
    });

    Object.entries(allFileGenerators).forEach(([filename, generator]) => {
      const resolvedName = resolveFilename(filename);
      // Append content for files like .env.example
      if (files[resolvedName] && filename.includes('.env.example')) {
        files[resolvedName] += generator(config, selectedFeatures);
      } else {
        files[resolvedName] = generator(config, selectedFeatures);
      }
    });

    return files;
  }, [currentTemplate, config, selectedFeatures]);

  useEffect(() => {
    const fileKeys = Object.keys(generatedFiles);
    if (fileKeys.length > 0 && !fileKeys.includes(activeFile)) {
      setActiveFile(fileKeys.sort()[0]);
    } else if (fileKeys.length === 0) {
      setActiveFile("");
    }
  }, [generatedFiles, activeFile]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });

  const downloadAsZip = () => {
    const zip = new JSZip();
    Object.entries(generatedFiles).forEach(([filename, content]) => zip.file(filename, content));
    zip.generateAsync({ type: "blob" }).then(content => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content); a.download = `${config.name}.zip`; a.click(); URL.revokeObjectURL(a.href);
    });
  };

  const handleFeatureToggle = (id: string) => setSelectedFeatures(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Choose Template</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {templates.map((t) => <Button key={t.id} variant={selectedTemplate === t.id ? "default" : "outline"} className="justify-start h-auto p-4 text-left" onClick={() => setSelectedTemplate(t.id)}>
                <div className="flex items-center gap-4"><img src={t.icon} alt={`${t.name} logo`} className="w-10 h-10 object-contain" /><div><span className="font-semibold">{t.name}</span><p className="text-xs text-muted-foreground">{t.description}</p></div></div>
              </Button>)}
            </CardContent>
          </Card>
          {currentTemplate?.addons && <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Optional Add-ons</CardTitle><CardDescription>Power-up your project.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {currentTemplate.addons.map(a => <div key={a.id} className="flex items-start space-x-3 rounded-md border p-3">
                <Checkbox id={a.id} checked={!!selectedFeatures[a.id]} onCheckedChange={() => handleFeatureToggle(a.id)} className="mt-1" /><div className="grid gap-1.5 leading-none"><label htmlFor={a.id} className="font-medium">{a.name}</label><p className="text-sm text-muted-foreground">{a.description}</p></div>
              </div>)}
            </CardContent>
          </Card>}
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Project Name</Label><Input id="name" value={config.name} onChange={(e) => setConfig((p) => ({ ...p, name: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} /></div>
              <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={config.description} onChange={(e) => setConfig((p) => ({ ...p, description: e.target.value }))} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center gap-2"><FileText className="w-5 h-5" /> Generated Files</div>{Object.keys(generatedFiles).length > 0 && <Badge variant="secondary">{Object.keys(generatedFiles).length} files</Badge>}</CardTitle><CardDescription>Preview files and download the project.</CardDescription></CardHeader>
            <CardContent>
              {!currentTemplate ? <p className="text-center text-muted-foreground py-8">Select a template to begin</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 max-h-80 overflow-y-auto pr-2 space-y-1 rounded-md border p-2">{Object.keys(generatedFiles).sort().map((filename) => <Button key={filename} variant={activeFile === filename ? "secondary" : "ghost"} className="justify-start w-full text-sm h-8" onClick={() => setActiveFile(filename)}>{filename}</Button>)}</div>
                  <div className="md:col-span-2">{activeFile && generatedFiles[activeFile] ? (<div className="relative rounded-md border bg-background text-sm h-80 overflow-auto">
                    <Button variant="ghost" size="sm" className="absolute top-2 right-2 z-10 h-7" onClick={() => copyToClipboard(generatedFiles[activeFile])}>{copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
                    <SyntaxHighlighter language={"bash"} style={atomDark} customStyle={{ margin: 0, background: "transparent", fontSize: "0.875rem", height: '100%' }} codeTagProps={{ style: { height: '100%' } }} wrapLongLines={true}>{generatedFiles[activeFile]}</SyntaxHighlighter>
                  </div>) : <div className="flex items-center justify-center h-full text-muted-foreground">Select a file to preview</div>}</div>
                </div>
              )}
              {currentTemplate && (<><Separator className="my-4" /><Button onClick={downloadAsZip} className="w-full"><FileArchive className="w-4 h-4 mr-2" />Download Project (.ZIP)</Button></>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}