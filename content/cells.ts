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
  { id: "01", label: "Strategy and advisory",
    question: "Which of your AI pilots deserves a budget?",
    questionBody: "Marketing has a chatbot. Support tried a vendor. The board is asking whether the company is behind. Nobody owns the answer, so every pilot gets a little money and none gets a decision.",
    answer: "A plan the board can fund.",
    answerBody: "We assess where AI actually pays off for your business, quantify each case, compare building against buying, name the risks, and hand you a roadmap with data, people and change work in order.",
    chips: ["AI strategy engagement", "Build vs buy and vendor evaluation", "AI risk assessment", "Implementation roadmap", "Executive and board briefings"],
    cta: "Book a call" },
  { id: "02", label: "Application development",
    question: "How many tabs does support open per ticket?",
    questionBody: "Your team answers the same questions by hand, from PDFs, Confluence and the one person who remembers. Every AI pilot so far was a demo nobody dared to put in front of a customer.",
    answer: "Assistants your customers actually talk to.",
    answerBody: "Chatbots and support agents grounded in your own documents, agents that transcribe, research and prospect, MCP servers so your tools can talk to each other. Built on the framework that fits your stack and shipped with evals.",
    chips: ["Custom chatbots and RAG assistants", "Multimodal support agents", "SDR and deep-research agents", "Meeting transcription and action items", "MCP servers and multi-agent systems"],
    cta: "Start a project" },
  { id: "03", label: "Model work",
    question: "Which model, and on whose servers?",
    questionBody: "The API bill grows every month, legal will not let customer data leave the EU, and nobody can say whether the newest model is actually better for your task. So the prompt gets another edit.",
    answer: "The right model, measured, where your data is allowed to go.",
    answerBody: "We benchmark candidates on your own data, deploy open models privately when compliance needs it, curate the dataset, and fine-tune with QLoRA or at the frontier when a prompt is not enough.",
    chips: ["Model selection and benchmarking", "Private open-source deployment", "Dataset curation", "Frontier fine-tuning", "QLoRA fine-tuning of open models"],
    cta: "Start a project" },
  { id: "04", label: "Production and MLOps",
    question: "It works on the laptop. Then what?",
    questionBody: "The prototype is a notebook and a demo page. No tracing, no cost limit, no auth, and one prompt injection away from an incident. It cannot be handed to anyone.",
    answer: "A system your team can run without you.",
    answerBody: "Terraform environments with automated promotion, Bedrock or self-hosted inference, production RAG on managed vector storage, LangFuse tracing and cost control, JWT-secured frontends, and a migration path for what you already built.",
    chips: ["Cloud architecture on AWS, Azure, GCP", "Terraform and CI/CD", "Bedrock, SageMaker, AgentCore", "Production RAG pipelines", "Observability and guardrails", "Security hardening", "Prototype to production migration"],
    cta: "Start a project" },
  { id: "05", label: "Enablement",
    question: "What happens when the one person who knows leaves?",
    questionBody: "One engineer understands the pipeline. The vendor who built the pilot is gone. The board hears about AI from the news, not from your own team.",
    answer: "A team that owns it.",
    answerBody: "Training on every layer above, from board briefings to hands-on sessions for engineers, and pairing during the build so the knowledge stays in your company when we leave.",
    chips: ["Executive and board workshops", "Engineer training on LLM and agent stacks", "Pairing during delivery", "Runbooks and handover"],
    cta: "Book a call" },
];
