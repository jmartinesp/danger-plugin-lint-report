"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCheckstyle = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseCheckstyle(report, root) {
    if (!report.elements || !report.elements[0]) {
        throw new Error(`Can not parse input.`);
    }
    const rootName = report.elements[0].name;
    switch (rootName) {
        case "checkstyle":
            const rootVersion = report.elements[0].attributes.version;
            switch (rootVersion) {
                case "8.0":
                case "4.3":
                    return parseCheckstyle8_0(report, root);
                default: {
                    console.warn(`Compatibility with version ${rootVersion} not tested.`);
                    return parseCheckstyle8_0(report, root);
                }
            }
        case "issues":
            const rootFormat = report.elements[0].attributes.format;
            switch (rootFormat) {
                case "5":
                    return parseAndroidLint(report, root);
                default:
                    console.warn(`Compatibility with version ${rootFormat} not tested.`);
                    return parseAndroidLint(report, root);
            }
    }
    throw new Error(`Report with base tag ${rootName} is not supported.`);
}
exports.parseCheckstyle = parseCheckstyle;
function parseAndroidLint(report, root) {
    const violations = [];
    if (!report.elements[0].elements) {
        return [];
    }
    report.elements[0].elements.forEach((issueElement) => {
        if (issueElement.name !== "issue") {
            console.log(`Illegal element: ${issueElement.name}, expected issue. Ignoring.`);
        }
        else {
            const attributes = issueElement.attributes;
            const issueId = attributes.id;
            const severity = attributes.severity;
            const message = attributes.message;
            const category = attributes.category;
            const priority = +attributes.priority;
            const summary = attributes.summary;
            const explanation = attributes.explanation;
            const errorLine1 = attributes.errorLine1;
            const errorLine2 = attributes.errorLine2;
            issueElement.elements.forEach((fileElement) => {
                if (fileElement.name !== "location") {
                    console.warn(`Illegal element ${fileElement.name}, expected location. Ignoring.`);
                }
                else {
                    const locationAttributes = fileElement.attributes;
                    const fileName = calculateRelativeFileName(locationAttributes.file, root);
                    const line = +locationAttributes.line;
                    const column = +locationAttributes.column;
                    violations.push({
                        file: fileName,
                        line: line,
                        column: column,
                        severity: severity,
                        summary: summary,
                        category: category,
                        message: message,
                        explanation: explanation,
                        issueId: issueId,
                    });
                }
            });
        }
    });
    return violations;
}
/**
 * Calculates the relative filename by checking the existance of `file` in `root`
 * @param file the absolute file present in the lint report
 * @param root current folder
 * @returns relative filename in `root` or filename with `root` removed if the file was not found
 */
function calculateRelativeFileName(file, root) {
    const components = file.split(path_1.default.sep);
    for (let i = 1; i < components.length; i++) {
        const suffixComponents = components.slice(i);
        const candidateFile = path_1.default.resolve(root, ...suffixComponents);
        if (fs_1.default.existsSync(candidateFile)) {
            return path_1.default.relative(root, candidateFile);
        }
    }
    return file.replace(root, "").replace(/^\/+/, "");
}
/**
 *
 * @param report Checktyle report as JavaScript object
 * @param root Project root path
 */
function parseCheckstyle8_0(report, root) {
    var _a;
    const violations = [];
    if (!report.elements[0].elements) {
        return [];
    }
    (_a = report.elements[0].elements) === null || _a === void 0 ? void 0 : _a.forEach((fileElement) => {
        var _a;
        const fileName = calculateRelativeFileName(fileElement.attributes.name, root);
        (_a = fileElement.elements) === null || _a === void 0 ? void 0 : _a.forEach((errorElement) => {
            const attributes = errorElement.attributes;
            const line = +attributes.line;
            const column = +attributes.column;
            const severity = attributes.severity;
            const msg = attributes.message;
            violations.push({
                file: fileName,
                line: line,
                column: column,
                severity: severity,
                message: msg,
            });
        });
    });
    return violations;
}
