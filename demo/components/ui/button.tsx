import React from 'react';

const variants = {
  default: 'bg-white text-black hover:bg-neutral-200',
  secondary: 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-600',
  outline: 'border border-neutral-600 bg-transparent hover:bg-neutral-800 text-white',
  ghost: 'hover:bg-neutral-800 text-neutral-200',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  link: 'text-neutral-300 underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button };
