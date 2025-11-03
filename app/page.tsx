"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/posts`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortBy === "date-asc")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "date-desc")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>

      <Link href="/create" className="btn btn-primary mb-3">
        Create Post
      </Link>

      <div className="mb-3">
        <label className="form-label">Sort by:</label>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title-asc">Title (A - Z)</option>
          <option value="title-desc">Title (Z - A)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="date-desc">Date (Newest First)</option>
        </select>
      </div>

      {sortedPosts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="list-group">
          {sortedPosts.map((post) => (
            <li key={post.id} className="list-group-item">
              <Link href={`/posts/${post.id}`} className="fw-bold">
                {post.title}
              </Link>
              <p className="mb-0 text-muted">
                Author: {post.author}{" "}
                {new Date(post.createdAt).toLocaleDateString("id-ID")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
