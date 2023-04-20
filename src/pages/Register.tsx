import { FormEvent, useState } from "react"
import Bg from "../assets/bg.jpg"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db, storage, app } from "../firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { collection, doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [image, setImage] = useState<null | File | any>(null)
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Select a file");
      return;
    }
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const displayName = firstName + " " + lastName

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const storageRef = ref(storage, `${displayName + image.name}`)

      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            })

            const userRef = doc(db, "users", res.user.uid)

            const usersData = {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            }

            await setDoc(userRef, usersData)
            navigate("/")
            setFirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setImage(null)
          } catch (error: any) {
            setError(error)
          }
        })
      })
    } catch (error: any) {
      setError(error)
    }
  }


  return (
    <div className="min-w-screen min-h-screen bg-[#014670] flex items-center justify-center px-5 py-5">
      <form onSubmit={handleSubmit} className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{ maxWidth: "1000px" }}>
        <div className="md:flex w-full drop-shadow-xl">
          <div className="hidden md:block w-1/2 bg-indigo-500">
            <img src={Bg} alt="" className="w-full h-full" />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">REGISTER</h1>
              <p>Enter your information to register</p>
            </div>
            <div>
              <div className="flex -mx-3">
                <div className="w-1/2 px-3 mb-5">
                  <label htmlFor="" className="text-xs font-semibold px-1">First name</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                    <input type="text" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John" onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                </div>
                <div className="w-1/2 px-3 mb-5">
                  <label htmlFor="" className="text-xs font-semibold px-1">Last name</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                    <input type="text" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="Smith" onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label htmlFor="" className="text-xs font-semibold px-1">Email</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
                    <input type="email" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="johnsmith@example.com" onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                  <label htmlFor="" className="text-xs font-semibold px-1">Password</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                    <input type="password" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" autoComplete="************" onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex -mt-3">
                <div className="w-full px-3 mb-12">
                  <div className="flex">
                    <label htmlFor="image" className="rounded-lg border-2 border-gray-200 outline-none bg-form focus:border-indigo-500 w-full text-center text-xl pl-10 pr-3 py-2 font-bold text-white cursor-pointer">Choose a picture</label>
                    <input type="file" id="image" style={{ display: "none" }}
                      onChange={handleImage} />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <button className="block w-full max-w-xs mx-auto bg-[#1e7faa] hover:bg-[#014670] focus:bg-[#014670] text-white rounded-lg px-3 py-3 font-semibold">REGISTER NOW</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register