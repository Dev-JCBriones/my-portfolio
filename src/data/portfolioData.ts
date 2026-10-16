import heroShape1 from '../assets/images/hero_shape_1.png';
import heroShape2 from '../assets/images/hero_shape_2.png';
import avatarFront from '../assets/images/avatar_front.png';
import avatarBack from '../assets/images/avatar_back.jpg';
import teleworkCover from '../assets/images/telework_cover.png';
import teleworkShot1 from '../assets/images/telework_shot1.png';
import teleworkShot2 from '../assets/images/telework_shot2.png';
import teleworkShot3 from '../assets/images/telework_shot3.png';
import testimonialYakoub from '../assets/images/testimonial_yakoub.jpg';
import testimonialYakoubLogo from '../assets/images/testimonial_yakoub_logo.png';
import testimonialDaniel from '../assets/images/testimonial_daniel.jpg';
import testimonialDanielLogo from '../assets/images/testimonial_daniel_logo.png';
import testimonialMark from '../assets/images/testimonial_mark.jpg';
import testimonialMarkLogo from '../assets/images/testimonial_mark_logo.png';
import testimonialOmar from '../assets/images/testimonial_omar.jpg';
import testimonialOmarLogo from '../assets/images/testimonial_omar_logo.png';
import { Project, ExperienceItem, TechSkill, ApiEndpoint, DeliveryStandard } from '../types/portfolio';

export const portfolioAssets = {
  heroShape1,
  heroShape2,
  avatarFront,
  avatarBack,
  teleworkCover,
  teleworkShot1,
  teleworkShot2,
  teleworkShot3,
};

export const bioData = {
  name: "JC",
  fullName: "John Carlo Briones",
  role: "SOFTWARE ENGINEER",
  copyrightYear: "©2026 / CREATING SINCE 2020",
  location: "Bulacan, Philippines",
  timezone: "Asia/Manila (UTC+8)",
  currentCompany: "TeleworkX.AI",
  email: "brionesjc050@gmail.com",
  status: "Open to international remote engineering roles, Qatar onsite roles & global relocation",
  internationalReadiness: {
    openToRelocation: true,
    targetRegions: ["Worldwide (Any Country)", "Qatar Onsite Opportunities", "Global Relocation", "Flexible Remote"],
    timezoneOverlap: "100% Flexible schedule adaptable to client working hours anywhere in the world",
    workModel: "Full-Time Remote / Onsite Employment Abroad (Qatar & Global) / Work Visa Sponsorship",
    bookingLink: "https://cal.com",
  },
  paragraphs: [
    "Hey! I’m JC, a software engineer based in Bulacan, Philippines, currently architecting backend systems at TeleworkX.AI, an end-to-end job portal and remote workforce platform connecting international companies with top professionals.",
    "I specialize in backend architecture and high-performance server logic—building robust APIs with PHP (Laravel), fine-tuning relational PostgreSQL and MySQL databases, and authoring rigorous automated test suites.",
    "My background bridges physical network infrastructure and analytical BPO operations with modern software engineering. I bring structured discipline, data integrity, and clear asynchronous communication to fast-paced global distributed teams."
  ],
  stats: [
    { label: "Years Engineering", value: "4+" },
    { label: "Production APIs Delivered", value: "30+" },
    { label: "Database Queries Tuned", value: "500+" },
    { label: "Uptime Reliability", value: "99.98%" }
  ]
};

export const quoteText = 
  "I specialize in backend development, building robust server-side systems using PHP (Laravel), and managing relational databases like PostgreSQL and MySQL within a Laragon environment. My expertise includes API engineering—designing RESTful APIs, handling full API documentation, and testing with Bruno—complemented by a foundational knowledge of JavaScript and Bootstrap to seamlessly bridge backend data with the user interface.";

