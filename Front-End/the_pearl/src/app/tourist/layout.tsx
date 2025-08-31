import TouristNavBar from "@/app/tourist/components/tourist_navbar";
import TouristFooter from "@/app/tourist/components/tourist_footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TouristLayout({children}){
    return(
        <div className="min-h-screen flex flex-col">
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
            <TouristNavBar/>
            <main className="flex-grow">
                {children}
            </main>
            <TouristFooter/>
        </div>
    );
}