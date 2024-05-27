export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className='h-full min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-800 to-black'>
            {children}
        </section>
    );
}