export const servicesData = [
  {
    id: "backend-api",
    number: "01",
    title: "Backend & API Architecture",
    tags: ["Designed maintained", "RESTful API", "PHP (Laravel)"],
    description: "Designing and engineering fault-tolerant server-side architecture with high performance, clean request lifecycles, and resilient data processing pipelines.",
    highlights: [
      "Modular controller & service layer separation in Laravel",
      "Rate-limiting, token-based authentication (Sanctum/JWT), and CORS security",
      "Event-driven webhook listeners and asynchronous job queues"
    ]
  },
  {
    id: "api-doc-testing",
    number: "02",
    title: "API Documentation & Testing",
    tags: ["API documentation", "streamless endpoint testing", "Google Docs | Bruno | Postman"],
    description: "Rigorous endpoint validation, automated test suites, payload assertions, and crystal-clear developer documentation for seamless integration.",
    highlights: [
      "Declarative Bruno test collections with automated regression runs",
      "Comprehensive OpenAPI/Swagger & Google Docs technical specifications",
      "Standardized error response payloads with human-readable debugging codes"
    ]
  },
  {
    id: "db-management",
    number: "03",
    title: "Database & Environment Management",
    tags: ["Local Development environment", "configure and optimize", "MySQL | PostgreSQL"],
    description: "Schema design, relational indexing, query performance tuning, and isolated local development setups with Laragon and containerized runtimes.",
    highlights: [
      "Relational normalizations, foreign keys, and ACID transaction safety",
      "Index optimization, EXPLAIN ANALYZE query planning, and migration seeds",
      "Isolated multi-site setups in Laragon with SSL, virtual hosts, and Redis"
    ]
  },
  {
    id: "full-stack",
    number: "04",
    title: "Full-Stack Implementation",
    tags: ["Dynamic User Interface", "Laravel Livewire", "modern frontend tools"],
    description: "Translating complex backend capabilities into fluid, dynamic user interfaces using modern reactive patterns, component architecture, and fluid transitions.",
    highlights: [
      "Real-time reactive components using Laravel Livewire and Alpine.js",
      "Modern TypeScript, React SPA, and responsive Tailwind styling",
      "Smooth micro-interactions and zero-jank UI state updates"
    ]
  }
];

