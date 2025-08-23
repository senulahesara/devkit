"use client"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Particles } from "@/components/ui/particles"
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { theme } = useTheme()
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000")
  }, [theme])

  return (
    <div className="mt-20 relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background px-4">

      {/* Badge */}
      <div
        className={cn(
          "group rounded-full border border-border bg-secondary text-base text-black dark:text-white transition-all ease-in hover:cursor-pointer hover:bg-muted dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>DevDeck</span>
        </AnimatedShinyText>
      </div>

      {/* Heading */}
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-700/80 dark:from-white dark:to-slate-900/10 bg-clip-text text-center text-4xl md:text-6xl lg:text-8xl font-semibold leading-tight md:leading-none text-transparent mt-6">
        All-in-One Developer Toolkit
      </span>

      {/* Paragraph */}
      <p className="mt-4 max-w-2xl text-center text-sm md:text-base text-black/70 dark:text-gray-300">
        Essential tools, blazing-fast performance, and offline-ready features-built to streamline your workflow and keep you focused on what matters: writing great code.
      </p>

      {/* Background Particles */}
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  )
}
