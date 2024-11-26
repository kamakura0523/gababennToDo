import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
  } from 'react'
  import { AuthContext } from './auth'
  import { db } from '../utils/firebase'
  
  const TodosContext = createContext()
  
  const TodosProvider = ({ children }) => {
    const [todos, setTodos] = useState([])
    const { currentUser } = useContext(AuthContext)
  
    const collection = useMemo(() => {
      const col = db.collection('todos')
  
      // 更新イベント監視
      col.where('uid', '==', currentUser.uid).onSnapshot(query => {
        const data = []
        query.forEach(d => data.push({ ...d.data(), docId: d.id }))
        setTodos(data)
      })
  
      return col
    }, [])
  
    const add = useCallback(async text => {
      await collection.add({
        uid: currentUser.uid,
        text,
        isComplete: false,
        createdAt: new Date(),
      })
    }, [])
  
    const update = useCallback(async ({ docId, text, isComplete }) => {
      const updateTo = {
        ...todos.find(t => t.docId === docId),
        text,
        isComplete,
      }
      if (isComplete) {
        updateTo.completedAt = new Date()
      }
      await collection.doc(docId).set(updateTo)
    }, [todos])
  
    const remove = useCallback(async ({ docId }) => {
      await collection.doc(docId).delete()
    }, [todos])
  
    return (
      <TodosContext.Provider value={{ todos, add, update, remove }}>
        {children}
      </TodosContext.Provider>
    )
  }
  
  export { TodosContext, TodosProvider }
  