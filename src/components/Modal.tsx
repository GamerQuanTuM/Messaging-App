import { useEffect, useState } from "react";

type Props = {
    file: File | null;
    handleClose: () => void;
    handleImageSend: () => void;
    handleVideoSend: () => void;
};

const Modal = ({ file, handleClose, handleImageSend, handleVideoSend }: Props) => {
    const [fileType, setFileType] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleSend = () => {
        if (file?.type.includes("image")) {
            handleImageSend();
        } else if (file?.type.includes("video")) {
            handleVideoSend();
        }
    };

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
        <div className="fixed top-0 left-0 z-50 w-full h-full overflow-y-auto bg-gray-200 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-400 rounded-lg w-full mx-5 md:w-3/4 lg:w-1/2 xl:w-2/5">
                {fileType?.startsWith("image/") ? (
                    <div>
                        {fileUrl ? (
                            <img src={fileUrl} alt="" className="h-[300px] w-full object-contain mt-5 md:mt-12" />
                        ) : (
                            <p>No file selected</p>
                        )}
                    </div>
                ) : fileType?.startsWith("video/") ? (
                    <div>
                        {fileUrl ? (
                            <video src={fileUrl} controls className="w-full" />
                        ) : (
                            <p>No file selected</p>
                        )}
                    </div>
                ) : (
                    <p>No file selected</p>
                )}

                <div className="flex justify-center gap-4 w-full py-4 px-6 md:py-6 md:px-8">
                    <button
                        className="bg-red-500 w-full md:w-auto py-2 md:py-3 px-4 md:px-6 text-white rounded-xl text-lg md:text-xl"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-blue-500 w-full md:w-auto py-2 md:py-3 px-4 md:px-6 text-white rounded-xl text-lg md:text-xl"
                        onClick={handleSend}
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
