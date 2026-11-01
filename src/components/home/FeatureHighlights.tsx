'use client';

import { motion } from 'framer-motion';
import { Zap, Lock, Gift } from 'lucide-react';

const highlights = [
  {
    icon: Zap,
    title: 'Blazing Fast',
    description: 'Instant processing powered by modern browser APIs and Web Workers.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Lock,
    title: 'Military-Grade Privacy',
    description: 'Your sensitive documents never leave your device. Period.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Gift,
    title: 'Completely Free',
    description: 'No subscriptions, no limits, no watermarks. All tools are free forever.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export default function FeatureHighlights() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
