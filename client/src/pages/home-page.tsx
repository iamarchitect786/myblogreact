import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import PostList from "@/components/post-list";
import CreatePost from "@/components/create-post";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">BlogApp</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username}!</span>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <Button onClick={() => setShowCreatePost(true)}>
            Create New Post
          </Button>
        </div>

        <PostList searchTerm={searchTerm} />

        <CreatePost
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
        />
      </main>
    </div>
  );
}
