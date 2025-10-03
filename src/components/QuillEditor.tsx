import { useEffect, useRef } from 'react';
import Quill from 'quill';

interface QuillEditorProps {
  initialContent?: any;
  onChange?: (content: any) => void;
}

export default function QuillEditor({ initialContent, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: 'Write your blog post content here...'
      });

      if (initialContent) {
        quillRef.current.setContents(initialContent);
      }

      quillRef.current.on('text-change', () => {
        if (onChange && quillRef.current) {
          onChange(quillRef.current.getContents());
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div ref={editorRef} className="min-h-[300px] bg-background" />
    </div>
  );
}
