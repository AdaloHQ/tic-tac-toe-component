import React, { useState, useMemo, useContext, useCallback } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Icon } from 'react-native'
import { arrayFromNumber, getValue, clone2DArray } from './utils'
import { INITIAL_STATE, DEFAULT_VALUE } from './constants'

const ComponentContext = React.createContext({})
const ComponentProvider = ComponentContext.Provider

const ROW = "c_9s1owx2040nk64ynyy2uqn3wu"
const COLUMN =  "c_eqxlo7yvzzvozuuqmn014jepr"
const VALUE = "c_5u6j105t88mwmhv56tb9ysgdj"

const parseDisplayData = displayData => {
  if (!displayData || !displayData[0]?._meta?.record) return []
  return displayData.map(
    ({ _meta }) => {
      const { record } = _meta
      return {
        row: record[ROW],
        column: record[COLUMN],
        value: record[VALUE],
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
  console.log({
    rows,
    columns,
    displayData,
    fontSize,
    onCreate,
  })
  return (
    <span></span>
  )
  const validData = !displayData || 
    ( 
      displayData.length === 0 ||
      parseDisplayData(displayData)
        .filter(
            ({ row, column, value }) => 
              row !== undefined && column !== undefined && value !== undefined
        )?.length !== 0
    )
    console.log({validData, displayData, parsed: parseDisplayData( displayData )})

  if (validData && onCreate)  {
    return (
      <UncontrolledVersion 
        rows={rows}
        columns={columns}
        displayData={displayData}
        fontSize={fontSize}
        onCreate={onCreate}
      />
    )
  }
  return (
    <ControlledVersion
      rows={rows}
      columns={columns}
      fontSize={fontSize}
    />
  )
}

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

const Cell = ({ value, row, column }) => {
  const { fontSize, cellClick } = useContext(ComponentContext)
  console.log({
    fontSize,
    cellClick
  })
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
    parseDisplayData(displayData).forEach(({ row = 1, column = 1, value = 'X' }) =>{
      newData[row][column] = value; 
    })  
    return newData
  }, [displayData])

  const userTurn = useMemo( () => {
    const isEven = displayData?.length % 2 === 0
    return isEven ? true : false
  }, [displayData])
  console.log({
  })

  const cellClick = useCallback(
    (row, column, value) => {
      if (value !== DEFAULT_VALUE) return

      const newValue = getValue(userTurn)
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
            (array, index) => (<Row array={array} column={index} />)
        )}  
      </ComponentProvider>
		</View>
	)
}

const ControlledVersion = ({
  rows,
  columns,
  fontSize,
}) => {
  const [userTurn, setUserTurn] = useState(true);

  const [data, setData] = useState(INITIAL_STATE)

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
            (array, index) => (<Row array={array} column={index} />)
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
