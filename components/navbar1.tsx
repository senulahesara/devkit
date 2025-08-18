"use client";

import { Book, BookOpen, CodeXml, FileText, Layers, Menu, Sunset, Trees, Zap } from "lucide-react";

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

const Navbar1 = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Tools",
      url: "#",
      items: [
        {
          title: "Regex Playground",
          description: "Test and debug regular expressions with real-time matching",
          icon: <CodeXml className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "JSON/YAML Formatter",
          description: "Format, validate and beautify JSON and YAML data",
          icon: <FileText className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Boilerplate Generator",
          description: "Generate starter templates for various project types",
          icon: <Layers className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Developer Cheat Sheets",
          description: "Quick reference for Git commands and Linux basics",
          icon: <BookOpen className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
  ],

  auth = {
    login: { title: "Login", url: "#" },
    signup: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-white/70 dark:bg-background">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 lg:py-4">
        {/* Logo */}
        <a href={logo.url} className="flex items-center gap-2">
          <img src={logo.src} alt={logo.alt} className="h-8 dark:invert" />
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

        {/* Auth Buttons */}
        <div className="hidden lg:flex gap-2">
          
<GitHubStarButton />


          
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
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
                    <img src={logo.src} alt={logo.alt} className="h-8 dark:invert" />
                    <span className="font-semibold">{logo.title}</span>
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

                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <a href={auth.login.url}>{auth.login.title}</a>
                  </Button>
                  <Button asChild>
                    <a href={auth.signup.url}>{auth.signup.title}</a>
                  </Button>
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
        <AccordionTrigger className="font-medium">
          {item.title}
        </AccordionTrigger>
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

export { Navbar1 };
