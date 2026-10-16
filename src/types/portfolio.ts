export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryType: 'backend' | 'fullstack' | 'infra';
  year: string;
  liveUrl?: string;
  githubUrl?: string;
  coverImage: string;
  screenshots: {
    title: string;
    image: string;
    caption: string;
  }[];
  summary: string;
  paragraphs: string[];
  metrics?: { label: string; value: string }[];
  tags: string[];
  impact?: {
    challenge: string;
    solution: string;
    roi: {
      metric: string;
      value: string;
      detail: string;
    }[];
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface TechSkill {
  name: string;
  category: 'Backend & APIs' | 'Databases & Querying' | 'Tools & Environments' | 'Frontend & Integration';
  level: 'Expert' | 'Advanced' | 'Proficient';
  icon: string;
  description: string;
  patterns?: string[];
  metrics?: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    explanation: string;
  };
}

export interface ApiEndpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  response: Record<string, unknown>;
}

export interface DeliveryStandard {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  deliverables: string[];
}
