import TourGuideSideBar from "@/app/tour-guide/components/tour_guide_navbar"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function TourGuideLayout({children}){
    return(
        <div className="flex min-h-screen bg-white">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <TourGuideSideBar />
            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    )
}