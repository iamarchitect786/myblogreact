import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { useState } from "react";
import BlogPost from "./blog-post";
import CreatePost from "./create-post";
import { Loader2 } from "lucide-react";

interface PostListProps {
  searchTerm: string;
}

export default function PostList({ searchTerm }: PostListProps) {
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const filteredPosts = posts.filter((post) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.category.toLowerCase().includes(searchLower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchTerm ? "No posts found matching your search" : "No posts yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredPosts.map((post) => (
        <BlogPost
          key={post.id}
          post={post}
          onEdit={(post) => setPostToEdit(post)}
        />
      ))}
      
      <CreatePost
        open={!!postToEdit}
        onOpenChange={(open) => !open && setPostToEdit(null)}
        postToEdit={postToEdit}
      />
    </div>
  );
}
