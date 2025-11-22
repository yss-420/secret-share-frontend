const FUNCTION_URL = 'https://pfuyxdqzbrjrtqlbkbku.supabase.co/functions/v1/admin-blog-operations';

const getTelegramInitData = (): string | null => {
  if (typeof window === 'undefined') return null;
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initData || null;
};

const createHeaders = (): HeadersInit => {
  const initData = getTelegramInitData();
  
  if (!initData) {
    throw new Error('Telegram authentication required');
  }

  return {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': initData
  };
};

export const adminBlogService = {
  async createPost(postData: any) {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        operation: 'create',
        postData
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
      headers: createHeaders(),
      body: JSON.stringify({
        operation: 'update',
        postId,
        postData
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
      headers: createHeaders(),
      body: JSON.stringify({
        operation: 'delete',
        postId
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
      headers: createHeaders(),
      body: JSON.stringify({
        operation: 'fetch',
        postSlug
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
      headers: createHeaders(),
      body: JSON.stringify({
        operation: 'fetchAll'
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
      headers: createHeaders(),
      body: JSON.stringify({
        operation: 'togglePublish',
        postId,
        status,
        published_at
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle publish');
    }
    
    return response.json();
  }
};
