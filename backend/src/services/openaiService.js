
import OpenAI from "openai";

import { paperSchema } from "../schemas/paperSchema.js";
import { splitTextIntoChunks } from "../utils/textChunker.js";

// Shared Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from .env");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

// Test Groq connection
export async function testOpenAIConnection() {
  const groq = getGroqClient();

  const response = await groq.responses.create({
    model: "openai/gpt-oss-20b",
    input: "Reply with exactly: Groq connection successful",
  });

  return response.output_text;
}

// Analyse a research paper
export async function analyzeResearchPaper(extractedText) {
  if (!extractedText || !extractedText.trim()) {
    throw new Error("Extracted paper text is empty.");
  }

  const groq = getGroqClient();

  const chunks = splitTextIntoChunks(extractedText, 12000);
  const chunkResults = [];

  for (let i = 0; i < chunks.length; i++) {
    const prompt = `
You are an academic research paper analysis assistant.

Analyse the following research paper text and extract its information.

Return ONLY a valid JSON object with this exact structure:

{
  "title": "Research paper title",
  "authors": ["Author 1", "Author 2"],
  "publication_year": "Year",
  "research_problem": "Main research problem",
  "objectives": ["Objective 1"],
  "topics": ["Topic 1", "Topic 2"],
  "methodology": "Research methodology",
  "dataset": "Dataset used",
  "findings": ["Finding 1"],
  "limitations": ["Limitation 1"],
  "references": ["Reference 1"]
}

Rules:
- Extract information only from the supplied text.
- Do not invent authors, dates, datasets or references.
- Use empty strings when textual information is unavailable.
- Use empty arrays when list information is unavailable.
- Keep descriptions concise but informative.
- Return JSON only, without Markdown code fences.

This is chunk ${i + 1} of ${chunks.length}.

PAPER TEXT:
${chunks[i]}
`;

    const response = await groq.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    let result = response.output_text;

    if (!result) {
      throw new Error("AI returned an empty paper analysis response.");
    }

    result = result
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsedResult;

    try {
      parsedResult = JSON.parse(result);
    } catch {
      throw new Error(
        `AI returned invalid JSON while analysing chunk ${i + 1}.`
      );
    }

    const validationResult = paperSchema.safeParse(parsedResult);

    if (!validationResult.success) {
      throw new Error(
        `Paper analysis validation failed: ${validationResult.error.message}`
      );
    }

    chunkResults.push(validationResult.data);
  }

  // Merge information extracted from all chunks
  const mergeArray = (field) => [
    ...new Set(
      chunkResults.flatMap((result) => result[field])
    ),
  ];

  const mergedResult = {
    title:
      chunkResults.find((result) => result.title)?.title || "",

    authors: mergeArray("authors"),

    publication_year:
      chunkResults.find((result) => result.publication_year)
        ?.publication_year || "",

    research_problem:
      chunkResults.find((result) => result.research_problem)
        ?.research_problem || "",

    objectives: mergeArray("objectives"),

    topics: mergeArray("topics"),

    methodology:
      chunkResults.find((result) => result.methodology)
        ?.methodology || "",

    dataset:
      chunkResults.find((result) => result.dataset)?.dataset || "",

    findings: mergeArray("findings"),

    limitations: mergeArray("limitations"),

    references: mergeArray("references"),
  };

  return paperSchema.parse(mergedResult);
}

