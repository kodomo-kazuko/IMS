import Navbar from "@/components/nav"

export default function ProfileLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            {/* Include shared UI here e.g. a header or sidebar */}
            <Navbar />

            {children}
        </section>
    )
}