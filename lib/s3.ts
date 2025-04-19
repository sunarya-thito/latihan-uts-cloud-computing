import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import matter from "gray-matter"

// Define the Post interface
export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
  coverImage?: string
}

// Define the PostMetadata interface (without content)
interface PostMetadata {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  coverImage?: string
  filePath?: string
}

// Dummy data to use when AWS credentials are not available
const dummyPosts: Post[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    date: "2023-04-15",
    excerpt: "Learn how to build modern web applications with Next.js, the React framework for production.",
    content: `
# Getting Started with Next.js

Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites.

## Why Next.js?

- **Server-side Rendering**: Next.js allows you to pre-render pages on the server, which can improve performance and SEO.
- **Static Site Generation**: You can generate static sites that can be deployed to any hosting service.
- **API Routes**: Create API endpoints as Node.js serverless functions.
- **File-based Routing**: Create pages by adding files to the \`pages\` directory.

## Getting Started

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

Now you can visit [http://localhost:3000](http://localhost:3000) to see your application.

## Creating Pages

In Next.js, a page is a React Component exported from a file in the \`pages\` directory. Each page is associated with a route based on its file name.

\`\`\`jsx
// pages/index.js
export default function Home() {
  return <h1>Hello, World!</h1>
}
\`\`\`

## Conclusion

Next.js provides a great developer experience with all the features you need for production. It's a great choice for building modern web applications.
    `,
    tags: ["nextjs", "react", "web-development"],
  },
  {
    slug: "working-with-aws-s3",
    title: "Working with AWS S3 in Node.js",
    date: "2023-04-10",
    excerpt: "Learn how to use AWS S3 with Node.js to store and retrieve files in the cloud.",
    content: `
# Working with AWS S3 in Node.js

Amazon S3 (Simple Storage Service) is a scalable object storage service that can be used to store and retrieve any amount of data from anywhere on the web.

## Setting Up AWS SDK

First, install the AWS SDK for JavaScript v3:

\`\`\`bash
npm install @aws-sdk/client-s3
\`\`\`

Then, configure the SDK with your credentials:

\`\`\`javascript
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
});
\`\`\`

## Uploading Files to S3

To upload a file to S3, use the PutObjectCommand:

\`\`\`javascript
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

async function uploadFile(bucketName, key, filePath) {
  const fileContent = fs.readFileSync(filePath);
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  });
  
  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
\`\`\`

## Downloading Files from S3

To download a file from S3, use the GetObjectCommand:

\`\`\`javascript
import { GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

async function downloadFile(bucketName, key, outputPath) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  try {
    const response = await s3Client.send(command);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Write to file
    fs.writeFileSync(outputPath, buffer);
    console.log("File downloaded successfully");
    return buffer;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
\`\`\`

## Conclusion

AWS S3 is a powerful service for storing and retrieving files. With the AWS SDK for JavaScript, you can easily integrate S3 into your Node.js applications.
    `,
    tags: ["aws", "s3", "nodejs"],
    coverImage: "/placeholder.svg?height=400&width=600",
  },
  {
    slug: "markdown-blog-with-nextjs",
    title: "Building a Markdown Blog with Next.js",
    date: "2023-04-19",
    excerpt: "Create a static blog using Next.js and Markdown files stored in AWS S3.",
    content: `
# Building a Markdown Blog with Next.js

In this tutorial, we'll build a static blog using Next.js that reads Markdown files from AWS S3.

## Project Setup

First, create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-blog
cd my-blog
\`\`\`

Install the necessary dependencies:

\`\`\`bash
npm install @aws-sdk/client-s3 gray-matter react-markdown
\`\`\`

## Fetching Markdown Files from S3

Create a utility function to fetch Markdown files from S3:

\`\`\`javascript
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import matter from "gray-matter";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getPosts() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: "content/",
  });

  const response = await s3Client.send(command);
  
  if (!response.Contents) {
    return [];
  }

  const posts = await Promise.all(
    response.Contents.filter(file => file.Key.endsWith(".md")).map(async (file) => {
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.Key,
      });

      const response = await s3Client.send(getObjectCommand);
      const contentString = await streamToString(response.Body);
      
      const { data, content } = matter(contentString);
      const slug = file.Key.replace("content/", "").replace(".md", "");
      
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content,
      };
    })
  );

  return posts;
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}
\`\`\`

## Creating the Blog Pages

Create a page to list all blog posts:

\`\`\`jsx
// pages/index.js
import Link from "next/link";
import { getPosts } from "../lib/s3";

export default function Home({ posts }) {
  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={'/blog/\${post.slug}'}>
              <a>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await getPosts();
  return {
    props: {
      posts,
    },
  };
}
\`\`\`

Create a page to display individual blog posts:

\`\`\`jsx
// pages/blog/[slug].js
import ReactMarkdown from "react-markdown";
import { getPosts, getPostBySlug } from "../../lib/s3";

export default function BlogPost({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = await getPosts();
  
  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: {
      post,
    },
  };
}
\`\`\`

## Conclusion

With Next.js and AWS S3, you can create a powerful static blog that's fast, secure, and easy to maintain. The blog content is stored in S3 as Markdown files, making it easy to update and manage.
    `,
    tags: ["nextjs", "markdown", "blog"],
  },
  {
    slug: "tailwind-css-tips-and-tricks",
    title: "Tailwind CSS Tips and Tricks",
    date: "2023-04-05",
    excerpt: "Learn some useful tips and tricks for working with Tailwind CSS in your projects.",
    content: `
# Tailwind CSS Tips and Tricks

Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. Here are some tips and tricks to help you get the most out of Tailwind.

## 1. Use the JIT (Just-In-Time) Mode

Tailwind CSS v3 comes with JIT mode enabled by default. This means that Tailwind will generate the CSS for the classes you actually use, resulting in much smaller file sizes.

## 2. Create Custom Utilities

You can extend Tailwind's utility classes by adding your own in the \`tailwind.config.js\` file:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      colors: {
        'brand': '#3490dc',
      },
    },
  },
}
\`\`\`

## 3. Use @apply for Reusable Styles

If you find yourself repeating the same set of utility classes, you can extract them into a CSS class using \`@apply\`:

\`\`\`css
/* In your CSS file */
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}
\`\`\`

## 4. Use Variants

Tailwind provides variants like \`hover:\`, \`focus:\`, \`dark:\`, etc., to apply styles conditionally:

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 text-white">
  Hover me
</button>
\`\`\`

## 5. Group Hover

Use \`group\` and \`group-hover:\` to apply hover styles to child elements when a parent is hovered:

\`\`\`html
<div class="group">
  <h3>Title</h3>
  <p class="text-gray-600 group-hover:text-black">
    This text changes color when the parent is hovered.
  </p>
</div>
\`\`\`

## 6. Use Arbitrary Values

When you need a specific value that's not in your theme, use square brackets:

\`\`\`html
<div class="top-[117px] w-[342px]">
  Precise positioning
</div>
\`\`\`

## 7. Responsive Design

Tailwind makes responsive design easy with breakpoint prefixes:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
\`\`\`

## Conclusion

Tailwind CSS provides a powerful set of tools for building custom designs. By leveraging these tips and tricks, you can write more efficient and maintainable CSS.
    `,
    tags: ["css", "tailwind", "web-design"],
    coverImage: "/placeholder.svg?height=400&width=600",
  },
]

