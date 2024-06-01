export const calculateSquareBackgroundColorByCoordinates = (
  coordinates: { x: number, y: number },
  lightSquareColor: string,
  darkSquareColor: string,
): string => {
  const isEvenColumn = coordinates.x % 2 === 0;
  const isEvenRow = coordinates.y % 2 === 0;

  return isEvenRow
    ? (isEvenColumn ? lightSquareColor : darkSquareColor)
    : (isEvenColumn ? darkSquareColor : lightSquareColor);
};
