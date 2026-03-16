import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import { ToastContainer } from "react-toastify"

function App() {

  return (
    <div className=" h-screen flex flex-col">
      <Navbar />
      <main className="overflow-y-auto">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}

export default App
