import { MessageUserProps } from "../pages/Home"
import { VscDeviceCameraVideo } from "react-icons/vsc"
import { IoCallOutline } from "react-icons/io5"
import { BsFillSendFill } from "react-icons/bs"
import { AiOutlinePicture, AiOutlinePaperClip } from "react-icons/ai"
import { Timestamp, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db, storage } from "../firebase"
import useAuthStore from "../store/Auth"
import { useEffect, useState, useRef, ChangeEvent, Dispatch, SetStateAction } from "react"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import Modal from "./Modal"
import { GiHamburgerMenu } from "react-icons/gi"

type Props = {
    getUserById: string | null,
    messageUser: MessageUserProps | null,
    setIsChatOpenUser: Dispatch<SetStateAction<boolean>>
    isChatUserOpen: boolean
}

type TextMessage = {
    photoURL: string
    senderDisplayName: string;
    senderId: string;
    text?: string;
    mediaURL?: string;
    videoURL?: string;
    timestamp: Timestamp
}

const Messages = ({ getUserById, messageUser, setIsChatOpenUser, isChatUserOpen }: Props) => {
    const { currentUser } = useAuthStore()
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)


    const handleShow = () => setIsModalOpen(true);
    const handleClose = () => {
        setFile(null)
        setIsModalOpen(false)
    };

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
            <>
                <div className='flex-1 bg-white h-full w-full flex items-center justify-center' onClick={() => setIsChatOpenUser(false)}>
                    <div className="absolute top-0 bg-white left-5 pt-5 cursor-pointer" onClick={(event) => { event.stopPropagation(); setIsChatOpenUser(prevState => !prevState) }}>
                        <GiHamburgerMenu size={25} />
                    </div>
                    <div className='text-center'>
                        <p className='text-[#8c9399] text-2xl font-light'>Select a user to start chatting</p>
                    </div>
                </div>
            </>
        )
    }


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            console.log("No Images Selected")
            return
        }

        setFile(selectedFile);
        handleShow();
    };

    const handleVideoSend = async () => {
        if (!file) return
        if (!currentUser?.displayName || !currentUser) {
            console.error("Something went wrong");
            return;
        }

        const messageSenderRef = doc(db, "users", currentUser?.uid, "chatUser", getUserById, "messages", getUserById);
        const messageReceipentRef = doc(db, "users", getUserById, "chatUser", currentUser?.uid, "messages", currentUser?.uid);

        const fileRef = ref(storage, `videos/${currentUser?.displayName + Date.now()}`);
        await uploadBytesResumable(fileRef, file).then(() => {
            getDownloadURL(fileRef).then(async (downloadURL) => {
                try {
                    await updateDoc(messageSenderRef, {
                        messages: arrayUnion({
                            senderId: currentUser?.uid,
                            senderDisplayName: currentUser?.displayName,
                            timestamp: Timestamp.now(),
                            photoURL: messageUser?.photoURL,
                            videoURL: downloadURL,
                        }),
                    });
                    await updateDoc(messageReceipentRef, {
                        messages: arrayUnion({
                            senderId: currentUser?.uid,
                            senderDisplayName: currentUser?.displayName,
                            timestamp: Timestamp.now(),
                            photoURL: messageUser?.photoURL,
                            videoURL: downloadURL,
                        }),
                    });
                } catch (error: any) {
                    console.error(error);
                }
            });
        });

        setFile(null)
        handleClose()
    }

    const handleImageSend = async () => {

        if (!file) return

        if (!currentUser?.displayName || !currentUser) {
            console.error("Something went wrong");
            return;
        }

        const messageSenderRef = doc(db, "users", currentUser?.uid, "chatUser", getUserById, "messages", getUserById!);
        const messageReceipentRef = doc(db, "users", getUserById, "chatUser", currentUser?.uid, "messages", currentUser?.uid);

        const fileRef = ref(storage, `files/${currentUser?.displayName + Date.now()}`);
        await uploadBytesResumable(fileRef, file).then(() => {
            getDownloadURL(fileRef).then(async (downloadURL) => {
                try {
                    await updateDoc(messageSenderRef, {
                        messages: arrayUnion({
                            senderId: currentUser?.uid,
                            senderDisplayName: currentUser?.displayName,
                            timestamp: Timestamp.now(),
                            photoURL: messageUser?.photoURL,
                            mediaURL: downloadURL,
                        }),
                    });
                    await updateDoc(messageReceipentRef, {
                        messages: arrayUnion({
                            senderId: currentUser?.uid,
                            senderDisplayName: currentUser?.displayName,
                            timestamp: Timestamp.now(),
                            photoURL: messageUser?.photoURL,
                            mediaURL: downloadURL,
                        }),
                    });
                } catch (error: any) {
                    console.error(error);
                }
            });
        });

        setFile(null)
        handleClose()
    }

    const handleSendMessage = async () => {
        if (!text.trim()) {
            return; // Don't send empty messages
        }

        if (!currentUser?.displayName) {
            console.error("Something went wrong");
            return;
        }
        const messageSenderRef = doc(db, "users", currentUser?.uid, "chatUser", getUserById, "messages", getUserById);
        const messageReceipentRef = doc(db, "users", getUserById, "chatUser", currentUser?.uid, "messages", currentUser?.uid);

        try {
            await updateDoc(messageSenderRef, {
                messages: arrayUnion({
                    senderId: currentUser?.uid,
                    senderDisplayName: currentUser?.displayName,
                    text,
                    timestamp: Timestamp.now(),
                    photoURL: messageUser?.photoURL,
                }),
            });
            await updateDoc(messageReceipentRef, {
                messages: arrayUnion({
                    senderId: currentUser?.uid,
                    senderDisplayName: currentUser?.displayName,
                    text,
                    timestamp: Timestamp.now(),
                    photoURL: messageUser?.photoURL,
                }),
            });
        } catch (error: any) {
            console.error(error);
        }
        setText("");
    };

    const handleClick = () => {
        handleClose()
        setIsChatOpenUser(false)
    }


    return (
        <div className={`flex-1 ${isModalOpen ? "bg-neutral-300" : "bg-white"} px-6  flex flex-col`} onClick={handleClick}>
            <div className="h-[15%] w-full flex flex-row justify-between items-center">
                <div className="block md:hidden bg-white cursor-pointer" onClick={(event) => { event.stopPropagation(); setIsChatOpenUser(prevState => !prevState) }}>
                    <GiHamburgerMenu size={25} />
                </div>
                <div className="font-extrabold text-xl">{messageUser?.displayName}</div>
                <div className="flex flex-row gap-5">
                    <VscDeviceCameraVideo size={35} className="rounded-full bg-gray-200 p-2" />
                    <IoCallOutline size={35} className="rounded-full bg-gray-200 p-2" />

                </div>

            </div>
            <hr className="" />
            <div className="flex-1 overflow-y-auto scrollbar">
                {messageTexts?.map((message: TextMessage, i: number) => (
                    <div key={i} className={message.senderId === currentUser?.uid ? 'sent' : 'received mt-[10px]'} ref={scrollRef}>
                        <div className="message-container relative">
                            <img src={message.senderId === currentUser?.uid ? currentUser?.photoURL! : messageUser?.photoURL} className="user-image" alt="User" />
                            {message?.senderId === getUserById &&
                                <p className="text-[10px] text-[#9ba2a8] absolute left-[70px] -top-2">
                                    {message?.timestamp.toDate().toLocaleDateString()} {" "}
                                    {message?.timestamp.toDate().toLocaleTimeString()}
                                </p>
                            }
                            {message?.text && <div className="message mt-2">{message.text}
                            </div>
                            }
                            {message?.mediaURL && <img src={message?.mediaURL} alt="image" className="w-[300px] h-[300px] mt-2" />}

                            {message?.videoURL && <video src={message?.videoURL} className="md:w-[350px] md:h-[300px] w-[270px] h-[400px] 
                            lg:w-[650px] xl:h-[400px] mt-2" controls />}
                        </div>
                    </div>
                ))}


            </div>
            <div className="h-[15%] w-full flex items-center mb-2 relative">
                <input type="text" className={`border-2 border-gray-300 ${isModalOpen ? "bg-neutral-300" : "bg-white"} w-full h-14 rounded-xl active:border-2 focus:border-gray-500 focus:outline-none pr-[6rem] pl-5 text-xl`} value={text} onChange={(e) => setText(e.target.value)} />


                <label htmlFor="image" className="absolute right-[52px]">
                    <AiOutlinePicture size={35} className="rounded-full bg-gray-200 px-[9px] cursor-pointer" />
                </label>
                <input type="file" accept="image/*" id="image" style={{ display: "none" }} onChange={handleFileChange} />

                <label htmlFor="video" className="absolute right-[96px]">
                    <AiOutlinePaperClip size={35} className="rounded-full bg-gray-200 px-[9px] cursor-pointer" />
                </label>
                <input type="file" accept="video/*" id="video" style={{ display: "none" }} onChange={handleFileChange} />

                <BsFillSendFill size={35} className="rounded-full bg-gray-200 px-[9px] absolute right-2 cursor-pointer" onClick={handleSendMessage} values={text} />
            </div>
            <div className="relative">
                {isModalOpen && <Modal file={file} handleClose={handleClose} handleImageSend={handleImageSend} handleVideoSend={handleVideoSend} />}
            </div>
        </div>
    )
}

export default Messages