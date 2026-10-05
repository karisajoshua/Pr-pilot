# PRPilot

**Independent pull-request validation for the ProjectPulse / RepoGuardian engineering loop.**

PRPilot is the review layer in a human-in-the-loop repository governance system:

```text
ProjectPulse ── detects and explains repository-health findings
      │
      ▼
RepoGuardian ── plans and proposes controlled remediation
      │ draft PR + evidence
      ▼
PRPilot ────── independently validates safety, scope and evidence
      │ recommendation
      ▼
Human reviewer ── final authority
      │
      ▼
ProjectPulse ── verifies measurable improvement
```

PRPilot is deliberately **not** a merge bot. An approval recommendation means the automated review found no blocking or unresolved warning conditions; a human still owns the merge decision.

## v0.1 review policy

PRPilot currently checks:

- remediation remains a draft;
- auto-merge capability is disabled;
- remediation branch is isolated from the base branch;
- CI is explicitly successful rather than absent, unknown or pending;
- security-sensitive changes are surfaced for human review;
- unresolved ProjectPulse test findings remain visible;
- RepoGuardian manual actions are not hidden.

Review outputs use three verdicts: `approve-recommendation`, `manual-review-required`, and `changes-recommended`.

## Trust boundaries

PRPilot must not execute untrusted repository code, generate remediation patches, merge pull requests, weaken branch protection, or reinterpret missing validation evidence as success. Its role is independent assessment and evidence presentation.

## Development

Requires Node.js 22+.

```bash
npm install
npm run check
npm test
npm run build
```

## License

Apache-2.0.

## Automated advisory mode

PRPilot v0.2 includes an idempotent GitHub advisory runner. On supported `repoguardian/*` pull-request events it reads PR metadata, changed paths and CI evidence, evaluates the deterministic review policy, and creates or updates one marked advisory comment. It runs trusted PRPilot code rather than target-PR code and retains no merge or GitHub approval authority.
