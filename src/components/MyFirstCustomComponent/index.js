import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Icon } from 'react-native'

const DEFAULT_VALUE = '  '
const INITIAL_STATE = [
  [DEFAULT_VALUE, DEFAULT_VALUE, DEFAULT_VALUE],
  [DEFAULT_VALUE, DEFAULT_VALUE, DEFAULT_VALUE],
  [DEFAULT_VALUE, DEFAULT_VALUE, DEFAULT_VALUE]
]

const getValue = turn => turn ? 'X' : 'O'
const clone2DArray = data => [...data.map(array => [...array]) ]

const MyFirstCustomComponent = ({
  rows,
  columns,
  fontSize,
  afterPlayerPlays,
  onWin,
}) => {
  const [userTurn, setUserTurn] = useState(true);

  const Row = ({
    array,
    column 
  })=> (
    <View style={styles.row}>
      { 
        array.map( 
          (value,row) => <Cell value={value} row={row} column={column}/> 
        )
      } 
    </View>
  ) 

  const [data, setData] = useState(INITIAL_STATE)

  const cellClick = (row, column, value) => {
    const newData = clone2DArray(data)

    if (value !== DEFAULT_VALUE) return

    const newValue = getValue(userTurn)

    newData[column][row] = newValue

    setUserTurn(!userTurn)
    setData(newData)

  }

  const Cell = ({ value, row, column }) => (
     <TouchableOpacity style={styles.button} onClick={()=>cellClick(row, column, value)}>
        <Text style={{fontSize}}>
          { value } 
        </Text>
     </TouchableOpacity>
  ) 


  const arrayFromNumber = num => {
    return new Array(num).fill(0)
  } 
  
  const columnsArray = arrayFromNumber(columns)
  const rowsArray = arrayFromNumber(rows)

	return (
		<View style={styles.wrapper}>
      { data.map(
          (array, index) => (<Row array={array} column={index} />)
        ) 
      }  
		</View>
	)
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 1,
    padding: 10,
    margin:2 
  },
  row: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
  },
	wrapper: {
		display: 'flex',
    flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	}
})

export default MyFirstCustomComponent
