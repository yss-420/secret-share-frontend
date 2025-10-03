import { useEffect, useRef } from 'react';
import Quill from 'quill';

interface BlogContentProps {
  content: any;
}

export default function BlogContent({ content }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && content) {
      const tempQuill = new Quill(containerRef.current, {
        theme: 'snow',
        readOnly: true,
        modules: { toolbar: false }
      });

      tempQuill.setContents(content);

      return () => {
        tempQuill.disable();
      };
    }
  }, [content]);

  return (
    <div className="blog-content-wrapper">
      <div ref={containerRef} className="ql-editor" />
    </div>
  );
}
