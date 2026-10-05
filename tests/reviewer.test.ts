import { describe,expect,it } from 'vitest'
import { reviewProposal } from '../src/reviewer.js'
const safe={repository:'o/r',branch:'repoguardian/fix',baseBranch:'main',changedPaths:['SECURITY.md'],manualActions:[],draft:true,mergeAllowed:false} as const
describe('PRPilot reviewer',()=>{
 it('recommends approval only with clean evidence',()=>{const r=reviewProposal([],safe,{ciStatus:'success',testsChanged:false,securitySensitive:false});expect(r.verdict).toBe('approve-recommendation');expect(r.autoMergeAllowed).toBe(false);expect(r.humanApprovalRequired).toBe(true)})
 it('blocks unsafe merge semantics',()=>{const r=reviewProposal([],{...safe,draft:false,mergeAllowed:true},{ciStatus:'success',testsChanged:false,securitySensitive:false});expect(r.verdict).toBe('changes-recommended');expect(r.findings.filter(f=>f.severity==='blocking')).toHaveLength(2)})
 it('requires review when CI is not verified',()=>expect(reviewProposal([],safe,{ciStatus:'unknown',testsChanged:false,securitySensitive:false}).verdict).toBe('manual-review-required'))
 it('surfaces unresolved test findings',()=>{const r=reviewProposal([{id:'quality/tests',points:0,maxPoints:20,explanation:'missing'}],safe,{ciStatus:'success',testsChanged:false,securitySensitive:false});expect(r.findings.some(f=>f.ruleId==='quality/tests')).toBe(true)})
})
