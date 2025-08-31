import React from 'react';
import { 
  Cigarette, 
  Wine, 
  Gamepad2, 
  Smartphone, 
  Utensils,
  Plus,
  Eye,
  Hand
} from 'lucide-react-native';

export const habitCategories = [
  { id: 'smoking', icon: 'cigarette', name: 'smoking' },
  { id: 'alcohol', icon: 'wine', name: 'alcohol' },
  { id: 'gaming', icon: 'gamepad', name: 'gaming' },
  { id: 'porn', icon: 'eye', name: 'porn' },
  { id: 'social-media', icon: 'smartphone', name: 'socialMedia' },
  { id: 'junk-food', icon: 'utensils', name: 'junkFood' },
  { id: 'nail-biting', icon: 'hand', name: 'nailBiting' },
  { id: 'custom', icon: 'plus', name: 'custom' },
];

export const getHabitIcon = (iconName: string) => {
  const iconProps = { size: 24, color: '#3b82f6' };
  
  switch (iconName) {
    case 'cigarette':
      return (props: any) => <Cigarette {...iconProps} {...props} />;
    case 'wine':
      return (props: any) => <Wine {...iconProps} {...props} />;
    case 'gamepad':
      return (props: any) => <Gamepad2 {...iconProps} {...props} />;
    case 'eye':
      return (props: any) => <Eye {...iconProps} {...props} />;
    case 'smartphone':
      return (props: any) => <Smartphone {...iconProps} {...props} />;
    case 'utensils':
      return (props: any) => <Utensils {...iconProps} {...props} />;
    case 'hand':
      return (props: any) => <Hand {...iconProps} {...props} />;
    case 'plus':
    default:
      return (props: any) => <Plus {...iconProps} {...props} />;
  }
};