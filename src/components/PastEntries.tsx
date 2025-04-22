'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useId } from 'react';

export default function PastEntries({
  entries,
}: {
  entries: { date: string; entry: string }[];
}) {
  const [activeEntry, setActiveEntry] = useState<{ date: string; entry: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  return (
    <div>
      <h2 className="text-xl font-bold mt-8 mb-4">Past Journal Entries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <motion.div
            layoutId={`card-${entry.date}-${id}`}
            key={`card-${entry.date}-${id}`}
            className="p-4 flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl border cursor-pointer"
          >
            <div>
              <motion.h3
                layoutId={`title-${entry.date}-${id}`}
                className="font-medium text-neutral-800 dark:text-neutral-200"
              >
                {entry.date}
              </motion.h3>
              <motion.p
                layoutId={`description-${entry.entry}-${id}`}
                className="text-neutral-600 dark:text-neutral-400 mt-2"
              >
                {entry.entry.slice(0, 50)}...
              </motion.p>
            </div>
            <Button
              onClick={() => setActiveEntry(entry)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              View
            </Button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeEntry && (
          <div className="fixed inset-0 grid place-items-center z-[100] bg-black/50">
            <motion.div
              layoutId={`card-${activeEntry.date}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <motion.h3
                  layoutId={`title-${activeEntry.date}-${id}`}
                  className="font-bold text-neutral-700 dark:text-neutral-200 text-xl"
                >
                  {activeEntry.date}
                </motion.h3>
                <motion.p
                  layoutId={`description-${activeEntry.entry}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 mt-4"
                >
                  {activeEntry.entry}
                </motion.p>
              </div>
              <Button
                onClick={() => setActiveEntry(null)}
                className="bg-red-500 text-white px-4 py-2 rounded m-4 self-end"
              >
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}