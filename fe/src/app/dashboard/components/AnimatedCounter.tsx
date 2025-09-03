'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
  trigger?: 'inView' | 'immediate';
}

export default function AnimatedCounter({ value, duration = 2, className = '', trigger = 'inView' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const previousValueRef = useRef<number>(0);
  const isInitialRenderRef = useRef(true);

  useEffect(() => {
    const shouldAnimate = trigger === 'immediate' || isInView;
    if (shouldAnimate) {
      let numericValue: number;
      
      if (typeof value === 'string') {
        // Extract just the number part, handling decimals
        const match = value.match(/[\d.]+/);
        numericValue = match ? parseFloat(match[0]) : 0;
      } else {
        numericValue = value;
      }

      // On first render or page refresh, start from 0
      // On subsequent updates, start from previous value
      const startValue = isInitialRenderRef.current ? 0 : previousValueRef.current;
      isInitialRenderRef.current = false;
      
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = startValue + (numericValue - startValue) * easeOutQuart;
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure we reach the final value exactly
          setCount(numericValue);
          previousValueRef.current = numericValue;
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration, trigger]);

  // Ensure we always show the final value after animation completes
  useEffect(() => {
    if (count > 0 && count < parseFloat(value.toString().match(/[\d.]+/)?.[0] || '0')) {
      const timer = setTimeout(() => {
        if (typeof value === 'string') {
          const match = value.match(/[\d.]+/);
          const numericValue = match ? parseFloat(match[0]) : 0;
          setCount(numericValue);
          previousValueRef.current = numericValue;
        } else {
          setCount(value);
          previousValueRef.current = value;
        }
      }, duration * 1000 + 100);
      return () => clearTimeout(timer);
    }
  }, [count, value, duration]);

  // Format the display value with original formatting
  const formatValue = (num: number) => {
    if (typeof value === 'string') {
      // Format the number to match the original precision
      let formattedNum: string;
      
      if (value.includes('.')) {
        // If original has decimals, show up to 1 decimal place during animation
        formattedNum = num.toFixed(1);
      } else {
        // If original is whole number, show as whole number
        formattedNum = Math.floor(num).toString();
      }
      
      // Replace the number part while keeping the original format
      return value.replace(/[\d.]+/, formattedNum);
    }
    return num.toString();
  };

  return (
    <span ref={ref} className={className}>
      {count > 0 ? formatValue(count) : formatValue(0)}
    </span>
  );
} 