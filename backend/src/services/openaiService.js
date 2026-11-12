import { paperSchema } from "../schemas/paperSchema.js";
import { splitTextIntoChunks } from "../utils/textChunker.js";
import OpenAI from "openai";

export async function testOpenAIConnection() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from .env");
  }

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await groq.responses.create({
    model: "openai/gpt-oss-20b",
    input: "Reply with exactly: Groq connection successful",
  });

  return response.output_text;
}


export async function analyzeResearchPaper(extractedText) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from .env");
  }

  if (!extractedText || !extractedText.trim()) {
    throw new Error("No paper text provided for analysis.");
  }

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const chunks = splitTextIntoChunks(extractedText, 12000);
  const chunkResults = [];

  for (let i = 0; i < chunks.length; i++) {
    const prompt = `
You are an expert research paper analysis assistant.

Analyse this section of a research paper.
This is section ${i + 1} of ${chunks.length}.

Return ONLY a valid JSON object with this structure:
{
  "title": "",
  "authors": [],
  "publication_year": "",
  "research_problem": "",
  "objectives": [],
  "topics": [],
  "methodology": "",
  "dataset": "",
  "findings": [],
  "limitations": [],
  "references": []
}

Instructions:
- Extract only information explicitly supported by this section.
- Do not invent missing information.
- Use empty strings or arrays when information is unavailable.
- Keep findings and limitations concise.
- Do not treat information from other papers as information about this paper.
- If this section contains no relevant information for a field, leave it empty.

PAPER SECTION:
${chunks[i]}
`;

    const response = await groq.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    const result = response.output_text;

    if (!result) {
      throw new Error(`AI returned an empty response for section ${i + 1}.`);
    }

    let parsedResult;

    try {
      parsedResult = JSON.parse(result);
    } catch {
      throw new Error(`AI returned invalid JSON for section ${i + 1}.`);
    }

    const validationResult = paperSchema.safeParse(parsedResult);

    if (!validationResult.success) {
      throw new Error(`Invalid analysis structure for section ${i + 1}.`);
    }

    chunkResults.push(validationResult.data);
  }

  const mergeArray = (field) => [
    ...new Set(chunkResults.flatMap((result) => result[field])),
  ];

  const mergedResult = {
    title: chunkResults.find((r) => r.title)?.title || "",
    authors: mergeArray("authors"),
    publication_year:
      chunkResults.find((r) => r.publication_year)?.publication_year || "",
    research_problem:
      chunkResults.find((r) => r.research_problem)?.research_problem || "",
    objectives: mergeArray("objectives"),
    topics: mergeArray("topics"),
    methodology:
      chunkResults.find((r) => r.methodology)?.methodology || "",
    dataset: chunkResults.find((r) => r.dataset)?.dataset || "",
    findings: mergeArray("findings"),
    limitations: mergeArray("limitations"),
    references: mergeArray("references"),
  };

  return paperSchema.parse(mergedResult);
}


export async function compareResearchPapers(papers) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from .env");
  }

  if (!Array.isArray(papers) || papers.length < 2 || papers.length > 3) {
    throw new Error("Select between 2 and 3 papers for comparison.");
  }

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const paperDetails = papers.map((paper, index) => {
    const analysis =
      typeof paper.analysis === "string"
        ? JSON.parse(paper.analysis)
        : paper.analysis || {};

    return {
      paper_number: index + 1,
      title: paper.title,
      authors: analysis.authors || [],
      research_problem: analysis.research_problem || "",
      objectives: analysis.objectives || [],
      topics: analysis.topics || [],
      methodology: analysis.methodology || "",
      dataset: analysis.dataset || "",
      findings: analysis.findings || [],
      limitations: analysis.limitations || [],
    };
  });

  const prompt = `
You are an expert academic research comparison assistant.

Compare the following research papers carefully.

Return ONLY a valid JSON object in this structure:

{
  "summary": "",
  "similarities": [],
  "differences": [],
  "methodology_comparison": "",
  "findings_comparison": "",
  "limitations_comparison": "",
  "potential_research_direction": ""
}

Instructions:
- Compare only information provided in the papers.
- Do not invent facts or conclusions.
- Identify meaningful similarities and differences.
- Explain how their methodologies differ or overlap.
- Compare their findings without assuming they prove the same thing.
- Identify common limitations and distinct limitations.
- Suggest a potential research direction only when supported by the comparison.
- If information is insufficient, explicitly mention that.
- Keep the response concise and academically appropriate.

PAPERS:
${JSON.stringify(paperDetails, null, 2)}
`;

  const response = await groq.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });

  const result = response.output_text;

  if (!result) {
    throw new Error("AI returned an empty comparison response.");
  }

  let comparison;

  try {
    comparison = JSON.parse(result);
  } catch {
    throw new Error("AI returned invalid JSON for paper comparison.");
  }

  const requiredFields = [
    "summary",
    "similarities",
    "differences",
    "methodology_comparison",
    "findings_comparison",
    "limitations_comparison",
    "potential_research_direction",
  ];

  for (const field of requiredFields) {
    if (!(field in comparison)) {
      throw new Error(`AI comparison is missing the ${field} field.`);
    }
  }

  return comparison;
}
