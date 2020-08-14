// ModeButton Component
/**
 * File containing the ModeChange Button Component
 * @packageDocumentation
 */
import React from 'react';
import { Button } from '@material-ui/core';
import { ButtonStyle } from './styles';

/** All ModeButton Props */
export interface ModeButtonProps {
  /** Callback to fire on button click */
  onClick: () => void;
  /** Button display text */
  text: string;
  /** Is this button's mode change currently active in the parent graph */
  active: boolean;
}

/** ModeButton Component */
const ModeButton: React.FC<ModeButtonProps> = ({ onClick, text, active }) => (
  <Button
    style={ButtonStyle}
    variant={active ? 'contained' : 'outlined'}
    color="primary"
    onClick={onClick}
  >
    {text}
  </Button>
);

export default ModeButton;
