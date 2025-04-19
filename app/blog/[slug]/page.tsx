import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPosts, getPostBySlug } from "@/lib/s3"
import { BlogPost } from "@/components/blog-post"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

type BlogPostPageProps = {
  params: Promise<{
    slug: string,
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)
  const isDummyData = !process.env.AWS_ACCESS_KEY_ID

  if (!post) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {isDummyData && (
          <Alert className="mb-8 bg-primary/5 border-primary/20">
            <InfoIcon className="h-4 w-4 text-primary" />
            <AlertDescription>
              You're viewing demo content. Set up AWS credentials to use your own blog posts.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8 pb-8 border-b">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              ST
            </div>
            <span>sunarya-thito</span>
            <span className="mx-1">•</span>
            <span>{post.date}</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="mx-1">•</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-muted px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <BlogPost content={post.content} />
        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-primary hover:underline flex items-center">
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
              className="mr-2"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    </main>
  )
}
