import { useState } from 'react'

function TestPage() {
    const [Priority, setPriority] = useState("")
    console.log("Priority", Priority);
    
  return (
    <div className='h-screen w-screen flex justify-center items-center ' >
        <select onClick={(e:any)=> setPriority(e.target.value)} className="input text-sm py-2 bg-black/90 backdrop-blur-3xl ">
            <option value={""} >All Priorities</option>
            <option  value={"High"} >High</option>
            <option  value={"Medium"} >Medium</option>
            <option  value={"Low"} >Low</option>
        </select>
    </div>
  )
}

export default TestPage