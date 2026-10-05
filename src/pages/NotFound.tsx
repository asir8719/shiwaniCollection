import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <>
    <SEO title="Page Not Found | Shiwani Collection" description="The page you requested could not be found." canonicalPath="/" noindex />
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-6 animate-bounce">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved to a new destination layout.
      </p>
      
      <Button render={<Link to="/" />} variant="default">
        {/* Redirects users back safely */}
        Return Home
      </Button>
    </div>
    </>
  );
}
