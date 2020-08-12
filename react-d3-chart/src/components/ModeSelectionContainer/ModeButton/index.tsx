import React from 'react';
import { Button } from '@material-ui/core';
import { ButtonStyle } from './styles';

interface ModeButtonProps {
  onClick: () => void;
  text: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ onClick, text }) => (
  <Button
    style={ButtonStyle}
    variant="contained"
    color="primary"
    onClick={onClick}
  >
    {text}
  </Button>
);

export default ModeButton;
