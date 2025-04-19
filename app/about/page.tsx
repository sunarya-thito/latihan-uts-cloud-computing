import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <Avatar className="w-48 h-48 bg-primary/10 rounded-lg flex items-center justify-center">
              <AvatarImage src={"https://avatars.githubusercontent.com/u/64018564?v=4"} />
              <AvatarFallback className="text-5xl font-bold text-primary/30">ST</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">sunarya-thito</h2>
            <p className="text-muted-foreground mb-4 text-justify">
              Hello! I'm Thito Yalasatria Sunarya, a developer passionate about building things for the web and beyond. This is my
              personal blog where I share my thoughts, projects, and experiences.
            </p>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/sunarya-thito"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors"
              >
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
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h3>About This Blog</h3>
          <p>
            This blog is a space where I share my thoughts, experiences, and projects with the world.
          </p>

          <h3>My Interests</h3>
          <ul>
            <li>Web Development</li>
            <li>Cloud Architecture</li>
            <li>Open Source Software</li>
            <li>Developer Tools</li>
          </ul>

          <h3>Get In Touch</h3>
          <p>
            Feel free to reach out to me on GitHub or through any of my social media profiles. I'm always interested in
            collaborating on interesting projects or just chatting about tech.
          </p>
        </div>
      </div>
    </main>
  )
}
