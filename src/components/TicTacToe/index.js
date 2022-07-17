import React, { useState, useMemo, useContext, useCallback } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Icon } from 'react-native'
import { arrayFromNumber, getValue, clone2DArray } from './utils'
import { INITIAL_STATE, DEFAULT_VALUE } from './constants'

const ComponentContext = React.createContext({})
const ComponentProvider = ComponentContext.Provider

const parseDisplayData = displayData => {
  if ( !displayData || !displayData?.[0]?.cell?.row === undefined) return []
  return displayData.map(
    ({ cell: { row, column, value } }) => {
      return {
        row,
        column,
        value: value?.[0],
      }
    }
  )
}

const TicTacToe = ({
  rows,
  columns,
  displayData,
  fontSize,
  onCreate,
}) => {
  /*
  console.log({
    rows,
    columns,
    displayData,
    fontSize,
    onCreate,
  })
  */
  const validData = displayData !== undefined 
  const parsedData = parseDisplayData(displayData)

  //console.log({validData, displayData, parsed: parseDisplayData( displayData )})

  if (validData && onCreate)  {
    //console.log("Tic Tac Toe - uncontrolled version")
    return (
      <UncontrolledVersion 
        rows={rows}
        columns={columns}
        displayData={parsedData}
        fontSize={fontSize}
        onCreate={onCreate}
      />
    )
  }
  //console.log("Tic Tac Toe - controlled version")
  return (
    <ControlledVersion
      rows={rows}
      columns={columns}
      displayData={parsedData}
      fontSize={fontSize}
    />
  )
}

const Row = ({
  array,
  column, 
  value 
})=> (
  <View style={styles.row}>
    { 
      array.map( 
        (value,row) => <Cell key={row+'-'+column} value={value} row={row} column={column}/> 
      )
    } 
  </View>
) 

const Cell = ({ value, row, column }) => {
  const { fontSize, cellClick } = useContext(ComponentContext)
  return (
     <TouchableOpacity style={styles.button} onClick={()=>cellClick(row, column, value)}>
        <Text> { value } </Text>
     </TouchableOpacity>
  ) 
}

const UncontrolledVersion = ({
  rows,
  columns,
  displayData,
  fontSize,
  onCreate,
}) => {

  const data = useMemo(() =>{
    const newData = clone2DArray(INITIAL_STATE);
    if(!displayData) return newData
    displayData.forEach(({ row = 1, column = 1, value = 'X' }) =>{
      newData[row][column] = value; 
    })  
    return newData
  }, [displayData])

  const userTurn = useMemo( () => {
    const isEven = displayData?.length % 2 === 0
    return isEven ? true : false
  }, [displayData])

  const cellClick = useCallback(
    (row, column, value) => {
      if (value !== DEFAULT_VALUE) return

      const newValue = getValue(userTurn)
      //console.log("Clicked",{ row, column, newValue, userTurn })
      onCreate( column, row, newValue )
    }, [onCreate, userTurn]
  )

  const columnsArray = arrayFromNumber(columns)
  const rowsArray = arrayFromNumber(rows)

  const context = {
    fontSize,
    cellClick
  }

	return (
		<View style={styles.wrapper}>
      <ComponentProvider value={context}>
        { data.map(
            (array, column) => (<Row key={column} array={array} column={column} />)
        )}  
      </ComponentProvider>
		</View>
	)
}

const ControlledVersion = ({
  rows,
  columns,
  fontSize,
  initialState = INITIAL_STATE
}) => {
  const [userTurn, setUserTurn] = useState(true);

  const [data, setData] = useState(INITIAL_STATE)

  const initialData = useMemo(() =>{
    const newData = clone2DArray(INITIAL_STATE);
    if(!initialState) return newData
    initialState.forEach(({ row = 1, column = 1, value = 'X' }) =>{
      newData[row][column] = value; 
    })  
    setData(newData)
  }, [initialData])

  const cellClick = (row, column, value) => {
    const newData = clone2DArray(data)

    if (value !== DEFAULT_VALUE) return

    const newValue = getValue(userTurn)

    newData[column][row] = newValue

    setUserTurn(!userTurn)
    setData(newData)
  }

  const context = {
    fontSize,
    cellClick
  }
  
  const columnsArray = arrayFromNumber(columns)
  const rowsArray = arrayFromNumber(rows)

	return (
		<View style={styles.wrapper}>
      <ComponentProvider value={context}>
        { data.map(
            (array, column) => (<Row key={column} array={array} column={column} />)
          ) 
        }  
      </ComponentProvider> 
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

export default TicTacToe
