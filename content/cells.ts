export type CellData = {
  id: string;            // "01".."05"
  label: string;         // eyebrow
  question: string;      // "you" headline
  questionBody: string;
  answer: string;        // "codehive" headline
  answerBody: string;
  chips: string[];
  cta: string;
};

// Copy is the site's content. Edit here, nowhere else.
export const cells: CellData[] = [
  {
    id: "01", label: "Strategy and advisory",
    question: "Which of your AI pilots deserves a budget?",
    questionBody: "Marketing has a chatbot. Support tried a vendor. The board wants to know if the company is behind. Nobody owns the answer, so every pilot gets a little money and none gets a decision.",
    answer: "A plan the board can fund.",
    answerBody: "We work out where AI pays off in your business and put a number on each case. Build or buy, which vendor, what can go wrong. Then a roadmap in the order it has to happen: data first, then people, then the change itself.",
    chips: ["AI strategy engagement", "Build vs buy and vendor evaluation", "AI risk assessment", "Implementation roadmap", "Executive and board briefings"],
    cta: "Book a call"
  },
  {
    id: "02", label: "Application development",
    question: "How many tabs does support open per ticket?",
    questionBody: "Your team answers the same questions by hand, from PDFs, Confluence and the one person who remembers. The last AI pilot was a demo. Nobody dared put it in front of a customer.",
    answer: "Assistants your customers can talk to.",
    answerBody: "Chatbots and support agents that answer from your own documents. Agents that transcribe meetings, do research, find prospects. MCP servers so your tools can call each other. Built on whatever framework fits your stack, and shipped with an eval set so you know when it breaks.",
    chips: ["Custom chatbots and RAG assistants", "Multimodal support agents", "SDR and deep-research agents", "Meeting transcription and action items", "MCP servers and multi-agent systems"],
    cta: "Book a call"
  },
  {
    id: "03", label: "Model work",
    question: "Which model, and on whose servers?",
    questionBody: "The API bill grows every month. Legal will not let customer data leave the EU. Nobody can say if the newest model is better for your task, so the prompt gets another edit.",
    answer: "The right model, measured, where your data is allowed to go.",
    answerBody: "We benchmark candidates on your own data, all of it. When compliance needs it, we run open models on your infrastructure. When a prompt is not enough, we curate a dataset and fine-tune, QLoRA on open models or at the frontier.",
    chips: ["Model selection and benchmarking", "Private open-source deployment", "Dataset curation", "Frontier fine-tuning", "QLoRA fine-tuning of open models"],
    cta: "Book a call"
  },
  {
    id: "04", label: "Production and MLOps",
    question: "It works on the laptop. Then what?",
    questionBody: "The prototype is a notebook and a demo page. There is no tracing, no cost cap, no login, and a prompt injection would make the news. You cannot hand it to anyone.",
    answer: "A system your team can run without us.",
    answerBody: "Terraform environments that promote dev to test to prod on their own. Bedrock or self-hosted inference. Production RAG on managed vector storage. LangFuse tracing with a cost ceiling. JWT on the front door. And a migration path for the thing you already built.",
    chips: ["Cloud architecture on AWS, Azure, GCP", "Terraform and CI/CD", "Bedrock, SageMaker, AgentCore", "Production RAG pipelines", "Observability and guardrails", "Security hardening", "Prototype to production migration"],
    cta: "Book a call"
  },
  {
    id: "05", label: "Enablement",
    question: "What happens when the one person who knows leaves?",
    questionBody: "One engineer understands the pipeline. The vendor who built the pilot has moved on. Your board learns about AI from the news instead of from you.",
    answer: "A team that owns it.",
    answerBody: "Training at every layer, from a board briefing to hands-on sessions for engineers. During the build we pair with your team, so when we leave the knowledge does not.",
    chips: ["Executive and board workshops", "Engineer training on LLM and agent stacks", "Pairing during delivery", "Runbooks and handover"],
    cta: "Book a call"
  },
];
