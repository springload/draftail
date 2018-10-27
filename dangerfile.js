const { danger, message, warn, fail, schedule } = require("danger");

const libModifiedFiles = danger.git.modified_files.filter(
  (filepath) => filepath.startsWith("lib") && filepath.endsWith("js"),
);
const hasLibChanges =
  libModifiedFiles.filter((filepath) => !filepath.endsWith("test.js")).length >
  0;
const hasREADMEChanges = danger.git.modified_files.includes("README.md");
const hasCHANGELOGChanges = danger.git.modified_files.includes("CHANGELOG.md");

// Fails if the description is too short.
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
  fail(":grey_question: This pull request needs a description.");
}

// Warns if the PR title contains [WIP]
const isWIP = danger.github.pr.title.includes("WIP");
if (isWIP) {
  const title = ":construction_worker: Work In Progress";
  const idea =
    "This PR appears to be a work in progress, and may not be ready to be merged yet.";
  warn(`${title} - <i>${idea}</i>`);
}

if (hasLibChanges && !hasREADMEChanges) {
  warn(
    "This pull request updates the library. Should the documentation be updated as well?",
  );
}

const hasLabels = danger.github.issue.labels.length !== 0;
const isEnhancement =
  danger.github.issue.labels.some((l) => l.name === "enhancement") ||
  danger.github.pr.title.includes("feature");
const isBug =
  danger.github.issue.labels.some((l) => l.name === "bug") ||
  danger.github.pr.title.includes("fix") ||
  danger.github.pr.title.includes("bug");

if (!hasLabels) {
  message("What labels should we add to this PR?");
}

if (hasLibChanges && isEnhancement && !hasCHANGELOGChanges) {
  warn(
    "This pull request is an enhancement. Please update the [CHANGELOG](https://github.com/springload/draftail/blob/master/CHANGELOG.md).",
  );
}

if (hasLibChanges && isBug && !hasCHANGELOGChanges) {
  fail(
    "This pull request fixes a bug. Please update the [CHANGELOG](https://github.com/springload/draftail/blob/master/CHANGELOG.md).",
  );
}

const hasPackageChanges = danger.git.modified_files.includes("package.json");
const hasLockfileChanges = danger.git.modified_files.includes(
  "package-lock.json",
);

if (hasPackageChanges && !hasLockfileChanges) {
  warn(
    "There are package.json changes with no corresponding lockfile changes.",
  );
}

const linkDep = (dep) =>
  danger.utils.href(`https://www.npmjs.com/package/${dep}`, dep);

schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile("package.json");

  if (packageDiff.dependencies) {
    const { added, removed } = packageDiff.dependencies;

    if (added.length) {
      const deps = danger.utils.sentence(added.map((d) => linkDep(d)));
      message(`Adding new dependencies: ${deps}`);
    }

    if (removed.length) {
      const deps = danger.utils.sentence(removed.map((d) => linkDep(d)));
      message(`:tada:, removing dependencies: ${deps}`);
    }

    if (added.includes("draft-js")) {
      warn(
        ":scream: this PR updates Draft.js! Please make sure to review the [upgrade considerations](https://github.com/springload/draftail/tree/master/docs#upgrade-considerations).",
      );
    }
  }
});