// Check if AWS credentials are available
function hasAwsCredentials(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_S3_BUCKET_NAME
  )
}

// Get S3 client
function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}

// Helper function to convert stream to string
async function streamToString(stream: any): Promise<string> {
  const chunks: Uint8Array[] = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks).toString("utf-8")
}

// Fetch posts list from posts.json in S3
async function fetchPostsMetadata(): Promise<PostMetadata[]> {
  const s3Client = getS3Client()
  const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""
  const POSTS_JSON_PATH = process.env.POSTS_JSON_PATH || "posts.json"

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: POSTS_JSON_PATH,
    })

    const response = await s3Client.send(command)
    const contentStream = response.Body

    if (!contentStream) {
      console.log(`No content stream for ${POSTS_JSON_PATH}`)
      return []
    }

    // Convert stream to string
    const contentString = await streamToString(contentStream)

    // Parse JSON
    const postsMetadata: PostMetadata[] = JSON.parse(contentString)
    return postsMetadata
  } catch (error) {
    console.error(`Error fetching posts metadata from ${POSTS_JSON_PATH}:`, error)
    return []
  }
}

// Fetch post content from S3
async function fetchPostContent(filePath: string): Promise<string | null> {
  const s3Client = getS3Client()
  const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    })

    const response = await s3Client.send(command)
    const contentStream = response.Body

    if (!contentStream) {
      console.log(`No content stream for ${filePath}`)
      return null
    }

    // Convert stream to string
    const contentString = await streamToString(contentStream)
    return contentString
  } catch (error) {
    console.error(`Error fetching post content from ${filePath}:`, error)
    return null
  }
}

