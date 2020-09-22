import styled from 'styled-components';

export const Container = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
