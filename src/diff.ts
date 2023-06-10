const Diff = require("diff");
export function printFileDiff(oldFile: string, newFile: string) {
  const changes = Diff.diffLines(oldFile, newFile);
  let contextStart = -3;
  changes.forEach((change: any) => {
    if (change.added || change.removed) {
      for (let i = contextStart + 3; i < change.count + contextStart + 6; i++) {
        if (i >= 0 && i < changes.length) {
          const line = changes[i];
          const color = line.added ? "\u001b[32m" : "\u001b[31m";
          console.log(color + line.value + "\u001b[39m");
        }
      }
      contextStart = change.count + contextStart + 6;
    } else {
      contextStart += change.count;
    }
  });
}
