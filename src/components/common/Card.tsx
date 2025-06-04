import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  variant?: 'default' | 'glass';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  interactive = false,
  variant = 'default'
}) => {
  const baseClasses = variant === 'glass' 
    ? 'glass-card rounded-xl overflow-hidden' 
    : 'bg-white rounded-xl shadow-lg overflow-hidden';
    
  const interactiveClasses = interactive 
    ? 'cursor-pointer hover-scale' 
    : '';
  
  return (
    <motion.div
      className={`${baseClasses} ${interactiveClasses} ${className} h-full flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 shadow-xl hover:shadow-2xl border-2 border-blue-900 hover:border-pink-900 transition-all duration-300`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
};

export default Card;