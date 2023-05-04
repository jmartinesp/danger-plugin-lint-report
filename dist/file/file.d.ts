import { GitDSL } from "danger";
/**
 * If a git object is supplied, this function checks if a given relative file path
 * is within the changeset (modified + created files).
 * @param git Git object
 * @param relativeFilePath Sanitized file path to match with the changeset
 */
export declare function isFileInChangeset(git: GitDSL | undefined, relativeFilePath: string): boolean;
export declare function getChangedLinesByFile(git: GitDSL, relativeFilePath: string): Promise<number[]>;
