"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Particles } from "@/components/ui/particles"
import { cn } from "@/lib/utils";

export function ParticlesDemo() {
  const { theme } = useTheme()
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000")
  }, [theme])

  return (
    <div className="mt-20 relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl px-4">
      
      {/* Badge */}
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>DevDeck</span>
        </AnimatedShinyText>
      </div>

      {/* Heading */}
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-6xl lg:text-8xl font-semibold leading-tight md:leading-none text-transparent dark:from-white dark:to-slate-900/10 mt-6">
        All-in-One Developer Toolkit
      </span>

      {/* Paragraph */}
      <p className="mt-4 max-w-2xl text-center text-sm md:text-base text-gray-600 dark:text-gray-300">
        Essential tools, blazing-fast performance, and offline-ready features—built to streamline your workflow and keep you focused on what matters: writing great code.
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
