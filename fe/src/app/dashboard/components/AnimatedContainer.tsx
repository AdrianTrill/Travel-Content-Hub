'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  trigger?: 'inView' | 'immediate';
}

export default function AnimatedContainer({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up',
  trigger = 'inView'
}: AnimatedContainerProps) {
  const getVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.6,
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

  if (trigger === 'immediate') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={getVariants()}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

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