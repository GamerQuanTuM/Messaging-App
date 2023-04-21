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
    isChatUserOpen: boolean
}

const Chats = ({ setGetUserById, setMessageUser, isChatUserOpen }: Props) => {
    const { currentUser } = useAuthStore();

    const handleLogout = async () => {
        await signOut(auth)
    }
    return (
        <>
            <div
                className={`${isChatUserOpen ? "left-0" : "-left-full"
                    } absolute z-10 w-[60%] md:w-[40%] lg:w-[30%] h-full bg-[#363e47] md:flex md:static transition-all duration-300 ease-in-out`}
            >
                <div className='bg-[#303841] md:w-[20%] w-[40%] py-10 md:flex md:flex-col justify-between hidden'>
                    <img src={currentUser?.photoURL!} alt="Profile-Pic" className='w-12 h-12 rounded-full mx-auto' />
                    <MdLogout size={30} color="#86939f" className="mx-auto cursor-pointer" onClick={handleLogout} />
                </div>
                <SearchUser setGetUserById={setGetUserById} setMessageUser={setMessageUser} />
            </div>

        </>
    )
}

export default Chats