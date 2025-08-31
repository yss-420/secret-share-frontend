-- Fix conversations table RLS policies to allow users to access their own conversations
-- Currently only service role can access, which breaks user functionality

-- Add policy for users to view their own conversations
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (user_id = ((auth.uid())::text)::bigint);

-- Add policy for users to insert their own conversations
CREATE POLICY "Users can insert their own conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (user_id = ((auth.uid())::text)::bigint);

-- Add policy for users to update their own conversations (if needed)
CREATE POLICY "Users can update their own conversations" 
ON public.conversations 
FOR UPDATE 
USING (user_id = ((auth.uid())::text)::bigint)
WITH CHECK (user_id = ((auth.uid())::text)::bigint);

-- Add policy for users to delete their own conversations (if needed)
CREATE POLICY "Users can delete their own conversations" 
ON public.conversations 
FOR DELETE 
USING (user_id = ((auth.uid())::text)::bigint);