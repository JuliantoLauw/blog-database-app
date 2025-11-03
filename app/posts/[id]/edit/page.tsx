'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } else {
        alert("Gagal memuat data post");
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    console.log("PUT Response:", res.status);

    if (res.ok) {
      router.push(`/posts/${id}`);
    } else {
      const err = await res.json();
      alert(`Gagal update: ${err.error || "Unknown error"}`);
    }
  };

  return (
    <main className="container mt-4">
      <h1>Edit Post</h1>
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
          <label className="form-label">Content</label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={content}
            init={{
                height: 300,
                menubar: false,
                plugins: ["link image code", "table lists wordcount"],
                toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code"
            }}
            onEditorChange={(newValue) => setContent(newValue)}
            />
        </div>
        <button className="btn btn-success">Update</button>
      </form>
    </main>
  );
}
