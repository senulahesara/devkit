"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Code2, FileJson, Layers } from "lucide-react";
import { BorderBeam } from "./border-beam";

const cards = [
  {
    title: "Regex Playground",
    desc: "Test regular expressions in real-time with live matching and highlighting.",
    features: [
      "Live Real-Time Pattern Matching",
      "Interactive Regex Flags",
      "Instant Regex Validation",
      "Live Substitution Preview",
      "Capture Group References",
    ],
    icon: <Code2 className="w-6 h-6 text-blue-400" />,
    hover: "group-hover:border-blue-500/60 group-hover:shadow-blue-500/30",
    link: "/regex",
  },
  {
    title: "JSON/YAML Formatter",
    desc: "Validate and format JSON/YAML with syntax highlighting and error detection.",
    features: [
      "Live Syntax Validation",
      "Detailed Error Reporting",
      "JSON Minification",
      "Customizable Indentation",
      "Advanced Syntax Highlighting",
      "Fetch Data from URL",
    ],
    icon: <FileJson className="w-6 h-6 text-green-400" />,
    hover:
      "group-hover:bg-gradient-to-br group-hover:from-green-500/20 group-hover:to-emerald-600/20",
    link: "/formatter",
  },
  {
    title: "Boilerplate Generator",
    desc: "Generate starter templates for popular frameworks and configurations.",
    features: [
      "Wide Framework Support",
      "Intelligent Add-on System",
      "Dynamic File Generation",
      "Developer-Focused UI/UX",
    ],
    icon: <Layers className="w-6 h-6 text-purple-400" />,
    hover: "group-hover:border-purple-500/60 group-hover:shadow-purple-500/30",
    link: "/boilerplate",
  },
  {
    title: "Cheat Sheets",
    desc: "Quick reference for Git, Linux commands, and more in Sinhala/English.",
    features: [
      "Multiple Cheat Sheets",
      "Bilingual Support",
      "Comprehensive Command Coverage",
      "Detailed Command Breakdowns",
      "Instant Full-Text Search",
      "Category-Based Filtering",
    ],
    icon: <BookOpen className="w-6 h-6 text-orange-400" />,
    hover: "group-hover:border-orange-500/60 group-hover:shadow-orange-500/30",
    link: "/cheatsheets",
  },
];

export default function ServiceCards() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl items-stretch">
        {cards.map((card, i) => (
          <Link key={i} href={card.link} className="block h-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`group cursor-pointer relative p-6 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden ${card.hover}`}
            >
              {/* Magic UI Border Beam: black in light mode, white in dark mode */}
              <BorderBeam className="dark:hidden" colorFrom="#000000" colorTo="#000000" />
              <BorderBeam className="hidden dark:block" colorFrom="#ffffff" colorTo="#ffffff" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-foreground/10">{card.icon}</div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {card.title}
                </h3>
              </div>
              <p className="text-black dark:text-gray-300 text-sm mb-4">{card.desc}</p>

              {/* Features grow to push bottom evenly */}
              <ul className="text-black dark:text-gray-400 text-sm space-y-2 flex-grow">
                {card.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-foreground/40 dark:bg-gray-400 rounded-full"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