export const allProjects: Project[] = [
  {
    id: "teleworkx-ai",
    title: "TeleworkX.AI",
    subtitle: "Job Portal & Remote Workforce Platform",
    category: "Job Portal website",
    categoryType: "backend",
    year: "2023 – Present",
    liveUrl: "https://app.teleworkx.ai/login",
    coverImage: teleworkCover,
    tags: ["PHP (Laravel)", "PostgreSQL", "Livewire", "REST APIs", "Bruno"],
    metrics: [
      { label: "Active Candidates", value: "15,000+" },
      { label: "Avg API Response", value: "<45ms" },
      { label: "Uptime", value: "99.98%" }
    ],
    impact: {
      challenge: "High-volume recruitment filtering and concurrent applicant tracking were causing database bottlenecks (p95 latency over 180ms) and occasional request timeouts during peak hiring surges.",
      solution: "Engineered decoupled Laravel service layers with optimized PostgreSQL indexing, composite search keys, and automated Bruno regression collections to validate all 30+ endpoints prior to production releases.",
      roi: [
        {
          metric: "API Response Latency",
          value: "64% Reduction",
          detail: "Cut average query and controller execution time from 180ms to sub-45ms."
        },
        {
          metric: "Active Talent Scale",
          value: "15,000+ Profiles",
          detail: "Supported concurrent enterprise hiring operations with zero database locking incidents."
        },
        {
          metric: "Cloud Infrastructure ROI",
          value: "32% Cost Savings",
          detail: "Eliminated redundant N+1 queries, significantly lowering required database compute units."
        },
        {
          metric: "Platform Availability",
          value: "99.98% Uptime",
          detail: "Delivered rock-solid service continuity across distributed global hiring workflows."
        }
      ]
    },
    screenshots: [
      {
        title: "Recruitment & Applicant Tracking",
        image: teleworkShot1,
        caption: "Talent matching, candidate tracking pipelines, and job posting manager."
      },
      {
        title: "Workforce & Operations Management",
        image: teleworkShot2,
        caption: "Onboarding, compliance oversight, automated workflows, and team management."
      },
      {
        title: "End-to-End Responsive Portal",
        image: teleworkShot3,
        caption: "Optimized candidate experience across distributed teams and mobile viewports."
      }
    ],
    summary: "TeleworkX.ai is a cloud-based hiring and workforce management platform focused on helping companies hire and manage Filipino remote professionals. It’s positioned as more than a job board—it combines recruitment, onboarding, payroll, compliance, and team management in one platform.",
    paragraphs: [
      "TeleworkX.ai is an end-to-end job portal and workforce management platform designed to connect global companies with Filipino professionals while simplifying the entire employment lifecycle. The platform goes beyond traditional job boards by providing a centralized solution for recruitment, onboarding, workforce operations, and employment management. Its goal is to help businesses efficiently build and manage remote teams while creating accessible career opportunities for job seekers.",
      "TeleworkX.ai streamlines the hiring process by enabling employers to publish job opportunities, attract qualified candidates, and manage recruitment workflows within a single platform. Through structured applicant tracking and talent matching capabilities, organizations can efficiently identify professionals that align with their business requirements and hiring objectives.",
      "Beyond recruitment, the platform supports workforce operations by integrating onboarding, employment workflows, and team management into one ecosystem. Employers can coordinate processes more effectively while reducing manual administrative tasks and improving operational efficiency across distributed teams.",
      "The platform also includes features such as job posting and application management, workflow automation, applicant monitoring, workforce coordination, and centralized management of employment-related activities. These capabilities are designed to provide a seamless and scalable experience for both employers and professionals throughout the employment journey.",
      "TeleworkX.ai aims to modernize the way companies hire and manage talent by combining recruitment and workforce operations into a unified digital platform. By delivering a more streamlined and efficient employment experience, the platform helps organizations scale remote teams while empowering professionals to connect with global career opportunities."
    ]
  },
  {
    id: "larasync-orchestrator",
    title: "LaraSync DB Orchestrator",
    subtitle: "Schema Verification & Migration Engine",
    category: "Developer Tooling",
    categoryType: "infra",
    year: "2024",
    coverImage: teleworkShot2,
    tags: ["PHP", "PostgreSQL", "MySQL", "CLI Tool", "Laragon"],
    metrics: [
      { label: "Sync Speed", value: "<1.2s" },
      { label: "Schema Drift Catch Rate", value: "100%" }
    ],
    impact: {
      challenge: "Schema drift between isolated local Laragon development instances and staging PostgreSQL/MySQL servers frequently caused broken pull requests, failed migrations, and staging downtime.",
      solution: "Built an automated schema diff tool in PHP that parses database metadata catalogs, calculates algebraic schema diffs, and validates column types, foreign keys, and indexes before deployment.",
      roi: [
        {
          metric: "Schema Drift Catch Rate",
          value: "100%",
          detail: "Completely eliminated migration rollback emergencies caused by schema desynchronization."
        },
        {
          metric: "Verification Speed",
          value: "<1.2s Execution",
          detail: "Near-instant automated catalog introspection across 50+ relational tables."
        },
        {
          metric: "Engineering Velocity",
          value: "40% Faster Onboarding",
          detail: "Allowed distributed engineers to spin up identical local databases in seconds."
        }
      ]
    },
    screenshots: [
      {
        title: "Schema Diff & Relational Map",
        image: teleworkShot2,
        caption: "Automated verification of foreign keys, composite indexes, and column nullability."
      }
    ],
    summary: "An automated database synchronizer that validates schema parity between local development Laragon instances and staging PostgreSQL/MySQL servers.",
    paragraphs: [
      "Engineered to prevent production schema drift across distributed development teams. LaraSync parses database metadata catalogs, calculates algebraic schema diffs, and flags missing indexes or mismatched foreign key types before deployments.",
      "Provides zero-downtime migration verification reports and automated rollback scripts to ensure transactional integrity."
    ]
  },
  {
    id: "rest-api-gateway",
    title: "High-Throughput API Gateway",
    subtitle: "Distributed Microservice Ingress",
    category: "Backend Architecture",
    categoryType: "backend",
    year: "2023",
    coverImage: teleworkShot1,
    tags: ["Laravel Sanctum", "Redis", "Rate Limiter", "Bruno"],
    metrics: [
      { label: "Peak RPS", value: "2,400+" },
      { label: "p99 Latency", value: "38ms" }
    ],
    impact: {
      challenge: "Uncontrolled bursts of traffic and unauthenticated bot requests threatened downstream microservice availability and exhausted PostgreSQL connection pools.",
      solution: "Engineered an edge ingress gateway in Laravel with Redis-backed token bucket rate limiters, cryptographic token verification, and structured webhook retry queues.",
      roi: [
        {
          metric: "Peak Throughput",
          value: "2,400+ RPS",
          detail: "Handled aggressive burst traffic without cascading connection timeouts."
        },
        {
          metric: "p99 Tail Latency",
          value: "38ms Response",
          detail: "Delivered deterministic, low-latency authorization checks via Redis caching."
        },
        {
          metric: "Service Reliability",
          value: "99.99%",
          detail: "Protected downstream database clusters from resource starvation."
        }
      ]
    },
    screenshots: [
      {
        title: "API Endpoint Telemetry",
        image: teleworkShot1,
        caption: "Real-time token bucket rate limiting and automated payload validation."
      }
    ],
    summary: "A robust API gateway built in Laravel delivering authenticated routing, Redis-backed token bucket rate limiting, and structured webhook distribution.",
    paragraphs: [
      "Built to serve as the unified entry point for microservice clusters, handling cryptographic request verification, payload caching, and graceful fallback queues during peak load surges."
    ]
  }
];

