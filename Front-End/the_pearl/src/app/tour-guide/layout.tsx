import TourGuideSideBar from "@/app/tour-guide/components/tour_guide_navbar"

export default function TourGuideLayout({children}){
    return(
        <div className="flex min-h-screen bg-white">
            <TourGuideSideBar />
            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    )
}