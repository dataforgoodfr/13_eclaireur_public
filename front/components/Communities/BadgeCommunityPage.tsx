// Assuming you're using lucide-react for the FileText icon
import type React from 'react';

import { FileText } from 'lucide-react';

// Define a custom type for icon props
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}
interface BadgeProps {
  text: string;
  icon?: React.ComponentType<IconProps>;
  iconSize?: number;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  icon: Icon = FileText,
  iconSize = 12,
  className = '',
}) => {
  const baseClasses =
    'flex items-center h-8 md:h-10 gap-2 px-4 mt-2 text-xs font-bold rounded-[80px] sm:text-sm sm:mt-0 bg-brand-2 text-primary';

  return (
    <span className={`${baseClasses} ${className}`}>
      <Icon size={iconSize} />
      {text}
    </span>
  );
};

export default Badge;
