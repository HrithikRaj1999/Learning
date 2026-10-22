# Preprocessing for AI-Ready Data: Exam Study Pack

- Course: DSE ZG505; coverage: handout contact sessions 1-8.
- Primary pattern: supplied mid-semester paper dated 19 September 2026.
- Exam conditions: closed book, two hours, six questions, 30 marks.
- The sample worksheet contains nine questions totalling 37 points, not an official examination.
- These are independent study notes and suggested answers, not an official marking scheme.
- Priorities reflect supplied papers; they do not predict future questions.

## 1. Exact Exam Blueprint

| Exam question | Marks | Tested work | Study sessions |
|---|---:|---|---|
| E1 | 7 | Data type; quality dimensions versus pillars; numeric-only mean and median | 1, 2 |
| E2 | 5 | Formal MNAR reasoning; KNN code; Z-score; genuine-outlier treatment | 3 |
| E3 | 5 | Jaccard sets; ambiguous dates; linkage choice; hash-deduplication code | 4 |
| E4 | 5 | Nominal versus ordinal encoding; frequency calculation; limitations; one-hot code | 5 |
| E5 | 5 | Skewness; natural logs; standard versus robust scaling; engineered tiers; scaler code | 6, 7 |
| E6 | 3 | Imbalance ratio; SMOTE interpolation; misleading accuracy | 8 |

### Sample Worksheet Crosswalk

| Worksheet question | Points | Additional practice emphasis | Study sessions |
|---|---:|---|---|
| S1 | 5 | Match scenarios to five AI-readiness pillars | 1 |
| S2 | 4 | Completeness percentage; content versus relationship profiling | 2 |
| S3 | 6 | MAR versus MCAR; IQR fences; treatment depends on analytical purpose | 3 |
| S4 | 5 | Levenshtein distance; blocking keys; missed duplicates | 4 |
| S5 | 4 | Target encoding; train/test and cross-fitting leakage | 5 |
| S6 | 3 | Tree-model scaling; right-tail feature engineering | 6, 7 |
| S7 | 3 | SMOTE leakage; oversampling versus undersampling | 8 |
| S8 | 4 | KNNImputer code with four neighbours | 3 |
| S9 | 3 | Min-max scaling to four decimal places | 6 |

## 2. Why Seven Decks Cover Eight Sessions

- Follow the handout's session numbers, not slide-deck filename numbers.
- Deck 05 combines session 5 encoding and session 6 scaling.
- Deck 06 therefore supplies session 7; deck 07 supplies session 8.
- The duplicate introduction PDF does not add another lecture.

| Session | Topic | Supplied slide deck |
|---|---|---|
| 1 | Foundations and data lifecycle | [01_Intro.pdf](../Class%20Material/01_Intro.pdf) |
| 2 | Data quality and profiling | [02_dataQuality_Profiling.pdf](../Class%20Material/02_dataQuality_Profiling.pdf) |
| 3 | Missing data and outliers | [03_MissingData_Outliers.pdf](../Class%20Material/03_MissingData_Outliers.pdf) |
| 4 | Duplicates and entity resolution | [04_Duplicate_EntityResolution.pdf](../Class%20Material/04_Duplicate_EntityResolution.pdf) |
| 5 | Categorical encoding | [05_EncodingCategorical_FeatureScaling.pdf](../Class%20Material/05_EncodingCategorical_FeatureScaling.pdf), PDF pages 4-26 |
| 6 | Scaling and transformations | Same deck, PDF pages 27-44 |
| 7 | Feature engineering and selection | [06_FeatureEngineering.pdf](../Class%20Material/06_FeatureEngineering.pdf) |
| 8 | Imbalanced data | [07_Imabalance_Data.pdf](../Class%20Material/07_Imabalance_Data.pdf) |

## 3. Revision Priorities

| Priority | Learn and practise | Evidence |
|---|---|---|
| First | Classify issues; distinguish dimensions from pillars; justify using actual cells | E1, S1-S2, assignment Part 1 |
| First | MCAR/MAR/MNAR; KNN code; scaled distances; Z-score and IQR | E2, S3/S8, assignment Part 2 |
| First | Jaccard; Levenshtein; standardization; blocking; exact versus probabilistic linkage | E3, S4 |
| First | One-hot/ordinal/frequency/target encoding; leakage and unseen categories | E4, S5 |
| First | Min-max/Z-score/robust scaling; logs; outlier-resistant engineered features | E5, S6/S9 |
| First | Imbalance ratio; SMOTE; accuracy trap; split-before-resampling | E6, S7 |
| Then | PCA calculations; selection methods; mutual information; class weights; ADASYN | Lecture coverage; possible variations |

## 4. Writing Answers for This Pattern

1. Identify the exact task and requested number of examples.
2. State assumptions before calculations: standard-deviation convention, quartiles, date format, and positive class.
3. For numericals, write formula, substitution, result, and one-line interpretation.
4. For scenarios, name the method and connect its reason to the supplied evidence.
5. For comparisons, include one relevant benefit and limitation per method.
6. For code blanks, reproduce exact capitalization, parameter names, and method names.
7. Keep all subparts consecutive; the supplied paper requests each question starts afresh.

### Two-Hour Practice Budget

| Task | Minutes |
|---|---:|
| Read paper; mark assumptions | 5 |
| E1-style question | 23 |
| E2-style question | 17 |
| E3-style question | 17 |
| E4-style question | 17 |
| E5-style question | 17 |
| E6-style question | 10 |
| Check arithmetic, code, labels, and omitted subparts | 14 |

## 5. Source Register

- [Handout.md](../Handout.md): official topic sequence and assessment coverage.
- [Preprocessing for ai ready data.pdf](../Exam%20Paper/Preprocessing%20for%20ai%20ready%20data.pdf): scanned paper, visually checked across all three pages.
- [Sample Question Paper (1).pdf](../Class%20Material/Sample%20Question%20Paper%20%281%29.pdf): self-study worksheet, explicitly unofficial.
- [Assignment_1.pdf](../Assisgnments/Assignment_1.pdf): UrbanGo diagnostic and preprocessing tasks, 20 marks.
- [Assignment_1_README.txt](../Assisgnments/Assignment_1_README.txt): assignment setup, provenance, and output rules.
- [extracted_instructor.md](../Assisgnments/extracted_instructor.md): supporting assignment transcription, cross-checked against the original PDF.
- Lecture references use PDF page numbers, including cover pages, unless stated otherwise.
- Later text, image, and sentiment-analysis labs do not expand this pack beyond sessions 1-8.