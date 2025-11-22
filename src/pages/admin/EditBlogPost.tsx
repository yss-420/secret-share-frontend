import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminBlogService } from '@/services/adminBlogService';
import QuillEditor from '@/components/QuillEditor';
import { ArrowLeft, Save, Send } from 'lucide-react';

export default function EditBlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchPost(slug);
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const data = await adminBlogService.fetchPost(postSlug);
      
      if (data) {
        setPostId(data.id);
        setTitle(data.title);
        setPostSlug(data.slug);
        setMetaDescription(data.meta_description || '');
        setFeaturedImage(data.featured_image_url || '');
        setKeywords(data.keywords?.join(', ') || '');
        setContent(data.content);
      }
    } catch (error: any) {
      console.error('❌ Admin access denied:', error);
      alert('⛔ Admin access required\n\n' + error.message);
      navigate('/blog');
    }
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadingTime = () => {
    if (!content) return 0;
    const text = JSON.stringify(content);
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const savePost = async (status: 'draft' | 'published') => {
    if (!title.trim()) return alert('❌ Title is required');
    if (!postSlug.trim()) return alert('❌ Slug is required');
    if (!content) return alert('❌ Content is required');
    if (!metaDescription.trim()) return alert('❌ Meta description is required for SEO');

    setSaving(true);

    try {
      const postData = {
        slug: postSlug,
        title,
        meta_description: metaDescription,
        content,
        featured_image_url: featuredImage || null,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        reading_time_minutes: calculateReadingTime(),
        og_title: title,
        og_description: metaDescription,
        og_image_url: featuredImage || null
      };

      await adminBlogService.updatePost(postId, postData);
      alert(`✅ Post ${status === 'published' ? 'published' : 'saved as draft'}!`);
      navigate('/admin/blog');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    }

    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/blog')}
            className="p-2 hover:bg-secondary rounded-lg transition-smooth"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gradient">✏️ Edit Blog Post</h1>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="card-premium p-6">
            <label className="block mb-2 font-semibold">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="card-premium p-6">
            <label className="block mb-2 font-semibold">Slug (URL) *</label>
            <input
              type="text"
              value={postSlug}
              onChange={(e) => setPostSlug(generateSlug(e.target.value))}
              placeholder="post-url-slug"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <small className="text-muted-foreground">URL: /blog/{postSlug}</small>
          </div>

          <div className="card-premium p-6">
            <label className="block mb-2 font-semibold">Meta Description (SEO) *</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief description for search engines"
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <small className="text-muted-foreground">{metaDescription.length}/160 characters</small>
          </div>

          <div className="card-premium p-6">
            <label className="block mb-2 font-semibold">Keywords (comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="card-premium p-6">
            <label className="block mb-2 font-semibold">Featured Image URL</label>
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="card-premium p-6">
            <label className="block mb-2 font-semibold">Content *</label>
            <QuillEditor 
              initialContent={content}
              onChange={setContent} 
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => savePost('draft')}
              disabled={saving}
              className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Draft
            </button>
            <button
              onClick={() => savePost('published')}
              disabled={saving}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
