import * as React from 'react'

type Action = {type: 'add', payload: string} | {type: 'remove', payload: string}
type Dispatch = (action: Action) => void
type State = {list: string[]}
type ListProviderProps = {children: React.ReactNode}

const ListStateContext = React.createContext<{state: State; dispatch: Dispatch} | undefined>(undefined)

function listReducer(state: State, action: Action) {
  switch (action.type) {
    case 'add': {
      return {list: [...state.list, action.payload]}
    }
    case 'remove': {
      return { list: state.list.filter(item => item !== action.payload)}
    }
  }
}

function ListProvider({children}: ListProviderProps) {
  const [state, dispatch] = React.useReducer(listReducer, {list: []})
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch}
  return (
    <ListStateContext.Provider value={value}>
      {children}
    </ListStateContext.Provider>
  )
}

function useList() {
  const context = React.useContext(ListStateContext)
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider')
  }
  return context
}

export {ListProvider, useList}