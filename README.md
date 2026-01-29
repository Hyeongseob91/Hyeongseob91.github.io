# Hyeongseob's Portfolio & Hub

Personal portfolio and tech hub website for Hyeongseob Kim, AI Research Engineer.

## Live Site

| Page | URL |
|------|-----|
| **Portfolio (Main)** | https://hyeongseob91.github.io |
| **Hub** | https://hyeongseob91.github.io/hub/ |
| **Tech Reports** | https://hyeongseob91.github.io/reports/ |

## Structure

```
/
├── index.html              # Portfolio (main page)
├── styles.css              # Portfolio styles (BEM naming)
├── scripts.js              # Interactions (projectData object)
├── images/                 # Image assets
│   ├── aboutme/
│   ├── companies/
│   └── projects/
├── hub/                    # Hub page (blog/report links)
│   ├── index.html
│   └── hub.css
├── reports/                # Tech Reports
│   ├── index.html          # Report listing
│   ├── report.css          # Shared report styles
│   ├── images/             # Report figures
│   └── [slug].html         # Individual reports
├── .nojekyll               # Disable Jekyll processing
└── CLAUDE.md               # Claude Code instructions
```

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- BEM naming convention
- CSS Custom Properties
- GitHub Pages deployment

## Tech Reports

### VLM Document Parsing Research

> "Structure lost at parsing is structure lost forever."

Quantitative study comparing traditional OCR vs VLM-based structured parsing for RAG pipelines.

**Key Results:**
- Structure F1: 0% → 79.25% with VLM parsing
- Trade-off: +17pp CER, 159× latency

**Chunking Quality Metrics** (based on [MoC paper](https://arxiv.org/abs/2503.09600)):

| Metric | Definition | Interpretation |
|--------|------------|----------------|
| **BC (Boundary Clarity)** | `1 - cosine_similarity(chunk_i, chunk_i+1)` | Higher = better boundary separation |
| **CS (Chunk Stickiness)** | Structural Entropy: `-Σ (h_i/2m) * log2(h_i/2m)` | Lower = stronger intra-chunk cohesion |

[Read full report →](https://hyeongseob91.github.io/reports/vlm-document-parsing.html)

## Projects

- **Enterprise RAG Agent Playground** - Production RAG pipeline framework
- **Simple LLM Loadtester** - LLM API performance testing tool
- **VALORITHM** - MCP-based game development AI system
- **KOMI** - AI remote exercise posture diagnosis
- **BeMyMuse** - Emotional songwriting AI
- **PerfectPose** - AI posture inference game
- **EconDigest** - Economic YouTube summarizer

## License

MIT
