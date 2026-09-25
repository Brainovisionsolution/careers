export interface Job {
  id: string;
  title: string;
  department: string;
  category: string;

  description: string | null;
  responsibilities: string[];
  requirements: string[];
  preferred_skills: string[];

  employment_type:
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'internship';

  work_mode:
    | 'remote'
    | 'hybrid'
    | 'onsite';

  experience_min: number;
  experience_max: number;

  location: string;

  salary_min: number | null;
  salary_max: number | null;

  benefits: string[];

  positions_available: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;

  job_id: string;

  full_name: string;
  email: string;
  phone: string;

  location: string;
  years_experience: number;

  current_company: string | null;
  current_designation: string | null;

  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;

  resume_url: string | null;
  demo_video_url?: string | null;

  certifications: string[];

  expertise_areas: string[];

  cover_letter: string | null;

  status:
    | 'pending'
    | 'screening'
    | 'technical'
    | 'hr'
    | 'offered'
    | 'hired'
    | 'rejected';

  rating: number | null;

  notes: string | null;

  applied_at: string;
  updated_at: string;

  job?: Job;
}

export interface Interview {
  id: string;

  application_id: string;

  interview_type:
    | 'screening'
    | 'technical'
    | 'hr';

  scheduled_at: string | null;

  duration_minutes: number;

  interviewer_name: string | null;
  interviewer_email: string | null;

  meeting_link: string | null;

  status:
    | 'scheduled'
    | 'completed'
    | 'cancelled'
    | 'rescheduled';

  feedback: string | null;

  interviewer_rating: number | null;

  created_at: string;
  updated_at: string;

  application?: Application;
}

export interface Testimonial {
  id: string;

  name: string;
  role: string;

  department: string | null;

  quote: string;

  image_url: string | null;

  is_active: boolean;

  created_at: string;
}

export interface FAQ {
  id: string;

  question: string;
  answer: string;

  category: string | null;

  display_order: number;

  is_active: boolean;

  created_at: string;
}