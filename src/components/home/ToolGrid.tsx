'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ImageIcon,
  Layers,
  FileDown,
  Unlock,
  ImageDown,
  ArrowRight,
} from 'lucide-react';
import { TOOLS } from '@/utils/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ImageIcon,
  Layers,
  FileDown,
  Unlock,
  ImageDown,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function ToolGrid() {
  return (
    <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          All the tools you need
        </h2>
        <p className="text-text-muted mt-3 text-lg">
          Powerful PDF and image processing — completely free and private.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {TOOLS.map((tool) => {
          const Icon = iconMap[tool.icon] || FileDown;

          return (
            <motion.div key={tool.id} variants={itemVariants}>
              <Link href={tool.href} className="block group">
                <div className="relative p-6 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all duration-300 h-full overflow-hidden shadow-xs hover:shadow-md">
                  {/* Background glow on hover */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: tool.color }}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-text mb-2">{tool.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                      Get started <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
