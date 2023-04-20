import { MessageUserProps } from "../pages/Home"
import { VscDeviceCameraVideo } from "react-icons/vsc"
import { IoCallOutline } from "react-icons/io5"
import { BsFillSendFill } from "react-icons/bs"
import { AiOutlinePicture, AiOutlinePaperClip } from "react-icons/ai"
import { Timestamp, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db, storage } from "../firebase"
import useAuthStore from "../store/Auth"
import { useEffect, useState, useRef } from "react"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

type Props = {
    getUserById: string | null,
    messageUser: MessageUserProps | null
}

type TextMessage = {
    photoURL: string
    senderDisplayName: string;
    senderId: string;
    text: string;
    timestamp: Timestamp
}

const Messages = ({ getUserById, messageUser }: Props) => {
    const { currentUser } = useAuthStore()
    const scrollRef = useRef<HTMLDivElement>(null);

    const [text, setText] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [messageTexts, setMessageTexts] = useState<TextMessage[]>([]);

    useEffect(() => {
        if (!currentUser || !getUserById) {
            return;
        }

        const unsubscribeSender = onSnapshot(
            doc(db, "users", currentUser.uid, "chatUser", getUserById, "messages", getUserById),
            (doc) => {
                if (doc.exists()) {
                    setMessageTexts(doc.data().messages);
                }
            }
        );

        const unsubscribeRecipient = onSnapshot(
            doc(db, "users", getUserById, "chatUser", currentUser.uid, "messages", currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    setMessageTexts(doc.data().messages);
                }
            }
        );

        return () => {
            unsubscribeSender();
            unsubscribeRecipient();
        };
    }, [currentUser, getUserById]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageTexts]);


    if (!getUserById || getUserById === null) {
        return (
            <div className='flex-1 bg-white h-full w-full flex items-center justify-center'>
                <p className='text-[#8c9399] text-2xl font-light'>Select a user to start chatting</p>
            </div>
        )
    }

    const handleSendMessage = async () => {
        if (!text.trim()) {
            return; // Don't send empty messages
        }

        if (!file) {
            return;
        }

        if (!currentUser?.displayName) {
            console.error("Something went wrong");
            return
        }

        const fileRef = ref(storage, `${currentUser?.displayName + file}`)
        const messageSenderRef = doc(db, "users", currentUser?.uid!, "chatUser", getUserById!, "messages", getUserById!)
        const messageReceipentRef = doc(db, "users", getUserById!, "chatUser", currentUser?.uid!, "messages", currentUser?.uid!)


        await uploadBytesResumable(fileRef, file).then(() => {
            getDownloadURL(fileRef).then(async (downloadURL) => {
                try {

                } catch (error: any) {
                    console.error(error)
                }
            })
        })

        await updateDoc(messageSenderRef, {
            messages: arrayUnion({
                senderId: currentUser?.uid,
                senderDisplayName: currentUser?.displayName,
                text,
                timestamp: Timestamp.now(),
                photoURL: messageUser?.photoURL
            })
        })
        await updateDoc(messageReceipentRef, {
            messages: arrayUnion({
                senderId: currentUser?.uid,
                senderDisplayName: currentUser?.displayName,
                text,
                timestamp: Timestamp.now(),
                photoURL: messageUser?.photoURL
            })
        })
        setText("")
    }



    return (
        <div className='flex-1 bg-white px-6  flex flex-col'>
            <div className="h-[15%] w-full flex flex-row justify-between items-center">
                <div className="font-extrabold text-xl">{messageUser?.displayName}</div>
                <div className="flex flex-row gap-5">
                    <VscDeviceCameraVideo size={35} className="rounded-full bg-gray-200 p-2" />
                    <IoCallOutline size={35} className="rounded-full bg-gray-200 p-2" />
                    <label htmlFor="image">
                        <AiOutlinePicture size={35} className="rounded-full bg-gray-200 p-2 cursor-pointer" />
                    </label>
                    <input type="file" accept="image/*" id="image" style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0])
                            }
                        }}
                    />

                    <label htmlFor="video">
                        <AiOutlinePaperClip size={35} className="rounded-full bg-gray-200 p-2 cursor-pointer" />
                    </label>
                    <input type="file" accept="video/*" id="video" style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0])
                            }
                        }}
                    />
                </div>

            </div>
            <hr className="" />
            <div className="flex-1 overflow-y-auto scrollbar mt-5">
                {messageTexts?.map((message: TextMessage, i: number) => (
                    <div key={i} className={message.senderId === currentUser?.uid ? 'sent' : 'received mt-[10px]'} ref={scrollRef}>
                        <div className="message-container relative">
                            <img src={message.senderId === currentUser?.uid ? currentUser?.photoURL! : messageUser?.photoURL} className="user-image" alt="User" />
                            {message?.senderId === getUserById && <p className="text-[10px] text-[#9ba2a8] absolute left-[70px] -top-2">{message?.timestamp.toDate().toLocaleDateString()} {message?.timestamp.toDate().toLocaleTimeString()}</p>}
                            <div className="message">{message.text}</div>
                        </div>
                    </div>
                ))}


            </div>
            <div className="h-[15%] w-full flex items-center mb-2 relative">
                <input type="text" className="border-2 border-gray-300 w-full h-14 rounded-xl active:border-2 focus:border-gray-500 focus:outline-none pr-16 pl-5 text-xl" value={text} onChange={(e) => setText(e.target.value)} />
                <BsFillSendFill size={35} className="rounded-full bg-gray-200 px-[9px] absolute right-5 cursor-pointer" onClick={handleSendMessage} values={text} />
            </div>
        </div>
    )
}

export default Messages