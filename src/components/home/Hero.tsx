'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, Lock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float-delayed" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="text-center max-w-3xl mx-auto">
          {/* Privacy Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-accent mb-8"
          >
            <Lock className="w-3 h-3" />
            100% Client-Side · Zero Uploads · Privacy First
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Process Files.{' '}
            <span className="gradient-text">Privately.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-text-muted mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            All-in-one PDF & image tools that run entirely in your browser.
            No uploads. No servers. No compromises.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold font-heading text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              Explore Tools
              <ArrowDown className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Shield className="w-4 h-4 text-accent" />
              Files never leave your device
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
