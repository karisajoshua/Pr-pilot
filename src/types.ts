export type ReviewVerdict='approve-recommendation'|'changes-recommended'|'manual-review-required'
export type FindingSeverity='info'|'warning'|'blocking'
export interface ProjectPulseFinding { id:string; points:number; maxPoints:number; explanation:string }
export interface RepoGuardianProposal { repository:string; branch:string; baseBranch:string; changedPaths:readonly string[]; manualActions:readonly string[]; draft:boolean; mergeAllowed:boolean }
export interface ReviewEvidence { ciStatus:'success'|'failure'|'pending'|'unknown'; testsChanged:boolean; securitySensitive:boolean }
export interface ReviewFinding { ruleId:string; severity:FindingSeverity; message:string }
export interface PRPilotReview { schemaVersion:'1.0'; repository:string; verdict:ReviewVerdict; findings:readonly ReviewFinding[]; humanApprovalRequired:true; autoMergeAllowed:false }
