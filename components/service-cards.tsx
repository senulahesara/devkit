"use client";
import { motion } from "framer-motion";
import { BookOpen, Code2, FileJson, Layers } from "lucide-react";

const cards = [
    {
        title: "Regex Playground",
        desc: "Test regular expressions in real-time with live matching and highlighting.",
        features: ["Live pattern matching", "Syntax highlighting", "Match groups display"],
        icon: <Code2 className="w-6 h-6 text-blue-400" />,
        hover: "group-hover:border-blue-500/60 group-hover:shadow-blue-500/30",
        link: "/regex-playground",
    },
    {
        title: "JSON/YAML Formatter",
        desc: "Validate and format JSON/YAML with syntax highlighting and error detection.",
        features: ["Syntax validation", "Pretty printing", "Error highlighting"],
        icon: <FileJson className="w-6 h-6 text-green-400" />,
        hover: "group-hover:bg-gradient-to-br group-hover:from-green-500/20 group-hover:to-emerald-600/20",
        link: "/json-formatter",
    },
    {
        title: "Boilerplate Generator",
        desc: "Generate starter templates for popular frameworks and configurations.",
        features: ["Multiple frameworks", "Custom .gitignore", "Ready-to-use configs"],
        icon: <Layers className="w-6 h-6 text-purple-400" />,
        hover: "group-hover:border-purple-500/60 group-hover:shadow-purple-500/30",
        link: "/boilerplate-generator",
    },
    {
        title: "Cheat Sheets",
        desc: "Quick reference for Git, Linux commands, and more in Sinhala/English.",
        features: ["Git commands", "Linux basics", "Bilingual support"],
        icon: <BookOpen className="w-6 h-6 text-orange-400" />,
        hover: "group-hover:border-orange-500/60 group-hover:shadow-orange-500/30",
        link: "/cheat-sheets",
    },
];

export default function ServiceCards() {
    return (
        <div className="flex items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={`group cursor-pointer relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${card.hover}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-white/10">{card.icon}</div>
                            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{card.desc}</p>
                        <ul className="text-gray-400 text-sm space-y-2">
                            {card.features.map((f, j) => (
                                <li key={j} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
