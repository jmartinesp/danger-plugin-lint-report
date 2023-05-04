"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
describe("isFileInChangeset()", () => {
    it("Undefined git returns true as fallback", () => {
        const path = "/file/path";
        global.danger = {
            github: { pr: { title: "My Test Title" } },
            git: undefined,
        };
        const result = file_1.isFileInChangeset(global.danger.git, path);
        expect(result).toBeTruthy();
    });
    it("Path is in modified files", () => {
        const path = "/file/path";
        global.danger = {
            github: { pr: { title: "My Test Title" } },
            git: {
                modified_files: [path],
                created_files: [],
            },
        };
        const result = file_1.isFileInChangeset(global.danger.git, path);
        expect(result).toBeTruthy();
    });
    it("Path is not in modified or created files", () => {
        const path = "/file/path";
        global.danger = {
            github: { pr: { title: "My Test Title" } },
            git: {
                modified_files: [],
                created_files: [],
            },
        };
        const result = file_1.isFileInChangeset(global.danger.git, path);
        expect(result).toBeFalsy();
    });
    it("Path is in created files", () => {
        const path = "/file/path";
        global.danger = {
            github: { pr: { title: "My Test Title" } },
            git: {
                modified_files: [],
                created_files: [path],
            },
        };
        const result = file_1.isFileInChangeset(global.danger.git, path);
        expect(result).toBeTruthy();
    });
});
