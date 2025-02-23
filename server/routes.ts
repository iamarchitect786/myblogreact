import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAdmin } from "./auth";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Blog post routes - require admin for creation/editing
  app.get("/api/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const post = await storage.getPost(parseInt(req.params.id));
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", requireAdmin, async (req: Request, res: Response) => {
    try {
      const result = insertPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json(result.error);
      }

      const post = await storage.createPost(result.data, req.user!.id);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.patch("/api/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const post = await storage.getPost(parseInt(req.params.id));
      if (!post) return res.status(404).json({ message: "Post not found" });
      if (post.authorId !== req.user!.id) return res.status(403).json({ message: "Not authorized" });

      const result = insertPostSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json(result.error);
      }

      const updatedPost = await storage.updatePost(post.id, result.data);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const post = await storage.getPost(parseInt(req.params.id));
      if (!post) return res.status(404).json({ message: "Post not found" });
      if (post.authorId !== req.user!.id) return res.status(403).json({ message: "Not authorized" });

      await storage.deletePost(post.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Comment routes - public access for creation
  app.get("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const comments = await storage.getComments(parseInt(req.params.postId));
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const result = insertCommentSchema.safeParse({
        ...req.body,
        postId: parseInt(req.params.postId),
      });
      if (!result.success) {
        return res.status(400).json(result.error);
      }

      const comment = await storage.createComment(result.data);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Like management routes
  app.post("/api/posts/:id/like", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";

      const success = await storage.addLike(postId, ipAddress);
      if (!success) return res.status(400).json({ message: "Already liked or post not found" });
      res.status(200).json({ message: "Like added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add like" });
    }
  });

  app.delete("/api/posts/:id/like", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";

      const success = await storage.removeLike(postId, ipAddress);
      if (!success) return res.status(400).json({ message: "Not liked or post not found" });
      res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove like" });
    }
  });

  app.get("/api/posts/:id/like", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";

      const hasLiked = await storage.hasLiked(postId, ipAddress);
      res.json({ hasLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}