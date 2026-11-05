import { asks, faqs, journey, posts, principles, site, stats, ventureEntities, ventures } from "./content";

const venturesBlock = () =>
  ventures
    .map((v) => `- [${v.name}](${v.url}): ${ventureEntities[v.name as keyof typeof ventureEntities].summary}`)
    .join("\n");

export function llmsTxt() {
  return `# ${site.name}

> ${site.name} is a co-founder based in Ahmedabad, India, building talent infrastructure for data, AI and analytics. He co-founded datavruti (data, AI & analytics recruitment) and is building estana (estana.in) for recruitment agencies and graph (mygraph.id) for professionals.

Core belief: better information makes better hiring decisions. Increase signal, reduce noise.

## Companies and products

${venturesBlock()}

## Writing

${posts.map((p) => `- [${p.title}](${p.href}) (${p.date}): ${p.excerpt}`).join("\n")}

## Contact

- Email: ${site.email}
- LinkedIn: ${site.linkedin}
- Website: ${site.url}
- Location: ${site.location}

## Optional

- [Full profile for LLMs](${site.url}/llms-full.txt)
`;
}

export function llmsFullTxt() {
  return `# ${site.name}: full profile

> ${site.description}

Role: Co-founder. Location: ${site.location}. Focus: ${site.tagline}.

## About

For the last decade Vikram Parekh has worked on one problem from different angles: how do the right talent and the right opportunities find each other with more accuracy, more trust and less wasted effort? That question led him to build three things. datavruti helps companies hire data, AI and analytics talent. estana helps recruitment agencies do that work at scale. graph helps data, AI and analytics professionals show what they've actually done. All three rest on the same belief: better information makes better hiring decisions.

## Key facts

${stats.map((s) => `- ${s.value}: ${s.label}`).join("\n")}

## Companies and products

${ventures
  .map((v) => {
    const e = ventureEntities[v.name as keyof typeof ventureEntities];
    return `### ${v.name} (${v.host})

- URL: ${v.url}
- Audience: ${v.audience}
- Category: ${e.category}${e.legalName ? `\n- Legal entity: ${e.legalName}` : ""}

${v.desc}`;
  })
  .join("\n\n")}

## Timeline

${journey.map((j) => `- ${j.year}, ${j.title}: ${j.text}`).join("\n")}

## Principles

${principles.map((p) => `- ${p.title} ${p.text}`).join("\n")}

## Writing

${posts.map((p) => `- ${p.title} (${p.date}) — ${p.href}\n  ${p.excerpt}`).join("\n")}

## Frequently asked questions

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Work with Vikram

${asks.map((a) => `- ${a.q} ${a.cta}: ${a.href}`).join("\n")}
- Email: ${site.email}
- LinkedIn: ${site.linkedin}
`;
}
