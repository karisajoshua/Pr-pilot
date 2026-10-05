#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { evidenceFromPullRequest } from './github-evidence.js'
import { reviewProposal } from './reviewer.js'

const repo=process.env.GITHUB_REPOSITORY
const prNumber=process.env.PR_NUMBER
const token=process.env.GITHUB_TOKEN
if(!repo||!prNumber||!token) throw new Error('GITHUB_REPOSITORY, PR_NUMBER and GITHUB_TOKEN are required')
const api=(path:string)=>JSON.parse(execFileSync('curl',['-fsSL','-H',`Authorization: Bearer ${token}`,'-H','Accept: application/vnd.github+json',`https://api.github.com/repos/${repo}${path}`],{encoding:'utf8'}))
const pr=api(`/pulls/${prNumber}`)
if(!String(pr.head?.ref??'').startsWith('repoguardian/')) { console.log('PRPilot skipped: not a RepoGuardian remediation branch'); process.exit(0) }
const files=api(`/pulls/${prNumber}/files?per_page=100`).map((x:any)=>x.filename)
const runs=api(`/actions/runs?head_sha=${pr.head.sha}&per_page=100`).workflow_runs??[]
const relevant=runs.filter((x:any)=>x.name!=='PRPilot Advisory Review')
const ciStatus=relevant.some((x:any)=>x.status!=='completed')?'pending':relevant.some((x:any)=>x.conclusion==='failure'||x.conclusion==='cancelled')?'failure':relevant.some((x:any)=>x.conclusion==='success')?'success':'unknown'
const {proposal,evidence}=evidenceFromPullRequest({repository:repo,head:pr.head.ref,base:pr.base.ref,draft:pr.draft,changedPaths:files,ciStatus})
const review=reviewProposal([],proposal,evidence)
const marker='<!-- prpilot-advisory -->'
const lines=[marker,'## PRPilot advisory review','',`**Verdict: ${review.verdict}**`,'',...review.findings.map(f=>`- **${f.severity}** \`${f.ruleId}\`: ${f.message}`),'',`CI evidence: **${ciStatus}**. Changed paths: ${files.map((x:string)=>`\`${x}\``).join(', ')||'none'}.`,'','Human approval remains required. PRPilot does not merge pull requests.']
const body=lines.join('\n')
const comments=api(`/issues/${prNumber}/comments?per_page=100`)
const existing=comments.find((x:any)=>String(x.body??'').includes(marker))
const method=existing?'PATCH':'POST'
const url=existing?`https://api.github.com/repos/${repo}/issues/comments/${existing.id}`:`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`
execFileSync('curl',['-fsSL','-X',method,'-H',`Authorization: Bearer ${token}`,'-H','Accept: application/vnd.github+json','-H','Content-Type: application/json',url,'-d',JSON.stringify({body})],{stdio:'inherit'})
