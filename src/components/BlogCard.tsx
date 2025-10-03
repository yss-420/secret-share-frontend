import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    meta_description: string;
    featured_image_url?: string;
    published_at: string;
    reading_time_minutes: number;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="card-premium transition-smooth cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      {post.featured_image_url && (
        <img 
          src={post.featured_image_url} 
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4">
          {post.meta_description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.reading_time_minutes} min read</span>
        </div>
      </div>
    </div>
  );
}
