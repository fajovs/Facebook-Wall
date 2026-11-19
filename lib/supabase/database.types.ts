export type Post = {
  id: string
  user_id: string | null
  body: string | null
  created_at: string | null
}

export type PostImage = {
  id: string
  post_id: string
  image_url: string
  storage_path: string
  created_at: string | null
}

export type WallPost = Post & {
  post_images: PostImage[]
}

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: {
          id?: string
          user_id?: string | null
          body?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          body?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      post_images: {
        Row: PostImage
        Insert: {
          id?: string
          post_id: string
          image_url: string
          storage_path: string
          created_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          image_url?: string
          storage_path?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
