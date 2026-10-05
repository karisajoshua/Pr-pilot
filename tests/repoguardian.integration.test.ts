import { describe,expect,it } from 'vitest'
import { evidenceFromPullRequest } from '../src/github-evidence.js'
import { reviewProposal } from '../src/reviewer.js'
describe('RepoGuardian integration proof',()=>{
 it('recommends approval for the documented proof PR evidence',()=>{
  const {proposal,evidence}=evidenceFromPullRequest({repository:'karisajoshua/repo-guardian',head:'repoguardian/remediation-proof',base:'main',draft:true,changedPaths:['docs/remediation-proof.md'],ciStatus:'success'})
  const review=reviewProposal([],proposal,evidence)
  expect(review.verdict).toBe('approve-recommendation');expect(review.humanApprovalRequired).toBe(true);expect(review.autoMergeAllowed).toBe(false)
 })
})