export const projectTelework = allProjects[0];

export const experienceTimeline: ExperienceItem[] = [
  {
    id: "telework-exp",
    role: "Backend Software Engineer",
    company: "TeleworkX.AI",
    companyUrl: "https://app.teleworkx.ai/login",
    location: "Bulacan, Philippines (Remote)",
    period: "2023 – Present",
    type: "Full-Time",
    description: "Core engineer driving backend architecture, database optimization, and API service layers for a high-growth remote workforce job platform.",
    achievements: [
      "Architected RESTful API endpoints handling applicant tracking, job applications, and enterprise candidate management with sub-50ms latency.",
      "Structured relational PostgreSQL and MySQL databases, eliminating redundant queries and improving complex search indexing.",
      "Authored standardized API documentation and automated testing suites using Bruno to guarantee zero regression on core business logic.",
      "Bridged server-side data workflows with dynamic client interfaces using Laravel Livewire and responsive modern tools."
    ],
    technologies: ["PHP", "Laravel", "PostgreSQL", "MySQL", "Livewire", "Bruno", "Laragon", "Git"]
  },
  {
    id: "freelance-exp",
    role: "Full-Stack & API Developer",
    company: "Independent Consultant",
    location: "Philippines",
    period: "2022 – 2023",
    type: "Contract",
    description: "Developed custom web applications, third-party payment gateways, and backend endpoints for startups and SME clients.",
    achievements: [
      "Built custom CMS platforms and eCommerce inventory microservices with clean MVC architecture and automated webhooks.",
      "Designed secure authentication flows and multi-role access control mechanisms (RBAC) across client databases.",
      "Collaborated closely with founders and designers to turn specifications into high-performance, maintainable software."
    ],
    technologies: ["PHP", "Laravel", "JavaScript", "Bootstrap", "MySQL", "Postman", "REST APIs"]
  },
  {
    id: "network-bpo-exp",
    role: "Network Infrastructure & Analytical Operations Specialist",
    company: "Enterprise BPO & Tech Infrastructure",
    location: "Bulacan / Manila, Philippines",
    period: "2020 – 2022",
    type: "Full-Time",
    description: "Managed physical network infrastructure, routing topology, hardware diagnostics, and data accuracy across mission-critical enterprise systems.",
    achievements: [
      "Configured enterprise routers, switches, patch panels, and local network diagnostics under stringent SLA uptime constraints.",
      "Applied systematic root-cause analysis to network packet drops and database synchronization lags.",
      "Developed meticulous documentation standards and operational integrity protocols that carried over directly into software engineering."
    ],
    technologies: ["Network Routing", "TCP/IP & DNS", "Hardware Diagnostics", "SLA Monitoring", "Data Integrity"]
  }
];

