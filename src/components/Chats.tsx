import { MdLogout } from "react-icons/md"

import useAuthStore from '../store/Auth'
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import SearchUser from "./SearchUser"
import { Dispatch, SetStateAction } from "react"
import { MessageUserProps } from "../pages/Home"

type Props = {
    setGetUserById: Dispatch<SetStateAction<string | null>>
    setMessageUser: Dispatch<SetStateAction<MessageUserProps | null>>
}

const Chats = ({ setGetUserById, setMessageUser }: Props) => {
    const { currentUser } = useAuthStore();

    const handleLogout = async () => {
        await signOut(auth)
    }
    return (
        <div className='w-[30%] h-full bg-[#363e47] flex'>
            <div className='bg-[#303841] w-[20%] py-10 flex flex-col justify-between'>
                <img src={currentUser?.photoURL!} alt="Profile-Pic" className='w-12 h-12 rounded-full mx-auto' />
                <MdLogout size={30} color="#86939f" className="mx-auto cursor-pointer" onClick={handleLogout} />
            </div>
            <SearchUser setGetUserById={setGetUserById} setMessageUser={setMessageUser} />
        </div>
    )
}

export default Chats