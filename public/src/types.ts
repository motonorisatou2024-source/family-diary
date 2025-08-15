// 型定義
export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

export interface DiaryEntry {
  id:string;
  title: string;
  content: string;
  author_id: string;
  author?: User;
  privacy_level: 'family' | 'parents_only' | 'private';
  event_date: string;
  created_at: string;
  images?: { id: string; image_url: string; caption?: string }[];
  like_count?: number;
  comment_count?: number;
  is_liked?: boolean;
  category?: { id: string; name: string; color: string };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author?: User;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