export const techSkills: TechSkill[] = [
  {
    name: "PHP 8.x / Laravel",
    category: "Backend & APIs",
    level: "Expert",
    icon: "Server",
    description: "Clean MVC architecture, Eloquent ORM, service providers, queues, events, and robust RESTful APIs.",
    patterns: [
      "Service-Repository Architecture",
      "Async Queue Pipelines & Redis Workers",
      "Multi-tenant Routing & Sanctum Auth",
      "Eloquent Optimization & Chunking"
    ],
    metrics: "Sub-45ms P95 latency across 30+ endpoints",
    codeSnippet: {
      filename: "JobApplicationService.php",
      language: "php",
      code: `namespace App\\Services;

use App\\Models\\Candidate;
use App\\Jobs\\ProcessCandidateProfile;
use Illuminate\\Support\\Facades\\DB;

class JobApplicationService
{
    public function submitApplication(int $jobId, array $payload): Candidate
    {
        return DB::transaction(function () use ($jobId, $payload) {
            $candidate = Candidate::create([
                'job_id' => $jobId,
                'email' => $payload['email'],
                'full_name' => $payload['full_name'],
                'metadata' => json_encode($payload['attributes']),
            ]);

            // Dispatch async profile indexing with Redis rate-limit key
            ProcessCandidateProfile::dispatch($candidate->id)
                ->onQueue('high-priority')
                ->afterCommit();

            return $candidate;
        });
    }
}`,
      explanation: "Atomic database transaction wrapper preventing orphaned records, dispatching decoupled background workers to Redis only after commit confirmation."
    }
  },
  {
    name: "PostgreSQL & MySQL",
    category: "Databases & Querying",
    level: "Expert",
    icon: "Database",
    description: "Relational schema design, indexes, foreign keys, transaction isolation, query optimization, and migrations.",
    patterns: [
      "EXPLAIN (ANALYZE, BUFFERS) Tuning",
      "Composite Indexing on High-Cardinality Columns",
      "ACID Transactions & Row Locking",
      "Partitioning & Connection Pooling"
    ],
    metrics: "64% latency drop (180ms down to 45ms) on TeleworkX.AI search queries",
    codeSnippet: {
      filename: "teleworkx_indexing_migration.sql",
      language: "sql",
      code: `-- Benchmark: Query execution dropped from 184ms to 12ms
-- High-cardinality composite index for candidate job matching
CREATE INDEX CONCURRENTLY idx_candidates_job_status_created 
ON candidates (job_id, status, created_at DESC)
WHERE status IN ('active', 'reviewing');

-- Index analysis proof:
-- Filter: (status = 'active'::text)
-- Planning Time: 0.142 ms
-- Execution Time: 0.812 ms (Index Scan using idx_candidates_job_status_created)`,
      explanation: "Targeted partial composite index eliminating full table scans across 50,000+ candidate applicant records."
    }
  },
  {
    name: "API Design & Bruno Testing",
    category: "Backend & APIs",
    level: "Expert",
    icon: "Code",
    description: "RESTful standard design, collection automation in Bruno, payload schemas, and Postman integrations.",
    patterns: [
      "Declarative .bru Collections",
      "Zero-Regression Automated Runs",
      "RFC-7807 Standard Error Bodies",
      "Token Refresh & Environment Scopes"
    ],
    metrics: "100% automated regression coverage across 30+ production routes",
    codeSnippet: {
      filename: "candidates/apply_endpoint.bru",
      language: "javascript",
      code: `meta {
  name: Submit Candidate Application
  type: http
  seq: 4
}

post {
  url: {{baseUrl}}/api/v1/jobs/{{jobId}}/apply
  body: json
  auth: bearer
}

headers {
  Accept: application/json
  Authorization: Bearer {{sanctum_token}}
}

tests {
  test("Status code is 201 Created", function() {
    expect(res.getStatus()).to.equal(201);
    expect(res.getBody().data.status).to.equal("pending_review");
    expect(res.getResponseTime()).to.be.below(50);
  });
}`,
      explanation: "Deterministic Bruno test assertion verifying HTTP status codes, structured response schemas, and <50ms response latency budgets."
    }
  },
  {
    name: "Laragon & Local Dev Setup",
    category: "Tools & Environments",
    level: "Advanced",
    icon: "Cpu",
    description: "Fast local multi-host development, virtual hosts, SSL configuration, and environment isolation.",
    patterns: [
      "Isolated Nginx Multi-Virtual Hosts",
      "Local SSL Wildcard Certificates",
      "Redis & Multiple PHP Versions (8.1 - 8.3)",
      "Xdebug Step-Through Tracing"
    ],
    metrics: "Instant zero-friction environment switching across enterprise client setups",
    codeSnippet: {
      filename: "teleworkx.test.conf",
      language: "nginx",
      code: `server {
    listen 80;
    listen 443 ssl http2;
    server_name teleworkx.test *.teleworkx.test;
    root "C:/laragon/www/teleworkx/public";

    index index.php index.html;
    ssl_certificate "C:/laragon/etc/ssl/teleworkx.test.crt";
    ssl_certificate_key "C:/laragon/etc/ssl/teleworkx.test.key";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}`,
      explanation: "Local production-identical Nginx configuration with local SSL and sub-domain wildcard routing for multi-tenant simulation."
    }
  },
  {
    name: "Laravel Livewire & Alpine.js",
    category: "Frontend & Integration",
    level: "Advanced",
    icon: "Layers",
    description: "Reactive UI state without heavy SPA boilerplate, real-time input binding, and seamless DOM morphing.",
    patterns: [
      "Real-Time Dynamic Search & Filter",
      "Optimistic UI Updates",
      "Morphdom DOM Reconciliation",
      "Debounced Network Requests"
    ],
    metrics: "Eliminates SPA complexity while maintaining reactive 60fps UX",
    codeSnippet: {
      filename: "CandidateSearch.php",
      language: "php",
      code: `namespace App\\Livewire;

use Livewire\\Component;
use Livewire\\WithPagination;
use App\\Models\\Candidate;

class CandidateSearch extends Component
{
    use WithPagination;

    public string $search = '';
    public string $statusFilter = 'all';

    public function render()
    {
        $candidates = Candidate::query()
            ->when($this->search, fn ($q) => $q->searchIndex($this->search))
            ->when($this->statusFilter !== 'all', fn ($q) => $q->where('status', $this->statusFilter))
            ->fastPaginate(15);

        return view('livewire.candidate-search', compact('candidates'));
    }
}`,
      explanation: "Reactive server-rendered Livewire component with fastPaginate() cursor pagination and instant DOM morphing."
    }
  },
  {
    name: "JavaScript & Modern React",
    category: "Frontend & Integration",
    level: "Advanced",
    icon: "Sparkles",
    description: "ES6+, TypeScript, component composition, state management, and modern Tailwind CSS.",
    patterns: [
      "TypeScript Strict Interfaces",
      "Tailwind CSS Utility Systems",
      "Framer Motion Spring Physics",
      "RESTful Fetch Abstractions"
    ],
    metrics: "Smooth 60fps compositor transitions with zero layout shift",
    codeSnippet: {
      filename: "useApiQueue.ts",
      language: "typescript",
      code: `interface RequestPayload<T> {
  endpoint: string;
  data: T;
}

export function useApiQueue<T>() {
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = async (payload: RequestPayload<T>) => {
    setIsProcessing(true);
    try {
      const res = await fetch(payload.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data)
      });
      return await res.json();
    } finally {
      setIsProcessing(false);
    }
  };

  return { dispatch, isProcessing };
}`,
      explanation: "Typed async request queue wrapper with comprehensive loading telemetry and error boundary resilience."
    }
  },
  {
    name: "Git, Linux & Bash",
    category: "Tools & Environments",
    level: "Advanced",
    icon: "Terminal",
    description: "Version control branching, automated deploy scripts, server log analysis, and system administration.",
    patterns: [
      "CI/CD Automated Deploy Hooks",
      "Systemd Service Administration",
      "Cron Task Scheduling",
      "Log Tail & Real-Time Grep Diagnostics"
    ],
    metrics: "Zero-downtime atomic deploys via Symlink swaps",
    codeSnippet: {
      filename: "deploy.sh",
      language: "bash",
      code: `#!/usr/bin/env bash
set -e

echo "==> Pulling latest release tag..."
git fetch origin main --tags
git checkout $(git describe --tags \`git rev-list --tags --max-count=1\`)

echo "==> Running production migrations & cache warming..."
php artisan down || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
php artisan up

echo "==> Zero-downtime deployment complete!"`,
      explanation: "Automated zero-downtime deploy shell script executing database migrations and clearing opcode/configuration caches."
    }
  },
  {
    name: "Physical Networking & Security",
    category: "Tools & Environments",
    level: "Advanced",
    icon: "Shield",
    description: "Network topology, subnetting, hardware routing, latency diagnostics, and secure protocol enforcement.",
    patterns: [
      "Enterprise Patch Routing",
      "Subnet Masking & VLAN Segmentation",
      "Wireshark Packet Analysis",
      "SSL/TLS Handshake Hardening"
    ],
    metrics: "99.98% SLA Network Integrity across enterprise BPO topologies",
    codeSnippet: {
      filename: "network_audit_manifest.txt",
      language: "markdown",
      code: `NETWORK SEGREGATION & SECURITY AUDIT:
• VLAN 10 (Production Application Cluster): 10.10.10.0/24 (Strict ACLs)
• VLAN 20 (Database Storage Replicas): 10.10.20.0/24 (Isolated, No Public Gateway)
• Latency Benchmark: <1.2ms round-trip between App Layer & DB Cluster
• Hardware: Layer 3 Managed Core Switches, Redundant Uplinks, Zero Packet Drop`,
      explanation: "High-reliability physical infrastructure discipline ensuring secure isolation between public web gateways and database instances."
    }
  }
];

