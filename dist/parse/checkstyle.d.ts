import { GitDSL } from "danger";
/**
 *
 * @param git Git object used to access changesets
 * @param report JavaScript object representation of the lint report
 * @param root Root directory to sanitize absolute paths
 */
export declare function scanReport(git: GitDSL, report: any, root: string, requireLineModification: boolean, violationCallback: (violation: Violation) => void): Promise<void>;
