import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  author?: string;
  createdAt: Date;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const slug = window.location.pathname.split("/blog/")[1];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          setLocation("/");
          return;
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
        <Button onClick={() => setLocation("/")} variant="outline">
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/#blog")}
          className="mb-8"
          data-testid="button-back-to-blog"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al blog
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {post.image && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary" data-testid="text-post-category">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span data-testid="text-post-author">{post.author || "EcoRed Comunal"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span data-testid="text-post-date">
                  {new Date(post.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Card className="border-border mb-8">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-invert max-w-none text-foreground" data-testid="text-post-content">
                <p className="text-lg text-muted-foreground mb-6 italic">
                  {post.excerpt}
                </p>
                
                <div className="space-y-6 whitespace-pre-wrap text-base leading-relaxed">
                  {post.content}
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Sobre este artículo</h3>
                  <p className="text-sm text-muted-foreground">
                    Este artículo es parte de nuestro blog de economía circular, donde compartimos
                    conocimientos sobre sostenibilidad, reciclaje y cómo crear cambio positivo en
                    nuestras comunidades. Para más información, visita el blog principal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              variant="default"
              onClick={() => setLocation("/#blog")}
              data-testid="button-back-to-blog-bottom"
            >
              Volver a otros artículos
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation("/#contacto")}
              data-testid="button-contact-from-post"
            >
              Contacta con nosotros
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