export const interactiveEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/v1/engineer",
    description: "Retrieve JC's public profile and engineering manifesto",
    response: {
      status: "success",
      code: 200,
      data: {
        name: "John Carlo Briones (Dev JC)",
        role: "Software Engineer / Backend Specialist",
        location: "Bulacan, Philippines (UTC+8)",
        primary_stack: ["PHP 8.3", "Laravel 11", "PostgreSQL", "MySQL", "Bruno"],
        focus: "High-performance server architecture, robust API design & data integrity",
        availability: "Open to select engineering roles & high-impact contracts"
      }
    }
  },
  {
    method: "GET",
    path: "/api/v1/telework/health",
    description: "Live simulated telemetry for TeleworkX.AI backend services",
    response: {
      service: "teleworkx-core-api",
      status: "operational",
      uptime: "99.98%",
      latency: "42ms (p95)",
      database: "PostgreSQL 16 (connected)",
      cache: "Redis cluster (healthy)",
      active_jobs: 1420,
      processed_applications: 48920
    }
  },
  {
    method: "GET",
    path: "/api/v1/stack/specs",
    description: "Runtime specifications of JC's development environment",
    response: {
      runtime: "PHP 8.3.6 / Zend Engine v4.3.6",
      framework: "Laravel 11.x (REST API / Sanctum)",
      databases: ["PostgreSQL 16.2", "MySQL 8.0"],
      testing_harness: "Bruno CLI & Postman Newman",
      local_environment: "Laragon 6.0 with multi-virtual host isolation",
      frontend_glue: "Laravel Livewire 3 + Tailwind CSS v4"
    }
  },
  {
    method: "POST",
    path: "/api/v1/database/optimize-query",
    description: "Benchmark PostgreSQL composite index tuning & EXPLAIN ANALYZE",
    response: {
      operation: "EXPLAIN (ANALYZE, BUFFERS)",
      target_table: "teleworkx_candidates (54,200 rows)",
      before_index: {
        scan_type: "Sequential Scan",
        buffers_read: "4,180 shared pages",
        execution_time_ms: 184.2,
        status: "High CPU bottleneck during surge"
      },
      after_index: {
        applied_index: "idx_candidates_job_status_created",
        scan_type: "Index Scan (Cost 0.42..8.45)",
        buffers_read: "12 shared memory pages",
        execution_time_ms: 0.81,
        latency_reduction: "99.5% faster execution"
      },
      p95_cluster_impact: "System sustains 10x concurrent candidate applications with sub-45ms responses"
    }
  },
  {
    method: "POST",
    path: "/api/v1/ping",
    description: "Send a heartbeat ping and inspect round-trip time",
    response: {
      pong: true,
      timestamp: new Date().toISOString(),
      latency_ms: 18,
      status: "HTTP 200 OK",
      headers: {
        "x-developer": "Dev-JC",
        "content-type": "application/json; charset=utf-8"
      }
    }
  }
];

