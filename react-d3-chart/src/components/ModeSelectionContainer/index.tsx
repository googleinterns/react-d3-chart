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
  TRangeSelection
} from '../../types';
import { Container } from './styles';
import ModeButton from './ModeButton';
import FlexColumn from '../FlexContainers/FlexColumn';
import {googleColor20c} from '../../utils';

interface ModeSelectionSelfProps {
  /* All the currently selected ranges */
  rangeSelections: Array<TRangeSelection>;
  /** Callback function when confirm selection button is clicked */
  onConfirmSelection: (selection: TRangeSelection) => void;
  /** Setter for current Range Selection State */
  setRangeSelectionState: (rangeSelectionState: RangeSelectionState) => void;
  /** Setter for range selections */
  setRangeSelections: (rangeSelections: Array<TRangeSelection>) => void;
}

/** All ModeSelectionContainer Props */
type Props = ModeSelectionSelfProps & ModeTypeStateManagement &
  Pick<Dimensions, 'width'> &
  Pick<RangeSelectionState, 'selection'>;

/** ModeSelectionContainer Component */
const ModeSelectionContainer: React.FC<Props> = ({
  selectMode,
  width,
  mode,
  selection,
  onConfirmSelection,
  setRangeSelectionState,
  setRangeSelections,
  rangeSelections,
}) => {

  const addSelection = () => {
    onConfirmSelection(selection);
    setRangeSelectionState({
      selection: [0, 0],
    });
  };

  const removeSelection = (selection: TRangeSelection) => {
    const newRangeSelections = rangeSelections.filter(
      range => range[0] !== selection[0]
      && range[1] !== selection[1]
    );
    setRangeSelections(newRangeSelections);
  }

  return (
    <>
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
      {mode === 'selection' &&
        selection && selection[0] !== 0 && selection[1] !== 0 &&
      <ModeButton text="Confirm Selection" active={false} onClick={addSelection}/>}
    </Container>
    { rangeSelections.length > 0 &&
      <Container width={width}>
      Selections:
      {rangeSelections.map((range,i) => {
        return (
          <FlexColumn key={i} style={{marginLeft:20}}>
            <div key={i} style={{backgroundColor: googleColor20c(i), opacity: 0.3, width:20, height:20}}></div>
            <span>{Math.round(range[0])}, {Math.round(range[1])}</span>
            <span style={{cursor:'pointer'}}
                  onClick={() => removeSelection(range)}>
                    &#128465; {/* trash can icon */}
            </span>
          </FlexColumn>
        )
      })}
    </Container>
    }
    </>
  );
};

export default ModeSelectionContainer;
