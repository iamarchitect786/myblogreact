import { User, InsertUser, Post, InsertPost, Comment, InsertComment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { isAdmin: boolean }): Promise<User>;

  // Post management
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost, authorId: number): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;

  // Comment management
  getComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Like management
  addLike(postId: number, ipAddress: string): Promise<boolean>;
  removeLike(postId: number, ipAddress: string): Promise<boolean>;
  hasLiked(postId: number, ipAddress: string): Promise<boolean>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private likes: Map<string, Set<string>>;  // postId -> Set of IP addresses
  private userId: number;
  private postId: number;
  private commentId: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.userId = 1;
    this.postId = 1;
    this.commentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser & { isAdmin: boolean }): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost, authorId: number): Promise<Post> {
    const id = this.postId++;
    const post: Post = {
      ...insertPost,
      id,
      authorId,
      likes: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, update: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const updatedPost = { ...post, ...update };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.postId === postId,
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  async addLike(postId: number, ipAddress: string): Promise<boolean> {
    const post = this.posts.get(postId);
    if (!post) return false;

    const postLikes = this.likes.get(postId.toString()) || new Set();
    if (postLikes.has(ipAddress)) return false;

    postLikes.add(ipAddress);
    this.likes.set(postId.toString(), postLikes);

    post.likes++;
    this.posts.set(postId, post);
    return true;
  }

  async removeLike(postId: number, ipAddress: string): Promise<boolean> {
    const post = this.posts.get(postId);
    if (!post) return false;

    const postLikes = this.likes.get(postId.toString());
    if (!postLikes || !postLikes.has(ipAddress)) return false;

    postLikes.delete(ipAddress);
    post.likes--;
    this.posts.set(postId, post);
    return true;
  }

  async hasLiked(postId: number, ipAddress: string): Promise<boolean> {
    const postLikes = this.likes.get(postId.toString());
    return postLikes ? postLikes.has(ipAddress) : false;
  }
}

export const storage = new MemStorage();