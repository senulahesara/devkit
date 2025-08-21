import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"

function StackedCircularFooter() {
  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-8 flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
          </div>

          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <a href="/" className="hover:text-primary">Home</a>
            <a href="/regex" className="hover:text-primary">Regex Playground</a>
            <a href="/formatter" className="hover:text-primary">JSON/YAML Formatter</a>
            <a href="/boilerplate" className="hover:text-primary">Boilerplate Generator</a>
            <a href="/cheatsheets" className="hover:text-primary">Cheat Sheets</a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <a href="https://www.facebook.com/senulahesara1" className="rounded-full cursor-pointer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
            </a>
            <a href="https://github.com/senulahesara" className="rounded-full cursor-pointer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Github className="h-4 w-4" />
                <span className="sr-only">Github</span>
              </Button>
            </a>
            <a href="https://www.instagram.com/senula.hesara" className="rounded-full cursor-pointer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/senulahesara" className="rounded-full cursor-pointer">
              <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 DevDeck. Open Source. Built for Developers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }