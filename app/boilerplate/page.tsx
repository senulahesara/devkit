import { BoilerplateGenerator } from "@/components/boilerplate-generator"
import { Navbar } from "@/components/navbar"
import { Layers } from "lucide-react"

export default function BoilerplatePage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="min-h-screen mt-10 sm:mt-20">
                <main className="container mx-auto px-2 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
                    <div className="relative w-full max-w-7xl p-4 sm:p-8 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 group">

                        {/* Header */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-2 rounded-xl bg-foreground/10">
                                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                                Boilerplate Generator
                            </h1>
                        </div>
                        <p className="text-black dark:text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                            Generate starter templates, .gitignore files, and configuration files for various project types
                        </p>

                        <BoilerplateGenerator />

                    </div>
                </main>
            </div>
        </div>
    )
}
