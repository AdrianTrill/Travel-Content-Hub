'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function AnimatedContainer({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up' 
}: AnimatedContainerProps) {
  const getVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: delay
        }
      }
    };

    switch (direction) {
      case 'up':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: 30 },
          visible: { ...baseVariants.visible, y: 0 }
        };
      case 'down':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: -30 },
          visible: { ...baseVariants.visible, y: 0 }
        };
      case 'left':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: 30 },
          visible: { ...baseVariants.visible, x: 0 }
        };
      case 'right':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: -30 },
          visible: { ...baseVariants.visible, x: 0 }
        };
      default:
        return baseVariants;
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
} 