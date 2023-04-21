import { FormEvent, useState } from "react";
import Bg from "../assets/bg.jpg";
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (error: any) {
      setError(error)
    }

  }
  return (
    <div className="min-w-screen min-h-screen bg-[#014670] flex items-center justify-center px-5 py-5">
      <form onSubmit={handleSubmit} className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{ maxWidth: "1000px" }}>
        <div className="md:flex w-full drop-shadow-xl">
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">LOGIN</h1>
              <p>Enter your information to login</p>
            </div>
            <div>
              <div className="flex -mx-3">
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
                    <input type="password" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="************" onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3 flex-col">
                <div className="w-full px-3 mb-5">
                  <button className="block w-full max-w-xs mx-auto bg-[#1e7faa] hover:bg-[#014670] focus:bg-[#014670] text-white rounded-lg px-3 py-3 font-semibold">LOGIN</button>
                </div>
                <div className="flex justify-center mt-1 gap-1">
                  Not a member?<span className="cursor-pointer underline" onClick={() => navigate("/register")}>Sign up now</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-1/2 bg-indigo-500">
            <img src={Bg} alt="" className="w-full h-full" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
