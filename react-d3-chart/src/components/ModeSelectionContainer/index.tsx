import React from 'react';
import { Dimensions, ModeTypes } from '../types';
import { Container } from './styles';
import ModeButton from './ModeButton';

interface SelfProps {
  selectMode: (mode: ModeTypes) => void;
}

type Props = SelfProps & Pick<Dimensions, 'width'>;

const ModeSelectionContainer: React.FC<Props> = ({ selectMode, width }) => {
  return (
    <Container width={width}>
      <ModeButton
        onClick={() => selectMode('intersection')}
        text="Zoom & Pan"
      />
      <ModeButton
        onClick={() => selectMode('selection')}
        text="Range Selection"
      />
    </Container>
  );
};

export default ModeSelectionContainer;
