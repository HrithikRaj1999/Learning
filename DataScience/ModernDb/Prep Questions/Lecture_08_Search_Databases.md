# Lecture 8: Search Databases and Polyglot Persistence

- **Q96. What is a search database? Describe its retrieval workflow.**

  > - **Meaning**
  >   - A system optimized for searching documents and ranking relevant results.
  >     - Elasticsearch and OpenSearch are search-engine products.
  > - **Main operations**
  >   - Analyze text, build indexes, retrieve matches, and rank results.
  >   - Combine text search with filters, sorting, and aggregations.
  > - **Suitable uses**
  >   - Product discovery, log investigation, and document search.
  > - **Workflow**
  >   ```mermaid
  >   flowchart LR
  >       Documents[Documents] --> Analyze[Analyze text]
  >       Analyze --> Index[Build index]
  >       Query[User query] --> Match[Find matches]
  >       Index --> Match
  >       Match --> Rank[Rank results]
  >   ```

- **Q97. What does an inverted index store? Build one for two documents.**

  > - **Meaning: term to matching documents**
  >   - A postings list identifies documents containing a term.
  >     - It can also store occurrence counts and word positions.
  > - **Documents**
  >   - D1: `fast search database`.
  >   - D2: `database systems`.
  > - **Inverted entries**
  >   - `fast`: D1.
  >   - `search`: D1.
  >   - `database`: D1, D2.
  >   - `systems`: D2.
  > - **Query: fast AND database**
  >   - Intersect their postings lists; only D1 contains both terms.
  > - **Index view**
  >   ```mermaid
  >   flowchart LR
  >       Fast[fast] --> First[D1]
  >       Database[database] --> First
  >       Database --> Second[D2]
  >       Systems[systems] --> Second
  >   ```

- **Q98. Why is SQL LIKE insufficient for modern search? How are results ranked?**

  > - **LIKE: character-pattern matching**
  >   - Finds strings matching a specified pattern.
  >     - It does not itself provide semantic understanding or relevance ranking.
  > - **Full-text search: analyzed words and fields**
  >   - Tokenization splits text into searchable terms.
  >   - Configured normalization and synonyms improve matching.
  >     - Ranking can favor title matches over weak description matches.
  > - **BM25: a relevance-scoring method**
  >   - More matching terms help, with diminishing benefit from repetition.
  >   - Rare terms usually distinguish documents better than common terms.
  >   - Length normalization prevents long documents winning merely because they contain more words.
  > - **Result**
  >   - Higher-scoring documents appear earlier.
  >     - Relational databases can also provide dedicated full-text features beyond `LIKE`.

- **Q99. Why is hybrid search useful? Explain lexical, semantic, and fusion stages.**

  > - **Lexical: word matching**
  >   - Strong for exact identifiers, names, and technical terms.
  > - **Semantic: meaning similarity**
  >   - Uses embeddings, numerical representations of meaning.
  >     - Can connect paraphrases even when their exact words differ.
  > - **Hybrid: combine both approaches**
  >   - Preserve exact matches while retrieving meaning-related documents.
  > - **Fusion: combine ranked results**
  >   - Normalize scores or combine ranks before producing the final order.
  >     - Reciprocal Rank Fusion rewards high positions across result lists.
  > - **Search flow**
  >   ```mermaid
  >   flowchart LR
  >       Query[Query] --> Keyword[Keyword results]
  >       Query --> Meaning[Semantic results]
  >       Keyword --> Combine[Fuse rankings]
  >       Meaning --> Combine
  >       Combine --> Final[Final ranked list]
  >   ```

- **Q100. Explain polyglot persistence through a campus search portal.**

  > - **Polyglot persistence: use different stores for different workloads**
  >   - Select each store according to its required queries and correctness.
  > - **Relational database: authoritative registration records**
  >   - Enforce enrollment rules and valid student-course relationships.
  > - **Search index: discover campus content**
  >   - Index courses, faculty profiles, circulars, events, and lab manuals.
  >     - Exact fields: course codes, identifiers, and document categories.
  >     - Analyzed text: titles, descriptions, and document bodies.
  > - **Hybrid search: questions expressed in different words**
  >   - Combine semantic questions with exact policy terms.
  >     - Enforce access permissions while retrieving results.
  > - **Trade-off**
  >   - Keep the derived search index synchronized with authoritative records.
  >     - More stores require more backup, monitoring, and consistency management.

- **Q101. How should search answer "fault tolerant distributed storage" across these three documents?**

  > - **Documents**
  >   - D1: `scalable distributed database systems`.
  >   - D2: `distributed storage for resilient applications`.
  >   - D3: `relational database transactions`.
  > - **Why LIKE can miss useful content**
  >   - No document contains the entire query phrase.
  >     - D2 uses `resilient` instead of `fault tolerant`.
  > - **Inverted index: retrieve matching terms efficiently**
  >   - `distributed`: D1 and D2; `storage`: D2.
  >     - D2 matches both of these query terms.
  > - **Relevance scoring: order candidates**
  >   - Reward informative term matches instead of returning an unordered match list.
  > - **Semantic search: complement keyword matching**
  >   - Can connect `fault tolerant` with the related meaning `resilient`.
  >     - D2 is a strong candidate; exact ranking depends on configured scoring.