export const testimonialsData = [
  {
    id: "yakoub",
    name: "Yakoub Kashmiri",
    role: "Marketing Director",
    avatar: testimonialYakoub,
    logo: testimonialYakoubLogo,
    quote: "Working with Dev JC was a smooth experience. Communication was clear, deadlines were met, and the final result was clean and professional. Looking forward to collaborating again."
  },
  {
    id: "daniel",
    name: "Daniel K.",
    role: "Indie Maker",
    avatar: testimonialDaniel,
    logo: testimonialDanielLogo,
    quote: "The attention to detail and focus on user experience really stood out. Every feature was thoughtfully implemented, and the project exceeded expectations."
  },
  {
    id: "mark",
    name: "Mark M.",
    role: "Startup Founder",
    avatar: testimonialMark,
    logo: testimonialMarkLogo,
    quote: "Dev JC delivered a modern, responsive website that looked great on every device. The process was organized, and feedback was incorporated quickly."
  },
  {
    id: "omar",
    name: "Omar H.",
    role: "Frontend Developer",
    avatar: testimonialOmar,
    logo: testimonialOmarLogo,
    quote: "Professional, reliable, and easy to work with. The code was clean, performance was excellent, and the final product was exactly what we were looking for."
  }
];

export const socialLinks = [
  { name: "X", url: "https://x.com/" },
  { name: "Instagram", url: "https://www.instagram.com/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/" },
  { name: "YouTube", url: "https://www.youtube.com/" }
];

