import AdminSidebar from '@/app/admin/components/admin_navbar';

export default function AdminLayout({children,}: { children: React.ReactNode; }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 md:p-12">
                {children}
            </main>
        </div>
    );
}