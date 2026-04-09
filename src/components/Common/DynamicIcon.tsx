import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

/**
 * A helper component to render a Lucide icon by name.
 * Used for mapping icons stored in data files (e.g. diseases, seasonal guide).
 */
export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Map our data keywords to Lucide component names
  const iconMap: Record<string, keyof typeof LucideIcons> = {
    'leaf': 'Leaf',
    'alert-circle': 'AlertCircle',
    'check-circle': 'CheckCircle2',
    'zap': 'Zap',
    'activity': 'Activity',
    'flame': 'Flame',
    'sprout': 'Sprout',
    'sun': 'Sun',
    'thermometer': 'Thermometer',
    'cloud-rain': 'CloudRain',
    'cloud-lightning': 'CloudLightning',
    'bug': 'Bug',
    'clipboard': 'ClipboardList',
    'tractor': 'Tractor',
    'bar-chart': 'BarChart3',
    'search': 'Search',
    'calendar': 'Calendar',
    'pill': 'Pill',
    'eye': 'Eye',
    'camera': 'Camera',
    'alert-triangle': 'AlertTriangle',
    'shield-check': 'ShieldCheck',
  };

  const IconComponent = LucideIcons[iconMap[name]] as React.FC<LucideProps>;

  if (!IconComponent) {
    // Fallback icon if name is not mapped
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};
