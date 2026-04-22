export type CheckboxState = 'Default' | 'Hover' | 'Focus' | 'Disabled' | 'Error';

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  state?: CheckboxState;
  label?: string;
  secondaryLabel?: string;
  showSecondaryLabel?: boolean;
  helperText?: string;
  showHelper?: boolean;
  errorMessage?: string;
  withContent?: boolean;
}
