import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireAdmin, getTelegramUser, isAdmin } from '@/lib/adminCheck';
import { adminBlogService } from '@/services/adminBlogService';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function BlogDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const user = getTelegramUser();
      console.log('🔐 Admin Check:', {
        user,
        telegramId: user?.id,
        isAdmin: user ? isAdmin(user.id) : false
      });
      
      requireAdmin(user);
      console.log('✅ Admin access granted');
      fetchAllPosts();
    } catch (error) {
      console.error('❌ Admin access denied:', error);
      alert('⛔ Admin access required\n\nYour Telegram ID: ' + (getTelegramUser()?.id || 'Not logged in') + '\n\nRequired ID: 1226785406');
      navigate('/blog');
    }
  }, []);

  const fetchAllPosts = async () => {
    try {
      const data = await adminBlogService.fetchAllPosts();
      if (data) setPosts(data);
    } catch (error: any) {
      alert('❌ Error fetching posts: ' + error.message);
    }
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    
    try {
      await adminBlogService.deletePost(id);
      alert('✅ Post deleted');
      fetchAllPosts();
    } catch (error: any) {
      alert('❌ Error deleting post: ' + error.message);
    }
  };

  const togglePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const published_at = newStatus === 'published' ? new Date().toISOString() : null;
    
    try {
      await adminBlogService.togglePublish(id, newStatus, published_at);
      fetchAllPosts();
    } catch (error: any) {
      alert('❌ Error toggling publish: ' + error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-secondary rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/admin/blog/new')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        {/* Posts Table */}
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Published</th>
                  <th className="text-left p-4 font-semibold">Views</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => (
                  <tr key={post.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">/blog/{post.slug}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        post.status === 'published' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {post.published_at 
                        ? new Date(post.published_at).toLocaleDateString()
                        : '-'
                      }
                    </td>
                    <td className="p-4 text-sm">{post.view_count}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                          className="p-2 hover:bg-secondary rounded transition-smooth"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(post.id, post.status)}
                          className="p-2 hover:bg-secondary rounded transition-smooth"
                          title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {post.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-smooth"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
