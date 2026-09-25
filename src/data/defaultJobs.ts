import type { Job } from '../types/database';

export const defaultJobs: Job[] = [

  {
    id: 'bv-get-2026',
    title: 'Graduate Engineering Trainee (GET) - AI & Full Stack',
    department: 'Engineering & Technology Academy',
    category: 'AI-Powered Web Development',
    description: 'Join Brainovision Solutions as a Graduate Engineering Trainee. Be part of an intensive, high-impact career launchpad working with cutting-edge Generative AI tools, full-stack enterprise web platforms, and automated cloud systems. You will receive mentorship from senior architects and participate in real-world production releases.',
    responsibilities: [
      'Build responsive, production-ready web interfaces using React, TypeScript, and modern styling libraries.',
      'Develop robust backend APIs and microservices using Node.js, Express, and relational databases (MySQL / PostgreSQL).',
      'Integrate AI services including OpenAI, Anthropic, and local LLM pipelines into interactive web products.',
      'Participate in agile sprints, write clean unit and integration tests, and conduct peer code reviews.',
      'Collaborate with university partners and enterprise clients during hackathons and technical bootcamps.'
    ],
    requirements: [
      'B.Tech / B.E. / MCA / M.Tech in Computer Science, Information Technology, ECE, or related disciplines (2025 / 2026 Batch).',
      'Solid foundations in Data Structures, Algorithms, Object-Oriented Programming, and Database concepts.',
      'Hands-on project experience with JavaScript/TypeScript, React or Node.js.',
      'Familiarity with version control using Git and GitHub.',
      'Excellent verbal and written communication skills with a passion for problem-solving.'
    ],
    preferred_skills: [
      'Prior internship or open-source contribution experience.',
      'Familiarity with Docker, AWS basics, or Tailwind CSS.',
      'Knowledge of prompt engineering or AI application development.'
    ],
    employment_type: 'full-time',
    work_mode: 'hybrid',
    experience_min: 0,
    experience_max: 1,
    location: 'Hyderabad, Telangana (Madhapur / HITEC City)',
    salary_min: 4.5,
    salary_max: 7.0,
    benefits: [
      'Comprehensive health insurance & wellness allowance',
      'Annual tech gear stipend & workstation support',
      'Paid certification vouchers (AWS, Azure, Google Cloud)',
      'Free lunch & snacks at our Hyderabad Innovation Hub',
      'Fast-track promotion pathway to SDE-1 within 12 months'
    ],
    positions_available: 25,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bv-ai-trainer-lead',
    title: 'Lead Technical Trainer & Research Specialist (Agentic AI & Quantum)',
    department: 'AI Research & Academics',
    category: 'Agentic AI & Quantum Computing',
    description: 'Lead national training initiatives, executive workshops, and faculty development programs in Agentic AI, Autonomous LLM Workflows, and introductory Quantum Computing. Shape curriculum standards and train thousands of aspiring engineers across premier engineering institutes.',
    responsibilities: [
      'Design and deliver high-impact workshops on Autonomous Agents (LangChain, AutoGen, CrewAI, LlamaIndex).',
      'Develop real-world code demos, hands-on lab environments, and project assessments.',
      'Deliver keynote addresses and technical sessions at Brainovision partner summits and conferences.',
      'Mentor junior instructors and evaluate student project submissions.',
      'Publish research insights and technical whitepapers representing Brainovision.'
    ],
    requirements: [
      'B.Tech/M.Tech/Ph.D. in Computer Science, Data Science, or allied engineering domains.',
      '2 to 5 years of industry or technical training experience in Machine Learning and Python.',
      'Deep conceptual and practical understanding of Transformer architectures and LLM prompt engineering.',
      'Exceptional stage presence, live-coding capability, and articulate communication in English.'
    ],
    preferred_skills: [
      'Understanding of Qiskit or Cirq quantum simulation frameworks.',
      'Prior public speaking experience at major tech conferences.',
      'Recognized technical certifications in AI/ML.'
    ],
    employment_type: 'full-time',
    work_mode: 'hybrid',
    experience_min: 2,
    experience_max: 5,
    location: 'Hyderabad, Telangana / Pan-India Delivery',
    salary_min: 8.0,
    salary_max: 14.0,
    benefits: [
      'Travel allowances & 5-star accommodation for national conferences',
      'Performance-based masterclass delivery incentives',
      'International conference sponsorship',
      'Flexible remote work days between training deliveries'
    ],
    positions_available: 8,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bv-aws-devops-lead',
    title: 'Senior Cloud Solutions Architect & AWS DevOps Mentor',
    department: 'Cloud Infrastructure Academy',
    category: 'Generative AI & AWS',
    description: 'We are seeking an experienced Cloud Solutions Architect to design resilient cloud architectures on AWS and mentor enterprise engineering teams. You will drive enterprise migration strategies, container orchestration, and serverless architectures.',
    responsibilities: [
      'Architect, provision, and maintain multi-tier AWS environments using Terraform and AWS CDK.',
      'Build CI/CD automation pipelines with GitHub Actions, ArgoCD, and Kubernetes.',
      'Conduct advanced hands-on bootcamps for corporate cohorts on AWS Bedrock, SageMaker, and EKS.',
      'Implement cloud security governance, cost-optimization drills, and disaster recovery architectures.',
      'Assist Brainovision engineering in scaling our internal assessment and proctoring platforms.'
    ],
    requirements: [
      'Bachelor’s or Master’s in Computer Science or related fields.',
      '3 to 6 years of proven hands-on DevOps or Cloud Architecture experience on AWS.',
      'Strong expertise in Linux, Docker, Kubernetes, Terraform, and Bash/Python scripting.',
      'Demonstrated experience with AWS networking (VPC, Transit Gateway, Route 53, CloudFront).'
    ],
    preferred_skills: [
      'AWS Certified Solutions Architect - Professional or DevOps Engineer - Professional.',
      'Experience with observability tools (Datadog, Prometheus, Grafana, OpenTelemetry).',
      'Prior corporate mentoring or training experience.'
    ],
    employment_type: 'full-time',
    work_mode: 'remote',
    experience_min: 3,
    experience_max: 6,
    location: 'Hyderabad / Remote (India)',
    salary_min: 10.0,
    salary_max: 16.5,
    benefits: [
      '100% remote flexibility with home office setup grant',
      'AWS examination and certification reimbursement',
      'Comprehensive family medical coverage (including parents)',
      'Quarterly company offsites and leadership summits'
    ],
    positions_available: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bv-fullstack-dev',
    title: 'Full Stack Engineer (React, Node.js, Real-time WebSockets)',
    department: 'Core Product Engineering',
    category: 'AI-Powered Web Development',
    description: 'Help engineer the next generation of Brainovision’s recruitment and live proctoring platform. You will build high-concurrency test-taking engines, webcam-based proctoring streams, and interactive candidate analytics.',
    responsibilities: [
      'Design, build, and maintain full-stack web applications with React, TypeScript, Node.js, and MySQL/PostgreSQL.',
      'Implement real-time features using WebSockets and WebRTC for live candidate assessment telemetry.',
      'Optimize database queries, indexing, and Redis caching for high-traffic campus assessment drives.',
      'Ensure high standards of security, tamper-resistance, and candidate data privacy.'
    ],
    requirements: [
      '2 to 4 years of hands-on experience building production web applications.',
      'Proficiency in modern TypeScript, React, Node.js, and SQL databases.',
      'Solid experience with RESTful APIs, authentication protocols (JWT, OAuth), and asynchronous programming.',
      'Strong analytical thinking and unit/integration testing habits.'
    ],
    preferred_skills: [
      'Experience with WebRTC, video streaming, or canvas proctoring.',
      'Experience with Tailwind CSS and Framer Motion.',
      'Familiarity with cloud deployments on AWS or GCP.'
    ],
    employment_type: 'full-time',
    work_mode: 'hybrid',
    experience_min: 2,
    experience_max: 4,
    location: 'Hyderabad, Telangana (HITEC City)',
    salary_min: 6.5,
    salary_max: 11.0,
    benefits: [
      'Competitive compensation package with annual equity bonuses',
      'Flexible working hours & hybrid schedule (3 days office / 2 days remote)',
      'Learning stipend for books, conferences, and technical courses',
      'Ergonomic workstation and modern development laptop (MacBook Pro / Dell XPS)'
    ],
    positions_available: 8,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bv-campus-hr',
    title: 'Campus Talent Acquisition Specialist & HR Coordinator',
    department: 'Human Resources & University Relations',
    category: 'Campus Recruitment',
    description: 'We are expanding our Pan-India university partnerships and seeking a dedicated Campus Recruitment Specialist. You will manage end-to-end college placement drives, organize assessment schedules, coordinate interviews, and ensure an exceptional candidate experience.',
    responsibilities: [
      'Build relationships with placement officers (TPOs) at premier universities across India.',
      'Organize and execute end-to-end campus hiring drives using Brainovision’s assessment portal.',
      'Coordinate interview schedules, proctoring audits, and result announcements with hiring managers.',
      'Manage candidate communications, offer letter rollouts, and pre-onboarding engagement.',
      'Track and analyze key hiring metrics to optimize recruitment cycle velocity.'
    ],
    requirements: [
      'MBA in HR or Bachelor’s degree with relevant talent acquisition experience.',
      '1 to 3 years of experience in campus recruitment or corporate talent acquisition.',
      'Superb interpersonal, networking, and organizational abilities.',
      'Proficiency with recruitment software, spreadsheets, and online assessment systems.'
    ],
    preferred_skills: [
      'Existing network with engineering colleges in Telangana, Andhra Pradesh, and Karnataka.',
      'Experience handling high-volume recruitment drives (500+ candidates).',
      'Dynamic communication skills and enthusiastic public presence.'
    ],
    employment_type: 'full-time',
    work_mode: 'onsite',
    experience_min: 1,
    experience_max: 3,
    location: 'Hyderabad, Telangana (Madhapur)',
    salary_min: 4.5,
    salary_max: 7.0,
    benefits: [
      'Travel allowances for official campus recruitment tours',
      'Performance incentives based on drive success metrics',
      'Medical insurance coverage for self and family',
      'Vibrant, youthful, and supportive team environment'
    ],
    positions_available: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bv-ui-ux-designer',
    title: 'UI/UX Product Designer (Design Systems & Web Apps)',
    department: 'Product & Design',
    category: 'AI-Powered Web Development',
    description: 'Create intuitive, engaging user interfaces for Brainovision’s student learning portals, recruitment platforms, and corporate dashboard products. You will work closely with product managers and engineers to turn complex workflows into delightful user journeys.',
    responsibilities: [
      'Design user flows, wireframes, high-fidelity prototypes, and component design systems in Figma.',
      'Conduct usability testing with students, candidates, and recruiters to gather feedback.',
      'Collaborate with frontend engineers to ensure pixel-perfect implementation of UI components.',
      'Establish brand design guidelines and marketing visual assets for national recruitment campaigns.'
    ],
    requirements: [
      '1 to 3 years of experience in UI/UX design for web applications or SaaS products.',
      'Strong portfolio showcasing design problem-solving, aesthetic sense, and micro-interactions.',
      'Mastery of Figma, modern auto-layout, interactive prototyping, and component architecture.',
      'Understanding of HTML/CSS responsive layout principles and accessibility guidelines.'
    ],
    preferred_skills: [
      'Experience creating EdTech, testing, or enterprise SaaS user interfaces.',
      'Basic motion design skills (After Effects, Lottie, or Framer).',
      'Experience working closely with React/Tailwind developers.'
    ],
    employment_type: 'full-time',
    work_mode: 'hybrid',
    experience_min: 1,
    experience_max: 3,
    location: 'Hyderabad, Telangana',
    salary_min: 5.5,
    salary_max: 9.0,
    benefits: [
      'High-end design gear and monitor setup',
      'Figma professional subscription and asset library budget',
      'Creative freedom to define the design language of tomorrow’s education platforms',
      'Comprehensive healthcare and leave benefits'
    ],
    positions_available: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export { defaultJobs as DEFAULT_JOBS };

