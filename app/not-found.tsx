import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 text-white bg-primary rounded-md hover:bg-primary/90">
        Return Home
      </Link>
    </div>
  )
}
