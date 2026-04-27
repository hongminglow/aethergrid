export const portfolioData = {
  name: "Your Name",
  title: "Software Developer",
  intro: [
    "I build thoughtful software with clean interfaces and reliable systems.",
    "My work blends frontend craft, backend logic, and product thinking.",
    "I enjoy turning complex ideas into fast, elegant digital experiences.",
    "This space will evolve into a cinematic cyber-fantasy profile."
  ],
  contact: {
    email: "your.email@example.com",
    githubUrl: "https://github.com/your-username",
    linkedInUrl: "https://www.linkedin.com/in/your-profile"
  },
  experienceSummary: {
    totalYears: "3+ years",
    headline: "Building scalable web applications and immersive digital products."
  },
  experiences: [
    {
      role: "Frontend Developer",
      company: "Company Name",
      period: "2023 - Present",
      description: [
        "Built responsive and performant application interfaces.",
        "Integrated APIs and improved user workflows.",
        "Collaborated with designers and backend engineers."
      ]
    },
    {
      role: "Software Developer",
      company: "Previous Company",
      period: "2021 - 2023",
      description: [
        "Delivered reusable application features with TypeScript.",
        "Improved maintainability across shared UI and service modules.",
        "Supported debugging, testing, and release workflows."
      ]
    }
  ],
  skills: [
    "TypeScript",
    "JavaScript",
    "React",
    "Node.js",
    "Three.js",
    "Vite",
    "HTML",
    "CSS",
    "PostgreSQL",
    "REST APIs",
    "GraphQL",
    "Prisma",
    "Tailwind CSS",
    "Testing",
    "CI/CD",
    "Performance",
    "Git",
    "UI Engineering",
    "Product Thinking"
  ]
} as const;

export type PortfolioData = typeof portfolioData;
