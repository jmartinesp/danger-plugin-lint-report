"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanReport = void 0;
const file_1 = require("../file/file");
const report_1 = require("../report/report");
const checkstyle_parser_1 = require("./checkstyle_parser");
const fileDiffs = [];
/**
 *
 * @param git Git object used to access changesets
 * @param report JavaScript object representation of the lint report
 * @param root Root directory to sanitize absolute paths
 */
function scanReport(git, report, root, requireLineModification, violationCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        const violations = checkstyle_parser_1.parseCheckstyle(report, root);
        const files = [];
        violations.forEach(violation => {
            const file = violation.file;
            if (!files.includes(file)) {
                if (file_1.isFileInChangeset(git, file)) {
                    files.push(file);
                }
            }
        });
        // parse each file, wait for all to finish
        for (const file of files) {
            let lineDiff = [];
            if (requireLineModification) {
                lineDiff = yield file_1.getChangedLinesByFile(git, file);
            }
            fileDiffs.push({
                file,
                added_lines: lineDiff,
            });
        }
        report_1.reportViolationsForLines(violations, fileDiffs, requireLineModification, violationCallback);
    });
}
exports.scanReport = scanReport;
