export const site = {
  name: "Vikram Parekh",
  // Set in next.config.ts from Vercel's production domain (becomes vikramparekh.com once connected).
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://vikramparekh.com").replace(/\/+$/, ""),
  tagline: "Data, AI & Analytics Talent Infrastructure",
  description: "26+ years, 3x entrepreneur, global roles. Runs specialist recruitment agency for Data & AI hiring in India | +919867998866 | vikram@datavruti.com",
  email: "vikram@datavruti.com",
  phone: "+91 98679 98866",
  phoneHref: "tel:+919867998866",
  linkedin: "https://www.linkedin.com/in/vikramkparekh",
  location: "Ahmedabad, India",
};

export const nav = [
  { href: "#about", label: "About" },
  { href: "#building", label: "Building" },
  { href: "#journey", label: "Journey" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

export const stats = [
  { value: "26+", label: "Years of exp." },
  { value: "3X", label: "Bootstrapped entrepreneur" },
  { value: "8+", label: "Years in HR Tech" },
  { value: "1", label: "Focus: data, AI & analytics" },
];

export const ventures = [
  {
    name: "datavruti",
    audience: "For hiring teams",
    url: "https://www.datavruti.com",
    host: "datavruti.com",
    desc: "Helps startups, GCCs and enterprises hire exceptional data, AI and analytics talent. We don't recruit for everything. We go deep into one domain, because specialist hiring needs specialist understanding.",
  },
  {
    name: "estana",
    audience: "For recruitment agencies",
    url: "https://estana.in",
    host: "estana.in",
    desc: "An AI-native operating system for recruitment agencies. Most agencies don't struggle for demand. They struggle because execution doesn't scale. estana raises recruiter output and consistency without adding headcount at the same rate.",
  },
  {
    name: "graph",
    audience: "For professionals",
    url: "https://mygraph.id",
    host: "mygraph.id",
    desc: "For data, AI and analytics professionals: custom resumes, interview prep and a personal career graph. It pushes you to add the context and evidence behind what you've built, solved and achieved.",
  },
];

export const journey = [
  { year: "2018", title: "Multplyr", text: "I came from a tech background and started Multplyr, an HR tech business, with Ravi Vyas." },
  { year: "2021", title: "Into recruitment", text: "Ravi and I moved into recruitment services, and Jilian joined us. A few people trusted us with their hiring. One client became two, then three." },
  { year: "2023", title: "All in, then a setback", text: "We went all in on technology hiring. It grew the business. Then two of our largest clients left as hiring froze, and close to 80% of the business went with them." },
  { year: "2024", title: "datavruti", text: "We rebranded as datavruti and kept rebuilding with more clients and more services. Getting back took more than two years." },
  { year: "Now", title: "Three products", text: "Building on datavruti with estana and graph, so the same idea reaches companies, agencies and professionals." },
];

export const principles = [
  { title: "Better information makes better hiring decisions.", text: "Companies, recruiters and professionals all decide better when the context and evidence behind the work are visible." },
  { title: "Specialist hiring needs specialist understanding.", text: "That's why datavruti only hires for data, AI and analytics." },
  { title: "Each stage of a business needs a different answer.", text: "Survival, growth and resilience call for different decisions. None of them is right forever." },
  { title: "Revenue is the starting point, not the answer.", text: "Net fee income tells me what the business is really earning." },
  { title: "Manage by outcomes, then understand them.", text: "Separate what a recruiter controls, influences and can't control, and coach from there." },
];

/* Who the writing is for. Keys are stored on posts (Post.audiences), so don't rename them. */
export const audiences = [
  { key: "hiring", label: "Hiring managers & recruiters", short: "Hiring managers & recruiters" },
  { key: "agencies", label: "SME recruitment agency owners", short: "Agency owners" },
  { key: "jobseekers", label: "Data & AI job seekers", short: "Data & AI job seekers" },
] as const;
export type AudienceKey = (typeof audiences)[number]["key"];
export const audienceKeys = audiences.map((a) => a.key) as AudienceKey[];

export const posts: { href: string; date: string; label: string; title: string; excerpt: string; audiences: AudienceKey[] }[] = [
  {
    href: "https://www.datavruti.com/blog/the-advice-thats-right-today-can-become-wrong-tomorrow",
    date: "2026-07-07",
    label: "7 Jul 2026",
    title: "The advice that's right today can become wrong tomorrow",
    excerpt: "How focusing on tech hiring grew datavruti, then exposed it, and why survival, growth and resilience each need different decisions.",
    audiences: ["agencies"],
  },
  {
    href: "https://www.datavruti.com/blog/i-managed-by-outcomes-i-just-didnt-know-what-drove-them",
    date: "2026-06-24",
    label: "24 Jun 2026",
    title: "I managed by outcomes. I just didn't know what drove them.",
    excerpt: "Separating what a recruiter controls, influences and can't control, and coaching from there.",
    audiences: ["agencies", "hiring"],
  },
  {
    href: "https://www.datavruti.com/blog/not-all-revenue-is-the-same",
    date: "2026-06-18",
    label: "18 Jun 2026",
    title: "Not all revenue is the same",
    excerpt: "Why net fee income, not top-line revenue, became the number I watch most closely.",
    audiences: ["agencies"],
  },
  {
    href: "https://www.datavruti.com/blog/is-your-recruitment-business-healthy",
    date: "2026-06-16",
    label: "16 Jun 2026",
    title: "Is your recruitment business healthy?",
    excerpt: "The questions agency founders rarely ask each other: client concentration, recruiter productivity, forecasting.",
    audiences: ["agencies"],
  },
];

export const asks = [
  { q: "Hiring data, AI or analytics talent?", cta: "Let's connect", href: "https://www.datavruti.com/contact" },
  { q: "Running a recruitment agency?", cta: "See what we're building with estana", href: "https://estana.in" },
  { q: "Want to better show what you've built and achieved?", cta: "Tell me what you think of graph", href: "https://mygraph.id" },
];

/* ---------- SEO / GEO ---------- */

export const keywords = [
  "Vikram Parekh",
  "datavruti founder",
  "estana founder",
  "graph mygraph.id",
  "data AI analytics recruitment",
  "data engineering recruitment India",
  "AI talent acquisition",
  "data science hiring",
  "recruitment agency software",
  "AI recruitment operating system",
  "talent infrastructure",
  "Ahmedabad founder",
];

/* Rich, crawlable descriptions of each venture used in schema, llms.txt and anchor text. */
export const ventureEntities = {
  datavruti: {
    id: "https://www.datavruti.com/#organization",
    legalName: "Reflion Tech Private Limited" as string | undefined,
    anchor: "datavruti: data, AI & analytics recruitment",
    summary:
      "datavruti (datavruti.com) is a specialist recruitment firm that helps startups, global capability centres (GCCs) and enterprises hire data, AI and analytics talent. It recruits only in that domain.",
    category: "Specialist recruitment firm",
  },
  estana: {
    id: "https://estana.in/#organization",
    legalName: undefined as string | undefined,
    anchor: "estana: AI-native operating system for recruitment agencies",
    summary:
      "estana (estana.in) is an AI-native operating system for recruitment agencies that raises recruiter output and consistency without adding headcount at the same rate.",
    category: "Recruitment agency software",
  },
  graph: {
    id: "https://mygraph.id/#organization",
    legalName: undefined as string | undefined,
    anchor: "graph: career graph and resume builder for data & AI professionals",
    summary:
      "graph (mygraph.id) is a career platform for data, AI and analytics professionals offering custom resumes, interview preparation and a personal career graph that captures the context and evidence behind their work.",
    category: "Career platform",
  },
} as const;

export const faqs = [
  {
    q: "Who is Vikram Parekh?",
    a: "Vikram Parekh is a co-founder based in Ahmedabad, India, building talent infrastructure for data, AI and analytics. He co-founded datavruti, a specialist data and AI recruitment firm, and is building estana (estana.in) for recruitment agencies and graph (mygraph.id) for professionals.",
  },
  {
    q: "What is datavruti?",
    a: ventureEntities.datavruti.summary,
  },
  {
    q: "What is estana?",
    a: ventureEntities.estana.summary + " Most agencies don't struggle for demand; they struggle because execution doesn't scale.",
  },
  {
    q: "What is graph (mygraph.id)?",
    a: ventureEntities.graph.summary,
  },
  {
    q: "How are datavruti, estana and graph connected?",
    a: "All three rest on one belief: better information makes better hiring decisions. datavruti helps companies hire data, AI and analytics talent, estana helps recruitment agencies do that work at scale, and graph helps professionals show what they've actually done.",
  },
  {
    q: "What does Vikram Parekh write for hiring managers and recruiters?",
    a: "Practical notes on hiring data, AI and analytics talent and on running a recruiting team: why specialist hiring needs specialist understanding, and how to manage recruiters by outcomes by separating what they control, influence and can't control. Filter them at vikramparekh.com/writing?for=hiring.",
  },
  {
    q: "What does Vikram Parekh write for recruitment agency owners?",
    a: "Lessons from building datavruti, an SME recruitment agency, including losing close to 80% of the business in 2023 and rebuilding it: client concentration risk, net fee income versus revenue, recruiter productivity, forecasting, and why survival, growth and resilience each need different decisions. Filter them at vikramparekh.com/writing?for=agencies.",
  },
  {
    q: "Does Vikram Parekh write for data and AI job seekers?",
    a: "Yes. Writing for data, AI and analytics professionals focuses on how hiring looks from the other side of the table and how to show the context and evidence behind what you've built, the same idea behind graph (mygraph.id). Filter it at vikramparekh.com/writing?for=jobseekers.",
  },
  {
    q: "How can I contact Vikram Parekh?",
    a: "Email vikram@datavruti.com, call +91 98679 98866, or connect on LinkedIn at linkedin.com/in/vikramkparekh. For hiring data, AI or analytics talent, use datavruti.com/contact.",
  },
];

/* Lines for the scrolling band, all drawn from Vikram's own principles and product copy. */
export const manifesto = [
  "Increase signal.",
  "Reduce noise.",
  "Better information, better hiring.",
  "Specialist hiring needs specialist understanding.",
  "Show the evidence behind the work.",
  "Manage by outcomes.",
  "Revenue is the starting point, not the answer.",
  "Execution that scales.",
];

/* Early career, 2000–2018, from Vikram's LinkedIn profile. Shown as the winding-road infographic;
   `detail` fills the card that opens when a stop is tapped. Facts only, no embellishment. */
export type CareerDetail = {
  org: string;
  role: string;
  dates: string;
  place?: string;
  points?: string[];
  quote?: string;
  credentials?: string[];
  link?: { href: string; label: string };
};
export type CareerStop = { year: string; what: string; strong: string; after?: string; where: string; tag?: string; icon: string; detail: CareerDetail };
export const earlyCareer: { key: "learn" | "risk" | "build"; label: string; stops: CareerStop[] }[] = [
  {
    key: "learn",
    label: "Learning the systems · 2000–05",
    stops: [
      {
        year: "2000", what: "Trained as an", strong: "architect", where: "G.D.Arch, L.S. Raheja School of Architecture, Mumbai", icon: "arch",
        detail: {
          org: "L.S. Raheja School of Architecture",
          role: "G.D.Arch, Architecture",
          dates: "Graduated 2000",
          place: "Mumbai, India",
          points: ["Started out in architecture before moving into information systems and technology."],
        },
      },
      {
        year: "2001", what: "Moved to the US for", strong: "tech", where: "Research analyst and network administrator, Eastern Michigan University", icon: "network",
        detail: {
          org: "Eastern Michigan University",
          role: "Research Analyst / Network Administrator",
          dates: "Sep 2001 – May 2004 · 2 yrs 9 mos",
          place: "Ypsilanti, Michigan, USA",
          points: ["Worked as a research analyst and network administrator while studying for a master's in information systems."],
        },
      },
      {
        year: "2004", what: "Master's in", strong: "Information Systems", where: "M.S., Eastern Michigan University", icon: "cap",
        detail: {
          org: "Eastern Michigan University",
          role: "Master of Science (M.S.), Information Systems",
          dates: "Graduated 2004",
          place: "Michigan, USA",
        },
      },
      {
        year: "2004", what: "Data warehousing for", strong: "Johnson & Johnson", where: "SAP BW consultant via Quantum Infotech, New Jersey", icon: "db",
        detail: {
          org: "Quantum Infotech, USA",
          role: "SAP BW Consultant to Johnson & Johnson",
          dates: "Jul 2004 – Feb 2005 · 8 mos",
          place: "New Jersey, USA",
          points: ["Consulted on SAP Business Warehouse (BW) for Johnson & Johnson."],
        },
      },
    ],
  },
  {
    key: "risk",
    label: "Guarding the risk · 2005–13",
    stops: [
      {
        year: "2005", what: "", strong: "KPMG", after: ", IT Advisory", where: "Mumbai and Detroit; rose to Manager. Earned CISA in 2006.", tag: "Best Debut Performance award", icon: "audit",
        detail: {
          org: "KPMG",
          role: "Manager, IT Advisory Services",
          dates: "Mar 2005 – Sep 2008 · 3 yrs 7 mos",
          place: "Mumbai, India · Detroit, Michigan, USA",
          credentials: [
            "Certificate of Appreciation: Best Debut Performance, IT Advisory Services",
            "Best Compliance to KPMG's Risk Management Practices, IT Advisory Services",
            "CISA (Certified Information Systems Auditor), 2006",
          ],
        },
      },
      {
        year: "2008", what: "Internal audit,", strong: "Cadbury", where: "Manager, Internal Audit, Asia Pacific at Mondelēz. PMP in 2010.", icon: "clipboard",
        detail: {
          org: "Mondelēz International (Cadbury India Limited)",
          role: "Manager, Internal Audit, Asia Pacific",
          dates: "Nov 2008 – Jan 2011 · 2 yrs 3 mos",
          place: "Mumbai, India",
          credentials: ["PMP (Project Management Professional), 2010"],
        },
      },
      {
        year: "2011", what: "VP at", strong: "JPMorgan", where: "Information Risk Manager, Mumbai", icon: "bank",
        detail: {
          org: "JPMorgan Services India Pvt Ltd",
          role: "Vice President, Information Risk Manager",
          dates: "Jan 2011 – Mar 2013 · 2 yrs 3 mos",
          place: "Mumbai, India",
        },
      },
      {
        year: "2013", what: "Took the", strong: "leap", where: "Start Your Business programme, SP Jain Institute (SPJIMR)", tag: "Left JPMorgan in March, founder by April", icon: "rocket",
        detail: {
          org: "S.P. Jain Institute of Management & Research",
          role: "Start Your Business, Entrepreneurship",
          dates: "2013",
          place: "Mumbai, India",
          points: [
            "Left JPMorgan in March 2013 and was running his own companies by April.",
            "Has returned to SPJIMR as a guest lecturer in entrepreneurship since March 2021, on the same Start Your Business programme.",
          ],
        },
      },
    ],
  },
  {
    key: "build",
    label: "Building and selling · 2013–18",
    stops: [
      {
        year: "2013", what: "Founded", strong: "Optic Bridge", where: "Gamification for brand loyalty, employee engagement and rewards", tag: "Patent: a business gamification system", icon: "trophy",
        detail: {
          org: "Optic Bridge Technologies",
          role: "Founder, Director, Investor",
          dates: "Apr 2013 – Mar 2015 · 2 yrs",
          place: "Mumbai, India",
          points: [
            "Helped clients understand gamification and how it can build brand loyalty and increase customer stickiness.",
            "Designed employee engagement and motivation programmes, and reward and recognition strategies.",
          ],
          credentials: ["Patent: A Business Gamification System and Method"],
        },
      },
      {
        year: "2013", what: "Investor in", strong: "WireddIn", where: "Director at an IIT-Bombay alumni studio; built NextGenCatalogs, a B2B product platform", icon: "devices",
        detail: {
          org: "WireddIn Interactive",
          role: "Investor and Director",
          dates: "Apr 2013 – Mar 2015 · 2 yrs",
          place: "Mumbai, India",
          points: [
            "Mobile and web development company founded by IIT-Bombay alumni.",
            "Built NextGenCatalogs, a B2B communication backbone for product-centric conversations between manufacturers, distributors and retailers.",
          ],
        },
      },
      {
        year: "2015", what: "Head of", strong: "Sales & Marketing", where: "Grass Roots India; Director and Board Member. Customer, employee and channel loyalty.", icon: "megaphone",
        detail: {
          org: "Grass Roots India",
          role: "Head of Sales and Marketing; Director and Board Member",
          dates: "Apr 2015 – Feb 2018 · 2 yrs 11 mos",
          place: "Mumbai, India",
          quote:
            "As a business development leader, I had a relentless focus on customer satisfaction. Whether it was acquiring new clients or growing existing relationships, I spent a lot of effort in understanding client challenges and helping them achieve their goals in employee, customer and channel loyalty.",
        },
      },
      {
        year: "2018", what: "Co-founded", strong: "Multplyr", after: " with Ravi Vyas", where: "The HR tech business that became datavruti", icon: "flag",
        detail: {
          org: "Multplyr",
          role: "Co-founder, with Ravi Vyas",
          dates: "Mar 2018 – Feb 2025 · 7 yrs",
          place: "Ahmedabad, Gujarat, India",
          points: [
            "Started with Ravi Vyas as an HR tech business, then moved into recruitment services together.",
            "Multplyr is now datavruti, which hires data, AI and analytics talent for startups, GCCs and enterprises.",
          ],
          link: { href: "https://www.datavruti.com", label: "Visit datavruti" },
        },
      },
    ],
  },
];
