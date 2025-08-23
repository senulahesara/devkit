"use client";

import { BookOpen, CodeXml, FileText, Layers, Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GitHubStarButton } from "./GitHubStarButton";
import { ThemeToggle } from "./theme-toggle";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: { title: string; url: string };
    signup: { title: string; url: string };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "logo",
    title: "DevDeck",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Tools",
      url: "#",
      items: [
        {
          title: "Regex Playground",
          description: "Test regex with live results",
          icon: <CodeXml className="size-5 shrink-0" />,
          url: "/regex",
        },
        {
          title: "JSON/YAML Formatter",
          description: "Format and validate JSON/YAML",
          icon: <FileText className="size-5 shrink-0" />,
          url: "/formatter",
        },
        {
          title: "Boilerplate Generator",
          description: "Generate starter project templates",
          icon: <Layers className="size-5 shrink-0" />,
          url: "/boilerplate",
        },
        {
          title: "Developer Cheat Sheets",
          description: "Quick Git and Linux reference",
          icon: <BookOpen className="size-5 shrink-0" />,
          url: "/cheatsheets",
        },
      ],
    },
    // { title: "PWA", url: "#" },
  ],
}: Navbar1Props) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-background/70">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 lg:py-4">
        {/* Logo */}
        <a href={logo.url} className="flex items-center gap-2">
          <img src="/logo_black.svg" alt={logo.alt} className="h-8 dark:hidden" />
          <img src="/logo.svg" alt={logo.alt} className="h-8 hidden dark:block" />
          <span className="text-lg font-semibold">{logo.title}</span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex lg:items-center lg:gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {menu.map((item) => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex gap-2 items-center">
          <GitHubStarButton />
          <ThemeToggle />
        </div>

        {/* Mobile Menu and Theme Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <SheetHeader>
                <SheetTitle>
                  <a href={logo.url} className="flex items-center gap-2">
                    <img src="/logo_black.svg" alt={logo.alt} className="h-8 dark:hidden" />
                    <img src="/logo.svg" alt={logo.alt} className="h-8 hidden dark:block" />
                    <span className="text-lg font-semibold">{logo.title}</span>
                  </a>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-6 px-4">
                <Accordion type="single" collapsible>
                  {menu.map((item, idx) => (
                    <div key={idx} className="py-1">
                      {renderMobileMenuItem(item)}
                    </div>
                  ))}
                </Accordion>
                <div className="flex flex-row gap-3 items-center">
                  <GitHubStarButton />
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[320px] gap-2 p-2">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <SubMenuLink item={subItem} />
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <a
          href={item.url}
          className="px-3 py-2 text-sm font-medium hover:text-primary"
        >
          {item.title}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title}>
        <AccordionTrigger className="font-medium">{item.title}</AccordionTrigger>
        <AccordionContent className="pl-3 flex flex-col gap-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <a key={item.title} href={item.url} className="text-sm font-medium py-1">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      href={item.url}
      className="flex gap-3 rounded-md p-2 hover:bg-muted transition"
    >
      {item.icon && <div>{item.icon}</div>}
      <div>
        <p className="text-sm font-medium">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
