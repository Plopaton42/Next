export type SplitButtonType = 'primary' | 'secondary' | 'tertiary' | 'outlined';
export type SplitButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface SplitButtonItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SplitButtonProps {
  type?: SplitButtonType;
  size?: SplitButtonSize;
  disabled?: boolean;
  rounded?: boolean;
  items: SplitButtonItem[];
  triggerLabel?: string;
}
