import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { type NextRequest, NextResponse } from "next/server"

// Helper function to convert stream to buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
    const chunks: Uint8Array[] = []

    for await (const chunk of stream) {
        chunks.push(chunk)
    }

    return Buffer.concat(chunks)
}

// Helper function to convert stream to string
async function streamToString(stream: any): Promise<string> {
    const buffer = await streamToBuffer(stream)
    return buffer.toString("utf-8")
}

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
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
    })
}

// Determine content type based on file extension
function getContentType(filePath: string): string {
    const extension = filePath.split(".").pop()?.toLowerCase() || ""

    const contentTypes: Record<string, string> = {
        txt: "text/plain",
        html: "text/html",
        htm: "text/html",
        md: "text/markdown",
        markdown: "text/markdown",
        json: "application/json",
        js: "application/javascript",
        css: "text/css",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        webp: "image/webp",
        pdf: "application/pdf",
    }

    return contentTypes[extension] || "application/octet-stream"
}

// API route handler
export async function GET(request: NextRequest): Promise<Response> {
    // Check if AWS credentials are available
    if (!hasAwsCredentials()) {
        return NextResponse.json({ error: "AWS credentials not configured" }, { status: 500 })
    }

    // Get the file path from the query parameters
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")
    const returnType = searchParams.get("type") || "auto"

    // Validate file path
    if (!filePath) {
        return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    // Prevent directory traversal attacks
    if (filePath.includes("..")) {
        return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
    }

    try {
        const s3Client = getS3Client()
        const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
        })

        const response = await s3Client.send(command)
        const contentStream = response.Body

        if (!contentStream) {
            return NextResponse.json({ error: "File not found or empty" }, { status: 404 })
        }

        // Determine how to return the content based on returnType
        if (returnType === "json") {
            // Return as JSON
            const contentString = await streamToString(contentStream)
            try {
                const jsonData = JSON.parse(contentString)
                return NextResponse.json(jsonData)
            } catch (error) {
                return NextResponse.json({ error: "Invalid JSON content" }, { status: 400 })
            }
        } else if (returnType === "text") {
            // Return as text
            const contentString = await streamToString(contentStream)
            return new NextResponse(contentString, {
                headers: {
                    "Content-Type": "text/plain",
                },
            })
        } else if (returnType === "binary") {
            // Return as binary
            const buffer = await streamToBuffer(contentStream)
            return new NextResponse(buffer, {
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            })
        } else {
            // Auto-detect content type based on file extension
            const contentType = getContentType(filePath)

            if (
                contentType.startsWith("text/") ||
                contentType === "application/json" ||
                contentType === "application/javascript"
            ) {
                // Return as text for text-based content types
                const contentString = await streamToString(contentStream)
                return new NextResponse(contentString, {
                    headers: {
                        "Content-Type": contentType,
                    },
                })
            } else {
                // Return as binary for binary content types
                const buffer = await streamToBuffer(contentStream)
                return new NextResponse(buffer, {
                    headers: {
                        "Content-Type": contentType,
                    },
                })
            }
        }
    } catch (error: any) {
        console.error(`Error fetching file ${filePath} from S3:`, error)

        // Handle specific S3 errors
        if (error.name === "NoSuchKey") {
            return NextResponse.json({ error: "File not found" }, { status: 404 })
        }

        return NextResponse.json({ error: error.message || "Error fetching file from S3" }, { status: 500 })
    }
}
