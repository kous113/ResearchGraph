
import pool from "../config/db.js";

export async function createPaper(userId, title, fileName, totalPages, analysis) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const paperResult = await client.query(
      `INSERT INTO papers (user_id, title, file_name, total_pages)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, fileName, totalPages]
    );

    const paper = paperResult.rows[0];

    await client.query(
      `INSERT INTO paper_analyses (paper_id, analysis)
       VALUES ($1, $2)`,
      [paper.id, JSON.stringify(analysis)]
    );

    await client.query("COMMIT");
    return paper;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllPapers(userId) {
  const result = await pool.query(
    `SELECT p.*, pa.analysis
     FROM papers p
     LEFT JOIN paper_analyses pa ON p.id = pa.paper_id
     WHERE p.user_id = $1
     ORDER BY p.uploaded_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function getPaperById(paperId, userId) {
  const result = await pool.query(
    `SELECT p.*, pa.analysis
     FROM papers p
     LEFT JOIN paper_analyses pa ON p.id = pa.paper_id
     WHERE p.id = $1 AND p.user_id = $2`,
    [paperId, userId]
  );

  return result.rows[0];
}

export async function deletePaper(paperId, userId) {
  const result = await pool.query(
    `DELETE FROM papers
     WHERE id = $1 AND user_id = $2
     RETURNING id, title`,
    [paperId, userId]
  );

  return result.rows[0];
}

// Convert extracted text into useful comparison terms.
function getTerms(value) {
  const stopWords = new Set([
    "the", "and", "for", "with", "from", "that", "this", "are",
    "was", "were", "using", "based", "into", "through", "their",
    "which", "also", "can", "may", "has", "have", "had", "its",
    "between", "within", "over", "under", "such", "than", "then",
    "these", "those", "been", "being", "research", "study", "paper",
    "approach", "method", "methods"
  ]);

  const text = Array.isArray(value) ? value.join(" ") : String(value || "");

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );
}

// Dice coefficient: 0 means no overlap, 1 means identical term sets.
function calculateSimilarity(first, second) {
  if (!first.size || !second.size) return 0;

  let common = 0;

  for (const term of first) {
    if (second.has(term)) common++;
  }

  return (2 * common) / (first.size + second.size);
}

function getRelationshipMatches(firstAnalysis, secondAnalysis) {
  const comparisons = [
    {
      type: "topic",
      first: getTerms(firstAnalysis.topics),
      second: getTerms(secondAnalysis.topics),
      threshold: 0.20,
      label: "Shared research topics"
    },
    {
      type: "problem",
      first: getTerms(firstAnalysis.research_problem),
      second: getTerms(secondAnalysis.research_problem),
      threshold: 0.20,
      label: "Similar research problems"
    },
    {
      type: "methodology",
      first: getTerms(firstAnalysis.methodology),
      second: getTerms(secondAnalysis.methodology),
      threshold: 0.25,
      label: "Related methodologies"
    }
  ];

  return comparisons
    .map((comparison) => {
      const score = calculateSimilarity(
        comparison.first,
        comparison.second
      );

      if (score < comparison.threshold) return null;

      const sharedTerms = [...comparison.first]
        .filter((term) => comparison.second.has(term))
        .slice(0, 8);

      return {
        type: comparison.type,
        description: `${comparison.label}. Shared concepts: ${sharedTerms.join(", ")}.`,
      };
    })
    .filter(Boolean);
}

// Recalculate and save all relationships between a user's papers.
export async function generatePaperRelationships(userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const papersResult = await client.query(
      `SELECT p.id, pa.analysis
       FROM papers p
       JOIN paper_analyses pa ON p.id = pa.paper_id
       WHERE p.user_id = $1
       ORDER BY p.id`,
      [userId]
    );

    const papers = papersResult.rows.map((paper) => ({
      ...paper,
      analysis:
        typeof paper.analysis === "string"
          ? JSON.parse(paper.analysis)
          : paper.analysis
    }));

    // Remove old relationships for this user's papers before rebuilding.
    await client.query(
      `DELETE FROM paper_relationships pr
       WHERE pr.source_paper_id IN (
         SELECT id FROM papers WHERE user_id = $1
       )
       AND pr.target_paper_id IN (
         SELECT id FROM papers WHERE user_id = $1
       )`,
      [userId]
    );

    let relationshipCount = 0;

    for (let i = 0; i < papers.length; i++) {
      for (let j = i + 1; j < papers.length; j++) {
        const firstPaper = papers[i];
        const secondPaper = papers[j];

        const matches = getRelationshipMatches(
          firstPaper.analysis || {},
          secondPaper.analysis || {}
        );

        for (const match of matches) {
          await client.query(
            `INSERT INTO paper_relationships
             (source_paper_id, target_paper_id, relationship_type, description)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (source_paper_id, target_paper_id, relationship_type)
             DO UPDATE SET description = EXCLUDED.description`,
            [
              firstPaper.id,
              secondPaper.id,
              match.type,
              match.description
            ]
          );

          relationshipCount++;
        }
      }
    }

    await client.query("COMMIT");

    return {
      papersCompared: papers.length,
      relationshipsGenerated: relationshipCount
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Return saved relationships with paper titles for the graph.
export async function getPaperRelationships(userId) {
  const result = await pool.query(
    `SELECT
       pr.id,
       pr.source_paper_id,
       source.title AS source_title,
       pr.target_paper_id,
       target.title AS target_title,
       pr.relationship_type,
       pr.description
     FROM paper_relationships pr
     JOIN papers source ON source.id = pr.source_paper_id
     JOIN papers target ON target.id = pr.target_paper_id
     WHERE source.user_id = $1
       AND target.user_id = $1
     ORDER BY pr.created_at DESC`,
    [userId]
  );

  return result.rows;
}


// Save or refresh generated research gaps for a user.
export async function saveResearchGaps(userId, gaps, sourcePaperIds) {
  const result = await pool.query(
    `INSERT INTO research_gaps
       (user_id, gaps, source_paper_ids, generated_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id)
     DO UPDATE SET
       gaps = EXCLUDED.gaps,
       source_paper_ids = EXCLUDED.source_paper_ids,
       generated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, JSON.stringify(gaps), sourcePaperIds]
  );

  return result.rows[0];
}

// Retrieve previously generated research gaps.
export async function getResearchGaps(userId) {
  const result = await pool.query(
    `SELECT *
     FROM research_gaps
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0] || null;
}
