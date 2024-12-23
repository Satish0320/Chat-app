import { useEffect, useRef, useState } from "react"

function App() {
  const [message, setMessage] = useState(["hii there", "hello"])
  const [currentmessages, setCurrentmessages] = useState("")
  const wsRef = useRef<WebSocket>();

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:7070")
    ws.onmessage = ((e)=>{
      setMessage((m)=>[...m,e.data])
    })

    wsRef.current = ws

    ws.onopen = () =>{
      ws.send(JSON.stringify({
        type: "join",
        payload:{
          roomId: "red"
        }
      }))
    }

    return ()=>{
      ws.close()
    }
  },[])

  const sendMessage = () =>{
    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: {
        message: currentmessages
      }
    }))
  }


  return (
    <div className='bg-gray-400 h-screen flex flex-col'>
      <div className='flex-grow p-4 bg-white overflow-y-auto'>
          {message.map(m => <div> {m} </div>)}
        <div className="space-y-2">
        </div>
      </div>

      <div className='p-4 bg-gray-100 flex'>
      <input 
      onChange={(e)=>{setCurrentmessages(e.target.value)}}
      type="text" 
      placeholder='text' 
      className='flex-grow p-2 broder broder-gray-300 rounded-md' />
      <button
      onClick={sendMessage} 
      className='ml-2 bg-blue-500 text-white px-4 py-2 rounded-md'> Send </button>
      </div>
    </div>
  )
}

export default App
