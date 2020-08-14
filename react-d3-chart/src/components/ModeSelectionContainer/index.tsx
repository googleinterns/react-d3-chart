// ModeSelectionContainer Component
/**
 * File containing the button container to switch graph modes
 * @packageDocumentation
 */
import React from 'react';
import {
  Dimensions,
  ModeTypeStateManagement,
  RangeSelectionState,
} from '../../types';
import { Container } from './styles';
import ModeButton from './ModeButton';

/** All ModeSelectionContainer Props */
type Props = ModeTypeStateManagement &
  Pick<Dimensions, 'width'> &
  Pick<RangeSelectionState, 'selection'>;

/** ModeSelectionContainer Component */
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
