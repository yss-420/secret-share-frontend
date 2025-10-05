import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import BlogCard from '@/components/BlogCard';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, meta_description, featured_image_url, published_at, reading_time_minutes')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
    } else if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Blog | Secret Share</title>
        <meta name="description" content="Latest news, updates, and guides from Secret Share" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-secondary rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gradient">Blog</h1>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <p className="text-muted-foreground">
                No posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
