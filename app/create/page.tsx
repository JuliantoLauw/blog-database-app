'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, content }),
    });
    router.push('/');
  };

  return (
    <main className="container mt-4">
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
        <label className="form-label">Author</label>
        <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
        />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={content}
            init={{
              height: 300,
              menubar: false,
              toolbar:
                "undo redo | blocks fontfamily fontsize | formatselect | bold italic | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help"
            }}
            onEditorChange={(newValue) => setContent(newValue)}
          />
        </div>

        <button className="btn btn-success">Save</button>
      </form>
    </main>
  );
}
