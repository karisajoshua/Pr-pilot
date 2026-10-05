import type { ProjectPulseFinding,PRPilotReview,RepoGuardianProposal,ReviewEvidence,ReviewFinding } from './types.js'
export function reviewProposal(findings:readonly ProjectPulseFinding[],proposal:RepoGuardianProposal,evidence:ReviewEvidence):PRPilotReview {
 const out:ReviewFinding[]=[]
 if(!proposal.draft) out.push({ruleId:'safety/draft-required',severity:'blocking',message:'RepoGuardian remediation must remain a draft until human review.'})
 if(proposal.mergeAllowed) out.push({ruleId:'safety/no-auto-merge',severity:'blocking',message:'Automated merge capability is forbidden.'})
 if(proposal.branch===proposal.baseBranch) out.push({ruleId:'safety/branch-isolation',severity:'blocking',message:'Remediation must use an isolated branch.'})
 if(evidence.ciStatus==='failure') out.push({ruleId:'quality/ci',severity:'blocking',message:'CI is failing.'})
 if(evidence.ciStatus==='pending'||evidence.ciStatus==='unknown') out.push({ruleId:'quality/ci',severity:'warning',message:'CI has not been verified successful.'})
 if(evidence.securitySensitive) out.push({ruleId:'security/manual-review',severity:'warning',message:'Security-sensitive changes require explicit human review.'})
 if(findings.some(f=>f.id==='quality/tests'&&f.points<f.maxPoints)&&!evidence.testsChanged) out.push({ruleId:'quality/tests',severity:'warning',message:'The source finding includes missing tests and this proposal does not add test coverage.'})
 if(proposal.manualActions.length) out.push({ruleId:'scope/manual-actions',severity:'warning',message:'The proposal intentionally leaves manual remediation actions unresolved.'})
 const verdict=out.some(f=>f.severity==='blocking')?'changes-recommended':out.some(f=>f.severity==='warning')?'manual-review-required':'approve-recommendation'
 return {schemaVersion:'1.0',repository:proposal.repository,verdict,findings:out,humanApprovalRequired:true,autoMergeAllowed:false}
}
