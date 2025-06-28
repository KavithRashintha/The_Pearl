import TouristNavBar from "@/app/(tourist)/components/tourist_navbar";
export default function TouristLayout({children}){
    return(
        <div className="min-h-screen flex flex-col">
            <TouristNavBar/>
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}