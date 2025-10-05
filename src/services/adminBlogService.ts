const FUNCTION_URL = 'https://pfuyxdqzbrjrtqlbkbku.supabase.co/functions/v1/admin-blog-operations';

const getTelegramId = () => {
  if (typeof window === 'undefined') return null;
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user?.id || null;
};

export const adminBlogService = {
  async createPost(postData: any) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'create',
        data: { postData, telegramId: getTelegramId() }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }
    
    return response.json();
  },

  async updatePost(postId: string, postData: any) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'update',
        postId,
        data: { postData, telegramId: getTelegramId() }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update post');
    }
    
    return response.json();
  },

  async deletePost(postId: string) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'delete',
        postId,
        data: { telegramId: getTelegramId() }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }
    
    return response.json();
  },

  async fetchPost(postSlug: string) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'fetch',
        postSlug,
        data: { telegramId: getTelegramId() }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch post');
    }
    
    return response.json();
  },

  async fetchAllPosts() {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'fetchAll',
        data: { telegramId: getTelegramId() }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch posts');
    }
    
    return response.json();
  },

  async togglePublish(postId: string, status: string, published_at: string | null) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'togglePublish',
        postId,
        data: { status, published_at, telegramId: getTelegramId() }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle publish');
    }
    
    return response.json();
  }
};
