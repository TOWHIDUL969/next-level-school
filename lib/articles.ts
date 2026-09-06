
export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type Article = {
  id: string;
  number: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  author: string;
  authorRole: string;
  featured?: boolean;

  content: {
    intro: string;
    sections: ArticleSection[];
  };
};

export const articles: Article[] = [
  {
    id: "web-development-roadmap-2026",
    number: "01",
    category: "WEB DEVELOPMENT",
    title: "The Modern Roadmap to Becoming a Web Developer in 2026",
    excerpt:
      "The web is changing fast. Learn what technologies actually matter, what to skip, and how to build skills that translate into real projects.",
    date: "SEP 04, 2026",
    read: "8 MIN",
    author: "NEXT LEVEL EDITORIAL",
    authorRole: "Technology & Education",
    featured: true,

    content: {
      intro:
        "Web development has changed dramatically over the last few years. The tools are faster, frameworks are more powerful, and AI is becoming part of the everyday development workflow.",

      sections: [
        {
          heading: "Start with the fundamentals",
          paragraphs: [
            "Before jumping into frameworks, learn how the web actually works. HTML, CSS and JavaScript are still the foundation of modern web development.",

            "HTML gives your application structure, CSS controls presentation and JavaScript adds behavior. A strong understanding of these three technologies will make every framework easier to learn later.",
          ],
        },

        {
          heading: "Learn JavaScript properly",
          paragraphs: [
            "JavaScript is the language that connects the fundamentals with modern frontend development. Instead of memorizing syntax, focus on understanding how the language works.",

            "Variables, functions, arrays, objects, conditions, loops, DOM manipulation, asynchronous programming, promises and modern ES6+ features should become comfortable concepts.",
          ],
        },

        {
          heading: "Move into React",
          paragraphs: [
            "Once JavaScript becomes comfortable, React is a natural next step. React introduces component-based thinking and allows developers to build complex interfaces from reusable pieces.",

            "The goal is not simply to learn React APIs. You should learn how to break a user interface into components, manage state and create predictable application behavior.",
          ],
        },

        {
          heading: "Then learn Next.js",
          paragraphs: [
            "Next.js takes React further by providing routing, server-side rendering, server components, optimized images and a production-ready application architecture.",

            "For developers who want to build professional full-stack applications, Next.js can become one of the most valuable technologies in their toolkit.",
          ],
        },

        {
          heading: "Build real projects",
          paragraphs: [
            "This is where learning becomes skill. Tutorials can teach you concepts, but projects force you to solve problems.",

            "Build projects that gradually become more difficult. Start with landing pages, then dashboards, authentication systems, e-commerce applications and eventually complete full-stack products.",
          ],
        },
      ],
    },
  },

  {
    id: "react-vs-nextjs",
    number: "02",
    category: "WEB DEVELOPMENT",
    title: "React vs Next.js: Understanding the Difference",
    excerpt:
      "React changed frontend development. Next.js changed how we build complete web experiences.",
    date: "SEP 01, 2026",
    read: "6 MIN",
    author: "WEB MENTOR",
    authorRole: "Frontend Development",

    content: {
      intro:
        "React and Next.js are often compared as if they are competing technologies. In reality, they solve different levels of the development problem.",

      sections: [
        {
          heading: "What is React?",
          paragraphs: [
            "React is a JavaScript library for building user interfaces. It focuses primarily on the component and UI layer of an application.",

            "React gives developers the tools to create reusable components and manage interface state efficiently.",
          ],
        },

        {
          heading: "What is Next.js?",
          paragraphs: [
            "Next.js is a React framework designed to help developers build complete production applications.",

            "It provides routing, rendering strategies, server components, API capabilities, image optimization and many other features out of the box.",
          ],
        },

        {
          heading: "Which one should you learn?",
          paragraphs: [
            "You should learn React concepts first because Next.js is built around React.",

            "After understanding components, props, state and hooks, Next.js becomes the natural next step for building larger applications.",
          ],
        },
      ],
    },
  },

  {
    id: "design-principles",
    number: "03",
    category: "DESIGN",
    title: "Why Some Interfaces Feel Expensive",
    excerpt:
      "Premium design is rarely about adding more. It is about spacing, hierarchy, typography and intentional decisions.",
    date: "AUG 28, 2026",
    read: "7 MIN",
    author: "DESIGN TEAM",
    authorRole: "UI/UX Design",

    content: {
      intro:
        "A premium interface does not necessarily contain more elements. In many cases, it contains fewer elements with better decisions behind them.",

      sections: [
        {
          heading: "Visual hierarchy",
          paragraphs: [
            "Users should immediately understand what is important on a page. Typography, spacing, size and contrast create that hierarchy.",

            "When every element competes for attention, nothing feels important.",
          ],
        },

        {
          heading: "Whitespace matters",
          paragraphs: [
            "Whitespace gives content room to breathe. Professional interfaces rarely try to fill every available pixel.",

            "Generous spacing between sections can make a design feel more sophisticated and easier to understand.",
          ],
        },

        {
          heading: "Consistency creates trust",
          paragraphs: [
            "Buttons, typography, spacing and colors should follow a consistent system. This makes the interface feel intentional rather than randomly assembled.",
          ],
        },
      ],
    },
  },

  {
    id: "freelancing-roadmap",
    number: "04",
    category: "CAREER",
    title: "From Skill to Income: A Practical Freelancing Roadmap",
    excerpt:
      "What should you learn before searching for your first client? A realistic path from beginner to professional.",
    date: "AUG 25, 2026",
    read: "9 MIN",
    author: "CAREER MENTOR",
    authorRole: "Career Development",

    content: {
      intro:
        "Freelancing is not simply about creating an account on a marketplace and waiting for clients. It is a business built around a valuable skill.",

      sections: [
        {
          heading: "Choose one valuable skill",
          paragraphs: [
            "Avoid trying to learn everything at once. Pick one skill that has market demand and become genuinely good at it.",

            "Web development, UI/UX design, graphic design and digital marketing are examples of skills that can be developed into professional services.",
          ],
        },

        {
          heading: "Build proof of your ability",
          paragraphs: [
            "Clients want evidence. Build projects that demonstrate what you can actually do.",

            "A strong portfolio is often more convincing than a long list of certificates.",
          ],
        },

        {
          heading: "Learn communication",
          paragraphs: [
            "Technical ability is only part of freelancing. You also need to understand requirements, communicate clearly and deliver on time.",
          ],
        },
      ],
    },
  },

  {
    id: "future-of-ai",
    number: "05",
    category: "AI",
    title: "AI Will Not Replace Everyone. But It Will Change Everyone.",
    excerpt:
      "Artificial intelligence is reshaping how people learn, create and work. The real advantage is knowing how to use it.",
    date: "AUG 21, 2026",
    read: "8 MIN",
    author: "AI RESEARCH",
    authorRole: "Artificial Intelligence",

    content: {
      intro:
        "Artificial intelligence is becoming part of almost every digital workflow. The important question is no longer whether AI will affect your work, but how you will adapt to it.",

      sections: [
        {
          heading: "AI as a productivity tool",
          paragraphs: [
            "AI can help with brainstorming, research, writing, coding, analysis and repetitive tasks.",

            "The best results usually come when people use AI as an assistant rather than blindly accepting everything it produces.",
          ],
        },

        {
          heading: "Human skills still matter",
          paragraphs: [
            "Critical thinking, communication, creativity and decision-making remain extremely valuable.",

            "The ability to evaluate AI output may become just as important as the ability to generate it.",
          ],
        },

        {
          heading: "Learn to work with AI",
          paragraphs: [
            "Instead of being afraid of AI, learn how it fits into your workflow. Experiment with tools, understand their limitations and develop a process that combines human judgment with machine assistance.",
          ],
        },
      ],
    },
  },

  {
    id: "learn-coding",
    number: "06",
    category: "TECHNOLOGY",
    title: "The Better Way to Learn Coding",
    excerpt:
      "Stop collecting tutorials. Start building a system that turns knowledge into practical ability.",
    date: "AUG 18, 2026",
    read: "5 MIN",
    author: "NEXT LEVEL TEAM",
    authorRole: "Education",

    content: {
      intro:
        "One of the biggest problems beginners face is not lack of information. It is too much information.",

      sections: [
        {
          heading: "Stop tutorial hopping",
          paragraphs: [
            "Jumping between courses can create the illusion of progress without developing real problem-solving ability.",
          ],
        },

        {
          heading: "Practice after learning",
          paragraphs: [
            "Whenever you learn a new concept, immediately build something small with it.",

            "This creates a connection between theoretical knowledge and practical skill.",
          ],
        },

        {
          heading: "Keep building",
          paragraphs: [
            "Consistency beats intensity. Even a small amount of focused practice every day can create significant progress over time.",
          ],
        },
      ],
    },
  },

  {
    id: "portfolio",
    number: "07",
    category: "CAREER",
    title: "Your Portfolio Is Your First Interview",
    excerpt:
      "A strong portfolio tells your story before you ever meet the recruiter or client.",
    date: "AUG 15, 2026",
    read: "6 MIN",
    author: "CAREER MENTOR",
    authorRole: "Career Development",

    content: {
      intro:
        "Your portfolio is more than a collection of screenshots. It is evidence of how you think, solve problems and create value.",

      sections: [
        {
          heading: "Show real projects",
          paragraphs: [
            "Whenever possible, show projects that solve real problems instead of generic tutorial clones.",
          ],
        },

        {
          heading: "Explain your process",
          paragraphs: [
            "Show what problem you solved, what decisions you made and what technologies you used.",
          ],
        },

        {
          heading: "Keep it simple",
          paragraphs: [
            "A clean portfolio with a few strong projects is usually more effective than a huge collection of unfinished work.",
          ],
        },
      ],
    },
  },

  {
    id: "web-design-trends",
    number: "08",
    category: "DESIGN",
    title: "Where Modern Web Design Is Heading",
    excerpt:
      "From editorial layouts to immersive interactions, these are the patterns shaping premium digital experiences.",
    date: "AUG 12, 2026",
    read: "7 MIN",
    author: "UI/UX TEAM",
    authorRole: "Digital Design",

    content: {
      intro:
        "Modern websites are moving beyond simple blocks of content. Designers are increasingly using typography, motion and spatial composition to create memorable experiences.",

      sections: [
        {
          heading: "Editorial layouts",
          paragraphs: [
            "Large typography, asymmetric grids and strong visual hierarchy are becoming common in premium digital products.",
          ],
        },

        {
          heading: "Purposeful motion",
          paragraphs: [
            "Animation can guide attention and communicate interaction when it is used with intention.",
          ],
        },

        {
          heading: "Less, but better",
          paragraphs: [
            "The strongest trend may be simplicity. Designers are removing unnecessary visual noise and focusing on the content that matters.",
          ],
        },
      ],
    },
  },
];


