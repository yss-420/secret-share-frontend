import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import BlogContent from '@/components/BlogContent';
import { ArrowLeft } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchPost(slug);
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    const { data } = await (supabase as any)
      .from('blog_posts')
      .select('*')
      .eq('slug', postSlug)
      .eq('status', 'published')
      .single();
    
    if (data) {
      setPost(data);
      
      // Increment view count
      (supabase as any)
        .from('blog_posts')
        .update({ view_count: data.view_count + 1 })
        .eq('id', data.id)
        .then(() => {});
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="card-premium p-12 text-center">
            <h1 className="text-2xl font-bold mb-4">404 - Post Not Found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
            >
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Secret Share Blog</title>
        <meta name="description" content={post.meta_description} />
        <meta property="og:title" content={post.og_title || post.title} />
        <meta property="og:description" content={post.og_description || post.meta_description} />
        <meta property="og:image" content={post.og_image_url || post.featured_image_url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <article className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </button>

          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <time>
                {new Date(post.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              {post.reading_time_minutes && (
                <>
                  <span>•</span>
                  <span>{post.reading_time_minutes} min read</span>
                </>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <img 
              src={post.featured_image_url} 
              alt={post.title}
              className="w-full rounded-lg mb-8"
            />
          )}

          {/* Post Content */}
          <div className="card-premium p-8">
            <BlogContent content={post.content} />
          </div>
        </article>
      </div>
    </>
  );
}
