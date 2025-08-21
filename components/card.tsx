'use client';
import { Zap, Fingerprint, Smartphone, Globe, Database, Clock4 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FeatureCard } from './grid-feature-cards';

const features = [
    {
        title: 'Lightning Fast',
        icon: Zap,
        description: 'All tools run locally in your browser. No server requests, no waiting times.',
    },
    {
        title: 'Privacy First',
        icon: Fingerprint,
        description: 'Your data never leaves your device. No tracking, no analytics, no data collection.',
    },
    {
        title: 'PWA Ready',
        icon: Smartphone,
        description: "Progressive Web App that works even when you're offline. Install it like a native app.",
    },
    {
        title: 'No Login Required',
        icon: Globe,
        description: 'Jump straight into productivity. No accounts, no passwords, no barriers.',
    },
    {
        title: 'Works Offline',
        icon: Database,
        description: 'Full functionality without internet connection. Perfect for remote development.',
    },
    {
        title: 'Always Available',
        icon: Clock4,
        description: '24/7 availability with zero downtime. Your tools are always ready when you are.',
    },
];

export default function Cards() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
                <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
                    Why Developers Choose DevDeck
                </h2>
                <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
                    A toolkit designed with developers in mind—fast, secure, and always at your fingertips. Every feature is crafted to simplify your workflow and give you the freedom to code without distractions.</p>

                <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

type ViewAnimationProps = {
    delay?: number;
    className?: React.ComponentProps<typeof motion.div>['className'];
    children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
