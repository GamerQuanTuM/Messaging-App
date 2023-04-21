type Props = {
    file: File | null;
    handleClose: () => void;
    handleSendMessage: () => void;
}


const Modal = ({ file, handleClose, handleSendMessage }: Props) => {
    const imageUrl = file ? URL.createObjectURL(file) : null;

    return (
        <div className="absolute bg-gray-400 h-[450px] w-[600px] bottom-2 -left-5 flex flex-col items-center justify-center gap-4">
            <div>
                {imageUrl ? (
                    <img src={imageUrl} alt="" className="h-[300px] w-[300px]" />
                ) : (
                    <p>No file selected</p>
                )}
            </div>


            <div className="flex gap-4 w-full">
                <button className="bg-red-500 w-full ml-36 p-2 text-white rounded-xl text-xl" onClick={handleClose}>Close</button>
                <button className="bg-blue-500 w-full mr-36 p-2 text-white rounded-xl text-xl" onClick={handleSendMessage}>Proceed</button>
            </div>
        </div>
    );
};


export default Modal