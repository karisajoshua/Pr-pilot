# Security Policy

PRPilot is a defensive review engine. Treat pull-request metadata, paths and repository-derived evidence as untrusted input. Do not include credentials or private source in public reports.

PRPilot must never merge a pull request, weaken repository protection, execute untrusted target-repository code, or convert absent CI evidence into a successful review signal.
