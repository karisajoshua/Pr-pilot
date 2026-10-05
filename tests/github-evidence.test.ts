import { describe,expect,it } from 'vitest'
import { evidenceFromPullRequest } from '../src/github-evidence.js'
describe('GitHub PR evidence',()=>{
 it('classifies test and security-sensitive paths deterministically',()=>{
  const x=evidenceFromPullRequest({repository:'o/r',head:'fix/x',base:'main',draft:true,changedPaths:['tests/a.test.ts','.github/workflows/ci.yml'],ciStatus:'success'})
  expect(x.evidence.testsChanged).toBe(true);expect(x.evidence.securitySensitive).toBe(true);expect(x.proposal.mergeAllowed).toBe(false)
 })
 it('keeps documentation-only changes non-sensitive',()=>expect(evidenceFromPullRequest({repository:'o/r',head:'fix/x',base:'main',draft:true,changedPaths:['docs/proof.md'],ciStatus:'success'}).evidence.securitySensitive).toBe(false))
})
