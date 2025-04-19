# Getting Started with Next.js (App Router)

Next.js is a powerful React framework that enables developers to build fast, scalable, and SEO-friendly web applications. With the introduction of the App Router, Next.js provides a more flexible and intuitive way to structure your application. In this guide, we'll walk you through the basics of getting started with Next.js using the App Router.

## Prerequisites

Before diving in, ensure you have the following installed on your system:

- **Node.js** (version 16.8 or later)
- **npm** or **yarn** (package managers)

You can download Node.js from [nodejs.org](https://nodejs.org/).

## Setting Up a New Next.js Project

1. **Create a New Project**  
    Run the following command to create a new Next.js application:
    ```bash
    npx create-next-app@latest my-nextjs-app
    ```
    Replace `my-nextjs-app` with your desired project name.

2. **Navigate to the Project Directory**  
    ```bash
    cd my-nextjs-app
    ```

3. **Start the Development Server**  
    Launch the development server with:
    ```bash
    npm run dev
    ```
    Your application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure with the App Router

With the App Router, Next.js introduces a new `app/` directory for building your application. Here's an overview of the key folders:

- **`app/`**: The main directory for defining routes and layouts. Each folder inside `app/` can represent a route.
- **`public/`**: Stores static assets like images and fonts.
- **`styles/`**: Contains CSS files for styling.

## Creating Your First Page with the App Router

1. Inside the `app/` directory, create a new folder named `about` and add a `page.js` file:
    ```javascript
    export default function About() {
         return <h1>About Page</h1>;
    }
    ```

2. Visit [http://localhost:3000/about](http://localhost:3000/about) to see your new page.

## Adding Layouts

The App Router allows you to define layouts for your application. To create a layout:

1. Inside the `app/` directory, create a `layout.js` file:
    ```javascript
    export default function RootLayout({ children }) {
         return (
             <html lang="en">
                 <body>
                     <header>
                         <h1>My Next.js App</h1>
                     </header>
                     {children}
                 </body>
             </html>
         );
    }
    ```

2. This layout will wrap all pages within the `app/` directory.

## Adding Styles

Next.js supports CSS Modules and global styles. To style your components:

1. Create a CSS file in the `styles/` folder, e.g., `styles/globals.css`:
    ```css
    body {
         font-family: Arial, sans-serif;
         margin: 0;
         padding: 0;
    }
    ```

2. Import the global styles in your `layout.js` file:
    ```javascript
    import '../styles/globals.css';

    export default function RootLayout({ children }) {
         return (
             <html lang="en">
                 <body>{children}</body>
             </html>
         );
    }
    ```

## Deploying Your Application

Once your application is ready, you can deploy it to platforms like [Vercel](https://vercel.com/) with a single command:
```bash
vercel
```

## Conclusion

The App Router in Next.js simplifies the process of building modern web applications with features like layouts, server components, and nested routing. Start exploring its capabilities and build something amazing!

Happy coding!