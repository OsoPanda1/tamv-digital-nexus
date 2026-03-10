import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WikiPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function WikiPage({ title, subtitle, children }: WikiPageProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12 space-y-8"
    >
      <header className="border-b border-border/30 pb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
      </header>

      <div className="prose prose-invert prose-lg max-w-none space-y-8">
        {children}
      </div>
    </motion.article>
  );
}
