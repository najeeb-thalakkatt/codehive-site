export type Service = {
  id: string;         // "01".."06", the only place a service number is typed
  slug: string;       // anchor and animation key
  name: string;       // full name: card header, service index, Calendly's "Which service" option (must match exactly)
  short: string;      // hero tile
  index: string;      // services intro honeycomb label
  question: string;   // the "you" turn
  problem: string;
  answer: string;     // the "codehive" turn
  body: string;
  chips: string[];
  animation: string;  // key into components/cells/index.ts
};

export const BOOK = "Book a call";

// Copy is the site's content (SITE_COPY_v2). Edit here, nowhere else.
export const SERVICES: Service[] = [
  {
    id: "01", slug: "strategy", name: "Strategy and advisory", short: "plan", index: "STRATEGY", animation: "strategy",
    question: "Which of your AI pilots deserves a budget?",
    problem: "Marketing has a chatbot. Support tried a vendor. The board wants to know if the company is behind. Nobody owns the answer, so every pilot gets a little money and none gets a decision.",
    answer: "A plan the board can fund.",
    body: "We work out where AI pays off in your business and put a number on each case: build or buy, which vendor, what can go wrong. Then a roadmap in the order it has to happen. Data first, then people, then the change itself.",
    chips: ["AI strategy engagement", "Build vs buy and vendor evaluation", "AI risk assessment", "Implementation roadmap", "Executive and board briefings"],
  },
  {
    id: "02", slug: "applications", name: "Application development", short: "agents", index: "APPS", animation: "applications",
    question: "How many tabs does support open per ticket?",
    problem: "Your team answers the same questions by hand, from PDFs, Confluence and the one person who remembers. The last AI pilot was a demo nobody dared put in front of a customer.",
    answer: "Assistants that answer from your own documents.",
    body: "Support agents and chatbots that cite the handbook instead of guessing. Agents that transcribe meetings, do research or find prospects. MCP servers so your tools can call each other. Built on whatever framework fits your stack, with an eval set so you know when it breaks.",
    chips: ["Custom chatbots and RAG assistants", "Multimodal support agents", "SDR and deep-research agents", "Meeting transcription and action items", "MCP servers and multi-agent systems"],
  },
  {
    id: "03", slug: "models", name: "Model work", short: "models", index: "MODELS", animation: "models",
    question: "Which model, and on whose servers?",
    problem: "The API bill grows every month. Legal will not let customer data leave the EU. Nobody can say whether the newest model is better for your task, so the prompt gets another edit.",
    answer: "The right model, measured on your data, run where your data may go.",
    body: "We benchmark candidate models on your own eval set, the same cases for every model. When compliance needs it, we run open models on your infrastructure. When a prompt is not enough, we curate a dataset and fine-tune: an open model with QLoRA, or a hosted frontier model through its provider.",
    chips: ["Model selection and benchmarking", "Private open-source deployment", "Dataset curation", "Frontier fine-tuning", "QLoRA fine-tuning of open models"],
  },
  {
    id: "04", slug: "production", name: "Production and MLOps", short: "live", index: "PRODUCTION", animation: "production",
    question: "It works on the laptop. Then what?",
    problem: "The prototype is a notebook and a demo page. No tracing, no cost cap, no login, and a prompt injection would make the news. You cannot hand it to anyone.",
    answer: "A system your team can run without us.",
    body: "Terraform environments that promote dev to test to prod on their own. Bedrock or self-hosted inference. Production RAG on managed vector storage. LangFuse tracing with a cost ceiling. JWT on the front door. And a migration path for the thing you already built.",
    chips: ["Cloud architecture on AWS, Azure, GCP", "Terraform and CI/CD", "Bedrock, SageMaker, AgentCore", "Production RAG pipelines", "Observability and guardrails", "Security hardening", "Prototype to production migration"],
  },
  {
    id: "05", slug: "enablement", name: "Enablement", short: "handover", index: "ENABLEMENT", animation: "enablement",
    question: "What happens when the one person who knows leaves?",
    problem: "One engineer understands the pipeline. The vendor who built the pilot has moved on. Your board learns about AI from the news instead of from you.",
    answer: "A team that owns it.",
    body: "Training at every layer, from a board briefing to hands-on sessions for engineers. During the build we pair with your team, so the knowledge stays when we leave.",
    chips: ["Executive and board workshops", "Engineer training on LLM and agent stacks", "Pairing during delivery", "Runbooks and handover"],
  },
  {
    id: "06", slug: "backend", name: "Plain backend", short: "API", index: "BACKEND", animation: "backend",
    question: "Do you need AI for this at all?",
    problem: "The brief says \"add AI\". The actual problem is a report that takes a week, a sync job that fails every Sunday, or two systems that do not talk to each other. A well-built backend would fix it and nobody would need a model.",
    answer: "Sometimes a good API is the whole answer.",
    body: "We build backend systems: APIs, data pipelines, integrations, and the queues and databases behind them. If that is what your problem needs, that is what we build, and we will say so before you pay for a model you do not need.",
    chips: ["REST and GraphQL APIs", "Data pipelines and ETL", "Integrations and event systems", "Postgres, queues and cloud deployment"],
  },
];
