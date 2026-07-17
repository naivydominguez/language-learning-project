// Metro resolves platform-suffixed files (connection.web.ts / connection.native.ts) ahead of
// this plain file, so this is never actually bundled - it exists only so `tsc` (which doesn't
// apply Metro's platform resolution) can resolve `./connection` without a `moduleSuffixes`
// tsconfig change, which was found to break unrelated type inference elsewhere in the project.
export * from "./connection.web";
