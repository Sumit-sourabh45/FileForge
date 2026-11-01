'use client';

import { motion } from 'framer-motion';
import { Shield, ServerOff, EyeOff } from 'lucide-react';

const features = [
  {
    icon: ServerOff,
    title: 'No Uploads',
    description: 'Files are processed locally in your browser. Nothing is sent to any server — ever.',
  },
  {
    icon: Shield,
    title: 'No Servers',
    description: 'Zero backend infrastructure. Every operation runs on your device using browser APIs.',
  },
  {
    icon: EyeOff,
    title: 'No Tracking',
    description: 'No analytics, no cookies, no telemetry. Your documents remain completely private.',
  },
];

export default function PrivacySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface to-accent/5" />
        <div className="absolute inset-0 border border-border rounded-3xl" />

        <div className="relative px-8 py-16 md:px-16">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 mb-4"
            >
              <Shield className="w-8 h-8 text-accent" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold">Privacy by Design</h2>
            <p className="text-text-muted mt-3 text-lg max-w-xl mx-auto">
              Your files are processed locally in your browser and never uploaded to any server.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl glass shadow-xs"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
