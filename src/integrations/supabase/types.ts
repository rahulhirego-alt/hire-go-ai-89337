export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          candidate_id: string
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          candidate_id: string
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          candidate_id?: string
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string | null
          current_city: string | null
          current_country: string | null
          current_state: string | null
          date_of_birth: string | null
          education: Json | null
          experience: Json | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          home_city: string | null
          home_country: string | null
          home_state: string | null
          id: string
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
          video_resume_duration: number | null
          video_resume_url: string | null
        }
        Insert: {
          created_at?: string | null
          current_city?: string | null
          current_country?: string | null
          current_state?: string | null
          date_of_birth?: string | null
          education?: Json | null
          experience?: Json | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          home_city?: string | null
          home_country?: string | null
          home_state?: string | null
          id?: string
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
          video_resume_duration?: number | null
          video_resume_url?: string | null
        }
        Update: {
          created_at?: string | null
          current_city?: string | null
          current_country?: string | null
          current_state?: string | null
          date_of_birth?: string | null
          education?: Json | null
          experience?: Json | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          home_city?: string | null
          home_country?: string | null
          home_state?: string | null
          id?: string
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
          video_resume_duration?: number | null
          video_resume_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employers: {
        Row: {
          address: string | null
          city: string | null
          company_description: string | null
          company_logo_url: string | null
          company_name: string
          company_type: string | null
          country: string | null
          created_at: string | null
          founded_year: number | null
          gst_number: string | null
          hr_contact_name: string | null
          hr_email: string | null
          hr_mobile: string | null
          id: string
          industry_type: string | null
          linkedin_url: string | null
          number_of_employees: string | null
          pan_number: string | null
          state: string | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name: string
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          founded_year?: number | null
          gst_number?: string | null
          hr_contact_name?: string | null
          hr_email?: string | null
          hr_mobile?: string | null
          id?: string
          industry_type?: string | null
          linkedin_url?: string | null
          number_of_employees?: string | null
          pan_number?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          founded_year?: number | null
          gst_number?: string | null
          hr_contact_name?: string | null
          hr_email?: string | null
          hr_mobile?: string | null
          id?: string
          industry_type?: string | null
          linkedin_url?: string | null
          number_of_employees?: string | null
          pan_number?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          interview_address: string | null
          interview_date: string
          interview_platform:
            | Database["public"]["Enums"]["interview_platform"]
            | null
          interview_time: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          interviewer_name: string | null
          meeting_link: string | null
          notes: string | null
          status: Database["public"]["Enums"]["interview_status"] | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          interview_address?: string | null
          interview_date: string
          interview_platform?:
            | Database["public"]["Enums"]["interview_platform"]
            | null
          interview_time: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          interviewer_name?: string | null
          meeting_link?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          interview_address?: string | null
          interview_date?: string
          interview_platform?:
            | Database["public"]["Enums"]["interview_platform"]
            | null
          interview_time?: string
          interview_type?: Database["public"]["Enums"]["interview_type"]
          interviewer_name?: string | null
          meeting_link?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          address: string | null
          application_deadline: string | null
          banner_url: string | null
          benefits: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          employer_id: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          experience_years: string | null
          id: string
          interview_address: string | null
          interview_platform:
            | Database["public"]["Enums"]["interview_platform"]
            | null
          interview_type: Database["public"]["Enums"]["interview_type"]
          job_category: string
          job_description: string | null
          job_title: string
          job_type: Database["public"]["Enums"]["employment_type"]
          location_type: Database["public"]["Enums"]["location_type"]
          number_of_vacancies: number | null
          preferred_skills: string[] | null
          qualification: string | null
          required_skills: string[] | null
          salary_max: number | null
          salary_min: number | null
          salary_type: string | null
          start_date: string | null
          state: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
          work_schedule: Json | null
        }
        Insert: {
          address?: string | null
          application_deadline?: string | null
          banner_url?: string | null
          benefits?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          employer_id: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          experience_years?: string | null
          id?: string
          interview_address?: string | null
          interview_platform?:
            | Database["public"]["Enums"]["interview_platform"]
            | null
          interview_type: Database["public"]["Enums"]["interview_type"]
          job_category: string
          job_description?: string | null
          job_title: string
          job_type: Database["public"]["Enums"]["employment_type"]
          location_type: Database["public"]["Enums"]["location_type"]
          number_of_vacancies?: number | null
          preferred_skills?: string[] | null
          qualification?: string | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string | null
          start_date?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
          work_schedule?: Json | null
        }
        Update: {
          address?: string | null
          application_deadline?: string | null
          banner_url?: string | null
          benefits?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          employer_id?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          experience_years?: string | null
          id?: string
          interview_address?: string | null
          interview_platform?:
            | Database["public"]["Enums"]["interview_platform"]
            | null
          interview_type?: Database["public"]["Enums"]["interview_type"]
          job_category?: string
          job_description?: string | null
          job_title?: string
          job_type?: Database["public"]["Enums"]["employment_type"]
          location_type?: Database["public"]["Enums"]["location_type"]
          number_of_vacancies?: number | null
          preferred_skills?: string[] | null
          qualification?: string | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string | null
          start_date?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
          work_schedule?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          mobile_number: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          mobile_number?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills_master: {
        Row: {
          category: string
          created_at: string | null
          id: string
          skill_name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          skill_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          skill_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_assessments: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          question: string
          question_order: number
          response_duration: number | null
          updated_at: string | null
          video_response_url: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          question: string
          question_order: number
          response_duration?: number | null
          updated_at?: string | null
          video_response_url?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          question?: string
          question_order?: number
          response_duration?: number | null
          updated_at?: string | null
          video_response_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_assessments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role_type"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "applied"
        | "screening"
        | "shortlisted"
        | "interview_scheduled"
        | "rejected"
        | "offered"
        | "hired"
      employment_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "freelance"
      experience_level: "entry" | "mid" | "senior" | "lead" | "executive"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      interview_platform:
        | "zoom"
        | "google_meet"
        | "microsoft_teams"
        | "phone"
        | "in_person"
      interview_status:
        | "scheduled"
        | "completed"
        | "cancelled"
        | "rescheduled"
        | "pending"
      interview_type: "virtual" | "physical" | "hybrid"
      job_status: "draft" | "active" | "closed" | "paused"
      location_type: "onsite" | "remote" | "hybrid"
      user_role_type: "candidate" | "employer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "applied",
        "screening",
        "shortlisted",
        "interview_scheduled",
        "rejected",
        "offered",
        "hired",
      ],
      employment_type: [
        "full_time",
        "part_time",
        "contract",
        "internship",
        "freelance",
      ],
      experience_level: ["entry", "mid", "senior", "lead", "executive"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      interview_platform: [
        "zoom",
        "google_meet",
        "microsoft_teams",
        "phone",
        "in_person",
      ],
      interview_status: [
        "scheduled",
        "completed",
        "cancelled",
        "rescheduled",
        "pending",
      ],
      interview_type: ["virtual", "physical", "hybrid"],
      job_status: ["draft", "active", "closed", "paused"],
      location_type: ["onsite", "remote", "hybrid"],
      user_role_type: ["candidate", "employer", "admin"],
    },
  },
} as const
