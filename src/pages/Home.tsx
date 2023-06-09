import { useState } from "react"
import Chats from '../components/Chats'
import Messages from '../components/Messages'

export type MessageUserProps = {
  photoURL: string;
  displayName: string;
}

const Home = () => {
  const [getUserById, setGetUserById] = useState<string | null>("")
  const [messageUser, setMessageUser] = useState<MessageUserProps | null>(null)
  const [isChatUserOpen,setIsChatOpenUser] = useState(false)


  return (
    <div className='bg-form gray-900 h-screen w-screen flex items-center justify-center'>
      <div className="w-full h-full lg:h-[80%] lg:w-[70%] drop-shadow-lg border-2 border-gray-500 md:rounded-xl rounded-none flex flex-row overflow-hidden">
        <Chats setGetUserById={setGetUserById} setMessageUser={setMessageUser} isChatUserOpen={isChatUserOpen} />
        <Messages getUserById={getUserById} messageUser={messageUser} setIsChatOpenUser={setIsChatOpenUser} isChatUserOpen={isChatUserOpen} />
      </div>
    </div>
  )
}

export default Home