import TouristNavBar from "@/app/(tourist)/components/tourist_navbar";
import TouristFooter from "@/app/(tourist)/components/tourist_footer";
export default function TouristLayout({children}){
    return(
        <div className="min-h-screen flex flex-col">
            <TouristNavBar/>
            <main className="flex-grow">
                {children}
            </main>
            <TouristFooter/>
        </div>
    );
}