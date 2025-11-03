'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PostDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<unknown>(null);

    useEffect(() => {
        fetch(`/api/posts/${id}`).then(async (res) => {
            if (res.status === 404) router.push('/not-found');
            else setPost(await res.json());
        });
    }, [id, router]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Post deleted successfully!');
                router.push('/');
            } else {
                toast.error('Failed to delete post.');
            }
        } catch (error) {
            toast.error('Error deleting post.');
        }
    };

    if (!post) return <p className="container mt-4">Loading...</p>;

    return (
        <main className="container mt-4">
            <h1>{(post as { title: string }).title}</h1>
            <p className="text-muted">
                {new Date((post as { createdAt: string }).createdAt).toLocaleDateString('id-ID')}
            </p>
            <p dangerouslySetInnerHTML={{ __html: (post as { content: string }).content }}/>
            <button onClick={() => router.push(`/posts/${id}/edit`)} className="btn btn-warning me-2">
                Edit Post
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
                Delete Post
            </button>
            <button onClick={() => router.push('/')} className="btn btn-secondary ms-2">
                Back to Home
            </button>
        </main>
    );
}