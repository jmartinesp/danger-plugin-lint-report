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
exports.scanXmlReport = exports.scan = exports.maxParallel = void 0;
const fs_1 = require("fs");
const checkstyle_1 = require("./parse/checkstyle");
exports.maxParallel = 10;
/**
 * This plugin reads checkstyle reports (XML) and posts inline comments in pull requests.
 */
function scan(config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const glob = require("glob");
        const root = (_a = config.projectRoot) !== null && _a !== void 0 ? _a : process.cwd();
        const git = danger.git;
        var accumulated = {};
        const files = yield new Promise((resolve, reject) => glob(config.fileMask, (err, result) => (err ? reject(err) : resolve(result))));
        const violationFormatter = config.violationFormatter || defaultViolationFormatter;
        for (const batch of Array.from({ length: Math.ceil(files.length / exports.maxParallel) }, (_, batchIdx) => files.slice(batchIdx * exports.maxParallel, (batchIdx + 1) * exports.maxParallel))) {
            yield Promise.all(batch.map((fileName) => __awaiter(this, void 0, void 0, function* () {
                const xmlReport = fs_1.readFileSync(fileName);
                yield scanXmlReport(git, xmlReport, root, config.requireLineModification, (violation) => {
                    var severity = violation.severity;
                    if (!config.reportSeverity) {
                        violation.severity = "info";
                    }
                    if (config.removeDuplicates) {
                        let id = `${violation.issueId}_${violation.file}:${violation.line}.${violation.column}`;
                        accumulated[id] = violation;
                    }
                    else {
                        generateMessageAndReport(violation, violationFormatter, config.outputPrefix);
                    }
                });
            })));
        }
        for (let id in accumulated) {
            let violation = accumulated[id];
            generateMessageAndReport(violation, violationFormatter, config.outputPrefix);
        }
    });
}
exports.scan = scan;
function generateMessageAndReport(violation, violationFormatter, outputPrefix) {
    var msg = violationFormatter.format(violation);
    if (outputPrefix) {
        msg = outputPrefix + msg;
    }
    sendViolationBySeverity(msg, violation.file, violation.line, violation.severity);
}
function scanXmlReport(git, xmlReport, root, requireLineModification, violationCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        const xmlConverter = require("xml-js");
        const report = xmlConverter.xml2js(xmlReport);
        yield checkstyle_1.scanReport(git, report, root, requireLineModification, violationCallback);
    });
}
exports.scanXmlReport = scanXmlReport;
function sendViolationBySeverity(msg, fileName, line, severity) {
    switch (severity.toLowerCase()) {
        case "information":
        case "info":
            message(msg, fileName, line);
            break;
        case "warning":
        case "warn":
            warn(msg, fileName, line);
            break;
        case "error":
            fail(msg, fileName, line);
            break;
        case "fatal":
            fail(msg, fileName, line);
            break;
    }
}
let defaultViolationFormatter = {
    format: (violation) => {
        return violation.message;
    }
};