// Get all posts (either from S3 posts.json or dummy data)
export async function getPosts(): Promise<Post[]> {
  // If no AWS credentials, return dummy data
  if (!hasAwsCredentials()) {
    console.log("No AWS credentials found. Using dummy data.")
    return dummyPosts
  }

  try {
    // Fetch posts metadata from posts.json
    const postsMetadata = await fetchPostsMetadata()

    if (!postsMetadata || postsMetadata.length === 0) {
      console.log("No posts metadata found in posts.json. Using dummy data.")
      return dummyPosts
    }

    // Sort posts by date (newest first)
    return postsMetadata
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
      .map((metadata) => ({
        ...metadata,
        content: "", // Content will be fetched separately when needed
      }))
  } catch (error) {
    console.error("Error fetching posts:", error)
    // Return dummy data if there's an error
    return dummyPosts
  }
}

// Get a specific post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // If no AWS credentials, return dummy post
  if (!hasAwsCredentials()) {
    const dummyPost = dummyPosts.find((post) => post.slug === slug)
    return dummyPost || null
  }

  try {
    // Fetch posts metadata from posts.json
    const postsMetadata = await fetchPostsMetadata()

    if (!postsMetadata || postsMetadata.length === 0) {
      console.log("No posts metadata found in posts.json. Using dummy data.")
      const dummyPost = dummyPosts.find((post) => post.slug === slug)
      return dummyPost || null
    }

    // Find the post metadata by slug
    const postMetadata = postsMetadata.find((post) => post.slug === slug)

    if (!postMetadata) {
      console.log(`Post with slug ${slug} not found in posts.json. Using dummy data.`)
      const dummyPost = dummyPosts.find((post) => post.slug === slug)
      return dummyPost || null
    }

    // Get the file path from metadata or construct it
    const CONTENT_PATH = process.env.S3_CONTENT_PATH || "content/"
    const filePath = postMetadata.filePath || `${CONTENT_PATH}${slug}.md`

    // Fetch the post content
    const contentString = await fetchPostContent(filePath)

    if (!contentString) {
      console.log(`Content for post ${slug} not found. Using dummy data.`)
      const dummyPost = dummyPosts.find((post) => post.slug === slug)
      return dummyPost || null
    }

    // Parse frontmatter if it exists
    let content = contentString
    let frontmatterData = {}

    // Check if the content has frontmatter
    if (contentString.trim().startsWith("---")) {
      const { data, content: parsedContent } = matter(contentString)
      content = parsedContent
      frontmatterData = data
    }

    // Combine metadata with content
    const post: Post = {
      ...postMetadata,
      content,
      // Override metadata with frontmatter if it exists
      title: frontmatterData.title || postMetadata.title,
      date: frontmatterData.date ? new Date(frontmatterData.date).toLocaleDateString() : postMetadata.date,
      excerpt: frontmatterData.excerpt || postMetadata.excerpt,
      tags: frontmatterData.tags || postMetadata.tags,
      coverImage: frontmatterData.coverImage || postMetadata.coverImage,
    }
    return post
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error)
    // Try to find the post in dummy data
    const dummyPost = dummyPosts.find((post) => post.slug === slug)
    return dummyPost || null
  }
}
