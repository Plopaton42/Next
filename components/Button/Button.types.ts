export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'ghost' | 'inverted';
export type ButtonIntent = 'default' | 'destructive' | 'alternative';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ButtonTag = 'button' | 'a';
export type ButtonNativeType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  type?: ButtonType;
  intent?: ButtonIntent;
  size?: ButtonSize;
  disabled?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  tag?: ButtonTag;
  nativeType?: ButtonNativeType;
}
