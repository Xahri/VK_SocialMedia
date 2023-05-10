'use client'
export const revalidate = 0
import React, { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  padding?: boolean;
};

export default function Card({ children, padding = true }: CardProps) {
  let cardStyle = 'bg-[#242424] shadow-md rounded-md mb-5';
  if (padding) {
    cardStyle += ' p-4';
  }
  return (
    <div className={cardStyle}>
      {children}
    </div>
  );
}
