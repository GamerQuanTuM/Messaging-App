import { useEffect, useState } from "react";

type Props = {
    file: File | null;
    handleClose: () => void;
    handleImageSend: () => void;
    handleVideoSend: () => void;
}


const Modal = ({ file, handleClose, handleImageSend, handleVideoSend }: Props) => {
    const [fileType, setFileType] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleSend = () => {
        if (file?.type.includes("image")) {
            handleImageSend()
        } else if (file?.type.includes("video")) {
            handleVideoSend()
        }
    }

    useEffect(() => {
        if (file) {
            setFileType(file.type);
            setFileUrl(URL.createObjectURL(file));
        } else {
            setFileType(null);
            setFileUrl(null);
        }
    }, [file]);

    return (
        <div className="absolute bg-gray-400 h-[450px] w-[600px] bottom-2 -left-5 flex flex-col items-center justify-center gap-4">
            {fileType?.startsWith('image/') ? (
                <div>
                    {fileUrl ? (
                        <img src={fileUrl} alt="" className="h-[300px] w-[300px]" />
                    ) : (
                        <p>No file selected</p>
                    )}
                </div>
            ) : fileType?.startsWith('video/') ? (
                <div>
                    {fileUrl ? (
                        <video src={fileUrl} controls />
                    ) : (
                        <p>No file selected</p>
                    )}
                </div>
            ) : (
                <p>No file selected</p>
            )}

            <div className="flex gap-4 w-full">
                <button className="bg-red-500 w-full ml-36 p-2 text-white rounded-xl text-xl" onClick={handleClose}>Close</button>
                <button className="bg-blue-500 w-full mr-36 p-2 text-white rounded-xl text-xl" onClick={handleSend}>Proceed</button>
            </div>
        </div>
    );
};


export default Modal





// const Modal = ({ file, handleClose, handleSendMessage, handleVideoSend }: Props) => {
//     const imageUrl = file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

//     const videoUrl = file ? URL.createObjectURL(file) : null

//     const handleSend = () => {
//         if (file?.name.startsWith("image/")) {
//             handleSendMessage()
//         } else {
//             handleVideoSend()
//         }
//     }

//     return (
//         <div className="absolute bg-gray-400 h-[450px] w-[600px] bottom-2 -left-5 flex flex-col items-center justify-center gap-4">
//             {file?.name.startsWith("image/") ?
//                 <div>
//                     {imageUrl ? (
//                         <img src={imageUrl} alt="" className="h-[300px] w-[300px]" />
//                     ) : (
//                         <p>No file selected</p>
//                     )}
//                 </div>
//                 :
//                 <div>
//                     <video src={videoUrl || ""} controls />
//                 </div>
//             }


//             <div className="flex gap-4 w-full">
//                 <button className="bg-red-500 w-full ml-36 p-2 text-white rounded-xl text-xl" onClick={handleClose}>Close</button>
//                 <button className="bg-blue-500 w-full mr-36 p-2 text-white rounded-xl text-xl" onClick={handleSend}>Proceed</button>
//             </div>
//         </div >
//     );
// };


// export default Modal