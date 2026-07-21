const path = require("path");
const { execFile } = require("child_process");
const { PROJECT_ROOT } = require("./config");

function git(args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd: PROJECT_ROOT }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr?.trim() || err.message));
      resolve(stdout);
    });
  });
}

// `git diff --cached --quiet` sale con código 1 si hay cambios staged, 0 si no.
async function hasStagedChanges() {
  try {
    await git(["diff", "--cached", "--quiet"]);
    return false;
  } catch {
    return true;
  }
}

async function doCommitAndPush(absoluteFilePath, sectionId) {
  const relPath = path.relative(PROJECT_ROOT, absoluteFilePath);
  await git(["add", relPath]);

  if (!(await hasStagedChanges())) {
    return { pushed: false, reason: "no_changes" };
  }

  await git(["commit", "-m", `Actualiza "${sectionId}" desde el panel admin`]);
  await git(["push"]);
  return { pushed: true };
}

// Dos guardados casi simultáneos (doble click, dos pestañas) lanzarían dos
// `git add`/`commit`/`push` a la vez sobre el mismo repo, lo que puede
// chocar (ej. ".git/index.lock"). Se encadenan en una cola para que solo
// haya una operación de git en marcha a la vez.
let queue = Promise.resolve();

// Guarda el archivo localmente (ya hecho antes de llamar aquí) y lo publica:
// add + commit + push del archivo concreto que cambió. Si algo falla (sin
// red, conflicto, etc.) se lanza el error hacia arriba — el guardado local
// ya se hizo, así que no se pierde el cambio aunque falle la publicación.
function commitAndPush(absoluteFilePath, sectionId) {
  const result = queue.then(() => doCommitAndPush(absoluteFilePath, sectionId));
  // Si esta llamada falla, no debe bloquear las siguientes en la cola.
  queue = result.catch(() => {});
  return result;
}

module.exports = { commitAndPush };
