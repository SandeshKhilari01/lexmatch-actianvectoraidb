# LexMatch: Demo Clauses & Killer Moments

Use these pre-selected clauses during your demo to showcase the power of LexMatch and Actian VectorAI DB.

## 1. The "High Risk" Detection
**Clause:** 
> "Either party may terminate this agreement with 30 days written notice to the other party."

**Expected Result:**
- LexMatch finds a match with **90%+ similarity**.
- Top result is flagged **HIGH RISK**.
- **The Twist:** In the matched contract, the clause had "no cure period," which led to a historic dispute. LexMatch surfaces this institutional memory instantly.

## 2. The Semantic Search Proof
**Clause:**
> "The company shall keep all client information strictly private and shall not share it with third parties without express consent."

**Expected Result:**
- LexMatch finds matches related to **"Confidentiality"** and **"Non-Disclosure"**, even if those exact words weren't in your input.
- Showcases the `all-MiniLM-L6-v2` embedding model working with VectorAI DB's ANN search.

## 3. The Filtered Search (Risk Mitigation)
**Action:**
1. Paste a general liability clause.
2. Toggle the **Risk Level Filter** to "High Risk Only".
3. Click "Find Similar".

**Narrative:**
- "I'm using VectorAI DB's **Payload Filtering** to only search within our historically problematic clauses. This allows us to focus our review on known high-exposure patterns."

## 4. The Hybrid Fusion (Advanced Ranking)
**Action:**
1. Run a search with "Hybrid Search" **OFF**.
2. Note the result ranking.
3. Toggle "Hybrid Search" **ON** and search again.

**Narrative:**
- "By enabling **Hybrid Fusion**, we combine standard semantic search with a second search pass and use **Reciprocal Rank Fusion (RRF)** within VectorAI DB to deliver a more robust and accurate ranking of legal precedents."

## 5. The Diff Modal (Visual Clarity)
**Action:**
1. Click **"View Diff"** on a match.
2. Point to the red/green highlights.

**Narrative:**
- "Lawyers don't just want to know if something is similar; they want to know **what changed**. Our side-by-side diff modal highlights every subtle rewording, making review cycles 10x faster."
