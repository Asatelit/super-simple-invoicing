import React from 'react';
import clsx from 'clsx';
import { Chip, ChipProps } from '@material-ui/core';

export type StatusChipProps = ChipProps & {
  label: string;
  status: 'COMPLETED' | 'SENT' | 'DRAFT' | string;
};

export const StatusChip = ({ status, label, ...props }: StatusChipProps) => {
  const background = clsx({
    green: status === 'COMPLETED',
    orange: status === 'SENT',
    yellowgreen: status === 'DRAFT',
  });
  return (
    <Chip {...props} label={`${label.charAt(0)}${label.substring(1).toLowerCase()}`} style={{ background }} />
  );
};
