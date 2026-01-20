
export default function LoginLayout(
    {children}: Readonly<{children: React.ReactNode}>
) {
    return (
        <>
      <main className="flex flex-col items-center justify-center h-screen">
        {children}
        </main>
        </>
    )  
}