export const site = {
  name: "Vikram Parekh",
  url: "https://vikramparekh.com",
  tagline: "Data, AI & Analytics Talent Infrastructure",
  description:
    "Vikram Parekh is building talent infrastructure for data, AI and analytics: datavruti for hiring teams, estana for recruitment agencies, and graph for professionals.",
  email: "vikram@datavruti.com",
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
  { value: "2018", label: "First company founded" },
  { value: "3", label: "Products, one belief" },
  { value: "1", label: "Domain: data, AI & analytics" },
  { value: "80%", label: "Business lost in 2023, then rebuilt" },
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
  { year: "2018", title: "Multplyr", text: "I came from a tech background and started Multplyr, an HR tech business." },
  { year: "2021", title: "Into recruitment", text: "Ravi Vyas and I moved into recruitment services. A few people trusted us with their hiring. One client became two, then three." },
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

export const posts = [
  {
    href: "https://www.datavruti.com/blog/the-advice-thats-right-today-can-become-wrong-tomorrow",
    date: "2026-07-07",
    label: "7 Jul 2026",
    title: "The advice that's right today can become wrong tomorrow",
    excerpt: "How focusing on tech hiring grew datavruti, then exposed it, and why survival, growth and resilience each need different decisions.",
  },
  {
    href: "https://www.datavruti.com/blog/i-managed-by-outcomes-i-just-didnt-know-what-drove-them",
    date: "2026-06-24",
    label: "24 Jun 2026",
    title: "I managed by outcomes. I just didn't know what drove them.",
    excerpt: "Separating what a recruiter controls, influences and can't control, and coaching from there.",
  },
  {
    href: "https://www.datavruti.com/blog/not-all-revenue-is-the-same",
    date: "2026-06-18",
    label: "18 Jun 2026",
    title: "Not all revenue is the same",
    excerpt: "Why net fee income, not top-line revenue, became the number I watch most closely.",
  },
  {
    href: "https://www.datavruti.com/blog/is-your-recruitment-business-healthy",
    date: "2026-06-16",
    label: "16 Jun 2026",
    title: "Is your recruitment business healthy?",
    excerpt: "The questions agency founders rarely ask each other: client concentration, recruiter productivity, forecasting.",
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
    q: "What does Vikram Parekh write about?",
    a: "He writes about hiring and running a recruitment business: client concentration, recruiter productivity, net fee income versus revenue, managing by outcomes, and how survival, growth and resilience each need different decisions.",
  },
  {
    q: "How can I contact Vikram Parekh?",
    a: "Email vikram@datavruti.com or connect on LinkedIn at linkedin.com/in/vikramkparekh. For hiring data, AI or analytics talent, use datavruti.com/contact.",
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