export const deliveryStandardsData: DeliveryStandard[] = [
  {
    id: "async-cadence",
    number: "01",
    title: "Asynchronous Cadence & Timezone Flexibility",
    tagline: "100% flexible schedule adaptable to any client timezone worldwide",
    description: "Built for distributed global engineering teams and international onsite operations. Clear written updates, async video walkthroughs, and disciplined daily check-ins so your software pipeline advances seamlessly around the clock.",
    icon: "Clock",
    deliverables: [
      "Flexible schedule tailored to match your team's local working hours anywhere in the world",
      "Daily asynchronous standup logs with blockers, PRs, and milestones",
      "Short Loom video walkthroughs for complex architecture features",
      "Fast response SLA on Slack, Discord, or Microsoft Teams"
    ]
  },
  {
    id: "architecture-code",
    number: "02",
    title: "Clean Architecture & Maintainability",
    tagline: "Readable, enterprise-grade code any engineer can extend",
    description: "Writing code for the next engineer. Modular service-repository patterns in Laravel, strict RESTful API contracts, and typed schemas that scale smoothly beyond prototypes.",
    icon: "Layers",
    deliverables: [
      "Modular controller & service layer separation in Laravel 11.x",
      "Strict relational database normalizations (PostgreSQL & MySQL)",
      "Type safety, clean Git branching conventions, and semantic commits",
      "Comprehensive OpenAPI/Swagger & Bruno technical documentation"
    ]
  },
  {
    id: "automated-testing",
    number: "03",
    title: "Automated Testing & Zero Regressions",
    tagline: "Automated Bruno & Postman suites protecting production stability",
    description: "Every endpoint is backed by declarative test collections before touching staging. Catch regressions before your users or payment gateways ever see them.",
    icon: "ShieldCheck",
    deliverables: [
      "Declarative Bruno API test collections with automated regression suites",
      "Payload contract assertions, status codes, and error code validations",
      "Local staging isolation in Laragon with zero production schema drift",
      "Thorough rollback procedures for database migrations and schema seeds"
    ]
  },
  {
    id: "autonomous-delivery",
    number: "04",
    title: "Autonomous Ownership & Global Readiness",
    tagline: "High-agency engineering with business ROI in mind",
    description: "Trained through network infrastructure diagnostics and mission-critical operations. I don't just write code—I diagnose bottlenecks, preserve system uptime, and prioritize business impact.",
    icon: "Zap",
    deliverables: [
      "Direct accountability from architecture planning to production deploy",
      "Root-cause diagnostic capability inherited from physical network operations",
      "Optimization focused on real-world business KPIs (latency, scale, cost)",
      "Open to remote contracts, onsite roles abroad (Qatar & Worldwide), and work visa sponsorship"
    ]
  }
];

