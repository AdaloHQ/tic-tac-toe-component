export const arrayFromNumber = num => {
  return new Array(num).fill(0)
} 
export const getValue = turn => turn ? 'X' : 'O'
export const clone2DArray = data => [...data.map(array => [...array]) ]
