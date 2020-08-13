import React from 'react';
import { Button } from '@material-ui/core';
import { ButtonStyle } from './styles';

interface ModeButtonProps {
  onClick: () => void;
  text: string;
  active: boolean;
}

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
