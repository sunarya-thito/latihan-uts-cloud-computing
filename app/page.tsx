import Link from "next/link"
import { getPosts } from "@/lib/s3"
import { CalendarIcon, Tag } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default async function Home() {
  const posts = await getPosts()
  // Check if we're using dummy data
  const isDummyData = !process.env.AWS_ACCESS_KEY_ID

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">sunarya-thito's Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to my personal blog where I share my thoughts on programming, technology, and more.
        </p>
      </section>

      {isDummyData && (
        <Alert className="mb-8 bg-primary/5 border-primary/20">
          <InfoIcon className="h-4 w-4 text-primary" />
          <AlertTitle>Viewing Demo Content</AlertTitle>
          <AlertDescription>
            You're currently viewing dummy blog posts since AWS credentials aren't configured. To use your own content,
            set up the required environment variables.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <article className="h-full flex flex-col border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-card">
              <div className="h-48 bg-primary/10 flex items-center justify-center">
                {post.coverImage ? (
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
                    ST
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <CalendarIcon size={14} />
                  <span>{post.date}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="mx-1">•</span>
                      <Tag size={14} />
                      <span>{post.tags[0]}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center text-sm text-primary font-medium">
                  Read more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  )
}
