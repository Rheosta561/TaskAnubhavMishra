'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './Dashboard';

export default function DashboardWrapper() {
  const [step, setStep] = useState(0); 

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 0),      
      setTimeout(() => setStep(2), 1000),   
      setTimeout(() => setStep(3), 2000),   
      setTimeout(() => setStep(4), 3500),   
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (step === 4) return <Dashboard />;

  return (
    <div className="h-full w-full border ">
      <AnimatePresence>
        <motion.div
          key="intro"
          className="absolute inset-0 flex flex-col items-center justify-center bg-background "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {step == 1 && (
            <motion.h1
              className="text-3xl font-semibold mb-4"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0,1], y: 0 }}
              
              transition={{ duration: 2 }}
            >
              Hi there 
            </motion.h1>
          )}

          {step == 2 && (
            <motion.h2
              className="text-4xl font-bold text-primary mb-2"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Mwave
            </motion.h2>
          )}

          {step == 3 && (
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your Finance Tracker
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
      {step===4 && <Dashboard/>}
    </div>
  );
}
