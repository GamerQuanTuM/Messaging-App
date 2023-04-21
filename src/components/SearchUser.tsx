import { DocumentData, collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { GrFormAdd } from "react-icons/gr"
import { auth, db } from '../firebase'
import useAuthStore from '../store/Auth'
import { MessageUserProps } from '../pages/Home'
import { MdLogout } from 'react-icons/md'
import { signOut } from 'firebase/auth'

type SearchProps = {
    displayName: string;
    photoURL: string;
    email: string;
    uid: string;
}

type Props = {
    setGetUserById: Dispatch<SetStateAction<string | null>>
    setMessageUser: Dispatch<SetStateAction<MessageUserProps | null>>
}
const SearchUser = ({ setGetUserById, setMessageUser }: Props) => {

    const { currentUser } = useAuthStore()
    const [searchUsername, setSearchUsername] = useState<string>("")
    const [user, setUser] = useState<SearchProps | null>(null)
    const [userList, setUserList] = useState<DocumentData>([]);

    const getAllUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users", currentUser?.uid!, "chatUser"));
        const users: SearchProps[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                displayName: data.displayName,
                photoURL: data.photoURL,
                email: data.email,
                uid: doc.id
            });
        });
        return users;
    };

    const handleSearch = async () => {
        setGetUserById(null)
        try {
            const queryUser = query(
                collection(db, "users"),
                where("displayName", "==", searchUsername),
                where("displayName", "!=", currentUser?.displayName),
                // where("uid", "!=", currentUser?.uid),
            )
            const querySnapShot = await getDocs(queryUser)

            querySnapShot.forEach((doc) => {
                if (!doc.exists()) {
                    console.log("No User Found")
                }
                setUser(doc.data() as SearchProps)
                setSearchUsername("")
            })
            getAllUsers()

        } catch (error: any) {
            console.log(error)
        }
    }

    const handleOpenUserChat = async (id: string, receipent: SearchProps) => {
        setGetUserById(id)
        try {
            const chattedSenderUser = doc(db, "users", currentUser?.uid!, "chatUser", receipent?.uid!)
            const chattedSenderUserMessage = doc(db, "users", currentUser?.uid!, "chatUser", receipent?.uid!, "messages", receipent?.uid!)


            const chattedReceipentUser = doc(db, "users", receipent?.uid!, "chatUser", currentUser?.uid!)
            const chattedReceipentUserMessage = doc(db, "users", receipent?.uid!, "chatUser", currentUser?.uid!, "messages", currentUser?.uid!)

            await setDoc(chattedSenderUser, {
                chatUserId: receipent?.uid,
                displayName: receipent?.displayName,
                photoURL: receipent?.photoURL
            })
            await setDoc(chattedReceipentUser, {
                chatUserId: currentUser?.uid,
                displayName: currentUser?.displayName,
                photoURL: currentUser?.photoURL
            })

            await setDoc(chattedSenderUserMessage, {
                messages: []
            })
            await setDoc(chattedReceipentUserMessage, {
                messages: []
            })
        } catch (error: any) {
            console.error(error)
        }
        setUser(null)
    }

    const handleOpenChatMessage = (id: string, displayName: string, photoURL: string) => {
        setGetUserById(id)
        setMessageUser({
            displayName,
            photoURL
        })
        setUser(null)
    }


    useEffect(() => {
        const fetchData = async () => {
            const users = await getAllUsers();
            setUserList(users)
        };
        fetchData();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth)
    }


    return (
        <div className='flex-1 flex flex-col gap-5'>
            <div className='flex md:hidden mt-5 mx-5 gap-5 items-center'>
                <img src={currentUser?.photoURL!} className='w-8 h-8 rounded-full' />
                <p className='text-xs text-white'>{currentUser?.displayName}</p>
                <MdLogout size={20} color="#86939f" className="mx-auto cursor-pointer" onClick={handleLogout} />
            </div>
            <div className="pl-3 flex md:mt-5 gap-5 mt-0">
                <input
                    type="text"
                    placeholder="Search A User"
                    className="bg-[#303841] text-white px-5  rounded-2xl md:w-[170px] outline-none h-8 w-[100px]"
                    onChange={(e) => setSearchUsername(e.target.value)}
                    value={searchUsername}
                />
                <GrFormAdd
                    size={25}
                    color="#49535d"
                    className="bg-[#303841] rounded-full h-8 w-8 p-1 cursor-pointer mr-[6px] md:mr-0"
                    values={searchUsername}
                    onClick={handleSearch}
                />
            </div>
            <div style={{ backgroundColor: "#303841", height: "1px" }} />

            {user?.displayName && (
                <div
                    className='flex gap-3 h-16  items-center cursor-pointer hover:bg-[#404953]'
                    onClick={() => handleOpenUserChat(user?.uid, user)}
                >
                    <img
                        src={user?.photoURL}
                        alt="User-Profile-Picture"
                        className='h-10 w-10 rounded-full ml-2'
                    />
                    <div className="flex flex-col text-white pl-2">
                        <p>{user?.displayName}</p>
                    </div>
                </div>
            )}

            {Object.entries(userList).map(([id, { displayName, photoURL, uid }]) => (
                <div
                    key={id}
                    className='flex gap-3 h-16  items-center cursor-pointer hover:bg-[#404953]'
                    onClick={() => handleOpenChatMessage(uid, displayName, photoURL)}
                >
                    <img
                        src={photoURL}
                        alt="User-Profile-Picture"
                        className='h-10 w-10 rounded-full ml-2'
                    />
                    <div className="flex flex-col text-white pl-2">
                        <p>{displayName}</p>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default SearchUser