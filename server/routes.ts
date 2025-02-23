import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Blog post routes
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const post = await storage.getPost(parseInt(req.params.id));
    if (!post) return res.sendStatus(404);
    res.json(post);
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const result = insertPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const post = await storage.createPost(result.data, req.user!.id);
    res.status(201).json(post);
  });

  app.patch("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const post = await storage.getPost(parseInt(req.params.id));
    if (!post) return res.sendStatus(404);
    if (post.authorId !== req.user!.id) return res.sendStatus(403);

    const result = insertPostSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const updatedPost = await storage.updatePost(post.id, result.data);
    res.json(updatedPost);
  });

  app.delete("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const post = await storage.getPost(parseInt(req.params.id));
    if (!post) return res.sendStatus(404);
    if (post.authorId !== req.user!.id) return res.sendStatus(403);

    await storage.deletePost(post.id);
    res.sendStatus(204);
  });

  // Comment routes
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const comments = await storage.getComments(parseInt(req.params.postId));
    res.json(comments);
  });

  app.post("/api/posts/:postId/comments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertCommentSchema.safeParse({
      ...req.body,
      postId: parseInt(req.params.postId),
    });
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const comment = await storage.createComment(result.data, req.user!.id);
    res.status(201).json(comment);
  });

  const httpServer = createServer(app);
  return httpServer;
}
