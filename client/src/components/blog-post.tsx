import { useAuth } from "@/hooks/use-auth";
import { Post, InsertPost, Comment, InsertComment } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommentSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface BlogPostProps {
  post: Post;
  onEdit: (post: Post) => void;
}

export default function BlogPost({ post, onEdit }: BlogPostProps) {
  const { user } = useAuth();
  const isAuthor = user?.id === post.authorId;

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/posts", post.id, "comments"],
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/posts/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const commentForm = useForm({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      content: "",
      postId: post.id,
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: InsertComment) => {
      const res = await apiRequest("POST", `/api/posts/${post.id}/comments`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post.id, "comments"] });
      commentForm.reset();
    },
  });

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-sm text-muted-foreground">
            Posted on {format(new Date(post.createdAt), "PPP")}
          </p>
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deletePostMutation.mutate()}
              disabled={deletePostMutation.isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p>{post.content}</p>
        </div>
        <div className="mt-4 flex gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted p-4 rounded-lg">
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
        {user && (
          <Form {...commentForm}>
            <form
              onSubmit={commentForm.handleSubmit((data) =>
                createCommentMutation.mutate(data)
              )}
              className="flex gap-2"
            >
              <FormField
                control={commentForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Write a comment..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createCommentMutation.isPending}
              >
                Comment
              </Button>
            </form>
          </Form>
        )}
      </CardFooter>
    </Card>
  );
}
