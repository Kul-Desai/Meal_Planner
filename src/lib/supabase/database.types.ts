export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      ai_generations: {
        Row: {
          created_at: string;
          duration_ms: number;
          error: string | null;
          id: string;
          input_tokens: number;
          kind: Database["public"]["Enums"]["ai_generation_kind"];
          model: string;
          ok: boolean;
          output_tokens: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          duration_ms?: number;
          error?: string | null;
          id?: string;
          input_tokens?: number;
          kind: Database["public"]["Enums"]["ai_generation_kind"];
          model: string;
          ok: boolean;
          output_tokens?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          duration_ms?: number;
          error?: string | null;
          id?: string;
          input_tokens?: number;
          kind?: Database["public"]["Enums"]["ai_generation_kind"];
          model?: string;
          ok?: boolean;
          output_tokens?: number;
          user_id?: string | null;
        };
        Relationships: [];
      };
      grocery_items: {
        Row: {
          category: string;
          checked: boolean;
          created_at: string;
          display_name: string;
          have_at_home: boolean;
          id: string;
          ingredient_id: string | null;
          list_id: string;
          quantity: number | null;
          source: Database["public"]["Enums"]["grocery_item_source"];
          unit: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          checked?: boolean;
          created_at?: string;
          display_name: string;
          have_at_home?: boolean;
          id?: string;
          ingredient_id?: string | null;
          list_id: string;
          quantity?: number | null;
          source: Database["public"]["Enums"]["grocery_item_source"];
          unit?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          checked?: boolean;
          created_at?: string;
          display_name?: string;
          have_at_home?: boolean;
          id?: string;
          ingredient_id?: string | null;
          list_id?: string;
          quantity?: number | null;
          source?: Database["public"]["Enums"]["grocery_item_source"];
          unit?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "grocery_items_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "grocery_items_list_owner_fkey";
            columns: ["list_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "grocery_lists";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      grocery_lists: {
        Row: {
          created_at: string;
          id: string;
          plan_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          plan_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          plan_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "grocery_lists_plan_owner_fkey";
            columns: ["plan_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "meal_plans";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      ingredients: {
        Row: {
          aliases: string[];
          allergens: string[];
          category: string;
          created_at: string;
          default_unit: string;
          diet_tags: string[];
          id: string;
          name: string;
        };
        Insert: {
          aliases?: string[];
          allergens?: string[];
          category: string;
          created_at?: string;
          default_unit: string;
          diet_tags?: string[];
          id?: string;
          name: string;
        };
        Update: {
          aliases?: string[];
          allergens?: string[];
          category?: string;
          created_at?: string;
          default_unit?: string;
          diet_tags?: string[];
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      meal_feedback: {
        Row: {
          created_at: string;
          id: string;
          note: string | null;
          plan_meal_id: string;
          rating: Database["public"]["Enums"]["meal_rating"];
          recipe_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          note?: string | null;
          plan_meal_id: string;
          rating: Database["public"]["Enums"]["meal_rating"];
          recipe_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          note?: string | null;
          plan_meal_id?: string;
          rating?: Database["public"]["Enums"]["meal_rating"];
          recipe_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meal_feedback_plan_meal_owner_fkey";
            columns: ["plan_meal_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "plan_meals";
            referencedColumns: ["id", "user_id"];
          },
          {
            foreignKeyName: "meal_feedback_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      meal_plans: {
        Row: {
          created_at: string;
          days: number;
          household_size: number;
          id: string;
          locked_at: string | null;
          start_date: string;
          status: Database["public"]["Enums"]["meal_plan_status"];
          summary: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          days: number;
          household_size: number;
          id?: string;
          locked_at?: string | null;
          start_date: string;
          status?: Database["public"]["Enums"]["meal_plan_status"];
          summary?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          days?: number;
          household_size?: number;
          id?: string;
          locked_at?: string | null;
          start_date?: string;
          status?: Database["public"]["Enums"]["meal_plan_status"];
          summary?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      pantry_items: {
        Row: {
          always_have: boolean;
          created_at: string;
          id: string;
          ingredient_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          always_have?: boolean;
          created_at?: string;
          id?: string;
          ingredient_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          always_have?: boolean;
          created_at?: string;
          id?: string;
          ingredient_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pantry_items_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
        ];
      };
      plan_meals: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          makes_leftover: Json | null;
          plan_id: string;
          protein_choice: string | null;
          recipe_id: string;
          servings: number;
          slot: string;
          status: Database["public"]["Enums"]["plan_meal_status"];
          updated_at: string;
          user_id: string;
          uses_leftover: Json | null;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          makes_leftover?: Json | null;
          plan_id: string;
          protein_choice?: string | null;
          recipe_id: string;
          servings: number;
          slot?: string;
          status?: Database["public"]["Enums"]["plan_meal_status"];
          updated_at?: string;
          user_id: string;
          uses_leftover?: Json | null;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          makes_leftover?: Json | null;
          plan_id?: string;
          protein_choice?: string | null;
          recipe_id?: string;
          servings?: number;
          slot?: string;
          status?: Database["public"]["Enums"]["plan_meal_status"];
          updated_at?: string;
          user_id?: string;
          uses_leftover?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "plan_meals_plan_owner_fkey";
            columns: ["plan_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "meal_plans";
            referencedColumns: ["id", "user_id"];
          },
          {
            foreignKeyName: "plan_meals_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      preferences: {
        Row: {
          allergies: string[];
          auto_draft: boolean;
          auto_draft_day: number;
          cooking_days: number[];
          created_at: string;
          diet: string;
          dislikes: string[];
          has_kids: boolean;
          household_size: number;
          max_minutes_weekday: number;
          max_minutes_weekend: number;
          mood_tags: string[];
          protein_likes: string[];
          reminder_time: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          allergies?: string[];
          auto_draft?: boolean;
          auto_draft_day?: number;
          cooking_days?: number[];
          created_at?: string;
          diet?: string;
          dislikes?: string[];
          has_kids?: boolean;
          household_size?: number;
          max_minutes_weekday?: number;
          max_minutes_weekend?: number;
          mood_tags?: string[];
          protein_likes?: string[];
          reminder_time?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          allergies?: string[];
          auto_draft?: boolean;
          auto_draft_day?: number;
          cooking_days?: number[];
          created_at?: string;
          diet?: string;
          dislikes?: string[];
          has_kids?: boolean;
          household_size?: number;
          max_minutes_weekday?: number;
          max_minutes_weekend?: number;
          mood_tags?: string[];
          protein_likes?: string[];
          reminder_time?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          onboarding_completed_at: string | null;
          timezone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          onboarding_completed_at?: string | null;
          timezone?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          onboarding_completed_at?: string | null;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      recipe_images: {
        Row: {
          created_at: string;
          fingerprint: string;
          id: string;
          imagekit_file_id: string | null;
          model: string | null;
          prompt: string | null;
          status: Database["public"]["Enums"]["recipe_image_status"];
          url: string | null;
        };
        Insert: {
          created_at?: string;
          fingerprint: string;
          id?: string;
          imagekit_file_id?: string | null;
          model?: string | null;
          prompt?: string | null;
          status?: Database["public"]["Enums"]["recipe_image_status"];
          url?: string | null;
        };
        Update: {
          created_at?: string;
          fingerprint?: string;
          id?: string;
          imagekit_file_id?: string | null;
          model?: string | null;
          prompt?: string | null;
          status?: Database["public"]["Enums"]["recipe_image_status"];
          url?: string | null;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          created_at: string;
          id: string;
          ingredient_id: string;
          note: string | null;
          optional: boolean;
          quantity: number;
          recipe_id: string;
          unit: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ingredient_id: string;
          note?: string | null;
          optional?: boolean;
          quantity: number;
          recipe_id: string;
          unit: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          ingredient_id?: string;
          note?: string | null;
          optional?: boolean;
          quantity?: number;
          recipe_id?: string;
          unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          base_servings: number;
          created_at: string;
          cuisine: string;
          fingerprint: string;
          id: string;
          minutes: number;
          mood_tag: string;
          protein_options: string[];
          source: string;
          steps: Json;
          summary: string;
          tags: string[];
          title: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          base_servings: number;
          created_at?: string;
          cuisine: string;
          fingerprint: string;
          id?: string;
          minutes: number;
          mood_tag: string;
          protein_options?: string[];
          source: string;
          steps: Json;
          summary: string;
          tags?: string[];
          title: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          base_servings?: number;
          created_at?: string;
          cuisine?: string;
          fingerprint?: string;
          id?: string;
          minutes?: number;
          mood_tag?: string;
          protein_options?: string[];
          source?: string;
          steps?: Json;
          summary?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      int_array_has_unique_values: {
        Args: { input: number[] };
        Returns: boolean;
      };
    };
    Enums: {
      ai_generation_kind: "plan" | "swap" | "image";
      grocery_item_source: "plan" | "manual";
      meal_plan_status: "draft" | "locked" | "archived";
      meal_rating: "loved" | "fine" | "not_again";
      plan_meal_status: "planned" | "cooked" | "skipped";
      recipe_image_status: "pending" | "ready" | "failed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      ai_generation_kind: ["plan", "swap", "image"],
      grocery_item_source: ["plan", "manual"],
      meal_plan_status: ["draft", "locked", "archived"],
      meal_rating: ["loved", "fine", "not_again"],
      plan_meal_status: ["planned", "cooked", "skipped"],
      recipe_image_status: ["pending", "ready", "failed"],
    },
  },
} as const;
