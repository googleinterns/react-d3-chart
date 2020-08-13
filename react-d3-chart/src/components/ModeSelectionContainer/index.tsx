import React from 'react';
import { Dimensions, ModeTypes, RangeSelectionState } from '../../types';
import { Container } from './styles';
import ModeButton from './ModeButton';

interface SelfProps {
  selectMode: (mode: ModeTypes) => void;
  mode: ModeTypes;
  selection: RangeSelectionState['selection'];
}

type Props = SelfProps & Pick<Dimensions, 'width'>;

const ModeSelectionContainer: React.FC<Props> = ({
  selectMode,
  width,
  mode,
  selection,
}) => {
  return (
    <Container width={width}>
      <ModeButton
        onClick={() => selectMode('intersection')}
        active={mode === 'intersection'}
        text="Zoom & Pan"
      />
      <ModeButton
        onClick={() => selectMode('selection')}
        active={mode === 'selection'}
        text={
          mode === 'selection'
            ? `Selection: ${Math.round(selection[0])}, ${Math.round(
                selection[1]
              )}`
            : 'Range Selection'
        }
      />
    </Container>
  );
};

export default ModeSelectionContainer;