// Compare selected research papers using AI
export async function compareResearchPapers(papers) {
  if (!Array.isArray(papers) || papers.length < 2 || papers.length > 3) {
    throw new Error("Select between 2 and 3 research papers to compare.");
  }

  const groq = getGroqClient();

  const paperDetails = papers.map((paper) => {
    const analysis =
      typeof paper.analysis === "string"
        ? JSON.parse(paper.analysis)
        : paper.analysis || {};

    return {
      id: paper.id,
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
You are an academic research comparison assistant.

Compare the following research papers.

Return ONLY valid JSON in this exact structure:

{
  "summary": "Overall comparison summary",
  "similarities": ["Similarity 1"],
  "differences": ["Difference 1"],
  "methodology_comparison": "Compare the methodologies",
  "findings_comparison": "Compare the findings",
  "limitations_comparison": "Compare the limitations",
  "potential_research_direction": "Suggest a possible research direction"
}

Rules:
- Use only the information supplied.
- Do not invent research findings or methodologies.
- Clearly distinguish similarities from differences.
- Keep the comparison specific to the supplied papers.
- Return JSON only without Markdown code fences.

PAPERS:
${JSON.stringify(paperDetails, null, 2)}
`;

  const response = await groq.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });

  let result = response.output_text;

  if (!result) {
    throw new Error("AI returned an empty comparison response.");
  }

  result = result
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

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
      throw new Error(
        `AI comparison response is missing the ${field} field.`
      );
    }
  }

  return comparison;
}

// Discover potential research gaps across uploaded papers

export async function discoverResearchGaps(papers) {
  if (!Array.isArray(papers) || papers.length < 2) {
    throw new Error("At least 2 analysed papers are required.");
  }

  const groq = getGroqClient();

  const paperDetails = papers.map((paper) => {
    const analysis =
      typeof paper.analysis === "string"
        ? JSON.parse(paper.analysis)
        : paper.analysis || {};

    return {
      id: paper.id,
      title: paper.title,
      research_problem: analysis.research_problem || "",
      objectives: analysis.objectives || [],
      topics: analysis.topics || [],
      methodology: analysis.methodology || "",
      findings: analysis.findings || [],
      limitations: analysis.limitations || [],
    };
  });

  const prompt = `
You are an academic research analysis assistant.

Analyse the supplied research papers and identify potential research gaps
based ONLY on the information provided.

Look for:
1. Limitations repeated across multiple papers.
2. Research problems that remain unresolved.
3. Topics that have received limited investigation.
4. Methodology combinations or approaches that appear unexplored.

Return ONLY valid JSON in this structure:

{
  "gaps": [
    {
      "title": "Short research gap title",
      "category": "Research topic category",
      "description": "Explain the potential gap.",
      "reason": "Explain why the supplied papers suggest this gap.",
      "direction": "Suggest a possible future research direction.",
      "papers": [
        {
          "id": 1,
          "title": "Exact supporting paper title"
        }
      ],
      "limitations": [
        "A limitation explicitly reported in a supporting paper"
      ],
      "tag": "Short label"
    }
  ]
}

Rules:
- Generate 1 to 8 meaningful potential gaps.
- Use only the supplied papers as evidence.
- Never invent paper titles, limitations, findings or citations.
- Supporting paper IDs and titles must match the supplied papers.
- Prefer gaps supported by at least two papers.
- Do not manufacture gaps if evidence is insufficient.
- Distinguish potential research directions from proven research gaps.
- If evidence is insufficient, return {"gaps": []}.
- Return JSON only, without Markdown fences.

PAPERS:
${JSON.stringify(paperDetails, null, 2)}
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: "You are an academic research analysis assistant. Return valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_completion_tokens: 3000,
    response_format: { type: "json_object" },
  });

  let result = response.choices?.[0]?.message?.content;

  if (Array.isArray(result)) {
    result = result
      .map((item) => item.text || "")
      .join("");
  }

  if (!result || !result.trim()) {
    const finishReason = response.choices?.[0]?.finish_reason;

    throw new Error(
      `Groq returned no research gap text. Finish reason: ${finishReason || "unknown"}`
    );
  }

  let parsedResult;

  try {
    parsedResult = JSON.parse(
      result.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
    );
  } catch {
    throw new Error("AI returned invalid JSON for research gap discovery.");
  }

  if (!Array.isArray(parsedResult.gaps)) {
    throw new Error("AI response does not contain a valid gaps array.");
  }

  return parsedResult.gaps;
}

