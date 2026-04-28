export const portfolioData = {
  name: "Low Hong Ming",
  title: "Senior Software Engineer",
  intro: [
    "I have five years of experience specializing in frontend and mobile development using React and React Native.",
    "I’ve built and maintained systems across domains including financial platforms, admin portals, landing pages etc.",
    "I enjoy solving complex problems and delivering high-quality solutions within deadlines.",
  ],
  contact: {
    email: "hongming_1212@hotmail.com",
    githubUrl: "https://github.com/hongminglow",
    linkedInUrl: "https://www.linkedin.com/in/low-hong-ming-476353210/",
  },
  experienceSummary: {
    totalYears: "5+ years",
    headline:
      "Building scalable web applications and immersive digital products.",
  },
  experiences: [
    {
      role: "Senior Software Engineer",
      company: "Atoz Software Tech Sdn Bhd",
      period: "Apr 2024 - Present",
      description: [
        "Mentored junior developers, providing guidance on best practices and coding techniques for improved productivity.",
        "Delivered high-quality code on time by effectively managing project timelines and prioritizing tasks accordingly.",
        "Improved software performance by identifying and resolving bottlenecks in the code.",
        "Successfully met tight deadlines under pressure while maintaining a strong focus on quality deliverables throughout all stages of the development process.",
      ],
    },
    {
      role: "System Engineer",
      company: "Ardent Asia Pacific Sdn Bhd",
      period: "Jul 2021 - Feb 2024",
      description: [
        "Collaborated on stages of systems development lifecycle from requirement gathering to production releases.",
        "Collaborated with project managers to select ambitious, but realistic coding milestones on pre release software project development.",
        "Revised, modularized and updated old code bases to modern development standards, reducing operating costs, and improving functionality.",
        "Worked with a software development and testing team members to design and develop robust solutions to meet client requirements for functionality, scalability, and performance.",
      ],
    },
    {
      role: "Software Developer Intern",
      company: "Ardent Asia Pacific Sdn Bhd",
      period: "Jan 2021 - Jun 2021",
      description: [
        "Focused on front-end development using React, ensuring the smooth functioning and visual appeal of web applications.",
        "Collaborated with team members, adhered to project timelines, and participated in bug fixing activities when required.",
        "Worked with developers to identify and remove software bugs.",
      ],
    },
  ],
  skills: [
    "TypeScript",
    "JavaScript",
    "React",
    "React Native",
    "Nextjs",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Vue 3",
    "Nestjs",
    "Golang",
    "Godot",
    "Cocos2D",
    "Kotlin",
    "PostgreSQL",
    "REST APIs",
    "GraphQL",
    "Prisma",
    "Git",
    "AWS",
  ],
} as const;

export type PortfolioData = typeof portfolioData;
