import type { RepoGuardianProposal,ReviewEvidence } from './types.js'

export interface PullRequestSnapshot { repository:string; head:string; base:string; draft:boolean; changedPaths:readonly string[]; ciStatus:ReviewEvidence['ciStatus'] }
export function evidenceFromPullRequest(pr:PullRequestSnapshot):{proposal:RepoGuardianProposal;evidence:ReviewEvidence}{
 const securitySensitive=pr.changedPaths.some(p=>/(^|\/)(\.github\/workflows|SECURITY\.md|package(-lock)?\.json|.*\.(ya?ml))$/i.test(p))
 const testsChanged=pr.changedPaths.some(p=>/(^|\/)(test|tests|__tests__)(\/|$)|\.(test|spec)\.[^/]+$/i.test(p))
 return {proposal:{repository:pr.repository,branch:pr.head,baseBranch:pr.base,changedPaths:pr.changedPaths,manualActions:[],draft:pr.draft,mergeAllowed:false},evidence:{ciStatus:pr.ciStatus,testsChanged,securitySensitive}}
}
