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
const _1 = require(".");
const root = "/root";
const expectedAndroidLintViolation1 = {
    issueId: "HardcodedText",
    category: "Internationalization",
    explanation: "Hardcoding text attributes directly in layout files is bad.",
    summary: "Hardcoded text",
    file: "feature/src/main/res/layout/fragment_password_reset.xml",
    line: 13,
    column: 9,
    severity: "Warning",
    message: "Hardcoded string Email Address, should use `@string` resource",
};
const expectedAndroidLintViolation2 = {
    issueId: "HardcodedNumber",
    category: "Maintenance",
    explanation: "Hardcoding numbers directly in layout files is bad.",
    summary: "Hardcoded numbers",
    file: "feature/src/main/res/layout/fragment_password_reset_2.xml",
    line: 14,
    column: 10,
    severity: "Warning",
    message: "Hardcoded number 123.",
};
const xmlReport = `
<?xml version="1.0" encoding="UTF-8"?>
<issues format="5" by="lint 4.2.0-alpha01">

    <issue
        id="${expectedAndroidLintViolation1.issueId}"
        severity="${expectedAndroidLintViolation1.severity}"
        message="${expectedAndroidLintViolation1.message}"
        category="${expectedAndroidLintViolation1.category}"
        priority="5"
        summary="${expectedAndroidLintViolation1.summary}"
        explanation="${expectedAndroidLintViolation1.explanation}"
        errorLine1="        android:hint=&quot;Password&quot;"
        errorLine2="        ~~~~~~~~~~~~~~~~~~~~~~~">
        <location
            file="${root}/${expectedAndroidLintViolation1.file}"
            line="${expectedAndroidLintViolation1.line}"
            column="${expectedAndroidLintViolation1.column}"/>
    </issue>

    <issue
        id="${expectedAndroidLintViolation2.issueId}"
        severity="${expectedAndroidLintViolation2.severity}"
        message="${expectedAndroidLintViolation2.message}"
        category="${expectedAndroidLintViolation2.category}"
        priority="5"
        summary="${expectedAndroidLintViolation2.summary}"
        explanation="${expectedAndroidLintViolation2.explanation}"
        errorLine1="        android:hint=&quot;Email Address&quot;"
        errorLine2="        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~">
        <location
            file="${root}/${expectedAndroidLintViolation2.file}"
            line="${expectedAndroidLintViolation2.line}"
            column="${expectedAndroidLintViolation2.column}"/>
    </issue>

</issues>
`;
const eslintXmlReport = `
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="${root}/src/components/ComponentNoError.tsx"></file>
  <file name="${root}/src/components/ComponentWithError.tsx">
    <error line="2" column="21" severity="warning" message="&apos;CircularProgress&apos; is defined but never used. (@typescript-eslint/no-unused-vars)" source="eslint.rules.@typescript-eslint/no-unused-vars" />
  </file>
</checkstyle>
`;
const mockGlob = jest.fn(() => []);
const mockFileSync = jest.fn((path) => `<?xml version="1.0" encoding="UTF-8"?>
<issues format="5" by="lint 4.2.0-alpha01">

    <issue
        id="${expectedAndroidLintViolation1.issueId}"
        severity="${expectedAndroidLintViolation1.severity}"
        message="${expectedAndroidLintViolation1.message}"
        category="${expectedAndroidLintViolation1.category}"
        priority="5"
        summary="${expectedAndroidLintViolation1.summary}"
        explanation="${expectedAndroidLintViolation1.explanation}"
        errorLine1="        android:hint=&quot;Email Address&quot;"
        errorLine2="        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~">
        <location
            file="${root}/${expectedAndroidLintViolation1.file}"
            line="${expectedAndroidLintViolation1.line}"
            column="${expectedAndroidLintViolation1.column}"/>
    </issue>

</issues>`);
const mockFileExistsSync = jest.fn();
jest.mock("glob", () => (_, cb) => cb(null, mockGlob()));
jest.mock("fs", () => ({
    readFileSync: (path) => mockFileSync(path),
    existsSync: (path) => mockFileExistsSync(path),
}));
describe("scan()", () => {
    it("scans multiple files and exits after all are finished", () => __awaiter(void 0, void 0, void 0, function* () {
        const git = {
            modified_files: [expectedAndroidLintViolation1.file],
            created_files: [],
            structuredDiffForFile: () => __awaiter(void 0, void 0, void 0, function* () { return new Promise((res) => setTimeout(() => res({ chunks: [{ changes: [{ type: "add", ln: 13 }] }] }), 100)); }),
        };
        global.danger = { git };
        global.warn = jest.fn();
        mockGlob.mockImplementation(() => [expectedAndroidLintViolation1.file]);
        yield _1.scan({
            fileMask: "",
            reportSeverity: true,
            requireLineModification: true,
            projectRoot: root,
            removeDuplicates: true,
        });
        expect(global.warn).toHaveBeenCalled();
    }));
    it("uses ViolationFormatter to map Violation to string", () => __awaiter(void 0, void 0, void 0, function* () {
        let formatFn = jest.fn(violation => {
            return violation.message;
        });
        let violationFormatter = {
            format: formatFn,
        };
        const git = {
            modified_files: [expectedAndroidLintViolation1.file],
            created_files: [],
            structuredDiffForFile: () => __awaiter(void 0, void 0, void 0, function* () { return new Promise((res) => setTimeout(() => res({ chunks: [{ changes: [{ type: "add", ln: expectedAndroidLintViolation1.line }] }] }), 100)); }),
        };
        global.danger = { git };
        global.warn = jest.fn();
        mockGlob.mockImplementation(() => [expectedAndroidLintViolation1.file]);
        yield _1.scan({
            fileMask: "",
            reportSeverity: true,
            requireLineModification: true,
            projectRoot: root,
            violationFormatter: violationFormatter,
            removeDuplicates: true,
        });
        expect(formatFn).toBeCalledWith(expectedAndroidLintViolation1);
        expect(global.warn).toBeCalledWith(formatFn(expectedAndroidLintViolation1), expectedAndroidLintViolation1.file, expectedAndroidLintViolation1.line);
    }));
    it(`scans maximum ${_1.maxParallel} files in parallel to prevent OoM exceptions`, () => __awaiter(void 0, void 0, void 0, function* () {
        const git = {
            modified_files: ["feature/src/main/res/layout/fragment_password_reset.xml"],
            created_files: [],
            structuredDiffForFile: () => __awaiter(void 0, void 0, void 0, function* () { return ({ chunks: [{ changes: [{ type: "add", ln: 13 }] }] }); }),
        };
        let counter = 0;
        let highMark = 0;
        global.danger = { git };
        global.warn = jest.fn(() => --counter);
        mockGlob.mockImplementation(() => Array.from({ length: 123 }, () => "feature/src/main/res/layout/fragment_password_reset.xml"));
        mockFileSync.mockReset().mockImplementation((path) => {
            ++counter;
            if (counter > highMark) {
                highMark = counter;
            }
            return `<?xml version="1.0" encoding="UTF-8"?>
    <issues format="5" by="lint 4.2.0-alpha01">

        <issue
            id="HardcodedText"
            severity="Warning"
            message="Hardcoded string &quot;Email Address&quot;, should use \`@string\` resource"
            category="Internationalization"
            priority="5"
            summary="Hardcoded text"
            explanation="Hardcoding text attributes directly in layout files is bad for several reasons:&#xA;&#xA;* When creating configuration variations (for example for landscape or portrait) you have to repeat the actual text (and keep it up to date when making changes)&#xA;&#xA;* The application cannot be translated to other languages by just adding new translations for existing string resources.&#xA;&#xA;There are quickfixes to automatically extract this hardcoded string into a resource lookup."
            errorLine1="        android:hint=&quot;Email Address&quot;"
            errorLine2="        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~">
            <location
                file="${root}/feature/src/main/res/layout/fragment_password_reset.xml"
                line="13"
                column="9"/>
        </issue>

    </issues>`;
        });
        yield _1.scan({
            fileMask: "",
            reportSeverity: true,
            requireLineModification: true,
            projectRoot: root,
            removeDuplicates: true,
        });
        expect(mockFileSync).toHaveBeenCalledTimes(123);
        expect(highMark).toBeLessThanOrEqual(_1.maxParallel);
    }));
});
describe("scanXmlReport()", () => {
    it("works across multiple files with require line modification turned off", () => __awaiter(void 0, void 0, void 0, function* () {
        const git = {
            modified_files: [
                expectedAndroidLintViolation1.file,
                expectedAndroidLintViolation2.file,
            ],
            created_files: [],
        };
        const violationCallback = jest.fn();
        yield _1.scanXmlReport(git, xmlReport, root, false, violationCallback);
        expect(violationCallback).toHaveBeenCalledTimes(2);
    }));
    it("returns correct violation data and file path with line modification turned off", () => __awaiter(void 0, void 0, void 0, function* () {
        const git = {
            modified_files: [expectedAndroidLintViolation1.file],
            created_files: [],
        };
        const violationCallback = jest.fn();
        yield _1.scanXmlReport(git, xmlReport, root, false, violationCallback);
        expect(violationCallback).toBeCalledWith(expectedAndroidLintViolation1);
        expect(violationCallback).toBeCalledWith(expectedAndroidLintViolation2);
    }));
    it("returns correct file location when root is different", () => __awaiter(void 0, void 0, void 0, function* () {
        const git = {
            modified_files: [expectedAndroidLintViolation1.file],
            created_files: [],
        };
        mockFileExistsSync.mockImplementation((path) => [
            "/otherRoot/" + expectedAndroidLintViolation1.file,
            expectedAndroidLintViolation1.file.substring(expectedAndroidLintViolation1.file.indexOf("/", 1)),
        ].includes(path));
        const violationCallback = jest.fn();
        yield _1.scanXmlReport(git, xmlReport, "/otherRoot", false, violationCallback);
        expect(violationCallback).toBeCalledWith(expectedAndroidLintViolation1);
    }));
    it("returns correct violation data for checkstyle report with files without messages", () => __awaiter(void 0, void 0, void 0, function* () {
        const git = {
            modified_files: ["src/components/ComponentNoError.tsx", "src/components/ComponentWithError.tsx"],
            created_files: [],
        };
        const messageCallback = jest.fn();
        yield _1.scanXmlReport(git, eslintXmlReport, root, false, messageCallback);
        const msg = "'CircularProgress' is defined but never used. (@typescript-eslint/no-unused-vars)";
        const file = "src/components/ComponentWithError.tsx";
        const line = 2;
        const column = 21;
        const severity = "warning";
        const expectedViolation = {
            file: file,
            line: line,
            column: column,
            severity: severity,
            message: msg,
        };
        expect(messageCallback).toBeCalledTimes(1);
        expect(messageCallback).toBeCalledWith(expectedViolation);
    }));
});
