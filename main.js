/* Codex for Obsidian */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/isexe/windows.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs9 = require("fs");
    function checkPathExt(path21, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path21.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat10, path21, options) {
      if (!stat10.isSymbolicLink() && !stat10.isFile()) {
        return false;
      }
      return checkPathExt(path21, options);
    }
    function isexe(path21, options, cb) {
      fs9.stat(path21, function(er, stat10) {
        cb(er, er ? false : checkStat(stat10, path21, options));
      });
    }
    function sync(path21, options) {
      return checkStat(fs9.statSync(path21), path21, options);
    }
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/isexe/mode.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs9 = require("fs");
    function isexe(path21, options, cb) {
      fs9.stat(path21, function(er, stat10) {
        cb(er, er ? false : checkStat(stat10, options));
      });
    }
    function sync(path21, options) {
      return checkStat(fs9.statSync(path21), options);
    }
    function checkStat(stat10, options) {
      return stat10.isFile() && checkMode(stat10, options);
    }
    function checkMode(stat10, options) {
      var mod = stat10.mode;
      var uid = stat10.uid;
      var gid = stat10.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/isexe/index.js"(exports, module2) {
    var fs9 = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path21, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve5, reject) {
          isexe(path21, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve5(is);
            }
          });
        });
      }
      core(path21, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path21, options) {
      try {
        return core.sync(path21, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/which/which.js"(exports, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path21 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        // windows always checks the cwd first
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */
        "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve5, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve5(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path21.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve5(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve5, reject) => {
        if (ii === pathExt.length)
          return resolve5(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve5(p + ext);
          }
          return resolve5(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path21.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports, module2) {
    "use strict";
    var pathKey = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey;
    module2.exports.default = pathKey;
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module2) {
    "use strict";
    var path21 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env[getPathKey({ env })],
          pathExt: withoutPathExt ? path21.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path21.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/cross-spawn/lib/util/escape.js"(exports, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
      arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/shebang-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path21, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path21.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports, module2) {
    "use strict";
    var fs9 = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs9.openSync(command, "r");
        fs9.readSync(fd, buffer, 0, size, 0);
        fs9.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cross-spawn/lib/parse.js"(exports, module2) {
    "use strict";
    var path21 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path21.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/cross-spawn/lib/enoent.js"(exports, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed);
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn2(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync2(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn2;
    module2.exports.spawn = spawn2;
    module2.exports.sync = spawnSync2;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// src/ui/modals.ts
var modals_exports = {};
__export(modals_exports, {
  confirmModal: () => confirmModal,
  requestUserInputModal: () => requestUserInputModal,
  textInputModal: () => textInputModal
});
function confirmModal(app, title, body, acceptText = "\u5141\u8BB8", declineText = "\u62D2\u7EDD") {
  return new Promise((resolve5) => {
    const modal = new ConfirmModal(app, title, body, acceptText, declineText, resolve5);
    modal.open();
  });
}
function textInputModal(app, title, label, initialValue = "") {
  return new Promise((resolve5) => {
    const modal = new TextInputModal(app, title, label, initialValue, resolve5);
    modal.open();
  });
}
function requestUserInputModal(app, questions) {
  return new Promise((resolve5) => {
    const modal = new RequestInputModal(app, questions, resolve5);
    modal.open();
  });
}
var import_obsidian, ConfirmModal, TextInputModal, RequestInputModal;
var init_modals = __esm({
  "src/ui/modals.ts"() {
    import_obsidian = require("obsidian");
    ConfirmModal = class extends import_obsidian.Modal {
      constructor(app, titleText, bodyText, acceptText, declineText, done) {
        super(app);
        this.titleText = titleText;
        this.bodyText = bodyText;
        this.acceptText = acceptText;
        this.declineText = declineText;
        this.done = done;
      }
      onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: this.titleText });
        contentEl.createEl("p", { text: this.bodyText });
        new import_obsidian.Setting(contentEl).addButton(
          (button) => button.setButtonText(this.declineText).onClick(() => {
            this.done(false);
            this.close();
          })
        ).addButton(
          (button) => button.setButtonText(this.acceptText).setCta().onClick(() => {
            this.done(true);
            this.close();
          })
        );
      }
      onClose() {
        this.contentEl.empty();
      }
    };
    TextInputModal = class extends import_obsidian.Modal {
      constructor(app, titleText, label, initialValue, done) {
        super(app);
        this.titleText = titleText;
        this.label = label;
        this.done = done;
        this.value = initialValue;
      }
      value;
      onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: this.titleText });
        new import_obsidian.Setting(contentEl).setName(this.label).addText((text) => {
          text.setValue(this.value).onChange((value) => {
            this.value = value;
          });
          text.inputEl.focus();
        });
        new import_obsidian.Setting(contentEl).addButton(
          (button) => button.setButtonText("\u53D6\u6D88").onClick(() => {
            this.done(null);
            this.close();
          })
        ).addButton(
          (button) => button.setButtonText("\u4FDD\u5B58").setCta().onClick(() => {
            this.done(this.value.trim());
            this.close();
          })
        );
      }
    };
    RequestInputModal = class extends import_obsidian.Modal {
      constructor(app, questions, done) {
        super(app);
        this.questions = questions;
        this.done = done;
      }
      answers = {};
      onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: "Codex \u9700\u8981\u4F60\u7684\u9009\u62E9" });
        for (const question of this.questions) {
          const options = Array.isArray(question.options) ? question.options : [];
          const setting = new import_obsidian.Setting(contentEl).setName(question.header || question.question).setDesc(question.question || "");
          if (options.length > 0) {
            this.answers[question.id] = [options[0].label];
            setting.addDropdown((dropdown) => {
              for (const option of options) dropdown.addOption(option.label, option.label);
              dropdown.onChange((value) => {
                this.answers[question.id] = [value];
              });
            });
          } else {
            this.answers[question.id] = [""];
            setting.addText((text) => {
              if (question.isSecret) text.inputEl.type = "password";
              text.onChange((value) => {
                this.answers[question.id] = [value];
              });
            });
          }
        }
        new import_obsidian.Setting(contentEl).addButton(
          (button) => button.setButtonText("\u53D6\u6D88").onClick(() => {
            this.done({});
            this.close();
          })
        ).addButton(
          (button) => button.setButtonText("\u63D0\u4EA4").setCta().onClick(() => {
            const result = Object.fromEntries(Object.entries(this.answers).map(([key, value]) => [key, { answers: value }]));
            this.done(result);
            this.close();
          })
        );
      }
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CodexForObsidianPlugin
});
module.exports = __toCommonJS(main_exports);
var fsp14 = __toESM(require("fs/promises"));
var path20 = __toESM(require("path"));
var import_obsidian9 = require("obsidian");

// src/core/raw-message-store.ts
var import_promises = require("node:fs/promises");
var path = __toESM(require("node:path"));
var CURRENT_PLUGIN_ID = "codex-echoink";
var LEGACY_PLUGIN_IDS = ["obsidian-codex"];
var RAW_TEXT_THRESHOLD = 3e4;
var LARGE_MESSAGE_THRESHOLD = 8e4;
var RAW_PREVIEW_HEAD = 12e3;
var RAW_PREVIEW_TAIL = 4e3;
function pluginDataDir(vaultPath, pluginDir = CURRENT_PLUGIN_ID) {
  const normalized = normalizePluginDir(pluginDir);
  if (normalized.startsWith(".obsidian/plugins/")) return path.join(vaultPath, normalized);
  return path.join(vaultPath, ".obsidian", "plugins", normalized);
}
function rawStorageDir(vaultPath, pluginDir = CURRENT_PLUGIN_ID) {
  return path.join(pluginDataDir(vaultPath, pluginDir), "raw");
}
function rawRefForMessage(messageId) {
  return `raw/${sanitizeRawFileName(messageId || `msg-${Date.now()}`)}.txt`;
}
function resolveRawRef(vaultPath, rawRef, pluginDir = CURRENT_PLUGIN_ID) {
  const normalized = rawRef.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized.startsWith("raw/") || normalized.includes("..")) {
    throw new Error("\u975E\u6CD5\u539F\u6587\u5F15\u7528");
  }
  return path.join(pluginDataDir(vaultPath, pluginDir), normalized);
}
async function writeRawText(vaultPath, rawRef, text, pluginDir = CURRENT_PLUGIN_ID) {
  const target = resolveRawRef(vaultPath, rawRef, pluginDir);
  await (0, import_promises.mkdir)(path.dirname(target), { recursive: true });
  await (0, import_promises.writeFile)(target, text, "utf8");
}
async function readRawText(vaultPath, rawRef, pluginDir = CURRENT_PLUGIN_ID) {
  const currentPath = resolveRawRef(vaultPath, rawRef, pluginDir);
  try {
    return await (0, import_promises.readFile)(currentPath, "utf8");
  } catch (error) {
    if (!isNotFoundError(error)) throw error;
  }
  for (const legacyId of LEGACY_PLUGIN_IDS) {
    if (pluginDataDir(vaultPath, legacyId) === pluginDataDir(vaultPath, pluginDir)) continue;
    try {
      return await (0, import_promises.readFile)(resolveRawRef(vaultPath, rawRef, legacyId), "utf8");
    } catch (error) {
      if (!isNotFoundError(error)) throw error;
    }
  }
  return (0, import_promises.readFile)(currentPath, "utf8");
}
function prepareRawMessage(message, fullText, threshold = thresholdForMessage(message)) {
  const shouldExternalize = message.rawRef ? fullText.length > threshold || Boolean(message.rawTruncatedForPreview) : shouldExternalizeMessage(message, fullText, threshold);
  if (!shouldExternalize) {
    message.text = fullText;
    delete message.previewText;
    delete message.rawRef;
    delete message.rawSize;
    delete message.rawLines;
    delete message.rawTruncatedForPreview;
    return null;
  }
  const rawRef = message.rawRef ?? rawRefForMessage(message.id);
  const previewText = buildPreviewText(fullText);
  message.text = previewText;
  message.previewText = previewText;
  message.rawRef = rawRef;
  message.rawSize = fullText.length;
  message.rawLines = countLines(fullText);
  message.rawTruncatedForPreview = true;
  return { rawRef, text: fullText };
}
async function externalizeLargeMessages(vaultPath, settings, pluginDir = CURRENT_PLUGIN_ID) {
  let changed = 0;
  for (const session of settings.sessions) {
    for (const message of session.messages) {
      if (message.rawRef) {
        if (!message.previewText) message.previewText = message.text;
        continue;
      }
      const fullText = message.text ?? "";
      const write = prepareRawMessage(message, fullText);
      if (!write) continue;
      await writeRawText(vaultPath, write.rawRef, write.text, pluginDir);
      changed += 1;
    }
  }
  return changed;
}
function displayTextForMessage(message) {
  return message.previewText ?? message.text ?? "";
}
function buildPreviewText(text, head = RAW_PREVIEW_HEAD, tail = RAW_PREVIEW_TAIL) {
  if (text.length <= head + tail) return text;
  const omitted = text.length - head - tail;
  return `${text.slice(0, head)}

[\u5185\u5BB9\u8FC7\u5927\uFF0C\u5DF2\u6536\u8D77 ${omitted.toLocaleString()} \u5B57\uFF0C\u5C55\u5F00\u540E\u52A0\u8F7D\u5168\u6587]

${text.slice(-tail)}`;
}
function shouldExternalizeMessage(message, text = message.text ?? "", threshold = thresholdForMessage(message)) {
  if (!text) return false;
  return text.length > threshold;
}
function thresholdForMessage(message) {
  return isProcessItemType(message.itemType) ? RAW_TEXT_THRESHOLD : LARGE_MESSAGE_THRESHOLD;
}
function isLargeRawMessage(message) {
  return Boolean(message.rawRef || message.rawTruncatedForPreview || (message.text?.length ?? 0) > thresholdForMessage(message));
}
function countLines(text) {
  if (!text) return 0;
  let lines = 1;
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 10) lines += 1;
  }
  return lines;
}
function sanitizeRawFileName(value) {
  return value.replace(/[^a-zA-Z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || `msg-${Date.now()}`;
}
function isProcessItemType(itemType) {
  return itemType === "commandExecution" || itemType === "fileChange" || itemType === "mcpToolCall" || itemType === "dynamicToolCall" || itemType === "collabAgentToolCall";
}
function normalizePluginDir(value) {
  const normalized = value.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!normalized) return CURRENT_PLUGIN_ID;
  if (normalized.split("/").includes("..")) throw new Error("\u975E\u6CD5\u63D2\u4EF6\u76EE\u5F55");
  return normalized;
}
function isNotFoundError(error) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

// src/knowledge-base/constants.ts
var AGENTS_RULES_FILE = "AGENTS.md";
var CODEX_MEMORY_LITE_URL = "https://github.com/AKin-lvyifang/codex-memory-lite";
var DEFAULT_KNOWLEDGE_BASE_RULES_FILE = "LLM-WIKI.md";
var LEGACY_CLAUDE_RULES_FILE = "CLAUDE.md";

// src/editor-actions/types.ts
var DEFAULT_EDITOR_ACTION_MODEL = "gpt-5.4-mini";

// src/settings/settings.ts
var KNOWLEDGE_BASE_SESSION_TITLE = "\u77E5\u8BC6\u5E93\u7BA1\u7406";
var LEGACY_EDITOR_ACTION_PROMPTS = {
  rewrite: "\u8BF7\u5728\u4FDD\u6301\u539F\u610F\u7684\u524D\u63D0\u4E0B\u6539\u5199\u9009\u4E2D\u6587\u5B57\uFF0C\u8BA9\u8868\u8FBE\u66F4\u6E05\u695A\u3001\u66F4\u81EA\u7136\u3002\n\n\u9009\u4E2D\u6587\u5B57\uFF1A\n{{selected_text}}\n\n\u5199\u4F5C\u98CE\u683C\uFF1A{{style}}",
  expand: "\u8BF7\u5728\u4FDD\u6301\u539F\u610F\u7684\u524D\u63D0\u4E0B\u6269\u5199\u9009\u4E2D\u6587\u5B57\uFF0C\u8865\u5145\u5FC5\u8981\u7EC6\u8282\u3001\u4E0A\u4E0B\u6587\u6216\u4F8B\u5B50\u3002\n\n\u9009\u4E2D\u6587\u5B57\uFF1A\n{{selected_text}}\n\n\u5199\u4F5C\u98CE\u683C\uFF1A{{style}}",
  continue: "\u8BF7\u57FA\u4E8E\u9009\u4E2D\u6587\u5B57\u548C\u524D\u540E\u6587\u7EE7\u7EED\u5199\u3002\u4E0D\u8981\u91CD\u590D\u539F\u6587\uFF0C\u53EA\u8FD4\u56DE\u7EED\u5199\u5019\u9009\u6B63\u6587\u3002\n\n\u9009\u4E2D\u6587\u5B57\uFF1A\n{{selected_text}}\n\n\u9009\u533A\u524D\u6587\uFF1A\n{{before_context}}\n\n\u9009\u533A\u540E\u6587\uFF1A\n{{after_context}}\n\n\u5199\u4F5C\u98CE\u683C\uFF1A{{style}}"
};
var VERSION_9_EDITOR_ACTION_PROMPTS = {
  rewrite: [
    "\u8BF7\u628A\u9009\u4E2D\u6587\u5B57\u6539\u5199\u6210\u4E00\u4E2A\u660E\u663E\u4E0D\u540C\u3001\u8868\u8FBE\u66F4\u6709\u8D28\u611F\u7684\u7248\u672C\u3002",
    "\u8981\u6C42\uFF1A",
    "1. \u4FDD\u7559\u6838\u5FC3\u4E8B\u5B9E\u548C\u771F\u5B9E\u542B\u4E49\uFF0C\u4E0D\u7F16\u9020\u65B0\u4FE1\u606F\u3002",
    "2. \u91CD\u7EC4\u53E5\u5F0F\u548C\u8868\u8FBE\u8282\u594F\uFF0C\u4E0D\u8981\u53EA\u66FF\u6362\u4E00\u4E24\u4E2A\u8BCD\uFF0C\u4E5F\u4E0D\u8981\u53EA\u52A0\u8BED\u6C14\u8BCD\u3002",
    "3. \u6309\u5199\u4F5C\u98CE\u683C\u8981\u6C42\u91CD\u5851\u8BED\u6C14\u3001\u753B\u9762\u611F\u548C\u4FE1\u606F\u91CD\u70B9\u3002",
    "4. \u5982\u679C\u539F\u6587\u592A\u5E73\uFF0C\u8981\u4E3B\u52A8\u8865\u8DB3\u8868\u8FBE\u5F20\u529B\uFF0C\u4F46\u4E0D\u8981\u5938\u5F20\u6CB9\u817B\u3002",
    "5. \u53EA\u8FD4\u56DE\u6539\u5199\u540E\u7684\u5019\u9009\u6B63\u6587\u3002",
    "",
    "\u9009\u4E2D\u6587\u5B57\uFF1A",
    "{{selected_text}}",
    "",
    "\u5199\u4F5C\u98CE\u683C\uFF1A{{style}}"
  ].join("\n"),
  expand: [
    "\u8BF7\u628A\u9009\u4E2D\u6587\u5B57\u6269\u5199\u6210\u4FE1\u606F\u66F4\u5B8C\u6574\u3001\u8BFB\u8D77\u6765\u66F4\u987A\u7684\u7248\u672C\u3002",
    "\u8981\u6C42\uFF1A",
    "1. \u4FDD\u7559\u539F\u610F\uFF0C\u5E76\u56F4\u7ED5\u539F\u610F\u589E\u52A0\u52A8\u673A\u3001\u80CC\u666F\u3001\u8FC7\u7A0B\u3001\u611F\u53D7\u6216\u5177\u4F53\u7EC6\u8282\u3002",
    "2. \u6269\u5199\u540E\u957F\u5EA6\u8981\u660E\u663E\u589E\u52A0\uFF0C\u4E0D\u80FD\u53EA\u662F\u540C\u4E49\u6539\u5199\u3002",
    "3. \u6309\u5199\u4F5C\u98CE\u683C\u8981\u6C42\u8C03\u6574\u8BED\u6C14\u548C\u8868\u8FBE\u65B9\u5F0F\u3002",
    "4. \u4E0D\u8981\u7F16\u9020\u786C\u4E8B\u5B9E\uFF1B\u4E0D\u786E\u5B9A\u7684\u4FE1\u606F\u7528\u66F4\u7A33\u59A5\u7684\u8868\u8FBE\u3002",
    "5. \u53EA\u8FD4\u56DE\u6269\u5199\u540E\u7684\u5019\u9009\u6B63\u6587\u3002",
    "",
    "\u9009\u4E2D\u6587\u5B57\uFF1A",
    "{{selected_text}}",
    "",
    "\u9009\u533A\u524D\u6587\uFF1A",
    "{{before_context}}",
    "",
    "\u9009\u533A\u540E\u6587\uFF1A",
    "{{after_context}}",
    "",
    "\u5199\u4F5C\u98CE\u683C\uFF1A{{style}}"
  ].join("\n"),
  continue: [
    "\u8BF7\u57FA\u4E8E\u9009\u4E2D\u6587\u5B57\u548C\u524D\u540E\u6587\u7EE7\u7EED\u5199\u4E00\u6BB5\u81EA\u7136\u8854\u63A5\u7684\u5185\u5BB9\u3002",
    "\u8981\u6C42\uFF1A",
    "1. \u627F\u63A5\u5F53\u524D\u8BED\u6C14\u3001\u4E3B\u9898\u548C\u53D9\u8FF0\u65B9\u5411\uFF0C\u4E0D\u8981\u91CD\u590D\u539F\u6587\u3002",
    "2. \u7EED\u5199\u5185\u5BB9\u8981\u80FD\u76F4\u63A5\u63A5\u5728\u9009\u4E2D\u6587\u5B57\u540E\u9762\u3002",
    "3. \u6309\u5199\u4F5C\u98CE\u683C\u8981\u6C42\u589E\u5F3A\u8868\u8FBE\uFF0C\u4F46\u4E0D\u8981\u8DD1\u9898\u3002",
    "4. \u4E0D\u8981\u603B\u7ED3\u89E3\u91CA\uFF0C\u4E0D\u8981\u8F93\u51FA\u591A\u4E2A\u7248\u672C\u3002",
    "5. \u53EA\u8FD4\u56DE\u7EED\u5199\u5019\u9009\u6B63\u6587\u3002",
    "",
    "\u9009\u4E2D\u6587\u5B57\uFF1A",
    "{{selected_text}}",
    "",
    "\u9009\u533A\u524D\u6587\uFF1A",
    "{{before_context}}",
    "",
    "\u9009\u533A\u540E\u6587\uFF1A",
    "{{after_context}}",
    "",
    "\u5199\u4F5C\u98CE\u683C\uFF1A{{style}}"
  ].join("\n")
};
var DEFAULT_EDITOR_ACTIONS = [
  {
    id: "rewrite",
    label: "\u6539\u5199",
    enabled: true,
    promptTemplate: [
      "\u8BF7\u628A\u9009\u4E2D\u6587\u5B57\u6539\u5199\u6210\u4E00\u4E2A\u660E\u663E\u4E0D\u540C\u3001\u8868\u8FBE\u66F4\u6709\u8D28\u611F\u7684\u7248\u672C\u3002",
      "\u8981\u6C42\uFF1A",
      "1. \u4FDD\u7559\u6838\u5FC3\u4E8B\u5B9E\u548C\u771F\u5B9E\u542B\u4E49\uFF0C\u4E0D\u7F16\u9020\u65B0\u4FE1\u606F\u3002",
      "2. \u91CD\u7EC4\u53E5\u5F0F\u548C\u8868\u8FBE\u8282\u594F\uFF0C\u4E0D\u8981\u53EA\u66FF\u6362\u4E00\u4E24\u4E2A\u8BCD\uFF0C\u4E5F\u4E0D\u8981\u53EA\u52A0\u8BED\u6C14\u8BCD\u3002",
      "3. \u6309\u5199\u4F5C\u98CE\u683C\u8981\u6C42\u91CD\u5851\u8BED\u6C14\u3001\u753B\u9762\u611F\u548C\u4FE1\u606F\u91CD\u70B9\u3002",
      "4. \u5982\u679C\u539F\u6587\u592A\u5E73\uFF0C\u8981\u4E3B\u52A8\u8865\u8DB3\u8868\u8FBE\u5F20\u529B\uFF0C\u4F46\u4E0D\u8981\u5938\u5F20\u6CB9\u817B\u3002",
      "5. \u53EA\u8FD4\u56DE\u6539\u5199\u540E\u7684\u5019\u9009\u6B63\u6587\u3002"
    ].join("\n")
  },
  {
    id: "expand",
    label: "\u6269\u5199",
    enabled: true,
    promptTemplate: [
      "\u8BF7\u628A\u9009\u4E2D\u6587\u5B57\u6269\u5199\u6210\u4FE1\u606F\u66F4\u5B8C\u6574\u3001\u8BFB\u8D77\u6765\u66F4\u987A\u7684\u7248\u672C\u3002",
      "\u8981\u6C42\uFF1A",
      "1. \u4FDD\u7559\u539F\u610F\uFF0C\u5E76\u56F4\u7ED5\u539F\u610F\u589E\u52A0\u52A8\u673A\u3001\u80CC\u666F\u3001\u8FC7\u7A0B\u3001\u611F\u53D7\u6216\u5177\u4F53\u7EC6\u8282\u3002",
      "2. \u6269\u5199\u540E\u957F\u5EA6\u8981\u660E\u663E\u589E\u52A0\uFF0C\u4E0D\u80FD\u53EA\u662F\u540C\u4E49\u6539\u5199\u3002",
      "3. \u6309\u5199\u4F5C\u98CE\u683C\u8981\u6C42\u8C03\u6574\u8BED\u6C14\u548C\u8868\u8FBE\u65B9\u5F0F\u3002",
      "4. \u4E0D\u8981\u7F16\u9020\u786C\u4E8B\u5B9E\uFF1B\u4E0D\u786E\u5B9A\u7684\u4FE1\u606F\u7528\u66F4\u7A33\u59A5\u7684\u8868\u8FBE\u3002",
      "5. \u8F93\u51FA\u4E00\u5C0F\u6BB5\u5373\u53EF\uFF0C\u4E0D\u8981\u5199\u6210\u957F\u6587\u3002",
      "6. \u53EA\u8FD4\u56DE\u6269\u5199\u540E\u7684\u5019\u9009\u6B63\u6587\u3002"
    ].join("\n")
  },
  {
    id: "continue",
    label: "\u7EED\u5199",
    enabled: true,
    promptTemplate: [
      "\u8BF7\u57FA\u4E8E\u9009\u4E2D\u6587\u5B57\u548C\u524D\u540E\u6587\u7EE7\u7EED\u5199\u4E00\u6BB5\u81EA\u7136\u8854\u63A5\u7684\u5185\u5BB9\u3002",
      "\u8981\u6C42\uFF1A",
      "1. \u627F\u63A5\u5F53\u524D\u8BED\u6C14\u3001\u4E3B\u9898\u548C\u53D9\u8FF0\u65B9\u5411\uFF0C\u4E0D\u8981\u91CD\u590D\u539F\u6587\u3002",
      "2. \u7EED\u5199\u5185\u5BB9\u8981\u80FD\u76F4\u63A5\u63A5\u5728\u9009\u4E2D\u6587\u5B57\u540E\u9762\u3002",
      "3. \u6309\u5199\u4F5C\u98CE\u683C\u8981\u6C42\u589E\u5F3A\u8868\u8FBE\uFF0C\u4F46\u4E0D\u8981\u8DD1\u9898\u3002",
      "4. \u4E0D\u8981\u603B\u7ED3\u89E3\u91CA\uFF0C\u4E0D\u8981\u8F93\u51FA\u591A\u4E2A\u7248\u672C\u3002",
      "5. \u53EA\u8FD4\u56DE\u7EED\u5199\u5019\u9009\u6B63\u6587\u3002"
    ].join("\n")
  },
  {
    id: "translate",
    label: "\u7FFB\u8BD1\u6210\u82F1\u6587",
    enabled: true,
    promptTemplate: [
      "\u8BF7\u628A\u9009\u4E2D\u6587\u5B57\u7FFB\u8BD1\u6210\u82F1\u6587\u3002",
      "\u8981\u6C42\uFF1A",
      "1. \u53EA\u8FD4\u56DE\u82F1\u6587\u8BD1\u6587\uFF0C\u4E0D\u8981\u4FDD\u7559\u4E2D\u6587\u539F\u6587\u3002",
      "2. \u51C6\u786E\u4FDD\u7559\u539F\u6587\u542B\u4E49\u3001\u4E8B\u5B9E\u3001\u6570\u5B57\u3001\u4E13\u6709\u540D\u8BCD\u548C\u8BED\u6C14\u3002",
      "3. \u4FDD\u7559 Markdown \u7ED3\u6784\u3001\u94FE\u63A5\u3001\u5217\u8868\u3001\u52A0\u7C97\u3001\u4EE3\u7801\u7247\u6BB5\u548C\u6362\u884C\u3002",
      "4. \u4E0D\u8981\u89E3\u91CA\uFF0C\u4E0D\u8981\u8F93\u51FA\u591A\u4E2A\u7248\u672C\u3002",
      "5. \u5982\u679C\u539F\u6587\u5DF2\u6709\u82F1\u6587\uFF0C\u4FDD\u6301\u81EA\u7136\u82F1\u6587\u8868\u8FBE\uFF0C\u53EF\u8F7B\u5FAE\u6DA6\u8272\u4F46\u4E0D\u8981\u65B0\u589E\u4FE1\u606F\u3002"
    ].join("\n")
  }
];
var LEGACY_EDITOR_STYLE_INSTRUCTIONS = {
  xiaohongshu: "\u8868\u8FBE\u66F4\u6709\u5206\u4EAB\u611F\u548C\u5438\u5F15\u529B\uFF0C\u4F46\u4E0D\u8981\u5938\u5F20\u5806\u8BCD\u3002"
};
var DEFAULT_EDITOR_STYLES = [
  { id: "clear", label: "\u6E05\u695A", instruction: "\u8868\u8FBE\u6E05\u695A\u3001\u51C6\u786E\u3001\u81EA\u7136\uFF0C\u5220\u6389\u542B\u7CCA\u548C\u7ED5\u5F2F\uFF0C\u4F46\u4FDD\u7559\u539F\u6587\u7684\u771F\u5B9E\u8BED\u6C14\u3002" },
  { id: "formal", label: "\u6B63\u5F0F", instruction: "\u8BED\u6C14\u6B63\u5F0F\u3001\u7A33\u91CD\u3001\u6709\u6761\u7406\uFF0C\u9002\u5408\u65B9\u6848\u3001\u62A5\u544A\u3001\u6587\u6863\u548C\u5BF9\u5916\u8BF4\u660E\u3002" },
  { id: "casual", label: "\u53E3\u8BED", instruction: "\u8BED\u6C14\u81EA\u7136\u3001\u50CF\u771F\u5B9E\u7684\u4EBA\u5728\u8868\u8FBE\uFF0C\u53E5\u5B50\u66F4\u987A\u53E3\uFF0C\u4F46\u4E0D\u8981\u677E\u6563\u548C\u5570\u55E6\u3002" },
  { id: "xiaohongshu", label: "\u5C0F\u7EA2\u4E66", instruction: "\u751F\u6D3B\u5316\u3001\u6709\u753B\u9762\u611F\u3001\u6709\u5206\u4EAB\u6B32\uFF0C\u9002\u5408\u7B14\u8BB0\u6B63\u6587\uFF1B\u53EF\u4EE5\u589E\u5F3A\u60C5\u7EEA\u548C\u573A\u666F\uFF0C\u4F46\u907F\u514D\u5938\u5F20\u6807\u9898\u515A\u3001\u53E3\u6C34\u8BCD\u548C\u865A\u5047\u627F\u8BFA\u3002" }
];
var DEFAULT_REVIEW_OUTPUT_DIR = "outputs";
var DEFAULT_EDITOR_ACTION_MODE_CONFIGS = {
  fast: {
    mode: "fast",
    label: "\u5FEB\u901F",
    model: DEFAULT_EDITOR_ACTION_MODEL,
    contextCharsBefore: 500,
    contextCharsAfter: 500
  },
  quality: {
    mode: "quality",
    label: "\u8D28\u91CF",
    model: "gpt-5.4",
    contextCharsBefore: 1e3,
    contextCharsAfter: 1e3
  },
  strict: {
    mode: "strict",
    label: "\u4E25\u683C",
    model: "gpt-5.5",
    contextCharsBefore: 1500,
    contextCharsAfter: 1500
  }
};
var DEFAULT_SETTINGS = {
  settingsVersion: 27,
  settingsLanguage: "zh-CN",
  settingsTab: "general",
  agentBackend: "opencode",
  assistantMode: "opencode",
  proxyEnabled: false,
  proxyUrl: "http://127.0.0.1:7890",
  providerMode: "custom-api",
  activeApiProviderId: "",
  apiProviders: [],
  mcpEnabled: false,
  defaultModel: "",
  defaultReasoning: "high",
  defaultServiceTier: "fast",
  defaultPermission: "workspace-write",
  defaultMode: "agent",
  autoOpen: false,
  showContext: true,
  resourceManagementTab: "plugins",
  editorActions: {
    enabled: false,
    statusSlotEnabled: true,
    qualityMode: "quality",
    showContextPanel: true,
    model: DEFAULT_EDITOR_ACTION_MODEL,
    defaultStyleId: "clear",
    maxSelectedChars: 4e3,
    contextCharsBefore: 300,
    contextCharsAfter: 300,
    timeoutMs: 45e3,
    modeConfigs: DEFAULT_EDITOR_ACTION_MODE_CONFIGS,
    articleUnderstandingCache: {},
    summaryCacheEnabled: false,
    summaryCache: {},
    actions: DEFAULT_EDITOR_ACTIONS,
    styles: DEFAULT_EDITOR_STYLES
  },
  opencode: {
    cliPath: "",
    serverUrl: "",
    autoStart: true,
    hostname: "127.0.0.1",
    port: 4096,
    providerId: "",
    modelId: "",
    agent: "build",
    textEnabled: true,
    imageEnabled: false,
    pdfEnabled: false,
    lastConnectedAt: 0,
    lastError: ""
  },
  knowledgeBase: {
    enabled: false,
    sessionId: "",
    backend: "opencode",
    useCustomRulesFile: true,
    rulesFilePath: DEFAULT_KNOWLEDGE_BASE_RULES_FILE,
    scheduleEnabled: false,
    scheduleTime: "09:00",
    catchUpOnStartup: true,
    lastRunAt: 0,
    lastRunStatus: "idle",
    lastReportPath: "",
    lastError: "",
    lastSummary: "",
    initialization: {
      status: "not-started",
      initializedAt: 0,
      rulesFilePath: "",
      templateVersion: "v0.7",
      lastPreviewSummary: ""
    },
    processedSources: {},
    healthHistory: [],
    maintenanceHistory: []
  },
  review: {
    enabled: false,
    knowledgeBaseEnabled: true,
    agentChatEnabled: true,
    scheduleTime: "21:00",
    catchUpOnStartup: true,
    outputDir: DEFAULT_REVIEW_OUTPUT_DIR,
    rangeMode: "previous-week",
    openHtmlAfterRun: false,
    reports: {
      knowledgeBase: {
        lastRunAt: 0,
        lastRunStatus: "idle",
        lastRangeKey: "",
        lastMarkdownPath: "",
        lastHtmlPath: "",
        lastError: "",
        lastSummary: ""
      },
      agentChat: {
        lastRunAt: 0,
        lastRunStatus: "idle",
        lastRangeKey: "",
        lastMarkdownPath: "",
        lastHtmlPath: "",
        lastError: "",
        lastSummary: ""
      }
    }
  },
  workspaceResources: {
    plugins: {},
    mcpServers: {},
    skills: {}
  },
  workspaceResourceCache: {},
  sessions: [],
  activeSessionId: ""
};
function normalizeSettingsData(data) {
  const previousVersion = typeof data?.settingsVersion === "number" ? data.settingsVersion : 0;
  const normalizedLanguage = normalizeSettingsLanguage(data?.settingsLanguage);
  const settings = {
    ...DEFAULT_SETTINGS,
    ...data,
    settingsLanguage: normalizedLanguage,
    settingsTab: normalizeSettingsTab(data?.settingsTab),
    agentBackend: "opencode",
    providerMode: "custom-api",
    activeApiProviderId: typeof data?.activeApiProviderId === "string" ? data.activeApiProviderId.trim() : "",
    apiProviders: normalizeApiProviders(data?.apiProviders),
    resourceManagementTab: normalizeResourceManagementTab(data?.resourceManagementTab),
    editorActions: normalizeEditorActionSettings(data?.editorActions, previousVersion),
    opencode: normalizeOpenCodeSettings(data?.opencode),
    knowledgeBase: normalizeKnowledgeBaseSettings(data?.knowledgeBase),
    review: normalizeReviewSettings(data?.review),
    workspaceResources: normalizeWorkspaceResources(data?.workspaceResources),
    workspaceResourceCache: normalizeWorkspaceResourceCache(data?.workspaceResourceCache),
    sessions: normalizeStoredSessions(data?.sessions),
    activeSessionId: typeof data?.activeSessionId === "string" ? data.activeSessionId : ""
  };
  if (settings.knowledgeBase.sessionId) {
    const session = settings.sessions.find((item) => item.id === settings.knowledgeBase.sessionId);
    if (session) session.kind = "knowledge-base";
  }
  if (previousVersion < 1) {
    if (!data?.defaultModel) settings.defaultModel = DEFAULT_SETTINGS.defaultModel;
    if (data?.defaultReasoning === "high") settings.defaultReasoning = DEFAULT_SETTINGS.defaultReasoning;
    if (data?.defaultServiceTier === "standard") settings.defaultServiceTier = DEFAULT_SETTINGS.defaultServiceTier;
    settings.proxyEnabled = data?.proxyEnabled !== false;
    settings.proxyUrl = typeof data?.proxyUrl === "string" && data.proxyUrl.trim() ? data.proxyUrl.trim() : DEFAULT_SETTINGS.proxyUrl;
    settings.mcpEnabled = data?.mcpEnabled === true;
  }
  if (previousVersion < 3) {
    if (settings.defaultReasoning === "high" || settings.defaultReasoning === "xhigh") {
      settings.defaultReasoning = DEFAULT_SETTINGS.defaultReasoning;
    }
    if (settings.defaultServiceTier === "standard") {
      settings.defaultServiceTier = DEFAULT_SETTINGS.defaultServiceTier;
    }
  }
  if (previousVersion < 4) {
    if (!settings.defaultModel || settings.defaultModel === "gpt-5.4" || settings.defaultModel === "gpt-5.4-mini") {
      settings.defaultModel = DEFAULT_SETTINGS.defaultModel;
    }
    if (!settings.defaultReasoning || settings.defaultReasoning === "low") {
      settings.defaultReasoning = DEFAULT_SETTINGS.defaultReasoning;
    }
  }
  if (previousVersion < 25 && settings.defaultModel === "gpt-5.5") {
    settings.defaultModel = "";
  }
  normalizeApiProviderSelection(settings);
  settings.settingsVersion = DEFAULT_SETTINGS.settingsVersion;
  const languageChanged = data?.settingsLanguage !== normalizedLanguage;
  return { settings, changed: previousVersion !== DEFAULT_SETTINGS.settingsVersion || languageChanged };
}
function getActiveApiProvider(settings) {
  return settings.apiProviders.find((provider) => provider.id === settings.activeApiProviderId) ?? null;
}
function getApiProviderModels(provider) {
  return normalizeModelList([...provider.models ?? [], provider.model]);
}
function providerModelLabel(provider, language = "zh-CN") {
  const models = getApiProviderModels(provider);
  if (!models.length) return language === "en" ? "No model set" : "\u672A\u8BBE\u7F6E\u6A21\u578B";
  return models.length === 1 ? models[0] : language === "en" ? `${models[0]} + ${models.length - 1} more` : `${models[0]} \u7B49 ${models.length} \u4E2A`;
}
function validateApiProvider(provider, language = "zh-CN") {
  const errors = [];
  if (!provider.name.trim()) errors.push(language === "en" ? "Name is required" : "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
  if (!provider.baseUrl.trim()) errors.push(language === "en" ? "Base URL is required" : "Base URL \u4E0D\u80FD\u4E3A\u7A7A");
  if (!getApiProviderModels(provider).length) errors.push(language === "en" ? "Model is required" : "\u6A21\u578B\u4E0D\u80FD\u4E3A\u7A7A");
  if (!provider.apiKey.trim()) errors.push(language === "en" ? "API key is required" : "API key \u4E0D\u80FD\u4E3A\u7A7A");
  return errors;
}
function removeApiProvider(settings, providerId) {
  const index = settings.apiProviders.findIndex((provider) => provider.id === providerId);
  if (index < 0) return false;
  const wasActive = settings.activeApiProviderId === providerId;
  settings.apiProviders.splice(index, 1);
  if (wasActive) {
    const next = settings.apiProviders[Math.min(index, settings.apiProviders.length - 1)];
    settings.activeApiProviderId = next?.id ?? "";
  }
  return true;
}
function isKnowledgeBaseSession(session, knowledgeBaseSessionId = "") {
  if (!session) return false;
  return session.kind === "knowledge-base" || Boolean(knowledgeBaseSessionId && session.id === knowledgeBaseSessionId);
}
function ensureKnowledgeBaseSession(settings, cwd, idFactory = () => newId("session")) {
  let session = settings.sessions.find((item) => isKnowledgeBaseSession(item, settings.knowledgeBase.sessionId));
  if (!session) {
    session = {
      id: idFactory(),
      title: KNOWLEDGE_BASE_SESSION_TITLE,
      kind: "knowledge-base",
      cwd,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    settings.sessions.unshift(session);
  }
  session.kind = "knowledge-base";
  session.title = KNOWLEDGE_BASE_SESSION_TITLE;
  session.cwd = cwd;
  settings.knowledgeBase.sessionId = session.id;
  const currentIndex = settings.sessions.findIndex((item) => item.id === session.id);
  if (currentIndex > 0) {
    settings.sessions.splice(currentIndex, 1);
    settings.sessions.unshift(session);
  }
  return session;
}
function clearLegacyChatWorkspaceDefaults(settings, vaultPath, previousVersion) {
  if (previousVersion >= 21) return 0;
  const normalizedVaultPath = normalizeComparablePath(vaultPath);
  if (!normalizedVaultPath) return 0;
  let changed = 0;
  for (const session of settings.sessions) {
    if (isKnowledgeBaseSession(session, settings.knowledgeBase.sessionId)) continue;
    if (normalizeComparablePath(session.cwd) !== normalizedVaultPath) continue;
    session.cwd = "";
    delete session.threadId;
    delete session.tokenUsage;
    changed += 1;
  }
  return changed;
}
function providerConnectionLabel(settings, language = "zh-CN") {
  const provider = getActiveApiProvider(settings);
  if (!provider) return language === "en" ? "Custom API not configured" : "\u81EA\u5B9A\u4E49 API \u672A\u914D\u7F6E";
  return language === "en" ? `Custom API: ${provider.name} \xB7 ${providerModelLabel(provider, language)}` : `\u81EA\u5B9A\u4E49 API\uFF1A${provider.name} \xB7 ${providerModelLabel(provider, language)}`;
}
function ensureModelChoices2(models, ...preferredModels) {
  const seen = new Set(models.map((item) => item.model));
  const preferred = [];
  for (const value of preferredModels) {
    const model = typeof value === "string" ? value.trim() : "";
    if (!model || seen.has(model)) continue;
    seen.add(model);
    preferred.push({ id: model, model, displayName: model });
  }
  return [...preferred, ...models];
}
function normalizeEditorActionSettings(value, previousVersion = DEFAULT_SETTINGS.settingsVersion) {
  const defaults = DEFAULT_SETTINGS.editorActions;
  const actions = normalizeEditorActionConfigs(value?.actions, defaults.actions, previousVersion);
  const styles = normalizeEditorActionStyles(value?.styles, defaults.styles, previousVersion);
  const defaultStyleId = typeof value?.defaultStyleId === "string" && styles.some((style) => style.id === value.defaultStyleId.trim()) ? value.defaultStyleId.trim() : defaults.defaultStyleId;
  const legacyContextCharsBefore = normalizeEditorActionPerformanceNumber(value?.contextCharsBefore, defaults.contextCharsBefore, 1200, previousVersion, 0, 1e4);
  const legacyContextCharsAfter = normalizeEditorActionPerformanceNumber(value?.contextCharsAfter, defaults.contextCharsAfter, 1200, previousVersion, 0, 1e4);
  const legacyTimeoutMs = normalizeEditorActionTimeoutMs(value?.timeoutMs, defaults.timeoutMs, previousVersion);
  const hasExistingEditorActionSettings = value && typeof value === "object" && !Array.isArray(value);
  const legacyUpgrade = hasExistingEditorActionSettings && previousVersion < 14;
  const qualityMode = legacyUpgrade ? "fast" : normalizeEditorActionQualityMode(value?.qualityMode, defaults.qualityMode);
  const modeConfigs = normalizeEditorActionModeConfigs(previousVersion < 14 ? null : value?.modeConfigs, defaults.modeConfigs, legacyUpgrade ? {
    model: normalizeText(value?.model, defaults.model),
    contextCharsBefore: legacyContextCharsBefore,
    contextCharsAfter: legacyContextCharsAfter
  } : void 0);
  return {
    enabled: typeof value?.enabled === "boolean" ? value.enabled : defaults.enabled,
    statusSlotEnabled: typeof value?.statusSlotEnabled === "boolean" ? value.statusSlotEnabled : defaults.statusSlotEnabled,
    qualityMode,
    showContextPanel: typeof value?.showContextPanel === "boolean" ? value.showContextPanel : defaults.showContextPanel,
    model: normalizeText(value?.model, defaults.model),
    defaultStyleId,
    maxSelectedChars: normalizePositiveInteger(value?.maxSelectedChars, defaults.maxSelectedChars, 200, 2e4),
    contextCharsBefore: legacyContextCharsBefore,
    contextCharsAfter: legacyContextCharsAfter,
    timeoutMs: legacyTimeoutMs,
    modeConfigs,
    articleUnderstandingCache: normalizeArticleUnderstandingCache(value?.articleUnderstandingCache, value?.summaryCache, modeConfigs.quality.model),
    summaryCacheEnabled: previousVersion < 13 ? false : typeof value?.summaryCacheEnabled === "boolean" ? value.summaryCacheEnabled : defaults.summaryCacheEnabled,
    summaryCache: normalizeEditorActionSummaryCache(value?.summaryCache),
    actions,
    styles
  };
}
function resolveEditorActionModeConfig(settings, mode = settings.qualityMode) {
  return settings.modeConfigs[mode] ?? settings.modeConfigs.quality ?? settings.modeConfigs.fast ?? DEFAULT_EDITOR_ACTION_MODE_CONFIGS.quality;
}
function normalizeWorkspaceResources(value) {
  return {
    plugins: normalizeBooleanMap(value?.plugins),
    mcpServers: normalizeBooleanMap(value?.mcpServers),
    skills: normalizeBooleanMap(value?.skills)
  };
}
function normalizeWorkspaceResourceCache(value) {
  return {
    ...normalizeCacheEntry(value?.plugins, normalizeCachedPlugin) ? { plugins: normalizeCacheEntry(value?.plugins, normalizeCachedPlugin) } : {},
    ...normalizeCacheEntry(value?.mcp, normalizeCachedMcp) ? { mcp: normalizeCacheEntry(value?.mcp, normalizeCachedMcp) } : {},
    ...normalizeCacheEntry(value?.skills, normalizeCachedSkill) ? { skills: normalizeCacheEntry(value?.skills, normalizeCachedSkill) } : {}
  };
}
function normalizeEditorActionSummaryCache(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.values(value).map((item) => {
    const filePath = normalizeText(item?.filePath, "");
    const summary = normalizeText(item?.summary, "");
    const contentHash = normalizeText(item?.contentHash, "");
    if (!filePath || !summary || !contentHash) return null;
    return {
      filePath,
      mtime: normalizeNonNegativeNumber(item?.mtime),
      size: normalizeNonNegativeNumber(item?.size),
      contentHash,
      summary,
      updatedAt: normalizeNonNegativeNumber(item?.updatedAt),
      lastUsedAt: normalizeNonNegativeNumber(item?.lastUsedAt ?? item?.updatedAt)
    };
  }).filter((item) => Boolean(item)).sort((left, right) => right.lastUsedAt - left.lastUsedAt).slice(0, 200);
  return Object.fromEntries(entries.map((entry) => [entry.filePath, entry]));
}
function normalizeArticleUnderstandingCache(value, legacySummaryCache, fallbackModel) {
  const direct = normalizeArticleUnderstandingCacheEntries(value);
  if (Object.keys(direct).length) return direct;
  const summaries = Object.values(normalizeEditorActionSummaryCache(legacySummaryCache)).map((entry) => ({
    filePath: entry.filePath,
    mtime: entry.mtime,
    size: entry.size,
    contentHash: entry.contentHash,
    model: fallbackModel || DEFAULT_EDITOR_ACTION_MODE_CONFIGS.quality.model,
    mode: "quality",
    understanding: entry.summary,
    updatedAt: entry.updatedAt,
    lastUsedAt: entry.lastUsedAt
  })).filter((entry) => entry.filePath && entry.understanding).sort((left, right) => right.lastUsedAt - left.lastUsedAt).slice(0, 200);
  return Object.fromEntries(summaries.map((entry) => [entry.filePath, entry]));
}
function normalizeArticleUnderstandingCacheEntries(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.values(value).map((item) => {
    const filePath = normalizeText(item?.filePath, "");
    const understanding = normalizeText(item?.understanding, "");
    const contentHash = normalizeText(item?.contentHash, "");
    const model = normalizeText(item?.model, DEFAULT_EDITOR_ACTION_MODE_CONFIGS.quality.model);
    const mode = normalizeEditorActionQualityMode(item?.mode, "quality");
    const fingerprint = normalizeArticleUnderstandingFingerprint(item?.fingerprint);
    if (!filePath || !understanding || !contentHash) return null;
    return {
      filePath,
      mtime: normalizeNonNegativeNumber(item?.mtime),
      size: normalizeNonNegativeNumber(item?.size),
      contentHash,
      model,
      mode,
      understanding,
      ...fingerprint ? { fingerprint } : {},
      updatedAt: normalizeNonNegativeNumber(item?.updatedAt),
      lastUsedAt: normalizeNonNegativeNumber(item?.lastUsedAt ?? item?.updatedAt)
    };
  }).filter((item) => Boolean(item)).sort((left, right) => right.lastUsedAt - left.lastUsedAt).slice(0, 200);
  return Object.fromEntries(entries.map((entry) => [entry.filePath, entry]));
}
function normalizeArticleUnderstandingFingerprint(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const stableLineHashes = Array.isArray(value.stableLineHashes) ? value.stableLineHashes.map((item) => normalizeText(item, "")).filter(Boolean).slice(0, 12) : [];
  const fingerprint = {
    textLength: normalizeNonNegativeNumber(value.textLength),
    titleHash: normalizeText(value.titleHash, ""),
    firstBlockHash: normalizeText(value.firstBlockHash, ""),
    lastBlockHash: normalizeText(value.lastBlockHash, ""),
    stableLineHashes
  };
  if (!fingerprint.textLength && !fingerprint.titleHash && !fingerprint.firstBlockHash && !fingerprint.lastBlockHash && !stableLineHashes.length) return null;
  return fingerprint;
}
function resourceEnabled(overrides, key, sourceEnabled = true) {
  if (!key) return sourceEnabled;
  const override = overrides?.[key];
  return typeof override === "boolean" ? override : sourceEnabled;
}
function filterEnabledSkills(skills, overrides) {
  return skills.filter((skill) => resourceEnabled(overrides, skill.path || skill.name, skill.enabled !== false));
}
function getKnowledgeBaseRulesFileChoices(paths) {
  const seen = /* @__PURE__ */ new Set();
  for (const item of paths) {
    const raw = String(item ?? "").replace(/\\/g, "/").trim();
    if (raw.split("/").some((part) => part === "..")) continue;
    const clean = normalizeKnowledgeBaseRulesPath(item, "");
    if (!clean || !/\.md$/i.test(clean)) continue;
    seen.add(clean);
  }
  return Array.from(seen).sort((left, right) => {
    const byRank = rulesFileChoiceRank(left) - rulesFileChoiceRank(right);
    return byRank || left.localeCompare(right);
  });
}
function openCodeModelChoiceValue(model) {
  return `${model.providerId}\0${model.modelId}`;
}
function parseOpenCodeModelChoiceValue(value) {
  const [providerId, modelId, ...rest] = String(value ?? "").split("\0");
  if (rest.length || !providerId?.trim() || !modelId?.trim()) return null;
  return { providerId: providerId.trim(), modelId: modelId.trim() };
}
function openCodeModelCapabilityLabel(model, language = "zh-CN") {
  return language === "en" ? `Text ${model.inputModalities.includes("text") ? "\u2713" : "\xD7"} \xB7 Images ${model.inputModalities.includes("image") ? "\u2713" : "\xD7"} \xB7 PDF ${model.inputModalities.includes("pdf") ? "\u2713" : "\xD7"}` : `\u6587\u672C ${model.inputModalities.includes("text") ? "\u2713" : "\xD7"} \xB7 \u56FE\u7247 ${model.inputModalities.includes("image") ? "\u2713" : "\xD7"} \xB7 PDF ${model.inputModalities.includes("pdf") ? "\u2713" : "\xD7"}`;
}
function openCodeAgentModeLabel(agent, language = "zh-CN") {
  if (agent.mode === "primary") return language === "en" ? "Primary agent" : "\u4E3B Agent";
  if (agent.mode === "all") return language === "en" ? "Universal agent" : "\u901A\u7528 Agent";
  return language === "en" ? "Subagent" : "\u5B50 Agent";
}
function openCodeAgentChoiceValue(agent) {
  return agent.name;
}
function parseOpenCodeAgentChoiceValue(value) {
  const agent = String(value ?? "").trim();
  return agent ? agent : null;
}
function openCodeAgentChoiceLabel(agent, language = "zh-CN") {
  return `${agent.name} \xB7 ${openCodeAgentModeLabel(agent, language)}${agent.native ? language === "en" ? " \xB7 Built-in" : " \xB7 \u5185\u7F6E" : ""}`;
}
function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function normalizeResourceManagementTab(value) {
  return value === "mcp" || value === "skills" || value === "plugins" ? value : DEFAULT_SETTINGS.resourceManagementTab;
}
function normalizeSettingsTab(value) {
  return value === "providers" || value === "resources" || value === "editorActions" || value === "knowledgeBase" || value === "review" || value === "general" ? value : DEFAULT_SETTINGS.settingsTab;
}
function normalizeSettingsLanguage(value) {
  return value === "en" ? "en" : DEFAULT_SETTINGS.settingsLanguage;
}
function normalizeKnowledgeBaseRunStatus(value) {
  return value === "running" || value === "success" || value === "failed" || value === "canceled" ? value : "idle";
}
function normalizeReviewRunStatus(value) {
  return value === "running" || value === "success" || value === "failed" ? value : "idle";
}
function normalizeKnowledgeBaseInitStatus(value) {
  return value === "preview-ready" || value === "initialized" || value === "failed" ? value : "not-started";
}
function normalizeKnowledgeBaseRulesPath(value, fallback) {
  const raw = normalizeText(value, fallback).replace(/\\/g, "/").trim();
  const withoutLeadingSlash = raw.replace(/^\/+/, "");
  const clean = withoutLeadingSlash.split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  return clean || fallback;
}
function rulesFileChoiceRank(value) {
  const upper = value.toUpperCase();
  if (upper === DEFAULT_KNOWLEDGE_BASE_RULES_FILE.toUpperCase()) return 0;
  if (upper === AGENTS_RULES_FILE.toUpperCase()) return 1;
  if (upper === LEGACY_CLAUDE_RULES_FILE.toUpperCase()) return 2;
  return value.includes("/") ? 3 : 2;
}
function normalizeOpenCodeSettings(value) {
  const fallback = DEFAULT_SETTINGS.opencode;
  return {
    cliPath: normalizeOptionalText(value?.cliPath),
    serverUrl: normalizeOptionalText(value?.serverUrl),
    autoStart: typeof value?.autoStart === "boolean" ? value.autoStart : fallback.autoStart,
    hostname: normalizeText(value?.hostname, fallback.hostname),
    port: normalizePositiveInteger(value?.port, fallback.port, 1024, 65535),
    providerId: normalizeOptionalText(value?.providerId),
    modelId: normalizeOptionalText(value?.modelId),
    agent: normalizeText(value?.agent, fallback.agent),
    textEnabled: value?.textEnabled !== false,
    imageEnabled: value?.imageEnabled === true,
    pdfEnabled: value?.pdfEnabled === true,
    lastConnectedAt: normalizeNonNegativeNumber(value?.lastConnectedAt),
    lastError: normalizeOptionalText(value?.lastError)
  };
}
function normalizeKnowledgeBaseSettings(value) {
  const fallback = DEFAULT_SETTINGS.knowledgeBase;
  return {
    enabled: value?.enabled === true,
    sessionId: normalizeOptionalText(value?.sessionId),
    backend: "opencode",
    useCustomRulesFile: value?.useCustomRulesFile === true,
    rulesFilePath: normalizeKnowledgeBaseRulesPath(value?.rulesFilePath, fallback.rulesFilePath),
    scheduleEnabled: value?.scheduleEnabled === true,
    scheduleTime: normalizeScheduleTime(value?.scheduleTime, fallback.scheduleTime),
    catchUpOnStartup: value?.catchUpOnStartup !== false,
    lastRunAt: normalizeNonNegativeNumber(value?.lastRunAt),
    lastRunStatus: normalizeKnowledgeBaseRunStatus(value?.lastRunStatus),
    lastReportPath: normalizeOptionalText(value?.lastReportPath),
    lastError: normalizeOptionalText(value?.lastError),
    lastSummary: normalizeOptionalText(value?.lastSummary),
    initialization: normalizeKnowledgeBaseInitialization(value?.initialization),
    processedSources: normalizeKnowledgeBaseProcessedSources(value?.processedSources),
    healthHistory: normalizeKnowledgeBaseHealthHistory(value?.healthHistory),
    maintenanceHistory: normalizeKnowledgeBaseMaintenanceHistory(value?.maintenanceHistory, value?.healthHistory)
  };
}
function normalizeReviewSettings(value) {
  const fallback = DEFAULT_SETTINGS.review;
  const outputDir = normalizeReviewOutputDir(value?.outputDir, fallback.outputDir);
  return {
    enabled: false,
    knowledgeBaseEnabled: typeof value?.knowledgeBaseEnabled === "boolean" ? value.knowledgeBaseEnabled : fallback.knowledgeBaseEnabled,
    agentChatEnabled: typeof value?.agentChatEnabled === "boolean" ? value.agentChatEnabled : fallback.agentChatEnabled,
    scheduleTime: normalizeScheduleTime(value?.scheduleTime, fallback.scheduleTime),
    catchUpOnStartup: value?.catchUpOnStartup !== false,
    outputDir,
    rangeMode: normalizeReviewRangeMode(value?.rangeMode, fallback.rangeMode),
    openHtmlAfterRun: value?.openHtmlAfterRun === true,
    reports: {
      knowledgeBase: normalizeReviewReportState(value?.reports?.knowledgeBase, outputDir),
      agentChat: normalizeReviewReportState(value?.reports?.agentChat, outputDir)
    }
  };
}
function normalizeReviewReportState(value, outputDir = DEFAULT_REVIEW_OUTPUT_DIR) {
  return {
    lastRunAt: normalizeNonNegativeNumber(value?.lastRunAt),
    lastRunStatus: normalizeReviewRunStatus(value?.lastRunStatus),
    lastRangeKey: normalizeReviewRangeKey(value?.lastRangeKey),
    lastMarkdownPath: normalizeReviewOutputPath(value?.lastMarkdownPath, ".md", outputDir),
    lastHtmlPath: normalizeReviewOutputPath(value?.lastHtmlPath, ".html", outputDir),
    lastError: normalizeOptionalText(value?.lastError),
    lastSummary: normalizeOptionalText(value?.lastSummary)
  };
}
function normalizeReviewRangeMode(value, fallback) {
  return value === "current-week" || value === "previous-week" ? value : fallback;
}
function normalizeReviewRangeKey(value) {
  const text = normalizeOptionalText(value);
  return /^\d{4}-\d{2}-\d{2}-to-\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}
function normalizeReviewOutputDir(value, fallback = DEFAULT_REVIEW_OUTPUT_DIR) {
  const raw = normalizeText(value, fallback).replace(/\\/g, "/").replace(/^\/+/, "");
  const clean = raw.split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  return clean || fallback;
}
function normalizeReviewOutputPath(value, extension, outputDir = DEFAULT_REVIEW_OUTPUT_DIR) {
  const raw = normalizeOptionalText(value).replace(/\\/g, "/").replace(/^\/+/, "");
  if (!raw.endsWith(extension)) return "";
  const parts = raw.split("/");
  if (parts.some((part) => !part || part === "." || part === "..")) return "";
  const allowedDirs = Array.from(new Set([outputDir, DEFAULT_REVIEW_OUTPUT_DIR].map((item) => normalizeReviewOutputDir(item)).filter(Boolean)));
  return allowedDirs.some((dir) => raw.startsWith(`${dir}/`)) ? raw : "";
}
function normalizeKnowledgeBaseInitialization(value) {
  const fallback = DEFAULT_SETTINGS.knowledgeBase.initialization;
  return {
    status: normalizeKnowledgeBaseInitStatus(value?.status),
    initializedAt: normalizeNonNegativeNumber(value?.initializedAt),
    rulesFilePath: normalizeKnowledgeBaseRulesPath(value?.rulesFilePath, fallback.rulesFilePath),
    templateVersion: normalizeText(value?.templateVersion, fallback.templateVersion),
    lastPreviewSummary: normalizeOptionalText(value?.lastPreviewSummary)
  };
}
function normalizeStoredSessions(value) {
  if (!Array.isArray(value)) return [];
  return value.map((session) => {
    const id = normalizeOptionalText(session?.id);
    if (!id) return null;
    const messages = Array.isArray(session?.messages) ? session.messages : [];
    const kind = session?.kind === "knowledge-base" ? "knowledge-base" : void 0;
    return {
      id,
      title: normalizeText(session?.title, kind === "knowledge-base" ? KNOWLEDGE_BASE_SESSION_TITLE : "\u65B0\u4F1A\u8BDD"),
      ...kind ? { kind } : {},
      threadId: normalizeOptionalText(session?.threadId) || void 0,
      cwd: normalizeOptionalText(session?.cwd),
      messages,
      messagesHiddenBefore: normalizeOptionalPositiveNumber(session?.messagesHiddenBefore),
      historyActiveDate: normalizeOptionalText(session?.historyActiveDate) || void 0,
      tokenUsage: session?.tokenUsage,
      createdAt: normalizeNonNegativeNumber(session?.createdAt),
      updatedAt: normalizeNonNegativeNumber(session?.updatedAt)
    };
  }).filter((session) => Boolean(session));
}
function normalizeOptionalPositiveNumber(value) {
  const normalized = normalizeNonNegativeNumber(value);
  return normalized > 0 ? normalized : void 0;
}
function normalizeKnowledgeBaseProcessedSources(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value).map(([key, item]) => {
    const path21 = normalizeOptionalText(item?.path || key);
    if (!path21) return null;
    return [
      path21,
      {
        path: path21,
        size: normalizeNonNegativeNumber(item?.size),
        mtime: normalizeNonNegativeNumber(item?.mtime),
        digestedAt: normalizeNonNegativeNumber(item?.digestedAt)
      }
    ];
  }).filter((item) => Boolean(item)).sort((left, right) => right[1].digestedAt - left[1].digestedAt).slice(0, 1e3);
  return Object.fromEntries(entries);
}
function normalizeKnowledgeBaseHealthHistory(value) {
  if (!Array.isArray(value)) return [];
  const byDate = /* @__PURE__ */ new Map();
  for (const item of value) {
    const date = normalizeOptionalText(item?.date);
    const status = normalizeKnowledgeBaseHealthCheckStatus(item?.status);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !status) continue;
    byDate.set(date, {
      date,
      status,
      at: normalizeNonNegativeNumber(item?.at)
    });
  }
  return Array.from(byDate.values()).sort((left, right) => left.date.localeCompare(right.date)).slice(-90);
}
function normalizeKnowledgeBaseMaintenanceHistory(value, legacyHealthHistory) {
  const byDate = /* @__PURE__ */ new Map();
  const add = (item, legacyMode) => {
    const date = normalizeOptionalText(item?.date);
    const status = normalizeKnowledgeBaseHealthCheckStatus(item?.status);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !status) return;
    const at = normalizeNonNegativeNumber(item?.at);
    const current = byDate.get(date);
    if (current && current.at > at) return;
    byDate.set(date, {
      date,
      status,
      at,
      mode: normalizeKnowledgeBaseMaintenanceMode(item?.mode) ?? legacyMode,
      reportPath: normalizeOptionalText(item?.reportPath)
    });
  };
  if (Array.isArray(legacyHealthHistory)) {
    for (const item of legacyHealthHistory) add(item, "lint");
  }
  if (Array.isArray(value)) {
    for (const item of value) add(item, "unknown");
  }
  return Array.from(byDate.values()).sort((left, right) => left.date.localeCompare(right.date)).slice(-180);
}
function normalizeKnowledgeBaseHealthCheckStatus(value) {
  return value === "success" || value === "failed" ? value : null;
}
function normalizeKnowledgeBaseMaintenanceMode(value) {
  return value === "maintain" || value === "lint" || value === "reingest" || value === "outputs" || value === "inbox" || value === "unknown" ? value : null;
}
function recordKnowledgeBaseHealthCheck(settings, status, at = Date.now()) {
  const date = formatLocalDateKey(at);
  settings.healthHistory = normalizeKnowledgeBaseHealthHistory([
    ...(settings.healthHistory ?? []).filter((entry) => entry.date !== date),
    { date, status, at }
  ]);
}
function recordKnowledgeBaseMaintenanceRun(settings, input) {
  const at = input.at ?? Date.now();
  const date = formatLocalDateKey(at);
  settings.maintenanceHistory = normalizeKnowledgeBaseMaintenanceHistory([
    ...(settings.maintenanceHistory ?? []).filter((entry) => entry.date !== date),
    { date, status: input.status, at, mode: input.mode, reportPath: input.reportPath ?? "" }
  ], settings.healthHistory);
  if (input.mode === "lint") recordKnowledgeBaseHealthCheck(settings, input.status, at);
}
function formatLocalDateKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function normalizeScheduleTime(value, fallback) {
  const text = normalizeOptionalText(value);
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : fallback;
}
function normalizeEditorActionConfigs(value, defaults, previousVersion) {
  const defaultById = new Map(defaults.map((item) => [item.id, item]));
  const used = /* @__PURE__ */ new Set();
  const result = [];
  const source = Array.isArray(value) ? value : [];
  for (const item of source) {
    const id = normalizeEditorActionId(item?.id);
    if (!id || used.has(id)) continue;
    const fallback = defaultById.get(id);
    used.add(id);
    const rawPromptTemplate = normalizeText(item?.promptTemplate, fallback?.promptTemplate ?? "{{selected_text}}");
    result.push({
      id,
      label: normalizeText(item?.label, fallback?.label ?? id),
      enabled: typeof item?.enabled === "boolean" ? item.enabled : fallback?.enabled ?? true,
      promptTemplate: shouldMigrateEditorActionPrompt(id, rawPromptTemplate, previousVersion) ? fallback?.promptTemplate ?? rawPromptTemplate : rawPromptTemplate
    });
  }
  for (const fallback of defaults) {
    if (used.has(fallback.id)) continue;
    result.push({ ...fallback });
  }
  return result;
}
function normalizeEditorActionStyles(value, defaults, previousVersion) {
  const defaultById = new Map(defaults.map((item) => [item.id, item]));
  const used = /* @__PURE__ */ new Set();
  const result = [];
  const source = Array.isArray(value) ? value : [];
  for (const item of source) {
    const id = normalizeEditorActionId(item?.id);
    if (!id || used.has(id)) continue;
    const fallback = defaultById.get(id);
    used.add(id);
    const rawInstruction = normalizeText(item?.instruction, fallback?.instruction ?? "");
    result.push({
      id,
      label: normalizeText(item?.label, fallback?.label ?? id),
      instruction: shouldMigrateEditorStyleInstruction(id, rawInstruction, previousVersion) ? fallback?.instruction ?? rawInstruction : rawInstruction
    });
  }
  for (const fallback of defaults) {
    if (used.has(fallback.id)) continue;
    result.push({ ...fallback });
  }
  return result;
}
function normalizeEditorActionModeConfigs(value, defaults, legacyFast) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    fast: normalizeEditorActionModeConfig(source.fast, defaults.fast, legacyFast ? {
      model: legacyFast.model || defaults.fast.model,
      contextCharsBefore: legacyFast.contextCharsBefore,
      contextCharsAfter: legacyFast.contextCharsAfter
    } : void 0),
    quality: normalizeEditorActionModeConfig(source.quality, defaults.quality),
    strict: normalizeEditorActionModeConfig(source.strict, defaults.strict)
  };
}
function normalizeEditorActionModeConfig(value, fallback, overrideFallback) {
  return {
    mode: fallback.mode,
    label: fallback.label,
    model: normalizeText(value?.model, overrideFallback?.model ?? fallback.model),
    contextCharsBefore: normalizePositiveInteger(value?.contextCharsBefore, overrideFallback?.contextCharsBefore ?? fallback.contextCharsBefore, 0, 1e4),
    contextCharsAfter: normalizePositiveInteger(value?.contextCharsAfter, overrideFallback?.contextCharsAfter ?? fallback.contextCharsAfter, 0, 1e4)
  };
}
function normalizeEditorActionQualityMode(value, fallback) {
  return value === "fast" || value === "quality" || value === "strict" ? value : fallback;
}
function normalizeEditorActionId(value) {
  const id = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : "";
}
function shouldMigrateEditorActionPrompt(id, value, previousVersion) {
  if (previousVersion < 8) return LEGACY_EDITOR_ACTION_PROMPTS[id] === value;
  if (previousVersion < 10) return VERSION_9_EDITOR_ACTION_PROMPTS[id] === value;
  return false;
}
function shouldMigrateEditorStyleInstruction(id, value, previousVersion) {
  if (previousVersion >= 8) return false;
  return LEGACY_EDITOR_STYLE_INSTRUCTIONS[id] === value;
}
function normalizeText(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}
function normalizeOptionalText(value) {
  return typeof value === "string" ? value.trim() : "";
}
function normalizeComparablePath(value) {
  return normalizeOptionalText(value).replace(/^file:\/\//, "").replace(/\\/g, "/").replace(/\/+$/, "");
}
function normalizePositiveInteger(value, fallback, min, max) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}
function normalizeEditorActionPerformanceNumber(value, fallback, legacyDefault, previousVersion, min, max) {
  if (previousVersion < 10 && Number(value) === legacyDefault) return fallback;
  return normalizePositiveInteger(value, fallback, min, max);
}
function normalizeEditorActionTimeoutMs(value, fallback, previousVersion) {
  const number = Number(value);
  if (previousVersion < 13 && (number === 9e4 || number === 25e3)) return fallback;
  return normalizePositiveInteger(value, fallback, 1e4, 3e5);
}
function normalizeNonNegativeNumber(value) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return number;
}
function normalizeApiProviderSelection(settings) {
  const active = getActiveApiProvider(settings);
  if (active) return;
  const first = settings.apiProviders[0];
  settings.activeApiProviderId = first?.id ?? "";
  if (settings.providerMode === "custom-api" && !first) settings.providerMode = "codex-login";
}
function normalizeApiProviders(value) {
  if (!Array.isArray(value)) return [];
  const usedIds = /* @__PURE__ */ new Set();
  return value.map((item, index) => {
    const id = uniqueProviderId(sanitizeProviderId(item?.id, index), usedIds, index);
    usedIds.add(id);
    const queryParams = normalizeQueryParams(item?.queryParams);
    const models = normalizeModelList(Array.isArray(item?.models) ? [...item.models, item?.model] : [item?.model]);
    return {
      id,
      name: typeof item?.name === "string" ? item.name.trim() : "",
      baseUrl: typeof item?.baseUrl === "string" ? item.baseUrl.trim() : "",
      model: models[0] ?? "",
      models,
      apiKey: typeof item?.apiKey === "string" ? item.apiKey.trim() : "",
      ...Object.keys(queryParams).length ? { queryParams } : {}
    };
  });
}
function normalizeModelList(value) {
  const seen = /* @__PURE__ */ new Set();
  const models = [];
  for (const item of value) {
    const model = typeof item === "string" ? item.trim() : "";
    if (!model || seen.has(model)) continue;
    seen.add(model);
    models.push(model);
  }
  return models;
}
function sanitizeProviderId(value, index) {
  const id = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : `provider_${index + 1}`;
}
function uniqueProviderId(id, usedIds, index) {
  if (!usedIds.has(id)) return id;
  let next = `provider_${index + 1}`;
  let suffix = 2;
  while (usedIds.has(next)) {
    next = `provider_${index + 1}_${suffix}`;
    suffix += 1;
  }
  return next;
}
function normalizeQueryParams(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!/^[A-Za-z0-9_-]+$/.test(key)) continue;
    const stringValue = typeof raw === "string" ? raw.trim() : "";
    if (stringValue) result[key] = stringValue;
  }
  return result;
}
function normalizeBooleanMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result = {};
  for (const [key, enabled] of Object.entries(value)) {
    if (typeof key === "string" && key.trim() && typeof enabled === "boolean") result[key] = enabled;
  }
  return result;
}
function normalizeCacheEntry(value, normalizeItem) {
  if (!value || typeof value !== "object" || !Array.isArray(value.items)) return void 0;
  const items = value.items.map(normalizeItem).filter((item) => Boolean(item));
  const fetchedAt = typeof value.fetchedAt === "number" && Number.isFinite(value.fetchedAt) ? value.fetchedAt : Date.now();
  const error = typeof value.error === "string" && value.error.trim() ? value.error : "";
  return { fetchedAt, items, ...error ? { error } : {} };
}
function normalizeCachedPlugin(item) {
  const id = typeof item?.id === "string" ? item.id : "";
  if (!id) return null;
  return {
    id,
    name: typeof item?.name === "string" ? item.name : id,
    displayName: typeof item?.displayName === "string" ? item.displayName : id,
    description: typeof item?.description === "string" ? item.description : "",
    marketplace: typeof item?.marketplace === "string" ? item.marketplace : "",
    category: typeof item?.category === "string" ? item.category : "",
    installed: item?.installed !== false,
    enabled: item?.enabled !== false
  };
}
function normalizeCachedSkill(item) {
  const name = typeof item?.name === "string" ? item.name : "";
  const path21 = typeof item?.path === "string" ? item.path : "";
  if (!name || !path21) return null;
  return {
    name,
    path: path21,
    description: typeof item?.description === "string" ? item.description : "",
    scope: typeof item?.scope === "string" ? item.scope : "",
    enabled: item?.enabled !== false
  };
}
function normalizeCachedMcp(item) {
  const name = typeof item?.name === "string" ? item.name : "";
  if (!name) return null;
  return {
    name,
    tools: item?.tools && typeof item.tools === "object" && !Array.isArray(item.tools) ? item.tools : {},
    resources: Array.isArray(item?.resources) ? item.resources : [],
    resourceTemplates: Array.isArray(item?.resourceTemplates) ? item.resourceTemplates : [],
    authStatus: typeof item?.authStatus === "string" ? item.authStatus : "unknown"
  };
}

// src/settings/settings-tab.ts
var import_obsidian2 = require("obsidian");

// src/core/opencode-backend.ts
var import_child_process = require("child_process");
var http = __toESM(require("node:http"));
var https = __toESM(require("node:https"));

// node_modules/@opencode-ai/sdk/dist/v2/gen/core/serverSentEvents.gen.js
var createSseClient = ({ onRequest, onSseError, onSseEvent, responseTransformer, responseValidator, sseDefaultRetryDelay, sseMaxRetryAttempts, sseMaxRetryDelay, sseSleepFn, url, ...options }) => {
  let lastEventId;
  const sleep = sseSleepFn ?? ((ms) => new Promise((resolve5) => setTimeout(resolve5, ms)));
  const createStream = async function* () {
    let retryDelay = sseDefaultRetryDelay ?? 3e3;
    let attempt = 0;
    const signal = options.signal ?? new AbortController().signal;
    while (true) {
      if (signal.aborted)
        break;
      attempt++;
      const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
      if (lastEventId !== void 0) {
        headers.set("Last-Event-ID", lastEventId);
      }
      try {
        const requestInit = {
          redirect: "follow",
          ...options,
          body: options.serializedBody,
          headers,
          signal
        };
        let request = new Request(url, requestInit);
        if (onRequest) {
          request = await onRequest(url, requestInit);
        }
        const _fetch = options.fetch ?? globalThis.fetch;
        const response = await _fetch(request);
        if (!response.ok)
          throw new Error(`SSE failed: ${response.status} ${response.statusText}`);
        if (!response.body)
          throw new Error("No body in SSE response");
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        const abortHandler = () => {
          try {
            reader.cancel();
          } catch {
          }
        };
        signal.addEventListener("abort", abortHandler);
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done)
              break;
            buffer += value;
            buffer = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";
            for (const chunk of chunks) {
              const lines = chunk.split("\n");
              const dataLines = [];
              let eventName;
              for (const line of lines) {
                if (line.startsWith("data:")) {
                  dataLines.push(line.replace(/^data:\s*/, ""));
                } else if (line.startsWith("event:")) {
                  eventName = line.replace(/^event:\s*/, "");
                } else if (line.startsWith("id:")) {
                  lastEventId = line.replace(/^id:\s*/, "");
                } else if (line.startsWith("retry:")) {
                  const parsed = Number.parseInt(line.replace(/^retry:\s*/, ""), 10);
                  if (!Number.isNaN(parsed)) {
                    retryDelay = parsed;
                  }
                }
              }
              let data;
              let parsedJson = false;
              if (dataLines.length) {
                const rawData = dataLines.join("\n");
                try {
                  data = JSON.parse(rawData);
                  parsedJson = true;
                } catch {
                  data = rawData;
                }
              }
              if (parsedJson) {
                if (responseValidator) {
                  await responseValidator(data);
                }
                if (responseTransformer) {
                  data = await responseTransformer(data);
                }
              }
              onSseEvent?.({
                data,
                event: eventName,
                id: lastEventId,
                retry: retryDelay
              });
              if (dataLines.length) {
                yield data;
              }
            }
          }
        } finally {
          signal.removeEventListener("abort", abortHandler);
          reader.releaseLock();
        }
        break;
      } catch (error) {
        onSseError?.(error);
        if (sseMaxRetryAttempts !== void 0 && attempt >= sseMaxRetryAttempts) {
          break;
        }
        const backoff = Math.min(retryDelay * 2 ** (attempt - 1), sseMaxRetryDelay ?? 3e4);
        await sleep(backoff);
      }
    }
  };
  const stream = createStream();
  return { stream };
};

// node_modules/@opencode-ai/sdk/dist/v2/gen/core/pathSerializer.gen.js
var separatorArrayExplode = (style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
};
var separatorArrayNoExplode = (style) => {
  switch (style) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
};
var separatorObjectExplode = (style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
};
var serializeArrayParam = ({ allowReserved, explode, name, style, value }) => {
  if (!explode) {
    const joinedValues2 = (allowReserved ? value : value.map((v) => encodeURIComponent(v))).join(separatorArrayNoExplode(style));
    switch (style) {
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      case "simple":
        return joinedValues2;
      default:
        return `${name}=${joinedValues2}`;
    }
  }
  const separator = separatorArrayExplode(style);
  const joinedValues = value.map((v) => {
    if (style === "label" || style === "simple") {
      return allowReserved ? v : encodeURIComponent(v);
    }
    return serializePrimitiveParam({
      allowReserved,
      name,
      value: v
    });
  }).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};
var serializePrimitiveParam = ({ allowReserved, name, value }) => {
  if (value === void 0 || value === null) {
    return "";
  }
  if (typeof value === "object") {
    throw new Error("Deeply-nested arrays/objects aren\u2019t supported. Provide your own `querySerializer()` to handle these.");
  }
  return `${name}=${allowReserved ? value : encodeURIComponent(value)}`;
};
var serializeObjectParam = ({ allowReserved, explode, name, style, value, valueOnly }) => {
  if (value instanceof Date) {
    return valueOnly ? value.toISOString() : `${name}=${value.toISOString()}`;
  }
  if (style !== "deepObject" && !explode) {
    let values = [];
    Object.entries(value).forEach(([key, v]) => {
      values = [...values, key, allowReserved ? v : encodeURIComponent(v)];
    });
    const joinedValues2 = values.join(",");
    switch (style) {
      case "form":
        return `${name}=${joinedValues2}`;
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      default:
        return joinedValues2;
    }
  }
  const separator = separatorObjectExplode(style);
  const joinedValues = Object.entries(value).map(([key, v]) => serializePrimitiveParam({
    allowReserved,
    name: style === "deepObject" ? `${name}[${key}]` : key,
    value: v
  })).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};

// node_modules/@opencode-ai/sdk/dist/v2/gen/core/utils.gen.js
var PATH_PARAM_RE = /\{[^{}]+\}/g;
var defaultPathSerializer = ({ path: path21, url: _url }) => {
  let url = _url;
  const matches = _url.match(PATH_PARAM_RE);
  if (matches) {
    for (const match of matches) {
      let explode = false;
      let name = match.substring(1, match.length - 1);
      let style = "simple";
      if (name.endsWith("*")) {
        explode = true;
        name = name.substring(0, name.length - 1);
      }
      if (name.startsWith(".")) {
        name = name.substring(1);
        style = "label";
      } else if (name.startsWith(";")) {
        name = name.substring(1);
        style = "matrix";
      }
      const value = path21[name];
      if (value === void 0 || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        url = url.replace(match, serializeArrayParam({ explode, name, style, value }));
        continue;
      }
      if (typeof value === "object") {
        url = url.replace(match, serializeObjectParam({
          explode,
          name,
          style,
          value,
          valueOnly: true
        }));
        continue;
      }
      if (style === "matrix") {
        url = url.replace(match, `;${serializePrimitiveParam({
          name,
          value
        })}`);
        continue;
      }
      const replaceValue = encodeURIComponent(style === "label" ? `.${value}` : value);
      url = url.replace(match, replaceValue);
    }
  }
  return url;
};
var getUrl = ({ baseUrl, path: path21, query, querySerializer, url: _url }) => {
  const pathUrl = _url.startsWith("/") ? _url : `/${_url}`;
  let url = (baseUrl ?? "") + pathUrl;
  if (path21) {
    url = defaultPathSerializer({ path: path21, url });
  }
  let search = query ? querySerializer(query) : "";
  if (search.startsWith("?")) {
    search = search.substring(1);
  }
  if (search) {
    url += `?${search}`;
  }
  return url;
};
function getValidRequestBody(options) {
  const hasBody = options.body !== void 0;
  const isSerializedBody = hasBody && options.bodySerializer;
  if (isSerializedBody) {
    if ("serializedBody" in options) {
      const hasSerializedBody = options.serializedBody !== void 0 && options.serializedBody !== "";
      return hasSerializedBody ? options.serializedBody : null;
    }
    return options.body !== "" ? options.body : null;
  }
  if (hasBody) {
    return options.body;
  }
  return void 0;
}

// node_modules/@opencode-ai/sdk/dist/v2/gen/core/auth.gen.js
var getAuthToken = async (auth, callback) => {
  const token = typeof callback === "function" ? await callback(auth) : callback;
  if (!token) {
    return;
  }
  if (auth.scheme === "bearer") {
    return `Bearer ${token}`;
  }
  if (auth.scheme === "basic") {
    return `Basic ${btoa(token)}`;
  }
  return token;
};

// node_modules/@opencode-ai/sdk/dist/v2/gen/core/bodySerializer.gen.js
var jsonBodySerializer = {
  bodySerializer: (body) => JSON.stringify(body, (_key, value) => typeof value === "bigint" ? value.toString() : value)
};

// node_modules/@opencode-ai/sdk/dist/v2/gen/client/utils.gen.js
var createQuerySerializer = ({ parameters = {}, ...args } = {}) => {
  const querySerializer = (queryParams) => {
    const search = [];
    if (queryParams && typeof queryParams === "object") {
      for (const name in queryParams) {
        const value = queryParams[name];
        if (value === void 0 || value === null) {
          continue;
        }
        const options = parameters[name] || args;
        if (Array.isArray(value)) {
          const serializedArray = serializeArrayParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "form",
            value,
            ...options.array
          });
          if (serializedArray)
            search.push(serializedArray);
        } else if (typeof value === "object") {
          const serializedObject = serializeObjectParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "deepObject",
            value,
            ...options.object
          });
          if (serializedObject)
            search.push(serializedObject);
        } else {
          const serializedPrimitive = serializePrimitiveParam({
            allowReserved: options.allowReserved,
            name,
            value
          });
          if (serializedPrimitive)
            search.push(serializedPrimitive);
        }
      }
    }
    return search.join("&");
  };
  return querySerializer;
};
var getParseAs = (contentType) => {
  if (!contentType) {
    return "stream";
  }
  const cleanContent = contentType.split(";")[0]?.trim();
  if (!cleanContent) {
    return;
  }
  if (cleanContent.startsWith("application/json") || cleanContent.endsWith("+json")) {
    return "json";
  }
  if (cleanContent === "multipart/form-data") {
    return "formData";
  }
  if (["application/", "audio/", "image/", "video/"].some((type) => cleanContent.startsWith(type))) {
    return "blob";
  }
  if (cleanContent.startsWith("text/")) {
    return "text";
  }
  return;
};
var checkForExistence = (options, name) => {
  if (!name) {
    return false;
  }
  if (options.headers.has(name) || options.query?.[name] || options.headers.get("Cookie")?.includes(`${name}=`)) {
    return true;
  }
  return false;
};
var setAuthParams = async ({ security, ...options }) => {
  for (const auth of security) {
    if (checkForExistence(options, auth.name)) {
      continue;
    }
    const token = await getAuthToken(auth, options.auth);
    if (!token) {
      continue;
    }
    const name = auth.name ?? "Authorization";
    switch (auth.in) {
      case "query":
        if (!options.query) {
          options.query = {};
        }
        options.query[name] = token;
        break;
      case "cookie":
        options.headers.append("Cookie", `${name}=${token}`);
        break;
      case "header":
      default:
        options.headers.set(name, token);
        break;
    }
  }
};
var buildUrl = (options) => getUrl({
  baseUrl: options.baseUrl,
  path: options.path,
  query: options.query,
  querySerializer: typeof options.querySerializer === "function" ? options.querySerializer : createQuerySerializer(options.querySerializer),
  url: options.url
});
var mergeConfigs = (a, b) => {
  const config = { ...a, ...b };
  if (config.baseUrl?.endsWith("/")) {
    config.baseUrl = config.baseUrl.substring(0, config.baseUrl.length - 1);
  }
  config.headers = mergeHeaders(a.headers, b.headers);
  return config;
};
var headersEntries = (headers) => {
  const entries = [];
  headers.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
};
var mergeHeaders = (...headers) => {
  const mergedHeaders = new Headers();
  for (const header of headers) {
    if (!header) {
      continue;
    }
    const iterator = header instanceof Headers ? headersEntries(header) : Object.entries(header);
    for (const [key, value] of iterator) {
      if (value === null) {
        mergedHeaders.delete(key);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          mergedHeaders.append(key, v);
        }
      } else if (value !== void 0) {
        mergedHeaders.set(key, typeof value === "object" ? JSON.stringify(value) : value);
      }
    }
  }
  return mergedHeaders;
};
var Interceptors = class {
  fns = [];
  clear() {
    this.fns = [];
  }
  eject(id) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = null;
    }
  }
  exists(id) {
    const index = this.getInterceptorIndex(id);
    return Boolean(this.fns[index]);
  }
  getInterceptorIndex(id) {
    if (typeof id === "number") {
      return this.fns[id] ? id : -1;
    }
    return this.fns.indexOf(id);
  }
  update(id, fn) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = fn;
      return id;
    }
    return false;
  }
  use(fn) {
    this.fns.push(fn);
    return this.fns.length - 1;
  }
};
var createInterceptors = () => ({
  error: new Interceptors(),
  request: new Interceptors(),
  response: new Interceptors()
});
var defaultQuerySerializer = createQuerySerializer({
  allowReserved: false,
  array: {
    explode: true,
    style: "form"
  },
  object: {
    explode: true,
    style: "deepObject"
  }
});
var defaultHeaders = {
  "Content-Type": "application/json"
};
var createConfig = (override = {}) => ({
  ...jsonBodySerializer,
  headers: defaultHeaders,
  parseAs: "auto",
  querySerializer: defaultQuerySerializer,
  ...override
});

// node_modules/@opencode-ai/sdk/dist/v2/gen/client/client.gen.js
var createClient = (config = {}) => {
  let _config = mergeConfigs(createConfig(), config);
  const getConfig = () => ({ ..._config });
  const setConfig = (config2) => {
    _config = mergeConfigs(_config, config2);
    return getConfig();
  };
  const interceptors = createInterceptors();
  const beforeRequest = async (options) => {
    const opts = {
      ..._config,
      ...options,
      fetch: options.fetch ?? _config.fetch ?? globalThis.fetch,
      headers: mergeHeaders(_config.headers, options.headers),
      serializedBody: void 0
    };
    if (opts.security) {
      await setAuthParams({
        ...opts,
        security: opts.security
      });
    }
    if (opts.requestValidator) {
      await opts.requestValidator(opts);
    }
    if (opts.body !== void 0 && opts.bodySerializer) {
      opts.serializedBody = opts.bodySerializer(opts.body);
    }
    if (opts.body === void 0 || opts.serializedBody === "") {
      opts.headers.delete("Content-Type");
    }
    const url = buildUrl(opts);
    return { opts, url };
  };
  const request = async (options) => {
    const { opts, url } = await beforeRequest(options);
    const requestInit = {
      redirect: "follow",
      ...opts,
      body: getValidRequestBody(opts)
    };
    let request2 = new Request(url, requestInit);
    for (const fn of interceptors.request.fns) {
      if (fn) {
        request2 = await fn(request2, opts);
      }
    }
    const _fetch = opts.fetch;
    let response;
    try {
      response = await _fetch(request2);
    } catch (error2) {
      let finalError2 = error2;
      for (const fn of interceptors.error.fns) {
        if (fn) {
          finalError2 = await fn(error2, void 0, request2, opts);
        }
      }
      finalError2 = finalError2 || {};
      if (opts.throwOnError) {
        throw finalError2;
      }
      return opts.responseStyle === "data" ? void 0 : {
        error: finalError2,
        request: request2,
        response: void 0
      };
    }
    for (const fn of interceptors.response.fns) {
      if (fn) {
        response = await fn(response, request2, opts);
      }
    }
    const result = {
      request: request2,
      response
    };
    if (response.ok) {
      const parseAs = (opts.parseAs === "auto" ? getParseAs(response.headers.get("Content-Type")) : opts.parseAs) ?? "json";
      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        let emptyData;
        switch (parseAs) {
          case "arrayBuffer":
          case "blob":
          case "text":
            emptyData = await response[parseAs]();
            break;
          case "formData":
            emptyData = new FormData();
            break;
          case "stream":
            emptyData = response.body;
            break;
          case "json":
          default:
            emptyData = {};
            break;
        }
        return opts.responseStyle === "data" ? emptyData : {
          data: emptyData,
          ...result
        };
      }
      let data;
      switch (parseAs) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "text":
          data = await response[parseAs]();
          break;
        case "json": {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
          break;
        }
        case "stream":
          return opts.responseStyle === "data" ? response.body : {
            data: response.body,
            ...result
          };
      }
      if (parseAs === "json") {
        if (opts.responseValidator) {
          await opts.responseValidator(data);
        }
        if (opts.responseTransformer) {
          data = await opts.responseTransformer(data);
        }
      }
      return opts.responseStyle === "data" ? data : {
        data,
        ...result
      };
    }
    const textError = await response.text();
    let jsonError;
    try {
      jsonError = JSON.parse(textError);
    } catch {
    }
    const error = jsonError ?? textError;
    let finalError = error;
    for (const fn of interceptors.error.fns) {
      if (fn) {
        finalError = await fn(error, response, request2, opts);
      }
    }
    finalError = finalError || {};
    if (opts.throwOnError) {
      throw finalError;
    }
    return opts.responseStyle === "data" ? void 0 : {
      error: finalError,
      ...result
    };
  };
  const makeMethodFn = (method) => (options) => request({ ...options, method });
  const makeSseFn = (method) => async (options) => {
    const { opts, url } = await beforeRequest(options);
    return createSseClient({
      ...opts,
      body: opts.body,
      headers: opts.headers,
      method,
      onRequest: async (url2, init) => {
        let request2 = new Request(url2, init);
        for (const fn of interceptors.request.fns) {
          if (fn) {
            request2 = await fn(request2, opts);
          }
        }
        return request2;
      },
      serializedBody: getValidRequestBody(opts),
      url
    });
  };
  return {
    buildUrl,
    connect: makeMethodFn("CONNECT"),
    delete: makeMethodFn("DELETE"),
    get: makeMethodFn("GET"),
    getConfig,
    head: makeMethodFn("HEAD"),
    interceptors,
    options: makeMethodFn("OPTIONS"),
    patch: makeMethodFn("PATCH"),
    post: makeMethodFn("POST"),
    put: makeMethodFn("PUT"),
    request,
    setConfig,
    sse: {
      connect: makeSseFn("CONNECT"),
      delete: makeSseFn("DELETE"),
      get: makeSseFn("GET"),
      head: makeSseFn("HEAD"),
      options: makeSseFn("OPTIONS"),
      patch: makeSseFn("PATCH"),
      post: makeSseFn("POST"),
      put: makeSseFn("PUT"),
      trace: makeSseFn("TRACE")
    },
    trace: makeMethodFn("TRACE")
  };
};

// node_modules/@opencode-ai/sdk/dist/v2/gen/core/params.gen.js
var extraPrefixesMap = {
  $body_: "body",
  $headers_: "headers",
  $path_: "path",
  $query_: "query"
};
var extraPrefixes = Object.entries(extraPrefixesMap);
var buildKeyMap = (fields, map) => {
  if (!map) {
    map = /* @__PURE__ */ new Map();
  }
  for (const config of fields) {
    if ("in" in config) {
      if (config.key) {
        map.set(config.key, {
          in: config.in,
          map: config.map
        });
      }
    } else if ("key" in config) {
      map.set(config.key, {
        map: config.map
      });
    } else if (config.args) {
      buildKeyMap(config.args, map);
    }
  }
  return map;
};
var stripEmptySlots = (params) => {
  for (const [slot, value] of Object.entries(params)) {
    if (value && typeof value === "object" && !Object.keys(value).length) {
      delete params[slot];
    }
  }
};
var buildClientParams = (args, fields) => {
  const params = {
    body: {},
    headers: {},
    path: {},
    query: {}
  };
  const map = buildKeyMap(fields);
  let config;
  for (const [index, arg] of args.entries()) {
    if (fields[index]) {
      config = fields[index];
    }
    if (!config) {
      continue;
    }
    if ("in" in config) {
      if (config.key) {
        const field = map.get(config.key);
        const name = field.map || config.key;
        if (field.in) {
          ;
          params[field.in][name] = arg;
        }
      } else {
        params.body = arg;
      }
    } else {
      for (const [key, value] of Object.entries(arg ?? {})) {
        const field = map.get(key);
        if (field) {
          if (field.in) {
            const name = field.map || key;
            params[field.in][name] = value;
          } else {
            params[field.map] = value;
          }
        } else {
          const extra = extraPrefixes.find(([prefix]) => key.startsWith(prefix));
          if (extra) {
            const [prefix, slot] = extra;
            params[slot][key.slice(prefix.length)] = value;
          } else if ("allowExtra" in config && config.allowExtra) {
            for (const [slot, allowed] of Object.entries(config.allowExtra)) {
              if (allowed) {
                ;
                params[slot][key] = value;
                break;
              }
            }
          }
        }
      }
    }
  }
  stripEmptySlots(params);
  return params;
};

// node_modules/@opencode-ai/sdk/dist/v2/gen/client.gen.js
var client = createClient(createConfig({ baseUrl: "http://localhost:4096" }));

// node_modules/@opencode-ai/sdk/dist/v2/gen/sdk.gen.js
var HeyApiClient = class {
  client;
  constructor(args) {
    this.client = args?.client ?? client;
  }
};
var HeyApiRegistry = class {
  defaultKey = "default";
  instances = /* @__PURE__ */ new Map();
  get(key) {
    const instance = this.instances.get(key ?? this.defaultKey);
    if (!instance) {
      throw new Error(`No SDK client found. Create one with "new OpencodeClient()" to fix this error.`);
    }
    return instance;
  }
  set(value, key) {
    this.instances.set(key ?? this.defaultKey, value);
  }
};
var Auth = class extends HeyApiClient {
  /**
   * Remove auth credentials
   *
   * Remove authentication credentials
   */
  remove(parameters, options) {
    const params = buildClientParams([parameters], [{ args: [{ in: "path", key: "providerID" }] }]);
    return (options?.client ?? this.client).delete({
      url: "/auth/{providerID}",
      ...options,
      ...params
    });
  }
  /**
   * Set auth credentials
   *
   * Set authentication credentials
   */
  set(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "providerID" },
          { key: "auth", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).put({
      url: "/auth/{providerID}",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var App = class extends HeyApiClient {
  /**
   * Write log
   *
   * Write a log entry to the server logs with specified level and metadata.
   */
  log(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "service" },
          { in: "body", key: "level" },
          { in: "body", key: "message" },
          { in: "body", key: "extra" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/log",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * List agents
   *
   * Get a list of all available AI agents in the OpenCode system.
   */
  agents(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/agent",
      ...options,
      ...params
    });
  }
  /**
   * List skills
   *
   * Get a list of all available skills in the OpenCode system.
   */
  skills(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/skill",
      ...options,
      ...params
    });
  }
};
var Config = class extends HeyApiClient {
  /**
   * Get global configuration
   *
   * Retrieve the current global OpenCode configuration settings and preferences.
   */
  get(options) {
    return (options?.client ?? this.client).get({
      url: "/global/config",
      ...options
    });
  }
  /**
   * Update global configuration
   *
   * Update global OpenCode configuration settings and preferences.
   */
  update(parameters, options) {
    const params = buildClientParams([parameters], [{ args: [{ key: "config", map: "body" }] }]);
    return (options?.client ?? this.client).patch({
      url: "/global/config",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Global = class extends HeyApiClient {
  /**
   * Get health
   *
   * Get health information about the OpenCode server.
   */
  health(options) {
    return (options?.client ?? this.client).get({
      url: "/global/health",
      ...options
    });
  }
  /**
   * Get global events
   *
   * Subscribe to global events from the OpenCode system using server-sent events.
   */
  event(options) {
    return (options?.client ?? this.client).sse.get({
      url: "/global/event",
      ...options
    });
  }
  /**
   * Dispose instance
   *
   * Clean up and dispose all OpenCode instances, releasing all resources.
   */
  dispose(options) {
    return (options?.client ?? this.client).post({
      url: "/global/dispose",
      ...options
    });
  }
  /**
   * Upgrade opencode
   *
   * Upgrade opencode to the specified version or latest if not specified.
   */
  upgrade(parameters, options) {
    const params = buildClientParams([parameters], [{ args: [{ in: "body", key: "target" }] }]);
    return (options?.client ?? this.client).post({
      url: "/global/upgrade",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  _config;
  get config() {
    return this._config ??= new Config({ client: this.client });
  }
};
var Event = class extends HeyApiClient {
  /**
   * Subscribe to events
   *
   * Get events
   */
  subscribe(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).sse.get({
      url: "/event",
      ...options,
      ...params
    });
  }
};
var Config2 = class extends HeyApiClient {
  /**
   * Get configuration
   *
   * Retrieve the current OpenCode configuration settings and preferences.
   */
  get(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/config",
      ...options,
      ...params
    });
  }
  /**
   * Update configuration
   *
   * Update OpenCode configuration settings and preferences.
   */
  update(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "config", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).patch({
      url: "/config",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * List config providers
   *
   * Get a list of all configured AI providers and their default models.
   */
  providers(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/config/providers",
      ...options,
      ...params
    });
  }
};
var Console = class extends HeyApiClient {
  /**
   * Get active Console provider metadata
   *
   * Get the active Console org name and the set of provider IDs managed by that Console org.
   */
  get(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/console",
      ...options,
      ...params
    });
  }
  /**
   * List switchable Console orgs
   *
   * Get the available Console orgs across logged-in accounts, including the current active org.
   */
  listOrgs(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/console/orgs",
      ...options,
      ...params
    });
  }
  /**
   * Switch active Console org
   *
   * Persist a new active Console account/org selection for the current local OpenCode state.
   */
  switchOrg(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "accountID" },
          { in: "body", key: "orgID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/experimental/console/switch",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Session = class extends HeyApiClient {
  /**
   * List sessions
   *
   * Get a list of all OpenCode sessions across projects, sorted by most recently updated. Archived sessions are excluded by default.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "roots" },
          { in: "query", key: "start" },
          { in: "query", key: "cursor" },
          { in: "query", key: "search" },
          { in: "query", key: "limit" },
          { in: "query", key: "archived" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/session",
      ...options,
      ...params
    });
  }
};
var Resource = class extends HeyApiClient {
  /**
   * Get MCP resources
   *
   * Get all available MCP resources from connected servers. Optionally filter by name.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/resource",
      ...options,
      ...params
    });
  }
};
var Adapter = class extends HeyApiClient {
  /**
   * List workspace adapters
   *
   * List all available workspace adapters for the current project.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/workspace/adapter",
      ...options,
      ...params
    });
  }
};
var Workspace = class extends HeyApiClient {
  /**
   * List workspaces
   *
   * List all workspaces.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/workspace",
      ...options,
      ...params
    });
  }
  /**
   * Create workspace
   *
   * Create a workspace for the current project.
   */
  create(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "id" },
          { in: "body", key: "type" },
          { in: "body", key: "branch" },
          { in: "body", key: "extra" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/experimental/workspace",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Sync workspace list
   *
   * Register missing workspaces returned by workspace adapters.
   */
  syncList(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/experimental/workspace/sync-list",
      ...options,
      ...params
    });
  }
  /**
   * Workspace status
   *
   * Get connection status for workspaces in the current project.
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/workspace/status",
      ...options,
      ...params
    });
  }
  /**
   * Remove workspace
   *
   * Remove an existing workspace.
   */
  remove(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "id" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/experimental/workspace/{id}",
      ...options,
      ...params
    });
  }
  /**
   * Warp session into workspace
   *
   * Move a session's sync history into the target workspace, or detach it to the local project.
   */
  warp(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "id" },
          { in: "body", key: "sessionID" },
          { in: "body", key: "copyChanges" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/experimental/workspace/warp",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  _adapter;
  get adapter() {
    return this._adapter ??= new Adapter({ client: this.client });
  }
};
var Experimental = class extends HeyApiClient {
  _console;
  get console() {
    return this._console ??= new Console({ client: this.client });
  }
  _session;
  get session() {
    return this._session ??= new Session({ client: this.client });
  }
  _resource;
  get resource() {
    return this._resource ??= new Resource({ client: this.client });
  }
  _workspace;
  get workspace() {
    return this._workspace ??= new Workspace({ client: this.client });
  }
};
var Tool = class extends HeyApiClient {
  /**
   * List tools
   *
   * Get a list of available tools with their JSON schema parameters for a specific provider and model combination.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "provider" },
          { in: "query", key: "model" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/tool",
      ...options,
      ...params
    });
  }
  /**
   * List tool IDs
   *
   * Get a list of all available tool IDs, including both built-in tools and dynamically registered tools.
   */
  ids(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/tool/ids",
      ...options,
      ...params
    });
  }
};
var Worktree = class extends HeyApiClient {
  /**
   * Remove worktree
   *
   * Remove a git worktree and delete its branch.
   */
  remove(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "worktreeRemoveInput", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/experimental/worktree",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * List worktrees
   *
   * List all sandbox worktrees for the current project.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/experimental/worktree",
      ...options,
      ...params
    });
  }
  /**
   * Create worktree
   *
   * Create a new git worktree for the current project and run any configured startup scripts.
   */
  create(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "worktreeCreateInput", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/experimental/worktree",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Reset worktree
   *
   * Reset a worktree branch to the primary default branch.
   */
  reset(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "worktreeResetInput", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/experimental/worktree/reset",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Find = class extends HeyApiClient {
  /**
   * Find text
   *
   * Search for text patterns across files in the project using ripgrep.
   */
  text(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "pattern" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/find",
      ...options,
      ...params
    });
  }
  /**
   * Find files
   *
   * Search for files or directories by name or pattern in the project directory.
   */
  files(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "query" },
          { in: "query", key: "dirs" },
          { in: "query", key: "type" },
          { in: "query", key: "limit" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/find/file",
      ...options,
      ...params
    });
  }
  /**
   * Find symbols
   *
   * Search for workspace symbols like functions, classes, and variables using LSP.
   */
  symbols(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "query" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/find/symbol",
      ...options,
      ...params
    });
  }
};
var File = class extends HeyApiClient {
  /**
   * List files
   *
   * List files and directories in a specified path.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "path" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/file",
      ...options,
      ...params
    });
  }
  /**
   * Read file
   *
   * Read the content of a specified file.
   */
  read(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "path" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/file/content",
      ...options,
      ...params
    });
  }
  /**
   * Get file status
   *
   * Get the git status of all files in the project.
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/file/status",
      ...options,
      ...params
    });
  }
};
var Instance = class extends HeyApiClient {
  /**
   * Dispose instance
   *
   * Clean up and dispose the current OpenCode instance, releasing all resources.
   */
  dispose(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/instance/dispose",
      ...options,
      ...params
    });
  }
};
var Path = class extends HeyApiClient {
  /**
   * Get paths
   *
   * Retrieve the current working directory and related path information for the OpenCode instance.
   */
  get(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/path",
      ...options,
      ...params
    });
  }
};
var Diff = class extends HeyApiClient {
  /**
   * Get raw VCS diff
   *
   * Retrieve a raw patch for current uncommitted changes.
   */
  raw(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/vcs/diff/raw",
      ...options,
      ...params
    });
  }
};
var Vcs = class extends HeyApiClient {
  /**
   * Get VCS info
   *
   * Retrieve version control system (VCS) information for the current project, such as git branch.
   */
  get(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/vcs",
      ...options,
      ...params
    });
  }
  /**
   * Get VCS status
   *
   * Retrieve changed files in the current working tree without patches.
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/vcs/status",
      ...options,
      ...params
    });
  }
  /**
   * Get VCS diff
   *
   * Retrieve the current git diff for the working tree or against the default branch.
   */
  diff(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "mode" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/vcs/diff",
      ...options,
      ...params
    });
  }
  /**
   * Apply VCS patch
   *
   * Apply a raw patch to the current working tree.
   */
  apply(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "patch" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/vcs/apply",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  _diff;
  get diff2() {
    return this._diff ??= new Diff({ client: this.client });
  }
};
var Command = class extends HeyApiClient {
  /**
   * List commands
   *
   * Get a list of all available commands in the OpenCode system.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/command",
      ...options,
      ...params
    });
  }
};
var Lsp = class extends HeyApiClient {
  /**
   * Get LSP status
   *
   * Get LSP server status
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/lsp",
      ...options,
      ...params
    });
  }
};
var Formatter = class extends HeyApiClient {
  /**
   * Get formatter status
   *
   * Get formatter status
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/formatter",
      ...options,
      ...params
    });
  }
};
var Auth2 = class extends HeyApiClient {
  /**
   * Remove MCP OAuth
   *
   * Remove OAuth credentials for an MCP server.
   */
  remove(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "name" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/mcp/{name}/auth",
      ...options,
      ...params
    });
  }
  /**
   * Start MCP OAuth
   *
   * Start OAuth authentication flow for a Model Context Protocol (MCP) server.
   */
  start(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "name" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/mcp/{name}/auth",
      ...options,
      ...params
    });
  }
  /**
   * Complete MCP OAuth
   *
   * Complete OAuth authentication for a Model Context Protocol (MCP) server using the authorization code.
   */
  callback(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "name" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "code" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/mcp/{name}/auth/callback",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Authenticate MCP OAuth
   *
   * Start OAuth flow and wait for callback (opens browser).
   */
  authenticate(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "name" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/mcp/{name}/auth/authenticate",
      ...options,
      ...params
    });
  }
};
var Mcp = class extends HeyApiClient {
  /**
   * Get MCP status
   *
   * Get the status of all Model Context Protocol (MCP) servers.
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/mcp",
      ...options,
      ...params
    });
  }
  /**
   * Add MCP server
   *
   * Dynamically add a new Model Context Protocol (MCP) server to the system.
   */
  add(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "name" },
          { in: "body", key: "config" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/mcp",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Connect an MCP server.
   */
  connect(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "name" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/mcp/{name}/connect",
      ...options,
      ...params
    });
  }
  /**
   * Disconnect an MCP server.
   */
  disconnect(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "name" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/mcp/{name}/disconnect",
      ...options,
      ...params
    });
  }
  _auth;
  get auth() {
    return this._auth ??= new Auth2({ client: this.client });
  }
};
var Project = class extends HeyApiClient {
  /**
   * List all projects
   *
   * Get a list of projects that have been opened with OpenCode.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/project",
      ...options,
      ...params
    });
  }
  /**
   * Get current project
   *
   * Retrieve the currently active project that OpenCode is working with.
   */
  current(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/project/current",
      ...options,
      ...params
    });
  }
  /**
   * Initialize git repository
   *
   * Create a git repository for the current project and return the refreshed project info.
   */
  initGit(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/project/git/init",
      ...options,
      ...params
    });
  }
  /**
   * Update project
   *
   * Update project properties such as name, icon, and commands.
   */
  update(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "projectID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "name" },
          { in: "body", key: "icon" },
          { in: "body", key: "commands" }
        ]
      }
    ]);
    return (options?.client ?? this.client).patch({
      url: "/project/{projectID}",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Pty = class extends HeyApiClient {
  /**
   * List available shells
   *
   * Get a list of available shells on the system.
   */
  shells(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/pty/shells",
      ...options,
      ...params
    });
  }
  /**
   * List PTY sessions
   *
   * Get a list of all active pseudo-terminal (PTY) sessions managed by OpenCode.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/pty",
      ...options,
      ...params
    });
  }
  /**
   * Create PTY session
   *
   * Create a new pseudo-terminal (PTY) session for running shell commands and processes.
   */
  create(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "command" },
          { in: "body", key: "args" },
          { in: "body", key: "cwd" },
          { in: "body", key: "title" },
          { in: "body", key: "env" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/pty",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Remove PTY session
   *
   * Remove and terminate a specific pseudo-terminal (PTY) session.
   */
  remove(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "ptyID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/pty/{ptyID}",
      ...options,
      ...params
    });
  }
  /**
   * Get PTY session
   *
   * Retrieve detailed information about a specific pseudo-terminal (PTY) session.
   */
  get(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "ptyID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/pty/{ptyID}",
      ...options,
      ...params
    });
  }
  /**
   * Update PTY session
   *
   * Update properties of an existing pseudo-terminal (PTY) session.
   */
  update(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "ptyID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "title" },
          { in: "body", key: "size" }
        ]
      }
    ]);
    return (options?.client ?? this.client).put({
      url: "/pty/{ptyID}",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Create PTY WebSocket token
   *
   * Create a short-lived ticket for opening a PTY WebSocket connection.
   */
  connectToken(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "ptyID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/pty/{ptyID}/connect-token",
      ...options,
      ...params
    });
  }
  /**
   * Connect to PTY session
   *
   * Establish a WebSocket connection to interact with a pseudo-terminal (PTY) session in real-time.
   */
  connect(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "ptyID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/pty/{ptyID}/connect",
      ...options,
      ...params
    });
  }
};
var Question = class extends HeyApiClient {
  /**
   * List pending questions
   *
   * Get all pending question requests across all sessions.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/question",
      ...options,
      ...params
    });
  }
  /**
   * Reply to question request
   *
   * Provide answers to a question request from the AI assistant.
   */
  reply(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "requestID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "answers" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/question/{requestID}/reply",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Reject question request
   *
   * Reject a question request from the AI assistant.
   */
  reject(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "requestID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/question/{requestID}/reject",
      ...options,
      ...params
    });
  }
};
var Permission = class extends HeyApiClient {
  /**
   * List pending permissions
   *
   * Get all pending permission requests across all sessions.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/permission",
      ...options,
      ...params
    });
  }
  /**
   * Respond to permission request
   *
   * Approve or deny a permission request from the AI assistant.
   */
  reply(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "requestID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "reply" },
          { in: "body", key: "message" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/permission/{requestID}/reply",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Respond to permission
   *
   * Approve or deny a permission request from the AI assistant.
   *
   * @deprecated
   */
  respond(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "path", key: "permissionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "response" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/permissions/{permissionID}",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Oauth = class extends HeyApiClient {
  /**
   * Start OAuth authorization
   *
   * Start the OAuth authorization flow for a provider.
   */
  authorize(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "providerID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "method" },
          { in: "body", key: "inputs" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/provider/{providerID}/oauth/authorize",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Handle OAuth callback
   *
   * Handle the OAuth callback from a provider after user authorization.
   */
  callback(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "providerID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "method" },
          { in: "body", key: "code" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/provider/{providerID}/oauth/callback",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Provider = class extends HeyApiClient {
  /**
   * List providers
   *
   * Get a list of all available AI providers, including both available and connected ones.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/provider",
      ...options,
      ...params
    });
  }
  /**
   * Get provider auth methods
   *
   * Retrieve available authentication methods for all AI providers.
   */
  auth(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/provider/auth",
      ...options,
      ...params
    });
  }
  _oauth;
  get oauth() {
    return this._oauth ??= new Oauth({ client: this.client });
  }
};
var Session2 = class extends HeyApiClient {
  /**
   * List sessions
   *
   * Get a list of all OpenCode sessions, sorted by most recently updated.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "scope" },
          { in: "query", key: "path" },
          { in: "query", key: "roots" },
          { in: "query", key: "start" },
          { in: "query", key: "search" },
          { in: "query", key: "limit" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session",
      ...options,
      ...params
    });
  }
  /**
   * Create session
   *
   * Create a new OpenCode session for interacting with AI assistants and managing conversations.
   */
  create(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "parentID" },
          { in: "body", key: "title" },
          { in: "body", key: "agent" },
          { in: "body", key: "model" },
          { in: "body", key: "permission" },
          { in: "body", key: "workspaceID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Get session status
   *
   * Retrieve the current status of all sessions, including active, idle, and completed states.
   */
  status(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/status",
      ...options,
      ...params
    });
  }
  /**
   * Delete session
   *
   * Delete a session and permanently remove all associated data, including messages and history.
   */
  delete(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/session/{sessionID}",
      ...options,
      ...params
    });
  }
  /**
   * Get session
   *
   * Retrieve detailed information about a specific OpenCode session.
   */
  get(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/{sessionID}",
      ...options,
      ...params
    });
  }
  /**
   * Update session
   *
   * Update properties of an existing session, such as title or other metadata.
   */
  update(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "title" },
          { in: "body", key: "permission" },
          { in: "body", key: "time" }
        ]
      }
    ]);
    return (options?.client ?? this.client).patch({
      url: "/session/{sessionID}",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Get session children
   *
   * Retrieve all child sessions that were forked from the specified parent session.
   */
  children(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/{sessionID}/children",
      ...options,
      ...params
    });
  }
  /**
   * Get session todos
   *
   * Retrieve the todo list associated with a specific session, showing tasks and action items.
   */
  todo(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/{sessionID}/todo",
      ...options,
      ...params
    });
  }
  /**
   * Get message diff
   *
   * Get the file changes (diff) that resulted from a specific user message in the session.
   */
  diff(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "messageID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/{sessionID}/diff",
      ...options,
      ...params
    });
  }
  /**
   * Get session messages
   *
   * Retrieve all messages in a session, including user prompts and AI responses.
   */
  messages(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "limit" },
          { in: "query", key: "before" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/{sessionID}/message",
      ...options,
      ...params
    });
  }
  /**
   * Send message
   *
   * Create and send a new message to a session, streaming the AI response.
   */
  prompt(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "messageID" },
          { in: "body", key: "model" },
          { in: "body", key: "agent" },
          { in: "body", key: "noReply" },
          { in: "body", key: "tools" },
          { in: "body", key: "format" },
          { in: "body", key: "system" },
          { in: "body", key: "variant" },
          { in: "body", key: "parts" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/message",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Delete message
   *
   * Permanently delete a specific message and all of its parts from a session without reverting file changes.
   */
  deleteMessage(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "path", key: "messageID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/session/{sessionID}/message/{messageID}",
      ...options,
      ...params
    });
  }
  /**
   * Get message
   *
   * Retrieve a specific message from a session by its message ID.
   */
  message(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "path", key: "messageID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/session/{sessionID}/message/{messageID}",
      ...options,
      ...params
    });
  }
  /**
   * Fork session
   *
   * Create a new session by forking an existing session at a specific message point.
   */
  fork(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "messageID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/fork",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Abort session
   *
   * Abort an active session and stop any ongoing AI processing or command execution.
   */
  abort(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/abort",
      ...options,
      ...params
    });
  }
  /**
   * Initialize session
   *
   * Analyze the current application and create an AGENTS.md file with project-specific agent configurations.
   */
  init(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "modelID" },
          { in: "body", key: "providerID" },
          { in: "body", key: "messageID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/init",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Unshare session
   *
   * Remove the shareable link for a session, making it private again.
   */
  unshare(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/session/{sessionID}/share",
      ...options,
      ...params
    });
  }
  /**
   * Share session
   *
   * Create a shareable link for a session, allowing others to view the conversation.
   */
  share(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/share",
      ...options,
      ...params
    });
  }
  /**
   * Summarize session
   *
   * Generate a concise summary of the session using AI compaction to preserve key information.
   */
  summarize(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "providerID" },
          { in: "body", key: "modelID" },
          { in: "body", key: "auto" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/summarize",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Send async message
   *
   * Create and send a new message to a session asynchronously, starting the session if needed and returning immediately.
   */
  promptAsync(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "messageID" },
          { in: "body", key: "model" },
          { in: "body", key: "agent" },
          { in: "body", key: "noReply" },
          { in: "body", key: "tools" },
          { in: "body", key: "format" },
          { in: "body", key: "system" },
          { in: "body", key: "variant" },
          { in: "body", key: "parts" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/prompt_async",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Send command
   *
   * Send a new command to a session for execution by the AI assistant.
   */
  command(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "messageID" },
          { in: "body", key: "agent" },
          { in: "body", key: "model" },
          { in: "body", key: "arguments" },
          { in: "body", key: "command" },
          { in: "body", key: "variant" },
          { in: "body", key: "parts" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/command",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Run shell command
   *
   * Execute a shell command within the session context and return the AI's response.
   */
  shell(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "messageID" },
          { in: "body", key: "agent" },
          { in: "body", key: "model" },
          { in: "body", key: "command" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/shell",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Revert message
   *
   * Revert a specific message in a session, undoing its effects and restoring the previous state.
   */
  revert(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "messageID" },
          { in: "body", key: "partID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/revert",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Restore reverted messages
   *
   * Restore all previously reverted messages in a session.
   */
  unrevert(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/session/{sessionID}/unrevert",
      ...options,
      ...params
    });
  }
};
var Part = class extends HeyApiClient {
  /**
   * Delete a part from a message.
   */
  delete(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "path", key: "messageID" },
          { in: "path", key: "partID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).delete({
      url: "/session/{sessionID}/message/{messageID}/part/{partID}",
      ...options,
      ...params
    });
  }
  /**
   * Update a part in a message.
   */
  update(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "path", key: "messageID" },
          { in: "path", key: "partID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "part", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).patch({
      url: "/session/{sessionID}/message/{messageID}/part/{partID}",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var History = class extends HeyApiClient {
  /**
   * List sync events
   *
   * List sync events for all aggregates. Keys are aggregate IDs the client already knows about, values are the last known sequence ID. Events with seq > value are returned for those aggregates. Aggregates not listed in the input get their full history.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "body", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/sync/history",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Sync = class extends HeyApiClient {
  /**
   * Start workspace sync
   *
   * Start sync loops for workspaces in the current project that have active sessions.
   */
  start(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/sync/start",
      ...options,
      ...params
    });
  }
  /**
   * Replay sync events
   *
   * Validate and replay a complete sync event history.
   */
  replay(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          {
            in: "query",
            key: "query_directory",
            map: "directory"
          },
          { in: "query", key: "workspace" },
          {
            in: "body",
            key: "body_directory",
            map: "directory"
          },
          { in: "body", key: "events" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/sync/replay",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Steal session into workspace
   *
   * Update a session to belong to the current workspace through the sync event system.
   */
  steal(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "sessionID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/sync/steal",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  _history;
  get history() {
    return this._history ??= new History({ client: this.client });
  }
};
var Session3 = class extends HeyApiClient {
  /**
   * List v2 sessions
   *
   * Retrieve sessions in the requested order. Items keep that order across pages; use cursor.next or cursor.previous to move through the ordered list.
   */
  list(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "limit" },
          { in: "query", key: "order" },
          { in: "query", key: "path" },
          { in: "query", key: "roots" },
          { in: "query", key: "start" },
          { in: "query", key: "search" },
          { in: "query", key: "cursor" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/api/session",
      ...options,
      ...params
    });
  }
  /**
   * Send v2 message
   *
   * Create a v2 session message and queue it for the agent loop.
   */
  prompt(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "prompt" },
          { in: "body", key: "delivery" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/api/session/{sessionID}/prompt",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Compact v2 session
   *
   * Compact a v2 session conversation.
   */
  compact(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/api/session/{sessionID}/compact",
      ...options,
      ...params
    });
  }
  /**
   * Wait for v2 session
   *
   * Wait for a v2 session agent loop to become idle.
   */
  wait(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/api/session/{sessionID}/wait",
      ...options,
      ...params
    });
  }
  /**
   * Get v2 session context
   *
   * Retrieve the active context messages for a v2 session (all messages after the last compaction).
   */
  context(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/api/session/{sessionID}/context",
      ...options,
      ...params
    });
  }
  /**
   * Get v2 session messages
   *
   * Retrieve projected v2 messages for a session. Items keep the requested order across pages; use cursor.next or cursor.previous to move through the ordered timeline.
   */
  messages(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "path", key: "sessionID" },
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "query", key: "limit" },
          { in: "query", key: "order" },
          { in: "query", key: "cursor" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/api/session/{sessionID}/message",
      ...options,
      ...params
    });
  }
};
var V2 = class extends HeyApiClient {
  _session;
  get session() {
    return this._session ??= new Session3({ client: this.client });
  }
};
var Control = class extends HeyApiClient {
  /**
   * Get next TUI request
   *
   * Retrieve the next TUI request from the queue for processing.
   */
  next(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).get({
      url: "/tui/control/next",
      ...options,
      ...params
    });
  }
  /**
   * Submit TUI response
   *
   * Submit a response to the TUI request queue to complete a pending request.
   */
  response(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "body", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/control/response",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
};
var Tui = class extends HeyApiClient {
  /**
   * Append TUI prompt
   *
   * Append prompt to the TUI.
   */
  appendPrompt(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "text" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/append-prompt",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Open help dialog
   *
   * Open the help dialog in the TUI to display user assistance information.
   */
  openHelp(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/open-help",
      ...options,
      ...params
    });
  }
  /**
   * Open sessions dialog
   *
   * Open the session dialog.
   */
  openSessions(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/open-sessions",
      ...options,
      ...params
    });
  }
  /**
   * Open themes dialog
   *
   * Open the theme dialog.
   */
  openThemes(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/open-themes",
      ...options,
      ...params
    });
  }
  /**
   * Open models dialog
   *
   * Open the model dialog.
   */
  openModels(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/open-models",
      ...options,
      ...params
    });
  }
  /**
   * Submit TUI prompt
   *
   * Submit the prompt.
   */
  submitPrompt(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/submit-prompt",
      ...options,
      ...params
    });
  }
  /**
   * Clear TUI prompt
   *
   * Clear the prompt.
   */
  clearPrompt(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/clear-prompt",
      ...options,
      ...params
    });
  }
  /**
   * Execute TUI command
   *
   * Execute a TUI command.
   */
  executeCommand(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "command" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/execute-command",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Show TUI toast
   *
   * Show a toast notification in the TUI.
   */
  showToast(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "title" },
          { in: "body", key: "message" },
          { in: "body", key: "variant" },
          { in: "body", key: "duration" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/show-toast",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Publish TUI event
   *
   * Publish a TUI event.
   */
  publish(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { key: "body", map: "body" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/publish",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  /**
   * Select session
   *
   * Navigate the TUI to display the specified session.
   */
  selectSession(parameters, options) {
    const params = buildClientParams([parameters], [
      {
        args: [
          { in: "query", key: "directory" },
          { in: "query", key: "workspace" },
          { in: "body", key: "sessionID" }
        ]
      }
    ]);
    return (options?.client ?? this.client).post({
      url: "/tui/select-session",
      ...options,
      ...params,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...params.headers
      }
    });
  }
  _control;
  get control() {
    return this._control ??= new Control({ client: this.client });
  }
};
var OpencodeClient = class _OpencodeClient extends HeyApiClient {
  static __registry = new HeyApiRegistry();
  constructor(args) {
    super(args);
    _OpencodeClient.__registry.set(this, args?.key);
  }
  _auth;
  get auth() {
    return this._auth ??= new Auth({ client: this.client });
  }
  _app;
  get app() {
    return this._app ??= new App({ client: this.client });
  }
  _global;
  get global() {
    return this._global ??= new Global({ client: this.client });
  }
  _event;
  get event() {
    return this._event ??= new Event({ client: this.client });
  }
  _config;
  get config() {
    return this._config ??= new Config2({ client: this.client });
  }
  _experimental;
  get experimental() {
    return this._experimental ??= new Experimental({ client: this.client });
  }
  _tool;
  get tool() {
    return this._tool ??= new Tool({ client: this.client });
  }
  _worktree;
  get worktree() {
    return this._worktree ??= new Worktree({ client: this.client });
  }
  _find;
  get find() {
    return this._find ??= new Find({ client: this.client });
  }
  _file;
  get file() {
    return this._file ??= new File({ client: this.client });
  }
  _instance;
  get instance() {
    return this._instance ??= new Instance({ client: this.client });
  }
  _path;
  get path() {
    return this._path ??= new Path({ client: this.client });
  }
  _vcs;
  get vcs() {
    return this._vcs ??= new Vcs({ client: this.client });
  }
  _command;
  get command() {
    return this._command ??= new Command({ client: this.client });
  }
  _lsp;
  get lsp() {
    return this._lsp ??= new Lsp({ client: this.client });
  }
  _formatter;
  get formatter() {
    return this._formatter ??= new Formatter({ client: this.client });
  }
  _mcp;
  get mcp() {
    return this._mcp ??= new Mcp({ client: this.client });
  }
  _project;
  get project() {
    return this._project ??= new Project({ client: this.client });
  }
  _pty;
  get pty() {
    return this._pty ??= new Pty({ client: this.client });
  }
  _question;
  get question() {
    return this._question ??= new Question({ client: this.client });
  }
  _permission;
  get permission() {
    return this._permission ??= new Permission({ client: this.client });
  }
  _provider;
  get provider() {
    return this._provider ??= new Provider({ client: this.client });
  }
  _session;
  get session() {
    return this._session ??= new Session2({ client: this.client });
  }
  _part;
  get part() {
    return this._part ??= new Part({ client: this.client });
  }
  _sync;
  get sync() {
    return this._sync ??= new Sync({ client: this.client });
  }
  _v2;
  get v2() {
    return this._v2 ??= new V2({ client: this.client });
  }
  _tui;
  get tui() {
    return this._tui ??= new Tui({ client: this.client });
  }
};

// node_modules/@opencode-ai/sdk/dist/error-interceptor.js
function wrapClientError(error, response, request, opts) {
  if (!opts?.throwOnError)
    return error;
  if (error instanceof Error)
    return error;
  if (typeof error === "object" && error !== null && Object.keys(error).length > 0) {
    const obj = error;
    const message = typeof obj.data?.message === "string" && obj.data.message || typeof obj.message === "string" && obj.message || typeof obj.name === "string" && obj.name || describe(request, response);
    return new Error(message, { cause: { body: error, status: response?.status } });
  }
  if (typeof error === "string" && error.length > 0) {
    return new Error(error, { cause: { body: error, status: response?.status } });
  }
  const reason = response ? "(empty response body)" : "network error (no response)";
  return new Error(`opencode server ${describe(request, response)}: ${reason}`, {
    cause: { body: error, status: response?.status }
  });
}
function describe(request, response) {
  const method = request?.method ?? "?";
  const url = request?.url ?? "?";
  const status = response?.status;
  const statusText = response?.statusText;
  return `${method} ${url}${status ? " \u2192 " + status : ""}${statusText ? " " + statusText : ""}`;
}

// node_modules/@opencode-ai/sdk/dist/v2/client.js
function pick(value, fallback, encode) {
  if (!value)
    return;
  if (!fallback)
    return value;
  if (value === fallback)
    return fallback;
  if (encode && value === encode(fallback))
    return fallback;
  return value;
}
function rewrite(request, values) {
  if (request.method !== "GET" && request.method !== "HEAD")
    return request;
  const url = new URL(request.url);
  let changed = false;
  for (const [name, key] of [
    ["x-opencode-directory", "directory"],
    ["x-opencode-workspace", "workspace"]
  ]) {
    const value = pick(request.headers.get(name), key === "directory" ? values.directory : values.workspace, key === "directory" ? encodeURIComponent : void 0);
    if (!value)
      continue;
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
    changed = true;
  }
  if (!changed)
    return request;
  const next = new Request(url, request);
  next.headers.delete("x-opencode-directory");
  next.headers.delete("x-opencode-workspace");
  return next;
}
function createOpencodeClient(config) {
  if (!config?.fetch) {
    const customFetch = (req) => {
      req.timeout = false;
      return fetch(req);
    };
    config = {
      ...config,
      fetch: customFetch
    };
  }
  if (config?.directory) {
    config.headers = {
      ...config.headers,
      "x-opencode-directory": encodeURIComponent(config.directory)
    };
  }
  if (config?.experimental_workspaceID) {
    config.headers = {
      ...config.headers,
      "x-opencode-workspace": config.experimental_workspaceID
    };
  }
  const client2 = createClient(config);
  client2.interceptors.request.use((request) => rewrite(request, {
    directory: config?.directory,
    workspace: config?.experimental_workspaceID
  }));
  client2.interceptors.response.use((response) => {
    const contentType = response.headers.get("content-type");
    if (contentType === "text/html")
      throw new Error("Request is not supported by this version of OpenCode Server (Server responded with text/html)");
    return response;
  });
  client2.interceptors.error.use(wrapClientError);
  return new OpencodeClient({ client: client2 });
}

// node_modules/@opencode-ai/sdk/dist/v2/server.js
var import_cross_spawn = __toESM(require_cross_spawn(), 1);

// node_modules/@opencode-ai/sdk/dist/process.js
var import_node_child_process = require("node:child_process");

// src/core/opencode-errors.ts
function formatOpenCodeError(error) {
  if (!error) return "\u672A\u77E5\u9519\u8BEF";
  if (typeof error === "string") return error;
  const message = typeof error?.message === "string" ? error.message : typeof error?.data?.message === "string" ? error.data.message : "";
  const code = firstOpenCodeString(error?.code, error?.data?.code, error?.status, error?.data?.status);
  const status = firstOpenCodeString(error?.status, error?.statusText, error?.data?.status, error?.data?.statusText);
  const details = [
    code ? `\u9519\u8BEF\u7801\uFF1A${code}` : "",
    status && status !== code ? `\u72B6\u6001\uFF1A${status}` : "",
    message ? `\u539F\u59CB\u6D88\u606F\uFF1A${message}` : "",
    `\u539F\u59CB\u9519\u8BEF\uFF1A${safeOpenCodeStringify(error)}`
  ].filter(Boolean);
  if (details.length) return details.join("\n");
  return safeOpenCodeStringify(error);
}
function firstOpenCodeString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}
function safeOpenCodeStringify(error) {
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

// src/core/opencode-models.ts
var fs = __toESM(require("fs"));
var os = __toESM(require("os"));
var path2 = __toESM(require("path"));
var import_node_url = require("node:url");
function detectOpenCodeCommand(customPath, options = {}) {
  const home = options.home ?? os.homedir();
  const exists7 = options.exists ?? ((candidate) => fs.existsSync(candidate));
  const custom = customPath.trim();
  if (custom) {
    const expanded = expandHome(custom, home);
    return exists7(expanded) ? expanded : null;
  }
  return openCodeCommandCandidates(
    home,
    options.envPath ?? process.env.PATH ?? "",
    options.platform ?? process.platform,
    options.appData ?? process.env.APPDATA ?? "",
    options.programData ?? process.env.ProgramData ?? "C:\\ProgramData"
  ).find((candidate) => exists7(candidate)) ?? null;
}
function resolveOpenCodeCommand(customPath, options = {}) {
  const command = detectOpenCodeCommand(customPath, options);
  if (command) return command;
  const expanded = customPath.trim() ? expandHome(customPath.trim(), options.home ?? os.homedir()) : "opencode";
  throw new Error(`\u627E\u4E0D\u5230 OpenCode CLI\uFF1A${expanded}\u3002\u8BF7\u5148\u5B89\u88C5 OpenCode\uFF0C\u6216\u5728\u8BBE\u7F6E\u91CC\u586B\u5199\u6B63\u786E\u8DEF\u5F84\u3002`);
}
function openCodeCommandCandidates(home, envPath, platform = process.platform, appData = process.env.APPDATA ?? "", programData = process.env.ProgramData ?? "C:\\ProgramData") {
  const windowsCandidates = platform === "win32" ? [
    appData ? path2.win32.join(appData, "npm", "opencode.cmd") : "",
    appData ? path2.win32.join(appData, "npm", "opencode.ps1") : "",
    path2.win32.join(home, "scoop", "shims", "opencode.cmd"),
    path2.win32.join(programData, "chocolatey", "bin", "opencode.exe")
  ].filter(Boolean) : [];
  return [
    path2.join(home, ".npm-global", "bin", "opencode"),
    path2.join(home, ".bun", "bin", "opencode"),
    path2.join(home, ".local", "bin", "opencode"),
    ...windowsCandidates,
    "/opt/homebrew/bin/opencode",
    "/usr/local/bin/opencode",
    ...String(envPath || "").split(path2.delimiter).filter(Boolean).map((part) => path2.join(part, "opencode"))
  ];
}
function normalizeOpenCodeServerUrl(serverUrl, hostname, port) {
  const explicit = serverUrl.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  return `http://${hostname || "127.0.0.1"}:${port || 4096}`;
}
function modelSupportsInput(model, modality) {
  if (!model) return modality === "text";
  return Boolean(model.capabilities?.input?.[modality]);
}
function modelInputModalities(model) {
  const modalities = [];
  if (modelSupportsInput(model, "text")) modalities.push("text");
  if (modelSupportsInput(model, "image")) modalities.push("image");
  if (modelSupportsInput(model, "pdf")) modalities.push("pdf");
  return modalities.length ? modalities : ["text"];
}
function flattenOpenCodeModels(providers) {
  const models = [];
  for (const provider of providers) {
    if (provider.configured === false) continue;
    for (const model of Object.values(provider.models ?? {})) {
      if (model.enabled === false) continue;
      models.push({
        id: `${provider.id}/${model.id}`,
        providerId: provider.id,
        modelId: model.id,
        displayName: `${provider.name || provider.id} \xB7 ${model.name || model.id}`,
        inputModalities: modelInputModalities(model)
      });
    }
  }
  return models.sort((left, right) => left.displayName.localeCompare(right.displayName));
}
function flattenOpenCodeAgents(agents) {
  const visibleAgents = agents.map((agent) => ({
    id: agent.name,
    name: agent.name,
    displayName: agent.name,
    description: agent.description,
    mode: agent.mode,
    native: agent.native,
    hidden: agent.hidden
  })).filter((agent) => agent.name && !agent.hidden);
  const runnableAgents = visibleAgents.filter((agent) => agent.mode !== "subagent");
  return (runnableAgents.length ? runnableAgents : visibleAgents).sort((left, right) => left.displayName.localeCompare(right.displayName));
}
function mimeForKnowledgeFile(filePath) {
  const ext = path2.extname(filePath).toLowerCase();
  if (ext === ".md" || ext === ".markdown") return "text/markdown";
  if (ext === ".txt") return "text/plain";
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}
function requiredModalityForMime(mime) {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "text";
}
function toOpenCodeFilePart(filePath, mime = mimeForKnowledgeFile(filePath)) {
  return {
    type: "file",
    mime,
    filename: path2.basename(filePath),
    url: (0, import_node_url.pathToFileURL)(filePath).href
  };
}
function ensureOpenCodeModelSupportsFiles(model, parts) {
  const missing = /* @__PURE__ */ new Set();
  for (const part of parts) {
    if (part.type !== "file") continue;
    const modality = requiredModalityForMime(part.mime);
    if (!model?.inputModalities.includes(modality)) missing.add(modality);
  }
  if (!missing.size) return;
  throw new Error(`\u5F53\u524D OpenCode \u6A21\u578B\u4E0D\u652F\u6301 ${Array.from(missing).join(" / ")} \u8F93\u5165\uFF0C\u8BF7\u5207\u6362\u652F\u6301\u591A\u6A21\u6001\u7684\u6A21\u578B\u3002`);
}
function toOpenCodePromptPart(part) {
  if (part.type === "text") return { type: "text", text: part.text };
  return toOpenCodeFilePart(part.path, part.mime);
}
function expandHome(value, home) {
  return value === "~" || value.startsWith("~/") ? path2.join(home, value.slice(2)) : value;
}

// src/core/opencode-backend.ts
var OPENCODE_START_TIMEOUT_MS = 8e3;
var OpenCodeBackend = class {
  constructor(options) {
    this.options = options;
  }
  kind = "opencode";
  client = null;
  startedServer = null;
  connectionInfo = {
    connected: false,
    serverUrl: "",
    command: "",
    version: "",
    errors: []
  };
  async connect() {
    await this.disconnect();
    const errors = [];
    let serverUrl = normalizeOpenCodeServerUrl(this.options.serverUrl, this.options.hostname, this.options.port);
    let command = "";
    let startedServer = null;
    if (!this.options.serverUrl.trim()) {
      command = resolveOpenCodeCommand(this.options.cliPath);
      const fallbackUrl = normalizeOpenCodeServerUrl("", this.options.hostname, this.options.port);
      let connected = false;
      try {
        this.client = createOpencodeClient({ baseUrl: fallbackUrl, directory: this.options.vaultPath, fetch: nodeFetch });
        await unwrapOpenCodeResult(this.client.global.health(), "OpenCode \u8FDE\u63A5\u5931\u8D25");
        serverUrl = fallbackUrl;
        connected = true;
      } catch (e) {
        this.client = null;
      }
      if (!connected && this.options.autoStart) {
        try {
          startedServer = await startOpenCodeServer({
            command,
            hostname: this.options.hostname,
            port: this.options.port,
            cwd: this.options.vaultPath
          });
          serverUrl = startedServer.url;
        } catch (startError) {
          console.warn(`Failed to start OpenCode server: ${startError}`);
          throw startError;
        }
      } else if (!connected) {
        throw new Error("OpenCode server is not running and auto-start is disabled");
      }
    }
    if (!this.client) {
      this.client = createOpencodeClient({ baseUrl: serverUrl, directory: this.options.vaultPath, fetch: nodeFetch });
    }
    const health = await unwrapOpenCodeResult(this.client.global.health(), "OpenCode \u8FDE\u63A5\u5931\u8D25");
    this.startedServer = startedServer;
    this.connectionInfo = {
      connected: true,
      serverUrl,
      command,
      version: health?.version ?? "",
      errors
    };
  }
  async disconnect() {
    if (this.startedServer) {
      stopOpenCodeServer(this.startedServer.process);
      this.startedServer = null;
    }
    this.client = null;
    this.connectionInfo = { ...this.connectionInfo, connected: false };
  }
  getConnectionInfo() {
    return this.connectionInfo;
  }
  async listModels() {
    const client2 = this.requireClient();
    const response = await unwrapOpenCodeResult(client2.provider.list({ directory: this.options.vaultPath }), "\u8BFB\u53D6 OpenCode \u6A21\u578B\u5931\u8D25");
    return flattenOpenCodeModels(response?.all ?? []);
  }
  async listProviders() {
    const client2 = this.requireClient();
    const response = await unwrapOpenCodeResult(client2.provider.list({ directory: this.options.vaultPath }), "\u8BFB\u53D6 OpenCode \u63D0\u4F9B\u5546\u5931\u8D25");
    return response?.all ?? [];
  }
  async listAgents() {
    const client2 = this.requireClient();
    const response = await unwrapOpenCodeResult(client2.app.agents({ directory: this.options.vaultPath }), "\u8BFB\u53D6 OpenCode Agent \u5931\u8D25");
    return flattenOpenCodeAgents(response ?? []);
  }
  async collectHistoryMessages(input) {
    const client2 = this.requireClient();
    const maxSessions = input.maxSessions ?? 100;
    const maxMessages = input.maxMessages ?? 80;
    const maxChars = input.maxChars ?? 6e4;
    const pageSize = 50;
    const candidates = [];
    let sessionsScanned = 0;
    let truncated = false;
    for (let start = 0; start < maxSessions; start += pageSize) {
      const limit = Math.min(pageSize, maxSessions - start);
      const page = await unwrapOpenCodeResult(client2.session.list({
        directory: this.options.vaultPath,
        start,
        limit
      }), "\u8BFB\u53D6 OpenCode \u4F1A\u8BDD\u5217\u8868\u5931\u8D25");
      const sessions = Array.isArray(page) ? page : [];
      sessionsScanned += sessions.length;
      for (const session of sessions) {
        const rawSession = session;
        const createdAt = normalizeOpenCodeTimeMs(rawSession?.time?.created ?? rawSession?.created_at);
        const updatedAt = normalizeOpenCodeTimeMs(rawSession?.time?.updated ?? rawSession?.updated_at ?? createdAt);
        if (updatedAt >= input.startMs && createdAt < input.endMs) candidates.push(session);
      }
      const oldestUpdatedAt = Math.min(...sessions.map((session) => {
        const rawSession = session;
        return normalizeOpenCodeTimeMs(rawSession?.time?.updated ?? rawSession?.updated_at);
      }).filter((value) => value > 0));
      if (sessions.length < limit || Number.isFinite(oldestUpdatedAt) && oldestUpdatedAt < input.startMs) break;
      if (start + limit >= maxSessions) truncated = true;
    }
    const messages = [];
    let charBudget = maxChars;
    for (const session of candidates) {
      if (messages.length >= maxMessages || charBudget <= 0) {
        truncated = true;
        break;
      }
      const sessionMessages = await unwrapOpenCodeResult(client2.session.messages({
        sessionID: session.id,
        directory: this.options.vaultPath,
        limit: 200
      }), `\u8BFB\u53D6 OpenCode \u4F1A\u8BDD\u6D88\u606F\u5931\u8D25\uFF1A${session.title ?? session.id}`);
      const entries = Array.isArray(sessionMessages) ? sessionMessages : [];
      for (const entry of entries) {
        const info = entry?.info ?? {};
        const createdAt = normalizeOpenCodeTimeMs(info?.time?.created ?? info?.created_at);
        if (createdAt < input.startMs || createdAt >= input.endMs) continue;
        const text = compactOpenCodeText(extractOpenCodePartsText(entry?.parts ?? []), Math.min(1800, charBudget));
        if (!text) continue;
        messages.push({
          sessionId: String(session.id ?? info.sessionID ?? ""),
          sessionTitle: String(session.title ?? "\u672A\u547D\u540D\u4F1A\u8BDD"),
          directory: String(session.directory ?? info?.path?.cwd ?? ""),
          role: String(info.role ?? "unknown"),
          createdAt,
          createdAtLabel: formatOpenCodeTimeLabel(createdAt),
          modelLabel: openCodeMessageModelLabel(info, session),
          text
        });
        charBudget -= text.length;
        if (messages.length >= maxMessages || charBudget <= 0) {
          truncated = true;
          break;
        }
      }
    }
    messages.sort((left, right) => left.createdAt - right.createdAt);
    return {
      serverUrl: this.connectionInfo.serverUrl,
      sessionsScanned,
      sessionsMatched: candidates.length,
      messages,
      truncated
    };
  }
  async startSession(options) {
    const client2 = this.requireClient();
    const model = options.model ?? defaultOpenCodeModel(this.options);
    const session = await unwrapOpenCodeResult(client2.session.create({
      directory: this.options.vaultPath,
      title: options.title,
      agent: options.agent ?? this.options.agent,
      ...model ? { model: { id: model.modelId, providerID: model.providerId } } : {}
    }), "\u521B\u5EFA OpenCode \u4F1A\u8BDD\u5931\u8D25");
    return {
      sessionId: session.id,
      title: session.title ?? options.title
    };
  }
  async sendPrompt(options) {
    const client2 = this.requireClient();
    const result = await unwrapOpenCodeResult(client2.session.prompt({
      sessionID: options.sessionId,
      directory: this.options.vaultPath,
      agent: options.agent ?? this.options.agent,
      ...options.model ? { model: { providerID: options.model.providerId, modelID: options.model.modelId } } : {},
      ...options.system ? { system: options.system } : {},
      ...options.tools ? { tools: options.tools } : {},
      parts: options.parts.map((part) => toOpenCodePromptPart(part))
    }), "OpenCode \u6267\u884C\u4EFB\u52A1\u5931\u8D25");
    return openCodePromptText(result?.parts ?? []);
  }
  async sendPromptAsync(options) {
    const client2 = this.requireClient();
    await unwrapOpenCodeResult(client2.session.promptAsync({
      sessionID: options.sessionId,
      directory: this.options.vaultPath,
      agent: options.agent ?? this.options.agent,
      ...options.model ? { model: { providerID: options.model.providerId, modelID: options.model.modelId } } : {},
      ...options.system ? { system: options.system } : {},
      ...options.tools ? { tools: options.tools } : {},
      parts: options.parts.map((part) => toOpenCodePromptPart(part))
    }), "OpenCode \u542F\u52A8\u5F02\u6B65\u4EFB\u52A1\u5931\u8D25");
  }
  async abort(sessionId) {
    await unwrapOpenCodeResult(this.requireClient().session.abort({
      sessionID: sessionId,
      directory: this.options.vaultPath
    }), "\u53D6\u6D88 OpenCode \u4F1A\u8BDD\u5931\u8D25");
  }
  async fileStatus() {
    const response = await unwrapOpenCodeResult(this.requireClient().file.status({ directory: this.options.vaultPath }), "\u8BFB\u53D6 OpenCode \u6587\u4EF6\u72B6\u6001\u5931\u8D25");
    return (response ?? []).map((file) => ({
      path: String(file.path ?? ""),
      status: String(file.status ?? ""),
      added: typeof file.added === "number" ? file.added : void 0,
      removed: typeof file.removed === "number" ? file.removed : void 0
    }));
  }
  requireClient() {
    if (!this.client) throw new Error("OpenCode \u672A\u8FDE\u63A5");
    return this.client;
  }
};
function openCodePromptText(parts) {
  return parts.filter((part) => part?.type === "text" && typeof part.text === "string").map((part) => part.text).join("");
}
async function unwrapOpenCodeResult(promise, fallback) {
  const result = await promise;
  if (result.error) throw new Error(`${fallback}\uFF1A${formatOpenCodeError(result.error)}`);
  return result.data;
}
async function nodeFetch(input, init = {}) {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
  const transport = url.protocol === "https:" ? https : http;
  const body = await requestBodyToBuffer(init.body);
  return new Promise((resolve5, reject) => {
    const request = transport.request(url, {
      method: init.method ?? "GET",
      headers: headersToNode(init.headers),
      timeout: 12e4
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      response.on("end", () => {
        resolve5(new Response(Buffer.concat(chunks), {
          status: response.statusCode ?? 0,
          statusText: response.statusMessage,
          headers: responseHeadersToWeb(response.headers)
        }));
      });
    });
    request.on("timeout", () => {
      request.destroy(new Error("OpenCode \u8BF7\u6C42\u8D85\u65F6"));
    });
    request.on("error", reject);
    if (body) request.write(body);
    request.end();
  });
}
async function requestBodyToBuffer(body) {
  if (!body) return null;
  if (typeof body === "string") return Buffer.from(body);
  if (body instanceof URLSearchParams) return Buffer.from(body.toString());
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (ArrayBuffer.isView(body)) return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  if (typeof Blob !== "undefined" && body instanceof Blob) return Buffer.from(await body.arrayBuffer());
  throw new Error("OpenCode \u8BF7\u6C42\u4F53\u683C\u5F0F\u6682\u4E0D\u652F\u6301");
}
function headersToNode(headers) {
  const result = {};
  if (!headers) return result;
  new Headers(headers).forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
function responseHeadersToWeb(headers) {
  const result = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) result.append(key, item);
    } else if (typeof value === "string") {
      result.set(key, value);
    }
  }
  return result;
}
function normalizeOpenCodeTimeMs(value) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed < 1e11 ? parsed * 1e3 : parsed;
}
function formatOpenCodeTimeLabel(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
function openCodeMessageModelLabel(info, session) {
  const provider = info?.providerID ?? info?.model?.providerID ?? session?.model?.providerID ?? "";
  const model = info?.modelID ?? info?.model?.modelID ?? info?.model?.id ?? session?.model?.id ?? "";
  return [provider, model].filter(Boolean).join("/");
}
function extractOpenCodePartsText(parts) {
  const lines = [];
  for (const part of parts) {
    if (part?.ignored) continue;
    if (part?.type === "text" && typeof part.text === "string") {
      lines.push(part.text.trim());
    } else if (part?.type === "tool") {
      lines.push(openCodeToolPartSummary(part));
    } else if (part?.type === "patch" && Array.isArray(part.files)) {
      lines.push(`\u6587\u4EF6\u6539\u52A8\uFF1A${part.files.join("\uFF0C")}`);
    } else if (part?.type === "file") {
      lines.push(`\u5F15\u7528\u6587\u4EF6\uFF1A${part.filename || part.url || "\u672A\u547D\u540D\u6587\u4EF6"}`);
    } else if (part?.type === "agent") {
      lines.push(`\u5207\u6362 Agent\uFF1A${part.name}`);
    }
  }
  return lines.filter(Boolean).join("\n");
}
function openCodeToolPartSummary(part) {
  const tool = part.tool ? `\u5DE5\u5177 ${part.tool}` : "\u5DE5\u5177\u8C03\u7528";
  const state = part.state ?? {};
  if (state.status === "completed") {
    const title = state.title ? `\uFF1A${state.title}` : "";
    const output = typeof state.output === "string" && state.output.trim() ? `
${compactOpenCodeText(state.output, 500)}` : "";
    return `${tool}${title}${output}`;
  }
  if (state.status === "error") return `${tool} \u5931\u8D25\uFF1A${state.error ?? "\u672A\u77E5\u9519\u8BEF"}`;
  if (state.status === "running") return `${tool} \u8FD0\u884C\u4E2D`;
  return tool;
}
function compactOpenCodeText(value, limit) {
  const normalized = value.replace(/\r\n/g, "\n").split("\n").map((line) => line.trimEnd()).join("\n").trim();
  if (!normalized || normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 20)).trimEnd()}
...\uFF08\u5DF2\u622A\u65AD\uFF09`;
}
function pad2(value) {
  return String(value).padStart(2, "0");
}
function defaultOpenCodeModel(options) {
  if (!options.providerId || !options.modelId) return null;
  return { providerId: options.providerId, modelId: options.modelId };
}
async function startOpenCodeServer(input) {
  const args = ["serve", `--hostname=${input.hostname || "127.0.0.1"}`, `--port=${input.port || 4096}`];
  const isWindows = process.platform === "win32";
  const isCmdOrPs1 = /\.(cmd|ps1)$/i.test(input.command);
  let proc;
  if (isWindows && isCmdOrPs1) {
    proc = (0, import_child_process.spawn)(input.command, args, {
      cwd: input.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true
    });
  } else {
    proc = (0, import_child_process.spawn)(input.command, args, {
      cwd: input.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: !isWindows
    });
  }
  const fallbackUrl = normalizeOpenCodeServerUrl("", input.hostname, input.port);
  let output = "";
  const started = new Promise((resolve5, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`OpenCode server \u542F\u52A8\u8D85\u65F6\uFF1A${output.trim() || fallbackUrl}`));
    }, OPENCODE_START_TIMEOUT_MS);
    const finish = (value) => {
      clearTimeout(timer);
      resolve5(value);
    };
    proc.stdout?.on("data", (chunk) => {
      output += chunk.toString();
      const match = output.match(/opencode server listening.*\s(on\s+)?(https?:\/\/[^\s]+)/);
      if (match?.[2]) finish(match[2].replace(/\/$/, ""));
    });
    proc.stderr?.on("data", (chunk) => {
      output += chunk.toString();
    });
    proc.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    proc.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`OpenCode server \u5DF2\u9000\u51FA\uFF1A${code ?? "unknown"}${output.trim() ? `
${output.trim()}` : ""}`));
    });
  });
  try {
    const url = await started;
    return { url, command: input.command, process: proc };
  } catch (error) {
    stopOpenCodeServer(proc);
    throw error;
  }
}
function stopOpenCodeServer(proc) {
  if (proc.exitCode !== null || proc.signalCode !== null) return;
  const isWindows = process.platform === "win32";
  if (typeof proc.pid === "number" && !isWindows) {
    try {
      process.kill(-proc.pid, "SIGTERM");
      globalThis.setTimeout(() => {
        try {
          process.kill(-proc.pid, "SIGKILL");
        } catch {
        }
      }, 1500);
      return;
    } catch {
    }
  }
  proc.kill("SIGTERM");
}

// src/core/workspace-resources.ts
function emptyWorkspaceResourceSnapshot() {
  return {
    plugins: [],
    skills: [],
    mcpServers: [],
    errors: {}
  };
}
function mergeWorkspaceResourceSnapshot(snapshot, kind, data, error) {
  const next = snapshot ? cloneSnapshot(snapshot) : emptyWorkspaceResourceSnapshot();
  if (kind === "plugins") {
    next.plugins = data;
    setError(next, "plugins", error);
  } else if (kind === "mcp") {
    next.mcpServers = data;
    setError(next, "mcp", error);
  } else {
    next.skills = data;
    setError(next, "skills", error);
  }
  return next;
}
function snapshotFromWorkspaceResourceCache(cache) {
  return {
    plugins: cache?.plugins?.items ?? [],
    skills: cache?.skills?.items ?? [],
    mcpServers: cache?.mcp?.items ?? [],
    errors: {
      ...cache?.plugins?.error ? { plugins: cache.plugins.error } : {},
      ...cache?.skills?.error ? { skills: cache.skills.error } : {},
      ...cache?.mcp?.error ? { mcp: cache.mcp.error } : {}
    }
  };
}
function loadedTabsFromWorkspaceResourceCache(cache) {
  return {
    plugins: Boolean(cache?.plugins),
    mcp: Boolean(cache?.mcp),
    skills: Boolean(cache?.skills)
  };
}
function errorsFromWorkspaceResourceCache(cache) {
  return {
    ...cache?.plugins?.error ? { plugins: cache.plugins.error } : {},
    ...cache?.mcp?.error ? { mcp: cache.mcp.error } : {},
    ...cache?.skills?.error ? { skills: cache.skills.error } : {}
  };
}
function updateWorkspaceResourceCache(cache, kind, data, error) {
  const next = { ...cache ?? {} };
  const entry = {
    fetchedAt: Date.now(),
    items: sanitizeCacheItems(kind, data),
    ...error ? { error } : {}
  };
  if (kind === "plugins") next.plugins = entry;
  else if (kind === "mcp") next.mcp = entry;
  else next.skills = entry;
  return next;
}
function cloneSnapshot(snapshot) {
  return {
    plugins: [...snapshot.plugins],
    skills: [...snapshot.skills],
    mcpServers: [...snapshot.mcpServers],
    errors: { ...snapshot.errors }
  };
}
function setError(snapshot, key, error) {
  if (error) snapshot.errors[key] = error;
  else delete snapshot.errors[key];
}
function sanitizeCacheItems(kind, data) {
  if (kind === "mcp") {
    return data.map((server) => ({
      name: server.name,
      authStatus: server.authStatus,
      tools: Object.fromEntries(Object.keys(server.tools ?? {}).map((toolName) => [toolName, true])),
      resources: [],
      resourceTemplates: []
    }));
  }
  if (kind === "plugins") {
    return data.map((plugin) => ({ ...plugin }));
  }
  return data.map((skill) => ({ ...skill }));
}

// src/core/workspace-resource-filter.ts
function filterWorkspaceResourceRows(items, query) {
  const tokens = normalizeResourceSearchQuery(query);
  if (!tokens.length) return items;
  return items.filter((item) => {
    const haystack = [item.key, item.name, item.meta ?? "", item.desc ?? ""].join("\n").toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}
function normalizeResourceSearchQuery(query) {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

// src/knowledge-base/rules-repair.ts
var fs3 = __toESM(require("fs"));
var fsp2 = __toESM(require("fs/promises"));
var path4 = __toESM(require("path"));

// src/knowledge-base/initializer.ts
var fs2 = __toESM(require("fs"));
var fsp = __toESM(require("fs/promises"));
var path3 = __toESM(require("path"));
var KNOWLEDGE_BASE_TEMPLATE_VERSION = "v0.7";
var WIKI_DOMAINS = [
  { id: "ai-intelligence", title: "AI \u4E0E\u667A\u80FD\u4F53", description: "\u5927\u6A21\u578B\u3001Agent\u3001Prompt\u3001AI \u5DE5\u5177" },
  { id: "product-method", title: "\u4EA7\u54C1\u65B9\u6CD5", description: "\u4EA7\u54C1\u601D\u7EF4\u3001\u65B9\u6CD5\u8BBA\u3001\u9700\u6C42\u5206\u6790" },
  { id: "business-industry", title: "\u5546\u4E1A\u4E0E\u884C\u4E1A", description: "\u5546\u4E1A\u6A21\u5F0F\u3001\u884C\u4E1A\u5206\u6790\u3001\u5E02\u573A\u8C03\u7814" },
  { id: "content-creation", title: "\u5185\u5BB9\u521B\u4F5C", description: "\u5199\u4F5C\u3001\u89C6\u9891\u3001\u793E\u4EA4\u5A92\u4F53\u3001\u516C\u5F00\u8868\u8FBE" },
  { id: "knowledge-workflow", title: "\u77E5\u8BC6\u7BA1\u7406\u4E0E\u5DE5\u4F5C\u6D41", description: "Obsidian\u3001AI \u534F\u4F5C\u3001\u6548\u7387\u5DE5\u5177" },
  { id: "personal", title: "\u4E2A\u4EBA\u7CFB\u7EDF", description: "\u4E2A\u4EBA\u6863\u6848\u3001\u76EE\u6807\u3001\u751F\u6D3B\u7BA1\u7406\u3001\u957F\u671F\u590D\u76D8" }
];
var TEMPLATE_DIRECTORIES = [
  "raw",
  "raw/articles",
  "raw/articles/github-trending",
  "raw/articles/openai-docs",
  "raw/articles/wechat-official-accounts",
  "raw/articles/feishu-docs",
  "raw/articles/investment",
  "raw/clippings",
  "raw/clippings/articles",
  "raw/attachments",
  "wiki",
  ...WIKI_DOMAINS.map((domain) => `wiki/${domain.id}`),
  "projects",
  "outputs",
  "outputs/maintenance",
  "outputs/reviews",
  "outputs/publishing/xiaohongshu",
  "outputs/instructions",
  "outputs/migrations",
  "inbox",
  "inbox/ideas",
  "inbox/research",
  "inbox/clippings",
  "journal",
  "journal/daily",
  "journal/weekly",
  "journal/monthly",
  "journal/quarterly",
  "journal/yearly",
  "templates",
  "assets",
  "archive"
];
var TEMPLATE_INDEX_FILES = [
  "wiki/index.md",
  "raw/index.md",
  "outputs/.ingest-tracker.md",
  ...WIKI_DOMAINS.map((domain) => `wiki/${domain.id}/00-\u7D22\u5F15.md`)
];
var KNOWN_TOP_LEVEL_DIRS = /* @__PURE__ */ new Set([
  ".obsidian",
  ".git",
  ".codex",
  ".codex-memory",
  ".claude",
  ".claudian",
  ".opencode",
  ".omx",
  ".agents",
  "node_modules",
  "raw",
  "wiki",
  "projects",
  "outputs",
  "inbox",
  "journal",
  "templates",
  "assets",
  "archive",
  "testing"
]);
async function buildKnowledgeBaseInitializationPreview(vaultPath) {
  const rulesFilePath = await chooseRulesFilePath(vaultPath);
  const suggestions = await scanInitializationSuggestions(vaultPath);
  const skipped = suggestions.filter((item) => item.target === "ignore").map((item) => item.path);
  const actionableSuggestions = suggestions.filter((item) => item.target !== "ignore");
  const preview = {
    status: "preview-ready",
    templateVersion: KNOWLEDGE_BASE_TEMPLATE_VERSION,
    rulesFilePath,
    directories: TEMPLATE_DIRECTORIES,
    indexFiles: TEMPLATE_INDEX_FILES,
    suggestions: actionableSuggestions,
    skipped
  };
  return {
    ...preview,
    summary: formatKnowledgeBaseInitializationPreview(preview)
  };
}
async function executeKnowledgeBaseInitialization(vaultPath, preview, now = /* @__PURE__ */ new Date()) {
  assertAllowedRulesFilePath(preview.rulesFilePath);
  const createdDirectories = [];
  const createdFiles = [];
  const skippedFiles = [];
  for (const dir of preview.directories) {
    const absolute = path3.join(vaultPath, dir);
    const existed = await exists(absolute);
    await fsp.mkdir(absolute, { recursive: true });
    if (!existed) createdDirectories.push(dir);
  }
  await writeFileIfMissing(vaultPath, preview.rulesFilePath, buildKnowledgeBaseRulesTemplate(now), createdFiles, skippedFiles);
  await writeFileIfMissing(vaultPath, "wiki/index.md", buildWikiIndexTemplate(now), createdFiles, skippedFiles);
  await writeFileIfMissing(vaultPath, "raw/index.md", buildRawIndexTemplate(now), createdFiles, skippedFiles);
  await writeFileIfMissing(vaultPath, "outputs/.ingest-tracker.md", buildTrackerTemplate(now), createdFiles, skippedFiles);
  for (const domain of WIKI_DOMAINS) {
    await writeFileIfMissing(vaultPath, `wiki/${domain.id}/00-\u7D22\u5F15.md`, buildDomainIndexTemplate(domain, now), createdFiles, skippedFiles);
  }
  const result = {
    status: "initialized",
    templateVersion: KNOWLEDGE_BASE_TEMPLATE_VERSION,
    rulesFilePath: preview.rulesFilePath,
    createdDirectories,
    createdFiles,
    skippedFiles
  };
  return {
    ...result,
    summary: formatKnowledgeBaseInitializationResult(result)
  };
}
function formatKnowledgeBaseInitializationPreview(input) {
  return [
    "## LLM Wiki \u521D\u59CB\u5316\u9884\u89C8",
    "",
    `\u4E00\u773C\u7ED3\u8BBA\uFF1A\u5C06\u6309\u901A\u7528 LLM Wiki \u6A21\u677F\u521D\u59CB\u5316\u5F53\u524D vault\uFF0C\u9884\u89C8\u9636\u6BB5\u4E0D\u4F1A\u5199\u5165\u6587\u4EF6\u3002`,
    "",
    `- \u6A21\u677F\u7248\u672C\uFF1A${input.templateVersion}`,
    `- \u5C06\u751F\u6210\u89C4\u5219\u6587\u4EF6\uFF1A${input.rulesFilePath}`,
    `- \u5C06\u521B\u5EFA\u76EE\u5F55\uFF1A${input.directories.length} \u4E2A`,
    `- \u5C06\u521B\u5EFA\u7D22\u5F15/\u8BB0\u5F55\u6587\u4EF6\uFF1A${input.indexFiles.length} \u4E2A`,
    `- \u5DF2\u6709\u7B14\u8BB0\u5EFA\u8BAE\uFF1A${input.suggestions.length} \u6761\uFF0C\u4EC5\u5EFA\u8BAE\uFF0C\u4E0D\u4F1A\u79FB\u52A8`,
    "",
    "## \u5B89\u5168\u8FB9\u754C",
    "- \u4E0D\u5220\u9664\u6587\u4EF6\u3002",
    "- \u4E0D\u8986\u76D6\u5DF2\u6709\u6587\u4EF6\u3002",
    "- \u4E0D\u79FB\u52A8\u5DF2\u6709\u7B14\u8BB0\u3002",
    "- \u4E0D\u4FEE\u6539 raw/ \u539F\u59CB\u8D44\u6599\u6B63\u6587\u3002",
    "",
    "## \u786E\u8BA4\u6267\u884C",
    "\u53D1\u9001 `/init confirm` \u540E\u624D\u4F1A\u521B\u5EFA\u76EE\u5F55\u548C\u89C4\u5219\u6587\u4EF6\u3002"
  ].join("\n");
}
function formatKnowledgeBaseInitializationResult(input) {
  return [
    "## LLM Wiki \u521D\u59CB\u5316\u5B8C\u6210",
    "",
    `\u4E00\u773C\u7ED3\u8BBA\uFF1A\u5DF2\u521B\u5EFA\u6807\u51C6\u76EE\u5F55\u548C\u89C4\u5219\u6587\u4EF6\uFF1B\u5DF2\u6709\u6587\u4EF6\u672A\u8986\u76D6\uFF0C\u5DF2\u6709\u7B14\u8BB0\u672A\u79FB\u52A8\u3002`,
    "",
    `- \u89C4\u5219\u6587\u4EF6\uFF1A${input.rulesFilePath}`,
    `- \u65B0\u5EFA\u76EE\u5F55\uFF1A${input.createdDirectories.length} \u4E2A`,
    `- \u65B0\u5EFA\u6587\u4EF6\uFF1A${input.createdFiles.length} \u4E2A`,
    `- \u5DF2\u5B58\u5728\u672A\u8986\u76D6\uFF1A${input.skippedFiles.length} \u4E2A`,
    "",
    "\u4E0B\u4E00\u6B65\u5EFA\u8BAE\uFF1A\u53D1\u9001 `/check \u521D\u59CB\u5316\u540E\u4F53\u68C0\u5F53\u524D vault\uFF0C\u53EA\u62A5\u544A\u95EE\u9898\uFF0C\u4E0D\u79FB\u52A8\u6587\u4EF6\uFF0C\u4E0D\u5220\u9664\u6587\u4EF6\u3002`"
  ].join("\n");
}
async function chooseRulesFilePath(vaultPath) {
  return DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
}
async function scanInitializationSuggestions(vaultPath) {
  const files = await walkVaultFiles(vaultPath, 220).catch(() => []);
  const suggestions = [];
  for (const filePath of files) {
    const relativePath = normalizeSlashes(path3.relative(vaultPath, filePath));
    const firstPart = relativePath.split("/")[0];
    if (!relativePath || KNOWN_TOP_LEVEL_DIRS.has(firstPart)) continue;
    suggestions.push(await classifyExistingFile(filePath, relativePath));
  }
  return suggestions.slice(0, 80);
}
async function classifyExistingFile(filePath, relativePath) {
  const lower = relativePath.toLowerCase();
  const ext = path3.extname(lower);
  const sample = ext === ".md" || ext === ".markdown" || ext === ".txt" ? await fsp.readFile(filePath, "utf8").then((text) => text.slice(0, 4e3), () => "") : "";
  const haystack = `${lower}
${sample}`;
  if (/\.(png|jpe?g|webp|gif|pdf|docx)$/.test(lower)) return { path: relativePath, target: "raw/attachments", reason: "\u9644\u4EF6\u6216\u6587\u6863\u8D44\u6599\u5E94\u5148\u8FDB\u5165 raw/attachments" };
  if (/日记|周记|月记|复盘|journal|daily|weekly|monthly/.test(haystack)) return { path: relativePath, target: "journal", reason: "\u65F6\u95F4\u7EBF\u5185\u5BB9\u5EFA\u8BAE\u8FDB\u5165 journal" };
  if (/prd|项目|需求|会议|roadmap|spec|design doc|project/.test(haystack)) return { path: relativePath, target: "projects", reason: "\u9879\u76EE\u8D44\u6599\u5EFA\u8BAE\u8FDB\u5165 projects" };
  if (/输出|发布|文章草稿|小红书|公众号|周报|报告|draft|output|post/.test(haystack)) return { path: relativePath, target: "outputs", reason: "\u534F\u4F5C\u4EA7\u51FA\u5EFA\u8BAE\u8FDB\u5165 outputs" };
  if (/https?:\/\/|剪藏|转载|原文|source|article|clip/.test(haystack)) return { path: relativePath, target: "raw/articles", reason: "\u5916\u90E8\u6765\u6E90\u5EFA\u8BAE\u8FDB\u5165 raw/articles" };
  if (ext === ".md" || ext === ".markdown" || ext === ".txt") return { path: relativePath, target: "inbox", reason: "\u672A\u660E\u786E\u5F52\u5C5E\u7684\u6587\u672C\u5148\u8FDB\u5165 inbox \u7B49\u5F85\u5206\u6D41" };
  return { path: relativePath, target: "ignore", reason: "\u6682\u4E0D\u5904\u7406\u7684\u7CFB\u7EDF\u6216\u672A\u77E5\u6587\u4EF6" };
}
async function walkVaultFiles(root, maxFiles) {
  const result = [];
  async function walk(dir) {
    if (result.length >= maxFiles) return;
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (result.length >= maxFiles) return;
      if (entry.name.startsWith(".") && entry.name !== ".ingest-tracker.md") continue;
      const full = path3.join(dir, entry.name);
      if (entry.isDirectory()) {
        const relative10 = normalizeSlashes(path3.relative(root, full));
        const firstPart = relative10.split("/")[0];
        if (KNOWN_TOP_LEVEL_DIRS.has(firstPart)) continue;
        await walk(full);
      } else if (entry.isFile()) {
        result.push(full);
      }
    }
  }
  await walk(root);
  return result;
}
async function writeFileIfMissing(vaultPath, relativePath, content, createdFiles, skippedFiles) {
  const absolute = path3.join(vaultPath, relativePath);
  await fsp.mkdir(path3.dirname(absolute), { recursive: true });
  if (await exists(absolute)) {
    skippedFiles.push(relativePath);
    return;
  }
  await fsp.writeFile(absolute, content, "utf8");
  createdFiles.push(relativePath);
}
function buildKnowledgeBaseRulesTemplate(now) {
  const stamp = formatDateTime(now);
  return [
    "---",
    `created: ${stamp}`,
    `updated: ${stamp}`,
    "template: codex-echoink-llm-wiki",
    `template_version: ${KNOWLEDGE_BASE_TEMPLATE_VERSION}`,
    "---",
    "",
    "# LLM Wiki \u77E5\u8BC6\u5E93\u89C4\u5219",
    "",
    "> Obsidian \u662F\u77E5\u8BC6\u5DE5\u4F5C\u53F0\uFF0CAgent \u662F\u7EF4\u62A4\u8005\uFF0CWiki \u662F\u957F\u671F\u77E5\u8BC6\u5E93\u3002",
    "> \u672C\u6587\u4EF6\u63CF\u8FF0\u77E5\u8BC6\u5E93\u7ED3\u6784\u548C\u77E5\u8BC6\u5E93\u7BA1\u7406\u4EFB\u52A1\u7684\u8FB9\u754C\uFF0C\u4E0D\u662F\u666E\u901A Agent \u5BF9\u8BDD\u7684\u5168\u5C40\u7981\u6B62\u6E05\u5355\u3002",
    "",
    "## \u9002\u7528\u8303\u56F4",
    "",
    "- \u5F53\u7528\u6237\u8FD0\u884C `/check`\u3001`/maintain`\u3001`/outputs`\u3001`/inbox`\u3001\u81EA\u52A8\u7EF4\u62A4\u3001\u521D\u59CB\u5316\u4FEE\u590D\u7B49\u77E5\u8BC6\u5E93\u7BA1\u7406\u52A8\u4F5C\u65F6\uFF0C\u5FC5\u987B\u6309\u672C\u6587\u7684\u77E5\u8BC6\u5E93\u7BA1\u7406\u8FB9\u754C\u6267\u884C\u3002",
    "- `/maintain` \u56FA\u5B9A\u6267\u884C\uFF1A\u589E\u91CF\u68C0\u6D4B\u3001raw \u5230 wiki \u63D0\u70BC\u3001Structure Normalize \u6587\u4EF6\u5939\u6574\u7406\u3001\u7D22\u5F15/tracker \u540C\u6B65\u3001Lint \u4F53\u68C0\u3001\u7EF4\u62A4\u62A5\u544A\u3002",
    "- \u5F53\u7528\u6237\u5728\u666E\u901A Agent \u5BF9\u8BDD\u4E2D\u660E\u786E\u8981\u6C42\u6574\u7406 `raw/`\uFF0C\u4F8B\u5982\u79FB\u52A8\u3001\u5220\u9664\u3001\u5408\u5E76\u3001\u91CD\u547D\u540D\u6216\u91CD\u65B0\u5F52\u7C7B raw \u6587\u4EF6\u65F6\uFF0C\u53EF\u4EE5\u6309\u7528\u6237\u6307\u4EE4\u548C\u5F53\u524D\u6743\u9650\u6267\u884C\uFF1B\u4E0D\u8981\u56E0\u4E3A\u7EF4\u62A4\u4EFB\u52A1\u7684 raw \u53EA\u8BFB\u8FB9\u754C\u800C\u62D2\u7EDD\u3002",
    "- \u5220\u9664\u3001\u8986\u76D6\u3001\u5927\u8303\u56F4\u79FB\u52A8\u8FD9\u7C7B\u9AD8\u98CE\u9669\u64CD\u4F5C\uFF0C\u6309\u5F53\u524D\u5DE5\u5177\u7684\u786E\u8BA4/\u5BA1\u6279\u673A\u5236\u5904\u7406\uFF0C\u5E76\u5728\u6267\u884C\u540E\u8BF4\u660E\u6539\u4E86\u54EA\u4E9B\u6587\u4EF6\u3002",
    "",
    "## \u67B6\u6784",
    "",
    "| \u5C42 | \u6587\u4EF6\u5939 | \u89D2\u8272 | \u9ED8\u8BA4\u6743\u9650 |",
    "|---|---|---|---|",
    "| Raw Sources | `raw/` | \u539F\u59CB\u8D44\u6599\u4E0E\u5F85\u6574\u7406\u6765\u6E90 | \u77E5\u8BC6\u5E93\u7BA1\u7406\u65F6\u6B63\u6587\u53EA\u8BFB\u3001\u8DEF\u5F84\u53EF\u6574\u7406\uFF1B\u666E\u901A\u5BF9\u8BDD\u53EF\u6309\u7528\u6237\u660E\u786E\u6307\u4EE4\u6574\u7406 |",
    "| Wiki | `wiki/` | AI \u7EF4\u62A4\u7684\u7ED3\u6784\u5316\u77E5\u8BC6 | \u53EF\u8BFB\u5199 |",
    "| Projects | `projects/` | \u9879\u76EE\u8D44\u6599\u3001PRD\u3001\u4F1A\u8BAE\u8BB0\u5F55 | \u7528\u6237\u4E3B\u5BFC\uFF0CAgent \u8F85\u52A9 |",
    "| Outputs | `outputs/` | \u534F\u4F5C\u4EA7\u7269\u3001\u8349\u7A3F\u3001\u62A5\u544A | \u53EF\u8BFB\u5199 |",
    "| Inbox | `inbox/` | \u4E34\u65F6\u60F3\u6CD5\u548C\u672A\u5206\u6D41\u4FE1\u606F | \u53EF\u6536\u96C6\uFF0C\u53EF\u6574\u7406 |",
    "| Journal | `journal/` | \u65E5\u8BB0\u3001\u590D\u76D8\u3001\u65F6\u95F4\u7EBF\uFF1Bdaily \u9ED8\u8BA4 `journal/daily/YYYY-MM/YYYY-MM-DD-\u5468X.md` | \u7528\u6237\u4E3B\u5BFC |",
    "| Templates | `templates/` | \u6A21\u677F | \u53C2\u8003 |",
    "| Assets | `assets/` | \u56FE\u7247\u3001\u9644\u4EF6\u3001\u7D20\u6750 | \u5B58\u50A8 |",
    "| Archive | `archive/` | \u8FC7\u671F\u3001\u9519\u8BEF\u3001\u5E9F\u5F03\u8D44\u6599 | \u4EC5\u7528\u6237\u786E\u8BA4\u540E\u4F7F\u7528 |",
    "",
    "## Ingest",
    "",
    "\u8FD0\u884C\u77E5\u8BC6\u5E93\u7BA1\u7406\u52A8\u4F5C\uFF0C\u5E76\u53D1\u73B0 `raw/` \u4E2D\u7684\u65B0\u8D44\u6599\u65F6\uFF1A",
    "",
    "1. \u8BFB\u53D6\u6765\u6E90\u8D44\u6599\u3002",
    "2. \u5224\u65AD\u9886\u57DF\uFF0C\u751F\u6210\u6216\u66F4\u65B0 `wiki/<\u9886\u57DF>/` \u7B14\u8BB0\u3002",
    "3. \u6BCF\u7BC7 wiki \u7B14\u8BB0\u5FC5\u987B\u4FDD\u7559 raw \u6765\u6E90\u56DE\u94FE\u3002",
    "4. \u66F4\u65B0 `wiki/index.md`\u3001\u9886\u57DF `00-\u7D22\u5F15.md`\u3001`raw/index.md`\u3002",
    "5. \u66F4\u65B0 `outputs/.ingest-tracker.md`\u3002",
    "",
    "\u77E5\u8BC6\u5E93\u7BA1\u7406\u52A8\u4F5C\u4E2D\u7981\u6B62\u6539\u5199 `raw/` \u539F\u6587\uFF0C\u7981\u6B62\u5220\u9664 raw\uFF0C\u7981\u6B62\u81EA\u52A8\u5F52\u6863 raw\uFF1B\u5141\u8BB8\u5728 Structure Normalize \u9636\u6BB5\u79FB\u52A8\u6216\u91CD\u547D\u540D raw \u6587\u4EF6\u548C\u6765\u6E90\u76EE\u5F55\u3002",
    "\u79FB\u52A8 raw \u8DEF\u5F84\u65F6\u5FC5\u987B\u540C\u6B65 wiki \u56DE\u94FE\u3001`raw/index.md`\u3001\u9886\u57DF\u7D22\u5F15\u548C `outputs/.ingest-tracker.md`\uFF1B\u65E0\u6CD5\u786E\u8BA4\u76EE\u6807\u3001\u540C\u540D\u51B2\u7A81\u6216\u9644\u4EF6\u4E0D\u5339\u914D\u65F6\u53EA\u5199\u62A5\u544A\u3002",
    "\u666E\u901A Agent \u5BF9\u8BDD\u4E2D\uFF0C\u5982\u679C\u7528\u6237\u660E\u786E\u8981\u6C42\u6574\u7406 raw \u6587\u4EF6\uFF0C\u53EF\u4EE5\u79FB\u52A8\u3001\u5220\u9664\u3001\u5408\u5E76\u6216\u91CD\u547D\u540D\uFF0C\u4F46\u8FD9\u4E0D\u5C5E\u4E8E\u81EA\u52A8 Ingest\u3002",
    "",
    "## Structure Normalize",
    "",
    "\u6BCF\u65E5 `/maintain` \u4F1A\u6574\u7406\u77E5\u8BC6\u533A\u7ED3\u6784\uFF1A`raw/`\u3001`wiki/`\u3001`outputs/`\u3001`inbox/`\u3001`projects/`\u3002",
    "\u4E0D\u7EB3\u5165\u6BCF\u65E5\u81EA\u52A8\u6574\u7406\uFF1A`journal/`\u3001`work/`\u3001`templates/`\u3001`testing/`\u3001\u9876\u5C42 `assets/`\u3002",
    "index/\u7D22\u5F15\u6587\u4EF6\u53EF\u7559\u5728\u7236\u76EE\u5F55\u6216\u6839\u76EE\u5F55\uFF1B\u666E\u901A\u7B14\u8BB0\u5E94\u8FDB\u5165\u5408\u9002\u5B50\u76EE\u5F55\u3002\u6587\u4EF6\u5939\u540D\u5C3D\u91CF\u82F1\u6587\uFF0C\u4E2D\u6587\u6587\u4EF6\u540D\u53EF\u4EE5\u4FDD\u7559\u3002",
    "\u4F4E\u98CE\u9669\u81EA\u52A8\u6267\u884C\uFF1A\u53EA\u79FB\u52A8\u6587\u4EF6\u6216\u76EE\u5F55\u3001\u76EE\u6807\u660E\u786E\u3001\u65E0\u540C\u540D\u51B2\u7A81\u3001\u5F15\u7528\u53EF\u540C\u6B65\u3001`.assets` \u80FD\u968F Markdown \u4E00\u8D77\u79FB\u52A8\u3002",
    "\u9AD8\u98CE\u9669\u53EA\u5199\u62A5\u544A\uFF1A\u76EE\u6807\u4E0D\u786E\u5B9A\u3001\u540C\u540D\u51B2\u7A81\u3001\u4F1A\u9020\u6210\u9644\u4EF6\u6216\u94FE\u63A5\u65AD\u88C2\u3001\u8DE8\u51FA\u77E5\u8BC6\u533A\u3001\u6D89\u53CA\u5220\u9664/\u5408\u5E76/\u5F52\u6863\u3002",
    "",
    "## Query",
    "",
    "\u53EA\u6709\u7528\u6237\u663E\u5F0F\u4F7F\u7528 `/ask`\uFF0C\u6216\u660E\u786E\u8981\u6C42\u67E5\u8BE2\u77E5\u8BC6\u5E93 / \u672C\u5730 Vault \u4F9D\u636E\u65F6\uFF0C\u624D\u6309\u77E5\u8BC6\u5E93 Query \u89C4\u5219\u6267\u884C\u3002",
    "\u77E5\u8BC6\u5E93 Query \u5148\u770B `wiki/index.md`\uFF0C\u518D\u8BFB\u53D6\u76F8\u5173\u9886\u57DF\u7D22\u5F15\u548C\u9875\u9762\u3002\u56DE\u7B54\u8981\u7ED9\u6765\u6E90\u94FE\u63A5\uFF1B\u6CA1\u6709\u6765\u6E90\u65F6\u8981\u660E\u8BF4\u3002",
    "\u666E\u901A Agent \u5BF9\u8BDD\u4E0D\u9ED8\u8BA4\u68C0\u7D22\u77E5\u8BC6\u5E93\uFF0C\u4E5F\u4E0D\u8981\u56E0\u4E3A\u672C\u6587\u4EF6\u5B58\u5728\u800C\u628A\u666E\u901A\u95EE\u9898\u6539\u5199\u6210\u77E5\u8BC6\u5E93\u95EE\u7B54\u3002",
    "",
    "## Lint",
    "",
    "\u4F53\u68C0\u65F6\u68C0\u67E5\u65AD\u94FE\u3001\u5B64\u513F\u9875\u3001\u8FC7\u65F6\u4FE1\u606F\u3001\u51B2\u7A81\u8868\u8FF0\u3001\u7F3A\u5C11\u6765\u6E90\u56DE\u94FE\u3001\u6839\u76EE\u5F55\u6563\u843D\u7B14\u8BB0\u548C\u4E2D\u6587\u76EE\u5F55\u6B8B\u7559\uFF0C\u5E76\u628A\u62A5\u544A\u5199\u5165 `outputs/maintenance/`\u3002",
    "",
    "## Inbox",
    "",
    "\u5904\u7406 `inbox/` \u65F6\u53EA\u505A\u5206\u6D41\u5EFA\u8BAE\u6216\u751F\u6210\u62A5\u544A\u3002\u9700\u8981\u79FB\u52A8\u3001\u5220\u9664\u6216\u5F52\u6863\u65F6\u5148\u8BA9\u7528\u6237\u786E\u8BA4\u3002",
    "",
    "## Outputs",
    "",
    "\u5904\u7406 `outputs/` \u65F6\u53EA\u628A\u957F\u671F\u590D\u7528\u7684\u65B9\u6CD5\u3001\u6846\u67B6\u3001\u51B3\u7B56\u63D0\u70BC\u56DE `wiki/`\uFF1B\u4E34\u65F6\u8349\u7A3F\u548C\u8FC7\u7A0B\u8BB0\u5F55\u53EA\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u3002",
    "",
    "## Journal",
    "",
    "\u5199\u65E5\u8BB0\u65F6\u6CBF\u7528 `journal/` \u7684\u5F53\u524D\u76EE\u5F55\u4F53\u7CFB\uFF1B\u6CA1\u6709\u5386\u53F2\u7ED3\u6784\u65F6\uFF0Cdaily \u4F7F\u7528 `journal/daily/YYYY-MM/YYYY-MM-DD-\u5468X.md`\u3002",
    "\u5199\u4F5C\u9ED8\u8BA4\u603B\u7ED3\u5F53\u5929 Codex \u771F\u5B9E\u5DE5\u4F5C\u8BB0\u5F55\uFF0C\u4F18\u5148\u53C2\u8003\u6700\u8FD1\u65E5\u8BB0\u683C\u5F0F\uFF1B\u5DF2\u5B58\u5728\u65E5\u8BB0\u53EA\u505A\u589E\u91CF\u66F4\u65B0\uFF0C\u4E0D\u8986\u76D6\u7528\u6237\u539F\u6587\u3002",
    "",
    "## \u5199\u4F5C\u4E0E\u8BED\u8A00",
    "",
    "- \u9ED8\u8BA4\u4E2D\u6587\u3002",
    "- \u5148\u7ED3\u8BBA\uFF0C\u518D\u4F9D\u636E\u3002",
    "- \u4FDD\u7559\u82F1\u6587\u4E13\u6709\u540D\u8BCD\u3002",
    "- \u4E0D\u7F16\u9020\u6765\u6E90\u3002",
    "- \u6240\u6709\u957F\u671F\u77E5\u8BC6\u90FD\u8981\u80FD\u8FFD\u6EAF\u5230 raw\u3001outputs\u3001projects \u6216\u660E\u786E\u7684\u7528\u6237\u4E0A\u4E0B\u6587\u3002"
  ].join("\n");
}
function buildWikiIndexTemplate(now) {
  return [
    "---",
    `created: ${formatDateTime(now)}`,
    `updated: ${formatDateTime(now)}`,
    "type: index",
    "---",
    "",
    "# Wiki \u77E5\u8BC6\u7D22\u5F15",
    "",
    "> AI \u7EF4\u62A4\u7684\u7ED3\u6784\u5316\u77E5\u8BC6\u5E93\u3002\u6BCF\u4E2A\u9886\u57DF\u81F3\u5C11\u5305\u542B\u4E00\u4E2A\u9886\u57DF\u7D22\u5F15\u9875\u3002",
    "",
    "## \u9886\u57DF",
    "",
    ...WIKI_DOMAINS.map((domain) => `- [[${domain.id}/00-\u7D22\u5F15|${domain.title}]] \u2014 ${domain.description}`),
    ""
  ].join("\n");
}
function buildRawIndexTemplate(now) {
  return [
    "---",
    `created: ${formatDateTime(now)}`,
    `updated: ${formatDateTime(now)}`,
    "type: index",
    "---",
    "",
    "# \u539F\u59CB\u8D44\u6599\u7D22\u5F15",
    "",
    "> \u539F\u59CB\u8D44\u6599\u5C42\u3002\u77E5\u8BC6\u5E93\u7EF4\u62A4\u65F6\u6B63\u6587\u53EA\u8BFB\u3001\u8DEF\u5F84\u53EF\u6574\u7406\uFF0C\u4ECE\u8FD9\u91CC\u6D88\u5316\u540E\u8F93\u51FA\u5230 wiki/\uFF1B\u666E\u901A Agent \u5BF9\u8BDD\u53EF\u6309\u7528\u6237\u660E\u786E\u6307\u4EE4\u6574\u7406 raw \u6587\u4EF6\u3002",
    "",
    "## articles/",
    "",
    "\u6587\u7AE0\u3001\u7F51\u9875\u3001\u535A\u5BA2\u3001\u516C\u4F17\u53F7\u3001README \u7B49\u6587\u672C\u8D44\u6599\u3002",
    "",
    "- `github-trending/`\uFF1AGitHub Trending \u7B80\u62A5\u3002",
    "- `openai-docs/`\uFF1AOpenAI \u5B98\u65B9\u6587\u6863\u3002",
    "- `wechat-official-accounts/`\uFF1A\u5FAE\u4FE1\u516C\u4F17\u53F7\u5168\u6587\u5F52\u6863\u3002",
    "- `feishu-docs/`\uFF1A\u98DE\u4E66\u6587\u6863\u6458\u5F55\u3002",
    "- `investment/`\uFF1A\u6295\u8D44\u548C\u7B56\u7565\u539F\u59CB\u8D44\u6599\u3002",
    "",
    "## clippings/",
    "",
    "\u526A\u85CF\u3001\u6458\u5F55\u3001\u6807\u6CE8\uFF1B\u6587\u7AE0\u526A\u85CF\u4F18\u5148\u8FDB\u5165 `clippings/articles/`\u3002",
    "",
    "## attachments/",
    "",
    "PDF\u3001\u56FE\u7247\u3001DOCX \u7B49\u9644\u4EF6\u8D44\u6599\u3002",
    ""
  ].join("\n");
}
function buildTrackerTemplate(now) {
  return [
    "---",
    `created: ${formatDateTime(now)}`,
    "source: codex-echoink",
    "---",
    "",
    "# Ingest Tracker",
    "",
    "<!-- codex-echoink-kb:start -->",
    "",
    `## Codex EchoInk \u5904\u7406\u8BB0\u5F55\uFF08${formatDateTime(now)}\uFF09`,
    "",
    "- \u6682\u65E0",
    "",
    "<!-- codex-echoink-kb:end -->",
    ""
  ].join("\n");
}
function buildDomainIndexTemplate(domain, now) {
  return [
    "---",
    `created: ${formatDate(now)}`,
    `updated: ${formatDateTime(now)}`,
    "type: index",
    "---",
    "",
    `# ${domain.title} \u2014 \u7D22\u5F15`,
    "",
    `> ${domain.description}`,
    "",
    "## \u6982\u5FF5",
    "",
    "## \u6307\u5357",
    "",
    "## \u53C2\u8003",
    ""
  ].join("\n");
}
function formatDateTime(date) {
  return date.toISOString().slice(0, 16);
}
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}
function assertAllowedRulesFilePath(relativePath) {
  if (relativePath === DEFAULT_KNOWLEDGE_BASE_RULES_FILE || relativePath === AGENTS_RULES_FILE || relativePath === LEGACY_CLAUDE_RULES_FILE || relativePath === "CLAUDE.kb-template.md") return;
  throw new Error("\u521D\u59CB\u5316\u89C4\u5219\u6587\u4EF6\u8DEF\u5F84\u4E0D\u5408\u6CD5\u3002");
}
async function exists(filePath) {
  return fsp.access(filePath, fs2.constants.F_OK).then(() => true, () => false);
}
function normalizeSlashes(value) {
  return value.split(path3.sep).join("/");
}

// src/knowledge-base/rules-repair.ts
var MINIMUM_RULES_MARKER = "<!-- codex-echoink-kb-minimum-rules:start -->";
var MINIMUM_RULES_END_MARKER = "<!-- codex-echoink-kb-minimum-rules:end -->";
var MINIMUM_RULE_CHECKS = [
  { label: "raw/ \u6B63\u6587\u53EA\u8BFB\u8DEF\u5F84\u6574\u7406\u8FB9\u754C", patterns: [/raw\//i, /(知识库管理|维护任务|维护动作|维护、提炼、体检)/, /(正文只读|禁止改写|不修改正文)/, /(路径可整理|移动|重命名)/] },
  { label: "raw/ \u666E\u901A\u5BF9\u8BDD\u6388\u6743\u8FB9\u754C", patterns: [/raw\//i, /(普通 Agent 对话|普通对话)/, /(明确要求|用户指令|按用户)/] },
  { label: "wiki/ \u957F\u671F\u77E5\u8BC6\u533A", patterns: [/wiki\//i, /(结构化知识|长期知识|主要工作区|可读写|读写)/] },
  { label: "wiki/index.md \u7D22\u5F15\u5165\u53E3", patterns: [/wiki\/index\.md/i] },
  { label: "outputs/.ingest-tracker.md \u8FFD\u8E2A\u8BB0\u5F55", patterns: [/outputs\/\.ingest-tracker\.md|ingest-tracker/i] },
  { label: "\u7EF4\u62A4\u62A5\u544A\u5199\u5165 outputs/", patterns: [/(维护报告|体检报告|报告写入|每日知识库维护报告)/, /outputs\//i] },
  { label: "Structure Normalize \u9636\u6BB5", patterns: [/(Structure Normalize|结构整理)/, /(低风险|同名冲突|断链|只写报告)/] },
  { label: "\u7981\u6B62\u5220\u9664\u6587\u4EF6", patterns: [/(禁止删除|不得删除|不删除)/] }
];
async function repairKnowledgeBaseRulesFile(vaultPath, settings, now = /* @__PURE__ */ new Date()) {
  const rulesFilePath = resolveKnowledgeBaseRulesFilePath(settings);
  const absolutePath = resolveVaultFilePath(vaultPath, rulesFilePath);
  const existed = await exists2(absolutePath);
  if (!existed) {
    await fsp2.mkdir(path4.dirname(absolutePath), { recursive: true });
    await fsp2.writeFile(absolutePath, buildKnowledgeBaseRulesTemplate(now), "utf8");
    return {
      status: "created",
      rulesFilePath,
      missingRules: [],
      summary: `\u5DF2\u521B\u5EFA\u77E5\u8BC6\u5E93\u6307\u5357\uFF1A${rulesFilePath}`
    };
  }
  const current = await fsp2.readFile(absolutePath, "utf8");
  const missingRules = detectMissingKnowledgeBaseRules(current);
  if (!missingRules.length) {
    return {
      status: "ok",
      rulesFilePath,
      missingRules: [],
      summary: `\u77E5\u8BC6\u5E93\u6307\u5357\u53EF\u7528\uFF1A${rulesFilePath}`
    };
  }
  const minimumBlock = buildKnowledgeBaseMinimumRulesBlock(now);
  const patched = replaceMinimumRulesBlock(current, minimumBlock) ?? `${current.trimEnd()}

${minimumBlock}`;
  await fsp2.writeFile(absolutePath, patched, "utf8");
  return {
    status: "patched",
    rulesFilePath,
    missingRules,
    summary: `\u5DF2\u8865\u9F50\u77E5\u8BC6\u5E93\u6307\u5357\uFF1A${rulesFilePath}`
  };
}
function detectMissingKnowledgeBaseRules(content) {
  return MINIMUM_RULE_CHECKS.filter((check) => !check.patterns.every((pattern) => pattern.test(content))).map((check) => check.label);
}
function resolveKnowledgeBaseRulesFilePath(settings) {
  const rawPath = settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE;
  const clean = normalizeRulesPath(rawPath);
  if (!/\.md$/i.test(clean)) throw new Error("\u77E5\u8BC6\u5E93\u6307\u5357\u5FC5\u987B\u662F\u5F53\u524D Vault \u5185\u7684 Markdown \u6587\u4EF6\u3002");
  return clean;
}
function buildKnowledgeBaseMinimumRulesBlock(now) {
  const stamp = now.toISOString().slice(0, 16);
  return [
    MINIMUM_RULES_MARKER,
    "",
    `## Codex \u77E5\u8BC6\u5E93\u6700\u5C0F\u8FD0\u884C\u89C4\u5219`,
    "",
    `> \u81EA\u52A8\u8865\u9F50\u65F6\u95F4\uFF1A${stamp}\u3002\u6A21\u677F\u7248\u672C\uFF1A${KNOWLEDGE_BASE_TEMPLATE_VERSION}\u3002`,
    "",
    "### \u76EE\u5F55\u804C\u8D23",
    "",
    "- `raw/` \u662F\u539F\u59CB\u8D44\u6599\u4E0E\u5F85\u6574\u7406\u6765\u6E90\u533A\uFF1B\u77E5\u8BC6\u5E93\u7BA1\u7406\u4EFB\u52A1\u4E2D\u6B63\u6587\u53EA\u8BFB\u3001\u8DEF\u5F84\u53EF\u6574\u7406\uFF0C\u7981\u6B62\u6539\u5199 raw \u539F\u6587\uFF0C\u7981\u6B62\u5220\u9664 raw\u3002",
    "- \u666E\u901A Agent \u5BF9\u8BDD\u4E2D\uFF0C\u5982\u679C\u7528\u6237\u660E\u786E\u8981\u6C42\u6574\u7406 `raw/`\uFF0C\u4F8B\u5982\u79FB\u52A8\u3001\u5220\u9664\u3001\u5408\u5E76\u3001\u91CD\u547D\u540D\u6216\u91CD\u65B0\u5F52\u7C7B raw \u6587\u4EF6\uFF0C\u53EF\u4EE5\u6309\u7528\u6237\u6307\u4EE4\u548C\u5F53\u524D\u6743\u9650\u6267\u884C\u3002",
    "- `wiki/` \u662F\u957F\u671F\u7ED3\u6784\u5316\u77E5\u8BC6\u533A\uFF0C\u662F Agent \u7684\u4E3B\u8981\u8BFB\u5199\u5DE5\u4F5C\u533A\u3002",
    "- `wiki/index.md` \u662F\u77E5\u8BC6\u5E93\u5165\u53E3\uFF1B\u9886\u57DF\u7D22\u5F15\u4F7F\u7528 `wiki/<\u9886\u57DF>/00-\u7D22\u5F15.md`\u3002",
    "- `outputs/` \u7528\u6765\u4FDD\u5B58\u7EF4\u62A4\u62A5\u544A\u3001\u534F\u4F5C\u4EA7\u7269\u548C `outputs/.ingest-tracker.md`\u3002",
    "- `inbox/` \u662F\u4E34\u65F6\u5165\u53E3\uFF0C\u53EA\u80FD\u6574\u7406\u548C\u5206\u6D41\uFF1B\u9700\u8981\u79FB\u52A8\u3001\u5220\u9664\u6216\u5F52\u6863\u65F6\u5148\u8BA9\u7528\u6237\u786E\u8BA4\u3002",
    "",
    "### \u6BCF\u65E5\u7EF4\u62A4\u6D41\u7A0B",
    "",
    "1. \u5148\u8BFB\u53D6\u672C\u89C4\u5219\u6587\u4EF6\u3001`raw/index.md`\u3001`wiki/index.md`\u3001`outputs/.ingest-tracker.md`\u3002",
    "2. \u7528\u6587\u4EF6\u4FEE\u6539\u65F6\u95F4\u548C tracker \u5BF9\u6BD4\uFF0C\u627E\u51FA\u65B0\u589E\u6216\u53D8\u66F4\u7684 `raw/` \u6587\u4EF6\uFF1B\u8DF3\u8FC7 `.base` \u548C\u9644\u4EF6\u7F13\u5B58\u76EE\u5F55\u3002",
    "3. \u5C06\u53EF\u6D88\u5316\u5185\u5BB9\u5199\u5165 `wiki/<\u9886\u57DF>/`\uFF0C\u4FDD\u7559 raw \u6765\u6E90\u56DE\u94FE\uFF0C\u8865\u5145\u5173\u952E\u6982\u5FF5\u548C\u76F8\u5173 wiki \u53CC\u5411\u94FE\u63A5\u3002",
    "4. \u6267\u884C Structure Normalize\uFF1A\u6574\u7406 `raw/`\u3001`wiki/`\u3001`outputs/`\u3001`inbox/`\u3001`projects/`\uFF0C\u666E\u901A\u7B14\u8BB0\u8FDB\u5165\u5B50\u76EE\u5F55\uFF0C\u6587\u4EF6\u5939\u540D\u5C3D\u91CF\u82F1\u6587\u3002",
    "5. \u66F4\u65B0\u53D7\u5F71\u54CD\u7684\u9886\u57DF\u7D22\u5F15\u3001`wiki/index.md`\u3001`raw/index.md`\u3001`projects/00-\u7D22\u5F15.md` \u548C `outputs/.ingest-tracker.md`\u3002",
    "6. \u6267\u884C Lint\uFF1A\u68C0\u67E5\u65AD\u94FE\u3001\u5B64\u513F\u9875\u3001\u8FC7\u65F6\u6216 draft \u5185\u5BB9\u3001\u6839\u76EE\u5F55\u6563\u843D\u7B14\u8BB0\u3001\u4E2D\u6587\u76EE\u5F55\u6B8B\u7559\u3001\u7D22\u5F15\u94FE\u63A5\u6709\u6548\u6027\u3002",
    "7. \u628A\u7EF4\u62A4\u62A5\u544A\u5199\u5165 `outputs/maintenance/`\uFF0C\u5305\u542B\u65B0\u589E/\u53D8\u66F4\u6587\u4EF6\u3001\u5DF2\u6D88\u5316\u5185\u5BB9\u3001\u7ED3\u6784\u6574\u7406\u3001\u4F53\u68C0\u53D1\u73B0\u548C\u72B6\u6001\u3002",
    "",
    "### \u5B89\u5168\u8FB9\u754C",
    "",
    "- \u77E5\u8BC6\u5E93\u7EF4\u62A4\u3001\u63D0\u70BC\u3001\u4F53\u68C0\u4EFB\u52A1\u4E2D\u7981\u6B62\u6539\u5199 `raw/` \u539F\u6587\uFF0C\u7981\u6B62\u5220\u9664 raw\uFF1B\u5141\u8BB8\u79FB\u52A8\u6216\u91CD\u547D\u540D raw \u8DEF\u5F84\u3002",
    "- \u4F4E\u98CE\u9669\u81EA\u52A8\u6267\u884C\uFF1B\u76EE\u6807\u4E0D\u786E\u5B9A\u3001\u540C\u540D\u51B2\u7A81\u3001\u9644\u4EF6\u4E0D\u5339\u914D\u3001\u4F1A\u65AD\u94FE\u3001\u6D89\u53CA\u5220\u9664/\u5408\u5E76/\u5F52\u6863\u65F6\u53EA\u5199\u62A5\u544A\u3002",
    "- \u4E0D\u8981\u628A\u77E5\u8BC6\u5E93\u7BA1\u7406\u4EFB\u52A1\u7684 raw \u53EA\u8BFB\u8FB9\u754C\u6269\u5C55\u6210\u666E\u901A Agent \u5BF9\u8BDD\u7684\u5168\u5C40\u9650\u5236\u3002",
    "- \u65E0\u6CD5\u5224\u65AD\u5F52\u5C5E\u9886\u57DF\u65F6\u5148\u8DF3\u8FC7\u5E76\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u3002",
    "- \u9ED8\u8BA4\u4E2D\u6587\u56DE\u590D\uFF1B\u5148\u7ED3\u8BBA\uFF0C\u518D\u4F9D\u636E\uFF1B\u4E0D\u7F16\u9020\u6765\u6E90\u3002",
    "",
    MINIMUM_RULES_END_MARKER
  ].join("\n");
}
function replaceMinimumRulesBlock(content, replacement) {
  const start = content.indexOf(MINIMUM_RULES_MARKER);
  const end = content.indexOf(MINIMUM_RULES_END_MARKER);
  if (start < 0 || end < start) return null;
  const endWithMarker = end + MINIMUM_RULES_END_MARKER.length;
  return `${content.slice(0, start).trimEnd()}

${replacement}

${content.slice(endWithMarker).trimStart()}`.trimEnd();
}
function resolveVaultFilePath(vaultPath, relativePath) {
  const vaultRoot = path4.resolve(vaultPath);
  const absolutePath = path4.resolve(vaultRoot, relativePath);
  if (absolutePath !== vaultRoot && !absolutePath.startsWith(`${vaultRoot}${path4.sep}`)) {
    throw new Error("\u77E5\u8BC6\u5E93\u6307\u5357\u8DEF\u5F84\u5FC5\u987B\u5728\u5F53\u524D Vault \u5185\u3002");
  }
  return absolutePath;
}
function normalizeRulesPath(value) {
  const clean = String(value ?? "").replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  return clean || DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
}
async function exists2(filePath) {
  return fsp2.access(filePath, fs3.constants.F_OK).then(() => true, () => false);
}

// src/settings/settings-tab.ts
init_modals();

// src/settings/i18n.ts
var ZH_CN = {
  languageName: "\u4E2D\u6587",
  title: "\u5C0F\u5143 \u52A9\u7406 \u8BBE\u7F6E",
  common: {
    enabled: "\u542F\u7528",
    disabled: "\u5173\u95ED",
    connected: "\u5DF2\u8FDE\u63A5",
    disconnected: "\u672A\u8FDE\u63A5",
    unknown: "\u672A\u77E5",
    current: (value) => `\u5F53\u524D\uFF1A${value}`,
    readFailed: (error) => `\u8BFB\u53D6\u5931\u8D25\uFF1A${error}`,
    partialReadFailed: (error) => `\u90E8\u5206\u8BFB\u53D6\u5931\u8D25\uFF1A${error}`,
    detected: (value) => `\u5DF2\u68C0\u6D4B\uFF1A${value}`,
    notDetectedManual: "\u672A\u68C0\u6D4B\u5230\uFF0C\u53EF\u624B\u52A8\u586B\u5199",
    missing: (items) => `\u7F3A\u5C11\uFF1A${items.join("\uFF0C")}`,
    enableFailed: (items) => `\u65E0\u6CD5\u542F\u7528\uFF1A${items.join("\uFF0C")}`,
    refresh: "\u5237\u65B0",
    loading: "\u8BFB\u53D6\u4E2D",
    delete: "\u5220\u9664",
    clear: "\u6E05\u7A7A"
  },
  mode: {
    title: "\u667A\u80FD\u52A9\u7406\u6A21\u5F0F",
    opencode: "OpenCode \u6A21\u5F0F",
    customApi: "API \u6A21\u5F0F",
    hybrid: "API + OpenCode \u6A21\u5F0F",
    opencodeDesc: "\u6240\u6709\u529F\u80FD\u7531 OpenCode \u63D0\u4F9B",
    customApiDesc: "\u6240\u6709\u529F\u80FD\u7531\u81EA\u5B9A\u4E49 API \u63D0\u4F9B",
    hybridDesc: "\u601D\u8003\u89C4\u5212\u7528 API\uFF0C\u6267\u884C\u64CD\u4F5C\u7528 OpenCode"
  },
  status: {
    codexStatus: "\u8FDE\u63A5\u72B6\u6001",
    accountStatus: "\u8D26\u53F7\u72B6\u6001",
    agentBackend: "Agent \u540E\u7AEF",
    connection: "\u8FDE\u63A5\u65B9\u5F0F",
    cliPath: "CLI \u8DEF\u5F84",
    opencode: "OpenCode",
    currentModel: "\u5F53\u524D\u6A21\u578B",
    proxy: "\u4EE3\u7406",
    chatMcp: "\u804A\u5929 MCP",
    modelCount: "\u6A21\u578B\u6570\u91CF",
    skillsCount: "Skills \u6570\u91CF",
    mcpCount: "MCP \u6570\u91CF",
    pluginDir: "\u63D2\u4EF6\u76EE\u5F55",
    refreshTitle: "\u91CD\u65B0\u8FDE\u63A5 OpenCode\uFF0C\u5E76\u8BFB\u53D6\u6700\u65B0\u72B6\u6001",
    refreshLogin: "\u5237\u65B0\u8FDE\u63A5\u72B6\u6001",
    refreshing: "\u5237\u65B0\u4E2D",
    diagnostics: "\u8FDE\u63A5\u8BCA\u65AD",
    refreshSuccess: (account) => `\u5C0F\u5143 \u5DF2\u5237\u65B0\uFF1A${account}`,
    refreshFailed: (error) => `\u5C0F\u5143 \u8FDE\u63A5\u5931\u8D25\uFF1A${error}`
  },
  tabs: {
    general: "\u57FA\u7840\u8BBE\u7F6E",
    providers: "API \u8BBE\u7F6E",
    resources: "\u5DE5\u4F5C\u533A\u80FD\u529B",
    editorActions: "\u5199\u4F5C\u64CD\u4F5C",
    knowledgeBase: "\u77E5\u8BC6\u5E93\u7BA1\u7406",
    review: "\u590D\u76D8"
  },
  general: {
    settingsLanguage: "\u8BBE\u7F6E\u8BED\u8A00",
    settingsLanguageDesc: "\u53EA\u5F71\u54CD\u8BBE\u7F6E\u9875\u663E\u793A\uFF1B\u4E0D\u4F1A\u6539\u5199 Prompt\u3001\u4F1A\u8BDD\u5185\u5BB9\u6216\u7528\u6237\u81EA\u5B9A\u4E49\u540D\u79F0\u3002",
    agentBackend: "Agent \u540E\u7AEF",
    agentBackendDesc: "\u4F7F\u7528\u672C\u673A OpenCode runtime \u548C\u81EA\u914D Provider\u3002",
    cliPath: "Codex CLI \u8DEF\u5F84",
    cliPathDesc: "\u5FC5\u987B\u5148\u5B89\u88C5\u5E76\u767B\u5F55 Codex CLI\u3002\u81EA\u5B9A\u4E49 API \u4E5F\u901A\u8FC7 Codex CLI app-server \u8C03\u7528\uFF0C\u4E0D\u662F\u63D2\u4EF6\u76F4\u8FDE API\u3002\u7559\u7A7A\u65F6\u81EA\u52A8\u67E5\u627E\u3002",
    proxyEnabled: "\u542F\u7528\u672C\u5730\u4EE3\u7406",
    proxyEnabledDesc: "\u53EA\u5F71\u54CD\u63D2\u4EF6\u542F\u52A8\u7684\u8FDB\u7A0B\uFF0C\u4E0D\u6539\u5168\u5C40\u914D\u7F6E\u3002",
    proxyUrl: "\u4EE3\u7406\u5730\u5740",
    proxyUrlDesc: "\u5982\u9700\u672C\u673A\u4EE3\u7406\uFF0C\u53EF\u586B\u5199 Clash \u7B49\u4EE3\u7406\u5730\u5740\u3002",
    mcpEnabled: "\u542F\u7528 MCP \u5DE5\u5177",
    mcpEnabledDesc: "\u9ED8\u8BA4\u5173\u95ED\u4EE5\u52A0\u5FEB\u666E\u901A\u804A\u5929\uFF1B\u53EA\u5F71\u54CD\u804A\u5929\u7EBF\u7A0B\u3002",
    defaultModel: "\u9ED8\u8BA4\u6A21\u578B",
    defaultModelDesc: "\u7559\u7A7A\u65F6\u4F7F\u7528\u9ED8\u8BA4\u6A21\u578B\u3002",
    auto: "\u81EA\u52A8",
    defaultReasoning: "\u9ED8\u8BA4\u601D\u8003\u5F3A\u5EA6",
    defaultSpeed: "\u9ED8\u8BA4\u901F\u5EA6",
    defaultPermission: "\u9ED8\u8BA4\u6587\u4EF6\u6743\u9650",
    defaultMode: "\u9ED8\u8BA4\u6A21\u5F0F",
    autoOpen: "\u542F\u52A8\u65F6\u81EA\u52A8\u6253\u5F00\u4FA7\u680F",
    showContext: "\u663E\u793A\u4E0A\u4E0B\u6587\u5BB9\u91CF",
    reconnect: "\u91CD\u65B0\u8FDE\u63A5",
    languageOptions: {
      "zh-CN": "\u4E2D\u6587",
      en: "English"
    },
    serviceTierOptions: {
      standard: "\u6807\u51C6",
      fast: "\u5FEB\u901F",
      flex: "\u5F39\u6027"
    },
    permissionOptions: {
      "read-only": "\u53EA\u8BFB",
      "workspace-write": "\u5DE5\u4F5C\u533A\u53EF\u5199",
      "danger-full-access": "\u5B8C\u5168\u653E\u5F00"
    },
    modeOptions: {
      agent: "Agent",
      plan: "Plan"
    }
  },
  knowledge: {
    title: "\u77E5\u8BC6\u5E93\u7BA1\u7406",
    safety: "\u77E5\u8BC6\u5E93\u7BA1\u7406\u8FB9\u754C\uFF1A\u7EF4\u62A4\u3001\u63D0\u70BC\u3001\u4F53\u68C0\u65F6\u5141\u8BB8\u5199 wiki/ \u548C outputs/\uFF0Craw/ \u6B63\u6587\u53EA\u8BFB\uFF1B\u666E\u901A Agent \u5BF9\u8BDD\u53EF\u6309\u4F60\u7684\u660E\u786E\u6307\u4EE4\u6574\u7406 raw\u3002OpenCode \u6A21\u5F0F\u9700\u8981\u5148\u5916\u90E8\u5B89\u88C5 OpenCode\u3002",
    statusHeading: "\u8FD0\u884C\u72B6\u6001",
    recentStatus: (status, time) => `\u6700\u8FD1\u72B6\u6001\uFF1A${status}${time ? ` \xB7 ${time}` : ""}`,
    initialization: (status, path21) => `\u521D\u59CB\u5316\uFF1A${status}${path21 ? ` \xB7 ${path21}` : ""}`,
    guide: (path21, custom) => `\u64CD\u4F5C\u6307\u5357\uFF1A${path21}${custom ? "\uFF08\u81EA\u5B9A\u4E49\uFF09" : "\uFF08AGENTS \u517C\u5BB9\uFF09"}`,
    recentReport: (path21) => `\u6700\u8FD1\u62A5\u544A\uFF1A${path21}`,
    openChannel: "\u6253\u5F00\u77E5\u8BC6\u5E93\u9891\u9053",
    initChannel: "\u521D\u59CB\u5316\u77E5\u8BC6\u5E93",
    commandHeading: "\u5FEB\u6377\u547D\u4EE4",
    commandGuide: [
      { command: "/ask ...", description: "\u5BF9\u77E5\u8BC6\u5E93\u53D1\u95EE" },
      { command: "/check ...", description: "\u53EA\u4F53\u68C0\u77E5\u8BC6\u5E93" },
      { command: "/maintain ...", description: "\u7EF4\u62A4 raw \u5230 wiki" },
      { command: "/outputs ...", description: "\u5904\u7406 outputs \u5E76\u63D0\u70BC\u957F\u671F\u4EF7\u503C" },
      { command: "/inbox ...", description: "\u6574\u7406\u6536\u4EF6\u7BB1" },
      { command: "/journal ...", description: "\u5199\u65E5\u8BB0" },
      { command: "/week", description: "\u5199\u77E5\u8BC6\u5E93\u5468\u62A5\uFF1B/week agent \u5199 Agent \u5468\u62A5" },
      { command: "/clear", description: "\u6E05\u7A7A\u5F53\u524D\u9875\u9762\uFF0C\u4FDD\u7559\u5386\u53F2" },
      { command: "/history", description: "\u6309\u5929\u67E5\u770B\u5386\u53F2" },
      { command: "/init", description: "\u9884\u89C8\u521D\u59CB\u5316\uFF1B/init confirm \u624D\u6267\u884C" },
      { command: "/help", description: "\u663E\u793A\u8FD9\u4EFD\u547D\u4EE4\u8BF4\u660E" }
    ],
    enabled: "\u542F\u7528\u77E5\u8BC6\u5E93\u7BA1\u7406",
    enabledDesc: "\u603B\u5F00\u5173\uFF1A\u53EA\u51B3\u5B9A\u662F\u5426\u5141\u8BB8\u6BCF\u65E5\u81EA\u52A8\u7EF4\u62A4\u548C\u542F\u52A8\u8865\u8DD1\uFF1B\u771F\u6B63\u6BCF\u5929\u8DD1\uFF0C\u8FD8\u9700\u8981\u6253\u5F00\u4E0B\u9762\u7684\u201C\u6BCF\u65E5\u81EA\u52A8\u7EF4\u62A4\u201D\u3002\u53F3\u4FA7\u77E5\u8BC6\u5E93\u9891\u9053\u4ECD\u53EF\u624B\u52A8\u4F7F\u7528\u3002",
    backend: "\u77E5\u8BC6\u5E93\u540E\u7AEF",
    backendDesc: "\u9ED8\u8BA4\u8DDF\u968F\u57FA\u7840\u8BBE\u7F6E\u91CC\u7684 Agent \u540E\u7AEF\uFF1B\u4E5F\u53EF\u4EE5\u5355\u72EC\u56FA\u5B9A\u4E3A Codex \u6216 OpenCode\u3002",
    followGlobal: (backend) => `\u8DDF\u968F\u5168\u5C40\uFF08${backend}\uFF09`,
    customRules: "\u4F7F\u7528\u81EA\u5B9A\u4E49\u6307\u5357\u6587\u4EF6",
    customRulesDesc: (defaultFile, agentsFile) => `\u9ED8\u8BA4\u4F7F\u7528 ${defaultFile}\uFF1B\u5173\u95ED\u540E\u6539\u7528 Vault \u6839\u76EE\u5F55 ${agentsFile}\uFF0C\u4EC5\u4F5C\u4E3A\u517C\u5BB9\u9009\u9879\u3002`,
    dailyMaintenance: "\u6BCF\u65E5\u81EA\u52A8\u7EF4\u62A4",
    dailyMaintenanceDesc: "\u6253\u5F00\u540E\uFF0C\u5230\u8FBE\u6BCF\u65E5\u8FD0\u884C\u65F6\u95F4\u4F1A\u6267\u884C /maintain\uFF1B\u4EC5\u5728 Obsidian \u6253\u5F00\u65F6\u8FD0\u884C\u3002\u5B8C\u6210\u540E\u4F1A\u5728\u77E5\u8BC6\u5E93\u9891\u9053\u5199\u5165\u7B80\u77ED\u62A5\u544A\u3002",
    scheduleTime: "\u6BCF\u65E5\u8FD0\u884C\u65F6\u95F4",
    catchUp: "\u542F\u52A8\u8865\u8DD1",
    catchUpDesc: "\u5F53\u5929\u9519\u8FC7\u7EF4\u62A4\u65F6\u95F4\u65F6\uFF0C\u4E0B\u6B21\u6253\u5F00 Obsidian \u81EA\u52A8\u8865\u8DD1\u3002",
    opencodeMode: "OpenCode API \u6A21\u5F0F",
    detection: (value) => `\u68C0\u6D4B\u7ED3\u679C\uFF1A${value}`,
    opencodePath: "OpenCode \u8DEF\u5F84",
    serverUrl: "\u5DF2\u6709 Server \u5730\u5740",
    autoStartServer: "\u81EA\u52A8\u542F\u52A8 OpenCode server",
    modelCapabilities: (text, image, pdf) => `\u6A21\u578B\u80FD\u529B\uFF1A\u6587\u672C ${text ? "\u2713" : "\xD7"} \xB7 \u56FE\u7247 ${image ? "\u2713" : "\xD7"} \xB7 PDF ${pdf ? "\u2713" : "\xD7"}`,
    testConnection: "\u6D4B\u8BD5\u8FDE\u63A5",
    channelNote: "\u7EF4\u62A4\u3001\u4F53\u68C0\u3001\u6536\u96C6\u94FE\u63A5\u3001\u8BB0\u5F55\u60F3\u6CD5\u3001\u6536\u96C6\u56FE\u7247/PDF \u90FD\u5728\u53F3\u4FA7\u201C\u77E5\u8BC6\u5E93\u7BA1\u7406\u201D\u9891\u9053\u91CC\u7528\u81EA\u7136\u8BED\u8A00\u6267\u884C\uFF1B\u8BBE\u7F6E\u9875\u53EA\u8D1F\u8D23\u914D\u7F6E\u548C\u72B6\u6001\u3002",
    rulesFile: "\u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357\u6587\u4EF6",
    chooseRulesTitle: "\u4ECE\u5F53\u524D Vault \u9009\u62E9 Markdown \u6587\u4EF6",
    chooseFile: "\u9009\u62E9\u6587\u4EF6",
    useRulesFile: (file) => `\u4F7F\u7528 ${file}`,
    repairRules: "\u68C0\u67E5\u5E76\u4FEE\u590D",
    repairRulesTitle: "\u68C0\u67E5\u6307\u5357\u6587\u4EF6\u662F\u5426\u7F3A\u5931\u5FC5\u8981\u77E5\u8BC6\u5E93\u89C4\u5219\uFF1B\u7F3A\u5931\u65F6\u81EA\u52A8\u521B\u5EFA\u6216\u8865\u9F50",
    rulesFileNoteCustom: (file, agentsFile) => `\u77E5\u8BC6\u5E93\u4EFB\u52A1\u4EE5 ${file} \u4E3A\u7ED3\u6784\u771F\u6E90\uFF1B${agentsFile} \u53EA\u4FDD\u7559\u8FD0\u884C\u5C42\u80CC\u666F\u3002`,
    rulesFileNoteLegacy: (agentsFile, defaultFile) => `\u517C\u5BB9\u6A21\u5F0F\uFF1A\u77E5\u8BC6\u5E93\u4EFB\u52A1\u8BFB\u53D6 Vault \u6839\u76EE\u5F55 ${agentsFile}\u3002\u5EFA\u8BAE\u6539\u7528 ${defaultFile}\u3002`,
    memoryHeading: "\u957F\u671F\u8BB0\u5FC6\u589E\u5F3A",
    memoryNote1: "\u77E5\u8BC6\u5E93\u7BA1\u7406\u4E0D\u5185\u7F6E\u8BB0\u5FC6 Skills\uFF0C\u4E5F\u4E0D\u4F1A\u4FEE\u6539\u5F53\u524D Vault \u7684 AGENTS.md\u3002\u9700\u8981\u8DE8\u4F1A\u8BDD\u7EF4\u62A4\u957F\u671F\u4E0A\u4E0B\u6587\u65F6\uFF0C\u5EFA\u8BAE\u624B\u52A8\u5B89\u88C5 codex-memory-lite\u3002",
    memoryNote2: "\u4F7F\u7528\u65B9\u5F0F\uFF1A\u8BA9\u4F60\u7684 Codex/OpenCode Agent \u6309\u4ED3\u5E93\u8BF4\u660E\u5B89\u88C5\u8FD9\u4E2A Skill\uFF1B\u8FDB\u5165\u5BF9\u5E94\u5DE5\u4F5C\u533A\u540E\uFF0C\u7531 Agent \u81EA\u5DF1\u8FD0\u884C bootstrap \u521D\u59CB\u5316\u8BB0\u5FC6\u4F53\u7CFB\uFF0C\u518D\u5728 /init\u3001/check\u3001/maintain \u65F6\u6309\u9700\u540C\u6B65\u9879\u76EE\u8BB0\u5FC6\u3002",
    openMemorySkill: "\u6253\u5F00 codex-memory-lite",
    storageHeading: "\u5386\u53F2\u4E0E\u5B58\u50A8",
    storageLoading: "\u6B63\u5728\u7EDF\u8BA1\u5386\u53F2\u6570\u636E...",
    storageStats: (dataJson, history, raw, messages, days) => `data.json ${dataJson} \xB7 history ${history} \xB7 raw ${raw} \xB7 ${messages} \u6761\u6D88\u606F / ${days} \u5929`,
    rebuildHistory: "\u91CD\u5EFA\u5386\u53F2\u7D22\u5F15",
    exportHistory: "\u5BFC\u51FA\u5386\u53F2",
    compactHistory: "\u538B\u7F29\u65E7\u8FC7\u7A0B\u8BB0\u5F55",
    historyRebuilt: "\u5386\u53F2\u7D22\u5F15\u5DF2\u91CD\u5EFA",
    historyExported: (path21) => `\u5386\u53F2\u5DF2\u5BFC\u51FA\uFF1A${path21}`,
    historyCompacted: (count) => `\u5DF2\u538B\u7F29 ${count} \u6761\u65E7\u8FC7\u7A0B\u8BB0\u5F55`,
    repairSummary: (status, path21) => {
      if (status === "created") return `\u5DF2\u521B\u5EFA\u77E5\u8BC6\u5E93\u6307\u5357\uFF1A${path21}`;
      if (status === "patched") return `\u5DF2\u8865\u9F50\u77E5\u8BC6\u5E93\u6307\u5357\uFF1A${path21}`;
      return `\u77E5\u8BC6\u5E93\u6307\u5357\u53EF\u7528\uFF1A${path21}`;
    },
    repairPatchedDetail: (count) => `\uFF0C\u8865\u9F50 ${count} \u9879`,
    repairFailed: (error) => `\u4FEE\u590D\u5931\u8D25\uFF1A${error}`,
    noMarkdownFiles: "\u5F53\u524D Vault \u6CA1\u6709\u53EF\u9009\u7684 Markdown \u6587\u4EF6\u3002",
    selectedRulesFile: (path21) => `\u5DF2\u9009\u62E9\u77E5\u8BC6\u5E93\u6307\u5357\uFF1A${path21}`,
    filePickerPlaceholder: "\u9009\u62E9\u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357 Markdown \u6587\u4EF6",
    filePickerEmpty: "\u5F53\u524D Vault \u6CA1\u6709\u5339\u914D\u7684 Markdown \u6587\u4EF6",
    statusLabels: {
      idle: "\u672A\u8FD0\u884C",
      running: "\u8FD0\u884C\u4E2D",
      success: "\u6210\u529F",
      failed: "\u5931\u8D25",
      canceled: "\u5DF2\u53D6\u6D88"
    },
    initStatusLabels: {
      "not-started": "\u672A\u521D\u59CB\u5316",
      "preview-ready": "\u5DF2\u751F\u6210\u9884\u89C8",
      initialized: "\u5DF2\u521D\u59CB\u5316",
      failed: "\u5931\u8D25"
    }
  },
  review: {
    title: "\u590D\u76D8",
    generateHeading: "\u751F\u6210\u5468\u62A5",
    generateAgent: "\u751F\u6210 Agent \u5468\u62A5",
    generateKnowledge: "\u751F\u6210\u77E5\u8BC6\u5E93\u5468\u62A5",
    pathsHeading: "\u5B58\u653E\u8DEF\u5F84",
    outputDir: "\u8F93\u51FA\u76EE\u5F55",
    knowledgeMarkdown: "\u77E5\u8BC6\u5E93 Markdown",
    knowledgeHtml: "\u77E5\u8BC6\u5E93 HTML",
    agentMarkdown: "Agent Markdown",
    agentHtml: "Agent HTML",
    settingsHeading: "\u5468\u62A5\u8BBE\u7F6E",
    confirmTitle: (label) => label,
    confirmBody: (report, outputDir) => `\u786E\u5B9A\u751F\u6210${report}\uFF1F

\u8F93\u51FA\u76EE\u5F55\uFF1A${outputDir}`,
    generate: "\u751F\u6210",
    cancel: "\u53D6\u6D88",
    reportLabels: {
      "knowledge-base": "\u77E5\u8BC6\u5E93\u5468\u62A5",
      "agent-chat": "Agent \u5468\u62A5"
    },
    rangeMode: "\u7EDF\u8BA1\u5468\u671F",
    rangeOptions: {
      "previous-week": "\u4E0A\u4E00\u5B8C\u6574\u5468",
      "current-week": "\u672C\u5468\u81F3\u4ECA"
    },
    openHtmlAfterRun: "\u751F\u6210\u540E\u6253\u5F00 HTML"
  },
  providers: {
    title: "API \u8BBE\u7F6E",
    opencodeMode: "OpenCode API \u6A21\u5F0F",
    customApiMode: "\u81EA\u5B9A\u4E49 API \u6A21\u5F0F",
    warningKey: "API key \u4F1A\u660E\u6587\u4FDD\u5B58\u5728 Obsidian \u63D2\u4EF6\u6570\u636E\u91CC\uFF1B\u53EA\u5EFA\u8BAE\u672C\u673A\u4F7F\u7528\uFF0C\u4E0D\u5EFA\u8BAE\u540C\u6B65\u6216\u63D0\u4EA4\u3002",
    warningApi: "\u81EA\u5B9A\u4E49 API \u4ECD\u9700\u8981\u672C\u673A Codex CLI\u3002Base URL \u5FC5\u987B\u517C\u5BB9 OpenAI Responses API\uFF1B\u53EA\u652F\u6301 /v1/chat/completions \u7684\u901A\u7528 OpenAI \u683C\u5F0F\u901A\u5E38\u4E0D\u53EF\u7528\u3002",
    loginMode: "Codex \u767B\u5F55\u6001",
    add: "\u65B0\u589E",
    addTitle: "\u65B0\u589E API Provider",
    defaultName: "\u81EA\u5B9A\u4E49 API",
    empty: "\u8FD8\u6CA1\u6709\u81EA\u5B9A\u4E49 API Provider\u3002",
    unnamed: "\u672A\u547D\u540D Provider",
    active: "\u5DF2\u542F\u7528",
    enableReconnect: "\u542F\u7528\u5E76\u91CD\u8FDE",
    deleteConfirm: (name) => `\u5220\u9664 ${name || "\u8FD9\u4E2A Provider"}\uFF1F`,
    name: "\u540D\u79F0",
    namePlaceholder: "\u4F8B\u5982 OpenAI API",
    baseUrl: "Base URL",
    apiKey: "API key",
    queryParams: "Query Params",
    responseApiRequirement: "\u8981\u6C42\uFF1A\u670D\u52A1\u7AEF\u9700\u652F\u6301 Responses API\uFF0C\u4F8B\u5982 /v1/responses\uFF1B\u53EA\u652F\u6301 Chat Completions \u7684\u670D\u52A1\u53EF\u80FD\u65E0\u6CD5\u4F7F\u7528\u3002",
    models: "\u6A21\u578B",
    configChanged: "\u4FEE\u6539\u914D\u7F6E\u540E\uFF0C\u9700\u8981\u518D\u6B21\u70B9\u51FB\u201C\u542F\u7528\u5E76\u91CD\u8FDE\u201D\u624D\u4F1A\u8BA9\u5F53\u524D Codex \u8FDB\u7A0B\u751F\u6548\u3002"
  },
  writing: {
    requestMode: "\u5199\u4F5C\u8BF7\u6C42\u65B9\u5F0F",
    requestModeDesc: "\u901A\u8FC7\u5F53\u524D Codex CLI \u53D1\u8D77\u8BF7\u6C42\uFF1B\u81EA\u5B9A\u4E49 API \u4ECD\u9700\u672C\u673A Codex CLI \u652F\u6301 Responses API\u3002",
    enabled: "\u542F\u7528\u5199\u4F5C\u64CD\u4F5C",
    enabledDesc: "\u5F00\u542F\u540E\uFF0C\u7F16\u8F91\u533A\u9009\u4E2D\u6587\u5B57\u53F3\u952E\u53EF\u9009\u62E9\u6539\u5199\u3001\u6269\u5199\u3001\u7EED\u5199\u3001\u7FFB\u8BD1\u6210\u82F1\u6587\u3002",
    statusSlot: "\u663E\u793A\u4FA7\u680F\u5199\u4F5C\u72B6\u6001",
    statusSlotDesc: "\u53EA\u5728\u53F3\u952E\u5199\u4F5C\u64CD\u4F5C\u8FD0\u884C\u65F6\u663E\u793A\u7B49\u5F85\u548C\u786E\u8BA4\u72B6\u6001\u3002",
    contextPanel: "\u663E\u793A\u5199\u4F5C\u4E0A\u4E0B\u6587\u9762\u677F",
    contextPanelDesc: "\u70B9\u51FB\u4FA7\u680F\u9876\u90E8\u5199\u4F5C\u72B6\u6001\u65F6\uFF0C\u5C55\u793A\u6587\u7AE0\u7406\u89E3\u3001\u6A21\u5F0F\u548C\u6A21\u578B\u4FE1\u606F\u3002",
    quality: "\u9ED8\u8BA4\u5199\u4F5C\u8D28\u91CF",
    qualityDesc: "\u5FEB\u901F\u76F4\u63A5\u751F\u6210\uFF1B\u8D28\u91CF\u4F1A\u5148\u7406\u89E3\u6587\u7AE0\uFF1B\u4E25\u683C\u4F1A\u989D\u5916\u5BA1\u6821\u5019\u9009\u3002",
    style: "\u9ED8\u8BA4\u5199\u4F5C\u98CE\u683C",
    maxSelectedChars: "\u6700\u5927\u9009\u533A\u5B57\u6570",
    timeoutSeconds: "\u8D85\u65F6\u65F6\u95F4\uFF08\u79D2\uFF09",
    cache: "\u6587\u7AE0\u7406\u89E3\u7F13\u5B58",
    cacheDesc: (count) => `\u5F53\u524D\u7F13\u5B58 ${count} \u7BC7\u6587\u7AE0\u7406\u89E3\u3002`,
    actionsHeading: "\u53F3\u952E\u52A8\u4F5C",
    enabledMeta: "\u5DF2\u542F\u7528",
    disabledMeta: "\u5DF2\u5173\u95ED",
    name: "\u540D\u79F0",
    actionNamePlaceholder: "\u6539\u5199",
    promptTemplate: "Prompt \u6A21\u677F",
    promptPlaceholder: "\u8BF7\u5904\u7406\uFF1A{{selected_text}}",
    qualityModesHeading: "\u5199\u4F5C\u8D28\u91CF\u6A21\u5F0F",
    model: "\u6A21\u578B",
    contextBefore: "\u9009\u533A\u524D\u6587\u5B57\u7B26\u6570",
    contextAfter: "\u9009\u533A\u540E\u6587\u5B57\u7B26\u6570",
    stylesHeading: "\u5199\u4F5C\u98CE\u683C",
    addStyle: "\u65B0\u589E\u98CE\u683C",
    defaultStyleLabel: "\u81EA\u5B9A\u4E49\u98CE\u683C",
    defaultStyleInstruction: "\u6309\u6211\u7684\u4E2A\u4EBA\u8868\u8FBE\u4E60\u60EF\u6539\u5199\u3002",
    styleNamePlaceholder: "\u6E05\u695A",
    styleInstruction: "\u98CE\u683C\u8BF4\u660E",
    styleInstructionPlaceholder: "\u8868\u8FBE\u6E05\u695A\u3001\u51C6\u786E\u3001\u81EA\u7136\u3002",
    qualityModes: {
      fast: { label: "\u5FEB\u901F", desc: "\u77ED\u53E5\u6DA6\u8272\uFF0C\u76F4\u63A5\u751F\u6210" },
      quality: { label: "\u8D28\u91CF", desc: "\u5148\u7406\u89E3\u6587\u7AE0\uFF0C\u518D\u751F\u6210" },
      strict: { label: "\u4E25\u683C", desc: "\u7406\u89E3\u3001\u751F\u6210\u3001\u5BA1\u6821" }
    }
  },
  opencode: {
    model: "OpenCode \u6A21\u578B",
    chooseModel: "\u9009\u62E9 OpenCode \u6A21\u578B",
    currentModelMissing: (providerId, modelId) => `\u5F53\u524D\uFF1A${providerId}/${modelId}\uFF08\u672A\u5728\u5217\u8868\uFF09`,
    modelLoading: "\u6B63\u5728\u8BFB\u53D6 OpenCode \u6A21\u578B...",
    refreshModelHint: "\u70B9\u51FB\u5237\u65B0\u6A21\u578B\u540E\u9009\u62E9\u3002",
    refreshModels: "\u5237\u65B0\u6A21\u578B",
    selectedModel: (name, capabilities) => `\u5DF2\u9009\u62E9\uFF1A${name}\u3002${capabilities}`,
    modelNote: "\u9009\u62E9\u540E\u4F1A\u81EA\u52A8\u5199\u5165 Provider ID\u3001Model ID \u548C\u6A21\u578B\u80FD\u529B\u3002Provider ID / Model ID \u4ECD\u53EF\u624B\u52A8\u515C\u5E95\u3002",
    chooseAgent: "\u9009\u62E9 OpenCode Agent",
    currentAgentMissing: (name) => `\u5F53\u524D\uFF1A${name}\uFF08\u672A\u5728\u5217\u8868\uFF09`,
    manualAgent: "\u624B\u52A8\u586B\u5199 OpenCode Agent",
    refreshAgent: "\u5237\u65B0 Agent",
    selectedAgent: (name, mode, desc) => `\u5DF2\u9009\u62E9\uFF1A${name}\u3002${mode}${desc ? ` \xB7 ${desc}` : ""}`,
    agentMissing: (name) => `\u5F53\u524D Agent "${name}" \u4E0D\u5728 OpenCode \u5217\u8868\uFF0C\u5EFA\u8BAE\u4ECE\u4E0B\u62C9\u9009\u62E9\u4E00\u4E2A\u53EF\u7528 Agent\u3002`,
    agentHint: "\u70B9\u51FB\u5237\u65B0 Agent \u540E\u53EF\u4E0B\u62C9\u9009\u62E9\uFF1B\u8BFB\u53D6\u5931\u8D25\u65F6\u53EF\u4EE5\u7EE7\u7EED\u624B\u52A8\u586B\u5199\u3002",
    host: "Host",
    port: "Port",
    providerId: "Provider ID",
    modelId: "Model ID",
    agent: "Agent",
    readSuccess: (parts) => parts.length ? `\u5DF2\u8BFB\u53D6 OpenCode\uFF1A${parts.join("\uFF0C")}` : "OpenCode \u5DF2\u8FDE\u63A5",
    modelsCount: (count) => `${count} \u4E2A\u6A21\u578B`,
    agentsCount: (count) => `${count} \u4E2A Agent`,
    readFailed: (error) => `OpenCode \u8BFB\u53D6\u5931\u8D25\uFF1A${error}`
  },
  resources: {
    title: "\u5DE5\u4F5C\u533A\u80FD\u529B\u7BA1\u7406",
    note: "\u8FD9\u91CC\u53EA\u6539\u5F53\u524D Obsidian \u4ED3\u5E93\u7684\u7EBF\u7A0B\u914D\u7F6E\u3002",
    tabs: {
      plugins: "\u63D2\u4EF6",
      mcp: "MCP",
      skills: "Skills"
    },
    refreshTitle: "\u5237\u65B0\u5F53\u524D\u5217\u8868",
    loadingTab: (label) => `\u6B63\u5728\u8BFB\u53D6 ${label}...`,
    notLoaded: "\u5C1A\u672A\u8BFB\u53D6\u80FD\u529B\u5217\u8868\u3002",
    searchPlaceholder: (label) => `\u641C\u7D22 ${label}`,
    searchAria: "\u641C\u7D22\u5F53\u524D\u80FD\u529B\u5217\u8868",
    clearSearch: "\u6E05\u7A7A\u641C\u7D22",
    installed: "\u5DF2\u5B89\u88C5",
    notInstalled: "\u672A\u5B89\u88C5",
    noPlugins: "\u6CA1\u6709\u8BFB\u53D6\u5230\u63D2\u4EF6\u3002",
    noPluginMatches: "\u6CA1\u6709\u5339\u914D\u7684\u63D2\u4EF6\u3002",
    toolsCount: (count) => `${count} \u4E2A\u5DE5\u5177`,
    mcpDesc: "\u6765\u81EA MCP \u914D\u7F6E",
    mcpDisabledWarning: "\u804A\u5929 MCP \u603B\u5F00\u5173\u5F53\u524D\u5173\u95ED\uFF1B\u5355\u9879\u5F00\u5173\u4F1A\u4FDD\u5B58\uFF0C\u6253\u5F00\u603B\u5F00\u5173\u540E\u751F\u6548\u3002",
    noMcp: "\u6CA1\u6709\u8BFB\u53D6\u5230 MCP \u670D\u52A1\u5668\u3002",
    noMcpMatches: "\u6CA1\u6709\u5339\u914D\u7684 MCP \u670D\u52A1\u5668\u3002",
    noDesc: "\u65E0\u63CF\u8FF0",
    noSkills: "\u6CA1\u6709\u8BFB\u53D6\u5230 Skills\u3002",
    noSkillMatches: "\u6CA1\u6709\u5339\u914D\u7684 Skill\u3002",
    summary: (enabled, total, visible, searching) => searching ? `\u5DF2\u5141\u8BB8 ${enabled} / ${total} \xB7 \u663E\u793A ${visible}` : `\u5DF2\u5141\u8BB8 ${enabled} / ${total}`,
    toggleAria: (name) => `${name} \u5F00\u5173`,
    codexDisconnected: "\u5C0F\u5143 \u672A\u8FDE\u63A5"
  },
  backendLabels: {
    "codex-cli": "Codex CLI",
    opencode: "OpenCode API"
  },
  knowledgeBackendLabels: {
    "codex-cli": "Codex CLI",
    opencode: "OpenCode API"
  }
};
var EN = {
  languageName: "English",
  title: "XiaoYuan Assistant Settings",
  common: {
    enabled: "Enabled",
    disabled: "Off",
    connected: "Connected",
    disconnected: "Disconnected",
    unknown: "Unknown",
    current: (value) => `Current: ${value}`,
    readFailed: (error) => `Failed to load: ${error}`,
    partialReadFailed: (error) => `Some items failed: ${error}`,
    detected: (value) => `Detected: ${value}`,
    notDetectedManual: "Not found. Enter manually.",
    missing: (items) => `Missing: ${items.join(", ")}`,
    enableFailed: (items) => `Cannot enable: ${items.join(", ")}`,
    refresh: "Refresh",
    loading: "Loading",
    delete: "Delete",
    clear: "Clear"
  },
  mode: {
    title: "Assistant Mode",
    opencode: "OpenCode Mode",
    customApi: "API Mode",
    hybrid: "API + OpenCode Mode",
    opencodeDesc: "All features provided by OpenCode",
    customApiDesc: "All features provided by custom API",
    hybridDesc: "Thinking & planning with API, execution with OpenCode"
  },
  status: {
    codexStatus: "Status",
    accountStatus: "Account",
    agentBackend: "Agent backend",
    connection: "Connection",
    cliPath: "CLI path",
    opencode: "OpenCode",
    currentModel: "Current model",
    proxy: "Proxy",
    chatMcp: "Chat MCP",
    modelCount: "Models",
    skillsCount: "Skills",
    mcpCount: "MCP",
    pluginDir: "Plugin dir",
    refreshTitle: "Reconnect OpenCode and refresh status",
    refreshLogin: "Refresh connection",
    refreshing: "Refreshing",
    diagnostics: "Connection diagnostic",
    refreshSuccess: (account) => `XiaoYuan refreshed: ${account}`,
    refreshFailed: (error) => `XiaoYuan failed: ${error}`
  },
  tabs: {
    general: "General",
    providers: "API Settings",
    resources: "Capabilities",
    editorActions: "Writing",
    knowledgeBase: "Knowledge",
    review: "Review"
  },
  general: {
    settingsLanguage: "Settings language",
    settingsLanguageDesc: "Only changes this settings page. Prompts, chats, and custom names are unchanged.",
    agentBackend: "Agent backend",
    agentBackendDesc: "Uses local OpenCode runtime and configured providers.",
    cliPath: "Codex CLI path",
    cliPathDesc: "Install and sign in to Codex CLI first. Custom APIs still run through Codex CLI app-server, not direct plugin calls. Leave empty to auto-detect.",
    proxyEnabled: "Use local proxy",
    proxyEnabledDesc: "Only affects the plugin's process. It does not change global config.",
    proxyUrl: "Proxy URL",
    proxyUrlDesc: "Use this for local proxies such as Clash.",
    mcpEnabled: "Enable MCP tools",
    mcpEnabledDesc: "Off by default for faster chat. Only affects chat threads.",
    defaultModel: "Default model",
    defaultModelDesc: "Leave empty to use the default.",
    auto: "Auto",
    defaultReasoning: "Default reasoning",
    defaultSpeed: "Default speed",
    defaultPermission: "Default file access",
    defaultMode: "Default mode",
    autoOpen: "Open sidebar on startup",
    showContext: "Show context usage",
    reconnect: "Reconnect",
    languageOptions: {
      "zh-CN": "\u4E2D\u6587",
      en: "English"
    },
    serviceTierOptions: {
      standard: "Standard",
      fast: "Fast",
      flex: "Flex"
    },
    permissionOptions: {
      "read-only": "Read only",
      "workspace-write": "Workspace write",
      "danger-full-access": "Full access"
    },
    modeOptions: {
      agent: "Agent",
      plan: "Plan"
    }
  },
  knowledge: {
    title: "Knowledge",
    safety: "Knowledge management boundary: maintenance, digest, and lint runs can write wiki/ and outputs/, while raw/ source bodies stay read-only. Ordinary Agent chat can organize raw when you explicitly ask. OpenCode mode requires OpenCode installed separately.",
    statusHeading: "Run status",
    recentStatus: (status, time) => `Latest: ${status}${time ? ` \xB7 ${time}` : ""}`,
    initialization: (status, path21) => `Initialization: ${status}${path21 ? ` \xB7 ${path21}` : ""}`,
    guide: (path21, custom) => `Guide: ${path21}${custom ? " (custom)" : " (AGENTS fallback)"}`,
    recentReport: (path21) => `Latest report: ${path21}`,
    openChannel: "Open Knowledge channel",
    initChannel: "Initialize Knowledge",
    commandHeading: "Shortcuts",
    commandGuide: [
      { command: "/ask ...", description: "Ask the knowledge base" },
      { command: "/check ...", description: "Run a read-only health check" },
      { command: "/maintain ...", description: "Digest raw into wiki" },
      { command: "/outputs ...", description: "Process outputs into lasting notes" },
      { command: "/inbox ...", description: "Triage the inbox" },
      { command: "/journal ...", description: "Write a journal entry" },
      { command: "/week", description: "Write a knowledge review; /week agent for Agent review" },
      { command: "/clear", description: "Clear the current page and keep history" },
      { command: "/history", description: "Browse history by day" },
      { command: "/init", description: "Preview init; /init confirm applies it" },
      { command: "/help", description: "Show this shortcut guide" }
    ],
    enabled: "Enable Knowledge",
    enabledDesc: "Master gate for automatic maintenance and startup catch-up. Daily runs still require Automatic maintenance below. The Knowledge channel remains available for manual work.",
    backend: "Knowledge backend",
    backendDesc: "Follow the global Agent backend, or pin Knowledge to Codex or OpenCode.",
    followGlobal: (backend) => `Follow global (${backend})`,
    customRules: "Use custom guide file",
    customRulesDesc: (defaultFile, agentsFile) => `Defaults to ${defaultFile}. Turning this off uses vault-root ${agentsFile} as a compatibility fallback.`,
    dailyMaintenance: "Automatic maintenance",
    dailyMaintenanceDesc: "Runs /maintain at the daily time while Obsidian is open, then posts a short report in the Knowledge channel.",
    scheduleTime: "Daily run time",
    catchUp: "Startup catch-up",
    catchUpDesc: "If today's run was missed, run it when Obsidian opens.",
    opencodeMode: "OpenCode API mode",
    detection: (value) => `Detection: ${value}`,
    opencodePath: "OpenCode path",
    serverUrl: "Existing server URL",
    autoStartServer: "Auto-start OpenCode server",
    modelCapabilities: (text, image, pdf) => `Model capabilities: Text ${text ? "\u2713" : "\xD7"} \xB7 Images ${image ? "\u2713" : "\xD7"} \xB7 PDF ${pdf ? "\u2713" : "\xD7"}`,
    testConnection: "Test connection",
    channelNote: "Maintenance, checks, clipping links, ideas, images, and PDFs all run in the right-side Knowledge channel. Settings only manages config and status.",
    rulesFile: "Knowledge guide file",
    chooseRulesTitle: "Choose a Markdown file from this vault",
    chooseFile: "Choose file",
    useRulesFile: (file) => `Use ${file}`,
    repairRules: "Check and repair",
    repairRulesTitle: "Check whether required Knowledge rules are missing; create or patch the guide file if needed",
    rulesFileNoteCustom: (file, agentsFile) => `Knowledge tasks use ${file} as the structure source. ${agentsFile} stays for runtime context.`,
    rulesFileNoteLegacy: (agentsFile, defaultFile) => `Compatibility mode reads vault-root ${agentsFile}. ${defaultFile} is recommended.`,
    memoryHeading: "Long-term memory",
    memoryNote1: "Knowledge does not bundle memory Skills and will not edit this vault's AGENTS.md. For long-running context, install codex-memory-lite manually.",
    memoryNote2: "Usage: let your Codex/OpenCode Agent install the Skill from its repo, enter the target workspace, and run bootstrap there. /init, /check, and /maintain can then sync memory as needed.",
    openMemorySkill: "Open codex-memory-lite",
    storageHeading: "History and storage",
    storageLoading: "Calculating history storage...",
    storageStats: (dataJson, history, raw, messages, days) => `data.json ${dataJson} \xB7 history ${history} \xB7 raw ${raw} \xB7 ${messages} messages / ${days} days`,
    rebuildHistory: "Rebuild history index",
    exportHistory: "Export history",
    compactHistory: "Compact old process logs",
    historyRebuilt: "History index rebuilt",
    historyExported: (path21) => `History exported: ${path21}`,
    historyCompacted: (count) => `Compacted ${count} old process records`,
    repairSummary: (status, path21) => {
      if (status === "created") return `Knowledge guide created: ${path21}`;
      if (status === "patched") return `Knowledge guide updated: ${path21}`;
      return `Knowledge guide ready: ${path21}`;
    },
    repairPatchedDetail: (count) => `, patched ${count} items`,
    repairFailed: (error) => `Repair failed: ${error}`,
    noMarkdownFiles: "No Markdown files are available in this vault.",
    selectedRulesFile: (path21) => `Knowledge guide selected: ${path21}`,
    filePickerPlaceholder: "Choose Knowledge guide Markdown file",
    filePickerEmpty: "No matching Markdown files in this vault",
    statusLabels: {
      idle: "Not run",
      running: "Running",
      success: "Success",
      failed: "Failed",
      canceled: "Canceled"
    },
    initStatusLabels: {
      "not-started": "Not initialized",
      "preview-ready": "Preview ready",
      initialized: "Initialized",
      failed: "Failed"
    }
  },
  review: {
    title: "Review",
    generateHeading: "Generate weekly review",
    generateAgent: "Generate Agent review",
    generateKnowledge: "Generate Knowledge review",
    pathsHeading: "Output paths",
    outputDir: "Output directory",
    knowledgeMarkdown: "Knowledge Markdown",
    knowledgeHtml: "Knowledge HTML",
    agentMarkdown: "Agent Markdown",
    agentHtml: "Agent HTML",
    settingsHeading: "Review settings",
    confirmTitle: (label) => label,
    confirmBody: (report, outputDir) => `Generate ${report}?

Output directory: ${outputDir}`,
    generate: "Generate",
    cancel: "Cancel",
    reportLabels: {
      "knowledge-base": "Knowledge review",
      "agent-chat": "Agent review"
    },
    rangeMode: "Date range",
    rangeOptions: {
      "previous-week": "Previous full week",
      "current-week": "Current week to date"
    },
    openHtmlAfterRun: "Open HTML after run"
  },
  providers: {
    title: "API Settings",
    opencodeMode: "OpenCode API Mode",
    customApiMode: "Custom API Mode",
    warningKey: "API keys are stored as plain text in Obsidian plugin data. Use locally only; do not sync or commit them.",
    warningApi: "Custom APIs still require local Codex CLI. Base URL must support OpenAI Responses API. Generic /v1/chat/completions-only services may not work.",
    loginMode: "Codex login",
    add: "Add",
    addTitle: "Add API Provider",
    defaultName: "Custom API",
    empty: "No custom API providers yet.",
    unnamed: "Unnamed provider",
    active: "Enabled",
    enableReconnect: "Enable and reconnect",
    deleteConfirm: (name) => `Delete ${name || "this provider"}?`,
    name: "Name",
    namePlaceholder: "Example: OpenAI API",
    baseUrl: "Base URL",
    apiKey: "API key",
    queryParams: "Query Params",
    responseApiRequirement: "Required: server must support Responses API, such as /v1/responses. Chat Completions-only services may not work.",
    models: "Models",
    configChanged: "After editing config, click \u201CEnable and reconnect\u201D again to apply it to the current Codex process."
  },
  writing: {
    requestMode: "Writing request mode",
    requestModeDesc: "Requests run through the current Codex CLI. Custom APIs still need local Codex CLI support for Responses API.",
    enabled: "Enable writing actions",
    enabledDesc: "When enabled, selected editor text can be rewritten, expanded, continued, or translated to English from the context menu.",
    statusSlot: "Show sidebar writing status",
    statusSlotDesc: "Only shows waiting and confirmation state while a context-menu writing action runs.",
    contextPanel: "Show writing context panel",
    contextPanelDesc: "Click the sidebar writing status to view article understanding, mode, and model details.",
    quality: "Default writing quality",
    qualityDesc: "Fast writes directly; Quality understands the article first; Strict also reviews the candidate.",
    style: "Default writing style",
    maxSelectedChars: "Max selected characters",
    timeoutSeconds: "Timeout (seconds)",
    cache: "Article understanding cache",
    cacheDesc: (count) => `${count} article understanding entries cached.`,
    actionsHeading: "Context actions",
    enabledMeta: "Enabled",
    disabledMeta: "Off",
    name: "Name",
    actionNamePlaceholder: "Rewrite",
    promptTemplate: "Prompt template",
    promptPlaceholder: "Process: {{selected_text}}",
    qualityModesHeading: "Writing quality modes",
    model: "Model",
    contextBefore: "Chars before selection",
    contextAfter: "Chars after selection",
    stylesHeading: "Writing styles",
    addStyle: "Add style",
    defaultStyleLabel: "Custom style",
    defaultStyleInstruction: "Rewrite in my personal voice.",
    styleNamePlaceholder: "Clear",
    styleInstruction: "Style instruction",
    styleInstructionPlaceholder: "Clear, accurate, and natural.",
    qualityModes: {
      fast: { label: "Fast", desc: "Short polish, direct output" },
      quality: { label: "Quality", desc: "Understand first, then write" },
      strict: { label: "Strict", desc: "Understand, write, review" }
    }
  },
  opencode: {
    model: "OpenCode model",
    chooseModel: "Choose OpenCode model",
    currentModelMissing: (providerId, modelId) => `Current: ${providerId}/${modelId} (not listed)`,
    modelLoading: "Loading OpenCode models...",
    refreshModelHint: "Refresh models, then choose one.",
    refreshModels: "Refresh models",
    selectedModel: (name, capabilities) => `Selected: ${name}. ${capabilities}`,
    modelNote: "Selecting a model writes Provider ID, Model ID, and capabilities automatically. Provider ID / Model ID can still be entered manually.",
    chooseAgent: "Choose OpenCode Agent",
    currentAgentMissing: (name) => `Current: ${name} (not listed)`,
    manualAgent: "Enter OpenCode Agent manually",
    refreshAgent: "Refresh Agent",
    selectedAgent: (name, mode, desc) => `Selected: ${name}. ${mode}${desc ? ` \xB7 ${desc}` : ""}`,
    agentMissing: (name) => `Current Agent "${name}" is not in the OpenCode list. Choose an available Agent from the menu.`,
    agentHint: "Refresh Agents to choose from a menu. If loading fails, manual entry still works.",
    host: "Host",
    port: "Port",
    providerId: "Provider ID",
    modelId: "Model ID",
    agent: "Agent",
    readSuccess: (parts) => parts.length ? `Loaded OpenCode: ${parts.join(", ")}` : "OpenCode connected",
    modelsCount: (count) => `${count} models`,
    agentsCount: (count) => `${count} Agents`,
    readFailed: (error) => `OpenCode failed: ${error}`
  },
  resources: {
    title: "Workspace capabilities",
    note: "Only changes thread config for the current Obsidian vault.",
    tabs: {
      plugins: "Plugins",
      mcp: "MCP",
      skills: "Skills"
    },
    refreshTitle: "Refresh current list",
    loadingTab: (label) => `Loading ${label}...`,
    notLoaded: "Capability list not loaded yet.",
    searchPlaceholder: (label) => `Search ${label}`,
    searchAria: "Search current capability list",
    clearSearch: "Clear search",
    installed: "Installed",
    notInstalled: "Not installed",
    noPlugins: "No plugins loaded.",
    noPluginMatches: "No matching plugins.",
    toolsCount: (count) => `${count} tools`,
    mcpDesc: "From MCP config",
    mcpDisabledWarning: "The chat MCP master switch is off. Per-item switches are saved and apply when the master switch is enabled.",
    noMcp: "No MCP servers loaded.",
    noMcpMatches: "No matching MCP servers.",
    noDesc: "No description",
    noSkills: "No Skills loaded.",
    noSkillMatches: "No matching Skills.",
    summary: (enabled, total, visible, searching) => searching ? `Allowed ${enabled} / ${total} \xB7 Showing ${visible}` : `Allowed ${enabled} / ${total}`,
    toggleAria: (name) => `${name} toggle`,
    codexDisconnected: "XiaoYuan disconnected"
  },
  backendLabels: {
    "codex-cli": "Codex CLI",
    opencode: "OpenCode API"
  },
  knowledgeBackendLabels: {
    "codex-cli": "Codex CLI",
    opencode: "OpenCode API"
  }
};
var SETTINGS_COPY = {
  "zh-CN": ZH_CN,
  en: EN
};
var SETTINGS_LANGUAGE_OPTIONS = ["zh-CN", "en"];
function settingsCopy(language) {
  return SETTINGS_COPY[language] ?? SETTINGS_COPY["zh-CN"];
}

// src/settings/settings-tab.ts
var XiaoyuanAgentSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
    this.resourceSnapshot = snapshotFromWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache);
    this.resourceLoaded = loadedTabsFromWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache);
    this.resourceLoadErrors = errorsFromWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache);
    this.collapsedProviders = Object.fromEntries(
      plugin.settings.apiProviders.map((p) => [p.id, true])
    );
  }
  resourceSnapshot = null;
  resourceLoadingTab = null;
  resourceLoaded = { plugins: false, mcp: false, skills: false };
  resourceLoadErrors = {};
  resourceSearchQuery = { plugins: "", mcp: "", skills: "" };
  openCodeModelChoices = [];
  openCodeProviders = [];
  openCodeModelsLoaded = false;
  openCodeModelsLoading = false;
  openCodeModelsError = "";
  openCodeAgentChoices = [];
  openCodeAgentsLoaded = false;
  openCodeAgentsLoading = false;
  openCodeAgentsError = "";
  collapsedProviders = {};
  get copy() {
    return settingsCopy(this.plugin.settings.settingsLanguage);
  }
  display() {
    const { containerEl } = this;
    const copy = this.copy;
    containerEl.empty();
    const mode = this.plugin.settings.assistantMode;
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.mode.title).setDesc(mode === "opencode" ? copy.mode.opencodeDesc : mode === "custom-api" ? copy.mode.customApiDesc : copy.mode.hybridDesc).addDropdown((dropdown) => {
      dropdown.addOption("opencode", copy.mode.opencode).addOption("custom-api", copy.mode.customApi).addOption("hybrid", copy.mode.hybrid).setValue(this.plugin.settings.assistantMode).onChange(async (value) => {
        this.plugin.settings.assistantMode = value;
        await this.plugin.saveSettings();
        this.display();
      });
    }), "bot");
    const status = this.plugin.lastStatus;
    const statusBox = containerEl.createDiv({ cls: "codex-settings-status" });
    if (mode === "opencode") {
      this.addStatusRow(statusBox, "activity", copy.status.codexStatus, status?.connected ? copy.common.connected : copy.common.disconnected);
      this.addStatusRow(statusBox, "terminal-square", copy.status.opencode, detectOpenCodePath(this.plugin.settings.opencode.cliPath, copy));
      this.addStatusRow(statusBox, "box", copy.status.currentModel, this.plugin.settings.opencode.modelId || this.plugin.settings.defaultModel || copy.common.unknown);
    } else if (mode === "custom-api") {
      const activeProvider = getActiveApiProvider(this.plugin.settings);
      const apiConnected = activeProvider && activeProvider.baseUrl && activeProvider.apiKey;
      this.addStatusRow(statusBox, "activity", copy.status.codexStatus, apiConnected ? copy.common.connected : copy.common.disconnected);
      this.addStatusRow(statusBox, "key-round", copy.status.connection, providerConnectionLabel(this.plugin.settings, this.plugin.settings.settingsLanguage));
      if (activeProvider) {
        this.addStatusRow(statusBox, "box", copy.status.currentModel, activeProvider.model || copy.common.unknown);
      }
    } else {
      this.addStatusRow(statusBox, "activity", copy.status.codexStatus, status?.connected ? copy.common.connected : copy.common.disconnected);
      this.addStatusRow(statusBox, "key-round", copy.status.connection, providerConnectionLabel(this.plugin.settings, this.plugin.settings.settingsLanguage));
      this.addStatusRow(statusBox, "terminal-square", copy.status.opencode, detectOpenCodePath(this.plugin.settings.opencode.cliPath, copy));
      const activeProvider = getActiveApiProvider(this.plugin.settings);
      if (activeProvider) {
        this.addStatusRow(statusBox, "box", copy.status.currentModel, activeProvider.model || copy.common.unknown);
      }
    }
    this.addStatusRow(statusBox, "waypoints", copy.status.proxy, this.plugin.settings.proxyEnabled ? this.plugin.settings.proxyUrl : copy.common.disabled);
    this.addStatusRow(statusBox, "blocks", copy.status.chatMcp, this.plugin.settings.mcpEnabled ? copy.common.enabled : copy.common.disabled);
    this.addStatusRow(statusBox, "sparkles", copy.status.skillsCount, `${status?.skills.length ?? 0}`);
    this.addStatusRow(statusBox, "blocks", copy.status.mcpCount, `${status?.mcpServers.length ?? 0}`);
    this.addStatusRow(statusBox, "package-check", copy.status.pluginDir, pluginInstallDir(this.plugin));
    this.addStatusErrors(statusBox, status?.errors ?? []);
    this.addStatusActions(statusBox);
    this.renderTopTabs(containerEl);
    if (this.plugin.settings.settingsTab === "providers") {
      this.renderApiProviderManager(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "resources") {
      this.renderWorkspaceResourceManager(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "editorActions") {
      this.renderEditorActionSettings(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "knowledgeBase") {
      this.renderKnowledgeBaseSettings(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "review") {
      this.renderReviewSettings(containerEl);
      return;
    }
    this.renderGeneralSettings(containerEl, status);
  }
  renderGeneralSettings(containerEl, status) {
    const copy = this.copy;
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.settingsLanguage).setDesc(copy.general.settingsLanguageDesc).addDropdown((dropdown) => {
      for (const language of SETTINGS_LANGUAGE_OPTIONS) dropdown.addOption(language, copy.general.languageOptions[language]);
      dropdown.setValue(this.plugin.settings.settingsLanguage);
      dropdown.onChange(async (value) => {
        this.plugin.settings.settingsLanguage = normalizeSettingsLanguageForUi(value);
        await this.plugin.saveSettings(true);
        this.display();
      });
    }), "languages");
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.proxyEnabled).setDesc(copy.general.proxyEnabledDesc).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.proxyEnabled).onChange(async (value) => {
        this.plugin.settings.proxyEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "waypoints");
    this.decorateSetting(
      new import_obsidian2.Setting(containerEl).setName(copy.general.proxyUrl).setDesc(copy.general.proxyUrlDesc).addText(
        (text) => text.setPlaceholder("http://127.0.0.1:7890").setValue(this.plugin.settings.proxyUrl).onChange(async (value) => {
          this.plugin.settings.proxyUrl = value.trim();
          await this.plugin.saveSettings();
        })
      ),
      "route"
    );
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.mcpEnabled).setDesc(copy.general.mcpEnabledDesc).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.mcpEnabled).onChange(async (value) => {
        this.plugin.settings.mcpEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "blocks");
    this.decorateSetting(
      new import_obsidian2.Setting(containerEl).setName(copy.general.defaultModel).setDesc(copy.general.defaultModelDesc).addDropdown((dropdown) => {
        dropdown.addOption("", copy.general.auto);
        for (const model of ensureModelChoices2(status?.models ?? [], this.plugin.settings.defaultModel, DEFAULT_SETTINGS.defaultModel)) {
          dropdown.addOption(model.model, model.displayName || model.model);
        }
        dropdown.setValue(this.plugin.settings.defaultModel);
        dropdown.onChange(async (value) => {
          this.plugin.settings.defaultModel = value;
          await this.plugin.saveSettings();
          this.plugin.applyComposerDefaultsToView();
        });
      }),
      "box"
    );
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.defaultReasoning).addDropdown((dropdown) => {
      const options = ["low", "medium", "high", "xhigh"];
      for (const option of options) dropdown.addOption(option, option);
      dropdown.setValue(this.plugin.settings.defaultReasoning);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultReasoning = value;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "brain");
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.defaultSpeed).addDropdown((dropdown) => {
      const options = copy.general.serviceTierOptions;
      for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
      dropdown.setValue(this.plugin.settings.defaultServiceTier);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultServiceTier = value;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "gauge");
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.defaultPermission).addDropdown((dropdown) => {
      const options = copy.general.permissionOptions;
      for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
      dropdown.setValue(this.plugin.settings.defaultPermission);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultPermission = value;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "shield-check");
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.defaultMode).addDropdown((dropdown) => {
      const options = copy.general.modeOptions;
      for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
      dropdown.setValue(this.plugin.settings.defaultMode);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultMode = value;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "route");
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.autoOpen).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoOpen).onChange(async (value) => {
        this.plugin.settings.autoOpen = value;
        await this.plugin.saveSettings();
      })
    ), "panel-right-open");
    this.decorateSetting(new import_obsidian2.Setting(containerEl).setName(copy.general.showContext).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showContext).onChange(async (value) => {
        this.plugin.settings.showContext = value;
        await this.plugin.saveSettings();
      })
    ), "pie-chart");
  }
  renderKnowledgeBaseSettings(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.knowledgeBase;
    const wrapper = container.createDiv({ cls: "codex-api-provider-manager codex-knowledge-settings" });
    const header = wrapper.createDiv({ cls: "codex-resource-manager-header" });
    const title = header.createDiv({ cls: "codex-resource-manager-title" });
    const icon = title.createSpan({ cls: "codex-setting-icon" });
    (0, import_obsidian2.setIcon)(icon, "library");
    title.createSpan({ text: copy.knowledge.title });
    wrapper.createDiv({
      cls: "codex-resource-warning",
      text: copy.knowledge.safety
    });
    const summary = wrapper.createDiv({ cls: "codex-api-provider-row" });
    summary.createDiv({ cls: "codex-editor-actions-heading", text: copy.knowledge.statusHeading });
    summary.createDiv({ cls: "codex-resource-note", text: copy.knowledge.recentStatus(knowledgeStatusLabel(settings.lastRunStatus, copy), settings.lastRunAt ? new Date(settings.lastRunAt).toLocaleString() : "") });
    summary.createDiv({ cls: "codex-resource-note", text: copy.knowledge.initialization(knowledgeInitStatusLabel(settings.initialization.status, copy), settings.initialization.rulesFilePath) });
    summary.createDiv({ cls: "codex-resource-note", text: copy.knowledge.guide(settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE, settings.useCustomRulesFile) });
    if (settings.lastReportPath) summary.createDiv({ cls: "codex-resource-note", text: copy.knowledge.recentReport(settings.lastReportPath) });
    if (settings.lastError) summary.createDiv({ cls: "codex-resource-error", text: settings.lastError });
    const actions = summary.createDiv({ cls: "codex-api-provider-actions" });
    const openChannel = actions.createEl("button", { cls: "codex-resource-tab", text: copy.knowledge.openChannel, attr: { type: "button" } });
    openChannel.onclick = async () => {
      await this.plugin.activateKnowledgeBaseChannel();
      this.display();
    };
    const initChannel = actions.createEl("button", { cls: "codex-resource-tab", text: copy.knowledge.initChannel, attr: { type: "button" } });
    initChannel.onclick = async () => {
      await this.plugin.activateKnowledgeBaseChannel();
      this.plugin.getXiaoyuanView()?.fillKnowledgeBaseCommand("/init ");
      this.display();
    };
    this.addKnowledgeBaseCommandGuide(wrapper);
    this.addKnowledgeBaseStoragePanel(wrapper);
    this.decorateSetting(new import_obsidian2.Setting(wrapper).setName(copy.knowledge.enabled).setDesc(copy.knowledge.enabledDesc).addToggle(
      (toggle) => toggle.setValue(settings.enabled).onChange(async (value) => {
        settings.enabled = value;
        await this.plugin.saveSettings();
        this.display();
      })
    ), "toggle-right");
    this.decorateSetting(new import_obsidian2.Setting(wrapper).setName(copy.knowledge.customRules).setDesc(copy.knowledge.customRulesDesc(DEFAULT_KNOWLEDGE_BASE_RULES_FILE, AGENTS_RULES_FILE)).addToggle(
      (toggle) => toggle.setValue(settings.useCustomRulesFile).onChange(async (value) => {
        settings.useCustomRulesFile = value;
        if (value && (!settings.rulesFilePath || settings.rulesFilePath === AGENTS_RULES_FILE)) settings.rulesFilePath = DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
        await this.plugin.saveSettings();
        this.display();
      })
    ), "file-cog");
    this.addKnowledgeBaseRulesFilePicker(wrapper);
    this.addKnowledgeBaseMemoryRecommendation(wrapper);
    this.decorateSetting(new import_obsidian2.Setting(wrapper).setName(copy.knowledge.dailyMaintenance).setDesc(copy.knowledge.dailyMaintenanceDesc).addToggle(
      (toggle) => toggle.setValue(settings.scheduleEnabled).onChange(async (value) => {
        settings.scheduleEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "calendar-clock");
    this.addProviderText(wrapper, copy.knowledge.scheduleTime, settings.scheduleTime, "09:00", async (value) => {
      settings.scheduleTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim()) ? value.trim() : settings.scheduleTime;
      await this.plugin.saveSettings();
      this.display();
    });
    this.decorateSetting(new import_obsidian2.Setting(wrapper).setName(copy.knowledge.catchUp).setDesc(copy.knowledge.catchUpDesc).addToggle(
      (toggle) => toggle.setValue(settings.catchUpOnStartup).onChange(async (value) => {
        settings.catchUpOnStartup = value;
        await this.plugin.saveSettings();
      })
    ), "history");
    wrapper.createDiv({
      cls: "codex-resource-note",
      text: copy.knowledge.channelNote
    });
  }
  addKnowledgeBaseCommandGuide(container) {
    const copy = this.copy;
    const section = container.createDiv({ cls: "codex-api-provider-row codex-kb-command-guide" });
    section.createDiv({ cls: "codex-editor-actions-heading", text: copy.knowledge.commandHeading });
    for (const item of copy.knowledge.commandGuide) {
      const row = section.createDiv({ cls: "codex-kb-command-row" });
      row.createEl("code", { text: item.command });
      row.createSpan({ text: item.description });
    }
  }
  addKnowledgeBaseStoragePanel(container) {
    const copy = this.copy;
    const section = container.createDiv({ cls: "codex-api-provider-row codex-kb-storage-panel" });
    section.createDiv({ cls: "codex-editor-actions-heading", text: copy.knowledge.storageHeading });
    const statsEl = section.createDiv({ cls: "codex-resource-note", text: copy.knowledge.storageLoading });
    void this.plugin.getKnowledgeBaseStorageStats().then((stats) => {
      statsEl.setText(copy.knowledge.storageStats(
        formatStorageBytes(stats.dataJsonBytes),
        formatStorageBytes(stats.historyBytes),
        formatStorageBytes(stats.rawBytes),
        stats.messageCount,
        stats.dayCount
      ));
    }).catch((error) => {
      statsEl.setText(copy.common.readFailed(error instanceof Error ? error.message : String(error)));
    });
    const actions = section.createDiv({ cls: "codex-api-provider-actions" });
    const rebuild = actions.createEl("button", { cls: "codex-resource-tab", text: copy.knowledge.rebuildHistory, attr: { type: "button" } });
    rebuild.onclick = async () => {
      rebuild.disabled = true;
      await this.plugin.rebuildKnowledgeBaseHistoryIndex();
      new import_obsidian2.Notice(copy.knowledge.historyRebuilt);
      this.display();
    };
    const exportButton = actions.createEl("button", { cls: "codex-resource-tab", text: copy.knowledge.exportHistory, attr: { type: "button" } });
    exportButton.onclick = async () => {
      exportButton.disabled = true;
      const exported = await this.plugin.exportKnowledgeBaseHistory();
      new import_obsidian2.Notice(copy.knowledge.historyExported(exported));
      this.display();
    };
    const compact = actions.createEl("button", { cls: "codex-resource-tab", text: copy.knowledge.compactHistory, attr: { type: "button" } });
    compact.onclick = async () => {
      const accepted = await confirmModal(this.app, copy.knowledge.compactHistory, "\u53EA\u538B\u7F29\u65E7\u65E5\u671F\u7684\u8FC7\u7A0B\u8BB0\u5F55\uFF0C\u4E0D\u5220\u9664\u7528\u6237\u4E0E\u52A9\u624B\u6B63\u6587\u3002", "\u538B\u7F29", "\u53D6\u6D88");
      if (!accepted) return;
      compact.disabled = true;
      const count = await this.plugin.compactOldKnowledgeBaseProcessHistory();
      new import_obsidian2.Notice(copy.knowledge.historyCompacted(count));
      this.display();
    };
  }
  renderReviewSettings(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.review;
    const wrapper = container.createDiv({ cls: "codex-api-provider-manager codex-review-settings" });
    const header = wrapper.createDiv({ cls: "codex-resource-manager-header" });
    const title = header.createDiv({ cls: "codex-resource-manager-title" });
    const icon = title.createSpan({ cls: "codex-setting-icon" });
    (0, import_obsidian2.setIcon)(icon, "bar-chart-3");
    title.createSpan({ text: copy.review.title });
    const summary = wrapper.createDiv({ cls: "codex-api-provider-row" });
    summary.createDiv({ cls: "codex-editor-actions-heading", text: copy.review.generateHeading });
    const actions = summary.createDiv({ cls: "codex-api-provider-actions" });
    this.addReviewAction(actions, copy.review.generateAgent, "agent-chat");
    this.addReviewAction(actions, copy.review.generateKnowledge, "knowledge-base");
    const paths = wrapper.createDiv({ cls: "codex-api-provider-row" });
    paths.createDiv({ cls: "codex-editor-actions-heading", text: copy.review.pathsHeading });
    this.addProviderText(paths, copy.review.outputDir, settings.outputDir, DEFAULT_SETTINGS.review.outputDir, async (value) => {
      settings.outputDir = normalizeReviewOutputDir(value, DEFAULT_SETTINGS.review.outputDir);
      await this.plugin.saveSettings();
      this.display();
    });
    this.addReviewPath(paths, copy.review.knowledgeMarkdown, settings.reports.knowledgeBase.lastMarkdownPath);
    this.addReviewPath(paths, copy.review.knowledgeHtml, settings.reports.knowledgeBase.lastHtmlPath);
    this.addReviewPath(paths, copy.review.agentMarkdown, settings.reports.agentChat.lastMarkdownPath);
    this.addReviewPath(paths, copy.review.agentHtml, settings.reports.agentChat.lastHtmlPath);
    const reviewOptions = wrapper.createDiv({ cls: "codex-api-provider-row" });
    reviewOptions.createDiv({ cls: "codex-editor-actions-heading", text: copy.review.settingsHeading });
    this.addReviewRangeMode(reviewOptions);
    this.addReviewOpenAfterRun(reviewOptions);
  }
  addReviewPath(container, label, value) {
    if (!value) return;
    container.createDiv({ cls: "codex-resource-note", text: `${label}\uFF1A${value}` });
  }
  addReviewAction(container, label, kind) {
    const copy = this.copy;
    const button = container.createEl("button", { cls: "codex-resource-tab", text: label, attr: { type: "button" } });
    button.onclick = async () => {
      const reportLabel = copy.review.reportLabels[kind];
      const accepted = await confirmModal(
        this.app,
        copy.review.confirmTitle(label),
        copy.review.confirmBody(reportLabel, this.plugin.settings.review.outputDir),
        copy.review.generate,
        copy.review.cancel
      );
      if (!accepted) return;
      button.disabled = true;
      await this.plugin.getReviewManager()?.runReview(kind);
      this.display();
    };
  }
  addReviewRangeMode(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.review;
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.review.rangeMode).addDropdown((dropdown) => {
      dropdown.addOption("previous-week", copy.review.rangeOptions["previous-week"]).addOption("current-week", copy.review.rangeOptions["current-week"]).setValue(settings.rangeMode).onChange(async (value) => {
        settings.rangeMode = value === "current-week" ? "current-week" : "previous-week";
        await this.plugin.saveSettings();
      });
    }), "calendar-days");
  }
  addReviewOpenAfterRun(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.review;
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.review.openHtmlAfterRun).addToggle(
      (toggle) => toggle.setValue(settings.openHtmlAfterRun).onChange(async (value) => {
        settings.openHtmlAfterRun = value;
        await this.plugin.saveSettings();
      })
    ), "panel-right-open");
  }
  addStatusActions(container) {
    const copy = this.copy;
    const actions = container.createDiv({ cls: "codex-settings-status-actions" });
    const refresh = actions.createEl("button", {
      cls: "codex-resource-refresh",
      attr: { type: "button", title: copy.status.refreshTitle }
    });
    const icon = refresh.createSpan({ cls: "codex-resource-refresh-icon" });
    (0, import_obsidian2.setIcon)(icon, "refresh-cw");
    const label = refresh.createSpan({ text: copy.status.refreshLogin });
    refresh.onclick = async () => {
      refresh.disabled = true;
      label.setText(copy.status.refreshing);
      const status = await this.plugin.ensureOpenCodeConnected(true);
      if (status.connected) new import_obsidian2.Notice(copy.status.refreshSuccess(status.accountLabel));
      else new import_obsidian2.Notice(copy.status.refreshFailed(status.errors[0] ?? copy.common.unknown));
      this.display();
    };
  }
  addStatusErrors(container, errors) {
    if (!errors.length) return;
    const copy = this.copy;
    for (const error of errors.slice(0, 3)) {
      const card = container.createDiv({ cls: "codex-settings-status-error" });
      const title = card.createDiv({ cls: "codex-settings-status-error-title" });
      const icon = title.createSpan({ cls: "codex-settings-status-icon" });
      (0, import_obsidian2.setIcon)(icon, "triangle-alert");
      title.createSpan({ text: copy.status.diagnostics });
      card.createEl("pre", { cls: "codex-settings-status-error-body", text: error });
    }
  }
  renderTopTabs(container) {
    const copy = this.copy;
    const tabs = container.createDiv({ cls: "codex-settings-tabs" });
    for (const tab of SETTINGS_TABS) {
      const button = tabs.createEl("button", {
        cls: `codex-settings-tab ${this.plugin.settings.settingsTab === tab.id ? "is-active" : ""}`,
        attr: { type: "button" }
      });
      const icon = button.createSpan({ cls: "codex-settings-tab-icon" });
      (0, import_obsidian2.setIcon)(icon, tab.icon);
      button.createSpan({ text: copy.tabs[tab.id] });
      button.onclick = async () => {
        this.plugin.settings.settingsTab = tab.id;
        await this.plugin.saveSettings();
        this.display();
      };
    }
  }
  renderApiProviderManager(container) {
    const copy = this.copy;
    const wrapper = container.createDiv({ cls: "codex-api-provider-manager" });
    const opencode = this.plugin.settings.opencode;
    const openCodeSection = wrapper.createDiv({ cls: "codex-editor-actions-section" });
    const openCodeHeader = openCodeSection.createDiv({ cls: "codex-resource-manager-header" });
    const openCodeTitle = openCodeHeader.createDiv({ cls: "codex-resource-manager-title" });
    const openCodeIcon = openCodeTitle.createSpan({ cls: "codex-setting-icon" });
    (0, import_obsidian2.setIcon)(openCodeIcon, "terminal-square");
    openCodeTitle.createSpan({ text: copy.providers.opencodeMode });
    openCodeSection.createDiv({ cls: "codex-resource-note", text: copy.knowledge.detection(detectOpenCodePath(opencode.cliPath, copy)) });
    this.addProviderText(openCodeSection, copy.knowledge.opencodePath, opencode.cliPath, "/opt/homebrew/bin/opencode", async (value) => {
      opencode.cliPath = value.trim();
      await this.plugin.saveSettings();
      this.display();
    });
    this.addProviderText(openCodeSection, copy.knowledge.serverUrl, opencode.serverUrl, "http://127.0.0.1:4096", async (value) => {
      opencode.serverUrl = value.trim().replace(/\/$/, "");
      await this.plugin.saveSettings();
    });
    this.decorateSetting(new import_obsidian2.Setting(openCodeSection).setName(copy.knowledge.autoStartServer).addToggle(
      (toggle) => toggle.setValue(opencode.autoStart).onChange(async (value) => {
        opencode.autoStart = value;
        await this.plugin.saveSettings();
      })
    ), "power");
    this.addProviderText(openCodeSection, copy.opencode.host, opencode.hostname, "127.0.0.1", async (value) => {
      opencode.hostname = value.trim() || "127.0.0.1";
      await this.plugin.saveSettings();
    });
    this.addProviderText(openCodeSection, copy.opencode.port, String(opencode.port), "4096", async (value) => {
      opencode.port = parseClampedInteger(value, 4096, 1024, 65535);
      await this.plugin.saveSettings();
      this.display();
    });
    this.addOpenCodeModelPicker(openCodeSection);
    this.addProviderText(openCodeSection, copy.opencode.providerId, opencode.providerId, "anthropic", async (value) => {
      opencode.providerId = value.trim();
      await this.plugin.saveSettings();
    });
    this.addProviderText(openCodeSection, copy.opencode.modelId, opencode.modelId, "claude-sonnet-4-20250514", async (value) => {
      opencode.modelId = value.trim();
      await this.plugin.saveSettings();
    });
    this.addOpenCodeAgentPicker(openCodeSection);
    openCodeSection.createDiv({
      cls: "codex-resource-note",
      text: copy.knowledge.modelCapabilities(opencode.textEnabled, opencode.imageEnabled, opencode.pdfEnabled)
    });
    if (opencode.lastError) openCodeSection.createDiv({ cls: "codex-resource-error", text: opencode.lastError });
    if (this.openCodeModelsError) openCodeSection.createDiv({ cls: "codex-resource-error", text: this.openCodeModelsError });
    if (this.openCodeAgentsError) openCodeSection.createDiv({ cls: "codex-resource-error", text: this.openCodeAgentsError });
    const openCodeActions = openCodeSection.createDiv({ cls: "codex-api-provider-actions" });
    const testOpenCode = openCodeActions.createEl("button", { cls: "codex-resource-tab", text: copy.knowledge.testConnection, attr: { type: "button" } });
    testOpenCode.onclick = async () => {
      await this.refreshOpenCodeRuntimeOptions();
      this.display();
    };
    const customApiSection = wrapper.createDiv({ cls: "codex-editor-actions-section" });
    const customApiHeader = customApiSection.createDiv({ cls: "codex-resource-manager-header" });
    const customApiTitle = customApiHeader.createDiv({ cls: "codex-resource-manager-title" });
    const customApiIcon = customApiTitle.createSpan({ cls: "codex-setting-icon" });
    (0, import_obsidian2.setIcon)(customApiIcon, "key-round");
    customApiTitle.createSpan({ text: copy.providers.customApiMode });
    const add = customApiHeader.createEl("button", {
      cls: "codex-resource-refresh",
      text: copy.providers.add,
      attr: { type: "button", title: copy.providers.addTitle }
    });
    add.onclick = async () => {
      const defaultProviderModel = this.plugin.settings.defaultModel || this.plugin.lastStatus?.models.find((model) => model.isDefault)?.model || this.plugin.lastStatus?.models[0]?.model || "gpt-5.4";
      const provider = {
        id: newId("provider").replace(/[^A-Za-z0-9_-]/g, "_"),
        name: copy.providers.defaultName,
        baseUrl: "https://api.openai.com/v1",
        model: defaultProviderModel,
        models: [defaultProviderModel],
        apiKey: ""
      };
      this.plugin.settings.apiProviders.push(provider);
      this.plugin.settings.activeApiProviderId = provider.id;
      await this.plugin.saveSettings(true);
      this.display();
    };
    customApiSection.createDiv({
      cls: "codex-resource-warning",
      text: copy.providers.warningKey
    });
    customApiSection.createDiv({
      cls: "codex-resource-warning",
      text: copy.providers.warningApi
    });
    const modeRow = customApiSection.createDiv({ cls: "codex-api-provider-mode" });
    modeRow.createDiv({
      cls: "codex-resource-summary",
      text: copy.common.current(providerConnectionLabel(this.plugin.settings, this.plugin.settings.settingsLanguage))
    });
    if (!this.plugin.settings.apiProviders.length) {
      customApiSection.createDiv({ cls: "codex-resource-empty", text: copy.providers.empty });
      return;
    }
    const body = customApiSection.createDiv({ cls: "codex-api-provider-list" });
    for (const provider of this.plugin.settings.apiProviders) {
      this.renderApiProviderRow(body, provider);
    }
  }
  renderEditorActionSettings(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.editorActions;
    this.decorateSetting(
      new import_obsidian2.Setting(container).setName(copy.writing.requestMode).setDesc(copy.writing.requestModeDesc),
      "terminal"
    );
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.writing.enabled).setDesc(copy.writing.enabledDesc).addToggle(
      (toggle) => toggle.setValue(settings.enabled).onChange(async (value) => {
        settings.enabled = value;
        await this.plugin.saveSettings();
        this.display();
      })
    ), "toggle-right");
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.writing.statusSlot).setDesc(copy.writing.statusSlotDesc).addToggle(
      (toggle) => toggle.setValue(settings.statusSlotEnabled).onChange(async (value) => {
        settings.statusSlotEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "activity");
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.writing.contextPanel).setDesc(copy.writing.contextPanelDesc).addToggle(
      (toggle) => toggle.setValue(settings.showContextPanel).onChange(async (value) => {
        settings.showContextPanel = value;
        await this.plugin.saveSettings();
      })
    ), "file-search");
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.writing.quality).setDesc(copy.writing.qualityDesc).addDropdown((dropdown) => {
      for (const mode of EDITOR_ACTION_QUALITY_MODES) dropdown.addOption(mode.id, copy.writing.qualityModes[mode.id].label);
      dropdown.setValue(settings.qualityMode);
      dropdown.onChange(async (value) => {
        settings.qualityMode = normalizeEditorActionQualityModeForUi(value);
        await this.plugin.saveSettings();
        this.display();
      });
    }), "gauge");
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.writing.style).addDropdown((dropdown) => {
      for (const style of settings.styles) dropdown.addOption(style.id, style.label || style.id);
      dropdown.setValue(settings.defaultStyleId);
      dropdown.onChange(async (value) => {
        settings.defaultStyleId = value;
        await this.plugin.saveSettings();
      });
    }), "palette");
    this.addEditorActionNumber(container, copy.writing.maxSelectedChars, settings.maxSelectedChars, 200, 2e4, async (value) => {
      settings.maxSelectedChars = value;
      await this.plugin.saveSettings();
    });
    this.addEditorActionNumber(container, copy.writing.timeoutSeconds, Math.round(settings.timeoutMs / 1e3), 10, 300, async (value) => {
      settings.timeoutMs = value * 1e3;
      await this.plugin.saveSettings();
    });
    this.renderEditorActionModeConfigs(container);
    this.decorateSetting(new import_obsidian2.Setting(container).setName(copy.writing.cache).setDesc(copy.writing.cacheDesc(Object.keys(settings.articleUnderstandingCache).length)).addButton(
      (button) => button.setButtonText(copy.common.clear).setIcon("trash-2").onClick(async () => {
        settings.articleUnderstandingCache = {};
        await this.plugin.saveSettings();
        this.display();
      })
    ), "database");
    this.renderEditorActionList(container, settings.actions);
    this.renderEditorStyleList(container, settings.styles);
  }
  renderEditorActionList(container, actions) {
    const copy = this.copy;
    const section = container.createDiv({ cls: "codex-editor-actions-section" });
    section.createDiv({ cls: "codex-editor-actions-heading", text: copy.writing.actionsHeading });
    for (const action of actions) {
      const row = section.createDiv({ cls: "codex-api-provider-row codex-editor-action-row" });
      const head = row.createDiv({ cls: "codex-api-provider-head" });
      const title = head.createDiv({ cls: "codex-api-provider-title" });
      const icon = title.createSpan({ cls: "codex-resource-row-icon" });
      (0, import_obsidian2.setIcon)(icon, editorActionIcon(action.id));
      title.createSpan({ text: action.label || action.id });
      title.createSpan({ cls: "codex-resource-row-meta", text: action.enabled ? copy.writing.enabledMeta : copy.writing.disabledMeta });
      const toggleWrap = head.createDiv({ cls: "codex-api-provider-actions" });
      new import_obsidian2.Setting(toggleWrap).addToggle(
        (toggle) => toggle.setValue(action.enabled).onChange(async (value) => {
          action.enabled = value;
          await this.plugin.saveSettings();
          this.display();
        })
      );
      this.addProviderText(row, copy.writing.name, action.label, copy.writing.actionNamePlaceholder, async (value) => {
        action.label = value.trim() || action.id;
        await this.plugin.saveSettings();
        this.display();
      });
      this.addProviderTextArea(row, copy.writing.promptTemplate, action.promptTemplate, copy.writing.promptPlaceholder, async (value) => {
        action.promptTemplate = value.trim();
        await this.plugin.saveSettings();
      });
    }
  }
  renderEditorActionModeConfigs(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.editorActions;
    const section = container.createDiv({ cls: "codex-editor-actions-section" });
    section.createDiv({ cls: "codex-editor-actions-heading", text: copy.writing.qualityModesHeading });
    const modelChoices = ensureModelChoices2(this.plugin.lastStatus?.models ?? [], "gpt-5.4-mini", "gpt-5.4", "gpt-5.5", DEFAULT_SETTINGS.defaultModel);
    for (const mode of EDITOR_ACTION_QUALITY_MODES) {
      const config = settings.modeConfigs[mode.id];
      const row = section.createDiv({ cls: "codex-api-provider-row codex-editor-mode-row" });
      const head = row.createDiv({ cls: "codex-api-provider-head" });
      const title = head.createDiv({ cls: "codex-api-provider-title" });
      const icon = title.createSpan({ cls: "codex-resource-row-icon" });
      (0, import_obsidian2.setIcon)(icon, mode.icon);
      title.createSpan({ text: copy.writing.qualityModes[mode.id].label });
      title.createSpan({ cls: "codex-resource-row-meta", text: copy.writing.qualityModes[mode.id].desc });
      this.decorateSetting(new import_obsidian2.Setting(row).setName(copy.writing.model).addDropdown((dropdown) => {
        for (const model of ensureModelChoices2(modelChoices, config.model)) dropdown.addOption(model.model, model.displayName || model.model);
        dropdown.setValue(config.model);
        dropdown.onChange(async (value) => {
          config.model = value;
          await this.plugin.saveSettings();
        });
      }), "box");
      this.addEditorActionNumber(row, copy.writing.contextBefore, config.contextCharsBefore, 0, 1e4, async (value) => {
        config.contextCharsBefore = value;
        if (mode.id === "fast") settings.contextCharsBefore = value;
        await this.plugin.saveSettings();
      });
      this.addEditorActionNumber(row, copy.writing.contextAfter, config.contextCharsAfter, 0, 1e4, async (value) => {
        config.contextCharsAfter = value;
        if (mode.id === "fast") settings.contextCharsAfter = value;
        await this.plugin.saveSettings();
      });
    }
  }
  renderEditorStyleList(container, styles) {
    const copy = this.copy;
    const section = container.createDiv({ cls: "codex-editor-actions-section" });
    const header = section.createDiv({ cls: "codex-resource-manager-header" });
    header.createDiv({ cls: "codex-editor-actions-heading", text: copy.writing.stylesHeading });
    const add = header.createEl("button", {
      cls: "codex-resource-refresh",
      text: copy.writing.addStyle,
      attr: { type: "button" }
    });
    add.onclick = async () => {
      const id = `style_${Date.now()}`;
      styles.push({ id, label: copy.writing.defaultStyleLabel, instruction: copy.writing.defaultStyleInstruction });
      this.plugin.settings.editorActions.defaultStyleId = id;
      await this.plugin.saveSettings(true);
      this.display();
    };
    for (const style of styles) {
      const row = section.createDiv({ cls: "codex-api-provider-row codex-editor-style-row" });
      const head = row.createDiv({ cls: "codex-api-provider-head" });
      const title = head.createDiv({ cls: "codex-api-provider-title" });
      const icon = title.createSpan({ cls: "codex-resource-row-icon" });
      (0, import_obsidian2.setIcon)(icon, "palette");
      title.createSpan({ text: style.label || style.id });
      title.createSpan({ cls: "codex-resource-row-meta", text: style.id });
      const actions = head.createDiv({ cls: "codex-api-provider-actions" });
      if (!DEFAULT_SETTINGS.editorActions.styles.some((item) => item.id === style.id)) {
        const remove = actions.createEl("button", { cls: "codex-resource-tab", text: copy.common.delete, attr: { type: "button" } });
        remove.onclick = async () => {
          this.plugin.settings.editorActions.styles = styles.filter((item) => item.id !== style.id);
          if (this.plugin.settings.editorActions.defaultStyleId === style.id) this.plugin.settings.editorActions.defaultStyleId = "clear";
          await this.plugin.saveSettings(true);
          this.display();
        };
      }
      this.addProviderText(row, copy.writing.name, style.label, copy.writing.styleNamePlaceholder, async (value) => {
        style.label = value.trim() || style.id;
        await this.plugin.saveSettings();
        this.display();
      });
      this.addProviderTextArea(row, copy.writing.styleInstruction, style.instruction, copy.writing.styleInstructionPlaceholder, async (value) => {
        style.instruction = value.trim();
        await this.plugin.saveSettings();
      });
    }
  }
  renderApiProviderRow(container, provider) {
    const copy = this.copy;
    const activeProvider = getActiveApiProvider(this.plugin.settings);
    const isCollapsed = this.collapsedProviders[provider.id] !== false;
    const row = container.createDiv({
      cls: `codex-api-provider-row ${activeProvider?.id === provider.id && this.plugin.settings.providerMode === "custom-api" ? "is-active" : ""}`
    });
    const head = row.createDiv({ cls: "codex-api-provider-head" });
    const toggleBtn = head.createEl("button", { cls: "codex-api-provider-toggle", attr: { type: "button" } });
    (0, import_obsidian2.setIcon)(toggleBtn, isCollapsed ? "chevron-right" : "chevron-down");
    toggleBtn.onclick = () => {
      this.collapsedProviders[provider.id] = !isCollapsed;
      this.display();
    };
    const title = head.createDiv({ cls: "codex-api-provider-title" });
    title.createSpan({ text: provider.name || copy.providers.unnamed });
    title.createSpan({ cls: "codex-resource-row-meta", text: providerModelLabel(provider, this.plugin.settings.settingsLanguage) });
    title.prepend(toggleBtn);
    const actions = head.createDiv({ cls: "codex-api-provider-actions" });
    const enable = actions.createEl("button", {
      cls: "codex-resource-tab",
      text: activeProvider?.id === provider.id && this.plugin.settings.providerMode === "custom-api" ? copy.providers.active : copy.providers.enableReconnect,
      attr: { type: "button" }
    });
    enable.onclick = async () => {
      const errors2 = validateApiProvider(provider, this.plugin.settings.settingsLanguage);
      if (errors2.length) {
        new import_obsidian2.Notice(copy.common.enableFailed(errors2));
        return;
      }
      this.plugin.settings.providerMode = "custom-api";
      this.plugin.settings.activeApiProviderId = provider.id;
      await this.plugin.saveSettings(true);
      await this.plugin.ensureOpenCodeConnected(true);
      this.display();
    };
    const remove = actions.createEl("button", {
      cls: "codex-resource-tab",
      text: copy.common.delete,
      attr: { type: "button" }
    });
    remove.onclick = async () => {
      if (!window.confirm(copy.providers.deleteConfirm(provider.name))) return;
      const wasActive = this.plugin.settings.providerMode === "custom-api" && this.plugin.settings.activeApiProviderId === provider.id;
      removeApiProvider(this.plugin.settings, provider.id);
      await this.plugin.saveSettings(true);
      if (wasActive) await this.plugin.ensureOpenCodeConnected(true);
      this.display();
    };
    const content = row.createDiv({ cls: "codex-api-provider-content" });
    if (isCollapsed) content.style.display = "none";
    this.addProviderText(content, copy.providers.name, provider.name, copy.providers.namePlaceholder, async (value) => {
      provider.name = value.trim();
      await this.plugin.saveSettings();
      this.display();
    });
    this.addProviderText(content, copy.providers.baseUrl, provider.baseUrl, "https://api.openai.com/v1", async (value) => {
      provider.baseUrl = value.trim();
      await this.plugin.saveSettings();
    });
    content.createDiv({ cls: "codex-resource-note", text: copy.providers.responseApiRequirement });
    this.addProviderTextArea(content, copy.providers.models, getApiProviderModels(provider).join("\n"), "gpt-5.4\ngpt-5.5", async (value) => {
      const models = parseModelList(value);
      provider.models = models;
      provider.model = models[0] ?? "";
      await this.plugin.saveSettings();
      this.display();
    });
    this.addProviderText(content, copy.providers.apiKey, provider.apiKey, "sk-...", async (value) => {
      provider.apiKey = value.trim();
      await this.plugin.saveSettings();
    }, "password");
    this.addProviderTextArea(content, copy.providers.queryParams, formatQueryParams(provider.queryParams), "api-version=2026-04-28", async (value) => {
      provider.queryParams = parseQueryParams(value);
      if (!Object.keys(provider.queryParams).length) delete provider.queryParams;
      await this.plugin.saveSettings();
    });
    const errors = validateApiProvider(provider, this.plugin.settings.settingsLanguage);
    if (errors.length) content.createDiv({ cls: "codex-resource-error", text: copy.common.missing(errors) });
    if (activeProvider?.id === provider.id && this.plugin.settings.providerMode === "custom-api") {
      content.createDiv({ cls: "codex-resource-note", text: copy.providers.configChanged });
    }
  }
  addProviderText(container, label, value, placeholder, onChange, type = "text") {
    const field = container.createDiv({ cls: "codex-api-provider-field" });
    field.createDiv({ cls: "codex-api-provider-label", text: label });
    const input = field.createEl("input", {
      cls: "codex-api-provider-input",
      attr: { type, placeholder, value }
    });
    input.onchange = () => void onChange(input.value);
  }
  addOpenCodeModelPicker(container) {
    const copy = this.copy;
    const opencode = this.plugin.settings.opencode;
    const currentValue = opencode.providerId && opencode.modelId ? openCodeModelChoiceValue({ providerId: opencode.providerId, modelId: opencode.modelId }) : "";
    const field = container.createDiv({ cls: "codex-api-provider-field codex-opencode-model-field" });
    field.createDiv({ cls: "codex-api-provider-label", text: copy.opencode.model });
    const controls = field.createDiv({ cls: "codex-opencode-model-picker" });
    const values = new Set(this.openCodeModelChoices.map((model) => openCodeModelChoiceValue(model)));
    if (this.openCodeModelsLoaded && this.openCodeModelChoices.length) {
      const select = controls.createEl("select", {
        cls: "codex-api-provider-input codex-opencode-model-select",
        attr: { "aria-label": copy.opencode.chooseModel, title: copy.opencode.chooseModel }
      });
      if (!currentValue) {
        select.createEl("option", { text: copy.opencode.chooseModel, value: "" });
      } else if (!values.has(currentValue)) {
        select.createEl("option", { text: copy.opencode.currentModelMissing(opencode.providerId, opencode.modelId), value: currentValue });
      }
      for (const provider of this.openCodeProviders) {
        if (provider.configured === false) continue;
        const providerId = provider.id;
        const providerName = provider.name || providerId;
        const providerModels = this.openCodeModelChoices.filter((model) => model.providerId === providerId);
        if (providerModels.length > 0) {
          const optgroup = select.createEl("optgroup", { attr: { label: providerName } });
          for (const model of providerModels) {
            optgroup.createEl("option", { text: model.displayName.split(" \xB7 ").slice(1).join(" \xB7 "), value: openCodeModelChoiceValue(model) });
          }
        }
      }
      select.value = currentValue && (values.has(currentValue) || opencode.providerId) ? currentValue : "";
      select.onchange = async () => {
        const parsed = parseOpenCodeModelChoiceValue(select.value);
        if (!parsed) return;
        const selected = this.openCodeModelChoices.find((model) => model.providerId === parsed.providerId && model.modelId === parsed.modelId);
        if (!selected) return;
        this.applyOpenCodeModelChoice(selected);
        await this.plugin.saveSettings(true);
        this.display();
      };
    } else {
      controls.createDiv({
        cls: "codex-resource-note codex-opencode-model-empty",
        text: this.openCodeModelsLoading ? copy.opencode.modelLoading : copy.opencode.refreshModelHint
      });
    }
    const refresh = controls.createEl("button", {
      cls: "codex-resource-tab",
      text: this.openCodeModelsLoading ? copy.common.loading : copy.opencode.refreshModels,
      attr: { type: "button" }
    });
    refresh.disabled = this.openCodeModelsLoading;
    refresh.onclick = () => void this.refreshOpenCodeModels();
    const selectedModel = this.openCodeModelChoices.find((model) => model.providerId === opencode.providerId && model.modelId === opencode.modelId);
    field.createDiv({
      cls: "codex-resource-note codex-opencode-model-note",
      text: selectedModel ? copy.opencode.selectedModel(selectedModel.displayName, openCodeModelCapabilityLabel(selectedModel, this.plugin.settings.settingsLanguage)) : copy.opencode.modelNote
    });
  }
  addOpenCodeAgentPicker(container) {
    const copy = this.copy;
    const opencode = this.plugin.settings.opencode;
    const currentValue = opencode.agent?.trim() || "build";
    const field = container.createDiv({ cls: "codex-api-provider-field codex-opencode-agent-field" });
    field.createDiv({ cls: "codex-api-provider-label", text: copy.opencode.agent });
    const controls = field.createDiv({ cls: "codex-opencode-model-picker" });
    const values = new Set(this.openCodeAgentChoices.map((agent) => openCodeAgentChoiceValue(agent)));
    if (this.openCodeAgentsLoaded && this.openCodeAgentChoices.length) {
      const select = controls.createEl("select", {
        cls: "codex-api-provider-input codex-opencode-model-select",
        attr: { "aria-label": copy.opencode.chooseAgent, title: copy.opencode.chooseAgent }
      });
      if (!values.has(currentValue)) {
        select.createEl("option", { text: copy.opencode.currentAgentMissing(currentValue), value: currentValue });
      }
      for (const agent of this.openCodeAgentChoices) {
        select.createEl("option", { text: openCodeAgentChoiceLabel(agent, this.plugin.settings.settingsLanguage), value: openCodeAgentChoiceValue(agent) });
      }
      select.value = currentValue;
      select.onchange = async () => {
        const selectedName = parseOpenCodeAgentChoiceValue(select.value);
        if (!selectedName) return;
        const selected = this.openCodeAgentChoices.find((agent) => agent.name === selectedName);
        opencode.agent = selected?.name ?? selectedName;
        await this.plugin.saveSettings(true);
        this.display();
      };
    } else {
      const input = controls.createEl("input", {
        cls: "codex-api-provider-input codex-opencode-model-select",
        attr: {
          type: "text",
          placeholder: "build",
          value: currentValue,
          "aria-label": copy.opencode.manualAgent
        }
      });
      input.onchange = async () => {
        opencode.agent = input.value.trim() || "build";
        await this.plugin.saveSettings(true);
        this.display();
      };
    }
    const refresh = controls.createEl("button", {
      cls: "codex-resource-tab",
      text: this.openCodeAgentsLoading ? copy.common.loading : copy.opencode.refreshAgent,
      attr: { type: "button" }
    });
    refresh.disabled = this.openCodeAgentsLoading;
    refresh.onclick = () => void this.refreshOpenCodeAgents();
    const selectedAgent = this.openCodeAgentChoices.find((agent) => agent.name === currentValue);
    field.createDiv({
      cls: "codex-resource-note codex-opencode-model-note",
      text: selectedAgent ? copy.opencode.selectedAgent(selectedAgent.name, openCodeAgentModeLabel(selectedAgent, this.plugin.settings.settingsLanguage), selectedAgent.description ?? "") : this.openCodeAgentsLoaded ? copy.opencode.agentMissing(currentValue) : copy.opencode.agentHint
    });
  }
  async refreshOpenCodeModels() {
    await this.refreshOpenCodeRuntimeOptions({ models: true, agents: false });
  }
  async refreshOpenCodeAgents() {
    await this.refreshOpenCodeRuntimeOptions({ models: false, agents: true });
  }
  async refreshOpenCodeRuntimeOptions(options = { models: true, agents: true }) {
    const copy = this.copy;
    const shouldLoadModels = options.models !== false;
    const shouldLoadAgents = options.agents !== false;
    if (shouldLoadModels && this.openCodeModelsLoading || shouldLoadAgents && this.openCodeAgentsLoading) return;
    const backend = new OpenCodeBackend({
      ...this.plugin.settings.opencode,
      vaultPath: this.plugin.getVaultPath()
    });
    if (shouldLoadModels) {
      this.openCodeModelsLoading = true;
      this.openCodeModelsError = "";
    }
    if (shouldLoadAgents) {
      this.openCodeAgentsLoading = true;
      this.openCodeAgentsError = "";
    }
    this.display();
    try {
      await backend.connect();
      const opencode = this.plugin.settings.opencode;
      if (shouldLoadModels) {
        const [models, providers] = await Promise.all([
          backend.listModels(),
          backend.listProviders()
        ]);
        this.openCodeModelChoices = models;
        this.openCodeProviders = providers;
        this.openCodeModelsLoaded = true;
        const current = models.find((model) => model.providerId === opencode.providerId && model.modelId === opencode.modelId);
        if (current) this.applyOpenCodeModelChoice(current);
      }
      if (shouldLoadAgents) {
        const agents = await backend.listAgents();
        this.openCodeAgentChoices = agents;
        this.openCodeAgentsLoaded = true;
        const current = agents.find((agent) => agent.name === opencode.agent);
        if (current) opencode.agent = current.name;
        if (!opencode.agent && agents[0]) opencode.agent = agents[0].name;
      }
      opencode.lastConnectedAt = Date.now();
      opencode.lastError = "";
      await this.plugin.saveSettings(true);
      const notices = [];
      if (shouldLoadModels) notices.push(copy.opencode.modelsCount(this.openCodeModelChoices.length));
      if (shouldLoadAgents) notices.push(copy.opencode.agentsCount(this.openCodeAgentChoices.length));
      new import_obsidian2.Notice(copy.opencode.readSuccess(notices));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (shouldLoadModels) this.openCodeModelsError = message;
      if (shouldLoadAgents) this.openCodeAgentsError = message;
      this.plugin.settings.opencode.lastError = message;
      await this.plugin.saveSettings(true);
      new import_obsidian2.Notice(copy.opencode.readFailed(message));
    } finally {
      await backend.disconnect().catch(() => void 0);
      if (shouldLoadModels) this.openCodeModelsLoading = false;
      if (shouldLoadAgents) this.openCodeAgentsLoading = false;
      this.display();
    }
  }
  applyOpenCodeModelChoice(model) {
    const opencode = this.plugin.settings.opencode;
    opencode.providerId = model.providerId;
    opencode.modelId = model.modelId;
    opencode.textEnabled = model.inputModalities.includes("text");
    opencode.imageEnabled = model.inputModalities.includes("image");
    opencode.pdfEnabled = model.inputModalities.includes("pdf");
  }
  addKnowledgeBaseRulesFilePicker(container) {
    const copy = this.copy;
    const settings = this.plugin.settings.knowledgeBase;
    const currentPath = settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE;
    const field = container.createDiv({ cls: "codex-api-provider-field" });
    field.createDiv({ cls: "codex-api-provider-label", text: copy.knowledge.rulesFile });
    const picker = field.createDiv({ cls: "codex-rules-file-picker" });
    const valueButton = picker.createEl("button", {
      cls: "codex-rules-file-value",
      attr: { type: "button", title: copy.knowledge.chooseRulesTitle }
    });
    const valueIcon = valueButton.createSpan({ cls: "codex-rules-file-icon" });
    (0, import_obsidian2.setIcon)(valueIcon, "file-cog");
    valueButton.createSpan({ text: currentPath });
    valueButton.onclick = () => this.openKnowledgeBaseRulesFilePicker();
    const chooseButton = picker.createEl("button", {
      cls: "codex-resource-tab",
      text: copy.knowledge.chooseFile,
      attr: { type: "button" }
    });
    chooseButton.onclick = () => this.openKnowledgeBaseRulesFilePicker();
    const resetButton = picker.createEl("button", {
      cls: "codex-resource-tab",
      text: copy.knowledge.useRulesFile(DEFAULT_KNOWLEDGE_BASE_RULES_FILE),
      attr: { type: "button" }
    });
    resetButton.disabled = settings.useCustomRulesFile && currentPath === DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
    resetButton.onclick = async () => {
      settings.useCustomRulesFile = true;
      settings.rulesFilePath = DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
      await this.plugin.saveSettings();
      this.display();
    };
    const repairButton = picker.createEl("button", {
      cls: "codex-resource-tab",
      text: copy.knowledge.repairRules,
      attr: { type: "button", title: copy.knowledge.repairRulesTitle }
    });
    repairButton.onclick = () => void this.repairKnowledgeBaseRulesFile();
    field.createDiv({
      cls: "codex-resource-note codex-rules-file-note",
      text: settings.useCustomRulesFile ? copy.knowledge.rulesFileNoteCustom(settings.rulesFilePath || DEFAULT_KNOWLEDGE_BASE_RULES_FILE, AGENTS_RULES_FILE) : copy.knowledge.rulesFileNoteLegacy(AGENTS_RULES_FILE, DEFAULT_KNOWLEDGE_BASE_RULES_FILE)
    });
  }
  addKnowledgeBaseMemoryRecommendation(container) {
    const copy = this.copy;
    const section = container.createDiv({ cls: "codex-editor-actions-section" });
    section.createDiv({ cls: "codex-editor-actions-heading", text: copy.knowledge.memoryHeading });
    section.createDiv({
      cls: "codex-resource-note",
      text: copy.knowledge.memoryNote1
    });
    section.createDiv({
      cls: "codex-resource-note",
      text: copy.knowledge.memoryNote2
    });
    const actions = section.createDiv({ cls: "codex-api-provider-actions" });
    const openMemorySkill = actions.createEl("button", {
      cls: "codex-resource-tab",
      text: copy.knowledge.openMemorySkill,
      attr: { type: "button", title: CODEX_MEMORY_LITE_URL }
    });
    openMemorySkill.onclick = () => window.open(CODEX_MEMORY_LITE_URL);
  }
  async repairKnowledgeBaseRulesFile() {
    const copy = this.copy;
    const settings = this.plugin.settings.knowledgeBase;
    try {
      const result = await repairKnowledgeBaseRulesFile(this.plugin.getVaultPath(), settings);
      if (settings.useCustomRulesFile) settings.rulesFilePath = result.rulesFilePath;
      else settings.rulesFilePath = AGENTS_RULES_FILE;
      await this.plugin.saveSettings();
      this.plugin.getXiaoyuanView()?.refreshKnowledgeBaseDashboard();
      const detail = result.status === "patched" && result.missingRules.length ? copy.knowledge.repairPatchedDetail(result.missingRules.length) : "";
      new import_obsidian2.Notice(`${copy.knowledge.repairSummary(result.status, result.rulesFilePath)}${detail}`);
      this.display();
    } catch (error) {
      new import_obsidian2.Notice(copy.knowledge.repairFailed(error instanceof Error ? error.message : String(error)));
    }
  }
  openKnowledgeBaseRulesFilePicker() {
    const copy = this.copy;
    const filesByPath = new Map(this.app.vault.getMarkdownFiles().map((file) => [file.path, file]));
    const files = getKnowledgeBaseRulesFileChoices(Array.from(filesByPath.keys())).map((filePath) => filesByPath.get(filePath)).filter((file) => file instanceof import_obsidian2.TFile);
    if (!files.length) {
      new import_obsidian2.Notice(copy.knowledge.noMarkdownFiles);
      return;
    }
    new KnowledgeBaseRulesFileSuggestModal(this.app, files, async (file) => {
      const settings = this.plugin.settings.knowledgeBase;
      settings.useCustomRulesFile = true;
      settings.rulesFilePath = sanitizeRelativeSettingsPath(file.path);
      await this.plugin.saveSettings();
      new import_obsidian2.Notice(copy.knowledge.selectedRulesFile(settings.rulesFilePath));
      this.display();
    }, copy).open();
  }
  addProviderTextArea(container, label, value, placeholder, onChange) {
    const field = container.createDiv({ cls: "codex-api-provider-field" });
    field.createDiv({ cls: "codex-api-provider-label", text: label });
    const input = field.createEl("textarea", {
      cls: "codex-api-provider-textarea",
      attr: { placeholder }
    });
    input.value = value;
    input.onchange = () => void onChange(input.value);
  }
  addEditorActionNumber(container, label, value, min, max, onChange) {
    this.decorateSetting(
      new import_obsidian2.Setting(container).setName(label).addText((text) => {
        text.inputEl.type = "number";
        text.inputEl.min = String(min);
        text.inputEl.max = String(max);
        text.setValue(String(value)).onChange(async (raw) => {
          const next = parseClampedInteger(raw, value, min, max);
          await onChange(next);
        });
      }),
      "sliders-horizontal"
    );
  }
  renderWorkspaceResourceManager(container) {
    const copy = this.copy;
    const wrapper = container.createDiv({ cls: "codex-resource-manager" });
    const header = wrapper.createDiv({ cls: "codex-resource-manager-header" });
    const title = header.createDiv({ cls: "codex-resource-manager-title" });
    const icon = title.createSpan({ cls: "codex-setting-icon" });
    (0, import_obsidian2.setIcon)(icon, "blocks");
    title.createSpan({ text: copy.resources.title });
    wrapper.createDiv({
      cls: "codex-resource-note",
      text: copy.resources.note
    });
    const tabs = wrapper.createDiv({ cls: "codex-resource-tabs" });
    for (const tab of RESOURCE_TABS) {
      const button = tabs.createEl("button", {
        cls: `codex-resource-tab ${this.plugin.settings.resourceManagementTab === tab.id ? "is-active" : ""}`,
        attr: { type: "button" }
      });
      const tabIcon = button.createSpan({ cls: "codex-resource-tab-icon" });
      (0, import_obsidian2.setIcon)(tabIcon, tab.icon);
      button.createSpan({ text: copy.resources.tabs[tab.id] });
      button.onclick = async () => {
        this.plugin.settings.resourceManagementTab = tab.id;
        await this.plugin.saveSettings();
        this.display();
      };
    }
    const refresh = tabs.createEl("button", {
      cls: "codex-resource-refresh",
      attr: { type: "button", title: copy.resources.refreshTitle }
    });
    const refreshIcon = refresh.createSpan({ cls: "codex-resource-refresh-icon" });
    (0, import_obsidian2.setIcon)(refreshIcon, "refresh-cw");
    refresh.createSpan({ text: this.resourceLoadingTab === this.plugin.settings.resourceManagementTab ? copy.common.loading : copy.common.refresh });
    refresh.disabled = this.resourceLoadingTab === this.plugin.settings.resourceManagementTab;
    refresh.onclick = () => void this.loadWorkspaceResources(true, this.plugin.settings.resourceManagementTab);
    const activeTab = this.plugin.settings.resourceManagementTab;
    this.renderResourceSearch(wrapper, activeTab);
    const body = wrapper.createDiv({ cls: "codex-resource-body" });
    const activeMeta = RESOURCE_TABS.find((tab) => tab.id === activeTab);
    const isLoading = this.resourceLoadingTab === activeTab;
    const loadError = this.resourceLoadErrors[activeTab] ?? "";
    if (isLoading) {
      body.createDiv({ cls: "codex-resource-empty", text: copy.resources.loadingTab(activeMeta ? copy.resources.tabs[activeMeta.id] : copy.tabs.resources) });
    }
    if (loadError) {
      body.createDiv({ cls: "codex-resource-error", text: copy.common.readFailed(loadError) });
    }
    if (!this.resourceLoaded[activeTab] && !isLoading && !loadError) {
      body.createDiv({ cls: "codex-resource-empty", text: copy.resources.notLoaded });
    }
    if (this.resourceSnapshot && (this.resourceLoaded[activeTab] || isLoading)) this.renderActiveResourceTab(body, this.resourceSnapshot);
    if (!this.resourceLoaded[activeTab] && !isLoading && !loadError) void this.loadWorkspaceResources(false, activeTab);
  }
  renderResourceSearch(container, tab) {
    const copy = this.copy;
    const searchWrap = container.createDiv({ cls: "codex-resource-search" });
    const icon = searchWrap.createSpan({ cls: "codex-resource-search-icon" });
    (0, import_obsidian2.setIcon)(icon, "search");
    const input = searchWrap.createEl("input", {
      cls: "codex-resource-search-input",
      attr: {
        type: "search",
        placeholder: copy.resources.searchPlaceholder(copy.resources.tabs[tab]),
        "aria-label": copy.resources.searchAria
      }
    });
    input.value = this.resourceSearchQuery[tab];
    input.oninput = () => {
      this.resourceSearchQuery[tab] = input.value;
      this.display();
      window.requestAnimationFrame(() => {
        const next = this.containerEl.querySelector(".codex-resource-search-input");
        next?.focus();
        next?.setSelectionRange(next.value.length, next.value.length);
      });
    };
    if (input.value) {
      const clear = searchWrap.createEl("button", {
        cls: "codex-resource-search-clear",
        attr: { type: "button", title: copy.resources.clearSearch, "aria-label": copy.resources.clearSearch }
      });
      (0, import_obsidian2.setIcon)(clear, "x");
      clear.onclick = () => {
        this.resourceSearchQuery[tab] = "";
        this.display();
      };
    }
  }
  renderActiveResourceTab(container, snapshot) {
    if (this.plugin.settings.resourceManagementTab === "plugins") {
      this.renderPluginResources(container, snapshot.plugins, snapshot.errors.plugins);
      return;
    }
    if (this.plugin.settings.resourceManagementTab === "mcp") {
      this.renderMcpResources(container, snapshot.mcpServers, snapshot.errors.mcp);
      return;
    }
    this.renderSkillResources(container, snapshot.skills, snapshot.errors.skills);
  }
  renderPluginResources(container, plugins, error) {
    const copy = this.copy;
    const rows = plugins.map((plugin) => ({
      key: plugin.id,
      kind: "plugins",
      name: plugin.displayName || plugin.name || plugin.id,
      meta: [plugin.category, plugin.marketplace, plugin.installed ? copy.resources.installed : copy.resources.notInstalled].filter(Boolean).join(" \xB7 "),
      desc: plugin.description || plugin.id,
      enabled: resourceEnabled(this.plugin.settings.workspaceResources.plugins, plugin.id, plugin.enabled !== false)
    }));
    const query = this.resourceSearchQuery.plugins;
    const filtered = filterWorkspaceResourceRows(rows, query);
    this.renderResourceSummary(container, plugins.length, rows.filter((row) => row.enabled).length, error, filtered.length, query);
    if (!plugins.length) {
      container.createDiv({ cls: "codex-resource-empty", text: copy.resources.noPlugins });
      return;
    }
    if (!filtered.length) {
      container.createDiv({ cls: "codex-resource-empty", text: copy.resources.noPluginMatches });
      return;
    }
    for (const row of filtered) this.renderResourceRow(container, row);
  }
  renderMcpResources(container, servers, error) {
    const copy = this.copy;
    const rows = servers.map((server) => ({
      key: server.name,
      kind: "mcpServers",
      name: server.name,
      meta: `${copy.resources.toolsCount(Object.keys(server.tools ?? {}).length)} \xB7 ${server.authStatus ?? "unknown"}`,
      desc: copy.resources.mcpDesc,
      enabled: resourceEnabled(this.plugin.settings.workspaceResources.mcpServers, server.name, true)
    }));
    const query = this.resourceSearchQuery.mcp;
    const filtered = filterWorkspaceResourceRows(rows, query);
    this.renderResourceSummary(container, servers.length, rows.filter((row) => row.enabled).length, error, filtered.length, query);
    if (!this.plugin.settings.mcpEnabled && servers.length) {
      container.createDiv({ cls: "codex-resource-warning", text: copy.resources.mcpDisabledWarning });
    }
    if (!servers.length) {
      container.createDiv({ cls: "codex-resource-empty", text: copy.resources.noMcp });
      return;
    }
    if (!filtered.length) {
      container.createDiv({ cls: "codex-resource-empty", text: copy.resources.noMcpMatches });
      return;
    }
    for (const row of filtered) this.renderResourceRow(container, row);
  }
  renderSkillResources(container, skills, error) {
    const copy = this.copy;
    const rows = skills.map((skill) => ({
      key: skill.path || skill.name,
      kind: "skills",
      name: `/${skill.name}`,
      meta: [skill.scope, skill.path].filter(Boolean).join(" \xB7 "),
      desc: skill.description || copy.resources.noDesc,
      enabled: resourceEnabled(this.plugin.settings.workspaceResources.skills, skill.path || skill.name, skill.enabled !== false)
    }));
    const query = this.resourceSearchQuery.skills;
    const filtered = filterWorkspaceResourceRows(rows, query);
    this.renderResourceSummary(container, skills.length, rows.filter((row) => row.enabled).length, error, filtered.length, query);
    if (!skills.length) {
      container.createDiv({ cls: "codex-resource-empty", text: copy.resources.noSkills });
      return;
    }
    if (!filtered.length) {
      container.createDiv({ cls: "codex-resource-empty", text: copy.resources.noSkillMatches });
      return;
    }
    for (const row of filtered) this.renderResourceRow(container, row);
  }
  renderResourceSummary(container, total, enabled, error, visible = total, query = "") {
    const copy = this.copy;
    const searching = Boolean(query.trim());
    container.createDiv({ cls: "codex-resource-summary", text: copy.resources.summary(enabled, total, visible, searching) });
    if (error) container.createDiv({ cls: "codex-resource-error", text: copy.common.partialReadFailed(error) });
  }
  renderResourceRow(container, item) {
    const copy = this.copy;
    const row = container.createDiv({ cls: `codex-resource-row ${item.enabled ? "is-enabled" : "is-disabled"}` });
    const icon = row.createSpan({ cls: "codex-resource-row-icon" });
    (0, import_obsidian2.setIcon)(icon, item.kind === "skills" ? "sparkles" : item.kind === "mcpServers" ? "blocks" : "package");
    const content = row.createDiv({ cls: "codex-resource-row-content" });
    content.createDiv({ cls: "codex-resource-row-name", text: item.name, attr: { title: item.name } });
    if (item.meta) content.createDiv({ cls: "codex-resource-row-meta", text: item.meta, attr: { title: item.meta } });
    if (item.desc) content.createDiv({ cls: "codex-resource-row-desc", text: item.desc, attr: { title: item.desc } });
    const toggle = row.createEl("input", {
      cls: "codex-resource-toggle",
      attr: { type: "checkbox", "aria-label": copy.resources.toggleAria(item.name) }
    });
    toggle.checked = item.enabled;
    toggle.onchange = async () => {
      this.plugin.settings.workspaceResources[item.kind][item.key] = toggle.checked;
      await this.plugin.saveSettings(true);
      this.display();
    };
  }
  async loadWorkspaceResources(force = false, tab = this.plugin.settings.resourceManagementTab) {
    if (this.resourceLoadingTab === tab) return;
    if (this.resourceLoaded[tab] && !force) return;
    this.resourceLoadingTab = tab;
    delete this.resourceLoadErrors[tab];
    this.display();
    try {
      const status = await this.plugin.ensureOpenCodeConnected();
      if (!status.connected) throw new Error(this.copy.resources.codexDisconnected);
      const result = await this.loadResourceTab(tab);
      this.resourceSnapshot = mergeWorkspaceResourceSnapshot(this.resourceSnapshot, result.kind, result.data, result.error);
      this.resourceLoaded[tab] = true;
      this.plugin.settings.workspaceResourceCache = updateWorkspaceResourceCache(
        this.plugin.settings.workspaceResourceCache,
        result.kind,
        result.data,
        result.error
      );
      if (this.plugin.lastStatus) {
        if (tab === "skills") this.plugin.lastStatus.skills = this.resourceSnapshot.skills;
        if (tab === "mcp") this.plugin.lastStatus.mcpServers = this.resourceSnapshot.mcpServers;
      }
      await this.plugin.saveSettings(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.resourceLoadErrors[tab] = message;
      const kind = resourceKindForTab(tab);
      this.resourceSnapshot = mergeWorkspaceResourceSnapshot(this.resourceSnapshot, kind, [], message);
      this.resourceLoaded[tab] = true;
      this.plugin.settings.workspaceResourceCache = updateWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache, kind, [], message);
      await this.plugin.saveSettings(true);
    } finally {
      this.resourceLoadingTab = null;
      this.display();
    }
  }
  async loadResourceTab(tab) {
    const backend = new OpenCodeBackend({
      ...this.plugin.settings.opencode,
      vaultPath: this.plugin.getVaultPath()
    });
    try {
      await backend.connect();
      if (tab === "plugins") {
        const result2 = await backend.refreshPluginResources();
        return { kind: "plugins", data: result2.plugins, error: result2.error };
      }
      if (tab === "mcp") {
        const result2 = await backend.refreshMcpStatus();
        return { kind: "mcp", data: result2.servers, error: result2.error };
      }
      const result = await backend.refreshSkillResources();
      return { kind: "skills", data: result.skills, error: result.error };
    } finally {
      await backend.disconnect().catch(() => void 0);
    }
  }
  addStatusRow(container, iconName, label, value) {
    const row = container.createDiv({ cls: "codex-settings-status-row" });
    const icon = row.createSpan({ cls: "codex-settings-status-icon" });
    (0, import_obsidian2.setIcon)(icon, iconName);
    row.createSpan({ cls: "codex-settings-status-label", text: label });
    row.createSpan({ cls: "codex-settings-status-value", text: value });
  }
  decorateSetting(setting, iconName) {
    const nameEl = setting.nameEl;
    if (!nameEl) return setting;
    const settingEl = setting.settingEl;
    settingEl?.addClass("codex-setting-with-icon");
    nameEl.addClass("codex-setting-name-with-icon");
    const icon = document.createElement("span");
    icon.addClass("codex-setting-icon");
    (0, import_obsidian2.setIcon)(icon, iconName);
    nameEl.prepend(icon);
    return setting;
  }
};
var RESOURCE_TABS = [
  { id: "plugins", icon: "package" },
  { id: "mcp", icon: "blocks" },
  { id: "skills", icon: "sparkles" }
];
var SETTINGS_TABS = [
  { id: "general", icon: "settings" },
  { id: "providers", icon: "key-round" },
  { id: "resources", icon: "blocks" },
  { id: "editorActions", icon: "wand-sparkles" },
  { id: "knowledgeBase", icon: "library" },
  { id: "review", icon: "bar-chart-3" }
];
var EDITOR_ACTION_QUALITY_MODES = [
  { id: "fast", icon: "zap" },
  { id: "quality", icon: "file-search" },
  { id: "strict", icon: "shield-check" }
];
function normalizeEditorActionQualityModeForUi(value) {
  return value === "fast" || value === "quality" || value === "strict" ? value : "quality";
}
function editorActionIcon(actionId) {
  if (actionId === "expand") return "text";
  if (actionId === "continue") return "forward";
  if (actionId === "translate") return "languages";
  return "sparkles";
}
function resourceKindForTab(tab) {
  return tab === "mcp" ? "mcp" : tab === "skills" ? "skills" : "plugins";
}
function detectOpenCodePath(customPath, copy = settingsCopy("zh-CN")) {
  const found = detectOpenCodeCommand(customPath);
  return found ? copy.common.detected(found) : copy.common.notDetectedManual;
}
function normalizeSettingsLanguageForUi(value) {
  return normalizeSettingsLanguage(value);
}
var KnowledgeBaseRulesFileSuggestModal = class extends import_obsidian2.FuzzySuggestModal {
  constructor(app, files, onChoose, copy) {
    super(app);
    this.files = files;
    this.onChoose = onChoose;
    this.setPlaceholder(copy.knowledge.filePickerPlaceholder);
    this.emptyStateText = copy.knowledge.filePickerEmpty;
    this.limit = 40;
  }
  getItems() {
    return this.files;
  }
  getItemText(file) {
    return file.path;
  }
  renderSuggestion(item, el) {
    const path21 = item.item.path;
    const name = path21.split("/").pop() ?? path21;
    el.createDiv({ cls: "suggestion-title", text: name });
    el.createDiv({ cls: "suggestion-note", text: path21 });
  }
  onChooseItem(file, _evt) {
    void this.onChoose(file);
  }
};
function knowledgeStatusLabel(value, copy = settingsCopy("zh-CN")) {
  return copy.knowledge.statusLabels[value] ?? copy.knowledge.statusLabels.idle;
}
function knowledgeInitStatusLabel(value, copy = settingsCopy("zh-CN")) {
  return copy.knowledge.initStatusLabels[value] ?? copy.knowledge.initStatusLabels["not-started"];
}
function pluginInstallDir(plugin) {
  const dir = plugin.manifest.dir;
  return dir ? `${dir}/` : ".obsidian/plugins/codex-echoink/";
}
function formatStorageBytes(value) {
  if (value < 1024) return `${value}B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)}KB`;
  return `${(value / 1024 / 1024).toFixed(1)}MB`;
}
function formatQueryParams(params) {
  return Object.entries(params ?? {}).map(([key, value]) => `${key}=${value}`).join("\n");
}
function parseQueryParams(value) {
  const params = {};
  for (const line of value.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    const key = trimmed.slice(0, separator).trim();
    const paramValue = trimmed.slice(separator + 1).trim();
    if (/^[A-Za-z0-9_-]+$/.test(key) && paramValue) params[key] = paramValue;
  }
  return params;
}
function sanitizeRelativeSettingsPath(value) {
  const clean = value.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  return clean || DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
}
function parseModelList(value) {
  const seen = /* @__PURE__ */ new Set();
  const models = [];
  for (const line of value.split(/\r?\n/)) {
    const model = line.trim();
    if (!model || seen.has(model)) continue;
    seen.add(model);
    models.push(model);
  }
  return models;
}
function parseClampedInteger(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

// src/ui/xiaoyuan-view.ts
var fs4 = __toESM(require("fs"));
var path8 = __toESM(require("path"));
var import_obsidian4 = require("obsidian");

// src/core/clipboard-images.ts
var import_promises2 = require("node:fs/promises");
var path5 = __toESM(require("node:path"));
var IMAGE_EXTENSIONS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "heic", "heif"]);
var MIME_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/heic": "heic",
  "image/heif": "heif"
};
function extractClipboardImageFiles(data) {
  if (!data) return [];
  const itemFiles = Array.from(data.items ?? []).filter((item) => item.kind === "file" || item.type?.startsWith("image/")).map((item) => item.getAsFile?.() ?? null).filter((file) => Boolean(file && isImageFile(file)));
  if (itemFiles.length) return itemFiles;
  return Array.from(data.files ?? []).filter(isImageFile);
}
function imageExtensionForMime(mimeType, fileName = "") {
  const normalizedMime = mimeType.toLowerCase();
  if (MIME_EXTENSIONS[normalizedMime]) return MIME_EXTENSIONS[normalizedMime];
  const nameExtension = path5.extname(fileName).replace(/^\./, "").toLowerCase();
  if (IMAGE_EXTENSIONS.has(nameExtension)) return nameExtension === "jpeg" ? "jpg" : nameExtension;
  if (!normalizedMime.startsWith("image/")) return null;
  const mimeExtension = normalizedMime.slice("image/".length).replace(/\+xml$/, "").replace(/[^a-z0-9]/g, "");
  return mimeExtension || "png";
}
async function saveClipboardImageAttachment(file, options) {
  const vaultPath = options.vaultPath.trim();
  if (!vaultPath) throw new Error("\u7F3A\u5C11 Obsidian \u4ED3\u5E93\u8DEF\u5F84");
  const timestamp = options.timestamp ?? Date.now();
  const index = options.index ?? 0;
  const extension = imageExtensionForMime(file.type, file.name) ?? "png";
  const name = `clipboard-${timestamp}-${index}.${extension}`;
  const target = path5.join(pluginDataDir(vaultPath, options.pluginDir), "clipboard", name);
  await (0, import_promises2.mkdir)(path5.dirname(target), { recursive: true });
  await (0, import_promises2.writeFile)(target, Buffer.from(await file.arrayBuffer()));
  return { type: "image", name, path: target };
}
async function saveClipboardImageAttachments(files, options) {
  const timestamp = options.timestamp ?? Date.now();
  const attachments = [];
  for (let index = 0; index < files.length; index += 1) {
    attachments.push(await saveClipboardImageAttachment(files[index], { vaultPath: options.vaultPath, pluginDir: options.pluginDir, timestamp, index }));
  }
  return attachments;
}
function isImageFile(file) {
  return Boolean(imageExtensionForMime(file.type, file.name));
}

// src/core/diff-summary.ts
var FILE_CHANGE_HEADER_PREFIX = "### Codex file change: ";
function buildDiffSummary(changes) {
  const files = changes.map((change) => {
    const counts = countDiffLines(change.diff ?? "");
    const kind = normalizeChangeKind(change.kind);
    return {
      path: change.path ?? "\u672A\u547D\u540D\u6587\u4EF6",
      previousPath: previousPathFromKind(change.kind),
      kind,
      added: counts.added,
      removed: counts.removed
    };
  });
  return {
    totalFiles: files.length,
    added: files.reduce((sum, file) => sum + file.added, 0),
    removed: files.reduce((sum, file) => sum + file.removed, 0),
    files
  };
}
function serializeFileChanges(changes) {
  return changes.map((change) => `${FILE_CHANGE_HEADER_PREFIX}${change.path ?? "\u672A\u547D\u540D\u6587\u4EF6"}
${change.diff ?? ""}`.trimEnd()).join("\n\n");
}
function parseFileChangeDiff(text, summary) {
  const sections = splitFileChangeText(text, summary);
  return sections.map((section, index) => {
    const summaryFile = summary?.files[index];
    const lines = parseUnifiedDiffLines(section.diff);
    const counts = countParsedDiffLines(lines);
    return {
      path: summaryFile?.path ?? section.path ?? "\u6587\u4EF6\u6539\u52A8",
      previousPath: summaryFile?.previousPath,
      kind: summaryFile?.kind ?? "unknown",
      added: summaryFile?.added ?? counts.added,
      removed: summaryFile?.removed ?? counts.removed,
      lines
    };
  });
}
function diffSummaryLabel(summary) {
  const fileLabel = summary.totalFiles === 1 ? "1 \u4E2A\u6587\u4EF6\u5DF2\u66F4\u6539" : `${summary.totalFiles} \u4E2A\u6587\u4EF6\u5DF2\u66F4\u6539`;
  return fileLabel;
}
function countDiffLines(diff) {
  let added = 0;
  let removed = 0;
  for (const line of diff.split(/\r?\n/)) {
    if (isAddedLine(line)) added += 1;
    else if (isRemovedLine(line)) removed += 1;
  }
  return { added, removed };
}
function countParsedDiffLines(lines) {
  return {
    added: lines.filter((line) => line.type === "add").length,
    removed: lines.filter((line) => line.type === "remove").length
  };
}
function parseUnifiedDiffLines(diff) {
  const parsed = [];
  let oldLine = null;
  let newLine = null;
  for (const rawLine of diff.split(/\r?\n/)) {
    const hunk = rawLine.match(/^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      parsed.push({ type: "hunk", oldLine: null, newLine: null, marker: "@@", text: rawLine });
      continue;
    }
    if (isAddedLine(rawLine)) {
      parsed.push({ type: "add", oldLine: null, newLine, marker: "+", text: rawLine.slice(1) });
      if (newLine !== null) newLine += 1;
      continue;
    }
    if (isRemovedLine(rawLine)) {
      parsed.push({ type: "remove", oldLine, newLine: null, marker: "-", text: rawLine.slice(1) });
      if (oldLine !== null) oldLine += 1;
      continue;
    }
    if (rawLine.startsWith(" ")) {
      parsed.push({ type: "context", oldLine, newLine, marker: "", text: rawLine.slice(1) });
      if (oldLine !== null) oldLine += 1;
      if (newLine !== null) newLine += 1;
      continue;
    }
    parsed.push({ type: "meta", oldLine: null, newLine: null, marker: "", text: rawLine });
  }
  return parsed.filter((line) => line.text.trim() || line.type !== "meta");
}
function splitFileChangeText(text, summary) {
  const headerPattern = new RegExp(`^${escapeRegExp(FILE_CHANGE_HEADER_PREFIX)}(.+)$`, "gm");
  const headers = Array.from(text.matchAll(headerPattern));
  if (headers.length) {
    return headers.map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = index + 1 < headers.length ? headers[index + 1].index ?? text.length : text.length;
      return { path: match[1].trim(), diff: text.slice(start, end).trimStart() };
    });
  }
  if (summary?.files.length) {
    const lines = text.split(/\r?\n/);
    const sections = [];
    let current = null;
    const paths = new Set(summary.files.map((file) => file.path));
    for (const line of lines) {
      if (paths.has(line.trim())) {
        if (current) sections.push(current);
        current = { path: line.trim(), diffLines: [] };
        continue;
      }
      if (current) current.diffLines.push(line);
    }
    if (current) sections.push(current);
    if (sections.length) {
      return sections.map((section) => ({ path: section.path, diff: section.diffLines.join("\n").trimStart() }));
    }
  }
  return [{ path: summary?.files[0]?.path ?? "\u6587\u4EF6\u6539\u52A8", diff: text }];
}
function normalizeChangeKind(kind) {
  if (typeof kind === "string") return kind === "add" || kind === "delete" || kind === "update" || kind === "move" ? kind : "unknown";
  if (!kind || typeof kind !== "object") return "unknown";
  const type = String(kind.type ?? "");
  if (type === "update" && previousPathFromKind(kind)) return "move";
  return type === "add" || type === "delete" || type === "update" ? type : "unknown";
}
function previousPathFromKind(kind) {
  if (!kind || typeof kind !== "object") return void 0;
  const movePath = kind.move_path ?? kind.movePath;
  return typeof movePath === "string" && movePath ? movePath : void 0;
}
function isAddedLine(line) {
  return line.startsWith("+") && !line.startsWith("+++");
}
function isRemovedLine(line) {
  return line.startsWith("-") && !line.startsWith("---");
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/core/mapping.ts
var os2 = __toESM(require("os"));
var path6 = __toESM(require("path"));
var DEFAULT_REPLY_STYLE_INSTRUCTION = "\u56DE\u590D\u683C\u5F0F\u8981\u6C42\uFF1A\u4F7F\u7528\u4E2D\u6587\uFF1B\u5148\u7ED9\u7ED3\u8BBA\uFF0C\u518D\u7ED9\u5173\u952E\u4F9D\u636E\uFF1B\u77ED\u6BB5\u843D\uFF1B\u80FD\u7528\u5217\u8868\u5C31\u7528\u5217\u8868\uFF1B\u5BF9\u6BD4\u3001\u53D6\u820D\u3001\u9A8C\u6536\u9879\u4F18\u5148\u7528 Markdown \u8868\u683C\uFF1B\u907F\u514D\u6574\u6BB5\u957F\u6587\u3002";
function buildUserInput(text, attachments, skill, styleInstruction = DEFAULT_REPLY_STYLE_INSTRUCTION) {
  const input = [];
  if (skill) {
    input.push({ type: "skill", name: skill.name, path: skill.path });
  }
  if (styleInstruction.trim()) {
    input.push({ type: "text", text: styleInstruction.trim(), text_elements: [] });
  }
  const attachmentContext = buildAttachmentContext(attachments);
  if (attachmentContext) {
    input.push({ type: "text", text: attachmentContext, text_elements: [] });
  }
  const trimmed = text.trim();
  if (trimmed) {
    input.push({ type: "text", text: trimmed, text_elements: [] });
  }
  for (const attachment of attachments) {
    if (attachment.type === "image") {
      input.push({ type: "localImage", path: attachment.path });
    } else {
      input.push({ type: "mention", name: attachment.name, path: attachment.path });
    }
  }
  return input;
}
function buildAttachmentContext(attachments) {
  const files = attachments.filter((attachment) => attachment.type === "file");
  if (!files.length) return "";
  const lines = files.map((file) => `- ${file.name}: ${file.path}`);
  return [
    "\u7528\u6237\u5DF2\u9644\u5E26\u4EE5\u4E0B\u6587\u4EF6\u4F5C\u4E3A\u672C\u8F6E\u4E0A\u4E0B\u6587\u3002",
    "\u8FD9\u4E9B\u9644\u4EF6\u53EA\u4F5C\u4E3A\u4E0A\u4E0B\u6587\uFF0C\u4E0D\u4EE3\u8868\u672C\u8F6E\u5DE5\u4F5C\u533A\uFF1B\u5982\u9700\u8BFB\u5199\u6587\u4EF6\uFF0C\u5FC5\u987B\u4EE5\u4F1A\u8BDD\u5DE5\u4F5C\u533A\u4E3A\u51C6\u3002",
    "\u5982\u679C\u7528\u6237\u8BF4\u201C\u5F53\u524D\u7B14\u8BB0\u201D\u201C\u8FD9\u4E2A\u6587\u6863\u201D\u201C\u5DF2\u6DFB\u52A0\u7684\u7B14\u8BB0\u201D\uFF0C\u4F18\u5148\u6307\u8FD9\u4E9B\u6587\u4EF6\uFF1B\u8BF7\u76F4\u63A5\u8BFB\u53D6\u8FD9\u4E9B\u8DEF\u5F84\uFF0C\u4E0D\u8981\u518D\u731C\u6D4B\u5F53\u524D\u6587\u6863\u3002",
    ...lines
  ].join("\n");
}
function getSlashQuery(text) {
  const match = text.match(/(?:^|\s)\/([^\s/]*)$/);
  return match ? match[1].toLowerCase() : null;
}
function filterSkills(skills, query) {
  const q = query.trim().toLowerCase();
  return skills.filter((skill) => skill.enabled !== false).filter((skill) => {
    if (!q) return true;
    return skill.name.toLowerCase().includes(q) || (skill.description || "").toLowerCase().includes(q);
  }).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 12);
}
function contextPercent(totalTokens, contextWindow) {
  if (!totalTokens || !contextWindow || contextWindow <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(totalTokens / contextWindow * 100)));
}
function contextUsageTokens(tokenUsage) {
  const cumulativeTokens = tokenUsage?.total?.totalTokens ?? 0;
  const currentTokens = tokenUsage?.last?.totalTokens ?? tokenUsage?.last?.inputTokens ?? cumulativeTokens;
  return { currentTokens, cumulativeTokens };
}
function contextUsageView(tokenUsage) {
  const { currentTokens, cumulativeTokens } = contextUsageTokens(tokenUsage);
  const contextWindow = tokenUsage?.modelContextWindow ?? null;
  if (!currentTokens || !contextWindow || contextWindow <= 0) {
    return {
      percent: null,
      label: "--",
      totalTokens: currentTokens,
      contextWindow,
      angle: 0,
      title: "\u6682\u672A\u8BFB\u53D6\u5230\u4E0A\u4E0B\u6587\u5BB9\u91CF"
    };
  }
  const percent = contextPercent(currentTokens, contextWindow);
  const titleLines = [`\u4E0A\u4E0B\u6587 ${percent}%\uFF0C${currentTokens} / ${contextWindow} tokens`];
  if (cumulativeTokens && cumulativeTokens !== currentTokens) titleLines.push(`\u7D2F\u8BA1\u6D88\u8017 ${cumulativeTokens} tokens`);
  return {
    percent,
    label: `${percent}%`,
    totalTokens: currentTokens,
    contextWindow,
    angle: percent * 3.6,
    title: titleLines.join("\n")
  };
}
function basename3(filePath) {
  return path6.basename(filePath);
}
function normalizeProcessFileRef(rawPath, vaultPath, basePath) {
  const cleaned = cleanCandidatePath(rawPath);
  const normalizedVault = path6.resolve(vaultPath || "/");
  if (!cleaned) {
    return {
      name: "\u672A\u77E5\u6587\u4EF6",
      path: "",
      displayPath: "\u672A\u77E5\u6587\u4EF6",
      kind: "unknown",
      openable: false
    };
  }
  if (path6.isAbsolute(cleaned)) {
    const absolutePath = path6.normalize(cleaned);
    const relative10 = path6.relative(normalizedVault, absolutePath);
    if (relative10 && !relative10.startsWith("..") && !path6.isAbsolute(relative10)) {
      const displayPath2 = normalizeSlashes2(relative10);
      return {
        name: path6.basename(displayPath2),
        path: displayPath2,
        displayPath: displayPath2,
        kind: "vault",
        openable: true,
        absolutePath
      };
    }
    return {
      name: path6.basename(absolutePath),
      path: absolutePath,
      displayPath: absolutePath,
      kind: "external",
      openable: true,
      absolutePath
    };
  }
  const displayPath = normalizeSlashes2(cleaned.replace(/^\.\//, ""));
  if (basePath && looksLikePath(displayPath)) {
    return normalizeProcessFileRef(path6.resolve(basePath, displayPath), vaultPath);
  }
  return {
    name: path6.basename(displayPath),
    path: displayPath,
    displayPath,
    kind: looksLikePath(displayPath) ? "vault" : "unknown",
    openable: looksLikePath(displayPath)
  };
}
function extractProcessFileRefs(value, vaultPath, basePath) {
  const text = collectSearchableText(value);
  const candidates = /* @__PURE__ */ new Set();
  for (const match of text.matchAll(/(?:^|[\s"'`([{])((?:\.{1,2}\/)?(?:[\w\u4e00-\u9fa5@+.-]+\/)+[\w\u4e00-\u9fa5@+.-]+\.[\w.-]+)/g)) {
    candidates.add(match[1]);
  }
  for (const match of text.matchAll(/(?:^|[\s"'`([{])((?:\/Users|\/Volumes|\/private|\/tmp|\/var|\/opt|\/usr|\/Applications)\/[^\s"'`)\]}<>]+)/g)) {
    candidates.add(match[1]);
  }
  const seen = /* @__PURE__ */ new Set();
  const refs = [];
  for (const candidate of candidates) {
    const ref = normalizeProcessFileRef(candidate, vaultPath, basePath);
    const key = `${ref.kind}:${ref.path}`;
    if (!ref.openable || seen.has(key)) continue;
    seen.add(key);
    refs.push(ref);
  }
  return refs.slice(0, 8);
}
function summarizeProcessEvent(itemType, payload, vaultPath, basePath) {
  const files = extractProcessFileRefs(payload, vaultPath, basePath);
  if (itemType === "reasoning") {
    const text = reasoningTextFromPayload(payload);
    const running = payload?.status === "running" || payload?.status === "in_progress" || payload?.status === "inProgress";
    return {
      title: running ? "\u6B63\u5728\u601D\u8003" : "\u5DF2\u601D\u8003",
      detail: compactText(text || (running ? "\u6B63\u5728\u63A5\u6536\u601D\u8003\u8FC7\u7A0B" : "\u6574\u7406\u4E86\u601D\u8003\u8FC7\u7A0B")),
      files,
      defaultOpen: true,
      kind: "reasoning"
    };
  }
  if (itemType === "plan") {
    return {
      title: "\u66F4\u65B0\u8BA1\u5212",
      detail: "\u6574\u7406\u5F53\u524D\u6B65\u9AA4\u548C\u8FDB\u5EA6",
      files,
      defaultOpen: true,
      kind: "plan"
    };
  }
  if (itemType === "fileChange") {
    return {
      title: "\u7F16\u8F91\u6587\u4EF6",
      detail: files.length ? `\u6D89\u53CA ${files.length} \u4E2A\u6587\u4EF6` : "\u8BB0\u5F55\u6587\u4EF6\u6539\u52A8",
      files,
      defaultOpen: false,
      kind: "edit"
    };
  }
  if (itemType === "mcpToolCall") {
    const toolName = [payload?.server, payload?.tool].filter(Boolean).join(".");
    return {
      title: toolName ? `\u4F7F\u7528\u5DE5\u5177\uFF1A${toolName}` : "\u4F7F\u7528\u5DE5\u5177",
      detail: compactText(payload?.message ?? payload?.status ?? "\u8C03\u7528\u5916\u90E8\u5DE5\u5177"),
      files,
      defaultOpen: false,
      kind: "tool"
    };
  }
  if (itemType === "dynamicToolCall" || itemType === "collabAgentToolCall") {
    const toolName = [payload?.namespace, payload?.tool].filter(Boolean).join(".");
    return {
      title: toolName ? `\u4F7F\u7528\u5DE5\u5177\uFF1A${toolName}` : "\u4F7F\u7528\u5DE5\u5177",
      detail: compactText(payload?.message ?? payload?.status ?? "\u8C03\u7528\u5DE5\u5177"),
      files,
      defaultOpen: false,
      kind: "tool"
    };
  }
  if (itemType === "commandExecution") {
    const commandText = String(payload?.command ?? payload?.text ?? payload ?? "");
    const command = commandSummary(commandText);
    return {
      title: command.title,
      detail: command.detail || compactText(commandText || payload?.status || "\u6267\u884C\u547D\u4EE4"),
      files,
      defaultOpen: false,
      kind: command.kind
    };
  }
  return {
    title: "\u5904\u7406\u8FC7\u7A0B",
    detail: compactText(payload?.message ?? payload?.status ?? "\u8BB0\u5F55\u6267\u884C\u8FC7\u7A0B"),
    files,
    defaultOpen: false,
    kind: "other"
  };
}
function processGroupStateId(items) {
  const first = items[0];
  const last = items[items.length - 1];
  return `group-${first?.runId ?? "none"}-${first?.id ?? "process"}-${last?.id ?? first?.id ?? "process"}-${items.length}`;
}
function reasoningTextFromPayload(payload) {
  return joinTextFragments([payload?.text, payload?.summary, payload?.content]);
}
function commandSummary(command) {
  const trimmed = command.trim();
  const targetName = commandTargetName(trimmed);
  if (/\b(rg|grep|find|fd)\b/.test(trimmed)) return { title: "\u641C\u7D22\u6587\u4EF6", detail: targetName ? `\u641C\u7D22 ${targetName}` : "\u641C\u7D22\u6587\u4EF6", kind: "search" };
  if (/\b(sed|cat|less|head|tail|nl|wc|ls)\b/.test(trimmed)) return { title: "\u67E5\u770B\u6587\u4EF6", detail: targetName ? `Read ${targetName}` : "Read files", kind: "view" };
  if (/\b(apply_patch)\b/.test(trimmed)) return { title: "\u7F16\u8F91\u6587\u4EF6", detail: "\u5DF2\u7F16\u8F91\u6587\u4EF6", kind: "edit" };
  if (/\b(python|node|npm|pnpm|yarn|swift|xcodebuild|tsc|eslint|vitest|jest|pytest|cargo|go test)\b/.test(trimmed)) return { title: "\u8FD0\u884C\u68C0\u67E5", detail: `\u5DF2\u8FD0\u884C ${compactCommand(trimmed)}`, kind: "run" };
  return { title: "\u4F7F\u7528\u547D\u4EE4", detail: `\u5DF2\u8FD0\u884C ${compactCommand(trimmed)}`, kind: "command" };
}
function commandTargetName(command) {
  const refs = extractProcessFileRefs(command, "");
  if (!refs.length) return "";
  return refs[refs.length - 1].name;
}
function compactCommand(command) {
  const firstLine = command.split(/\r?\n/)[0]?.trim() ?? "";
  return firstLine.length > 96 ? `${firstLine.slice(0, 95)}\u2026` : firstLine;
}
function collectSearchableText(value) {
  if (value === null || value === void 0) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(collectSearchableText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(collectSearchableText).join("\n");
  }
  return "";
}
function cleanCandidatePath(value) {
  return value.trim().replace(/^file:\/\//, "").replace(/[,:;]+$/, "").replace(/^['"`]+|['"`]+$/g, "");
}
function normalizeSlashes2(value) {
  return value.split(path6.sep).join("/");
}
function looksLikePath(value) {
  return value.includes("/") || /\.[a-z0-9]{1,8}$/i.test(value);
}
function joinTextFragments(values) {
  const fragments = [];
  const visit = (value) => {
    if (value === null || value === void 0) return;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) fragments.push(trimmed);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value === "number" || typeof value === "boolean") fragments.push(String(value));
  };
  for (const value of values) visit(value);
  return fragments.join("\n").trim();
}
function compactText(value) {
  const compacted = String(value || "").replace(/\s+/g, " ").trim();
  if (!compacted) return "";
  return compacted.length > 96 ? `${compacted.slice(0, 95)}...` : compacted;
}

// src/core/message-state.ts
function settleStaleRunningMessages(messages) {
  let settled = 0;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.status !== "running") continue;
    if (message.itemType === "thinking" || isEmptyProcessMessage(message)) {
      messages.splice(index, 1);
      settled += 1;
      continue;
    }
    message.status = "interrupted";
    settled += 1;
  }
  return settled;
}
function isEmptyProcessMessage(message) {
  if (!isProcessItemType2(message.itemType)) return false;
  return !String(message.text ?? "").trim();
}
function isProcessItemType2(itemType) {
  return itemType === "reasoning" || itemType === "commandExecution" || itemType === "fileChange" || itemType === "mcpToolCall" || itemType === "dynamicToolCall" || itemType === "collabAgentToolCall" || itemType === "plan";
}

// src/core/rate-limits.ts
function normalizeRateLimitResponse(value) {
  const byLimitId = normalizeRateLimitsByLimitId(value?.rateLimitsByLimitId);
  const fallback = normalizeRateLimitSnapshot(value?.rateLimits) ?? normalizeRateLimitSnapshotLike(value);
  const codexEntries = Object.entries(byLimitId ?? {}).filter(([key]) => key.startsWith("codex")).map(([, item]) => item);
  const candidates = [byLimitId?.codex, ...codexEntries, fallback, ...Object.values(byLimitId ?? {})].filter(
    (item) => Boolean(item)
  );
  const preferred = candidates.find(hasUsableRateLimitSnapshot) ?? candidates[0] ?? null;
  return {
    rateLimits: preferred,
    rateLimitsByLimitId: byLimitId
  };
}
function normalizeRateLimitSnapshot(value) {
  if (!value || typeof value !== "object") return null;
  return {
    limitId: typeof value.limitId === "string" ? value.limitId : null,
    limitName: typeof value.limitName === "string" ? value.limitName : null,
    primary: normalizeRateLimitWindow(value.primary),
    secondary: normalizeRateLimitWindow(value.secondary),
    credits: value.credits && typeof value.credits === "object" ? value.credits : null,
    planType: typeof value.planType === "string" ? value.planType : null,
    rateLimitReachedType: typeof value.rateLimitReachedType === "string" ? value.rateLimitReachedType : null
  };
}
function normalizeRateLimitsByLimitId(value) {
  if (!value || typeof value !== "object") return null;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = normalizeRateLimitSnapshot(item) ?? void 0;
  }
  return result;
}
function formatRateLimitUsage(rateLimits) {
  const primary = formatRateLimitWindow(rateLimits?.primary ?? null, "5\u5C0F\u65F6");
  const secondary = formatRateLimitWindow(rateLimits?.secondary ?? null, "1\u5468");
  const summary = primary ? `\u7528\u91CF ${primary.remainingPercent}%` : secondary ? `\u7528\u91CF ${secondary.remainingPercent}%` : "\u7528\u91CF --";
  const parts = [primary, secondary].filter((item) => Boolean(item)).map((item) => `${item.label} ${item.remainingPercent}% \xB7 ${item.resetLabel}`);
  return {
    summary,
    title: parts.length ? `\u5269\u4F59\u989D\u5EA6\uFF1A${parts.join(" / ")}` : "Codex \u7528\u91CF\u6682\u4E0D\u53EF\u7528",
    primary,
    secondary
  };
}
function normalizeRateLimitWindow(value) {
  if (!value || typeof value !== "object" || typeof value.usedPercent !== "number") return null;
  return {
    usedPercent: value.usedPercent,
    windowDurationMins: typeof value.windowDurationMins === "number" ? value.windowDurationMins : null,
    resetsAt: typeof value.resetsAt === "number" ? value.resetsAt : null
  };
}
function normalizeRateLimitSnapshotLike(value) {
  if (!value || typeof value !== "object") return null;
  if (!("primary" in value) && !("secondary" in value) && !("limitId" in value) && !("limitName" in value)) return null;
  return normalizeRateLimitSnapshot(value);
}
function hasUsableRateLimitSnapshot(value) {
  return typeof value.primary?.usedPercent === "number" || typeof value.secondary?.usedPercent === "number";
}
function formatRateLimitWindow(value, fallbackLabel) {
  if (!value || typeof value.usedPercent !== "number") return null;
  const usedPercent = clampPercent(Math.round(value.usedPercent));
  return {
    label: formatWindowDuration(value.windowDurationMins) ?? fallbackLabel,
    remainingPercent: clampPercent(100 - usedPercent),
    usedPercent,
    resetLabel: formatResetLabel(value.resetsAt)
  };
}
function formatWindowDuration(minutes) {
  if (!minutes) return null;
  if (minutes === 300) return "5\u5C0F\u65F6";
  if (minutes === 10080) return "1\u5468";
  if (minutes < 60) return `${minutes}\u5206\u949F`;
  if (minutes % 1440 === 0) return `${minutes / 1440}\u5929`;
  if (minutes % 60 === 0) return `${minutes / 60}\u5C0F\u65F6`;
  return `${minutes}\u5206\u949F`;
}
function formatResetLabel(epochSeconds) {
  if (!epochSeconds) return "--";
  const date = new Date(epochSeconds * 1e3);
  const now = /* @__PURE__ */ new Date();
  const sameDay = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}
function clampPercent(value) {
  return Math.max(0, Math.min(100, value));
}

// src/core/virtual-window.ts
var VIRTUAL_ROW_ESTIMATE_PX = 96;
var VIRTUAL_OVERSCAN_PX = 600;
var VIRTUAL_BOTTOM_FOLLOW_PX = 64;
function calculateVirtualWindow(state) {
  const estimate = Math.max(1, state.estimatedRowHeight ?? VIRTUAL_ROW_ESTIMATE_PX);
  const overscan = Math.max(0, state.overscanPx ?? VIRTUAL_OVERSCAN_PX);
  const viewportHeight = Math.max(0, state.viewportHeight);
  const scrollTop = Math.max(0, state.scrollTop);
  const minTop = Math.max(0, scrollTop - overscan);
  const maxBottom = scrollTop + viewportHeight + overscan;
  const rows = [];
  let top = 0;
  let startIndex = -1;
  let endIndex = -1;
  for (let index = 0; index < state.rowIds.length; index += 1) {
    const id = state.rowIds[index];
    const measured = state.rowHeights?.get(id);
    const height = measured && measured > 0 ? measured : estimate;
    const bottom = top + height;
    if (bottom >= minTop && top <= maxBottom) {
      if (startIndex < 0) startIndex = index;
      endIndex = index + 1;
      rows.push({ id, index, top, height });
    }
    top = bottom;
  }
  if (!rows.length && state.rowIds.length) {
    const fallbackIndex = nearestRowIndex(state.rowIds, state.rowHeights, estimate, scrollTop);
    const fallbackTop = topForRow(state.rowIds, state.rowHeights, estimate, fallbackIndex);
    const id = state.rowIds[fallbackIndex];
    const measured = state.rowHeights?.get(id);
    rows.push({
      id,
      index: fallbackIndex,
      top: fallbackTop,
      height: measured && measured > 0 ? measured : estimate
    });
    startIndex = fallbackIndex;
    endIndex = fallbackIndex + 1;
  }
  return {
    rows,
    totalHeight: top,
    startIndex: Math.max(0, startIndex),
    endIndex: Math.max(0, endIndex)
  };
}
function isNearVirtualBottom(scrollTop, viewportHeight, scrollHeight, threshold = VIRTUAL_BOTTOM_FOLLOW_PX) {
  return Math.max(0, scrollTop) + Math.max(0, viewportHeight) >= Math.max(0, scrollHeight) - Math.max(0, threshold);
}
function scrollTopForVirtualBottom(totalHeight, viewportHeight) {
  return Math.max(0, Math.max(0, totalHeight) - Math.max(0, viewportHeight));
}
function nearestRowIndex(rowIds, rowHeights, estimate, scrollTop) {
  let top = 0;
  for (let index = 0; index < rowIds.length; index += 1) {
    const height = rowHeights?.get(rowIds[index]) ?? estimate;
    if (top + height >= scrollTop) return index;
    top += height;
  }
  return Math.max(0, rowIds.length - 1);
}
function topForRow(rowIds, rowHeights, estimate, targetIndex) {
  let top = 0;
  for (let index = 0; index < targetIndex; index += 1) {
    top += rowHeights?.get(rowIds[index]) ?? estimate;
  }
  return top;
}

// src/ui/xiaoyuan-icon.ts
var XIAOYUAN_ICON_PATHS = [
  "M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35",
  "M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946",
  "M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348",
  "M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45",
  "M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946",
  "M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42"
];
var XIAOYUAN_ICON_SVG = XIAOYUAN_ICON_PATHS.map((d) => `<path d="${d}" />`).join("");
var SETTINGS_GEAR_ICON_PATHS = [
  "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
];
function renderSettingsGearIcon(container) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.addClass("xiaoyuan-settings-gear-svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  for (const d of SETTINGS_GEAR_ICON_PATHS) {
    const path21 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path21.setAttribute("d", d);
    svg.appendChild(path21);
  }
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "3");
  svg.appendChild(circle);
  container.appendChild(svg);
}

// src/ui/composer-state.ts
function composerIsBusy(state) {
  return state.viewRunning || state.knowledgeTaskRunning;
}
function composerPrimaryActionForState(state) {
  if (state.knowledgeTaskRunning) return "cancel-knowledge-task";
  if (state.viewRunning) return "stop-turn";
  return "send";
}

// src/ui/render-message.ts
var import_obsidian3 = require("obsidian");

// src/core/vault-note-links.ts
var VAULT_NOTE_ROOTS = /* @__PURE__ */ new Set(["wiki", "journal", "outputs", "raw", "inbox", "projects", "work", "templates", "archive", "testing", "assets"]);
var COMPACT_PARENT_LABEL_NAMES = /* @__PURE__ */ new Set(["index", "00-\u7D22\u5F15", ".ingest-tracker"]);
function splitVaultNoteLinkSegments(text, vaultBasePathValue = "") {
  const candidates = collectVaultNoteLinkCandidates(text, vaultBasePathValue);
  if (!candidates.length) return [{ kind: "text", text }];
  const segments = [];
  let cursor = 0;
  for (const candidate of candidates) {
    if (candidate.start < cursor) continue;
    if (candidate.start > cursor) segments.push({ kind: "text", text: text.slice(cursor, candidate.start) });
    segments.push({
      kind: "noteLink",
      text: candidate.label,
      original: text.slice(candidate.start, candidate.end),
      targetPath: candidate.targetPath,
      title: candidate.title
    });
    cursor = candidate.end;
  }
  if (cursor < text.length) segments.push({ kind: "text", text: text.slice(cursor) });
  return segments;
}
function collectVaultNoteLinkCandidates(text, vaultBasePathValue) {
  const candidates = [];
  const basePath = normalizeFsPath(vaultBasePathValue).replace(/\/$/, "");
  const markdownLinkPattern = /\[([^\]\n\r]+)]\(([^)\n\r]+?\.md(?:#[^)]+)?)\)/gi;
  for (const match of text.matchAll(markdownLinkPattern)) {
    const start = match.index ?? 0;
    if (start > 0 && text[start - 1] === "!") continue;
    const targetPath = resolveVaultNoteCandidate(match[2], basePath);
    if (!targetPath) continue;
    candidates.push({
      start,
      end: start + match[0].length,
      label: cleanLinkLabel(match[1]) || displayNameForVaultNote(targetPath),
      targetPath,
      title: titleForVaultNote(targetPath, basePath)
    });
  }
  const wikiLinkPattern = /\[\[([^\]\n\r|]+?\.md(?:#[^\]\n\r|]+)?)(?:\|([^\]\n\r]+))?\]\]/gi;
  for (const match of text.matchAll(wikiLinkPattern)) {
    const targetPath = resolveVaultNoteCandidate(match[1], basePath);
    if (!targetPath) continue;
    candidates.push({
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      label: cleanLinkLabel(match[2] ?? "") || displayNameForVaultNote(targetPath),
      targetPath,
      title: titleForVaultNote(targetPath, basePath)
    });
  }
  if (basePath) {
    const absolutePattern = new RegExp(`([\\[(\uFF08]?)((${escapeRegExp2(basePath)})/[^\\n\\r\\t]+?\\.md)([\\])\uFF09]?)`, "gi");
    for (const match of text.matchAll(absolutePattern)) {
      const absolutePath = match[2];
      const targetPath = relativePathForAbsoluteVaultNote(absolutePath, basePath);
      if (!targetPath) continue;
      candidates.push({
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        label: displayNameForVaultNote(targetPath),
        targetPath,
        title: absolutePath
      });
    }
  }
  for (const pattern of [/\[([^\]\n\r]+?\.md)\]/gi]) {
    for (const match of text.matchAll(pattern)) {
      const targetPath = normalizeVaultNoteCandidate(match[1]);
      if (!targetPath) continue;
      candidates.push({
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        label: displayNameForVaultNote(targetPath),
        targetPath,
        title: titleForVaultNote(targetPath, basePath)
      });
    }
  }
  const barePattern = /(^|[\s"'“‘(（:：，,;；、])((?:(?:wiki|journal|outputs|raw|inbox|projects|work|templates|archive|testing|assets)\/[^\n\r\t()[\]<>]+?\.md)|(?:[A-Za-z0-9_.\-\u3400-\u9fff]+\.md))/giu;
  for (const match of text.matchAll(barePattern)) {
    const targetPath = normalizeVaultNoteCandidate(match[2]);
    if (!targetPath) continue;
    const prefixLength = match[1].length;
    const start = (match.index ?? 0) + prefixLength;
    candidates.push({
      start,
      end: start + match[2].length,
      label: displayNameForVaultNote(targetPath),
      targetPath,
      title: titleForVaultNote(targetPath, basePath)
    });
  }
  return candidates.sort((left, right) => left.start - right.start || right.end - left.end);
}
function resolveVaultNoteCandidate(value, basePath) {
  const cleaned = value.trim();
  return relativePathForAbsoluteVaultNote(cleaned, basePath) || normalizeVaultNoteCandidate(cleaned);
}
function normalizeVaultNoteCandidate(value) {
  const withoutAlias = decodeUriPath(value.split("|")[0].split("#")[0].trim().replace(/^\.\//, ""));
  if (!/\.md$/i.test(withoutAlias) || /^https?:\/\//i.test(withoutAlias) || withoutAlias.startsWith("/")) return "";
  const normalized = normalizeVaultPath(withoutAlias);
  const root = normalized.split("/")[0] || "";
  if (!normalized.includes("/") || VAULT_NOTE_ROOTS.has(root)) return normalized;
  return "";
}
function relativePathForAbsoluteVaultNote(absolutePath, basePath) {
  const normalizedAbsolute = normalizeFsPath(decodeUriPath(absolutePath));
  const base = normalizeFsPath(decodeUriPath(basePath)).replace(/\/$/, "");
  const prefix = `${base}/`;
  if (!normalizedAbsolute.startsWith(prefix)) return "";
  return normalizeVaultNoteCandidate(normalizedAbsolute.slice(prefix.length));
}
function titleForVaultNote(relativePath, basePath) {
  return basePath ? `${basePath}/${relativePath}` : relativePath;
}
function displayNameForVaultNote(relativePath) {
  const parts = relativePath.split("/");
  const name = parts.pop()?.replace(/\.md$/i, "") || relativePath;
  const parent = parts.pop();
  if (parent && COMPACT_PARENT_LABEL_NAMES.has(name.toLowerCase())) return `${parent}/${name}`;
  return name;
}
function cleanLinkLabel(value) {
  return value.trim().replace(/\s+/g, " ");
}
function normalizeVaultPath(value) {
  return value.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}
function normalizeFsPath(value) {
  return value.replace(/\\/g, "/");
}
function decodeUriPath(value) {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}
function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/ui/render-message.ts
function renderRichText(app, component, container, text) {
  container.empty();
  const lines = text.split(/\r?\n/);
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const fence = line.match(/^```(\w+)?/);
    if (fence) {
      const language = fence[1] || "";
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      renderCodeBlock(container, codeLines.join("\n"), language);
      continue;
    }
    if (line.trim().startsWith("|") && index + 1 < lines.length && lines[index + 1].includes("---")) {
      const tableLines = [line, lines[index + 1]];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      renderTable(container, tableLines);
      continue;
    }
    if (!line.trim()) {
      container.createDiv({ cls: "codex-message-spacer" });
      index += 1;
      continue;
    }
    renderLine(app, component, container, line);
    index += 1;
  }
}
function renderLine(app, component, container, line) {
  const trimmed = line.trim();
  if (/^>\s+/.test(trimmed)) {
    const callout = container.createDiv({ cls: "codex-message-callout" });
    renderInline(app, component, callout, trimmed.replace(/^>\s+/, ""));
    return;
  }
  if (trimmed.startsWith("#")) {
    const level = Math.min(4, trimmed.match(/^#+/)?.[0].length ?? 2);
    const heading = container.createEl(`h${level}`, { cls: "codex-message-heading" });
    heading.setText(trimmed.replace(/^#+\s*/, ""));
    return;
  }
  if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
    const row = container.createDiv({ cls: "codex-message-list-row" });
    const task = trimmed.match(/^[-*]\s+\[([ xX])]\s+(.*)$/);
    if (task) {
      const box = row.createSpan({ cls: `codex-message-checkbox ${task[1].trim() ? "is-checked" : ""}` });
      if (task[1].trim()) box.setText("\u2713");
      renderInline(app, component, row.createSpan(), task[2]);
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const number = trimmed.match(/^(\d+)\.\s+/)?.[1] ?? "1";
      row.createSpan({ cls: "codex-message-number", text: `${number}.` });
      renderInline(app, component, row.createSpan(), trimmed.replace(/^\d+\.\s+/, ""));
    } else {
      row.createSpan({ cls: "codex-message-bullet", text: "\u2022" });
      renderInline(app, component, row.createSpan(), trimmed.replace(/^[-*]\s+/, ""));
    }
    return;
  }
  const imageMatch = trimmed.match(/!\[\[([^\]]+)\]\]|!\[[^\]]*]\(([^)]+)\)/);
  if (imageMatch) {
    const path21 = imageMatch[1] || imageMatch[2];
    const wrapper = container.createDiv({ cls: "codex-embedded-image" });
    const img = wrapper.createEl("img");
    img.src = resolveImageSrc(app, path21);
    img.onclick = () => openImageOverlay(img.src);
    return;
  }
  for (const paragraphText of splitReadableParagraphs(line)) {
    const paragraph = container.createEl("p");
    renderInline(app, component, paragraph, paragraphText);
  }
}
function resolveImageSrc(app, rawPath) {
  const cleaned = rawPath.split("|")[0].split("#")[0].trim();
  if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith("data:") || cleaned.startsWith("file://")) return cleaned;
  if (cleaned.startsWith("/")) return `file://${encodeURI(cleaned)}`;
  const file = app.vault.getAbstractFileByPath((0, import_obsidian3.normalizePath)(cleaned));
  if (file instanceof import_obsidian3.TFile) return app.vault.getResourcePath(file);
  return cleaned;
}
function renderInline(app, component, container, text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      if (!renderSingleVaultNoteLink(app, component, container, code)) container.createEl("code", { text: code });
    } else if (part.startsWith("**") && part.endsWith("**")) {
      const strong = container.createEl("strong");
      renderLinkedText(app, component, strong, part.slice(2, -2));
    } else {
      renderLinkedText(app, component, container, part);
    }
  }
}
function renderLinkedText(app, component, container, text) {
  for (const segment of splitVaultNoteLinkSegments(text, vaultBasePath(app))) {
    if (segment.kind === "text") {
      container.appendText(segment.text);
      continue;
    }
    if (!renderVaultNoteLink(app, component, container, segment)) container.appendText(segment.original);
  }
}
function renderSingleVaultNoteLink(app, component, container, text) {
  const segments = splitVaultNoteLinkSegments(text, vaultBasePath(app));
  if (segments.length !== 1 || segments[0].kind !== "noteLink") return false;
  return renderVaultNoteLink(app, component, container, segments[0]);
}
function renderVaultNoteLink(app, component, container, segment) {
  const resolved = resolveVaultNoteFile(app, segment.targetPath);
  if (!resolved && !isHiddenVaultMarkdownPath(segment.targetPath)) return false;
  const targetPath = resolved?.targetPath ?? (0, import_obsidian3.normalizePath)(segment.targetPath);
  const link = container.createEl("a", {
    cls: "codex-message-note-link",
    text: segment.text,
    attr: {
      href: "#",
      title: segment.title,
      "data-path": targetPath
    }
  });
  component.registerDomEvent(link, "click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const current = app.vault.getAbstractFileByPath(targetPath);
    if (current instanceof import_obsidian3.TFile) await app.workspace.getLeaf("tab").openFile(current, { active: true });
    else await openHiddenVaultMarkdown(app, targetPath);
  });
  return true;
}
function resolveVaultNoteFile(app, targetPath) {
  for (const candidate of knowledgeBaseLinkTargetCandidates(targetPath)) {
    const normalized = (0, import_obsidian3.normalizePath)(candidate);
    const file = app.vault.getAbstractFileByPath(normalized);
    if (file instanceof import_obsidian3.TFile) return { file, targetPath: normalized };
  }
  return null;
}
function knowledgeBaseLinkTargetCandidates(targetPath) {
  const normalized = (0, import_obsidian3.normalizePath)(targetPath);
  const candidates = [normalized];
  const basename9 = normalized.split("/").pop() ?? "";
  if (/^outputs\/kb-maintenance-.+\.md$/i.test(normalized)) candidates.push(`outputs/maintenance/${basename9}`);
  if (/^outputs\/knowledge-base-review-.+\.md$/i.test(normalized)) candidates.push(`outputs/reviews/${basename9}`);
  if (/^outputs\/old-wiki-merge-.+\.md$/i.test(normalized)) candidates.push(`outputs/migrations/${basename9}`);
  if (/^outputs\/[^/]+instructions[^/]*\.md$/i.test(normalized)) candidates.push(`outputs/instructions/${basename9}`);
  if (/^outputs\/[^/]*xhs[^/]*\.md$/i.test(normalized)) candidates.push(`outputs/publishing/xiaohongshu/${basename9}`);
  return candidates;
}
function isHiddenVaultMarkdownPath(targetPath) {
  return /(^|\/)\.[^/]+\.md$/i.test((0, import_obsidian3.normalizePath)(targetPath));
}
async function openHiddenVaultMarkdown(app, targetPath) {
  const normalized = (0, import_obsidian3.normalizePath)(targetPath);
  const exists7 = await app.vault.adapter.exists(normalized).catch(() => false);
  if (!exists7) return;
  const basePath = vaultBasePath(app);
  const absolutePath = basePath ? `${basePath}/${normalized}` : "";
  const shell = electronModule()?.shell;
  if (absolutePath && shell?.openPath) await shell.openPath(absolutePath);
}
function electronModule() {
  const electronRequire = window.require ?? globalThis.require;
  try {
    return electronRequire?.("electron");
  } catch {
    return null;
  }
}
function vaultBasePath(app) {
  const adapter = app.vault.adapter;
  const basePath = typeof adapter.getBasePath === "function" ? adapter.getBasePath() : "";
  return typeof basePath === "string" ? normalizeFsPath2(basePath) : "";
}
function normalizeFsPath2(value) {
  return value.replace(/\\/g, "/");
}
function renderCodeBlock(container, code, language) {
  const wrapper = container.createDiv({ cls: "codex-code-wrapper" });
  if (language) wrapper.createSpan({ cls: "codex-code-lang", text: language });
  const button = wrapper.createEl("button", { cls: "codex-code-copy", attr: { type: "button" } });
  (0, import_obsidian3.setIcon)(button, "copy");
  button.onclick = async () => {
    await navigator.clipboard.writeText(code);
    button.empty();
    button.setText("\u5DF2\u590D\u5236");
    window.setTimeout(() => {
      button.empty();
      (0, import_obsidian3.setIcon)(button, "copy");
    }, 1200);
  };
  wrapper.createEl("pre").createEl("code", { text: code });
}
function renderTable(container, lines) {
  const table = container.createEl("table", { cls: "codex-message-table" });
  const headerCells = splitTableRow(lines[0]);
  const thead = table.createEl("thead").createEl("tr");
  for (const cell of headerCells) thead.createEl("th", { text: cell });
  const tbody = table.createEl("tbody");
  for (const line of lines.slice(2)) {
    const tr = tbody.createEl("tr");
    for (const cell of splitTableRow(line)) tr.createEl("td", { text: cell });
  }
}
function splitTableRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}
function splitReadableParagraphs(line) {
  if (line.length < 180) return [line];
  const chunks = line.split(/(?<=[。！？；])\s*/u).map((item) => item.trim()).filter(Boolean);
  if (chunks.length <= 1) return [line];
  const paragraphs = [];
  let current = "";
  for (const chunk of chunks) {
    if (current && `${current}${chunk}`.length > 120) {
      paragraphs.push(current);
      current = chunk;
    } else {
      current = current ? `${current}${chunk}` : chunk;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs;
}
function openImageOverlay(src) {
  const overlay = document.body.createDiv({ cls: "codex-image-overlay" });
  const img = overlay.createEl("img");
  img.src = src;
  overlay.onclick = () => overlay.remove();
}

// src/ui/turn-watchdog.ts
var CHAT_TURN_WATCHDOG_MS = 5 * 60 * 1e3;
function turnWatchdogTimeoutForSession(isKnowledgeBaseSession2, fallbackMs = CHAT_TURN_WATCHDOG_MS) {
  return isKnowledgeBaseSession2 ? null : fallbackMs;
}
function turnWatchdogTimeoutText(timeoutMs) {
  const minutes = Math.max(1, Math.floor(timeoutMs / 6e4));
  return `\u8FD9\u8F6E\u56DE\u590D\u8D85\u8FC7 ${minutes} \u5206\u949F\u6CA1\u6709\u5B8C\u6210\uFF0C\u5DF2\u505C\u6B62\u7B49\u5F85\u3002\u53EF\u4EE5\u91CD\u8BD5\u6216\u91CD\u65B0\u8FDE\u63A5 Codex\u3002`;
}

// src/ui/xiaoyuan-view.ts
init_modals();

// src/editor-actions/prompt.ts
var EDITOR_ACTION_OUTPUT_RULES = [
  "\u53EA\u8FD4\u56DE\u6700\u7EC8\u5019\u9009\u6587\u672C\u3002",
  "\u628A\u5019\u9009\u6B63\u6587\u653E\u5728 <codex-candidate> \u548C </codex-candidate> \u4E4B\u95F4\u3002",
  "\u6807\u7B7E\u5916\u4E0D\u8981\u8F93\u51FA\u4EFB\u4F55\u5185\u5BB9\uFF1B\u5982\u679C\u8BEF\u8F93\u51FA\uFF0C\u63D2\u4EF6\u4F1A\u4E22\u5F03\u3002",
  "\u4E0D\u8981\u89E3\u91CA\u3002",
  "\u4E0D\u8981\u4F7F\u7528\u4EE3\u7801\u5757\u5305\u88F9\u3002",
  "\u4E0D\u8981\u64C5\u81EA\u4FEE\u6539\u672A\u9009\u4E2D\u7684\u5185\u5BB9\u3002",
  "\u4FDD\u7559 Markdown \u683C\u5F0F\u3002"
].join("\n");
function resolveEditorActionStyle(settings, styleId = settings.defaultStyleId) {
  return settings.styles.find((style) => style.id === styleId) ?? settings.styles.find((style) => style.id === "clear") ?? settings.styles[0] ?? {
    id: "clear",
    label: "\u6E05\u695A",
    instruction: "\u8868\u8FBE\u6E05\u695A\u3001\u51C6\u786E\u3001\u81EA\u7136\u3002"
  };
}
function buildEditorActionPrompt(input) {
  const modeLabel = input.modeLabel ?? "";
  const translateAction = isTranslateAction(input.action.id);
  const articleUnderstanding = input.snapshot.articleUnderstanding ?? input.snapshot.noteSummary ?? "";
  const variables = {
    action: input.action.label,
    style: `${input.style.label}\uFF1A${input.style.instruction}`,
    selected_text: input.snapshot.selectedText,
    before_context: input.snapshot.beforeContext,
    after_context: input.snapshot.afterContext,
    file_path: input.snapshot.filePath,
    file_name: input.snapshot.fileName
  };
  const renderedTemplate = renderTemplate(input.action.promptTemplate, variables).trim();
  const articleUnderstandingNotice = articleUnderstanding && input.snapshot.articleUnderstandingState === "reusable" ? "\u6CE8\u610F\uFF1A\u8FD9\u4EFD\u6587\u7AE0\u7406\u89E3\u6765\u81EA\u7A0D\u65E9\u7248\u672C\u3002\u5F53\u524D\u9009\u533A\u548C\u524D\u540E\u6587\u4F18\u5148\uFF0C\u6587\u7AE0\u7406\u89E3\u53EA\u7528\u4E8E\u4E3B\u9898\u3001\u98CE\u683C\u3001\u4E8B\u5B9E\u8FB9\u754C\u3002" : "";
  return [
    `\u4F60\u6B63\u5728 Obsidian \u7B14\u8BB0\u4E2D\u6267\u884C\u300C${input.action.label}\u300D\u3002`,
    `\u5F53\u524D\u6587\u4EF6\uFF1A${input.snapshot.fileName} (${input.snapshot.filePath})`,
    modeLabel ? `\u5199\u4F5C\u8D28\u91CF\uFF1A${modeLabel}` : "",
    translateAction ? "" : `\u5199\u4F5C\u98CE\u683C\uFF1A${variables.style}`,
    articleUnderstanding ? "\u5F53\u524D\u6587\u7AE0\u7406\u89E3\uFF1A" : "",
    articleUnderstandingNotice,
    articleUnderstanding ? fenceContext(articleUnderstanding) : "",
    "",
    "\u9009\u533A\u524D\u6587\uFF1A",
    fenceContext(input.snapshot.beforeContext),
    "",
    "\u9009\u4E2D\u6587\u5B57\uFF1A",
    fenceContext(input.snapshot.selectedText),
    "",
    "\u9009\u533A\u540E\u6587\uFF1A",
    fenceContext(input.snapshot.afterContext),
    "",
    "\u4EFB\u52A1\u8981\u6C42\uFF1A",
    renderedTemplate,
    input.action.id === "continue" ? "\u7EED\u5199\u65F6\u4E0D\u8981\u91CD\u590D\u539F\u6587\uFF0C\u53EA\u8FD4\u56DE\u5E94\u8BE5\u8FFD\u52A0\u5728\u9009\u4E2D\u6587\u5B57\u540E\u9762\u7684\u6B63\u6587\u3002" : "",
    translateAction ? "\u7FFB\u8BD1\u65F6\u53EA\u8FD4\u56DE\u82F1\u6587\u8BD1\u6587\uFF0C\u4E0D\u8981\u9644\u5E26\u4E2D\u6587\u539F\u6587\u3001\u89E3\u91CA\u3001\u6CE8\u91CA\u6216\u591A\u4E2A\u7248\u672C\u3002" : "",
    "",
    "\u8F93\u51FA\u89C4\u5219\uFF1A",
    EDITOR_ACTION_OUTPUT_RULES
  ].filter((line) => line !== "").join("\n");
}
function buildEditorActionReviewPrompt(input) {
  const modeLabel = input.modeLabel ?? "\u4E25\u683C";
  const translateAction = isTranslateAction(input.action.id);
  const articleUnderstanding = input.snapshot.articleUnderstanding ?? input.snapshot.noteSummary ?? "";
  const articleUnderstandingNotice = articleUnderstanding && input.snapshot.articleUnderstandingState === "reusable" ? "\u6CE8\u610F\uFF1A\u8FD9\u4EFD\u6587\u7AE0\u7406\u89E3\u6765\u81EA\u7A0D\u65E9\u7248\u672C\u3002\u5F53\u524D\u9009\u533A\u548C\u524D\u540E\u6587\u4F18\u5148\uFF0C\u6587\u7AE0\u7406\u89E3\u53EA\u7528\u4E8E\u4E3B\u9898\u3001\u98CE\u683C\u3001\u4E8B\u5B9E\u8FB9\u754C\u3002" : "";
  return [
    `\u4F60\u6B63\u5728\u5BA1\u6821 Obsidian \u7B14\u8BB0\u4E2D\u7684\u300C${input.action.label}\u300D\u5019\u9009\u3002`,
    `\u5F53\u524D\u6587\u4EF6\uFF1A${input.snapshot.fileName} (${input.snapshot.filePath})`,
    `\u5199\u4F5C\u8D28\u91CF\uFF1A${modeLabel}`,
    translateAction ? "" : `\u5199\u4F5C\u98CE\u683C\uFF1A${input.style.label}\uFF1A${input.style.instruction}`,
    articleUnderstanding ? "\u5F53\u524D\u6587\u7AE0\u7406\u89E3\uFF1A" : "",
    articleUnderstandingNotice,
    articleUnderstanding ? fenceContext(articleUnderstanding) : "",
    "",
    "\u9009\u533A\u524D\u6587\uFF1A",
    fenceContext(input.snapshot.beforeContext),
    "",
    "\u539F\u9009\u4E2D\u6587\u5B57\uFF1A",
    fenceContext(input.snapshot.selectedText),
    "",
    "\u9009\u533A\u540E\u6587\uFF1A",
    fenceContext(input.snapshot.afterContext),
    "",
    "\u5F85\u5BA1\u6821\u5019\u9009\uFF1A",
    fenceContext(input.candidateText),
    "",
    "\u5BA1\u6821\u8981\u6C42\uFF1A",
    ...translateAction ? [
      "1. \u68C0\u67E5\u5019\u9009\u662F\u5426\u51C6\u786E\u7FFB\u8BD1\u4E3A\u81EA\u7136\u82F1\u6587\u3002",
      "2. \u68C0\u67E5\u662F\u5426\u4FDD\u7559\u539F\u6587\u4E8B\u5B9E\u3001\u6570\u5B57\u3001\u4E13\u6709\u540D\u8BCD\u3001Markdown \u548C\u8BED\u6C14\u3002",
      "3. \u4E0D\u8981\u6062\u590D\u4E2D\u6587\u539F\u6587\uFF0C\u4E0D\u8981\u65B0\u589E\u89E3\u91CA\uFF0C\u4E0D\u8981\u8F93\u51FA\u591A\u4E2A\u7248\u672C\u3002",
      "4. \u5982\u679C\u5019\u9009\u6CA1\u6709\u95EE\u9898\uFF0C\u539F\u6837\u8FD4\u56DE\u3002",
      "5. \u5982\u679C\u6709\u95EE\u9898\uFF0C\u53EA\u8FD4\u56DE\u4FEE\u6B63\u540E\u7684\u6700\u7EC8\u82F1\u6587\u8BD1\u6587\u3002"
    ] : [
      "1. \u68C0\u67E5\u5019\u9009\u662F\u5426\u4FDD\u7559\u4E8B\u5B9E\u3001\u8D34\u5408\u6587\u7AE0\u98CE\u683C\u3001\u548C\u524D\u540E\u6587\u81EA\u7136\u8854\u63A5\u3002",
      "2. \u68C0\u67E5\u662F\u5426\u91CD\u590D\u539F\u6587\u3001\u7F16\u9020\u786C\u4E8B\u5B9E\u3001\u7834\u574F Markdown \u6216\u8F93\u51FA\u591A\u4E2A\u7248\u672C\u3002",
      "3. \u5982\u679C\u5019\u9009\u6CA1\u6709\u95EE\u9898\uFF0C\u539F\u6837\u8FD4\u56DE\u3002",
      "4. \u5982\u679C\u6709\u95EE\u9898\uFF0C\u53EA\u8FD4\u56DE\u4FEE\u6B63\u540E\u7684\u6700\u7EC8\u5019\u9009\u6B63\u6587\u3002",
      input.action.id === "continue" ? "5. \u7EED\u5199\u53EA\u80FD\u8FD4\u56DE\u8FFD\u52A0\u5728\u9009\u4E2D\u6587\u5B57\u540E\u9762\u7684\u6B63\u6587\uFF0C\u4E0D\u8981\u91CD\u590D\u539F\u6587\uFF0C\u4E5F\u4E0D\u8981\u6539\u5199\u540E\u6587\u3002" : ""
    ],
    "",
    "\u8F93\u51FA\u89C4\u5219\uFF1A",
    EDITOR_ACTION_OUTPUT_RULES
  ].filter((line) => line !== "").join("\n");
}
function buildEditorActionUserInput(prompt) {
  return [{ type: "text", text: prompt.trim(), text_elements: [] }];
}
function renderTemplate(template, variables) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => variables[key] ?? "");
}
function fenceContext(value) {
  return value ? `<<<
${value}
>>>` : "<<<\n\n>>>";
}
function isTranslateAction(actionId) {
  return actionId === "translate";
}

// src/editor-actions/state.ts
function editorActionStartBlockReason(input) {
  if (!input.running) return null;
  if (!input.activeRunId && !input.activeTurnId && !input.hasEditorActionRun) return null;
  return "Codex \u6B63\u5728\u5904\u7406\u4E0A\u4E00\u8F6E\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
}
function extractEditorActionNotificationIds(params) {
  return {
    threadId: firstString(params?.threadId, params?.thread?.id, params?.turn?.threadId, params?.item?.threadId),
    turnId: firstString(params?.turnId, params?.turn?.id, params?.item?.turnId),
    itemId: firstString(params?.itemId, params?.item?.id)
  };
}
function isEditorActionHiddenNotification(input) {
  const ids = extractEditorActionNotificationIds(input.params);
  return Boolean(
    ids.threadId && input.threadIds.has(ids.threadId) || ids.turnId && input.turnIds.has(ids.turnId) || ids.itemId && input.itemIds.has(ids.itemId)
  );
}
function isEditorActionCurrentRunNotification(input) {
  const ids = extractEditorActionNotificationIds(input.params);
  if (!ids.threadId && !ids.turnId && !ids.itemId) return Boolean(input.allowUnscoped);
  if (ids.itemId && input.itemIds.has(ids.itemId) && !input.currentItemIds?.has(ids.itemId)) return false;
  return Boolean(
    ids.threadId && ids.threadId === input.currentThreadId || ids.turnId && ids.turnId === input.currentTurnId || ids.itemId && input.currentItemIds?.has(ids.itemId)
  );
}
function routeEditorActionNotification(input) {
  const ids = extractEditorActionNotificationIds(input.params);
  const hidden = isEditorActionHiddenNotification({
    params: input.params,
    threadIds: input.threadIds,
    turnIds: input.turnIds,
    itemIds: input.itemIds
  });
  const current = input.active && isEditorActionCurrentRunNotification({
    params: input.params,
    currentThreadId: input.currentThreadId,
    currentTurnId: input.currentTurnId,
    threadIds: input.threadIds,
    turnIds: input.turnIds,
    itemIds: input.itemIds,
    currentItemIds: input.currentItemIds,
    allowUnscoped: input.allowUnscoped
  });
  const canAdoptAssistantDelta = Boolean(
    input.active && input.method === "item/agentMessage/delta" && ids.itemId && !input.itemIds.has(ids.itemId)
  );
  const effectiveCurrent = current || canAdoptAssistantDelta;
  const hiddenMethod = isEditorActionStreamMethod(input.method);
  const swallow = hidden || effectiveCurrent || input.active && hiddenMethod;
  return {
    swallow,
    current: effectiveCurrent,
    collectAssistantDelta: effectiveCurrent && input.method === "item/agentMessage/delta",
    rememberCurrentItem: canAdoptAssistantDelta
  };
}
function isEditorActionStreamMethod(method) {
  return method.startsWith("thread/") || method.startsWith("turn/") || method.startsWith("item/") || method === "error";
}
function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

// src/editor-actions/turn-options.ts
var EMPTY_RESOURCES = { plugins: {}, mcpServers: {}, skills: {} };
var EDITOR_ACTION_MODEL_PREFERENCE = [
  DEFAULT_EDITOR_ACTION_MODEL,
  "gpt-5.4",
  "gpt-5.5"
];
function resolveEditorActionModel(input) {
  const configuredModel = input.configuredModel?.trim() || DEFAULT_EDITOR_ACTION_MODEL;
  const availableModels = Array.from(new Set((input.availableModels ?? []).map((model) => model.trim()).filter(Boolean)));
  if (!availableModels.length) return input.preferConfiguredWithoutAvailability ? configuredModel || input.fallbackModel : input.fallbackModel;
  if (availableModels.includes(configuredModel)) return configuredModel;
  for (const model of EDITOR_ACTION_MODEL_PREFERENCE) {
    if (availableModels.includes(model)) return model;
  }
  if (availableModels.includes(input.fallbackModel)) return input.fallbackModel;
  return availableModels[0] ?? input.fallbackModel;
}
function buildEditorActionTurnOptions(input) {
  const requestTimeoutMs = normalizeEditorActionTimeout(input.timeoutMs);
  return {
    model: input.model,
    reasoning: "medium",
    serviceTier: input.serviceTier === "flex" ? "flex" : "fast",
    permission: "read-only",
    mode: "agent",
    mcpEnabled: false,
    persistExtendedHistory: false,
    requestTimeoutMs,
    workspaceResources: input.workspaceResources ?? EMPTY_RESOURCES
  };
}
function normalizeEditorActionTimeout(value) {
  if (!Number.isFinite(value)) return 45e3;
  return Math.max(1e4, Math.min(3e5, Math.round(value)));
}

// src/editor-actions/summary-cache.ts
var MAX_SUMMARY_SOURCE_CHARS = 12e3;
var ARTICLE_UNDERSTANDING_REUSE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1e3;
var ARTICLE_UNDERSTANDING_REUSE_RATIO = 0.12;
var ARTICLE_UNDERSTANDING_REUSE_MIN_DELTA = 600;
var ARTICLE_UNDERSTANDING_REUSE_MAX_DELTA = 3e3;
var MAX_STABLE_LINE_HASHES = 12;
function editorActionContentHash(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function makeArticleUnderstandingCacheEntry(source, understanding, mode, model, now = Date.now()) {
  return {
    filePath: source.filePath,
    mtime: source.mtime,
    size: source.size,
    contentHash: editorActionContentHash(source.text),
    model,
    mode,
    understanding: understanding.trim(),
    fingerprint: makeArticleUnderstandingFingerprint(source.text),
    updatedAt: now,
    lastUsedAt: now
  };
}
function resolveArticleUnderstandingCache(cache, source, mode, model, now = Date.now()) {
  const entry = cache[source.filePath] ?? null;
  if (!entry) return { state: "missing", entry: null };
  if (!entry.understanding.trim()) return { state: "stale", entry };
  if (entry.mode !== mode || entry.model !== model) return { state: "stale", entry };
  if (entry.mtime === source.mtime && entry.size === source.size && entry.contentHash === editorActionContentHash(source.text)) {
    entry.lastUsedAt = now;
    return { state: "fresh", entry };
  }
  if (isReusableArticleUnderstanding(entry, source, now)) {
    entry.lastUsedAt = now;
    return { state: "reusable", entry };
  }
  return { state: "stale", entry };
}
function upsertArticleUnderstandingCache(cache, entry, maxEntries = 200) {
  const next = { ...cache, [entry.filePath]: entry };
  const entries = Object.values(next);
  if (entries.length <= maxEntries) return next;
  entries.sort((left, right) => left.lastUsedAt - right.lastUsedAt || left.updatedAt - right.updatedAt).slice(0, Math.max(0, entries.length - maxEntries)).forEach((stale) => delete next[stale.filePath]);
  return next;
}
function buildArticleUnderstandingPrompt(source) {
  return [
    "\u8BF7\u4E3A\u8FD9\u7BC7 Obsidian \u7B14\u8BB0\u751F\u6210\u4E00\u4EFD\u201C\u6587\u7AE0\u7406\u89E3\u201D\uFF0C\u4F9B\u540E\u7EED\u5C40\u90E8\u6539\u5199\u3001\u6269\u5199\u3001\u7EED\u5199\u3001\u7FFB\u8BD1\u4F7F\u7528\u3002",
    "\u4F60\u53EA\u9700\u8981\u7406\u89E3\u6587\u7AE0\uFF0C\u4E0D\u8981\u751F\u6210\u6539\u5199\u6B63\u6587\u3002",
    "\u8981\u6C42\uFF1A",
    "1. \u4E0D\u8981\u65B0\u589E\u539F\u6587\u6CA1\u6709\u7684\u4FE1\u606F\u3002",
    "2. \u5982\u679C\u4FE1\u606F\u4E0D\u8DB3\uFF0C\u7528\u201C\u672A\u660E\u786E\u201D\u8868\u8FBE\u3002",
    "3. \u4FDD\u7559\u4E3B\u9898\u3001\u53D7\u4F17\u3001\u5199\u4F5C\u76EE\u7684\u3001\u7ED3\u6784\u3001\u5173\u952E\u4E8B\u5B9E\u3001\u98CE\u683C\u548C\u7981\u7F16\u9020\u8FB9\u754C\u3002",
    "4. \u53EA\u8FD4\u56DE\u4E0B\u9762\u8FD9 8 \u4E2A\u680F\u76EE\uFF0C\u4E0D\u89E3\u91CA\uFF0C\u4E0D\u4F7F\u7528\u4EE3\u7801\u5757\u3002",
    "",
    "\u4E3B\u9898\uFF1A",
    "\u53D7\u4F17\uFF1A",
    "\u5199\u4F5C\u76EE\u7684\uFF1A",
    "\u6587\u7AE0\u7ED3\u6784\uFF1A",
    "\u5173\u952E\u4E8B\u5B9E\uFF1A",
    "\u98CE\u683C\u7279\u5F81\uFF1A",
    "\u7981\u6B62\u7F16\u9020\uFF1A",
    "\u5C40\u90E8\u5199\u4F5C\u5EFA\u8BAE\uFF1A",
    "",
    `\u6587\u4EF6\uFF1A${source.fileName} (${source.filePath})`,
    "",
    "\u7B14\u8BB0\u6B63\u6587\uFF1A",
    `<<<
${truncateSummarySource(source.text)}
>>>`
  ].join("\n");
}
function makeArticleUnderstandingFingerprint(text) {
  const normalized = normalizeArticleTextForFingerprint(text);
  const title = firstHeading(normalized) ?? firstNonEmptyLine(normalized) ?? "";
  const blocks = paragraphBlocks(normalized);
  const stableLines = normalized.split("\n").map((line) => normalizeFingerprintLine(line)).filter((line) => line.length >= 20 && !line.startsWith("#")).filter((line, index, lines) => lines.indexOf(line) === index).slice(0, MAX_STABLE_LINE_HASHES);
  return {
    textLength: text.length,
    titleHash: title ? editorActionContentHash(title) : "",
    firstBlockHash: blocks[0] ? editorActionContentHash(blocks[0]) : "",
    lastBlockHash: blocks.length ? editorActionContentHash(blocks[blocks.length - 1]) : "",
    stableLineHashes: stableLines.map((line) => editorActionContentHash(line))
  };
}
function truncateSummarySource(text) {
  if (text.length <= MAX_SUMMARY_SOURCE_CHARS) return text;
  const headLength = Math.floor(MAX_SUMMARY_SOURCE_CHARS * 0.65);
  const tailLength = MAX_SUMMARY_SOURCE_CHARS - headLength;
  return `${text.slice(0, headLength)}

...[\u4E2D\u95F4\u5185\u5BB9\u5DF2\u622A\u65AD]...

${text.slice(-tailLength)}`;
}
function isReusableArticleUnderstanding(entry, source, now) {
  if (!entry.fingerprint) return false;
  if (now - entry.updatedAt > ARTICLE_UNDERSTANDING_REUSE_MAX_AGE_MS) return false;
  const oldLength = Math.max(1, entry.fingerprint.textLength || entry.size || 1);
  const changedChars = Math.abs(source.text.length - oldLength);
  const maxChangedChars = Math.max(
    ARTICLE_UNDERSTANDING_REUSE_MIN_DELTA,
    Math.min(ARTICLE_UNDERSTANDING_REUSE_MAX_DELTA, Math.round(oldLength * ARTICLE_UNDERSTANDING_REUSE_RATIO))
  );
  if (changedChars > maxChangedChars) return false;
  return sharedFingerprintAnchors(entry.fingerprint, makeArticleUnderstandingFingerprint(source.text)) > 0;
}
function sharedFingerprintAnchors(left, right) {
  let matches = 0;
  if (left.titleHash && left.titleHash === right.titleHash) matches++;
  if (left.firstBlockHash && left.firstBlockHash === right.firstBlockHash) matches++;
  if (left.lastBlockHash && left.lastBlockHash === right.lastBlockHash) matches++;
  const rightStable = new Set(right.stableLineHashes);
  if (left.stableLineHashes.some((hash) => rightStable.has(hash))) matches++;
  return matches;
}
function normalizeArticleTextForFingerprint(text) {
  return text.replace(/\r\n/g, "\n").replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}
function firstHeading(text) {
  const heading = text.split("\n").map((line) => line.trim()).find((line) => /^#{1,6}\s+\S/.test(line));
  return heading ? normalizeFingerprintLine(heading.replace(/^#{1,6}\s+/, "")) : null;
}
function firstNonEmptyLine(text) {
  const line = text.split("\n").map((item) => normalizeFingerprintLine(item)).find(Boolean);
  return line ?? null;
}
function paragraphBlocks(text) {
  return text.split(/\n\s*\n/g).map((block) => block.split("\n").map((line) => normalizeFingerprintLine(line)).filter(Boolean).join("\n")).filter(Boolean);
}
function normalizeFingerprintLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

// src/editor-actions/output.ts
var EXPLANATION_PREFIXES = [
  /^改写如下[:：]\s*/i,
  /^扩写如下[:：]\s*/i,
  /^续写如下[:：]\s*/i,
  /^翻译如下[:：]\s*/i,
  /^英文翻译[:：]\s*/i,
  /^译文[:：]\s*/i,
  /^Translation[:：]\s*/i,
  /^English translation[:：]\s*/i,
  /^Here(?:'s| is) (?:the )?(?:English )?translation[:：]\s*/i,
  /^以下是(?:改写|扩写|续写|(?:英文)?翻译)(?:后的)?(?:内容|结果)?[:：]\s*/i,
  /^当然可以，?以下是(?:改写|扩写|续写|(?:英文)?翻译)(?:后的)?(?:内容|结果)?[:：]\s*/i,
  /^好的，?以下是(?:改写|扩写|续写|(?:英文)?翻译)(?:后的)?(?:内容|结果)?[:：]\s*/i,
  /^候选文本[:：]\s*/i,
  /^结果[:：]\s*/i,
  /^最终输出[:：]\s*/i,
  /^最终结果[:：]\s*/i
];
var PROCESS_PREFIXES = [
  /^思考过程[:：]/i,
  /^推理过程[:：]/i,
  /^分析过程[:：]/i,
  /^分析[:：]/i
];
var FINAL_LABEL = /^(?:最终输出|最终结果|候选正文|输出)[:：]\s*$/i;
var DISALLOWED_OUTPUT_MARKERS = [
  /^```/,
  /^思考过程[:：]/i,
  /^推理过程[:：]/i,
  /^分析过程[:：]/i,
  /^版本\s*[一二三四五六七八九十0-9]+[:：]/i,
  /^方案\s*[一二三四五六七八九十0-9]+[:：]/i
];
function cleanEditorActionOutput(value) {
  let text = value.replace(/\r\n/g, "\n").trim();
  text = extractCandidateTag(text) ?? text;
  text = stripOuterFence(text).trim();
  text = stripProcessPrelude(text).trim();
  for (const prefix of EXPLANATION_PREFIXES) {
    text = text.replace(prefix, "").trimStart();
  }
  return text.trim();
}
function validateEditorActionCandidateText(value) {
  const text = value.trim();
  if (!text) return { ok: false, reason: "Codex \u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u5019\u9009\u6587\u672C" };
  if (/<\/?codex-candidate>/i.test(text)) return { ok: false, reason: "\u5019\u9009\u6B63\u6587\u4ECD\u5305\u542B\u5185\u90E8\u6807\u7B7E" };
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    if (DISALLOWED_OUTPUT_MARKERS.some((pattern) => pattern.test(line))) {
      return { ok: false, reason: "\u5019\u9009\u6B63\u6587\u5305\u542B\u975E\u6700\u7EC8\u8F93\u51FA\u5185\u5BB9" };
    }
  }
  return { ok: true };
}
function extractCandidateTag(value) {
  const match = value.match(/<codex-candidate>\s*([\s\S]*?)\s*<\/codex-candidate>/i);
  return match ? match[1] : null;
}
function stripOuterFence(value) {
  const match = value.match(/^```[A-Za-z0-9_-]*\n([\s\S]*?)\n```$/);
  return match ? match[1] : value;
}
function stripProcessPrelude(value) {
  const lines = value.split("\n");
  const firstContentIndex = lines.findIndex((line) => line.trim());
  if (firstContentIndex < 0) return value;
  const firstContent = lines[firstContentIndex].trim();
  if (!PROCESS_PREFIXES.some((pattern) => pattern.test(firstContent))) return value;
  const finalLabelIndex = lines.findIndex((line, index) => index > firstContentIndex && FINAL_LABEL.test(line.trim()));
  if (finalLabelIndex >= 0) return lines.slice(finalLabelIndex + 1).join("\n");
  for (let index = firstContentIndex + 1; index < lines.length; index++) {
    const line = lines[index].trim();
    const inline = line.match(/^(?:最终输出|最终结果|候选正文|输出)[:：]\s*(.+)$/i);
    if (inline) return [inline[1], ...lines.slice(index + 1)].join("\n");
  }
  return value;
}

// src/knowledge-base/commands.ts
var KNOWLEDGE_BASE_COMMAND_GUIDE = [
  { command: "/ask ...", description: "\u5BF9\u77E5\u8BC6\u5E93\u53D1\u95EE" },
  { command: "/check ...", description: "\u53EA\u4F53\u68C0\u77E5\u8BC6\u5E93" },
  { command: "/maintain ...", description: "\u7EF4\u62A4 raw \u5230 wiki\uFF0C\u5E76\u6574\u7406\u77E5\u8BC6\u533A\u7ED3\u6784" },
  { command: "/outputs ...", description: "\u5904\u7406 outputs \u5E76\u63D0\u70BC\u957F\u671F\u4EF7\u503C" },
  { command: "/inbox ...", description: "\u6574\u7406\u6536\u4EF6\u7BB1" },
  { command: "/journal ...", description: "\u5199\u65E5\u8BB0" },
  { command: "/week", description: "\u5199\u77E5\u8BC6\u5E93\u5468\u62A5\uFF1B/week agent \u5199 Agent \u5468\u62A5" },
  { command: "/clear", description: "\u6E05\u7A7A\u5F53\u524D\u9875\u9762\uFF0C\u4FDD\u7559\u672C\u5730\u5386\u53F2\u5E76\u5F00\u542F\u65B0\u4E0A\u4E0B\u6587" },
  { command: "/history", description: "\u6309\u5929\u67E5\u770B\u77E5\u8BC6\u5E93\u5386\u53F2" },
  { command: "/init", description: "\u9884\u89C8\u521D\u59CB\u5316\uFF1B/init confirm \u624D\u6267\u884C" },
  { command: "/help", description: "\u663E\u793A\u8FD9\u4EFD\u547D\u4EE4\u8BF4\u660E" }
];
var URL_PATTERN = /https?:\/\/\S+/i;
function parseKnowledgeBaseCommand(text, attachmentCount = 0) {
  const normalized = text.trim().toLowerCase();
  if (!normalized && attachmentCount <= 0) return { intent: "help", reason: "empty" };
  const slashCommand = parseSlashKnowledgeBaseCommand(normalized);
  if (slashCommand) return slashCommand;
  if (isCancelRequest(normalized)) {
    return { intent: "cancel", reason: "cancel" };
  }
  if (/只体检|体检|检查|扫描|lint|health|doctor/.test(normalized)) {
    return { intent: "lint", reason: "lint" };
  }
  if (/重新提炼|重新消化|重新整理|重提炼|reingest|redigest|re-digest/.test(normalized)) {
    return { intent: "reingest", reason: "reingest" };
  }
  if (/处理\s*outputs|整理\s*outputs|处理输出|整理输出|outputs\s*to\s*wiki|process\s*outputs/.test(normalized)) {
    return { intent: "process-outputs", reason: "process-outputs" };
  }
  if (/处理\s*inbox|整理\s*inbox|处理收件箱|整理收件箱|process\s*inbox/.test(normalized)) {
    return { intent: "process-inbox", reason: "process-inbox" };
  }
  if (/写日记|记日记|日报|daily journal|journal/.test(normalized)) {
    return { intent: "journal", target: "journal", reason: "journal" };
  }
  if (/写周报|周报|weekly review/.test(normalized)) {
    return { intent: "review", reviewKind: reviewKindFromText(normalized), reason: "review" };
  }
  if (/维护|消化|整理|沉淀|更新知识库|ingest|digest|maintain/.test(normalized)) {
    return { intent: "maintain", reason: "maintain" };
  }
  if (attachmentCount > 0) {
    return { intent: "collect", target: "raw-attachments", reason: "attachment" };
  }
  if (URL_PATTERN.test(text) || /链接|网页|文章|公众号|收集|剪藏|保存到 raw|archive|clip/.test(normalized)) {
    return { intent: "collect", target: "raw-articles", reason: "source" };
  }
  if (/记一下|记录|想法|灵感|inbox|memo|note/.test(normalized)) {
    return { intent: "collect", target: "inbox", reason: "idea" };
  }
  return { intent: "chat", reason: "ordinary-chat" };
}
function knowledgeBaseHelpText() {
  return [
    "\u77E5\u8BC6\u5E93\u7BA1\u7406\u9891\u9053\u5FEB\u6377\u547D\u4EE4\uFF1A",
    "",
    ...KNOWLEDGE_BASE_COMMAND_GUIDE.map((item) => `- \`${item.command}\`\uFF1A${item.description}`),
    "",
    "\u81EA\u7136\u8BED\u8A00\u4E5F\u652F\u6301\uFF1A\u53EA\u4F53\u68C0\u4E00\u4E0B\u3001\u7EF4\u62A4\u77E5\u8BC6\u5E93\u3001\u5199\u5468\u62A5\u3001\u5199\u65E5\u8BB0\u3001\u6536\u96C6\u8FD9\u4E2A\u94FE\u63A5\u3001\u8BB0\u4E00\u4E0B\u3002"
  ].join("\n");
}
function parseSlashKnowledgeBaseCommand(normalized) {
  const match = normalized.match(/^\/([\p{Script=Han}a-z-]+)(?=$|[\s:：?？])/u);
  if (!match) return null;
  const command = match[1];
  if (command === "help" || command === "\u5E2E\u52A9") return { intent: "help", reason: "slash-help" };
  if (command === "clear" || command === "\u6E05\u7A7A") return { intent: "clear", reason: "slash-clear" };
  if (command === "history" || command === "\u5386\u53F2") return { intent: "history", reason: "slash-history" };
  if (command === "cancel" || command === "stop" || command === "\u53D6\u6D88") return { intent: "cancel", reason: "slash-cancel" };
  if (command === "init" || command === "\u521D\u59CB\u5316") return { intent: "init", reason: "slash-init", confirm: isInitConfirmCommand(normalized) };
  if (command === "check" || command === "lint" || command === "doctor" || command === "\u4F53\u68C0" || command === "\u68C0\u67E5") return { intent: "lint", reason: "slash-lint" };
  if (command === "maintain" || command === "ingest" || command === "digest" || command === "\u7EF4\u62A4") return { intent: "maintain", reason: "slash-maintain" };
  if (command === "outputs" || command === "output" || command === "\u5904\u7406outputs" || command === "\u5904\u7406\u8F93\u51FA") return { intent: "process-outputs", reason: "slash-outputs" };
  if (command === "inbox" || command === "\u5904\u7406inbox" || command === "\u6536\u4EF6\u7BB1") return { intent: "process-inbox", reason: "slash-inbox" };
  if (command === "journal" || command === "daily" || command === "diary" || command === "\u65E5\u8BB0") return { intent: "journal", target: "journal", reason: "slash-journal" };
  if (command === "week" || command === "weekly" || command === "review" || command === "reviews" || command === "\u5199\u5468\u62A5") {
    return { intent: "review", reviewKind: reviewKindFromText(normalized), reason: "slash-review" };
  }
  if (command === "ask" || command === "query" || command === "\u95EE" || command === "\u67E5\u8BE2") return { intent: "ask", reason: "slash-ask" };
  if (command === "reingest" || command === "redigest" || command === "\u91CD\u65B0\u63D0\u70BC") return { intent: "reingest", reason: "slash-reingest" };
  return null;
}
function reviewKindFromText(normalized) {
  if (/\bagent\b|\bchat\b|对话|普通|非知识库/.test(normalized)) return "agent-chat";
  return "knowledge-base";
}
function isCancelRequest(normalized) {
  const compact = normalized.replace(/\s+/g, "");
  if (/^(cancel|stop)$/i.test(normalized)) return true;
  if (/^(取消|停止|中断)$/.test(compact)) return true;
  if (/^(请|帮我)?(取消|停止|中断)(当前|这次|本次)?(知识库)?(任务|维护|运行|执行)$/.test(compact)) return true;
  if (/^(cancel|stop)\s+(current\s+)?(knowledge\s+base\s+)?(task|run|maintenance)$/i.test(normalized)) return true;
  return false;
}
function isInitConfirmCommand(normalized) {
  const tail = normalized.replace(/^\/(?:init|初始化)(?:[\s:：?？]+)?/u, "").trim();
  return tail === "confirm" || tail === "\u786E\u8BA4" || tail === "\u6267\u884C" || tail === "\u5F00\u59CB" || tail === "apply";
}

// src/knowledge-base/history-store.ts
var import_promises3 = require("node:fs/promises");
var path7 = __toESM(require("node:path"));
var KNOWLEDGE_BASE_HISTORY_VERSION = 1;
var KNOWLEDGE_BASE_ACTIVE_DAY_MESSAGE_LIMIT = 1e3;
function knowledgeBaseHistoryRoot(vaultPath, pluginDir) {
  return path7.join(pluginDataDir(vaultPath, pluginDir), "history");
}
function knowledgeBaseHistoryIndexPath(vaultPath, pluginDir) {
  return path7.join(knowledgeBaseHistoryRoot(vaultPath, pluginDir), "index.json");
}
function knowledgeBaseHistoryMigrationPath(vaultPath, pluginDir) {
  return path7.join(knowledgeBaseHistoryRoot(vaultPath, pluginDir), "migration.json");
}
function knowledgeBaseHistoryDayPath(vaultPath, pluginDir, sessionId, date) {
  return path7.join(knowledgeBaseHistoryRoot(vaultPath, pluginDir), "sessions", sanitizeHistoryPathPart(sessionId), `${sanitizeHistoryPathPart(date)}.jsonl`);
}
function localDateKeyForTimestamp(value) {
  const date = new Date(Number.isFinite(value) && value > 0 ? value : Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function activeKnowledgeBaseHistoryDate(messages, currentActiveDate = "", now = Date.now()) {
  const dates = sortedKnowledgeBaseMessageDates(messages);
  if (!dates.length) return "";
  const today = localDateKeyForTimestamp(now);
  const latestBeforeToday = [...dates].filter((date) => date < today).at(-1) ?? "";
  if (latestBeforeToday) {
    if (currentActiveDate && currentActiveDate < today && dates.includes(currentActiveDate) && currentActiveDate >= latestBeforeToday) return currentActiveDate;
    return latestBeforeToday;
  }
  return dates.at(-1) ?? "";
}
function activeKnowledgeBaseMessageDates(messages, currentActiveDate = "", now = Date.now()) {
  const dates = new Set(sortedKnowledgeBaseMessageDates(messages));
  const activeDate = activeKnowledgeBaseHistoryDate(messages, currentActiveDate, now);
  const today = localDateKeyForTimestamp(now);
  const activeDates = /* @__PURE__ */ new Set();
  if (activeDate) activeDates.add(activeDate);
  if (dates.has(today)) activeDates.add(today);
  if (!activeDates.size && dates.size) activeDates.add([...dates].at(-1) ?? "");
  activeDates.delete("");
  return activeDates;
}
function compactKnowledgeBaseMessagesToActiveDay(session, now = Date.now()) {
  const activeDate = activeKnowledgeBaseHistoryDate(session.messages, session.historyActiveDate, now);
  const activeDates = activeKnowledgeBaseMessageDates(session.messages, activeDate, now);
  const activeMessages = session.messages.filter((message) => activeDates.has(localDateKeyForTimestamp(message.createdAt)));
  const changed = activeDate !== session.historyActiveDate || activeMessages.length !== session.messages.length;
  session.messages = activeMessages.slice(-KNOWLEDGE_BASE_ACTIVE_DAY_MESSAGE_LIMIT);
  session.historyActiveDate = activeDate || void 0;
  return changed;
}
async function migrateKnowledgeBaseHistory(vaultPath, pluginDir, settings) {
  const session = settings.sessions.find((item) => isKnowledgeBaseSession(item, settings.knowledgeBase.sessionId));
  if (!session) return { changed: false, messageCount: 0, activeDate: "" };
  const beforeCount = session.messages.length;
  const result = await persistAndCompactKnowledgeBaseHistory(vaultPath, pluginDir, settings);
  const migrationPath = knowledgeBaseHistoryMigrationPath(vaultPath, pluginDir);
  const exists7 = await fileExists(migrationPath);
  if (!exists7 && beforeCount > 0) {
    const summary = {
      version: KNOWLEDGE_BASE_HISTORY_VERSION,
      migratedAt: Date.now(),
      sessionCount: 1,
      messageCount: beforeCount,
      activeDate: result.activeDate
    };
    await writeJsonAtomic(migrationPath, summary);
    return { ...result, changed: true };
  }
  return result;
}
async function persistAndCompactKnowledgeBaseHistory(vaultPath, pluginDir, settings, now = Date.now()) {
  const session = settings.sessions.find((item) => isKnowledgeBaseSession(item, settings.knowledgeBase.sessionId));
  if (!session || !session.messages.length) return { changed: false, messageCount: 0, activeDate: "" };
  const hydrated = await hydrateActiveKnowledgeBaseHistoryDate(vaultPath, pluginDir, session, now);
  const messageCount = session.messages.length;
  await persistKnowledgeBaseHistoryMessages(vaultPath, pluginDir, session, session.messages);
  const changed = compactKnowledgeBaseMessagesToActiveDay(session, now);
  return {
    changed: hydrated || changed,
    messageCount,
    activeDate: session.historyActiveDate ?? ""
  };
}
async function persistKnowledgeBaseHistoryMessages(vaultPath, pluginDir, session, messages) {
  if (!messages.length) return;
  const grouped = groupMessagesByDate(messages);
  const touchedDays = [];
  for (const [date, dayMessages] of grouped.entries()) {
    const file = knowledgeBaseHistoryDayPath(vaultPath, pluginDir, session.id, date);
    const existing = await readKnowledgeBaseHistoryDay(vaultPath, pluginDir, session.id, date).catch(() => []);
    const merged = mergeHistoryMessages(existing, dayMessages);
    await writeJsonlAtomic(file, merged);
    touchedDays.push(summarizeHistoryDay(date, merged));
  }
  await updateKnowledgeBaseHistoryIndex(vaultPath, pluginDir, session, touchedDays);
}
async function readKnowledgeBaseHistoryIndex(vaultPath, pluginDir) {
  const file = knowledgeBaseHistoryIndexPath(vaultPath, pluginDir);
  try {
    const raw = JSON.parse(await (0, import_promises3.readFile)(file, "utf8"));
    const sessions = Array.isArray(raw?.sessions) ? raw.sessions.map(normalizeHistorySessionSummary).filter(Boolean) : [];
    return {
      version: KNOWLEDGE_BASE_HISTORY_VERSION,
      updatedAt: typeof raw?.updatedAt === "number" ? raw.updatedAt : 0,
      sessions
    };
  } catch (error) {
    if (isNotFoundError2(error)) return { version: KNOWLEDGE_BASE_HISTORY_VERSION, updatedAt: 0, sessions: [] };
    throw error;
  }
}
async function readKnowledgeBaseHistoryDay(vaultPath, pluginDir, sessionId, date) {
  const file = knowledgeBaseHistoryDayPath(vaultPath, pluginDir, sessionId, date);
  const text = await (0, import_promises3.readFile)(file, "utf8");
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line)).filter((message) => message && typeof message.id === "string" && typeof message.createdAt === "number");
}
async function rebuildKnowledgeBaseHistoryIndex(vaultPath, pluginDir) {
  const root = knowledgeBaseHistoryRoot(vaultPath, pluginDir);
  const sessionsRoot = path7.join(root, "sessions");
  const sessionDirs = await (0, import_promises3.readdir)(sessionsRoot, { withFileTypes: true }).catch(() => []);
  const sessions = [];
  for (const entry of sessionDirs) {
    if (!entry.isDirectory()) continue;
    const sessionId = entry.name;
    const dir = path7.join(sessionsRoot, entry.name);
    const files = await (0, import_promises3.readdir)(dir, { withFileTypes: true }).catch(() => []);
    const days = [];
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith(".jsonl")) continue;
      const date = file.name.replace(/\.jsonl$/, "");
      const messages = await readKnowledgeBaseHistoryDay(vaultPath, pluginDir, sessionId, date).catch(() => []);
      if (messages.length) days.push(summarizeHistoryDay(date, messages));
    }
    const sorted = days.sort((a, b) => b.date.localeCompare(a.date));
    const messageCount = sorted.reduce((sum, day) => sum + day.messageCount, 0);
    if (!messageCount) continue;
    sessions.push({
      sessionId,
      title: "\u77E5\u8BC6\u5E93\u7BA1\u7406",
      kind: "knowledge-base",
      activeDate: sorted[0]?.date ?? "",
      messageCount,
      dayCount: sorted.length,
      updatedAt: Math.max(...sorted.map((day) => day.lastMessageAt)),
      days: sorted
    });
  }
  const index = { version: KNOWLEDGE_BASE_HISTORY_VERSION, updatedAt: Date.now(), sessions };
  await writeJsonAtomic(knowledgeBaseHistoryIndexPath(vaultPath, pluginDir), index);
  return index;
}
async function collectKnowledgeBaseStorageStats(vaultPath, pluginDir) {
  const dataJson = path7.join(pluginDataDir(vaultPath, pluginDir), "data.json");
  const [dataJsonBytes, historyBytes, rawBytes, index] = await Promise.all([
    fileSize(dataJson),
    directorySize(knowledgeBaseHistoryRoot(vaultPath, pluginDir)),
    directorySize(rawStorageDir(vaultPath, pluginDir)),
    readKnowledgeBaseHistoryIndex(vaultPath, pluginDir).catch(() => ({ version: KNOWLEDGE_BASE_HISTORY_VERSION, updatedAt: 0, sessions: [] }))
  ]);
  const sessionCount = index.sessions.length;
  const dayCount = index.sessions.reduce((sum, session) => sum + session.dayCount, 0);
  const messageCount = index.sessions.reduce((sum, session) => sum + session.messageCount, 0);
  return { dataJsonBytes, historyBytes, rawBytes, sessionCount, dayCount, messageCount };
}
async function exportKnowledgeBaseHistory(vaultPath, pluginDir, outputDir = "outputs") {
  const index = await readKnowledgeBaseHistoryIndex(vaultPath, pluginDir);
  const sessions = [];
  for (const session of index.sessions) {
    const days = [];
    for (const day of session.days) {
      days.push({
        ...day,
        messages: await readKnowledgeBaseHistoryDay(vaultPath, pluginDir, session.sessionId, day.date).catch(() => [])
      });
    }
    sessions.push({ ...session, days });
  }
  const relative10 = `${outputDir.replace(/^\/+|\/+$/g, "")}/codex-echoink-history-export-${localDateKeyForTimestamp(Date.now())}-${Date.now()}.json`;
  const absolute = path7.join(vaultPath, relative10);
  await writeJsonAtomic(absolute, { version: KNOWLEDGE_BASE_HISTORY_VERSION, exportedAt: Date.now(), sessions });
  return relative10.replace(/\\/g, "/");
}
async function compactOldKnowledgeBaseProcessHistory(vaultPath, pluginDir, activeDate = localDateKeyForTimestamp(Date.now())) {
  const index = await readKnowledgeBaseHistoryIndex(vaultPath, pluginDir);
  let changedCount = 0;
  for (const session of index.sessions) {
    for (const day of session.days) {
      if (day.date >= activeDate) continue;
      const messages = await readKnowledgeBaseHistoryDay(vaultPath, pluginDir, session.sessionId, day.date).catch(() => []);
      let changed = false;
      const compacted = messages.map((message) => {
        if (!message.itemType || message.role === "user" || message.role === "assistant") return message;
        const text = compactProcessText(message);
        if (text === message.text) return message;
        changed = true;
        changedCount += 1;
        return {
          ...message,
          text,
          previewText: void 0,
          rawRef: void 0,
          rawSize: void 0,
          rawLines: void 0,
          rawTruncatedForPreview: void 0
        };
      });
      if (changed) await writeJsonlAtomic(knowledgeBaseHistoryDayPath(vaultPath, pluginDir, session.sessionId, day.date), compacted);
    }
  }
  if (changedCount) await rebuildKnowledgeBaseHistoryIndex(vaultPath, pluginDir);
  return changedCount;
}
function groupMessagesByDate(messages) {
  const grouped = /* @__PURE__ */ new Map();
  for (const message of messages) {
    const date = localDateKeyForTimestamp(message.createdAt);
    const bucket = grouped.get(date) ?? [];
    bucket.push(message);
    grouped.set(date, bucket);
  }
  return grouped;
}
async function hydrateActiveKnowledgeBaseHistoryDate(vaultPath, pluginDir, session, now) {
  const today = localDateKeyForTimestamp(now);
  const activeDates = activeKnowledgeBaseMessageDates(session.messages, session.historyActiveDate, now);
  if ([...activeDates].some((date) => date && date !== today)) return false;
  const index = await readKnowledgeBaseHistoryIndex(vaultPath, pluginDir);
  const historySession = index.sessions.find((item) => item.sessionId === session.id);
  const historyDate = [...historySession?.days ?? []].map((day) => day.date).filter((date) => date < today && !session.messages.some((message) => localDateKeyForTimestamp(message.createdAt) === date)).sort((left, right) => right.localeCompare(left))[0];
  if (!historyDate) return false;
  const messages = await readKnowledgeBaseHistoryDay(vaultPath, pluginDir, session.id, historyDate).catch(() => []);
  if (!messages.length) return false;
  session.messages = mergeHistoryMessages(session.messages, messages);
  session.historyActiveDate = historyDate;
  return true;
}
function sortedKnowledgeBaseMessageDates(messages) {
  return [...new Set(messages.map((message) => localDateKeyForTimestamp(message.createdAt)))].sort();
}
function mergeHistoryMessages(existing, incoming) {
  const latest = /* @__PURE__ */ new Map();
  const order = /* @__PURE__ */ new Map();
  let nextOrder = 0;
  for (const message of [...existing, ...incoming]) {
    if (!message.id) continue;
    if (!order.has(message.id)) order.set(message.id, nextOrder++);
    latest.set(message.id, message);
  }
  return [...latest.values()].sort((a, b) => {
    const diff = (a.createdAt || 0) - (b.createdAt || 0);
    if (diff) return diff;
    return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
  });
}
function summarizeHistoryDay(date, messages) {
  const timestamps = messages.map((message) => message.createdAt || 0).filter(Boolean);
  return {
    date,
    messageCount: messages.length,
    userMessageCount: messages.filter((message) => message.role === "user").length,
    assistantMessageCount: messages.filter((message) => message.role === "assistant").length,
    processMessageCount: messages.filter((message) => Boolean(message.itemType) && message.role !== "user" && message.role !== "assistant").length,
    failedMessageCount: messages.filter((message) => message.status === "failed" || message.status === "error").length,
    firstMessageAt: timestamps.length ? Math.min(...timestamps) : 0,
    lastMessageAt: timestamps.length ? Math.max(...timestamps) : 0
  };
}
async function updateKnowledgeBaseHistoryIndex(vaultPath, pluginDir, session, touchedDays) {
  const index = await readKnowledgeBaseHistoryIndex(vaultPath, pluginDir);
  const existing = index.sessions.find((item) => item.sessionId === session.id);
  const daysByDate = /* @__PURE__ */ new Map();
  for (const day of existing?.days ?? []) daysByDate.set(day.date, day);
  for (const day of touchedDays) daysByDate.set(day.date, day);
  const days = [...daysByDate.values()].sort((a, b) => b.date.localeCompare(a.date));
  const messageCount = days.reduce((sum, day) => sum + day.messageCount, 0);
  const summary = {
    sessionId: session.id,
    title: session.title || "\u77E5\u8BC6\u5E93\u7BA1\u7406",
    kind: "knowledge-base",
    activeDate: activeKnowledgeBaseHistoryDate(session.messages, session.historyActiveDate) || days[0]?.date || "",
    messageCount,
    dayCount: days.length,
    updatedAt: Math.max(session.updatedAt || 0, ...days.map((day) => day.lastMessageAt)),
    days
  };
  const sessions = index.sessions.filter((item) => item.sessionId !== session.id);
  sessions.unshift(summary);
  await writeJsonAtomic(knowledgeBaseHistoryIndexPath(vaultPath, pluginDir), {
    version: KNOWLEDGE_BASE_HISTORY_VERSION,
    updatedAt: Date.now(),
    sessions
  });
}
function normalizeHistorySessionSummary(value) {
  if (!value?.sessionId || !Array.isArray(value?.days)) return null;
  const days = value.days.map(normalizeHistoryDaySummary).filter(Boolean);
  return {
    sessionId: String(value.sessionId),
    title: typeof value.title === "string" && value.title.trim() ? value.title.trim() : "\u77E5\u8BC6\u5E93\u7BA1\u7406",
    kind: "knowledge-base",
    activeDate: typeof value.activeDate === "string" ? value.activeDate : days[0]?.date ?? "",
    messageCount: typeof value.messageCount === "number" ? value.messageCount : days.reduce((sum, day) => sum + day.messageCount, 0),
    dayCount: typeof value.dayCount === "number" ? value.dayCount : days.length,
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : 0,
    days
  };
}
function normalizeHistoryDaySummary(value) {
  if (typeof value?.date !== "string") return null;
  return {
    date: value.date,
    messageCount: numberOrZero(value.messageCount),
    userMessageCount: numberOrZero(value.userMessageCount),
    assistantMessageCount: numberOrZero(value.assistantMessageCount),
    processMessageCount: numberOrZero(value.processMessageCount),
    failedMessageCount: numberOrZero(value.failedMessageCount),
    firstMessageAt: numberOrZero(value.firstMessageAt),
    lastMessageAt: numberOrZero(value.lastMessageAt)
  };
}
function compactProcessText(message) {
  const parts = [message.title, message.details, message.status ? `\u72B6\u6001\uFF1A${message.status}` : ""].map((item) => typeof item === "string" ? item.trim() : "").filter(Boolean);
  return parts.join("\n") || "\u8FC7\u7A0B\u8BB0\u5F55\u5DF2\u538B\u7F29\u3002";
}
async function writeJsonAtomic(file, data) {
  await writeTextAtomic(file, `${JSON.stringify(data, null, 2)}
`);
}
async function writeJsonlAtomic(file, messages) {
  await writeTextAtomic(file, messages.map((message) => JSON.stringify(message)).join("\n") + (messages.length ? "\n" : ""));
}
async function writeTextAtomic(file, text) {
  await (0, import_promises3.mkdir)(path7.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  await (0, import_promises3.writeFile)(tmp, text, "utf8");
  await (0, import_promises3.rename)(tmp, file);
}
async function fileSize(file) {
  try {
    return (await (0, import_promises3.stat)(file)).size;
  } catch (error) {
    if (isNotFoundError2(error)) return 0;
    throw error;
  }
}
async function directorySize(dir) {
  const entries = await (0, import_promises3.readdir)(dir, { withFileTypes: true }).catch((error) => {
    if (isNotFoundError2(error)) return [];
    throw error;
  });
  let total = 0;
  for (const entry of entries) {
    const full = path7.join(dir, entry.name);
    if (entry.isDirectory()) total += await directorySize(full);
    if (entry.isFile()) total += await fileSize(full);
  }
  return total;
}
async function fileExists(file) {
  try {
    await (0, import_promises3.stat)(file);
    return true;
  } catch (error) {
    if (isNotFoundError2(error)) return false;
    throw error;
  }
}
function sanitizeHistoryPathPart(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_") || "unknown";
}
function numberOrZero(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
function isNotFoundError2(error) {
  return Boolean(error && typeof error === "object" && error.code === "ENOENT");
}

// src/knowledge-base/session-history.ts
function getActiveKnowledgeBaseMessages(session, now = Date.now()) {
  const activeDates = activeKnowledgeBaseMessageDates(session.messages, session.historyActiveDate, now);
  if (!activeDates.size) return [];
  return session.messages.filter((message) => activeDates.has(localDateKeyForTimestamp(message.createdAt)));
}
function getVisibleKnowledgeBaseMessages(session, now = Date.now()) {
  const activeMessages = getActiveKnowledgeBaseMessages(session, now);
  const hiddenBefore = normalizedHiddenBefore(session.messagesHiddenBefore);
  if (!hiddenBefore) return activeMessages;
  return activeMessages.filter((message) => message.createdAt > hiddenBefore);
}
function getHiddenKnowledgeBaseMessages(session, now = Date.now()) {
  const activeMessages = getActiveKnowledgeBaseMessages(session, now);
  const hiddenBefore = normalizedHiddenBefore(session.messagesHiddenBefore);
  if (!hiddenBefore) return [];
  return activeMessages.filter((message) => message.createdAt <= hiddenBefore);
}
function clearKnowledgeBaseVisibleHistory(session, now = Date.now()) {
  const activeMessages = getActiveKnowledgeBaseMessages(session, now);
  const hiddenBefore = Math.max(now, ...activeMessages.map((message) => message.createdAt || 0));
  session.messagesHiddenBefore = hiddenBefore;
  delete session.threadId;
  delete session.tokenUsage;
  session.updatedAt = now;
  return {
    hiddenCount: getHiddenKnowledgeBaseMessages(session).length,
    hiddenBefore
  };
}
function normalizedHiddenBefore(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

// src/ui/xiaoyuan-view.ts
var VIEW_TYPE_XIAOYUAN = "xiaoyuan-agent-view";
var XiaoyuanView = class extends import_obsidian4.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.selectedModel = plugin.settings.defaultModel;
    this.selectedReasoning = plugin.settings.defaultReasoning;
    this.selectedServiceTier = plugin.settings.defaultServiceTier;
    this.selectedPermission = plugin.settings.defaultPermission;
    this.selectedMode = plugin.settings.defaultMode;
  }
  rootEl;
  headerStatusEl;
  headerStatusTextEl;
  editorActionStatusEl;
  editorActionStatusTextEl;
  headerHistoryEl;
  articleUnderstandingPanelEl;
  headerUsageEl;
  headerUsageTextEl;
  usagePanelEl;
  tabBarEl;
  knowledgeDashboardEl;
  messagesEl;
  virtualListEl;
  inputEl;
  toolbarEl;
  contextEl;
  contextRingEl;
  contextValueEl;
  skillMenuEl;
  mcpPanelEl;
  attachmentsEl;
  running = false;
  activeRunId = "";
  activeRunSessionId = "";
  activeTurnId = "";
  turnStartedAt = 0;
  turnWatchdog = null;
  activeThinkingMessageId = "";
  activePlanMessageId = "";
  activeItemMessages = /* @__PURE__ */ new Map();
  openProcessGroups = /* @__PURE__ */ new Map();
  openProcessItems = /* @__PURE__ */ new Map();
  openKnowledgeBaseCitations = /* @__PURE__ */ new Map();
  renderScheduled = false;
  pendingRenderForceBottom = false;
  pendingRenderFromScroll = false;
  measureScheduled = false;
  pendingMeasureForceBottom = false;
  virtualSessionId = "";
  virtualRowHeights = /* @__PURE__ */ new Map();
  rawTextCache = /* @__PURE__ */ new Map();
  selectedSkill = null;
  attachments = [];
  selectedModel = "";
  selectedReasoning;
  selectedServiceTier;
  selectedPermission;
  selectedMode;
  skillsRequested = false;
  threadPrewarmPromise = null;
  threadPrewarmSessionId = "";
  usageLoading = false;
  usageError = null;
  usageRequestId = 0;
  editorActionStatus = { status: "idle" };
  articleUnderstandingPanelVisible = false;
  articleUnderstandingPanelState = { status: "idle" };
  editorActionHarnessRunId = "";
  editorActionStatusTicker = null;
  editorActionStatusResetTimer = null;
  editorActionRun = null;
  editorActionActiveTimeoutMs = 0;
  editorActionThreadId = "";
  editorActionThreadIds = /* @__PURE__ */ new Set();
  editorActionTurnIds = /* @__PURE__ */ new Set();
  editorActionItemIds = /* @__PURE__ */ new Set();
  editorActionCurrentItemIds = /* @__PURE__ */ new Set();
  editorActionPrewarmThreadId = "";
  editorActionPrewarmPromise = null;
  editorSummaryRun = null;
  editorSummaryTimeout = null;
  knowledgeDashboardSnapshot = null;
  knowledgeDashboardExpanded = false;
  knowledgeDashboardLoading = false;
  knowledgeDashboardError = "";
  knowledgeDashboardRequestId = 0;
  getViewType() {
    return VIEW_TYPE_XIAOYUAN;
  }
  getDisplayText() {
    return "\u5C0F\u5143";
  }
  getIcon() {
    return "bot";
  }
  async onOpen() {
    this.render();
    await this.plugin.ensureOpenCodeConnected();
    this.applyStatus();
    this.renderTabs();
    this.renderMessages({ forceBottom: true });
    this.renderKnowledgeDashboard();
    void this.refreshKnowledgeDashboard();
    void this.refreshHeaderRateLimits();
  }
  async onClose() {
    this.clearTurnWatchdog();
    this.clearEditorActionStatusTimers();
    this.clearEditorSummaryTimers();
    this.rejectEditorActionRun(new Error("Codex \u4FA7\u680F\u5DF2\u5173\u95ED"));
    this.rejectEditorSummaryRun(new Error("Codex \u4FA7\u680F\u5DF2\u5173\u95ED"));
    await this.plugin.saveSettings(true);
  }
  applySavedComposerDefaults() {
    this.selectedModel = this.plugin.settings.defaultModel;
    this.selectedReasoning = this.plugin.settings.defaultReasoning;
    this.selectedServiceTier = this.plugin.settings.defaultServiceTier;
    this.selectedPermission = this.plugin.settings.defaultPermission;
    this.selectedMode = this.plugin.settings.defaultMode;
    this.renderToolbar();
  }
  refreshActiveSession() {
    this.resetVirtualWindow();
    this.renderTabs();
    this.renderMessages({ forceBottom: true });
    this.renderToolbar();
    this.renderKnowledgeDashboard();
    void this.refreshKnowledgeDashboard();
    this.updateInputPlaceholder();
    this.focusInput();
  }
  refreshKnowledgeBaseDashboard() {
    void this.refreshKnowledgeDashboard(true);
  }
  refreshAfterBackgroundKnowledgeMessage() {
    this.renderTabs();
    this.renderMessages({ forceBottom: this.isMessagesNearBottom() });
    this.renderKnowledgeDashboard();
    void this.refreshKnowledgeDashboard(true);
  }
  diagnoseCodexFailure(error, model = this.effectiveModel()) {
    return diagnoseCodexError(error, {
      model,
      providerLabel: providerConnectionLabel(this.plugin.settings),
      proxyEnabled: this.plugin.settings.proxyEnabled,
      proxyUrl: this.plugin.settings.proxyUrl
    });
  }
  handleCodexNotification(notification) {
    const { method, params } = notification;
    if (this.handleEditorActionNotification(method, params)) return;
    if (method === "turn/started") {
      const session = this.activeRunSession();
      const knowledgeSession = this.isKnowledgeBaseSession(session);
      this.running = true;
      this.activeTurnId = params?.turn?.id ?? "";
      this.turnStartedAt = Date.now();
      this.attachTurnIdToRun(session, this.activeTurnId);
      this.ensureThinkingMessage(session, "\u751F\u6210\u4E2D", "\u6B63\u5728\u751F\u6210\u56DE\u590D...");
      const timeoutMs = turnWatchdogTimeoutForSession(knowledgeSession);
      if (timeoutMs === null) this.clearTurnWatchdog();
      else this.armTurnWatchdog(timeoutMs, turnWatchdogTimeoutText(timeoutMs));
      this.applyStatus();
      return;
    }
    if (method === "turn/completed") {
      const session = this.activeRunSession();
      const failed = params?.turn?.status === "failed";
      if (this.editorActionRun?.runId === this.activeRunId) {
        if (failed) {
          this.rejectEditorActionRun(new Error("Codex \u5199\u4F5C\u4EFB\u52A1\u5931\u8D25"));
        } else if (this.editorActionRun.text.trim()) {
          this.resolveEditorActionRun(this.editorActionRun.text);
        } else {
          this.rejectEditorActionRun(new Error("Codex \u6CA1\u6709\u8FD4\u56DE\u5019\u9009\u6587\u672C"));
        }
      }
      this.running = false;
      this.activeTurnId = "";
      this.clearTurnWatchdog();
      this.finishThinkingMessage(session, failed ? "\u4E2D\u65AD" : "\u5B8C\u6210");
      this.finishRunningProcessMessages(session, failed ? "failed" : "completed");
      this.finishPlanMessage(session);
      this.clearActiveRun();
      this.applyStatus();
      void this.plugin.saveSettings(true);
      return;
    }
    if (method === "account/rateLimits/updated") {
      const normalizedRateLimits = normalizeRateLimitResponse(params);
      this.usageLoading = false;
      this.usageError = null;
      if (this.plugin.lastStatus) {
        this.plugin.lastStatus = {
          ...this.plugin.lastStatus,
          rateLimits: normalizedRateLimits.rateLimits,
          rateLimitsByLimitId: normalizedRateLimits.rateLimitsByLimitId
        };
      }
      this.updateUsageHeader(normalizedRateLimits.rateLimits, false, null);
      this.renderUsagePanel(normalizedRateLimits.rateLimits, null, false);
      return;
    }
    if (method === "thread/tokenUsage/updated") {
      this.updateContextForSession(this.activeRunSession(), params?.tokenUsage, true);
      return;
    }
    if (method === "thread/compacted") {
      const session = this.sessionForThread(params?.threadId ?? params?.thread?.id) ?? this.activeRunSession();
      this.addContextCompactionMessage(session);
      if (params?.tokenUsage) this.updateContextForSession(session, params.tokenUsage, true);
      return;
    }
    if (method === "item/started" && params?.item) {
      this.renderStartedItem(this.activeRunSession(), params.item);
      return;
    }
    if (method === "item/agentMessage/delta") {
      const session = this.activeRunSession();
      this.markThinkingAsStreaming(session);
      this.appendItemDelta(session, params.itemId, "assistant", params.delta ?? "", "assistant", "\u56DE\u590D");
      return;
    }
    if (method === "turn/plan/updated") {
      this.renderPlanUpdate(this.activeRunSession(), params);
      return;
    }
    if (method === "item/plan/delta") {
      this.appendProcessDelta(this.activeRunSession(), params.itemId, "plan", params.delta ?? "", { text: params.delta ?? "", status: "running" });
      return;
    }
    if (method === "item/reasoning/summaryPartAdded") {
      void this.upsertProcessItem(this.activeRunSession(), params.itemId, "reasoning", "", "running", { ...params, status: "running" });
      return;
    }
    if (method === "item/reasoning/summaryTextDelta" || method === "item/reasoning/textDelta") {
      this.appendProcessDelta(this.activeRunSession(), params.itemId, "reasoning", params.delta ?? "", { text: params.delta ?? "", status: "running" });
      return;
    }
    if (method === "item/commandExecution/outputDelta") {
      this.appendProcessDelta(this.activeRunSession(), params.itemId, "commandExecution", params.delta ?? "", { text: params.delta ?? "", status: "running" });
      return;
    }
    if (method === "item/fileChange/outputDelta") {
      this.appendProcessDelta(this.activeRunSession(), params.itemId, "fileChange", params.delta ?? "", { text: params.delta ?? "", status: "running" });
      return;
    }
    if (method === "item/mcpToolCall/progress") {
      this.appendProcessDelta(this.activeRunSession(), params.itemId, "mcpToolCall", params.message ?? "", params);
      return;
    }
    if (method === "item/completed" && params?.item) {
      void this.renderCompletedItem(this.activeRunSession(), params.item).catch((error) => console.error("Codex item render failed", error));
      return;
    }
    if (method === "error") {
      const session = this.activeRunSession();
      const diagnostic = this.diagnoseCodexFailure(params?.message ?? "Codex \u51FA\u9519\u4E86");
      if (this.editorActionRun?.runId === this.activeRunId) this.rejectEditorActionRun(new Error(diagnostic.text));
      this.running = false;
      this.activeTurnId = "";
      this.clearTurnWatchdog();
      this.finishThinkingMessage(session, "\u5931\u8D25");
      this.finishRunningProcessMessages(session, "error");
      this.addMessageToSession(session, {
        role: "system",
        text: diagnostic.text,
        itemType: "error",
        title: diagnostic.title
      });
      this.clearActiveRun();
      this.applyStatus();
    }
  }
  handleEditorActionNotification(method, params) {
    if (this.handleEditorSummaryNotification(method, params)) return true;
    const isActiveEditorAction = this.isEditorActionRunActive();
    const route = this.routeEditorActionNotification(method, params, isActiveEditorAction, this.editorActionThreadId, method === "error");
    if (!route.swallow) return false;
    this.rememberEditorActionNotificationIds(params, route.current || route.rememberCurrentItem);
    if (!route.current) return true;
    if (method === "turn/started") {
      this.running = true;
      this.activeTurnId = params?.turn?.id ?? this.activeTurnId;
      this.turnStartedAt = Date.now();
      this.armTurnWatchdog(this.editorActionActiveTimeoutMs || this.plugin.settings.editorActions.timeoutMs);
      this.applyStatus();
      return true;
    }
    if (method === "turn/completed") {
      const failed = params?.turn?.status === "failed";
      if (failed) {
        this.rejectEditorActionRun(new Error("Codex \u5199\u4F5C\u4EFB\u52A1\u5931\u8D25"));
      } else if (this.editorActionRun?.text.trim()) {
        this.resolveEditorActionRun(this.editorActionRun.text);
      } else {
        this.rejectEditorActionRun(new Error("Codex \u6CA1\u6709\u8FD4\u56DE\u5019\u9009\u6587\u672C"));
      }
      this.running = false;
      this.activeTurnId = "";
      this.clearTurnWatchdog();
      this.clearActiveRun();
      this.applyStatus();
      return true;
    }
    if (method === "item/agentMessage/delta") {
      if (route.collectAssistantDelta && this.editorActionRun) this.editorActionRun.text += params?.delta ?? "";
      return true;
    }
    if (method === "error") {
      this.rejectEditorActionRun(new Error(this.diagnoseCodexFailure(params?.message ?? "Codex \u51FA\u9519\u4E86").text));
      this.running = false;
      this.activeTurnId = "";
      this.clearTurnWatchdog();
      this.clearActiveRun();
      this.applyStatus();
      return true;
    }
    if (method.startsWith("item/") || method.startsWith("turn/") || method === "thread/tokenUsage/updated" || method === "thread/compacted") {
      return true;
    }
    return false;
  }
  handleEditorSummaryNotification(method, params) {
    if (!this.isEditorSummaryRunActive()) return false;
    const summaryThreadId = this.editorSummaryRun?.threadId ?? "";
    const route = this.routeEditorActionNotification(method, params, true, summaryThreadId, method === "error");
    if (!route.swallow) return false;
    this.rememberEditorActionNotificationIds(params, route.current || route.rememberCurrentItem);
    if (!route.current) return true;
    if (method === "turn/started") {
      this.activeTurnId = params?.turn?.id ?? this.activeTurnId;
      return true;
    }
    if (method === "turn/completed") {
      const failed = params?.turn?.status === "failed";
      const runId = this.editorSummaryRun?.runId;
      if (failed) {
        this.rejectEditorSummaryRun(new Error("\u6458\u8981\u751F\u6210\u5931\u8D25"));
      } else if (this.editorSummaryRun?.text.trim()) {
        this.resolveEditorSummaryRun(this.editorSummaryRun.text);
      } else {
        this.rejectEditorSummaryRun(new Error("\u6458\u8981\u4E3A\u7A7A"));
      }
      this.releaseEditorSummaryRunLock(runId);
      return true;
    }
    if (method === "item/agentMessage/delta") {
      if (this.editorSummaryRun) this.editorSummaryRun.text += params?.delta ?? "";
      return true;
    }
    if (method === "error") {
      const runId = this.editorSummaryRun?.runId;
      this.rejectEditorSummaryRun(new Error(this.diagnoseCodexFailure(params?.message ?? "\u6458\u8981\u751F\u6210\u5931\u8D25").text));
      this.releaseEditorSummaryRunLock(runId);
      return true;
    }
    if (method.startsWith("item/") || method.startsWith("turn/") || method === "thread/tokenUsage/updated" || method === "thread/compacted") {
      return true;
    }
    return false;
  }
  focusInput() {
    window.setTimeout(() => this.inputEl?.focus(), 50);
  }
  render() {
    this.contentEl.empty();
    this.rootEl = this.contentEl.createDiv({ cls: "codex-container" });
    const header = this.rootEl.createDiv({ cls: "codex-header" });
    const title = header.createDiv({ cls: "codex-title" });
    const icon = title.createSpan({ cls: "codex-title-icon codex-title-icon-codex", attr: { "aria-hidden": "true" } });
    (0, import_obsidian4.setIcon)(icon, "bot");
    title.createSpan({ cls: "codex-title-text", text: "\u5C0F\u5143" });
    const headerActions = header.createDiv({ cls: "codex-header-actions" });
    this.editorActionStatusEl = headerActions.createDiv({
      cls: "codex-status-chip codex-editor-action-status is-idle",
      attr: { role: "button", tabindex: "0", "aria-label": "\u5199\u4F5C\u4E0A\u4E0B\u6587" }
    });
    const editorActionIcon2 = this.editorActionStatusEl.createSpan({ cls: "codex-header-status-icon" });
    (0, import_obsidian4.setIcon)(editorActionIcon2, "wand-sparkles");
    this.editorActionStatusTextEl = this.editorActionStatusEl.createSpan({ cls: "codex-header-status-text", text: "\u5199\u4F5C" });
    this.editorActionStatusEl.onclick = (event) => {
      event.stopPropagation();
      this.articleUnderstandingPanelVisible = !this.articleUnderstandingPanelVisible;
      if (this.articleUnderstandingPanelVisible) void this.refreshArticleUnderstandingPanelSourceState();
      this.renderArticleUnderstandingPanel();
    };
    this.editorActionStatusEl.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.articleUnderstandingPanelVisible = !this.articleUnderstandingPanelVisible;
      if (this.articleUnderstandingPanelVisible) void this.refreshArticleUnderstandingPanelSourceState();
      this.renderArticleUnderstandingPanel();
    };
    this.headerHistoryEl = headerActions.createEl("button", {
      cls: "codex-status-chip codex-header-history is-hidden",
      attr: { type: "button", title: "\u67E5\u770B\u77E5\u8BC6\u5E93\u5386\u53F2", "aria-label": "\u67E5\u770B\u77E5\u8BC6\u5E93\u5386\u53F2" }
    });
    const historyIcon = this.headerHistoryEl.createSpan({ cls: "codex-header-status-icon" });
    (0, import_obsidian4.setIcon)(historyIcon, "history");
    this.headerHistoryEl.createSpan({ cls: "codex-header-status-text", text: "\u5386\u53F2" });
    this.headerHistoryEl.onclick = (event) => {
      event.stopPropagation();
      const session = this.ensureSession();
      if (!this.isKnowledgeBaseSession(session)) return;
      void this.openKnowledgeBaseHistory(session);
    };
    this.headerStatusEl = headerActions.createDiv({ cls: "codex-header-status codex-status-chip" });
    const statusIcon = this.headerStatusEl.createSpan({ cls: "codex-header-status-icon" });
    (0, import_obsidian4.setIcon)(statusIcon, "activity");
    this.headerStatusTextEl = this.headerStatusEl.createSpan({ cls: "codex-header-status-text", text: "\u8FDE\u63A5\u4E2D" });
    this.headerUsageEl = headerActions.createEl("button", {
      cls: "codex-status-chip codex-usage-chip",
      attr: { type: "button", "aria-label": "\u7528\u91CF", title: "\u7528\u91CF" }
    });
    const usageIcon = this.headerUsageEl.createSpan({ cls: "codex-header-status-icon" });
    (0, import_obsidian4.setIcon)(usageIcon, "gauge");
    this.headerUsageTextEl = this.headerUsageEl.createSpan({ cls: "codex-header-status-text", text: "\u7528\u91CF --" });
    this.headerUsageEl.onclick = async (event) => {
      event.stopPropagation();
      const willShow = !this.usagePanelEl.hasClass("is-visible");
      this.usagePanelEl.toggleClass("is-visible", willShow);
      if (willShow) await this.refreshHeaderRateLimits();
    };
    const resourceButton = headerActions.createEl("button", {
      cls: "codex-icon-button codex-resource-button",
      attr: { type: "button", "aria-label": "\u63D2\u4EF6 MCP Skills \u7BA1\u7406", title: "\u63D2\u4EF6 / MCP / Skills \u7BA1\u7406" }
    });
    (0, import_obsidian4.setIcon)(resourceButton, "blocks");
    resourceButton.onclick = () => void this.plugin.openWorkspaceResourceSettings("plugins");
    const settingsButton = headerActions.createEl("button", {
      cls: "codex-icon-button codex-settings-button",
      attr: { type: "button", "aria-label": "\u6253\u5F00\u63D2\u4EF6\u8BBE\u7F6E", title: "\u6253\u5F00\u63D2\u4EF6\u8BBE\u7F6E" }
    });
    renderSettingsGearIcon(settingsButton);
    settingsButton.onclick = () => this.openPluginSettings();
    this.usagePanelEl = header.createDiv({ cls: "codex-usage-panel" });
    this.articleUnderstandingPanelEl = header.createDiv({ cls: "codex-article-panel" });
    this.registerDomEvent(document, "click", (event) => {
      if (!this.rootEl.contains(event.target)) this.usagePanelEl.removeClass("is-visible");
    });
    this.tabBarEl = this.rootEl.createDiv({ cls: "codex-tabs" });
    this.knowledgeDashboardEl = this.rootEl.createDiv({ cls: "codex-kb-dashboard" });
    this.messagesEl = this.rootEl.createDiv({ cls: "codex-messages" });
    this.virtualListEl = this.messagesEl.createDiv({ cls: "codex-virtual-list" });
    this.registerDomEvent(this.messagesEl, "scroll", () => this.scheduleRenderMessages({ fromScroll: true }));
    const inputWrap = this.rootEl.createDiv({ cls: "codex-input-wrap" });
    this.attachmentsEl = inputWrap.createDiv({ cls: "codex-attachments" });
    this.inputEl = inputWrap.createEl("textarea", {
      cls: "codex-input",
      attr: { placeholder: "\u95EE \u5C0F\u5143\uFF0C\u8BA9\u5B83\u7BA1\u7406\u5F53\u524D Obsidian \u4ED3\u5E93" }
    });
    this.inputEl.addEventListener("input", () => this.onInputChanged());
    this.inputEl.addEventListener("paste", (event) => {
      void this.handlePastedFiles(event);
    });
    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void this.sendMessage();
      }
    });
    inputWrap.addEventListener("dragover", (event) => {
      event.preventDefault();
      inputWrap.addClass("is-dragging");
    });
    inputWrap.addEventListener("dragleave", () => inputWrap.removeClass("is-dragging"));
    inputWrap.addEventListener("drop", (event) => {
      event.preventDefault();
      inputWrap.removeClass("is-dragging");
      this.handleDroppedFiles(event);
    });
    this.skillMenuEl = inputWrap.createDiv({ cls: "codex-skill-menu" });
    this.toolbarEl = inputWrap.createDiv({ cls: "codex-toolbar" });
    this.mcpPanelEl = this.rootEl.createDiv({ cls: "codex-mcp-panel" });
    this.renderToolbar();
    this.updateInputPlaceholder();
    this.renderEditorActionStatus();
    this.renderArticleUnderstandingPanel();
  }
  updateInputPlaceholder() {
    if (!this.inputEl) return;
    const session = this.ensureSession();
    this.inputEl.setAttr("placeholder", this.isKnowledgeBaseSession(session) ? "\u666E\u901A\u5BF9\u8BDD\u76F4\u63A5\u8F93\u5165\uFF1B\u67E5\u77E5\u8BC6\u5E93\u7528 /ask\uFF1B\u7BA1\u7406\u7528 /check /maintain" : session.cwd ? `\u95EE \u5C0F\u5143\uFF0C\u5F53\u524D\u5DE5\u4F5C\u533A\uFF1A${workspaceDisplayName(session.cwd)}` : "\u5148\u9009\u62E9\u5DE5\u4F5C\u533A");
    this.renderHeaderHistory();
  }
  renderHeaderHistory() {
    if (!this.headerHistoryEl) return;
    const visible = this.isKnowledgeBaseSession(this.ensureSession());
    this.headerHistoryEl.toggleClass("is-hidden", !visible);
    this.headerHistoryEl.setAttr("aria-hidden", visible ? "false" : "true");
  }
  applyStatus() {
    const status = this.plugin.lastStatus;
    this.headerStatusTextEl.setText(this.running ? "\u601D\u8003\u4E2D" : status?.connected ? "\u6D3B\u8DC3" : "\u672A\u8FDE\u63A5");
    this.headerStatusEl.toggleClass("has-warning", Boolean(status?.errors?.length) || !status?.connected);
    this.headerStatusEl.toggleClass("is-ok", Boolean(status?.connected && !status?.errors?.length));
    this.headerStatusEl.toggleClass("is-active", this.running);
    const providerLabel = providerConnectionLabel(this.plugin.settings);
    this.headerStatusEl.setAttr("title", status?.errors?.length ? status.errors.join("\n") : `${status?.accountLabel ?? "\u672A\u8FDE\u63A5"}
${providerLabel}`);
    this.updateUsageHeader(status?.rateLimits ?? null, this.usageLoading, this.usageError);
    this.renderUsagePanel(status?.rateLimits ?? null, this.usageError, this.usageLoading);
    this.renderToolbar();
  }
  setEditorActionStatus(status) {
    this.editorActionStatus = {
      ...status,
      startedAt: status.startedAt ?? this.editorActionStatus.startedAt ?? Date.now()
    };
    this.clearEditorActionStatusTimers();
    if (status.status === "generating") {
      this.editorActionStatusTicker = window.setInterval(() => this.renderEditorActionStatus(), 1e3);
    }
    if (status.status === "confirmed" || status.status === "canceled" || status.status === "failed") {
      this.editorActionStatusResetTimer = window.setTimeout(() => {
        this.editorActionStatus = {
          status: "idle",
          understandingStatus: this.articleUnderstandingPanelState.status === "fresh" || this.articleUnderstandingPanelState.status === "reused" || this.articleUnderstandingPanelState.status === "stale" ? this.articleUnderstandingPanelState.status : void 0
        };
        this.renderEditorActionStatus();
      }, 2200);
    }
    this.renderEditorActionStatus();
  }
  renderEditorActionStatus() {
    if (!this.editorActionStatusEl || !this.editorActionStatusTextEl) return;
    const enabled = this.plugin.settings.editorActions.statusSlotEnabled;
    const status = this.editorActionStatus;
    this.editorActionStatusEl.toggleClass("is-hidden", !enabled);
    this.editorActionStatusEl.toggleClass("is-idle", status.status === "idle");
    this.editorActionStatusEl.toggleClass("is-active", status.status === "preparing" || status.status === "connecting" || status.status === "generating");
    this.editorActionStatusEl.toggleClass("is-loading", status.status === "preparing" || status.status === "connecting" || status.status === "generating");
    this.editorActionStatusEl.toggleClass("is-ok", status.status === "awaiting-confirm" || status.status === "confirmed");
    this.editorActionStatusEl.toggleClass("has-warning", status.status === "failed" || status.status === "canceled");
    this.editorActionStatusTextEl.setText(editorActionStatusLabel(status));
    this.editorActionStatusEl.setAttr("title", status.error || status.message || "\u7F16\u8F91\u533A AI \u5199\u4F5C\u72B6\u6001");
    this.renderArticleUnderstandingPanel();
  }
  renderArticleUnderstandingPanel() {
    if (!this.articleUnderstandingPanelEl) return;
    const settings = this.plugin.settings.editorActions;
    this.articleUnderstandingPanelEl.empty();
    this.articleUnderstandingPanelEl.toggleClass("is-visible", this.articleUnderstandingPanelVisible && settings.showContextPanel);
    if (!this.articleUnderstandingPanelVisible || !settings.showContextPanel) return;
    const state = this.articleUnderstandingPanelState;
    const modeConfig = resolveEditorActionModeConfig(settings, state.mode ?? settings.qualityMode);
    const title = this.articleUnderstandingPanelEl.createDiv({ cls: "codex-article-panel-title" });
    const titleIcon = title.createSpan({ cls: "codex-usage-panel-icon" });
    (0, import_obsidian4.setIcon)(titleIcon, "file-search");
    title.createSpan({ text: "\u5199\u4F5C\u4E0A\u4E0B\u6587" });
    const meta = this.articleUnderstandingPanelEl.createDiv({ cls: "codex-article-panel-meta" });
    this.addArticlePanelRow(meta, "\u6587\u4EF6", state.source?.fileName ?? "\u5F53\u524D\u672A\u9009\u62E9\u7B14\u8BB0");
    this.addArticlePanelRow(meta, "\u6A21\u5F0F", state.modeLabel ?? modeConfig.label);
    this.addArticlePanelRow(meta, "\u6A21\u578B", state.model ?? modeConfig.model);
    this.addArticlePanelRow(meta, "\u72B6\u6001", articleUnderstandingStatusLabel(state.status, state.error));
    this.addArticlePanelRow(meta, "\u66F4\u65B0\u65F6\u95F4", state.entry?.updatedAt ? formatRelativeTime(state.entry.updatedAt) : "\u65E0");
    this.addArticlePanelRow(meta, "\u672C\u6B21\u4F7F\u7528", state.usedInLastRun ? "\u5DF2\u4F7F\u7528\u6587\u7AE0\u7406\u89E3" : "\u672A\u4F7F\u7528\u6587\u7AE0\u7406\u89E3");
    const body = this.articleUnderstandingPanelEl.createDiv({ cls: "codex-article-panel-body" });
    if (state.entry?.understanding) {
      renderRichText(this.plugin.app, this, body, state.entry.understanding);
    } else if (state.mode === "fast" || settings.qualityMode === "fast") {
      body.createDiv({ cls: "codex-article-panel-empty", text: "\u5FEB\u901F\u6A21\u5F0F\u5199\u4F5C\u65F6\u4E0D\u4F7F\u7528\u6587\u7AE0\u7406\u89E3\uFF1B\u4E5F\u53EF\u4EE5\u624B\u52A8\u5237\u65B0\uFF0C\u5148\u5EFA\u7ACB\u53EF\u89C1\u4E0A\u4E0B\u6587\u3002" });
    } else {
      body.createDiv({ cls: "codex-article-panel-empty", text: "\u8FD8\u6CA1\u6709\u6587\u7AE0\u7406\u89E3\u3002\u70B9\u51FB\u5237\u65B0\u7406\u89E3\uFF0C\u6216\u76F4\u63A5\u4F7F\u7528\u8D28\u91CF/\u4E25\u683C\u5199\u4F5C\u89E6\u53D1\u3002" });
    }
    const actions = this.articleUnderstandingPanelEl.createDiv({ cls: "codex-article-panel-actions" });
    const refresh = actions.createEl("button", { cls: "codex-resource-refresh", text: "\u5237\u65B0\u7406\u89E3", attr: { type: "button" } });
    refresh.disabled = state.status === "running";
    refresh.onclick = () => void this.refreshArticleUnderstandingFromPanel();
    const clear = actions.createEl("button", { cls: "codex-resource-tab", text: "\u6E05\u9664\u7406\u89E3", attr: { type: "button" } });
    clear.disabled = !state.source?.filePath && !state.entry?.filePath;
    clear.onclick = async () => {
      const filePath = state.source?.filePath ?? state.entry?.filePath;
      if (!filePath) return;
      delete this.plugin.settings.editorActions.articleUnderstandingCache[filePath];
      this.articleUnderstandingPanelState = { ...state, status: settings.qualityMode === "fast" ? "idle" : "missing", entry: null, usedInLastRun: false };
      await this.plugin.saveSettings();
      this.renderEditorActionStatus();
    };
    const settingsButton = actions.createEl("button", { cls: "codex-resource-tab", text: "\u6253\u5F00\u8BBE\u7F6E", attr: { type: "button" } });
    settingsButton.onclick = async () => {
      this.plugin.settings.settingsTab = "editorActions";
      await this.plugin.saveSettings();
      this.openPluginSettings();
    };
  }
  addArticlePanelRow(container, label, value) {
    const row = container.createDiv({ cls: "codex-article-panel-row" });
    row.createSpan({ cls: "codex-article-panel-label", text: label });
    row.createSpan({ cls: "codex-article-panel-value", text: value });
  }
  clearEditorActionStatusTimers() {
    if (this.editorActionStatusTicker) {
      window.clearInterval(this.editorActionStatusTicker);
      this.editorActionStatusTicker = null;
    }
    if (this.editorActionStatusResetTimer) {
      window.clearTimeout(this.editorActionStatusResetTimer);
      this.editorActionStatusResetTimer = null;
    }
  }
  async refreshHeaderRateLimits() {
    const requestId = ++this.usageRequestId;
    const cachedRateLimits = this.plugin.lastStatus?.rateLimits ?? null;
    this.usageLoading = true;
    this.usageError = null;
    this.updateUsageHeader(cachedRateLimits, true, null);
    this.renderUsagePanel(cachedRateLimits, null, true);
    const status = await this.plugin.ensureOpenCodeConnected();
    if (requestId !== this.usageRequestId) return;
    if (!status.connected || !this.plugin.codex) {
      this.usageLoading = false;
      this.usageError = "Codex \u672A\u8FDE\u63A5";
      this.updateUsageHeader(null, false, this.usageError);
      this.renderUsagePanel(null, this.usageError, false);
      return;
    }
    const result = await this.plugin.codex.refreshRateLimits();
    if (requestId !== this.usageRequestId) return;
    const nextRateLimits = result.rateLimits ?? this.plugin.lastStatus?.rateLimits ?? null;
    const nextRateLimitsByLimitId = result.rateLimitsByLimitId ?? this.plugin.lastStatus?.rateLimitsByLimitId ?? null;
    if (this.plugin.lastStatus) {
      this.plugin.lastStatus = {
        ...this.plugin.lastStatus,
        rateLimits: nextRateLimits,
        rateLimitsByLimitId: nextRateLimitsByLimitId
      };
    }
    this.usageLoading = false;
    this.usageError = result.error;
    this.updateUsageHeader(nextRateLimits, false, result.error);
    this.renderUsagePanel(nextRateLimits, result.error, false);
  }
  updateUsageHeader(rateLimits, loading = false, error = null) {
    if (!this.headerUsageTextEl) return;
    const usage = formatRateLimitUsage(rateLimits);
    this.headerUsageTextEl.setText(loading && !rateLimits ? "\u8BFB\u53D6\u4E2D" : usage.summary);
    this.headerUsageEl.setAttr("title", loading ? "\u6B63\u5728\u8BFB\u53D6 Codex \u7528\u91CF" : error && !rateLimits ? `\u8BFB\u53D6\u5931\u8D25\uFF1A${error}` : usage.title);
    this.headerUsageEl.toggleClass("is-loading", loading);
    this.headerUsageEl.toggleClass("has-warning", Boolean(error && !rateLimits) || !rateLimits && !loading);
    this.headerUsageEl.toggleClass("is-ok", Boolean(rateLimits && !error && !loading));
  }
  renderUsagePanel(rateLimits, error, loading = false) {
    if (!this.usagePanelEl) return;
    const usage = formatRateLimitUsage(rateLimits);
    this.usagePanelEl.empty();
    const title = this.usagePanelEl.createDiv({ cls: "codex-usage-panel-title" });
    const icon = title.createSpan({ cls: "codex-usage-panel-icon" });
    (0, import_obsidian4.setIcon)(icon, "gauge");
    title.createSpan({ text: "\u5269\u4F59\u989D\u5EA6" });
    if (!usage.primary && !usage.secondary) {
      if (loading) {
        this.usagePanelEl.createDiv({ cls: "codex-usage-loading", text: "\u6B63\u5728\u8BFB\u53D6 Codex \u7528\u91CF..." });
        return;
      }
      if (error) {
        this.usagePanelEl.createDiv({ cls: "codex-usage-error", text: `\u8BFB\u53D6\u5931\u8D25\uFF1A${error}` });
        return;
      }
      this.usagePanelEl.createDiv({ cls: "codex-usage-empty", text: "\u6682\u672A\u8BFB\u53D6\u5230 Codex \u7528\u91CF\u3002" });
      return;
    }
    if (usage.primary) this.renderUsageRow(usage.primary);
    if (usage.secondary) this.renderUsageRow(usage.secondary);
    if (loading) this.usagePanelEl.createDiv({ cls: "codex-usage-loading", text: "\u6B63\u5728\u66F4\u65B0..." });
    if (error) this.usagePanelEl.createDiv({ cls: "codex-usage-error", text: `\u66F4\u65B0\u5931\u8D25\uFF1A${error}` });
  }
  renderUsageRow(item) {
    const row = this.usagePanelEl.createDiv({ cls: "codex-usage-row" });
    row.createDiv({ cls: "codex-usage-label", text: item.label });
    row.createDiv({ cls: "codex-usage-percent", text: `${item.remainingPercent}%` });
    row.createDiv({ cls: "codex-usage-reset", text: item.resetLabel });
  }
  openPluginSettings() {
    const setting = this.app.setting;
    if (!setting?.open || !setting?.openTabById) {
      new import_obsidian4.Notice("\u65E0\u6CD5\u6253\u5F00\u63D2\u4EF6\u8BBE\u7F6E\u9875");
      return;
    }
    setting.open();
    setting.openTabById(this.plugin.manifest.id);
  }
  renderTabs() {
    this.ensureSession();
    this.tabBarEl.empty();
    let chatIndex = 0;
    this.plugin.settings.sessions.forEach((session) => {
      const knowledgeSession = isKnowledgeBaseSession(session, this.plugin.settings.knowledgeBase.sessionId);
      if (!knowledgeSession) chatIndex += 1;
      const tab = this.tabBarEl.createEl("button", {
        cls: `codex-tab ${session.id === this.plugin.settings.activeSessionId ? "is-active" : ""} ${knowledgeSession ? "is-knowledge-base" : ""}`.trim(),
        text: knowledgeSession ? "\u77E5\u8BC6\u5E93" : String(chatIndex),
        attr: { type: "button", title: knowledgeSession ? "\u77E5\u8BC6\u5E93\u7BA1\u7406\uFF08\u5E38\u9A7B\uFF09" : session.title || "\u65B0\u4F1A\u8BDD" }
      });
      tab.onclick = async () => {
        this.plugin.settings.activeSessionId = session.id;
        await this.plugin.saveSettings(true);
        this.resetVirtualWindow();
        this.renderTabs();
        this.renderMessages({ forceBottom: true });
        this.renderToolbar();
        this.renderKnowledgeDashboard();
        void this.refreshKnowledgeDashboard();
        this.updateInputPlaceholder();
        this.prewarmActiveThread();
      };
      tab.oncontextmenu = (event) => this.openSessionMenu(event, session);
      tab.ondblclick = () => {
        if (knowledgeSession) {
          new import_obsidian4.Notice("\u77E5\u8BC6\u5E93\u7BA1\u7406\u9891\u9053\u662F\u5E38\u9A7B\u9891\u9053\uFF0C\u4E0D\u80FD\u91CD\u547D\u540D");
          return;
        }
        void this.renameSession(session);
      };
    });
    const newButton = this.tabBarEl.createEl("button", { cls: "codex-tab-new", attr: { type: "button", "aria-label": "\u65B0\u5EFA\u4F1A\u8BDD" } });
    (0, import_obsidian4.setIcon)(newButton, "plus");
    newButton.onclick = async () => {
      this.createSession();
      this.resetVirtualWindow();
      await this.plugin.saveSettings(true);
      this.renderTabs();
      this.renderMessages({ forceBottom: true });
      this.renderToolbar();
      this.renderKnowledgeDashboard();
      void this.refreshKnowledgeDashboard();
      this.updateInputPlaceholder();
      this.prewarmActiveThread();
    };
  }
  renderMessages(options = {}) {
    const session = this.ensureSession();
    this.settleStaleMessages(session);
    const knowledgeSession = this.isKnowledgeBaseSession(session);
    const messages = knowledgeSession ? getVisibleKnowledgeBaseMessages(session) : session.messages;
    const hiddenCount = knowledgeSession ? getHiddenKnowledgeBaseMessages(session).length : 0;
    if (this.virtualSessionId !== session.id) {
      this.virtualSessionId = session.id;
      this.virtualRowHeights.clear();
    }
    const previousScrollTop = this.messagesEl.scrollTop;
    const shouldPinBottom = Boolean(options.forceBottom) || !options.fromScroll && this.isMessagesNearBottom();
    this.virtualListEl.empty();
    if (messages.length === 0) {
      this.virtualListEl.style.height = "100%";
      const welcome = this.virtualListEl.createDiv({ cls: "codex-welcome" });
      welcome.createDiv({ cls: "codex-welcome-title", text: knowledgeSession ? "\u77E5\u8BC6\u5E93\u7BA1\u7406" : "What's new?" });
      if (knowledgeSession) {
        welcome.createDiv({ cls: "codex-resource-note", text: hiddenCount ? `\u5F53\u524D\u9875\u9762\u5DF2\u6E05\u7A7A\uFF0C\u9690\u85CF ${hiddenCount} \u6761\u672C\u5730\u5386\u53F2\uFF1B\u8F93\u5165 /history \u67E5\u770B\u3002` : "\u8F93\u5165 /help \u67E5\u770B\u547D\u4EE4\uFF1B\u4E5F\u53EF\u4EE5\u76F4\u63A5\u8BF4\u53EA\u4F53\u68C0\u4E00\u4E0B\u3001\u7EF4\u62A4\u77E5\u8BC6\u5E93\u3001\u5199\u5468\u62A5\u3001\u6536\u96C6\u8FD9\u4E2A\u94FE\u63A5\u3002" });
        if (hiddenCount) {
          const historyButton = welcome.createEl("button", { cls: "codex-kb-history-inline-button", text: "\u67E5\u770B\u5386\u53F2", attr: { type: "button" } });
          historyButton.onclick = () => this.openKnowledgeBaseHistory(session);
        }
      } else if (!session.cwd) {
        welcome.createDiv({ cls: "codex-resource-note", text: "\u666E\u901A\u4F1A\u8BDD\u9700\u8981\u5148\u9009\u62E9\u5DE5\u4F5C\u533A\uFF1B\u6DFB\u52A0\u7B14\u8BB0\u53EA\u4F5C\u4E3A\u672C\u8F6E\u4E0A\u4E0B\u6587\u3002" });
      }
      return;
    }
    const rows = this.buildVirtualRows(messages);
    const rowIds = rows.map((row) => row.id);
    this.pruneVirtualHeights(rowIds);
    const viewportHeight = Math.max(1, this.messagesEl.clientHeight);
    const virtual = calculateVirtualWindow({
      rowIds,
      rowHeights: this.virtualRowHeights,
      scrollTop: previousScrollTop,
      viewportHeight
    });
    this.virtualListEl.style.height = `${Math.max(virtual.totalHeight, viewportHeight)}px`;
    for (const virtualRow of virtual.rows) {
      const row = rows[virtualRow.index];
      if (!row) continue;
      const rowEl = this.virtualListEl.createDiv({ cls: `codex-virtual-row codex-virtual-row-${row.kind}` });
      rowEl.dataset.rowId = virtualRow.id;
      rowEl.dataset.index = String(virtualRow.index);
      rowEl.style.transform = `translateY(${virtualRow.top}px)`;
      this.renderVirtualRow(rowEl, row);
    }
    this.measureVisibleVirtualRows(shouldPinBottom);
    if (shouldPinBottom) {
      this.messagesEl.scrollTop = scrollTopForVirtualBottom(virtual.totalHeight, viewportHeight);
    } else if (options.fromScroll || options.preserveScroll) {
      this.messagesEl.scrollTop = previousScrollTop;
    }
  }
  renderKnowledgeDashboard() {
    if (!this.knowledgeDashboardEl) return;
    const session = this.ensureSession();
    const visible = this.isKnowledgeBaseSession(session);
    this.knowledgeDashboardEl.empty();
    this.knowledgeDashboardEl.toggleClass("is-visible", visible);
    if (!visible) return;
    const snapshot = this.knowledgeDashboardSnapshot;
    const healthStatus = snapshot?.health.status ?? "unknown";
    const hasWarning = Boolean(this.knowledgeDashboardError || healthStatus === "risk" || healthStatus === "bad" || snapshot?.warnings.length);
    this.knowledgeDashboardEl.toggleClass("has-warning", hasWarning);
    this.knowledgeDashboardEl.toggleClass("health-healthy", healthStatus === "healthy");
    this.knowledgeDashboardEl.toggleClass("health-risk", healthStatus === "risk");
    this.knowledgeDashboardEl.toggleClass("health-bad", healthStatus === "bad");
    this.knowledgeDashboardEl.toggleClass("is-loading", this.knowledgeDashboardLoading);
    const header = this.knowledgeDashboardEl.createDiv({ cls: "codex-kb-dashboard-header" });
    const title = header.createDiv({ cls: "codex-kb-dashboard-title" });
    const titleIcon = title.createSpan({ cls: "codex-kb-dashboard-icon" });
    (0, import_obsidian4.setIcon)(titleIcon, "database");
    title.createSpan({ text: "\u77E5\u8BC6\u5E93\u72B6\u6001" });
    const summary = header.createDiv({ cls: "codex-kb-dashboard-summary" });
    if (snapshot) {
      this.addKnowledgeDashboardRulesMetric(summary, snapshot);
      this.addKnowledgeDashboardMetric(summary, "Raw", `${snapshot.raw.fileCount}`);
      this.addKnowledgeDashboardMetric(summary, "Wiki", `${snapshot.wiki.fileCount}`);
      this.addKnowledgeDashboardMetric(summary, "Inbox", `${snapshot.inbox.fileCount}`);
      this.addKnowledgeDashboardHealthMetric(summary, snapshot.health.status, snapshot.health.label);
    } else {
      summary.createSpan({ cls: "codex-kb-dashboard-muted", text: this.knowledgeDashboardError || "\u7B49\u5F85\u626B\u63CF" });
    }
    const actions = header.createDiv({ cls: "codex-kb-dashboard-actions" });
    const refresh = actions.createEl("button", { cls: "codex-icon-button codex-kb-dashboard-button", attr: { type: "button", title: "\u5237\u65B0\u72B6\u6001", "aria-label": "\u5237\u65B0\u72B6\u6001" } });
    (0, import_obsidian4.setIcon)(refresh, this.knowledgeDashboardLoading ? "loader-circle" : "refresh-cw");
    refresh.disabled = this.knowledgeDashboardLoading;
    refresh.onclick = () => void this.refreshKnowledgeDashboard(true);
    const toggleTitle = this.knowledgeDashboardExpanded ? "\u6536\u8D77\u8BE6\u60C5" : "\u5C55\u5F00\u8BE6\u60C5";
    const toggle = actions.createEl("button", { cls: "codex-icon-button codex-kb-dashboard-button", attr: { type: "button", title: toggleTitle, "aria-label": toggleTitle } });
    (0, import_obsidian4.setIcon)(toggle, this.knowledgeDashboardExpanded ? "chevron-up" : "chevron-down");
    toggle.onclick = () => {
      this.knowledgeDashboardExpanded = !this.knowledgeDashboardExpanded;
      this.renderKnowledgeDashboard();
    };
    if (this.knowledgeDashboardError) {
      this.knowledgeDashboardEl.createDiv({ cls: "codex-kb-dashboard-error", text: this.knowledgeDashboardError });
    }
    if (!snapshot || !this.knowledgeDashboardExpanded) return;
    const details = this.knowledgeDashboardEl.createDiv({ cls: "codex-kb-dashboard-details" });
    this.renderKnowledgeDashboardHealth(details, snapshot);
    this.renderKnowledgeDashboardWiki(details, snapshot);
    this.renderKnowledgeDashboardQueues(details, snapshot);
    this.renderKnowledgeDashboardHeatmap(details, snapshot);
  }
  async refreshKnowledgeDashboard(force = false) {
    if (!this.knowledgeDashboardEl) return;
    const session = this.ensureSession();
    if (!this.isKnowledgeBaseSession(session)) {
      this.renderKnowledgeDashboard();
      return;
    }
    if (this.knowledgeDashboardLoading && !force) return;
    const manager = this.plugin.getKnowledgeBaseManager();
    if (!manager) return;
    const requestId = ++this.knowledgeDashboardRequestId;
    this.knowledgeDashboardLoading = true;
    this.knowledgeDashboardError = "";
    this.renderKnowledgeDashboard();
    try {
      const snapshot = await manager.getDashboardSnapshot();
      if (requestId !== this.knowledgeDashboardRequestId) return;
      this.knowledgeDashboardSnapshot = snapshot;
    } catch (error) {
      if (requestId !== this.knowledgeDashboardRequestId) return;
      this.knowledgeDashboardError = error instanceof Error ? error.message : String(error);
    } finally {
      if (requestId === this.knowledgeDashboardRequestId) {
        this.knowledgeDashboardLoading = false;
        this.renderKnowledgeDashboard();
      }
    }
  }
  addKnowledgeDashboardMetric(container, label, value) {
    const metric = container.createSpan({ cls: "codex-kb-dashboard-metric" });
    metric.createSpan({ cls: "codex-kb-dashboard-metric-label", text: label });
    metric.createSpan({ cls: "codex-kb-dashboard-metric-value", text: value });
  }
  addKnowledgeDashboardRulesMetric(container, snapshot) {
    const button = container.createEl("button", {
      cls: "codex-kb-dashboard-metric codex-kb-dashboard-rule",
      attr: {
        type: "button",
        title: snapshot.rulesFileExists ? `\u6253\u5F00\u89C4\u5219\u6587\u4EF6\uFF1A${snapshot.rulesFilePath}` : "\u89C4\u5219\u6587\u4EF6\u7F3A\u5931\uFF0C\u70B9\u51FB\u67E5\u770B\u63D0\u793A",
        "aria-label": snapshot.rulesFileExists ? `\u6253\u5F00\u89C4\u5219\u6587\u4EF6 ${snapshot.rulesFilePath}` : "\u89C4\u5219\u6587\u4EF6\u7F3A\u5931"
      }
    });
    button.toggleClass("is-missing", !snapshot.rulesFileExists);
    button.createSpan({ cls: "codex-kb-dashboard-metric-label", text: "\u89C4\u5219" });
    button.createSpan({ cls: "codex-kb-dashboard-metric-value", text: snapshot.rulesFileExists ? snapshot.rulesFilePath : "\u7F3A\u5931" });
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      void this.openKnowledgeDashboardRulesFile(snapshot);
    };
  }
  addKnowledgeDashboardHealthMetric(container, status, label) {
    const metric = container.createSpan({ cls: `codex-kb-dashboard-metric codex-kb-dashboard-health codex-kb-health-${status}` });
    metric.createSpan({ cls: "codex-kb-status-dot" });
    metric.createSpan({ cls: "codex-kb-dashboard-metric-value", text: label });
  }
  async openKnowledgeDashboardRulesFile(snapshot) {
    if (!snapshot.rulesFileExists) {
      new import_obsidian4.Notice(`\u77E5\u8BC6\u5E93\u89C4\u5219\u6587\u4EF6\u7F3A\u5931\uFF1A${snapshot.rulesFilePath}\u3002\u8BF7\u5230\u8BBE\u7F6E\u91CC\u4FEE\u6B63\u89C4\u5219\u6587\u4EF6\u3002`);
      return;
    }
    const file = this.app.vault.getAbstractFileByPath((0, import_obsidian4.normalizePath)(snapshot.rulesFilePath));
    if (file instanceof import_obsidian4.TFile) {
      await this.app.workspace.getLeaf("tab").openFile(file, { active: true });
      return;
    }
    new import_obsidian4.Notice(`\u6CA1\u6709\u5728\u5F53\u524D Obsidian \u4ED3\u5E93\u627E\u5230\uFF1A${snapshot.rulesFilePath}`);
  }
  renderKnowledgeDashboardHealth(container, snapshot) {
    const section = this.addKnowledgeDashboardSection(container, "\u5065\u5EB7\u6982\u89C8");
    const overview = section.createDiv({ cls: "codex-kb-dashboard-health-overview" });
    this.addKnowledgeDashboardMeter(
      overview,
      "\u77E5\u8BC6\u5E93\u5065\u5EB7",
      snapshot.health.score,
      `codex-kb-health-${snapshot.health.status}`,
      snapshot.health.label
    );
    this.addKnowledgeDashboardMeter(
      overview,
      "\u4F53\u68C0\u65B0\u9C9C\u5EA6",
      snapshot.checkFreshness.score,
      `codex-kb-freshness-${snapshot.checkFreshness.status}`,
      snapshot.checkFreshness.label
    );
    const facts = section.createDiv({ cls: "codex-kb-dashboard-facts" });
    this.addKnowledgeDashboardFact(facts, "\u6700\u8FD1\u4F53\u68C0", snapshot.checkFreshness.lastCheckAt ? formatAbsoluteTime(snapshot.checkFreshness.lastCheckAt) : "\u65E0\u8BB0\u5F55");
    this.addKnowledgeDashboardFact(facts, "\u65B0\u9C9C\u5EA6", snapshot.checkFreshness.daysSinceCheck >= 0 ? `${snapshot.checkFreshness.daysSinceCheck} \u5929\u524D\u786E\u8BA4` : "\u65E0\u8BB0\u5F55");
    this.addKnowledgeDashboardFact(facts, "\u8FDE\u7EED\u4F53\u68C0", snapshot.health.streakDays ? `${snapshot.health.streakDays} \u5929` : "0 \u5929");
    this.addKnowledgeDashboardFact(facts, "\u6700\u8FD1\u4EFB\u52A1", knowledgeRunStatusLabel(snapshot.lastRun.status, snapshot.lastRun.at));
    this.addKnowledgeDashboardFact(facts, "Tracker", snapshot.tracker.exists ? `${snapshot.tracker.trackedCount} \u6761` : "\u7F3A\u5931");
    const healthReasons = snapshot.health.status === "healthy" ? [] : snapshot.health.reasons;
    const freshnessReasons = snapshot.checkFreshness.status === "fresh" ? [] : snapshot.checkFreshness.reasons;
    if (!healthReasons.length && !freshnessReasons.length) return;
    const reasons = section.createDiv({ cls: "codex-kb-dashboard-reasons" });
    for (const reason of healthReasons) {
      reasons.createDiv({ cls: "codex-kb-dashboard-reason", text: reason });
    }
    for (const reason of freshnessReasons) {
      reasons.createDiv({ cls: "codex-kb-dashboard-reason codex-kb-dashboard-reason-muted", text: reason });
    }
  }
  addKnowledgeDashboardMeter(container, label, scoreValue, statusClass, statusLabel) {
    const row = container.createDiv({ cls: "codex-kb-dashboard-meter-row" });
    row.createDiv({ cls: "codex-kb-dashboard-meter-label", text: label });
    const score = row.createDiv({ cls: "codex-kb-dashboard-score" });
    score.createSpan({ cls: "codex-kb-dashboard-score-label", text: `${scoreValue}` });
    const track = score.createDiv({ cls: "codex-kb-dashboard-score-track" });
    const fill = track.createDiv({ cls: `codex-kb-dashboard-score-fill ${statusClass}` });
    fill.style.width = `${Math.max(0, Math.min(100, scoreValue))}%`;
    const status = row.createDiv({ cls: `codex-kb-dashboard-health-badge ${statusClass}` });
    status.createSpan({ cls: "codex-kb-status-dot" });
    status.createSpan({ text: statusLabel });
  }
  renderKnowledgeDashboardWiki(container, snapshot) {
    const rows = snapshot.wiki.groups.length ? snapshot.wiki.groups.map((group) => [group.label, `${group.totalCount}`, `${group.sharePercent}%`, group.todayCount ? `+${group.todayCount}` : "-"]) : [["\u65E0\u4E00\u7EA7\u76EE\u5F55", "0", "-", "-"]];
    this.addKnowledgeDashboardTable(container, "Wiki \u72B6\u6001", ["\u4E00\u7EA7\u76EE\u5F55", "\u603B\u6570\u91CF", "\u5360\u6BD4", "\u4ECA\u65E5\u66F4\u65B0"], rows);
  }
  renderKnowledgeDashboardQueues(container, snapshot) {
    this.addKnowledgeDashboardTable(container, "Raw / Inbox \u72B6\u6001", ["\u533A\u57DF", "\u603B\u6570\u91CF", "\u4ECA\u65E5\u65B0\u589E", "\u5F85\u5904\u7406"], [
      ["Raw", `${snapshot.raw.fileCount}`, snapshot.raw.todayCount ? `+${snapshot.raw.todayCount}` : "-", `${snapshot.raw.changedCount}`],
      ["Inbox", `${snapshot.inbox.fileCount}`, snapshot.inbox.todayCount ? `+${snapshot.inbox.todayCount}` : "-", `${snapshot.inbox.fileCount}`]
    ]);
  }
  renderKnowledgeDashboardHeatmap(container, snapshot) {
    const section = this.addKnowledgeDashboardSection(container, "\u4F53\u68C0\u70ED\u529B\u56FE");
    const year = heatmapYear(snapshot);
    const completedChecks = snapshot.checkHeatmap.filter((day) => day.status === "success" || day.status === "failed").length;
    section.createDiv({ cls: "codex-kb-heatmap-summary", text: `${year} \u5E74 ${completedChecks} \u6B21\u4F53\u68C0` });
    const heatmap = section.createDiv({ cls: "codex-kb-dashboard-heatmap" });
    const grid = heatmap.createDiv({ cls: "codex-kb-heatmap-grid" });
    const yearStart = new Date(year, 0, 1, 12, 0, 0, 0);
    const weekCount = Math.max(1, ...snapshot.checkHeatmap.map((day) => heatmapWeekIndex(day.date, yearStart) + 1));
    grid.style.setProperty("--codex-kb-heatmap-weeks", String(weekCount));
    const monthStarts = /* @__PURE__ */ new Set();
    for (const day of snapshot.checkHeatmap) {
      if (day.date.endsWith("-01")) monthStarts.add(day.date);
    }
    for (const dateKey of monthStarts) {
      const date = parseHeatmapDateKey(dateKey);
      if (!date) continue;
      const label = grid.createDiv({ cls: "codex-kb-heatmap-month", text: HEATMAP_MONTH_LABELS[date.getMonth()] });
      label.style.gridColumn = `${heatmapWeekIndex(dateKey, yearStart) + 2}`;
      label.style.gridRow = "1";
    }
    for (const [weekday, label] of [[1, "Mon"], [3, "Wed"], [5, "Fri"]]) {
      const dayLabel = grid.createDiv({ cls: "codex-kb-heatmap-weekday", text: label });
      dayLabel.style.gridColumn = "1";
      dayLabel.style.gridRow = `${weekday + 2}`;
    }
    for (const day of snapshot.checkHeatmap) {
      const date = parseHeatmapDateKey(day.date);
      if (!date) continue;
      const cell = grid.createSpan({
        cls: `codex-kb-heatmap-cell is-${day.status}`,
        attr: { title: `${day.date} \xB7 ${knowledgeHeatmapStatusLabel(day.status)}`, "aria-label": `${day.date} ${knowledgeHeatmapStatusLabel(day.status)}` }
      });
      cell.style.gridColumn = `${heatmapWeekIndex(day.date, yearStart) + 2}`;
      cell.style.gridRow = `${date.getDay() + 2}`;
    }
    const legend = section.createDiv({ cls: "codex-kb-dashboard-legend" });
    legend.createSpan({ cls: "codex-kb-dashboard-legend-label", text: "Less" });
    legend.createSpan({ cls: "codex-kb-legend-dot is-none" });
    legend.createSpan({ cls: "codex-kb-legend-dot is-success is-low" });
    legend.createSpan({ cls: "codex-kb-legend-dot is-success" });
    legend.createSpan({ cls: "codex-kb-dashboard-legend-label", text: "More" });
    const failed = legend.createSpan({ cls: "codex-kb-dashboard-legend-item" });
    failed.createSpan({ cls: "codex-kb-legend-dot is-failed" });
    failed.createSpan({ text: "\u5931\u8D25" });
  }
  addKnowledgeDashboardSection(container, title) {
    const section = container.createDiv({ cls: "codex-kb-dashboard-section" });
    section.createDiv({ cls: "codex-kb-dashboard-section-title", text: title });
    return section;
  }
  addKnowledgeDashboardFact(container, label, value) {
    const fact = container.createDiv({ cls: "codex-kb-dashboard-fact" });
    fact.createSpan({ cls: "codex-kb-dashboard-fact-label", text: label });
    fact.createSpan({ cls: "codex-kb-dashboard-fact-value", text: value });
  }
  addKnowledgeDashboardTable(container, title, columns, rows) {
    const section = this.addKnowledgeDashboardSection(container, title);
    const table = section.createEl("table", { cls: "codex-kb-dashboard-table" });
    const thead = table.createEl("thead");
    const headRow = thead.createEl("tr");
    for (const column of columns) headRow.createEl("th", { text: column });
    const tbody = table.createEl("tbody");
    for (const row of rows) {
      const tr = tbody.createEl("tr");
      for (const cell of row) tr.createEl("td", { text: cell });
    }
  }
  buildVirtualRows(messages) {
    const rows = [];
    for (let index = 0; index < messages.length; index += 1) {
      const message = messages[index];
      if (isGroupedProcessItemType(message.itemType)) {
        const group = [message];
        while (index + 1 < messages.length && isGroupedProcessItemType(messages[index + 1].itemType) && sameProcessRun(message, messages[index + 1])) {
          group.push(messages[index + 1]);
          index += 1;
        }
        rows.push({ id: processGroupRowId(group), kind: "processGroup", messages: group });
        continue;
      }
      rows.push({ id: messageRowId(message), kind: "message", message });
    }
    return rows;
  }
  renderVirtualRow(container, row) {
    if (row.kind === "processGroup") {
      this.renderProcessGroup(container, row.messages);
      return;
    }
    this.renderMessage(container, row.message);
  }
  renderMessage(container, message) {
    const wrapper = container.createDiv({ cls: `codex-message codex-message-${message.role}` });
    wrapper.toggleClass("codex-message-streaming", message.status === "running");
    wrapper.toggleClass(`codex-message-type-${message.itemType ?? "text"}`, true);
    if (message.title) wrapper.createDiv({ cls: "codex-message-title", text: message.title });
    if (message.attachments?.length) {
      this.renderUserAttachmentChips(wrapper.createDiv({ cls: "codex-message-attachments" }), message.attachments);
    }
    if (message.images?.length) {
      const images = wrapper.createDiv({ cls: "codex-message-images" });
      for (const image of message.images) {
        const img = images.createEl("img", { attr: { alt: image.name } });
        img.src = toImageSrc(this.app, image.path);
        img.onload = () => this.scheduleMeasureVirtualRows();
        img.onclick = () => openImageOverlay(img.src);
      }
    }
    const content = wrapper.createDiv({ cls: "codex-message-content" });
    if (message.itemType === "thinking") {
      this.renderThinkingMessage(content, message);
      return;
    }
    if (isProcessItemType3(message.itemType)) {
      this.renderProcessMessage(content, message);
      return;
    }
    renderRichText(this.app, this, content, displayTextForMessage(message));
    if (message.rawRef) this.renderRawMessageExpander(content, message);
    if (message.citations) this.renderKnowledgeBaseCitations(wrapper, message.id, message.citations);
  }
  renderKnowledgeBaseCitations(container, messageId, citations) {
    const stateKey = `kb-citations:${messageId}`;
    const details = container.createEl("details", { cls: `codex-kb-citations codex-kb-citations-${citations.status}` });
    details.open = this.openKnowledgeBaseCitations.get(stateKey) ?? false;
    details.ontoggle = () => {
      this.openKnowledgeBaseCitations.set(stateKey, details.open);
      this.scheduleMeasureVirtualRows();
    };
    const summary = details.createEl("summary", { cls: "codex-kb-citations-summary" });
    summary.createSpan({ cls: "codex-kb-citations-title", text: "\u672C\u6B21\u6765\u6E90" });
    const buckets = summary.createSpan({ cls: "codex-kb-citation-buckets" });
    for (const bucket of ["wiki", "journal", "outputs"]) {
      buckets.createSpan({ cls: `codex-kb-source-count codex-kb-source-${bucket}`, text: `${kbBucketLabel(bucket)} ${citations.counts[bucket] ?? 0}` });
    }
    summary.createSpan({ cls: `codex-kb-evidence-status codex-kb-evidence-${citations.status}`, text: kbEvidenceStatusLabel(citations.status) });
    const body = details.createDiv({ cls: "codex-kb-citations-body" });
    if (!citations.citations.length) {
      body.createDiv({ cls: "codex-kb-no-evidence", text: "\u6CA1\u6709\u547D\u4E2D\u6587\u4EF6\uFF0C\u4E5F\u6CA1\u6709\u5F15\u7528\u7247\u6BB5\uFF1B\u4E0D\u4F1A\u663E\u793A\u4F2A\u6765\u6E90\u3002" });
      return;
    }
    for (const citation of citations.citations) this.renderKnowledgeBaseCitationItem(body, citation);
  }
  renderKnowledgeBaseCitationItem(container, citation) {
    const item = container.createDiv({ cls: `codex-kb-citation-item codex-kb-citation-${citation.bucket}` });
    const header = item.createDiv({ cls: "codex-kb-citation-header" });
    header.createSpan({ cls: `codex-kb-citation-badge codex-kb-source-${citation.bucket}`, text: kbBucketLabel(citation.bucket) });
    const title = header.createEl("button", {
      cls: "codex-kb-citation-title",
      text: citation.title || citation.path,
      attr: {
        type: "button",
        title: `\u6253\u5F00 ${citation.path}`
      }
    });
    title.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      void this.openKnowledgeBaseCitation(citation);
    };
    header.createSpan({ cls: `codex-kb-citation-relevance codex-kb-evidence-${citation.relevance}`, text: citation.relevance === "strong" ? "\u5F3A\u8BC1\u636E" : "\u5F31\u76F8\u5173" });
    const open = header.createEl("button", {
      cls: "codex-kb-citation-open",
      text: "\u6253\u5F00",
      attr: {
        type: "button",
        title: citation.path
      }
    });
    open.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      void this.openKnowledgeBaseCitation(citation);
    };
    item.createDiv({ cls: "codex-kb-citation-path", text: citation.path });
    const quote = item.createDiv({ cls: "codex-kb-citation-quote" });
    for (const line of citation.excerptLines.length ? citation.excerptLines : ["\u65E0\u53EF\u7528\u5F15\u7528\u7247\u6BB5"]) {
      quote.createDiv({ cls: "codex-kb-citation-line", text: line });
    }
    item.createDiv({ cls: "codex-kb-citation-reason", text: `\u4E3A\u4EC0\u4E48\u76F8\u5173\uFF1A${citation.reason}` });
  }
  async openKnowledgeBaseCitation(citation) {
    const normalized = (0, import_obsidian4.normalizePath)(citation.path);
    const file = this.app.vault.getAbstractFileByPath(normalized);
    if (file instanceof import_obsidian4.TFile) {
      await this.app.workspace.getLeaf("tab").openFile(file, { active: true });
      return;
    }
    const absolute = path8.join(this.plugin.getVaultPath(), normalized);
    if (showItemInFinder(absolute)) return;
    new import_obsidian4.Notice(`\u6CA1\u6709\u5728\u5F53\u524D Obsidian \u4ED3\u5E93\u627E\u5230\uFF1A${citation.path}`);
  }
  renderProcessGroup(container, messages) {
    const groupId = processGroupId(messages);
    const wrapper = container.createDiv({ cls: "codex-message codex-message-tool codex-message-type-processGroup" });
    const details = wrapper.createEl("details", { cls: "codex-process-group" });
    details.open = this.openProcessGroups.get(groupId) ?? false;
    let body = null;
    const renderBody = () => {
      if (body) return;
      body = details.createDiv({ cls: "codex-process-group-body" });
      for (const message of messages) this.renderProcessMessage(body, message, true);
    };
    details.ontoggle = () => {
      this.rememberOpenState(this.openProcessGroups, groupId, details.open);
      if (details.open) renderBody();
      this.scheduleMeasureVirtualRows();
    };
    const summary = details.createEl("summary", { cls: "codex-process-group-summary" });
    const icon = summary.createSpan({ cls: "codex-process-group-icon" });
    (0, import_obsidian4.setIcon)(icon, "list-tree");
    const main = summary.createDiv({ cls: "codex-process-group-main" });
    main.createSpan({ cls: "codex-process-group-title", text: processGroupTitle(messages) });
    main.createSpan({ cls: "codex-process-group-detail", text: processGroupDetail(messages) });
    const status = processGroupStatus(messages);
    summary.createSpan({ cls: "codex-structured-status", text: status });
    if (details.open) renderBody();
  }
  renderUserAttachmentChips(container, attachments) {
    for (const attachment of attachments) {
      const chip = container.createEl("button", {
        cls: `codex-message-attachment-chip codex-message-attachment-${attachment.type}`,
        attr: {
          type: "button",
          title: attachment.path,
          "aria-label": `\u6253\u5F00\u9644\u4EF6 ${attachment.name}`
        }
      });
      const icon = chip.createSpan({ cls: "codex-message-attachment-icon" });
      (0, import_obsidian4.setIcon)(icon, attachment.type === "image" ? "image" : "file-text");
      chip.createSpan({ cls: "codex-message-attachment-name", text: attachment.name });
      chip.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        void this.openAttachment(attachment);
      };
    }
  }
  async openAttachment(attachment) {
    if (attachment.type === "image") {
      openImageOverlay(toImageSrc(this.app, attachment.path));
      return;
    }
    const ref = summarizeAttachmentFile(attachment, this.plugin.getVaultPath());
    await this.openProcessFile(ref);
  }
  renderThinkingMessage(container, message) {
    const shell = container.createDiv({ cls: "codex-thinking-shell" });
    if (message.status === "running") {
      const row = shell.createDiv({ cls: "codex-thinking-live" });
      row.createSpan({ cls: "codex-thinking-dot" });
      row.createSpan({ text: message.text || "\u6B63\u5728\u751F\u6210\u56DE\u590D..." });
      return;
    }
    shell.createEl("em", { cls: "codex-response-footer", text: message.text || "\u601D\u8003\u5B8C\u6210" });
  }
  renderProcessMessage(container, message, nested = false) {
    const details = container.createEl("details", { cls: `codex-structured codex-process codex-process-${message.itemType ?? "item"}` });
    details.toggleClass("is-running", message.status === "running");
    details.toggleClass("is-completed", message.status === "completed");
    details.toggleClass("is-error", message.status === "error" || message.status === "failed");
    details.toggleClass("is-nested", nested);
    if (message.processKind) details.toggleClass(`codex-process-kind-${message.processKind}`, true);
    const defaultOpen = !nested && (message.itemType === "reasoning" || message.itemType === "plan" || message.status === "error" || message.status === "failed");
    details.open = this.openProcessItems.get(message.id) ?? defaultOpen;
    let body = null;
    const renderBody = () => {
      if (body) return;
      body = details.createDiv({ cls: "codex-structured-body codex-process-body" });
      this.renderProcessBody(body, message);
    };
    details.ontoggle = () => {
      this.rememberOpenState(this.openProcessItems, message.id, details.open);
      if (details.open) renderBody();
      this.scheduleMeasureVirtualRows();
    };
    const summary = details.createEl("summary", { cls: "codex-process-summary" });
    const icon = summary.createSpan({ cls: "codex-structured-icon codex-process-icon" });
    (0, import_obsidian4.setIcon)(icon, iconForProcessMessage(message));
    const main = summary.createDiv({ cls: "codex-process-main" });
    if (message.itemType === "fileChange" && message.diffSummary?.files.length) {
      this.renderProcessEditSummary(main, message);
    } else {
      main.createSpan({ cls: "codex-structured-title codex-process-title", text: titleForItemType(message) });
      if (message.itemType === "fileChange" && message.diffSummary) this.renderDiffStats(main, message.diffSummary);
      if (message.details) main.createDiv({ cls: "codex-process-detail", text: message.details });
      if (message.itemType === "fileChange" && message.files?.length) this.renderProcessFileChips(main.createDiv({ cls: "codex-process-files" }), message.files);
    }
    if (message.status) summary.createSpan({ cls: "codex-structured-status", text: labelForStatus(message.status) });
    if (details.open) renderBody();
  }
  renderProcessBody(body, message) {
    const fallback = message.status === "running" ? "\u6B63\u5728\u63A5\u6536\u8FC7\u7A0B\u5185\u5BB9..." : "\u6682\u65E0\u5185\u5BB9";
    if (message.itemType === "commandExecution") {
      this.renderCommandExecutionBody(body, message, fallback);
      return;
    }
    if (message.itemType === "fileChange" && message.diffSummary) {
      this.renderFileChangeBody(body, message, fallback);
      return;
    }
    const rawLike = message.itemType === "commandExecution" || message.itemType === "fileChange" || message.itemType === "mcpToolCall" || message.itemType === "dynamicToolCall" || message.itemType === "collabAgentToolCall";
    if (rawLike) body.createDiv({ cls: "codex-process-raw-title", text: this.rawMetaLabel(message) });
    if (message.rawRef) {
      this.renderDeferredRawText(body, message, fallback);
      return;
    }
    const text = displayTextForMessage(message) || fallback;
    if (rawLike || isLargeRawMessage(message)) {
      this.renderPlainTextBlock(body, text);
      return;
    }
    renderRichText(this.app, this, body, text);
  }
  renderFileChangeBody(body, message, fallback) {
    const renderDiff = (text) => {
      body.empty();
      const files = parseFileChangeDiff(text || fallback, message.diffSummary);
      if (!files.length) {
        this.renderPlainTextBlock(body, text || fallback);
        return;
      }
      if (message.diffSummary) this.renderDiffOverview(body, message.diffSummary);
      this.renderDiffFiles(body, files, message.files ?? []);
    };
    if (message.rawRef) {
      body.createDiv({ cls: "codex-process-raw-loading", text: "\u6B63\u5728\u52A0\u8F7D\u6587\u4EF6\u6539\u52A8..." });
      void this.loadRawText(message).then((text) => renderDiff(text)).catch((error) => {
        body.empty();
        body.createDiv({ cls: "codex-process-raw-loading", text: `\u6587\u4EF6\u6539\u52A8\u52A0\u8F7D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}` });
        this.renderPlainTextBlock(body, displayTextForMessage(message) || fallback);
      });
      return;
    }
    renderDiff(displayTextForMessage(message) || fallback);
  }
  renderCommandExecutionBody(body, message, fallback) {
    const renderShell = (text) => {
      body.empty();
      const shell = body.createDiv({ cls: "codex-shell-block" });
      shell.createDiv({ cls: "codex-shell-label", text: "Shell" });
      shell.createEl("pre", { cls: "codex-shell-output", text: shellTranscript(text || fallback) });
    };
    if (message.rawRef) {
      body.createDiv({ cls: "codex-process-raw-loading", text: "\u6B63\u5728\u52A0\u8F7D\u547D\u4EE4\u8F93\u51FA..." });
      void this.loadRawText(message).then((text) => {
        renderShell(text);
        this.scheduleMeasureVirtualRows();
      }).catch((error) => {
        body.empty();
        body.createDiv({ cls: "codex-process-raw-loading", text: `\u547D\u4EE4\u8F93\u51FA\u52A0\u8F7D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}` });
        renderShell(displayTextForMessage(message) || fallback);
        this.scheduleMeasureVirtualRows();
      });
      return;
    }
    renderShell(displayTextForMessage(message) || fallback);
  }
  renderDiffOverview(container, summary) {
    const row = container.createDiv({ cls: "codex-diff-overview" });
    row.createSpan({ cls: "codex-diff-overview-title", text: diffSummaryLabel(summary) });
    this.renderDiffStats(row, summary);
  }
  renderDiffStats(container, summary) {
    const stats = container.createSpan({ cls: "codex-diff-stats" });
    stats.createSpan({ cls: "codex-diff-stat codex-diff-stat-add", text: `+${summary.added}` });
    stats.createSpan({ cls: "codex-diff-stat codex-diff-stat-remove", text: `-${summary.removed}` });
  }
  renderDiffFiles(container, files, refs) {
    const list = container.createDiv({ cls: "codex-diff-files" });
    if (files.length === 1) {
      this.renderDiffFileBody(list, files[0]);
      return;
    }
    files.forEach((file, index) => {
      const details = list.createEl("details", { cls: "codex-diff-file" });
      details.open = files.length === 1 || index === 0;
      let rendered = false;
      const renderRows = () => {
        if (rendered) return;
        rendered = true;
        this.renderDiffFileBody(details, file);
      };
      details.ontoggle = () => {
        if (details.open) renderRows();
      };
      const summary = details.createEl("summary", { cls: "codex-diff-file-summary" });
      const main = summary.createSpan({ cls: "codex-diff-file-main" });
      const ref = findProcessFileRef(refs, file.path);
      if (ref) {
        this.renderProcessFileTextLink(main, ref, file.path, "codex-diff-file-path");
      } else {
        main.createSpan({ cls: "codex-diff-file-path", text: file.path });
      }
      if (file.previousPath) main.createSpan({ cls: "codex-diff-file-previous", text: `\u539F\u8DEF\u5F84 ${file.previousPath}` });
      summary.createSpan({ cls: "codex-diff-file-kind", text: labelForDiffKind(file.kind) });
      const stats = summary.createSpan({ cls: "codex-diff-file-stats" });
      stats.createSpan({ cls: "codex-diff-stat codex-diff-stat-add", text: `+${file.added}` });
      stats.createSpan({ cls: "codex-diff-stat codex-diff-stat-remove", text: `-${file.removed}` });
      if (details.open) renderRows();
    });
  }
  renderDiffFileBody(container, file) {
    const body = container.createDiv({ cls: "codex-diff-file-body" });
    if (!file.lines.length) {
      body.createDiv({ cls: "codex-diff-empty", text: "\u6CA1\u6709\u53EF\u5C55\u793A\u7684 diff \u5185\u5BB9" });
      return;
    }
    for (const line of file.lines) {
      const row = body.createDiv({ cls: `codex-diff-line codex-diff-line-${line.type}` });
      row.createSpan({ cls: "codex-diff-line-no codex-diff-line-old", text: line.oldLine === null ? "" : String(line.oldLine) });
      row.createSpan({ cls: "codex-diff-line-no codex-diff-line-new", text: line.newLine === null ? "" : String(line.newLine) });
      row.createSpan({ cls: "codex-diff-marker", text: line.marker });
      row.createSpan({ cls: "codex-diff-content", text: line.text || " " });
    }
  }
  renderProcessEditSummary(container, message) {
    const list = container.createDiv({ cls: "codex-process-edit-list" });
    for (const file of message.diffSummary?.files ?? []) {
      const row = list.createDiv({ cls: "codex-process-edit-row" });
      row.createSpan({ cls: "codex-process-edit-prefix", text: "\u5DF2\u7F16\u8F91 " });
      const ref = findProcessFileRef(message.files ?? [], file.path) ?? normalizeProcessFileRef(file.path, this.plugin.getVaultPath());
      this.renderProcessFileTextLink(row, ref, basename3(file.path), "codex-process-edit-file");
      row.createSpan({ cls: "codex-diff-stat codex-diff-stat-add", text: ` +${file.added}` });
      row.createSpan({ cls: "codex-diff-stat codex-diff-stat-remove", text: ` -${file.removed}` });
    }
  }
  renderProcessFileTextLink(container, file, label, extraClass = "") {
    const link = container.createEl("span", {
      cls: `codex-process-file-link codex-process-file-link-${file.kind} ${extraClass}`.trim(),
      text: label,
      attr: {
        role: "button",
        tabindex: file.openable ? "0" : "-1",
        title: file.openable ? file.displayPath : `${file.displayPath}\uFF08\u65E0\u6CD5\u6253\u5F00\uFF09`,
        "aria-label": `\u6253\u5F00 ${label}`
      }
    });
    link.toggleClass("is-disabled", !file.openable);
    link.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      void this.openProcessFile(file);
    };
    link.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      void this.openProcessFile(file);
    };
    return link;
  }
  renderDeferredRawText(container, message, fallback) {
    const status = container.createDiv({ cls: "codex-process-raw-loading", text: "\u6B63\u5728\u52A0\u8F7D\u5168\u6587..." });
    const pre = container.createEl("pre", { cls: "codex-process-fulltext" });
    pre.setText(displayTextForMessage(message) || fallback);
    void this.loadRawText(message).then((text) => {
      status.setText(this.rawMetaLabel(message, text));
      pre.setText(text || fallback);
      this.scheduleMeasureVirtualRows();
    }).catch((error) => {
      status.setText(`\u5168\u6587\u52A0\u8F7D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
      this.scheduleMeasureVirtualRows();
    });
  }
  renderRawMessageExpander(container, message) {
    const details = container.createEl("details", { cls: "codex-raw-message-details" });
    details.createEl("summary", { text: this.rawMetaLabel(message) });
    let loaded = false;
    details.ontoggle = () => {
      if (!details.open || loaded) return;
      loaded = true;
      const body = details.createDiv({ cls: "codex-raw-message-body" });
      body.createDiv({ cls: "codex-process-raw-loading", text: "\u6B63\u5728\u52A0\u8F7D\u5168\u6587..." });
      const pre = body.createEl("pre", { cls: "codex-process-fulltext" });
      this.scheduleMeasureVirtualRows();
      void this.loadRawText(message).then((text) => {
        body.empty();
        this.renderPlainTextBlock(body, text || "\u6682\u65E0\u5185\u5BB9");
        this.scheduleMeasureVirtualRows();
      }).catch((error) => {
        pre.setText(`\u5168\u6587\u52A0\u8F7D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
        this.scheduleMeasureVirtualRows();
      });
    };
  }
  renderPlainTextBlock(container, text) {
    const pre = container.createEl("pre", { cls: "codex-process-fulltext" });
    pre.setText(text);
  }
  async loadRawText(message) {
    if (!message.rawRef) return displayTextForMessage(message);
    const cached = this.rawTextCache.get(message.rawRef);
    if (cached !== void 0) return cached;
    const text = await this.plugin.readRawMessageText(message.rawRef);
    this.rawTextCache.set(message.rawRef, text);
    while (this.rawTextCache.size > 5) {
      const oldest = this.rawTextCache.keys().next().value;
      if (!oldest) break;
      this.rawTextCache.delete(oldest);
    }
    return text;
  }
  rawMetaLabel(message, loadedText) {
    const size = message.rawSize ?? loadedText?.length ?? displayTextForMessage(message).length;
    const lines = message.rawLines ?? (loadedText ? countLines2(loadedText) : null);
    const parts = ["\u539F\u59CB\u8F93\u51FA"];
    if (size) parts.push(formatBytes(size));
    if (lines) parts.push(`${lines} \u884C`);
    if (message.rawRef) parts.push("\u5C55\u5F00\u540E\u5DF2\u4FDD\u7559\u5168\u6587");
    return parts.join(" \xB7 ");
  }
  renderProcessFileChips(container, files) {
    for (const file of files) {
      const chip = container.createEl("button", {
        cls: `codex-process-file-chip codex-process-file-${file.kind}`,
        attr: {
          type: "button",
          title: file.openable ? file.displayPath : `${file.displayPath}\uFF08\u65E0\u6CD5\u6253\u5F00\uFF09`,
          "aria-label": `\u6253\u5F00 ${file.name}`
        }
      });
      chip.toggleClass("is-disabled", !file.openable);
      const icon = chip.createSpan({ cls: "codex-process-file-icon" });
      (0, import_obsidian4.setIcon)(icon, file.kind === "external" ? "folder-open" : "file-text");
      chip.createSpan({ cls: "codex-process-file-name", text: file.name });
      chip.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        void this.openProcessFile(file);
      };
    }
  }
  async openProcessFile(file) {
    if (!file.openable) {
      new import_obsidian4.Notice("\u8FD9\u4E2A\u6587\u4EF6\u8DEF\u5F84\u65E0\u6CD5\u6253\u5F00");
      return;
    }
    if (file.kind === "vault") {
      const vaultFile = this.app.vault.getAbstractFileByPath((0, import_obsidian4.normalizePath)(file.path));
      if (vaultFile instanceof import_obsidian4.TFile) {
        await this.app.workspace.getLeaf("tab").openFile(vaultFile, { active: true });
        return;
      }
      if (file.absolutePath && showItemInFinder(file.absolutePath)) return;
      new import_obsidian4.Notice(`\u6CA1\u6709\u5728\u5F53\u524D Obsidian \u4ED3\u5E93\u627E\u5230\uFF1A${file.displayPath}`);
      return;
    }
    if (file.kind === "external" && showItemInFinder(file.absolutePath ?? file.path)) return;
    new import_obsidian4.Notice("\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A\u6587\u4EF6\u4F4D\u7F6E");
  }
  renderToolbar() {
    if (!this.toolbarEl) return;
    this.toolbarEl.empty();
    this.renderAttachments();
    const session = this.ensureSession();
    const knowledgeSession = this.isKnowledgeBaseSession(session);
    const knowledgeManager = this.plugin.getKnowledgeBaseManager();
    const knowledgeTaskRunning = knowledgeSession && Boolean(knowledgeManager?.isRunning);
    const row = this.toolbarEl.createDiv({ cls: "codex-composer-row" });
    const left = row.createDiv({ cls: "codex-composer-left" });
    const right = row.createDiv({ cls: "codex-composer-right" });
    const addButton = this.createComposerIconButton(left, "plus", "\u6DFB\u52A0\u5185\u5BB9");
    addButton.onclick = (event) => this.openAddMenu(event);
    if (knowledgeSession) {
      const wechatButton = this.createComposerIconButton(left, "newspaper", "\u516C\u4F17\u53F7\u6536\u96C6");
      wechatButton.onclick = () => this.runKnowledgeBaseShortcut("\u516C\u4F17\u53F7\u6536\u96C6", async () => {
        const paths = await this.plugin.getKnowledgeBaseManager()?.captureWeChatArticle();
        return paths?.length ? `\u5DF2\u6536\u96C6\u516C\u4F17\u53F7\uFF1A
${paths.map((item) => `- ${item}`).join("\n")}` : "\u672A\u6536\u96C6\u5185\u5BB9\u3002";
      });
      const webButton = this.createComposerIconButton(left, "bookmark-plus", "\u7F51\u9875\u6536\u85CF");
      webButton.onclick = () => this.runKnowledgeBaseShortcut("\u7F51\u9875\u6536\u85CF", async () => {
        const paths = await this.plugin.getKnowledgeBaseManager()?.captureWebPage();
        return paths?.length ? `\u5DF2\u6536\u85CF\u7F51\u9875\uFF1A
${paths.map((item) => `- ${item}`).join("\n")}` : "\u672A\u6536\u85CF\u5185\u5BB9\u3002";
      });
      const fileButton = this.createComposerIconButton(left, "file-plus", "\u6587\u4EF6\u6536\u85CF");
      fileButton.onclick = () => this.pickKnowledgeBaseFiles();
      if (this.resolvedKnowledgeBackend() === "codex-cli") {
        const modelButton = right.createEl("button", {
          cls: "codex-composer-model-button",
          attr: { type: "button", "aria-label": "\u77E5\u8BC6\u5E93\u6A21\u578B\u548C\u601D\u8003\u5F3A\u5EA6", title: this.currentKnowledgeComposerSummaryTitle() }
        });
        const modelIcon = modelButton.createSpan({ cls: "codex-composer-model-icon" });
        (0, import_obsidian4.setIcon)(modelIcon, "zap");
        modelButton.createSpan({ cls: "codex-composer-model-text", text: this.currentComposerSummary() });
        const modelChevron = modelButton.createSpan({ cls: "codex-composer-chevron" });
        (0, import_obsidian4.setIcon)(modelChevron, "chevron-down");
        modelButton.onclick = (event) => this.openKnowledgeModelMenu(event);
      }
      const kbChip = right.createEl("button", { cls: "codex-composer-model-button codex-kb-channel-chip", attr: { type: "button", title: "\u77E5\u8BC6\u5E93\u5E38\u7528\u547D\u4EE4" } });
      const kbIcon = kbChip.createSpan({ cls: "codex-composer-model-icon" });
      (0, import_obsidian4.setIcon)(kbIcon, "library");
      kbChip.createSpan({ cls: "codex-composer-model-text", text: knowledgeTaskRunning ? "\u77E5\u8BC6\u5E93\u8FD0\u884C\u4E2D" : "\u77E5\u8BC6\u5E93\u547D\u4EE4" });
      const chevron = kbChip.createSpan({ cls: "codex-composer-chevron" });
      (0, import_obsidian4.setIcon)(chevron, "chevron-down");
      kbChip.onclick = (event) => this.openKnowledgeCommandMenu(event);
    } else {
      this.addComposerSelect(left, "shield-check", ["read-only", "workspace-write", "danger-full-access"], this.selectedPermission, (value) => {
        this.selectedPermission = value;
        this.persistComposerDefaults();
        this.renderToolbar();
      }, "\u6743\u9650", "codex-permission-control");
      this.addWorkspaceButton(left, session);
      this.contextEl = right.createDiv({ cls: "codex-context-meter", attr: { title: "\u4E0A\u4E0B\u6587\u5BB9\u91CF" } });
      this.contextRingEl = this.contextEl.createSpan({ cls: "codex-context-ring", attr: { "aria-hidden": "true" } });
      this.contextRingEl.createSpan({ cls: "codex-context-ring-hole" });
      this.contextValueEl = this.contextEl.createSpan({ cls: "codex-context-value", text: "--" });
      const modelButton = right.createEl("button", {
        cls: "codex-composer-model-button",
        attr: { type: "button", "aria-label": "\u6A21\u578B\u548C\u8FD0\u884C\u53C2\u6570", title: this.currentComposerSummaryTitle() }
      });
      const modelIcon = modelButton.createSpan({ cls: "codex-composer-model-icon" });
      (0, import_obsidian4.setIcon)(modelIcon, "zap");
      modelButton.createSpan({ cls: "codex-composer-model-text", text: this.currentComposerSummary() });
      const chevron = modelButton.createSpan({ cls: "codex-composer-chevron" });
      (0, import_obsidian4.setIcon)(chevron, "chevron-down");
      modelButton.onclick = (event) => this.openModelMenu(event);
      const micButton = this.createComposerIconButton(right, "mic", "\u8BED\u97F3\u8F93\u5165");
      micButton.onclick = () => new import_obsidian4.Notice("\u8BED\u97F3\u8F93\u5165\u6682\u672A\u63A5\u5165");
    }
    const composerState = {
      viewRunning: this.running,
      knowledgeTaskRunning
    };
    const busy = composerIsBusy(composerState);
    const sendButton = row.createEl("button", {
      cls: "codex-send-button codex-composer-send-button",
      attr: { type: "button", "aria-label": busy ? "\u505C\u6B62" : "\u53D1\u9001", title: busy ? "\u505C\u6B62" : "\u53D1\u9001" }
    });
    (0, import_obsidian4.setIcon)(sendButton, busy ? "square" : "send-horizontal");
    sendButton.onclick = () => {
      const action = composerPrimaryActionForState(composerState);
      if (action === "cancel-knowledge-task") void knowledgeManager?.cancelMaintenance();
      else if (action === "stop-turn") void this.stopTurn();
      else void this.sendMessage();
    };
    if (!knowledgeSession) this.updateContext(session.tokenUsage, false);
  }
  createComposerIconButton(container, iconName, title) {
    const button = container.createEl("button", {
      cls: "codex-composer-icon-button",
      attr: { type: "button", "aria-label": title, title }
    });
    (0, import_obsidian4.setIcon)(button, iconName);
    return button;
  }
  addComposerSelect(container, iconName, values, selected, onChange, label, extraClass = "") {
    const control = container.createDiv({ cls: `codex-composer-select ${extraClass}`.trim(), attr: { title: label } });
    control.toggleClass("is-danger", selected === "danger-full-access");
    const icon = control.createSpan({ cls: "codex-composer-select-icon" });
    (0, import_obsidian4.setIcon)(icon, iconName);
    const select = control.createEl("select", { cls: "codex-select codex-composer-native-select", attr: { "aria-label": label, title: label } });
    for (const value of values) select.createEl("option", { text: labelFor(value), value });
    select.value = selected;
    select.onchange = () => onChange(select.value);
  }
  addWorkspaceButton(container, session) {
    const workspacePath = normalizeWorkspacePath(session.cwd);
    const valid = workspacePath ? workspaceDirectoryExists(workspacePath) : false;
    const title = workspacePath ? `\u5DE5\u4F5C\u533A\uFF1A${workspacePath}${valid ? "" : "\n\u6587\u4EF6\u5939\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9"}` : "\u9009\u62E9\u6587\u4EF6\u5939\u4F5C\u4E3A\u672C\u4F1A\u8BDD\u5DE5\u4F5C\u533A";
    const button = container.createEl("button", {
      cls: "codex-composer-model-button codex-workspace-button",
      attr: { type: "button", title, "aria-label": "\u9009\u62E9\u5DE5\u4F5C\u533A" }
    });
    button.toggleClass("is-missing", !workspacePath);
    button.toggleClass("is-invalid", Boolean(workspacePath && !valid));
    const icon = button.createSpan({ cls: "codex-composer-model-icon" });
    (0, import_obsidian4.setIcon)(icon, workspacePath ? "folder-open" : "folder-plus");
    button.createSpan({ cls: "codex-composer-model-text", text: workspacePath ? workspaceDisplayName(workspacePath) : "\u9009\u5DE5\u4F5C\u533A" });
    const chevron = button.createSpan({ cls: "codex-composer-chevron" });
    (0, import_obsidian4.setIcon)(chevron, "chevron-down");
    button.onclick = (event) => this.openWorkspaceMenu(event, session);
  }
  openAddMenu(event) {
    event.preventDefault();
    const menu = new import_obsidian4.Menu();
    menu.addItem(
      (item) => item.setTitle("\u6DFB\u52A0\u5F53\u524D\u7B14\u8BB0\uFF08\u53EA\u4F5C\u4E0A\u4E0B\u6587\uFF09").setIcon("file-text").onClick(() => this.attachActiveFile())
    );
    menu.addItem(
      (item) => item.setTitle("\u6DFB\u52A0\u6587\u4EF6\uFF08\u53EA\u4F5C\u4E0A\u4E0B\u6587\uFF09").setIcon("folder").onClick(() => this.pickFiles(false))
    );
    menu.addItem(
      (item) => item.setTitle("\u6DFB\u52A0\u56FE\u7247").setIcon("image").onClick(() => this.pickFiles(true))
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("MCP \u72B6\u6001").setIcon("blocks").onClick(() => this.toggleMcpPanel())
    );
    menu.showAtMouseEvent(event);
  }
  openWorkspaceMenu(event, session) {
    event.preventDefault();
    const workspacePath = normalizeWorkspacePath(session.cwd);
    const menu = new import_obsidian4.Menu();
    if (workspacePath) {
      menu.addItem((item) => item.setTitle(workspacePath).setIcon("folder-open").setIsLabel(true));
      menu.addSeparator();
    }
    menu.addItem(
      (item) => item.setTitle(workspacePath ? "\u66F4\u6362\u5DE5\u4F5C\u533A" : "\u9009\u62E9\u5DE5\u4F5C\u533A").setIcon("folder-plus").onClick(() => void this.chooseChatWorkspace(session))
    );
    if (workspacePath) {
      menu.addItem(
        (item) => item.setTitle("\u5728 Finder \u663E\u793A").setIcon("external-link").onClick(() => {
          if (!showItemInFinder(workspacePath)) new import_obsidian4.Notice("\u65E0\u6CD5\u6253\u5F00\u8FD9\u4E2A\u6587\u4EF6\u5939");
        })
      );
      menu.addItem(
        (item) => item.setTitle("\u6E05\u9664\u5DE5\u4F5C\u533A").setIcon("x").onClick(() => void this.clearChatWorkspace(session))
      );
    }
    menu.showAtMouseEvent(event);
  }
  async chooseChatWorkspace(session) {
    if (this.running) {
      new import_obsidian4.Notice("\u5F53\u524D\u4F1A\u8BDD\u8FD0\u884C\u4E2D\uFF0C\u7ED3\u675F\u540E\u518D\u5207\u6362\u5DE5\u4F5C\u533A");
      return false;
    }
    const pickedPath = await pickWorkspaceDirectory(session.cwd);
    const selectedPath = pickedPath === void 0 ? await textInputModal(this.app, "\u9009\u62E9\u5DE5\u4F5C\u533A", "\u6587\u4EF6\u5939\u8DEF\u5F84", session.cwd) : pickedPath;
    if (!selectedPath) return false;
    const workspacePath = normalizeWorkspacePath(selectedPath);
    if (!workspaceDirectoryExists(workspacePath)) {
      new import_obsidian4.Notice("\u8BF7\u9009\u62E9\u4E00\u4E2A\u5B58\u5728\u7684\u6587\u4EF6\u5939\u4F5C\u4E3A\u5DE5\u4F5C\u533A");
      return false;
    }
    const changed = normalizeWorkspacePath(session.cwd) !== workspacePath;
    session.cwd = workspacePath;
    if (changed) {
      delete session.threadId;
      delete session.tokenUsage;
    }
    session.updatedAt = Date.now();
    await this.plugin.saveSettings(true);
    this.renderToolbar();
    this.updateInputPlaceholder();
    this.renderMessages();
    this.prewarmActiveThread();
    new import_obsidian4.Notice(changed ? `\u5DE5\u4F5C\u533A\u5DF2\u8BBE\u4E3A\uFF1A${workspaceDisplayName(workspacePath)}\uFF0C\u4E0B\u4E00\u8F6E\u5C06\u5F00\u542F\u65B0\u7EBF\u7A0B` : `\u5DE5\u4F5C\u533A\u5DF2\u8BBE\u4E3A\uFF1A${workspaceDisplayName(workspacePath)}`);
    return true;
  }
  async clearChatWorkspace(session) {
    if (this.running) {
      new import_obsidian4.Notice("\u5F53\u524D\u4F1A\u8BDD\u8FD0\u884C\u4E2D\uFF0C\u7ED3\u675F\u540E\u518D\u6E05\u9664\u5DE5\u4F5C\u533A");
      return;
    }
    session.cwd = "";
    delete session.threadId;
    delete session.tokenUsage;
    session.updatedAt = Date.now();
    await this.plugin.saveSettings(true);
    this.renderToolbar();
    this.updateInputPlaceholder();
    this.renderMessages();
    new import_obsidian4.Notice("\u5DF2\u6E05\u9664\u5DE5\u4F5C\u533A");
  }
  async clearKnowledgeBasePage(session) {
    if (!this.isKnowledgeBaseSession(session)) return;
    if (this.running || this.plugin.getKnowledgeBaseManager()?.isRunning) {
      new import_obsidian4.Notice("\u77E5\u8BC6\u5E93\u4EFB\u52A1\u8FD0\u884C\u4E2D\uFF0C\u7ED3\u675F\u540E\u518D\u6E05\u7A7A\u9875\u9762");
      return;
    }
    const result = clearKnowledgeBaseVisibleHistory(session);
    this.inputEl.value = "";
    this.skillMenuEl.removeClass("is-visible");
    this.attachments = [];
    this.selectedSkill = null;
    this.resetVirtualWindow();
    await this.plugin.saveSettings(true);
    this.renderTabs();
    this.renderMessages({ forceBottom: true });
    this.renderToolbar();
    this.updateInputPlaceholder();
    new import_obsidian4.Notice(result.hiddenCount ? `\u5DF2\u6E05\u7A7A\u5F53\u524D\u9875\u9762\uFF0C${result.hiddenCount} \u6761\u5386\u53F2\u4ECD\u53EF\u5728 /history \u67E5\u770B` : "\u5DF2\u5F00\u542F\u65B0\u7684\u77E5\u8BC6\u5E93\u4E0A\u4E0B\u6587");
  }
  async openKnowledgeBaseHistory(session) {
    if (!this.isKnowledgeBaseSession(session)) return;
    await this.plugin.saveSettings(true);
    const index = await this.plugin.readKnowledgeBaseHistoryIndex().catch((error) => {
      console.error("Codex knowledge history read failed", error);
      return null;
    });
    const historySession = index?.sessions.find((item) => item.sessionId === session.id);
    const days = historySession?.days ?? [];
    if (!days.length) {
      new import_obsidian4.Notice("\u6CA1\u6709\u77E5\u8BC6\u5E93\u5386\u53F2");
      return;
    }
    new KnowledgeBaseHistoryModal(
      this.app,
      days,
      (date) => this.plugin.readKnowledgeBaseHistoryDay(session.id, date),
      (date) => this.restoreKnowledgeBaseHistoryDate(session, date)
    ).open();
  }
  async restoreKnowledgeBaseHistoryDate(session, date) {
    const messages = await this.plugin.readKnowledgeBaseHistoryDay(session.id, date);
    if (!messages.length) {
      new import_obsidian4.Notice("\u8FD9\u4E00\u5929\u6CA1\u6709\u53EF\u6062\u590D\u7684\u5386\u53F2");
      return;
    }
    session.messages = messages;
    session.historyActiveDate = date;
    delete session.messagesHiddenBefore;
    delete session.threadId;
    delete session.tokenUsage;
    session.updatedAt = Date.now();
    this.resetVirtualWindow();
    await this.plugin.saveSettings(true);
    this.renderMessages({ forceBottom: true });
    this.renderToolbar();
    new import_obsidian4.Notice("\u5DF2\u628A\u8FD9\u4E00\u5929\u6062\u590D\u5230\u9875\u9762\u663E\u793A\uFF1B\u6A21\u578B\u4E0A\u4E0B\u6587\u4F1A\u4ECE\u65B0\u7EBF\u7A0B\u5F00\u59CB");
  }
  async ensureChatWorkspaceSelected(session) {
    const workspacePath = normalizeWorkspacePath(session.cwd);
    if (workspacePath && workspaceDirectoryExists(workspacePath)) return true;
    const picked = await this.chooseChatWorkspace(session);
    if (!picked) new import_obsidian4.Notice("\u666E\u901A\u4F1A\u8BDD\u9700\u8981\u5148\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6\u5939\u4F5C\u4E3A\u5DE5\u4F5C\u533A");
    return picked;
  }
  openKnowledgeCommandMenu(event) {
    event.preventDefault();
    const menu = new import_obsidian4.Menu();
    const commands = [
      { title: "\u63D0\u95EE", icon: "search", text: "/ask " },
      { title: "\u521D\u59CB\u5316", icon: "sparkles", text: "/init " },
      { title: "\u4F53\u68C0", icon: "stethoscope", text: "/check " },
      { title: "\u5904\u7406 outputs", icon: "archive-restore", text: "/outputs " },
      { title: "\u5199\u5468\u62A5", icon: "bar-chart-3", text: "/week " },
      { title: "\u5199\u65E5\u8BB0", icon: "calendar-plus", text: "/journal " },
      { title: "\u5904\u7406 inbox", icon: "inbox", text: "/inbox " },
      { title: "\u7EF4\u62A4\u77E5\u8BC6\u5E93", icon: "library", text: "/maintain " }
    ];
    for (const command of commands) {
      menu.addItem(
        (item) => item.setTitle(command.title).setIcon(command.icon).onClick(() => this.fillKnowledgeBaseCommand(command.text))
      );
    }
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("\u5386\u53F2").setIcon("history").onClick(() => this.openKnowledgeBaseHistory(this.ensureSession()))
    );
    menu.addItem(
      (item) => item.setTitle("\u6E05\u7A7A\u9875\u9762").setIcon("eraser").onClick(() => this.fillKnowledgeBaseCommand("/clear"))
    );
    menu.showAtMouseEvent(event);
  }
  openKnowledgeModelMenu(event) {
    event.preventDefault();
    const menu = new import_obsidian4.Menu();
    const providerModels = this.activeProviderModels();
    const effectiveModel = this.effectiveModel();
    const models = providerModels.length ? ensureModelChoices([], ...providerModels) : ensureModelChoices(this.plugin.lastStatus?.models ?? [], this.selectedModel, this.plugin.settings.defaultModel, DEFAULT_SETTINGS.defaultModel);
    menu.addItem((item) => item.setTitle("\u77E5\u8BC6\u5E93\u6A21\u578B").setIsLabel(true));
    if (!providerModels.length) {
      menu.addItem(
        (item) => item.setTitle("\u81EA\u52A8").setIcon("wand-sparkles").setChecked(!this.selectedModel).onClick(() => {
          this.selectedModel = "";
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    for (const model of models) {
      menu.addItem(
        (item) => item.setTitle(model.displayName || model.model).setIcon("box").setChecked(effectiveModel === model.model).onClick(() => {
          this.selectedModel = model.model;
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    menu.addSeparator();
    menu.addItem((item) => item.setTitle("\u601D\u8003\u5F3A\u5EA6").setIsLabel(true));
    for (const effort of ["low", "medium", "high", "xhigh"]) {
      menu.addItem(
        (item) => item.setTitle(labelFor(effort)).setIcon("brain").setChecked(this.selectedReasoning === effort).onClick(() => {
          this.selectedReasoning = effort;
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    menu.showAtMouseEvent(event);
  }
  fillKnowledgeBaseCommand(command) {
    this.inputEl.value = command;
    this.inputEl.setSelectionRange(command.length, command.length);
    this.focusInput();
  }
  openModelMenu(event) {
    event.preventDefault();
    const menu = new import_obsidian4.Menu();
    const providerModels = this.activeProviderModels();
    const effectiveModel = this.effectiveModel();
    const models = providerModels.length ? ensureModelChoices([], ...providerModels) : ensureModelChoices(this.plugin.lastStatus?.models ?? [], this.selectedModel, this.plugin.settings.defaultModel, DEFAULT_SETTINGS.defaultModel);
    menu.addItem((item) => item.setTitle("\u6A21\u578B").setIsLabel(true));
    if (!providerModels.length) {
      menu.addItem(
        (item) => item.setTitle("\u81EA\u52A8").setIcon("wand-sparkles").setChecked(!this.selectedModel).onClick(() => {
          this.selectedModel = "";
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    if (models.length) {
      for (const model of models) {
        menu.addItem(
          (item) => item.setTitle(model.displayName || model.model).setIcon("box").setChecked(effectiveModel === model.model).onClick(() => {
            this.selectedModel = model.model;
            this.persistComposerDefaults();
            this.renderToolbar();
          })
        );
      }
    } else {
      menu.addItem((item) => item.setTitle(this.selectedModel || "\u81EA\u52A8").setIcon("box").setChecked(true));
    }
    menu.addSeparator();
    menu.addItem((item) => item.setTitle("\u601D\u8003\u5F3A\u5EA6").setIsLabel(true));
    for (const effort of ["low", "medium", "high", "xhigh"]) {
      menu.addItem(
        (item) => item.setTitle(labelFor(effort)).setIcon("brain").setChecked(this.selectedReasoning === effort).onClick(() => {
          this.selectedReasoning = effort;
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    menu.addSeparator();
    menu.addItem((item) => item.setTitle("\u901F\u5EA6").setIsLabel(true));
    for (const tier of ["standard", "fast", "flex"]) {
      menu.addItem(
        (item) => item.setTitle(labelFor(tier)).setIcon("gauge").setChecked(this.selectedServiceTier === tier).onClick(() => {
          this.selectedServiceTier = tier;
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    menu.addSeparator();
    menu.addItem((item) => item.setTitle("\u6A21\u5F0F").setIsLabel(true));
    for (const mode of ["agent", "plan"]) {
      menu.addItem(
        (item) => item.setTitle(labelFor(mode)).setIcon("route").setChecked(this.selectedMode === mode).onClick(() => {
          this.selectedMode = mode;
          this.persistComposerDefaults();
          this.renderToolbar();
        })
      );
    }
    menu.showAtMouseEvent(event);
  }
  currentComposerSummary() {
    return `${shortModelLabel(this.effectiveModel())} ${compactReasoningLabel(this.selectedReasoning)}`;
  }
  currentComposerSummaryTitle() {
    return `\u6A21\u578B\uFF1A${this.effectiveModel() || "\u81EA\u52A8"}
\u601D\u8003\uFF1A${labelFor(this.selectedReasoning)}
\u901F\u5EA6\uFF1A${labelFor(this.selectedServiceTier)}
\u6A21\u5F0F\uFF1A${labelFor(this.selectedMode)}`;
  }
  currentKnowledgeComposerSummaryTitle() {
    return `\u77E5\u8BC6\u5E93\u6A21\u578B\uFF1A${this.effectiveModel() || "\u81EA\u52A8"}
\u601D\u8003\u5F3A\u5EA6\uFF1A${labelFor(this.selectedReasoning)}`;
  }
  persistComposerDefaults() {
    this.plugin.settings.defaultModel = this.selectedModel;
    this.plugin.settings.defaultReasoning = this.selectedReasoning;
    this.plugin.settings.defaultServiceTier = this.selectedServiceTier;
    this.plugin.settings.defaultPermission = this.selectedPermission;
    this.plugin.settings.defaultMode = this.selectedMode;
    void this.plugin.saveSettings(true).catch((error) => {
      console.error("Codex composer defaults save failed", error);
      new import_obsidian4.Notice(`\u8FD0\u884C\u53C2\u6570\u4FDD\u5B58\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
    });
  }
  openSessionMenu(event, session) {
    event.preventDefault();
    if (this.isKnowledgeBaseSession(session)) {
      new import_obsidian4.Notice("\u77E5\u8BC6\u5E93\u7BA1\u7406\u9891\u9053\u662F\u5E38\u9A7B\u9891\u9053\uFF0C\u4E0D\u80FD\u5220\u9664");
      return;
    }
    const menu = new import_obsidian4.Menu();
    menu.addItem(
      (item) => item.setTitle("\u91CD\u547D\u540D\u4F1A\u8BDD").setIcon("pencil").onClick(() => void this.renameSession(session))
    );
    menu.addItem(
      (item) => item.setTitle("\u5220\u9664\u4F1A\u8BDD").setIcon("trash").setWarning(true).onClick(() => void this.deleteSession(session.id))
    );
    menu.showAtMouseEvent(event);
  }
  async renameSession(session) {
    const name = await textInputModal(this.app, "\u91CD\u547D\u540D\u4F1A\u8BDD", "\u540D\u79F0", session.title);
    if (!name) return;
    session.title = name;
    if (session.threadId) await this.plugin.codex?.setThreadName(session.threadId, name).catch(() => void 0);
    await this.plugin.saveSettings();
    this.renderTabs();
  }
  async deleteSession(sessionId) {
    const sessions = this.plugin.settings.sessions;
    const index = sessions.findIndex((session) => session.id === sessionId);
    if (index < 0) return;
    if (this.isKnowledgeBaseSession(sessions[index])) {
      new import_obsidian4.Notice("\u77E5\u8BC6\u5E93\u7BA1\u7406\u9891\u9053\u4E0D\u80FD\u5220\u9664");
      return;
    }
    const wasActive = this.plugin.settings.activeSessionId === sessionId;
    sessions.splice(index, 1);
    if (!sessions.length) {
      this.createSession();
    } else if (wasActive) {
      this.plugin.settings.activeSessionId = sessions[Math.max(0, index - 1)]?.id ?? sessions[0].id;
      this.resetVirtualWindow();
    }
    await this.plugin.saveSettings();
    this.renderTabs();
    this.renderMessages({ forceBottom: true });
    new import_obsidian4.Notice("\u5DF2\u5220\u9664\u4F1A\u8BDD");
  }
  createToolbarControl(container, iconName, label) {
    const control = container.createDiv({ cls: "codex-control", attr: { title: label } });
    const icon = control.createSpan({ cls: "codex-control-icon" });
    (0, import_obsidian4.setIcon)(icon, iconName);
    return control;
  }
  createActionButton(container, iconName, label, title) {
    const button = container.createEl("button", {
      cls: "codex-toolbar-button codex-action-button",
      attr: { type: "button", "aria-label": title, title }
    });
    const icon = button.createSpan({ cls: "codex-action-icon" });
    (0, import_obsidian4.setIcon)(icon, iconName);
    button.createSpan({ cls: "codex-action-label", text: label });
    return button;
  }
  addSelect(container, iconName, values, selected, onChange, label) {
    const control = this.createToolbarControl(container, iconName, label);
    const select = control.createEl("select", { cls: "codex-select", attr: { "aria-label": label, title: label } });
    for (const value of values) select.createEl("option", { text: labelFor(value), value });
    select.value = selected;
    select.onchange = () => onChange(select.value);
  }
  renderAttachments() {
    if (!this.attachmentsEl) return;
    this.attachmentsEl.empty();
    const all = [...this.selectedSkill ? [{ type: "file", name: `/${this.selectedSkill.name}`, path: this.selectedSkill.path }] : [], ...this.attachments];
    this.attachmentsEl.toggleClass("is-empty", all.length === 0);
    for (const item of all) {
      const chip = this.attachmentsEl.createDiv({ cls: "codex-attachment-chip" });
      chip.createSpan({ text: item.name });
      const remove = chip.createEl("button", { text: "\xD7", attr: { type: "button" } });
      remove.onclick = () => {
        if (this.selectedSkill?.path === item.path) this.selectedSkill = null;
        this.attachments = this.attachments.filter((attachment) => attachment.path !== item.path);
        this.renderAttachments();
      };
    }
  }
  onInputChanged() {
    const query = getSlashQuery(this.inputEl.value);
    if (query === null) {
      this.skillMenuEl.removeClass("is-visible");
      return;
    }
    const skills = this.plugin.lastStatus?.skills ?? [];
    if (!skills.length && !this.skillsRequested) {
      this.skillsRequested = true;
      this.skillMenuEl.empty();
      this.skillMenuEl.createDiv({ cls: "codex-skill-empty", text: "\u6B63\u5728\u52A0\u8F7D skills..." });
      this.skillMenuEl.addClass("is-visible");
      void this.plugin.ensureSkillsLoaded().then(() => {
        const activeQuery = getSlashQuery(this.inputEl.value);
        if (activeQuery !== null) this.renderSkillMatches(activeQuery);
      });
      return;
    }
    this.renderSkillMatches(query);
  }
  renderSkillMatches(query) {
    this.skillMenuEl.empty();
    const enabledSkills = filterEnabledSkills(this.plugin.lastStatus?.skills ?? [], this.plugin.settings.workspaceResources.skills);
    const matches = filterSkills(enabledSkills, query);
    for (const skill of matches) {
      const item = this.skillMenuEl.createDiv({ cls: "codex-skill-item" });
      item.createDiv({ cls: "codex-skill-name", text: `/${skill.name}` });
      item.createDiv({ cls: "codex-skill-desc", text: skill.description || skill.path });
      item.onclick = () => {
        this.selectedSkill = skill;
        this.inputEl.value = this.inputEl.value.replace(/(?:^|\s)\/([^\s/]*)$/, "").trimStart();
        this.skillMenuEl.removeClass("is-visible");
        this.renderAttachments();
        this.inputEl.focus();
      };
    }
    if (matches.length === 0) this.skillMenuEl.createDiv({ cls: "codex-skill-empty", text: "\u6CA1\u6709\u5339\u914D\u7684 skill" });
    this.skillMenuEl.addClass("is-visible");
  }
  async sendMessage() {
    const text = this.inputEl.value.trim();
    if (this.editorSummaryRun) this.cancelEditorSummaryRun("\u7528\u6237\u8F93\u5165\u62A2\u5360\u6458\u8981");
    if (!text && !this.attachments.length && !this.selectedSkill) return;
    let session = this.ensureSession();
    const knowledgeSession = this.isKnowledgeBaseSession(session);
    const knowledgeCommand = knowledgeSession ? parseKnowledgeBaseCommand(text, this.attachments.length) : null;
    if (knowledgeSession) {
      if (knowledgeCommand?.intent === "clear") {
        await this.clearKnowledgeBasePage(session);
        return;
      }
      if (knowledgeCommand?.intent === "history") {
        this.inputEl.value = "";
        this.skillMenuEl.removeClass("is-visible");
        await this.openKnowledgeBaseHistory(session);
        return;
      }
    }
    if (this.running) return;
    if (knowledgeSession && knowledgeCommand && knowledgeCommand.intent !== "chat") {
      await this.sendKnowledgeBaseMessage(session, text);
      return;
    }
    try {
      const workspaceReady = knowledgeSession ? true : await this.ensureChatWorkspaceSelected(session);
      if (!workspaceReady) return;
      const status = await this.plugin.ensureOpenCodeConnected();
      this.applyStatus();
      if (!status.connected) throw new Error(status.errors[0] || "Codex \u672A\u8FDE\u63A5");
      session = this.ensureSession();
      const runId = newId("run");
      this.activeRunId = runId;
      this.activeRunSessionId = session.id;
      const turnAttachments = [...this.attachments];
      const userMessage = {
        id: newId("msg"),
        role: "user",
        text: text || "(\u9644\u4EF6)",
        runId,
        attachments: turnAttachments,
        images: turnAttachments.filter((item) => item.type === "image"),
        createdAt: Date.now()
      };
      await this.plugin.externalizeMessageText(userMessage, userMessage.text);
      session.messages.push(userMessage);
      session.updatedAt = Date.now();
      if (session.title === "\u65B0\u4F1A\u8BDD" && text) session.title = text.slice(0, 20);
      this.inputEl.value = "";
      const turnSkill = this.selectedSkill;
      this.attachments = [];
      this.selectedSkill = null;
      this.renderTabs();
      this.renderMessages({ forceBottom: true });
      this.renderToolbar();
      const turnOptions = this.currentTurnOptions(session);
      this.running = true;
      this.turnStartedAt = Date.now();
      this.ensureThinkingMessage(session, "\u8FDE\u63A5\u4E2D", "\u6B63\u5728\u8FDE\u63A5 Codex...");
      this.armTurnWatchdog();
      this.applyStatus();
      if (!session.threadId && this.threadPrewarmPromise && this.threadPrewarmSessionId === session.id) {
        const warmed = await this.threadPrewarmPromise.catch(() => false);
        if (!warmed && !session.threadId) throw new Error("\u65B0\u4F1A\u8BDD\u8FDE\u63A5\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5");
      }
      if (!session.threadId) {
        const started = await this.plugin.codex.startThread(turnOptions);
        session.threadId = started.threadId;
      } else {
        await this.plugin.codex.resumeThread(session.threadId, turnOptions).catch(async () => {
          const started = await this.plugin.codex.startThread(turnOptions);
          session.threadId = started.threadId;
        });
      }
      const input = buildUserInput(text, turnAttachments, turnSkill);
      this.activeTurnId = await this.plugin.codex.startTurn(session.threadId, input, turnOptions);
      this.attachTurnIdToRun(session, this.activeTurnId);
      await this.plugin.saveSettings();
    } catch (error) {
      const diagnostic = this.diagnoseCodexFailure(error);
      this.running = false;
      this.activeTurnId = "";
      this.clearTurnWatchdog();
      this.finishThinkingMessage(session, "\u5931\u8D25");
      this.addMessageToSession(session, {
        role: "system",
        title: diagnostic.title,
        itemType: "error",
        text: diagnostic.text
      });
      this.clearActiveRun();
      new import_obsidian4.Notice(`Codex \u53D1\u9001\u5931\u8D25\uFF1A${diagnostic.title}`);
    } finally {
      this.applyStatus();
    }
  }
  async sendKnowledgeBaseMessage(session, text) {
    const manager = this.plugin.getKnowledgeBaseManager();
    if (!manager) {
      new import_obsidian4.Notice("\u77E5\u8BC6\u5E93\u7BA1\u7406\u672A\u521D\u59CB\u5316");
      return;
    }
    if (!text && !this.attachments.length) return;
    const runId = newId("kb-run");
    this.activeRunId = runId;
    this.activeRunSessionId = session.id;
    const turnAttachments = [...this.attachments];
    const userMessage = {
      id: newId("msg"),
      role: "user",
      text: text || "(\u9644\u4EF6)",
      runId,
      attachments: turnAttachments,
      images: turnAttachments.filter((item) => item.type === "image"),
      createdAt: Date.now()
    };
    await this.plugin.externalizeMessageText(userMessage, userMessage.text);
    const assistantMessage = {
      id: newId("msg"),
      role: "assistant",
      title: "\u77E5\u8BC6\u5E93\u7BA1\u7406",
      itemType: "knowledgeBase",
      status: "running",
      text: "\u6B63\u5728\u8BC6\u522B\u547D\u4EE4\u5E76\u6267\u884C...",
      runId,
      createdAt: Date.now()
    };
    session.messages.push(userMessage, assistantMessage);
    session.title = "\u77E5\u8BC6\u5E93\u7BA1\u7406";
    session.updatedAt = Date.now();
    this.inputEl.value = "";
    this.attachments = [];
    this.selectedSkill = null;
    this.running = true;
    this.renderTabs();
    this.renderMessages({ forceBottom: true });
    this.renderToolbar();
    await this.plugin.saveSettings(true);
    try {
      const result = await manager.handleUserMessage(text, turnAttachments);
      assistantMessage.status = result.status === "success" ? "completed" : "failed";
      assistantMessage.text = result.message;
      assistantMessage.citations = result.citations;
      if (result.status === "failed") {
        this.finishThinkingMessage(session, "\u5931\u8D25");
        this.finishRunningProcessMessages(session, "error");
        this.finishPlanMessage(session);
      }
      this.moveMessageToEnd(session, assistantMessage.id);
      if (result.followUpCommand) {
        this.fillKnowledgeBaseCommand(result.followUpCommand);
      }
      if (result.status === "failed") new import_obsidian4.Notice(`\u77E5\u8BC6\u5E93\u7BA1\u7406\u5931\u8D25\uFF1A${result.message}`);
    } finally {
      this.running = false;
      session.updatedAt = Date.now();
      this.clearTurnWatchdog();
      await this.plugin.externalizeMessageText(assistantMessage, assistantMessage.text);
      this.clearActiveRun();
      await this.plugin.saveSettings(true);
      this.renderMessages({ forceBottom: true });
      this.renderToolbar();
      this.applyStatus();
      void this.refreshKnowledgeDashboard(true);
    }
  }
  async runKnowledgeBaseShortcut(label, runner) {
    const session = this.ensureSession();
    if (!this.isKnowledgeBaseSession(session)) {
      await this.plugin.activateKnowledgeBaseChannel();
    }
    const active = this.ensureSession();
    const userMessage = {
      id: newId("msg"),
      role: "user",
      text: label,
      createdAt: Date.now()
    };
    const assistantMessage = {
      id: newId("msg"),
      role: "assistant",
      title: "\u77E5\u8BC6\u5E93\u7BA1\u7406",
      itemType: "knowledgeBase",
      status: "running",
      text: "\u6B63\u5728\u6267\u884C...",
      createdAt: Date.now()
    };
    active.messages.push(userMessage, assistantMessage);
    active.updatedAt = Date.now();
    this.running = true;
    this.renderTabs();
    this.renderMessages({ forceBottom: true });
    this.renderToolbar();
    await this.plugin.saveSettings(true);
    try {
      const message = await runner();
      assistantMessage.status = "completed";
      assistantMessage.text = message;
      new import_obsidian4.Notice(label);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      assistantMessage.status = "failed";
      assistantMessage.text = message;
      new import_obsidian4.Notice(`\u77E5\u8BC6\u5E93\u7BA1\u7406\u5931\u8D25\uFF1A${message}`);
    } finally {
      this.running = false;
      active.updatedAt = Date.now();
      await this.plugin.externalizeMessageText(assistantMessage, assistantMessage.text);
      await this.plugin.saveSettings(true);
      this.renderMessages({ forceBottom: true });
      this.renderToolbar();
      this.applyStatus();
      void this.refreshKnowledgeDashboard(true);
    }
  }
  async sendEditorActionRequest(request) {
    if (this.editorSummaryRun) this.cancelEditorSummaryRun("\u5199\u4F5C\u64CD\u4F5C\u62A2\u5360\u6587\u7AE0\u7406\u89E3");
    const blockReason = this.editorActionStartBlockReason();
    if (blockReason) throw new Error(blockReason);
    const harnessRunId = newId("editor-action-harness");
    this.editorActionHarnessRunId = harnessRunId;
    const timeoutMs = editorActionTimeoutForMode(this.plugin.settings.editorActions.timeoutMs, request.qualityMode);
    const requestStartedAt = Date.now();
    try {
      this.setArticleUnderstandingPanelState({
        status: request.qualityMode === "fast" ? "idle" : "missing",
        source: request.source,
        mode: request.qualityMode,
        modeLabel: request.modeConfig.label,
        model: request.modeConfig.model,
        usedInLastRun: false
      });
      this.setEditorActionStatus({ status: "connecting", actionLabel: request.action.label, qualityMode: request.qualityMode, modeLabel: request.modeConfig.label, filePath: request.source.filePath, model: request.modeConfig.model, startedAt: requestStartedAt });
      const status = await this.withEditorActionTimeout(this.plugin.ensureOpenCodeConnected(false, { silent: true }), timeoutMs, "\u5199\u4F5C\u64CD\u4F5C\u8FDE\u63A5\u8D85\u65F6");
      this.applyStatus();
      if (!status.connected) throw new Error(status.errors[0] || "Codex \u672A\u8FDE\u63A5");
      const availableModels = status.models.map((model2) => model2.model);
      const model = this.effectiveEditorActionModel(availableModels, request.modeConfig.model);
      const understanding = await this.ensureArticleUnderstanding(request, availableModels, model, timeoutMs);
      const snapshot = understanding ? {
        ...request.snapshot,
        articleUnderstanding: understanding.understanding,
        articleUnderstandingState: this.articleUnderstandingPanelState.status === "reused" ? "reusable" : "fresh"
      } : request.snapshot;
      const contextChars = request.snapshot.beforeContext.length + request.snapshot.afterContext.length;
      const debugMessage = `${request.modeConfig.label} \xB7 \u6A21\u578B ${model} \xB7 \u4E0A\u4E0B\u6587 ${contextChars} \u5B57 \xB7 \u8D85\u65F6 ${Math.round(timeoutMs / 1e3)}s`;
      let result = await this.runEditorActionPromptTurn({
        prompt: buildEditorActionPrompt({ action: request.action, style: request.style, snapshot, qualityMode: request.qualityMode, modeLabel: request.modeConfig.label }),
        actionLabel: request.action.label,
        qualityMode: request.qualityMode,
        modeLabel: request.modeConfig.label,
        model,
        phase: "generating",
        statusMessage: debugMessage,
        timeoutMs,
        startedAt: requestStartedAt
      });
      if (request.qualityMode === "strict") {
        const candidateText = cleanEditorActionOutput(result);
        const candidateValidation = validateEditorActionCandidateText(candidateText);
        if (!candidateValidation.ok) throw new Error(candidateValidation.reason);
        result = await this.runEditorActionPromptTurn({
          prompt: buildEditorActionReviewPrompt({ action: request.action, style: request.style, snapshot, qualityMode: request.qualityMode, modeLabel: request.modeConfig.label, candidateText }),
          actionLabel: request.action.label,
          qualityMode: request.qualityMode,
          modeLabel: request.modeConfig.label,
          model,
          phase: "reviewing",
          statusMessage: `${request.modeConfig.label}\u5BA1\u6821\u4E2D`,
          timeoutMs: Math.max(45e3, Math.min(timeoutMs, 9e4)),
          startedAt: requestStartedAt
        });
      }
      this.prewarmEditorActionThread();
      return result;
    } catch (error) {
      const diagnostic = this.diagnoseCodexFailure(error);
      this.rejectEditorActionRun(new Error(diagnostic.text));
      this.running = false;
      this.activeTurnId = "";
      this.editorActionActiveTimeoutMs = 0;
      this.clearTurnWatchdog();
      this.clearActiveRun();
      this.editorActionCurrentItemIds.clear();
      this.applyStatus();
      this.setArticleUnderstandingPanelState({ ...this.articleUnderstandingPanelState, status: "failed", error: diagnostic.text });
      this.prewarmEditorActionThread();
      throw error;
    } finally {
      if (this.editorActionHarnessRunId === harnessRunId) this.editorActionHarnessRunId = "";
    }
  }
  async ensureArticleUnderstanding(request, availableModels, model, timeoutMs, forceRefresh = false) {
    if (request.qualityMode === "fast") {
      this.setArticleUnderstandingPanelState({
        status: "idle",
        source: request.source,
        mode: request.qualityMode,
        modeLabel: request.modeConfig.label,
        model,
        entry: null,
        usedInLastRun: false
      });
      return null;
    }
    const settings = this.plugin.settings.editorActions;
    const cached = forceRefresh ? { state: "stale", entry: null } : resolveArticleUnderstandingCache(settings.articleUnderstandingCache, request.source, request.qualityMode, model);
    if (!forceRefresh && cached.entry && (cached.state === "fresh" || cached.state === "reusable")) {
      this.setArticleUnderstandingPanelState({
        status: cached.state === "fresh" ? "fresh" : "reused",
        source: request.source,
        mode: request.qualityMode,
        modeLabel: request.modeConfig.label,
        model,
        entry: cached.entry,
        usedInLastRun: true
      });
      return cached.entry;
    }
    this.setArticleUnderstandingPanelState({
      status: "running",
      source: request.source,
      mode: request.qualityMode,
      modeLabel: request.modeConfig.label,
      model,
      entry: null,
      usedInLastRun: false
    });
    const understandingRaw = await this.runEditorActionPromptTurn({
      prompt: buildArticleUnderstandingPrompt(request.source),
      actionLabel: "\u7406\u89E3\u6587\u7AE0",
      qualityMode: request.qualityMode,
      modeLabel: request.modeConfig.label,
      model: this.effectiveEditorActionModel(availableModels, model),
      phase: "understanding",
      statusMessage: `${request.modeConfig.label} \xB7 \u6B63\u5728\u7406\u89E3\u6587\u7AE0`,
      timeoutMs: Math.max(45e3, Math.min(timeoutMs, 9e4)),
      startedAt: Date.now()
    });
    const understanding = cleanEditorActionOutput(understandingRaw);
    if (!understanding.trim()) throw new Error("\u6587\u7AE0\u7406\u89E3\u4E3A\u7A7A");
    const entry = makeArticleUnderstandingCacheEntry(request.source, understanding, request.qualityMode, model);
    settings.articleUnderstandingCache = upsertArticleUnderstandingCache(settings.articleUnderstandingCache, entry);
    await this.plugin.saveSettings();
    this.setArticleUnderstandingPanelState({
      status: "fresh",
      source: request.source,
      mode: request.qualityMode,
      modeLabel: request.modeConfig.label,
      model,
      entry,
      usedInLastRun: true
    });
    return entry;
  }
  async runEditorActionPromptTurn(input) {
    const runId = newId(`editor-${input.phase}-run`);
    this.editorActionCurrentItemIds.clear();
    const waitForResult = new Promise((resolve5, reject) => {
      this.editorActionRun = { runId, text: "", resolve: resolve5, reject };
    });
    const turnOptions = buildEditorActionTurnOptions({
      model: input.model,
      serviceTier: this.selectedServiceTier,
      timeoutMs: input.timeoutMs,
      workspaceResources: { plugins: {}, mcpServers: {}, skills: {} }
    });
    try {
      this.activeRunId = runId;
      this.activeRunSessionId = "";
      this.running = true;
      this.editorActionActiveTimeoutMs = input.timeoutMs;
      this.turnStartedAt = Date.now();
      this.armTurnWatchdog(input.timeoutMs);
      this.setEditorActionStatus({
        status: "generating",
        actionLabel: input.actionLabel,
        phase: input.phase,
        qualityMode: input.qualityMode,
        modeLabel: input.modeLabel,
        model: input.model,
        startedAt: input.startedAt,
        message: input.statusMessage,
        understandingStatus: this.articleUnderstandingPanelState.status
      });
      this.editorActionThreadId = await this.withEditorActionTimeout(this.takeEditorActionThread(turnOptions), input.timeoutMs, "\u5199\u4F5C\u64CD\u4F5C\u542F\u52A8\u8D85\u65F6");
      this.editorActionThreadIds.add(this.editorActionThreadId);
      this.activeTurnId = await this.withEditorActionTimeout(this.plugin.codex.startTurn(this.editorActionThreadId, buildEditorActionUserInput(input.prompt), turnOptions), input.timeoutMs, "\u5199\u4F5C\u64CD\u4F5C\u542F\u52A8\u8D85\u65F6");
      if (this.activeTurnId) this.editorActionTurnIds.add(this.activeTurnId);
      const result = await waitForResult;
      this.releaseEditorActionRunLock(runId);
      return result;
    } catch (error) {
      void waitForResult.catch(() => void 0);
      if (this.editorActionThreadId && this.activeTurnId) {
        void this.plugin.codex?.interruptTurn(this.editorActionThreadId, this.activeTurnId).catch(() => void 0);
      }
      this.rejectEditorActionRun(new Error(this.diagnoseCodexFailure(error, input.model).text));
      this.releaseEditorActionRunLock(runId);
      throw error;
    }
  }
  setArticleUnderstandingPanelState(state) {
    this.articleUnderstandingPanelState = state;
    this.renderEditorActionStatus();
  }
  async refreshArticleUnderstandingPanelSourceState() {
    if (this.articleUnderstandingPanelState.status === "running") return;
    const source = await this.currentArticleUnderstandingSource();
    if (!source) {
      this.setArticleUnderstandingPanelState({ status: "idle", usedInLastRun: false });
      return;
    }
    const settings = this.plugin.settings.editorActions;
    const mode = settings.qualityMode;
    const modeConfig = resolveEditorActionModeConfig(settings, mode);
    const availableModels = this.plugin.lastStatus?.models.map((item) => item.model) ?? [];
    const model = this.effectiveEditorActionModel(availableModels, modeConfig.model);
    const cachedEntry = settings.articleUnderstandingCache[source.filePath] ?? null;
    const cacheResolution = mode === "fast" ? { state: "missing", entry: null } : resolveArticleUnderstandingCache(settings.articleUnderstandingCache, source, mode, model);
    const status = mode === "fast" ? "idle" : cacheResolution.state === "fresh" ? "fresh" : cacheResolution.state === "reusable" ? "reused" : cacheResolution.state === "stale" ? "stale" : "missing";
    this.setArticleUnderstandingPanelState({
      status,
      source,
      mode,
      modeLabel: modeConfig.label,
      model,
      entry: cacheResolution.entry ?? cachedEntry,
      usedInLastRun: false
    });
  }
  async refreshArticleUnderstandingFromPanel() {
    const source = await this.currentArticleUnderstandingSource();
    if (!source) {
      new import_obsidian4.Notice("\u8BF7\u5148\u6253\u5F00\u4E00\u7BC7 Markdown \u7B14\u8BB0");
      return;
    }
    const settings = this.plugin.settings.editorActions;
    const mode = settings.qualityMode === "fast" ? "quality" : settings.qualityMode;
    const modeConfig = resolveEditorActionModeConfig(settings, mode);
    if (this.editorSummaryRun) this.cancelEditorSummaryRun("\u5237\u65B0\u6587\u7AE0\u7406\u89E3");
    const blockReason = this.editorActionStartBlockReason();
    if (blockReason) {
      new import_obsidian4.Notice(blockReason);
      return;
    }
    const harnessRunId = newId("article-understanding-refresh");
    this.editorActionHarnessRunId = harnessRunId;
    try {
      const status = await this.plugin.ensureOpenCodeConnected(false, { silent: true });
      if (!status.connected) throw new Error("Codex \u672A\u8FDE\u63A5");
      const model = this.effectiveEditorActionModel(status.models.map((item) => item.model), modeConfig.model);
      const request = {
        id: newId("editor-action-refresh"),
        action: { id: "rewrite", label: "\u7406\u89E3\u6587\u7AE0", enabled: true, promptTemplate: "" },
        style: { id: "clear", label: "\u6E05\u695A", instruction: "\u8868\u8FBE\u6E05\u695A\u3001\u51C6\u786E\u3001\u81EA\u7136\u3002" },
        snapshot: {
          filePath: source.filePath,
          fileName: source.fileName,
          fromOffset: 0,
          toOffset: 0,
          from: { line: 0, ch: 0 },
          to: { line: 0, ch: 0 },
          selectedText: "",
          beforeContext: "",
          afterContext: ""
        },
        source,
        qualityMode: mode,
        modeConfig,
        prompt: "",
        createdAt: Date.now()
      };
      await this.ensureArticleUnderstanding(request, status.models.map((item) => item.model), model, editorActionTimeoutForMode(settings.timeoutMs, mode), true);
      this.setEditorActionStatus({
        status: "idle",
        qualityMode: mode,
        modeLabel: modeConfig.label,
        filePath: source.filePath,
        model,
        understandingStatus: "fresh",
        usedArticleUnderstanding: true
      });
      new import_obsidian4.Notice("\u6587\u7AE0\u7406\u89E3\u5DF2\u5237\u65B0");
    } catch (error) {
      this.setEditorActionStatus({
        status: "failed",
        actionLabel: "\u7406\u89E3\u6587\u7AE0",
        phase: "understanding",
        qualityMode: mode,
        modeLabel: modeConfig.label,
        filePath: source.filePath,
        model: modeConfig.model,
        understandingStatus: "failed",
        error: error instanceof Error ? error.message : String(error)
      });
      this.setArticleUnderstandingPanelState({
        status: "failed",
        source,
        mode,
        modeLabel: modeConfig.label,
        model: modeConfig.model,
        error: error instanceof Error ? error.message : String(error),
        usedInLastRun: false
      });
      new import_obsidian4.Notice(`\u6587\u7AE0\u7406\u89E3\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (this.editorActionHarnessRunId === harnessRunId) this.editorActionHarnessRunId = "";
    }
  }
  async currentArticleUnderstandingSource() {
    const markdownView = this.plugin.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    if (markdownView?.file) {
      const text2 = markdownView.editor.getValue();
      return {
        filePath: markdownView.file.path,
        fileName: markdownView.file.name,
        text: text2,
        mtime: markdownView.file.stat.mtime,
        size: markdownView.file.stat.size ?? text2.length
      };
    }
    const existing = this.articleUnderstandingPanelState.source;
    if (existing) return existing;
    const file = this.plugin.app.workspace.getActiveFile();
    if (!file) return null;
    const text = await this.plugin.app.vault.cachedRead(file);
    return {
      filePath: file.path,
      fileName: file.name,
      text,
      mtime: file.stat.mtime,
      size: file.stat.size ?? text.length
    };
  }
  async stopTurn() {
    if (this.isEditorActionRunActive()) {
      if (this.editorActionThreadId && this.activeTurnId) {
        await this.plugin.codex?.interruptTurn(this.editorActionThreadId, this.activeTurnId).catch(() => void 0);
      }
      this.rejectEditorActionRun(new Error("\u5199\u4F5C\u64CD\u4F5C\u5DF2\u4E2D\u65AD"));
      this.running = false;
      this.activeTurnId = "";
      this.clearTurnWatchdog();
      this.clearActiveRun();
      this.editorActionCurrentItemIds.clear();
      this.setEditorActionStatus({ status: "canceled", message: "\u5DF2\u4E2D\u65AD" });
      this.applyStatus();
      return;
    }
    const session = this.activeRunSession();
    if (!session.threadId || !this.activeTurnId) return;
    await this.plugin.codex?.interruptTurn(session.threadId, this.activeTurnId).catch(() => void 0);
    if (this.editorActionRun?.runId === this.activeRunId) this.rejectEditorActionRun(new Error("\u5199\u4F5C\u64CD\u4F5C\u5DF2\u4E2D\u65AD"));
    this.running = false;
    this.activeTurnId = "";
    this.editorActionActiveTimeoutMs = 0;
    this.clearTurnWatchdog();
    this.finishThinkingMessage(session, "\u4E2D\u65AD");
    this.finishRunningProcessMessages(session, "interrupted");
    this.clearActiveRun();
    this.applyStatus();
    void this.plugin.saveSettings(true);
  }
  settleStaleMessages(session) {
    if (this.running) return;
    const count = settleStaleRunningMessages(session.messages);
    if (!count) return;
    this.activeThinkingMessageId = "";
    this.activePlanMessageId = "";
    this.activeItemMessages.clear();
    void this.plugin.saveSettings();
  }
  armTurnWatchdog(timeoutMs = CHAT_TURN_WATCHDOG_MS, timeoutText) {
    this.clearTurnWatchdog();
    this.turnWatchdog = window.setTimeout(() => {
      this.turnWatchdog = null;
      if (!this.running) return;
      const timedOutThreadId = this.editorActionThreadId;
      const timedOutTurnId = this.activeTurnId;
      this.running = false;
      if (this.isEditorActionRunActive()) {
        if (timedOutThreadId && timedOutTurnId) {
          void this.plugin.codex?.interruptTurn(timedOutThreadId, timedOutTurnId).catch(() => void 0);
        }
        this.rejectEditorActionRun(new Error("\u5199\u4F5C\u64CD\u4F5C\u54CD\u5E94\u8D85\u65F6"));
        this.setEditorActionStatus({ status: "failed", message: "\u54CD\u5E94\u8D85\u65F6", error: "\u5199\u4F5C\u64CD\u4F5C\u54CD\u5E94\u8D85\u65F6" });
        this.activeTurnId = "";
        this.clearActiveRun();
        this.editorActionCurrentItemIds.clear();
        this.applyStatus();
        this.prewarmEditorActionThread();
        return;
      }
      this.activeTurnId = "";
      const session = this.activeRunSession();
      const knowledgeSession = this.isKnowledgeBaseSession(session);
      if (knowledgeSession && session.threadId && timedOutTurnId) {
        void this.plugin.codex?.interruptTurn(session.threadId, timedOutTurnId).catch(() => void 0);
      }
      this.finishThinkingMessage(session, "\u5931\u8D25");
      this.finishRunningProcessMessages(session, "error");
      this.addMessageToSession(session, {
        role: "system",
        title: "\u54CD\u5E94\u8D85\u65F6",
        itemType: "error",
        text: timeoutText ?? turnWatchdogTimeoutText(timeoutMs)
      });
      this.clearActiveRun();
      this.applyStatus();
      void this.plugin.saveSettings(true);
    }, timeoutMs);
  }
  clearTurnWatchdog() {
    if (!this.turnWatchdog) return;
    window.clearTimeout(this.turnWatchdog);
    this.turnWatchdog = null;
  }
  resolveEditorActionRun(text) {
    const run = this.editorActionRun;
    if (!run) return;
    this.editorActionRun = null;
    run.resolve(text);
  }
  rejectEditorActionRun(error) {
    const run = this.editorActionRun;
    if (!run) return;
    this.editorActionRun = null;
    run.reject(error);
  }
  editorActionStartBlockReason() {
    if (this.editorActionHarnessRunId) return "Codex \u6B63\u5728\u5904\u7406\u4E0A\u4E00\u8F6E\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
    const reason = editorActionStartBlockReason({
      running: this.running,
      activeRunId: this.activeRunId,
      activeTurnId: this.activeTurnId,
      hasEditorActionRun: Boolean(this.editorActionRun)
    });
    if (!reason && this.running) {
      this.running = false;
      this.clearTurnWatchdog();
      this.applyStatus();
    }
    return reason;
  }
  releaseEditorActionRunLock(runId) {
    if (this.activeRunId && this.activeRunId !== runId) return;
    this.running = false;
    this.activeTurnId = "";
    this.clearTurnWatchdog();
    this.clearActiveRun();
    this.editorActionCurrentItemIds.clear();
    this.applyStatus();
  }
  async takeEditorActionThread(turnOptions) {
    if (this.editorActionPrewarmThreadId) {
      const threadId = this.editorActionPrewarmThreadId;
      this.editorActionPrewarmThreadId = "";
      return threadId;
    }
    if (this.editorActionPrewarmPromise) {
      const threadId = await this.editorActionPrewarmPromise.catch(() => null);
      if (threadId) {
        if (this.editorActionPrewarmThreadId === threadId) this.editorActionPrewarmThreadId = "";
        return threadId;
      }
    }
    const started = await this.plugin.codex.startThread(turnOptions);
    this.editorActionThreadIds.add(started.threadId);
    return started.threadId;
  }
  prewarmEditorActionThread() {
    if (this.editorActionPrewarmThreadId || this.editorActionPrewarmPromise || this.running) return;
    this.editorActionPrewarmPromise = this.createEditorActionPrewarmThread().catch(() => null).finally(() => {
      this.editorActionPrewarmPromise = null;
    });
  }
  async createEditorActionPrewarmThread() {
    const status = await this.plugin.ensureOpenCodeConnected(false, { silent: true });
    if (!status.connected || !this.plugin.codex || this.running) return null;
    const modeConfig = resolveEditorActionModeConfig(this.plugin.settings.editorActions);
    const turnOptions = {
      ...buildEditorActionTurnOptions({
        model: this.effectiveEditorActionModel(status.models.map((model) => model.model), modeConfig.model),
        serviceTier: this.selectedServiceTier,
        timeoutMs: this.plugin.settings.editorActions.timeoutMs,
        workspaceResources: { plugins: {}, mcpServers: {}, skills: {} }
      }),
      requestTimeoutMs: 15e3
    };
    const started = await this.plugin.codex.startThread(turnOptions);
    if (this.running || this.editorActionPrewarmThreadId) return null;
    this.editorActionThreadIds.add(started.threadId);
    this.editorActionPrewarmThreadId = started.threadId;
    return started.threadId;
  }
  isEditorSummaryRunActive() {
    return Boolean(this.editorSummaryRun && this.editorSummaryRun.runId === this.activeRunId);
  }
  resolveEditorSummaryRun(text) {
    const run = this.editorSummaryRun;
    if (!run) return;
    this.editorSummaryRun = null;
    run.resolve(text);
  }
  rejectEditorSummaryRun(error) {
    const run = this.editorSummaryRun;
    if (!run) return;
    this.editorSummaryRun = null;
    run.reject(error);
  }
  cancelEditorSummaryRun(reason) {
    const run = this.editorSummaryRun;
    if (!run) return;
    if (run.threadId && this.activeRunId === run.runId && this.activeTurnId) {
      void this.plugin.codex?.interruptTurn(run.threadId, this.activeTurnId).catch(() => void 0);
    }
    this.rejectEditorSummaryRun(new Error(reason));
    this.releaseEditorSummaryRunLock(run.runId);
  }
  armEditorSummaryTimeout(timeoutMs) {
    this.clearEditorSummaryTimeout();
    this.editorSummaryTimeout = window.setTimeout(() => {
      const run = this.editorSummaryRun;
      if (!run) return;
      if (run.threadId && this.activeTurnId) {
        void this.plugin.codex?.interruptTurn(run.threadId, this.activeTurnId).catch(() => void 0);
      }
      this.rejectEditorSummaryRun(new Error("\u6458\u8981\u751F\u6210\u8D85\u65F6"));
      this.releaseEditorSummaryRunLock(run.runId);
    }, timeoutMs);
  }
  clearEditorSummaryTimers() {
    this.clearEditorSummaryTimeout();
  }
  clearEditorSummaryTimeout() {
    if (!this.editorSummaryTimeout) return;
    window.clearTimeout(this.editorSummaryTimeout);
    this.editorSummaryTimeout = null;
  }
  releaseEditorSummaryRunLock(runId) {
    this.clearEditorSummaryTimeout();
    if (runId && this.activeRunId === runId || this.isEditorSummaryRunActive()) {
      this.running = false;
      this.clearActiveRun();
      this.editorActionCurrentItemIds.clear();
      this.applyStatus();
    }
  }
  isEditorActionRunActive() {
    return Boolean(this.editorActionRun && this.editorActionRun.runId === this.activeRunId);
  }
  routeEditorActionNotification(method, params, active, currentThreadId, allowUnscoped = false) {
    return routeEditorActionNotification({
      method,
      params,
      active,
      currentThreadId,
      currentTurnId: this.activeTurnId,
      threadIds: this.editorActionThreadIds,
      turnIds: this.editorActionTurnIds,
      itemIds: this.editorActionItemIds,
      currentItemIds: this.editorActionCurrentItemIds,
      allowUnscoped
    });
  }
  rememberEditorActionNotificationIds(params, currentRun = false) {
    const ids = extractEditorActionNotificationIds(params);
    if (ids.threadId) this.editorActionThreadIds.add(ids.threadId);
    if (ids.turnId) this.editorActionTurnIds.add(ids.turnId);
    if (ids.itemId) this.editorActionItemIds.add(ids.itemId);
    if (currentRun && ids.itemId) this.editorActionCurrentItemIds.add(ids.itemId);
    this.pruneEditorActionHiddenIds();
  }
  pruneEditorActionHiddenIds() {
    pruneSet(this.editorActionThreadIds, 80);
    pruneSet(this.editorActionTurnIds, 120);
    pruneSet(this.editorActionItemIds, 400);
  }
  withEditorActionTimeout(promise, timeoutMs, message) {
    return new Promise((resolve5, reject) => {
      const timer = window.setTimeout(() => reject(new Error(message)), Math.max(1e3, timeoutMs));
      promise.then(
        (value) => {
          window.clearTimeout(timer);
          resolve5(value);
        },
        (error) => {
          window.clearTimeout(timer);
          reject(error);
        }
      );
    });
  }
  currentTurnOptions(session) {
    const cwd = session && !this.isKnowledgeBaseSession(session) ? normalizeWorkspacePath(session.cwd) : "";
    return {
      ...cwd ? { cwd } : {},
      model: this.effectiveModel(),
      reasoning: this.selectedReasoning,
      serviceTier: this.selectedServiceTier,
      permission: this.selectedPermission,
      mode: this.selectedMode,
      mcpEnabled: this.plugin.settings.mcpEnabled,
      workspaceResources: this.plugin.settings.workspaceResources
    };
  }
  activeProviderModels() {
    if (this.plugin.settings.providerMode !== "custom-api") return [];
    const provider = getActiveApiProvider(this.plugin.settings);
    return provider ? getApiProviderModels(provider) : [];
  }
  resolvedKnowledgeBackend() {
    const configured = this.plugin.settings.knowledgeBase.backend;
    return configured === "default" ? this.plugin.settings.agentBackend : configured;
  }
  effectiveModel() {
    const providerModels = this.activeProviderModels();
    if (providerModels.length) {
      return providerModels.includes(this.selectedModel) ? this.selectedModel : providerModels[0];
    }
    return this.selectedModel || this.plugin.settings.defaultModel || "";
  }
  effectiveEditorActionModel(availableModels = [], configuredModel = this.plugin.settings.editorActions.model) {
    const providerModels = this.activeProviderModels();
    return resolveEditorActionModel({
      configuredModel,
      availableModels: providerModels.length ? providerModels : availableModels,
      fallbackModel: this.effectiveModel()
    });
  }
  prewarmActiveThread() {
    const session = this.ensureSession();
    if (this.isKnowledgeBaseSession(session)) return;
    if (session.threadId || this.running) return;
    if (!normalizeWorkspacePath(session.cwd) || !workspaceDirectoryExists(session.cwd)) return;
    if (this.threadPrewarmPromise && this.threadPrewarmSessionId === session.id) return;
    this.threadPrewarmSessionId = session.id;
    this.threadPrewarmPromise = this.startThreadForSession(session).catch(() => false).finally(() => {
      if (this.threadPrewarmSessionId === session.id) {
        this.threadPrewarmPromise = null;
        this.threadPrewarmSessionId = "";
      }
    });
  }
  async startThreadForSession(session) {
    if (session.threadId) return true;
    if (!normalizeWorkspacePath(session.cwd) || !workspaceDirectoryExists(session.cwd)) return false;
    const status = await this.plugin.ensureOpenCodeConnected();
    if (!status.connected || !this.plugin.codex || session.threadId) return Boolean(session.threadId);
    const started = await this.plugin.codex.startThread(this.currentTurnOptions(session));
    session.threadId = started.threadId;
    await this.plugin.saveSettings();
    return true;
  }
  appendItemDelta(session, itemId, role, delta, itemType, title) {
    if (!delta) return;
    if (this.editorActionRun?.runId === this.activeRunId && role === "assistant" && itemType === "assistant") {
      this.editorActionRun.text += delta;
    }
    let messageId = this.activeItemMessages.get(itemId);
    let message = messageId ? session.messages.find((item) => item.id === messageId) : null;
    if (!message) {
      message = {
        id: itemId || newId("msg"),
        role,
        text: "",
        itemType,
        title,
        runId: this.activeRunId || void 0,
        turnId: this.activeTurnId || void 0,
        createdAt: Date.now()
      };
      session.messages.push(message);
      this.activeItemMessages.set(itemId, message.id);
    }
    message.text += delta;
    session.updatedAt = Date.now();
    this.renderMessagesIfActive(session);
  }
  appendProcessDelta(session, itemId, itemType, delta, payload) {
    if (!delta) return;
    let messageId = this.activeItemMessages.get(itemId);
    let message = messageId ? session.messages.find((item) => item.id === messageId) : null;
    const summaryPayload = { ...payload, status: payload?.status ?? "running" };
    const summary = summarizeProcessEvent(itemType, summaryPayload, this.plugin.getVaultPath(), session.cwd || this.plugin.getVaultPath());
    if (!message) {
      message = {
        id: itemId || newId("process"),
        role: roleForProcessItem(itemType),
        text: "",
        itemType,
        title: summary.title,
        details: summary.detail,
        files: summary.files,
        processKind: summary.kind,
        runId: this.activeRunId || void 0,
        turnId: this.activeTurnId || void 0,
        status: "running",
        createdAt: Date.now()
      };
      session.messages.push(message);
      this.activeItemMessages.set(itemId, message.id);
    }
    if (itemType === "reasoning" || !message.title || message.title === "\u547D\u4EE4\u8F93\u51FA") message.title = summary.title;
    if (itemType === "reasoning") {
      if (summary.detail) message.details = summary.detail;
    } else if (!message.details && summary.detail) {
      message.details = summary.detail;
    }
    message.processKind = summary.kind;
    message.files = mergeProcessFiles(message.files, summary.files);
    message.status = "running";
    message.text += delta;
    session.updatedAt = Date.now();
    this.renderMessagesIfActive(session);
  }
  ensureThinkingMessage(session, title, text) {
    if (this.activeThinkingMessageId) {
      const existing = session.messages.find((message) => message.id === this.activeThinkingMessageId);
      if (existing) {
        existing.title = title;
        existing.text = text;
        existing.status = "running";
        this.renderMessagesIfActive(session);
        return;
      }
    }
    const id = newId("thinking");
    this.activeThinkingMessageId = id;
    session.messages.push({
      id,
      role: "assistant",
      title,
      text,
      itemType: "thinking",
      runId: this.activeRunId || void 0,
      turnId: this.activeTurnId || void 0,
      status: "running",
      createdAt: Date.now()
    });
    this.renderMessagesIfActive(session);
  }
  markThinkingAsStreaming(session) {
    const message = session.messages.find((item) => item.id === this.activeThinkingMessageId);
    if (!message || message.status !== "running") return;
    message.text = "\u6B63\u5728\u751F\u6210\u56DE\u590D...";
    this.renderMessagesIfActive(session);
  }
  finishThinkingMessage(session, _status) {
    const messageIndex = session.messages.findIndex((item) => item.id === this.activeThinkingMessageId);
    const message = messageIndex >= 0 ? session.messages[messageIndex] : null;
    if (!message) return;
    session.messages.splice(messageIndex, 1);
    session.updatedAt = Date.now();
    this.activeThinkingMessageId = "";
    this.renderMessagesIfActive(session);
  }
  finishPlanMessage(session) {
    const message = session.messages.find((item) => item.id === this.activePlanMessageId);
    if (message) message.status = "completed";
    this.activePlanMessageId = "";
  }
  finishRunningProcessMessages(session, status) {
    for (const message of session.messages) {
      if (isProcessItemType3(message.itemType) && message.status === "running") {
        message.status = status;
        if (message.text) void this.plugin.externalizeMessageText(message, message.text);
        if (message.itemType === "reasoning") this.refreshProcessSummary(message, status, session);
      }
    }
    this.renderMessagesIfActive(session);
  }
  renderPlanUpdate(session, params) {
    const lines = [];
    if (params?.explanation) lines.push(params.explanation, "");
    for (const item of params?.plan ?? []) {
      const mark = item.status === "completed" ? "x" : " ";
      const suffix = item.status === "inProgress" ? " (\u8FDB\u884C\u4E2D)" : "";
      lines.push(`- [${mark}] ${item.step}${suffix}`);
    }
    if (!lines.length) return;
    let message = this.activePlanMessageId ? session.messages.find((item) => item.id === this.activePlanMessageId) : null;
    if (!message) {
      message = {
        id: newId("plan"),
        role: "assistant",
        itemType: "plan",
        title: "\u66F4\u65B0\u8BA1\u5212",
        text: "",
        processKind: "plan",
        runId: this.activeRunId || void 0,
        turnId: this.activeTurnId || void 0,
        status: "running",
        createdAt: Date.now()
      };
      this.activePlanMessageId = message.id;
      session.messages.push(message);
    }
    message.text = lines.join("\n");
    session.updatedAt = Date.now();
    this.renderMessagesIfActive(session);
  }
  renderStartedItem(session, item) {
    if (!isProcessItemType3(item?.type)) return;
    if (item.type === "reasoning" && !rawTextForProcessItem(item)) return;
    const status = item.status || "running";
    void this.upsertProcessItem(session, item.id || newId("process"), item.type, rawTextForProcessItem(item), status, { ...item, status });
  }
  async renderCompletedItem(session, item) {
    if (!item?.type) return;
    if (item.type === "agentMessage") return;
    if (item.type === "reasoning" || item.type === "plan") {
      const text = rawTextForProcessItem(item);
      if (text) {
        await this.upsertProcessItem(session, item.id, item.type, text, item.status || "completed", { ...item, status: item.status || "completed" });
      } else {
        this.finishProcessItem(session, item.id, item.status || "completed");
      }
      return;
    }
    if (item.type === "commandExecution") {
      await this.upsertProcessItem(session, item.id, "commandExecution", `${item.command}

${item.aggregatedOutput ?? ""}`.trim(), item.status || "completed", item);
    } else if (item.type === "fileChange") {
      const changes = Array.isArray(item.changes) ? item.changes : [];
      const diffSummary = buildDiffSummary(changes);
      const text = serializeFileChanges(changes);
      await this.upsertProcessItem(session, item.id, "fileChange", text || item.status, item.status || "completed", item, diffSummary);
    } else if (item.type === "mcpToolCall") {
      await this.upsertProcessItem(session, item.id, "mcpToolCall", JSON.stringify(item.result ?? item.error ?? item.arguments, null, 2), item.status || "completed", item);
    } else if (item.type === "dynamicToolCall") {
      await this.upsertProcessItem(session, item.id, "dynamicToolCall", JSON.stringify(item.contentItems ?? item.result ?? item.arguments, null, 2), item.status || "completed", item);
    } else if (item.type === "collabAgentToolCall") {
      await this.upsertProcessItem(session, item.id, "collabAgentToolCall", JSON.stringify(item.result ?? item.arguments ?? item, null, 2), item.status || "completed", item);
    } else if (item.type === "imageView") {
      this.addMessageToSession(session, {
        role: "assistant",
        title: "\u56FE\u7247",
        itemType: "image",
        text: item.path,
        images: [{ type: "image", name: basename3(item.path), path: item.path }],
        createdAt: Date.now()
      });
    } else if (item.type === "contextCompaction") {
      this.addContextCompactionMessage(session);
    }
  }
  upsertCompletedItem(id, role, itemType, title, text, status) {
    const session = this.ensureSession();
    const existingId = this.activeItemMessages.get(id);
    const existing = existingId ? session.messages.find((item) => item.id === existingId) : null;
    if (existing) {
      existing.text = text || existing.text;
      existing.status = status;
    } else {
      session.messages.push({ id, role, itemType, title, text, status, createdAt: Date.now() });
    }
    this.renderMessages();
  }
  async upsertProcessItem(session, id, itemType, text, status, payload, diffSummary) {
    const summary = summarizeProcessEvent(itemType, { ...payload, status }, this.plugin.getVaultPath(), session.cwd || this.plugin.getVaultPath());
    const existingId = this.activeItemMessages.get(id);
    const existing = existingId ? session.messages.find((item) => item.id === existingId) : null;
    if (existing) {
      existing.role = roleForProcessItem(itemType);
      existing.itemType = itemType;
      existing.title = summary.title;
      existing.details = diffSummary ? diffSummaryLabel(diffSummary) : summary.detail || existing.details;
      existing.diffSummary = diffSummary;
      existing.files = mergeProcessFiles(existing.files, summary.files);
      existing.processKind = summary.kind;
      if (text) await this.plugin.externalizeMessageText(existing, text);
      existing.status = status;
      existing.turnId = this.activeTurnId || existing.turnId;
      existing.runId = this.activeRunId || existing.runId;
    } else {
      const message = {
        id,
        role: roleForProcessItem(itemType),
        itemType,
        title: summary.title,
        details: diffSummary ? diffSummaryLabel(diffSummary) : summary.detail,
        diffSummary,
        files: summary.files,
        processKind: summary.kind,
        text,
        runId: this.activeRunId || void 0,
        turnId: this.activeTurnId || void 0,
        status,
        createdAt: Date.now()
      };
      if (text) await this.plugin.externalizeMessageText(message, text);
      session.messages.push(message);
      this.activeItemMessages.set(id, id);
    }
    session.updatedAt = Date.now();
    this.renderMessagesIfActive(session);
  }
  finishProcessItem(session, id, status) {
    const existingId = this.activeItemMessages.get(id);
    const existing = existingId ? session.messages.find((item) => item.id === existingId) : session.messages.find((item) => item.id === id);
    if (!existing) return;
    existing.status = status;
    if (existing.itemType === "reasoning") this.refreshProcessSummary(existing, status, session);
    session.updatedAt = Date.now();
    this.renderMessagesIfActive(session);
  }
  refreshProcessSummary(message, status, session) {
    if (!message.itemType) return;
    const summary = summarizeProcessEvent(message.itemType, { text: message.text, status }, this.plugin.getVaultPath(), session.cwd || this.plugin.getVaultPath());
    message.title = summary.title;
    if (summary.detail) message.details = summary.detail;
    message.processKind = summary.kind;
  }
  addMessage(message) {
    this.addMessageToSession(this.ensureSession(), message);
  }
  addMessageToSession(session, message) {
    session.messages.push({
      id: message.id ?? newId("msg"),
      createdAt: message.createdAt ?? Date.now(),
      role: message.role,
      text: message.text,
      previewText: message.previewText,
      rawRef: message.rawRef,
      rawSize: message.rawSize,
      rawLines: message.rawLines,
      rawTruncatedForPreview: message.rawTruncatedForPreview,
      phase: message.phase,
      itemType: message.itemType,
      runId: message.runId ?? (this.activeRunId || void 0),
      turnId: message.turnId ?? (this.activeTurnId || void 0),
      processKind: message.processKind,
      title: message.title,
      status: message.status,
      details: message.details,
      diffSummary: message.diffSummary,
      attachments: message.attachments,
      files: message.files,
      images: message.images
    });
    session.updatedAt = Date.now();
    this.renderMessagesIfActive(session);
    void this.plugin.saveSettings();
  }
  moveMessageToEnd(session, messageId) {
    const index = session.messages.findIndex((message2) => message2.id === messageId);
    if (index < 0 || index === session.messages.length - 1) return;
    const [message] = session.messages.splice(index, 1);
    session.messages.push(message);
  }
  updateContext(tokenUsage, persist) {
    this.updateContextForSession(this.ensureSession(), tokenUsage, persist);
  }
  updateContextForSession(session, tokenUsage, persist) {
    if (persist) {
      session.tokenUsage = tokenUsage;
      session.updatedAt = Date.now();
      void this.plugin.saveSettings();
    }
    if (session.id !== this.plugin.settings.activeSessionId) return;
    if (!this.contextEl) return;
    this.contextEl.toggleClass("is-hidden", !this.plugin.settings.showContext);
    if (!this.plugin.settings.showContext) return;
    const view = contextUsageView(tokenUsage);
    this.contextValueEl.setText(view.label);
    this.contextEl.style.setProperty("--codex-context-angle", `${view.angle}deg`);
    this.contextEl.setAttr("aria-label", view.title);
    this.contextEl.setAttr("title", view.title);
    this.contextEl.toggleClass("is-empty", view.percent === null);
    this.contextEl.toggleClass("is-warning", (view.percent ?? 0) >= 80);
  }
  async toggleMcpPanel() {
    const willOpen = !this.mcpPanelEl.hasClass("is-visible");
    this.mcpPanelEl.toggleClass("is-visible", willOpen);
    if (!willOpen) return;
    this.mcpPanelEl.empty();
    this.mcpPanelEl.createDiv({ cls: "codex-mcp-title", text: "MCP \u72B6\u6001" });
    this.mcpPanelEl.createDiv({ cls: "codex-mcp-empty", text: "\u6B63\u5728\u8BFB\u53D6 MCP \u72B6\u6001..." });
    const status = await this.plugin.ensureOpenCodeConnected();
    if (!status.connected || !this.plugin.codex) {
      this.renderMcpPanel([], "Codex \u672A\u8FDE\u63A5");
      return;
    }
    const result = await this.plugin.codex.refreshMcpStatus();
    if (this.plugin.lastStatus) this.plugin.lastStatus.mcpServers = result.servers;
    this.renderMcpPanel(result.servers, result.error);
  }
  renderMcpPanel(servers, error) {
    this.mcpPanelEl.empty();
    this.mcpPanelEl.createDiv({ cls: "codex-mcp-title", text: "MCP \u72B6\u6001" });
    if (error) {
      this.mcpPanelEl.createDiv({ cls: "codex-mcp-error", text: `\u8BFB\u53D6\u5931\u8D25\uFF1A${error}` });
      const retry = this.mcpPanelEl.createEl("button", { cls: "codex-mcp-retry", text: "\u91CD\u65B0\u8BFB\u53D6 MCP", attr: { type: "button" } });
      retry.onclick = () => {
        this.mcpPanelEl.removeClass("is-visible");
        void this.toggleMcpPanel();
      };
    }
    if (!this.plugin.settings.mcpEnabled && servers.length) {
      this.mcpPanelEl.createDiv({ cls: "codex-mcp-empty", text: "\u5DF2\u8BFB\u53D6\u5230 MCP \u670D\u52A1\u3002\u804A\u5929 MCP \u603B\u5F00\u5173\u5173\u95ED\uFF0C\u4E0B\u4E00\u8F6E\u5BF9\u8BDD\u6682\u4E0D\u8C03\u7528 MCP\u3002" });
    }
    if (!servers.length) {
      if (!error) this.mcpPanelEl.createDiv({ cls: "codex-mcp-empty", text: "\u6CA1\u6709\u8BFB\u53D6\u5230 MCP \u670D\u52A1\u5668\u3002" });
      return;
    }
    for (const server of servers) this.renderMcpServer(server);
  }
  renderMcpServer(server) {
    const row = this.mcpPanelEl.createDiv({ cls: "codex-mcp-row" });
    row.createDiv({ cls: "codex-mcp-name", text: server.name });
    row.createDiv({ cls: "codex-mcp-meta", text: `${Object.keys(server.tools ?? {}).length} \u4E2A\u5DE5\u5177 \xB7 ${server.authStatus ?? "unknown"}` });
    if (server.authStatus === "notLoggedIn") {
      const login = row.createEl("button", { cls: "codex-toolbar-button", text: "\u767B\u5F55", attr: { type: "button" } });
      login.onclick = async () => {
        try {
          const url = await this.plugin.codex?.startMcpOAuth(server.name);
          if (url) window.open(url);
          else new import_obsidian4.Notice("\u6CA1\u6709\u62FF\u5230 MCP \u767B\u5F55\u94FE\u63A5");
        } catch (error) {
          new import_obsidian4.Notice(`MCP \u767B\u5F55\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
        }
      };
    }
  }
  activeRunSession() {
    const active = this.activeRunSessionId ? this.plugin.settings.sessions.find((session) => session.id === this.activeRunSessionId) : null;
    return active ?? this.ensureSession();
  }
  sessionForThread(threadId) {
    if (!threadId) return null;
    return this.plugin.settings.sessions.find((session) => session.threadId === threadId) ?? null;
  }
  addContextCompactionMessage(session) {
    const last = session.messages[session.messages.length - 1];
    if (last?.itemType === "contextCompaction" && Date.now() - last.createdAt < 1e4) return;
    this.addMessageToSession(session, { role: "system", title: "\u4E0A\u4E0B\u6587\u538B\u7F29", itemType: "contextCompaction", text: "Codex \u5DF2\u81EA\u52A8\u538B\u7F29\u4E0A\u4E0B\u6587\u3002", createdAt: Date.now() });
  }
  clearActiveRun() {
    this.activeRunId = "";
    this.activeRunSessionId = "";
    this.activeTurnId = "";
    this.editorActionActiveTimeoutMs = 0;
    this.activeThinkingMessageId = "";
    this.activePlanMessageId = "";
    this.activeItemMessages.clear();
  }
  attachTurnIdToRun(session, turnId) {
    if (!turnId || !this.activeRunId) return;
    for (const message of session.messages) {
      if (message.runId === this.activeRunId) message.turnId = turnId;
    }
  }
  renderMessagesIfActive(session) {
    if (session.id === this.plugin.settings.activeSessionId) this.scheduleRenderMessages();
  }
  scheduleRenderMessages(options = {}) {
    this.pendingRenderForceBottom = this.pendingRenderForceBottom || Boolean(options.forceBottom);
    if (options.fromScroll && !this.pendingRenderForceBottom) {
      this.pendingRenderFromScroll = true;
    } else if (!options.fromScroll) {
      this.pendingRenderFromScroll = false;
    }
    if (this.renderScheduled) return;
    this.renderScheduled = true;
    window.requestAnimationFrame(() => {
      const forceBottom = this.pendingRenderForceBottom;
      const fromScroll = this.pendingRenderFromScroll && !forceBottom;
      this.pendingRenderForceBottom = false;
      this.pendingRenderFromScroll = false;
      this.renderScheduled = false;
      this.renderMessages({ forceBottom, fromScroll });
    });
  }
  scheduleMeasureVirtualRows(forceBottom = this.isMessagesNearBottom()) {
    this.pendingMeasureForceBottom = this.pendingMeasureForceBottom || forceBottom;
    if (this.measureScheduled) return;
    this.measureScheduled = true;
    window.requestAnimationFrame(() => {
      const shouldForceBottom = this.pendingMeasureForceBottom;
      this.pendingMeasureForceBottom = false;
      this.measureScheduled = false;
      this.measureVisibleVirtualRows(shouldForceBottom);
    });
  }
  measureVisibleVirtualRows(forceBottom = false) {
    if (!this.virtualListEl) return false;
    let changed = false;
    for (const rowEl of Array.from(this.virtualListEl.querySelectorAll(".codex-virtual-row"))) {
      const id = rowEl.dataset.rowId;
      if (!id) continue;
      const height = Math.ceil(rowEl.getBoundingClientRect().height);
      if (height <= 0) continue;
      const previous = this.virtualRowHeights.get(id);
      if (previous === void 0 || Math.abs(previous - height) > 1) {
        this.virtualRowHeights.set(id, height);
        changed = true;
      }
    }
    if (changed) this.scheduleRenderMessages({ forceBottom, fromScroll: !forceBottom });
    return changed;
  }
  isMessagesNearBottom() {
    if (!this.messagesEl) return true;
    return isNearVirtualBottom(this.messagesEl.scrollTop, this.messagesEl.clientHeight, this.messagesEl.scrollHeight);
  }
  resetVirtualWindow() {
    this.virtualSessionId = "";
    this.virtualRowHeights.clear();
    if (this.messagesEl) this.messagesEl.scrollTop = 0;
  }
  pruneVirtualHeights(rowIds) {
    const active = new Set(rowIds);
    for (const id of Array.from(this.virtualRowHeights.keys())) {
      if (!active.has(id)) this.virtualRowHeights.delete(id);
    }
  }
  rememberOpenState(store, id, open) {
    store.set(id, open);
  }
  ensureSession() {
    ensureKnowledgeBaseSession(this.plugin.settings, this.plugin.getVaultPath());
    const activeId = this.plugin.settings.activeSessionId;
    const active = this.plugin.settings.sessions.find((session) => session.id === activeId);
    if (active) return active;
    return this.createSession();
  }
  isKnowledgeBaseSession(session) {
    return isKnowledgeBaseSession(session, this.plugin.settings.knowledgeBase.sessionId);
  }
  createSession(title = "\u65B0\u4F1A\u8BDD") {
    const session = {
      id: newId("session"),
      title,
      cwd: "",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.plugin.settings.sessions.push(session);
    this.plugin.settings.activeSessionId = session.id;
    return session;
  }
  attachActiveFile() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new import_obsidian4.Notice("\u6CA1\u6709\u5F53\u524D\u7B14\u8BB0");
      return;
    }
    this.attachments.push({
      type: isImagePath(file.path) ? "image" : "file",
      name: file.name,
      path: absoluteVaultPath(this.plugin.getVaultPath(), file.path)
    });
    this.renderAttachments();
  }
  pickFiles(imagesOnly) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    if (imagesOnly) input.accept = "image/*";
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      for (const file of files) {
        const filePath = file.path;
        if (!filePath) continue;
        this.attachments.push({
          type: isImagePath(filePath) ? "image" : "file",
          name: file.name,
          path: filePath
        });
      }
      this.renderAttachments();
    };
    input.click();
  }
  pickKnowledgeBaseFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.docx,.md,.markdown,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain";
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      const attachments = [];
      for (const file of files) {
        const filePath = file.path;
        if (!filePath) continue;
        attachments.push({
          type: "file",
          name: file.name,
          path: filePath
        });
      }
      void this.runKnowledgeBaseShortcut("\u6587\u4EF6\u6536\u85CF", async () => {
        const paths = await this.plugin.getKnowledgeBaseManager()?.captureExternalFiles(attachments);
        return paths?.length ? `\u5DF2\u6536\u85CF\u6587\u4EF6\uFF1A
${paths.map((item) => `- ${item}`).join("\n")}` : "\u672A\u9009\u62E9\u6587\u4EF6\u3002";
      });
    };
    input.click();
  }
  handleDroppedFiles(event) {
    const files = Array.from(event.dataTransfer?.files ?? []);
    for (const file of files) {
      const filePath = file.path;
      if (!filePath) continue;
      this.attachments.push({
        type: isImagePath(filePath) ? "image" : "file",
        name: file.name,
        path: filePath
      });
    }
    this.renderAttachments();
  }
  async handlePastedFiles(event) {
    const files = extractClipboardImageFiles(event.clipboardData);
    if (!files.length) return;
    event.preventDefault();
    try {
      const pasted = await saveClipboardImageAttachments(files, { vaultPath: this.plugin.getVaultPath(), pluginDir: this.plugin.getPluginDataDirName() });
      this.attachments.push(...pasted);
      this.renderAttachments();
    } catch (error) {
      console.error("Codex paste image failed", error);
      new import_obsidian4.Notice("\u7C98\u8D34\u56FE\u7247\u5931\u8D25");
    }
  }
};
var KnowledgeBaseHistoryModal = class extends import_obsidian4.Modal {
  constructor(app, days, loadDay, restoreDay) {
    super(app);
    this.days = days;
    this.loadDay = loadDay;
    this.restoreDay = restoreDay;
    this.activeDate = days[0]?.date ?? "";
  }
  activeDate = "";
  activeFilter = "all";
  messages = [];
  dateListEl = null;
  activeDateEl = null;
  filterEl = null;
  listEl = null;
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("codex-kb-history-modal");
    const header = contentEl.createDiv({ cls: "codex-kb-history-header" });
    header.createEl("h2", { text: "\u5386\u53F2" });
    header.createDiv({ cls: "codex-kb-history-summary", text: `${this.days.length} \u5929\u8BB0\u5F55 \xB7 \u6309\u5929\u805A\u5408` });
    const layout = contentEl.createDiv({ cls: "codex-kb-history-layout" });
    this.dateListEl = layout.createDiv({ cls: "codex-kb-history-days" });
    const main = layout.createDiv({ cls: "codex-kb-history-main" });
    this.filterEl = main.createDiv({ cls: "codex-kb-history-actions" });
    this.activeDateEl = main.createDiv({ cls: "codex-kb-history-current-day" });
    this.listEl = main.createDiv({ cls: "codex-kb-history-list" });
    this.renderDates();
    this.renderFilters();
    void this.selectDate(this.activeDate);
  }
  onClose() {
    this.contentEl.empty();
    this.contentEl.removeClass("codex-kb-history-modal");
  }
  renderDates() {
    if (!this.dateListEl) return;
    this.dateListEl.empty();
    for (const day of this.days) {
      const button = this.dateListEl.createEl("button", {
        cls: `codex-kb-history-day ${day.date === this.activeDate ? "is-active" : ""}`.trim(),
        attr: { type: "button" }
      });
      button.createSpan({ text: day.date });
      button.createEl("small", { text: `${day.messageCount} \u6761` });
      button.onclick = () => void this.selectDate(day.date);
    }
  }
  renderFilters() {
    if (!this.filterEl) return;
    this.filterEl.empty();
    const labels = {
      all: "\u5168\u90E8",
      user: "\u6211",
      assistant: "\u56DE\u590D",
      process: "\u8FC7\u7A0B",
      failed: "\u5931\u8D25"
    };
    for (const filter of Object.keys(labels)) {
      const button = this.filterEl.createEl("button", {
        cls: `codex-resource-tab ${filter === this.activeFilter ? "is-active" : ""}`.trim(),
        text: labels[filter],
        attr: { type: "button" }
      });
      button.onclick = () => {
        this.activeFilter = filter;
        this.renderFilters();
        this.renderMessages();
      };
    }
    const restoreButton = this.filterEl.createEl("button", { cls: "mod-cta", text: "\u6062\u590D\u663E\u793A", attr: { type: "button", title: "\u53EA\u6062\u590D\u53EF\u89C1\u5185\u5BB9\uFF0C\u4E0D\u6062\u590D\u65E7\u6A21\u578B\u4E0A\u4E0B\u6587" } });
    restoreButton.onclick = async () => {
      await this.restoreDay(this.activeDate);
      this.close();
    };
  }
  async selectDate(date) {
    if (!date) return;
    this.activeDate = date;
    this.renderDates();
    if (this.listEl) {
      this.listEl.empty();
      this.listEl.createDiv({ cls: "codex-kb-history-more", text: "\u8BFB\u53D6\u4E2D..." });
    }
    try {
      this.messages = await this.loadDay(date);
    } catch (error) {
      console.error("Codex knowledge history day read failed", error);
      this.messages = [];
      if (this.listEl) {
        this.listEl.empty();
        this.listEl.createDiv({ cls: "codex-kb-history-more", text: "\u8BFB\u53D6\u5931\u8D25" });
      }
      return;
    }
    this.renderMessages();
  }
  renderMessages() {
    if (!this.listEl) return;
    this.listEl.empty();
    const filtered = this.messages.filter((message) => historyMessageMatchesFilter(message, this.activeFilter));
    if (this.activeDateEl) {
      this.activeDateEl.setText(`${this.activeDate} \xB7 ${filtered.length}/${this.messages.length} \u6761`);
    }
    if (!filtered.length) {
      this.listEl.createDiv({ cls: "codex-kb-history-more", text: "\u8FD9\u4E00\u5929\u6CA1\u6709\u7B26\u5408\u7B5B\u9009\u7684\u8BB0\u5F55\u3002" });
      return;
    }
    for (const message of filtered) {
      const row = this.listEl.createDiv({ cls: "codex-kb-history-row" });
      const meta = row.createDiv({ cls: "codex-kb-history-meta" });
      meta.createSpan({ text: formatAbsoluteTime(message.createdAt) });
      meta.createSpan({ text: roleLabel(message.role) });
      if (message.title) meta.createSpan({ text: message.title });
      if (message.status) meta.createSpan({ text: message.status });
      row.createDiv({ cls: "codex-kb-history-text", text: compactHistoryText(message) });
    }
  }
};
function historyMessageMatchesFilter(message, filter) {
  if (filter === "all") return true;
  if (filter === "user") return message.role === "user";
  if (filter === "assistant") return message.role === "assistant";
  if (filter === "process") return Boolean(message.itemType) && message.role !== "user" && message.role !== "assistant";
  if (filter === "failed") return message.status === "failed" || message.status === "error";
  return true;
}
function roleLabel(role) {
  if (role === "user") return "\u6211";
  if (role === "assistant") return "EchoInk";
  if (role === "tool") return "\u5DE5\u5177";
  return "\u7CFB\u7EDF";
}
function compactHistoryText(message) {
  const text = (displayTextForMessage(message) || message.previewText || "").replace(/\s+/g, " ").trim();
  if (!text) return "(\u7A7A\u6D88\u606F)";
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}
function labelFor(value) {
  const labels = {
    low: "\u4F4E\u601D\u8003",
    medium: "\u4E2D\u601D\u8003",
    high: "\u9AD8\u601D\u8003",
    xhigh: "\u8D85\u9AD8\u601D\u8003",
    standard: "\u6807\u51C6",
    fast: "\u5FEB\u901F",
    flex: "\u5F39\u6027",
    "read-only": "\u53EA\u8BFB",
    "workspace-write": "\u5DE5\u4F5C\u533A\u53EF\u5199",
    "danger-full-access": "\u5B8C\u5168\u8BBF\u95EE\u6743\u9650",
    agent: "Agent",
    plan: "Plan"
  };
  return labels[value] ?? value;
}
function kbBucketLabel(bucket) {
  if (bucket === "wiki") return "Wiki";
  if (bucket === "journal") return "Journal";
  return "Outputs";
}
function kbEvidenceStatusLabel(status) {
  if (status === "strong") return "\u5F3A\u8BC1\u636E";
  if (status === "weak") return "\u5F31\u76F8\u5173";
  return "\u65E0\u672C\u5730\u4F9D\u636E";
}
function isProcessItemType3(itemType) {
  return itemType === "reasoning" || itemType === "commandExecution" || itemType === "fileChange" || itemType === "mcpToolCall" || itemType === "dynamicToolCall" || itemType === "collabAgentToolCall" || itemType === "plan";
}
function isGroupedProcessItemType(itemType) {
  return itemType === "commandExecution" || itemType === "fileChange" || itemType === "mcpToolCall" || itemType === "dynamicToolCall" || itemType === "collabAgentToolCall";
}
function sameProcessRun(a, b) {
  if (a.runId || b.runId) return a.runId === b.runId;
  return true;
}
function messageRowId(message) {
  return `message:${message.id}`;
}
function processGroupRowId(messages) {
  const first = messages[0];
  return `processGroup:${first?.runId ?? "none"}:${first?.id ?? "process"}`;
}
function processGroupId(messages) {
  return processGroupStateId(messages);
}
function processGroupTitle(messages) {
  const count = messages.length;
  return count === 1 ? "\u5DF2\u5904\u7406 1 \u4E2A\u52A8\u4F5C" : `\u5DF2\u5904\u7406 ${count} \u4E2A\u52A8\u4F5C`;
}
function processGroupDetail(messages) {
  const labels = {
    search: "\u641C\u7D22",
    view: "\u67E5\u770B",
    edit: "\u7F16\u8F91",
    run: "\u8FD0\u884C",
    tool: "\u5DE5\u5177",
    command: "\u547D\u4EE4",
    other: "\u5176\u4ED6"
  };
  const counts = /* @__PURE__ */ new Map();
  for (const message of messages) {
    const key = message.processKind ?? "other";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([key, count]) => `${labels[key] ?? key} ${count}`).join("\uFF0C");
}
function processGroupStatus(messages) {
  if (messages.some((message) => message.status === "running")) return "\u8FDB\u884C\u4E2D";
  if (messages.some((message) => message.status === "error" || message.status === "failed")) return "\u6709\u5931\u8D25";
  if (messages.some((message) => message.status === "interrupted")) return "\u672A\u5B8C\u6210";
  return "\u5B8C\u6210";
}
function findProcessFileRef(refs, filePath) {
  const normalizedPath = (0, import_obsidian4.normalizePath)(filePath);
  const fileName = basename3(filePath);
  return refs.find((ref) => ref.path === filePath || ref.displayPath === filePath || ref.absolutePath === filePath) ?? refs.find((ref) => (0, import_obsidian4.normalizePath)(ref.path) === normalizedPath || (0, import_obsidian4.normalizePath)(ref.displayPath) === normalizedPath) ?? refs.find((ref) => ref.name === fileName) ?? null;
}
function shellTranscript(text) {
  const trimmed = text.trimEnd();
  if (!trimmed) return "$";
  const lines = trimmed.split(/\r?\n/);
  const command = lines.shift()?.trim() ?? "";
  const output = lines.join("\n").trim();
  if (!output) return `$ ${command}`;
  return `$ ${command}

${output}`;
}
function roleForProcessItem(itemType) {
  return itemType === "reasoning" || itemType === "plan" ? "assistant" : "tool";
}
function rawTextForProcessItem(item) {
  if (item?.type === "commandExecution") return item.command ?? "";
  if (item?.type === "fileChange") return (item.changes ?? []).map((change) => change.path).join("\n");
  if (item?.type === "mcpToolCall") return [item.server, item.tool].filter(Boolean).join(".");
  if (item?.type === "dynamicToolCall") return [item.namespace, item.tool].filter(Boolean).join(".");
  if (item?.type === "collabAgentToolCall") return item.tool ?? "";
  if (item?.type === "reasoning") return reasoningTextFromPayload(item);
  if (item?.type === "plan") return item.text ?? "";
  return "";
}
function editorActionStatusLabel(status) {
  const action = status.actionLabel ?? "\u5199\u4F5C";
  const mode = status.modeLabel ?? "";
  if (status.status === "idle") {
    if (status.understandingStatus === "fresh") return "\u5DF2\u7406\u89E3";
    if (status.understandingStatus === "reused") return "\u6B63\u6587\u6709\u53D8\u5316\uFF0C\u5DF2\u590D\u7528";
    if (status.understandingStatus === "stale") return "\u7406\u89E3\u8FC7\u671F";
    return "\u5199\u4F5C";
  }
  if (status.status === "preparing") return `\u51C6\u5907${action}`;
  if (status.status === "connecting") return "\u8FDE\u63A5 Codex";
  if (status.status === "generating") {
    const seconds = status.startedAt ? Math.max(0, Math.floor((Date.now() - status.startedAt) / 1e3)) : 0;
    if (status.phase === "understanding") return `\u7406\u89E3\u4E2D ${seconds}s`;
    if (status.phase === "reviewing") return `${mode || "\u4E25\u683C"}\u5BA1\u6821\u4E2D ${seconds}s`;
    return `${mode ? `${mode}` : ""}${action}\u4E2D ${seconds}s`;
  }
  if (status.status === "awaiting-confirm") return "\u5F85\u786E\u8BA4 Enter / Esc";
  if (status.status === "confirmed") return status.message || "\u5DF2\u66FF\u6362";
  if (status.status === "canceled") return status.message || "\u5DF2\u53D6\u6D88";
  return "\u5199\u4F5C\u5931\u8D25";
}
function articleUnderstandingStatusLabel(status, error) {
  if (status === "fresh") return "\u5DF2\u7406\u89E3";
  if (status === "reused") return "\u6B63\u6587\u6709\u53D8\u5316\uFF0C\u5DF2\u590D\u7528";
  if (status === "running") return "\u7406\u89E3\u4E2D";
  if (status === "stale") return "\u7406\u89E3\u8FC7\u671F";
  if (status === "failed") return error ? `\u5931\u8D25\uFF1A${error}` : "\u7406\u89E3\u5931\u8D25";
  if (status === "missing") return "\u672A\u7406\u89E3";
  return "\u7A7A\u95F2";
}
function formatRelativeTime(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - value) / 1e3));
  if (seconds < 60) return `${seconds}s \u524D`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} \u5206\u949F\u524D`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} \u5C0F\u65F6\u524D`;
  const days = Math.floor(hours / 24);
  return `${days} \u5929\u524D`;
}
function editorActionTimeoutForMode(baseTimeoutMs, mode) {
  if (mode === "strict") return Math.max(baseTimeoutMs, 12e4);
  if (mode === "quality") return Math.max(baseTimeoutMs, 9e4);
  return baseTimeoutMs;
}
function mergeProcessFiles(current, incoming) {
  const byKey = /* @__PURE__ */ new Map();
  for (const file of [...current ?? [], ...incoming]) {
    byKey.set(`${file.kind}:${file.path}`, file);
  }
  return Array.from(byKey.values()).slice(0, 8);
}
function summarizeAttachmentFile(attachment, vaultPath) {
  return normalizeProcessFileRef(attachment.path, vaultPath);
}
async function pickWorkspaceDirectory(defaultPath) {
  if (!import_obsidian4.Platform.isDesktopApp) return void 0;
  const electron = electronModule2();
  const dialog = electron?.remote?.dialog ?? electron?.dialog;
  if (!dialog?.showOpenDialog) return void 0;
  const result = await dialog.showOpenDialog({
    title: "\u9009\u62E9 Codex \u5DE5\u4F5C\u533A",
    defaultPath: normalizeWorkspacePath(defaultPath) || void 0,
    properties: ["openDirectory", "createDirectory"]
  });
  if (result?.canceled) return null;
  return result?.filePaths?.[0] ?? null;
}
function workspaceDirectoryExists(value) {
  const workspacePath = normalizeWorkspacePath(value);
  if (!workspacePath) return false;
  try {
    return fs4.statSync(workspacePath).isDirectory();
  } catch {
    return false;
  }
}
function normalizeWorkspacePath(value) {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const withoutFileProtocol = raw.replace(/^file:\/\//, "");
  try {
    return path8.resolve(decodeURI(withoutFileProtocol));
  } catch {
    return path8.resolve(withoutFileProtocol);
  }
}
function workspaceDisplayName(workspacePath) {
  const normalized = normalizeWorkspacePath(workspacePath);
  return path8.basename(normalized) || normalized;
}
function electronModule2() {
  const electronRequire = window.require ?? globalThis.require;
  try {
    return electronRequire?.("electron");
  } catch {
    return null;
  }
}
function showItemInFinder(filePath) {
  if (!import_obsidian4.Platform.isDesktopApp || !filePath) return false;
  const shell = electronModule2()?.shell;
  if (!shell?.showItemInFolder) return false;
  shell.showItemInFolder(filePath);
  return true;
}
function compactReasoningLabel(value) {
  const labels = {
    none: "\u65E0",
    minimal: "\u6781\u4F4E",
    low: "\u4F4E",
    medium: "\u4E2D",
    high: "\u9AD8",
    xhigh: "\u8D85\u9AD8"
  };
  return labels[value] ?? value;
}
function shortModelLabel(value) {
  if (!value.trim()) return "\u81EA\u52A8";
  return value.replace(/^gpt-/i, "").replace(/-/g, " ").replace(/\bmini\b/i, "Mini").replace(/\bhigh\b/i, "High").trim();
}
function iconForProcessMessage(message) {
  const processIcons = {
    search: "search",
    view: "book-open",
    edit: "pencil",
    run: "terminal",
    command: "terminal",
    tool: "blocks"
  };
  const processIcon = processIcons[message.processKind ?? ""];
  if (processIcon) return processIcon;
  return iconForItemType(message.itemType);
}
function iconForItemType(itemType) {
  const icons = {
    reasoning: "brain",
    plan: "list-checks",
    commandExecution: "terminal",
    fileChange: "file-diff",
    mcpToolCall: "blocks",
    dynamicToolCall: "blocks",
    collabAgentToolCall: "blocks"
  };
  return icons[itemType ?? ""] ?? "chevron-right";
}
function titleForItemType(message) {
  if (message.title) return message.title;
  const titles = {
    reasoning: "\u5DF2\u601D\u8003",
    plan: "\u66F4\u65B0\u8BA1\u5212",
    commandExecution: "\u4F7F\u7528\u547D\u4EE4",
    fileChange: "\u7F16\u8F91\u6587\u4EF6",
    mcpToolCall: "\u4F7F\u7528\u5DE5\u5177",
    dynamicToolCall: "\u4F7F\u7528\u5DE5\u5177",
    collabAgentToolCall: "\u4F7F\u7528\u5DE5\u5177"
  };
  return titles[message.itemType ?? ""] ?? "\u5DE5\u5177";
}
function labelForStatus(status) {
  const labels = {
    running: "\u8FDB\u884C\u4E2D",
    completed: "\u5B8C\u6210",
    error: "\u5931\u8D25",
    failed: "\u5931\u8D25",
    blocked: "\u7B49\u5F85\u786E\u8BA4",
    interrupted: "\u4E2D\u65AD"
  };
  return labels[status] ?? status;
}
function labelForDiffKind(kind) {
  const labels = {
    add: "\u65B0\u589E",
    delete: "\u5220\u9664",
    update: "\u4FEE\u6539",
    move: "\u79FB\u52A8",
    unknown: "\u6539\u52A8"
  };
  return labels[kind] ?? "\u6539\u52A8";
}
function knowledgeRunStatusLabel(status, at) {
  const labels = {
    idle: "\u672A\u8FD0\u884C",
    running: "\u8FD0\u884C\u4E2D",
    success: "\u6210\u529F",
    failed: "\u5931\u8D25",
    canceled: "\u5DF2\u53D6\u6D88"
  };
  const label = labels[status] ?? status;
  return at ? `${label} \xB7 ${formatRelativeTime(at)}` : label;
}
var HEATMAP_MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function heatmapYear(snapshot) {
  const firstDate = snapshot.checkHeatmap[0] ? parseHeatmapDateKey(snapshot.checkHeatmap[0].date) : null;
  return firstDate?.getFullYear() ?? new Date(snapshot.generatedAt).getFullYear();
}
function heatmapWeekIndex(dateKey, yearStart) {
  const date = parseHeatmapDateKey(dateKey);
  if (!date) return 0;
  const daysFromYearStart = Math.round((date.getTime() - yearStart.getTime()) / 864e5);
  return Math.floor((daysFromYearStart + yearStart.getDay()) / 7);
}
function parseHeatmapDateKey(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
}
function knowledgeHeatmapStatusLabel(status) {
  if (status === "success") return "\u6210\u529F";
  if (status === "failed") return "\u5931\u8D25";
  return "\u65E0\u8BB0\u5F55";
}
function formatAbsoluteTime(value) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatBytes(byteCount) {
  if (byteCount < 1024) return `${byteCount} B`;
  if (byteCount < 1024 * 1024) return `${Math.round(byteCount / 1024)} KB`;
  return `${(byteCount / 1024 / 1024).toFixed(1)} MB`;
}
function countLines2(text) {
  if (!text) return 0;
  let lines = 1;
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 10) lines += 1;
  }
  return lines;
}
function pruneSet(set, maxSize) {
  while (set.size > maxSize) {
    const first = set.values().next();
    if (first.done) return;
    set.delete(first.value);
  }
}
function isImagePath(filePath) {
  return /\.(png|jpe?g|gif|webp|svg|bmp|heic)$/i.test(filePath);
}
function absoluteVaultPath(vaultPath, relativePath) {
  return `${vaultPath.replace(/\/$/, "")}/${relativePath.replace(/^\//, "")}`;
}
function toImageSrc(app, imagePath) {
  if (imagePath.startsWith("/")) return `file://${imagePath}`;
  const file = app.vault.getAbstractFileByPath(imagePath);
  if (file instanceof import_obsidian4.TFile) return app.vault.getResourcePath(file);
  if (import_obsidian4.Platform.isDesktopApp) return `file://${imagePath}`;
  return imagePath;
}

// src/editor-actions/controller.ts
var import_obsidian5 = require("obsidian");

// src/editor-actions/selection.ts
function enabledEditorActionConfigs(settings) {
  if (!settings.enabled) return [];
  return settings.actions.filter((action) => action.enabled && action.label.trim() && action.promptTemplate.trim());
}
function validateEditorActionSelection(input) {
  if (input.selectionCount !== 1) return { ok: false, reason: "\u6682\u4E0D\u652F\u6301\u591A\u4E2A\u9009\u533A" };
  const selectedText = input.selectedText;
  if (!selectedText || !selectedText.trim()) return { ok: false, reason: "\u8BF7\u5148\u9009\u4E2D\u9700\u8981\u5904\u7406\u7684\u6587\u5B57" };
  if (selectedText.length > input.maxSelectedChars) return { ok: false, reason: `\u9009\u4E2D\u6587\u5B57\u8D85\u8FC7 ${input.maxSelectedChars} \u5B57\uFF0C\u8BF7\u7F29\u77ED\u540E\u518D\u8BD5` };
  return { ok: true };
}
function buildEditorActionSelectionSnapshot(input) {
  const fromOffset = Math.max(0, Math.min(input.fromOffset, input.fullText.length));
  const toOffset = Math.max(fromOffset, Math.min(input.toOffset, input.fullText.length));
  const beforeStart = Math.max(0, fromOffset - Math.max(0, input.contextCharsBefore));
  const afterEnd = Math.min(input.fullText.length, toOffset + Math.max(0, input.contextCharsAfter));
  const fallbackFrom = { line: 0, ch: fromOffset };
  const fallbackTo = { line: 0, ch: toOffset };
  return {
    filePath: input.filePath,
    fileName: fileNameFromPath(input.filePath),
    fromOffset,
    toOffset,
    from: input.from ?? fallbackFrom,
    to: input.to ?? fallbackTo,
    selectedText: input.fullText.slice(fromOffset, toOffset),
    beforeContext: input.fullText.slice(beforeStart, fromOffset),
    afterContext: input.fullText.slice(toOffset, afterEnd),
    articleUnderstanding: input.articleUnderstanding,
    articleUnderstandingState: input.articleUnderstandingState,
    noteSummary: input.noteSummary
  };
}
function confirmEditorActionCandidate(documentText, candidate) {
  const current = documentText.slice(candidate.fromOffset, candidate.toOffset);
  if (current !== candidate.originalText) {
    return { ok: false, reason: "\u539F\u6587\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u540E\u518D\u8BD5" };
  }
  const range = editorActionCandidateReplacementRange(candidate);
  return {
    ok: true,
    text: `${documentText.slice(0, range.fromOffset)}${candidate.candidateText}${documentText.slice(range.toOffset)}`
  };
}
function editorActionCandidateReplacementRange(candidate) {
  if (candidate.actionId === "continue") return { fromOffset: candidate.toOffset, toOffset: candidate.toOffset };
  return { fromOffset: candidate.fromOffset, toOffset: candidate.toOffset };
}
function editorActionCandidateInvalidationReason(documentText, candidate) {
  if (documentText.length !== candidate.documentLength) return "document-changed";
  const current = documentText.slice(candidate.fromOffset, candidate.toOffset);
  return current === candidate.originalText ? null : "original-text-changed";
}
function fileNameFromPath(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.split("/").filter(Boolean).pop() || filePath || "\u5F53\u524D\u7B14\u8BB0";
}

// src/editor-actions/editor-extension.ts
var import_state2 = require("@codemirror/state");
var import_view = require("@codemirror/view");
var setEditorActionCandidateEffect = import_state2.StateEffect.define();
var editorActionCandidateField = import_state2.StateField.define({
  create: () => null,
  update(value, transaction) {
    let next = value;
    if (transaction.docChanged && next) next = null;
    for (const effect of transaction.effects) {
      if (effect.is(setEditorActionCandidateEffect)) next = effect.value;
    }
    return next;
  },
  provide: (field) => import_view.EditorView.decorations.from(field, candidateDecorations)
});
function createEditorActionExtension(handlers) {
  return [
    editorActionCandidateField,
    import_state2.Prec.highest(import_view.keymap.of([
      {
        key: "Enter",
        run(view) {
          const candidate = view.state.field(editorActionCandidateField, false);
          return candidate ? handlers.confirm(candidate) : false;
        }
      },
      {
        key: "Escape",
        run(view) {
          const candidate = view.state.field(editorActionCandidateField, false);
          return candidate ? handlers.cancel(candidate) : false;
        }
      }
    ]))
  ];
}
function setEditorActionCandidate(editor, candidate) {
  const view = editorViewFromEditor(editor);
  if (!view) return false;
  const range = candidate ? editorActionCandidateReplacementRange(candidate) : null;
  view.dispatch({
    effects: setEditorActionCandidateEffect.of(candidate),
    ...range ? { selection: { anchor: range.fromOffset }, scrollIntoView: true } : {}
  });
  const stored = view.state.field(editorActionCandidateField, false);
  return candidate ? stored?.id === candidate.id : !stored;
}
function candidateDecorations(candidate) {
  if (!candidate) return import_view.Decoration.none;
  const range = editorActionCandidateReplacementRange(candidate);
  const widget = new EditorActionCandidateWidget(candidate);
  if (range.fromOffset === range.toOffset) {
    return import_view.Decoration.set([
      import_view.Decoration.widget({
        widget,
        side: 1
      }).range(range.fromOffset)
    ]);
  }
  return import_view.Decoration.set([
    import_view.Decoration.replace({
      widget,
      inclusive: false
    }).range(range.fromOffset, range.toOffset)
  ]);
}
function editorViewFromEditor(editor) {
  const view = editor?.cm;
  return view && typeof view.dispatch === "function" && view.state ? view : null;
}
var EditorActionCandidateWidget = class extends import_view.WidgetType {
  constructor(candidate) {
    super();
    this.candidate = candidate;
  }
  eq(other) {
    return other.candidate.id === this.candidate.id && other.candidate.candidateText === this.candidate.candidateText;
  }
  toDOM() {
    const span = document.createElement("span");
    span.className = "codex-editor-action-candidate";
    span.textContent = this.candidate.candidateText;
    span.title = "Codex \u5019\u9009\u6587\u672C\uFF1AEnter \u786E\u8BA4\uFF0CEsc \u53D6\u6D88";
    return span;
  }
  ignoreEvent() {
    return false;
  }
};

// src/editor-actions/controller.ts
var EditorActionController = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  active = null;
  confirming = false;
  register() {
    this.plugin.registerEditorExtension(createEditorActionExtension({
      confirm: () => this.confirmActiveCandidate(),
      cancel: () => this.cancelActiveCandidate("canceled", true)
    }));
    this.plugin.app.workspace.updateOptions();
    this.plugin.registerEvent(this.plugin.app.workspace.on("editor-menu", (menu, editor, info) => this.onEditorMenu(menu, editor, info)));
    this.plugin.registerEvent(this.plugin.app.workspace.on("editor-change", (editor) => {
      if (!this.active || this.active.editor !== editor || this.confirming) return;
      const reason = editorActionCandidateInvalidationReason(editor.getValue(), this.active.candidate);
      if (reason) this.cancelActiveCandidate("canceled", false, "\u6B63\u6587\u5DF2\u53D8\u5316\uFF0C\u5019\u9009\u5DF2\u53D6\u6D88");
    }));
    this.plugin.registerEvent(this.plugin.app.workspace.on("active-leaf-change", () => {
      if (!this.active) return;
      const activeFilePath = this.plugin.app.workspace.getActiveFile()?.path;
      if (activeFilePath && activeFilePath !== this.active.candidate.filePath) {
        this.cancelActiveCandidate("canceled", false, "\u5DF2\u5207\u6362\u6587\u4EF6\uFF0C\u5019\u9009\u5DF2\u53D6\u6D88");
      }
    }));
  }
  cancelActiveCandidate(status = "canceled", showNotice = false, message) {
    if (!this.active) return false;
    setEditorActionCandidate(this.active.editor, null);
    this.active = null;
    this.plugin.getXiaoyuanView()?.setEditorActionStatus({ status, message: message ?? (status === "failed" ? "\u5019\u9009\u5DF2\u5931\u6548" : "\u5DF2\u53D6\u6D88") });
    if (showNotice) new import_obsidian5.Notice("\u5DF2\u53D6\u6D88\u5019\u9009");
    return true;
  }
  onEditorMenu(menu, editor, info) {
    const settings = this.plugin.settings.editorActions;
    if (!settings.enabled) return;
    const actions = enabledEditorActionConfigs(settings);
    if (!actions.length) return;
    const selectedText = editor.getSelection();
    const validation = validateEditorActionSelection({
      selectedText,
      selectionCount: editor.listSelections().length,
      maxSelectedChars: settings.maxSelectedChars
    });
    if (!validation.ok) return;
    menu.addSeparator();
    for (const action of actions) {
      menu.addItem((item) => {
        item.setTitle(`${action.label}`).setIcon(actionIcon(action.id)).onClick(() => void this.runEditorAction(editor, info, action));
      });
    }
  }
  async runEditorAction(editor, info, action) {
    const settings = this.plugin.settings.editorActions;
    const selectedText = editor.getSelection();
    const validation = validateEditorActionSelection({
      selectedText,
      selectionCount: editor.listSelections().length,
      maxSelectedChars: settings.maxSelectedChars
    });
    if (!validation.ok) {
      new import_obsidian5.Notice(validation.reason);
      return;
    }
    const filePath = info.file?.path ?? "\u5F53\u524D\u7B14\u8BB0";
    const from = editor.getCursor("from");
    const to = editor.getCursor("to");
    const fullText = editor.getValue();
    const summarySource = {
      filePath,
      fileName: info.file?.name ?? filePath.split("/").pop() ?? "\u5F53\u524D\u7B14\u8BB0",
      text: fullText,
      mtime: info.file?.stat.mtime ?? 0,
      size: info.file?.stat.size ?? fullText.length
    };
    const qualityMode = settings.qualityMode;
    const modeConfig = resolveEditorActionModeConfig(settings, qualityMode);
    const articleUnderstanding = qualityMode === "fast" ? { state: "missing", entry: null } : resolveArticleUnderstandingCache(settings.articleUnderstandingCache, summarySource, qualityMode, modeConfig.model);
    const snapshot = buildEditorActionSelectionSnapshot({
      fullText,
      fromOffset: editor.posToOffset(from),
      toOffset: editor.posToOffset(to),
      from,
      to,
      contextCharsBefore: modeConfig.contextCharsBefore,
      contextCharsAfter: modeConfig.contextCharsAfter,
      filePath,
      articleUnderstanding: articleUnderstanding.entry?.understanding,
      articleUnderstandingState: articleUnderstanding.entry ? articleUnderstanding.state : void 0
    });
    const style = resolveEditorActionStyle(settings);
    const prompt = buildEditorActionPrompt({ action, style, snapshot, qualityMode, modeLabel: modeConfig.label });
    const request = {
      id: newId("editor-action"),
      action,
      style,
      snapshot,
      source: summarySource,
      qualityMode,
      modeConfig,
      prompt,
      createdAt: Date.now()
    };
    this.cancelActiveCandidate("canceled", false);
    await this.plugin.activateView();
    const view = this.plugin.getXiaoyuanView();
    if (!view) {
      new import_obsidian5.Notice("\u65E0\u6CD5\u6253\u5F00 \u5C0F\u5143 \u4FA7\u680F");
      return;
    }
    try {
      view.setEditorActionStatus({ status: "preparing", actionLabel: action.label, startedAt: Date.now() });
      const raw = await view.sendEditorActionRequest(request);
      const candidateText = cleanEditorActionOutput(raw);
      const candidateValidation = validateEditorActionCandidateText(candidateText);
      if (!candidateValidation.ok) throw new Error(candidateValidation.reason);
      const candidate = {
        id: newId("candidate"),
        actionId: action.id,
        filePath,
        fromOffset: snapshot.fromOffset,
        toOffset: snapshot.toOffset,
        originalText: snapshot.selectedText,
        candidateText,
        documentLength: editor.getValue().length,
        createdAt: Date.now()
      };
      if (!setEditorActionCandidate(editor, candidate)) throw new Error("\u5F53\u524D\u7F16\u8F91\u5668\u4E0D\u652F\u6301\u7070\u8272\u5019\u9009\u9884\u89C8");
      this.active = { editor, candidate };
      view.setEditorActionStatus({ status: "awaiting-confirm", actionLabel: action.label, message: "Enter \u786E\u8BA4 / Esc \u53D6\u6D88" });
      editor.focus();
    } catch (error) {
      view.setEditorActionStatus({ status: "failed", actionLabel: action.label, error: error instanceof Error ? error.message : String(error) });
      new import_obsidian5.Notice(`${action.label}\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
    }
  }
  runEditorActionById(editor, info, actionId) {
    const action = enabledEditorActionConfigs(this.plugin.settings.editorActions).find((item) => item.id === actionId);
    if (!action) {
      new import_obsidian5.Notice("\u8FD9\u4E2A\u5199\u4F5C\u64CD\u4F5C\u672A\u542F\u7528");
      return Promise.resolve();
    }
    return this.runEditorAction(editor, info, action);
  }
  confirmActiveCandidate() {
    if (!this.active) return false;
    const { editor, candidate } = this.active;
    const confirmed = confirmEditorActionCandidate(editor.getValue(), candidate);
    if (!confirmed.ok) {
      this.cancelActiveCandidate("failed", false);
      new import_obsidian5.Notice(confirmed.reason);
      return true;
    }
    this.confirming = true;
    try {
      const range = editorActionCandidateReplacementRange(candidate);
      setEditorActionCandidate(editor, null);
      editor.replaceRange(candidate.candidateText, editor.offsetToPos(range.fromOffset), editor.offsetToPos(range.toOffset), "codex-editor-action");
      this.active = null;
      const message = confirmedActionMessage(candidate.actionId);
      this.plugin.getXiaoyuanView()?.setEditorActionStatus({ status: "confirmed", message });
      new import_obsidian5.Notice(confirmedActionNotice(candidate.actionId));
    } finally {
      this.confirming = false;
    }
    return true;
  }
};
function actionIcon(actionId) {
  if (actionId === "expand") return "text";
  if (actionId === "continue") return "forward";
  if (actionId === "translate") return "languages";
  return "wand-sparkles";
}
function confirmedActionMessage(actionId) {
  if (actionId === "continue") return "\u5DF2\u7EED\u5199";
  if (actionId === "translate") return "\u5DF2\u7FFB\u8BD1";
  return "\u5DF2\u66FF\u6362";
}
function confirmedActionNotice(actionId) {
  if (actionId === "continue") return "\u5DF2\u63D2\u5165\u7EED\u5199";
  if (actionId === "translate") return "\u5DF2\u66FF\u6362\u4E3A\u82F1\u6587\u8BD1\u6587";
  return "\u5DF2\u66FF\u6362";
}

// src/knowledge-base/manager.ts
var fs8 = __toESM(require("fs"));
var fsp11 = __toESM(require("fs/promises"));
var path17 = __toESM(require("path"));
var import_child_process2 = require("child_process");
var import_obsidian6 = require("obsidian");

// src/knowledge-base/report.ts
var fsp3 = __toESM(require("fs/promises"));
var path9 = __toESM(require("path"));
async function readKnowledgeBaseReportExcerpt(vaultPath, reportPath, maxChars = 1e3) {
  if (!reportPath.trim()) return null;
  const absolute = path9.join(vaultPath, reportPath);
  const text = await fsp3.readFile(absolute, "utf8").catch(() => "");
  const excerpt = text.trim().slice(0, maxChars).trim();
  return excerpt || null;
}
function isLintOnlyKnowledgeBaseReport(text) {
  return /mode:\s*lint-only/i.test(text) || /lint-only/i.test(text) || /只执行\s*Lint/.test(text) || /只执行.*体检/.test(text);
}
function recoveredLintReportSummary(reportPath) {
  const suffix = reportPath.trim() ? `\u62A5\u544A\uFF1A${reportPath.trim()}` : "\u62A5\u544A\u5DF2\u751F\u6210\u3002";
  return `\u4F53\u68C0\u62A5\u544A\u5DF2\u751F\u6210\u3002Codex \u8FD4\u56DE\u5931\u8D25\u72B6\u6001\uFF0C\u4F46 lint-only \u62A5\u544A\u6587\u4EF6\u5B58\u5728\uFF0C\u5DF2\u6062\u590D\u4E3A\u6210\u529F\u3002${suffix}`;
}

// src/knowledge-base/discovery.ts
var fsp5 = __toESM(require("fs/promises"));
var path11 = __toESM(require("path"));

// src/knowledge-base/tracker.ts
var fsp4 = __toESM(require("fs/promises"));
var path10 = __toESM(require("path"));
var TRACKER_MTIME_GRACE_MS = 5e3;
async function readKnowledgeBaseTrackerSnapshot(vaultPath, trackerPath, files) {
  const absolute = path10.join(vaultPath, trackerPath);
  const [text, stat10] = await Promise.all([
    fsp4.readFile(absolute, "utf8").catch(() => ""),
    fsp4.stat(absolute).catch(() => null)
  ]);
  if (!text.trim() || !stat10) return { processedSources: {}, updatedAt: 0 };
  const processedSources = {};
  const byPath = new Map(files.map((file) => [file.path, file]));
  const trackerMtime = stat10.mtimeMs;
  function mark(relativePath) {
    const file = byPath.get(normalizeRelativePath(relativePath));
    if (!file || file.mtime > trackerMtime + TRACKER_MTIME_GRACE_MS) return;
    processedSources[file.path] = { size: file.size, mtime: file.mtime };
  }
  for (const match of text.matchAll(/raw\/[^\]\n\r`]+?\.(?:md|markdown|txt|pdf|docx|png|jpe?g|webp|gif)\b/gi)) {
    mark(match[0]);
  }
  const sections = text.split(/^##\s+/m).slice(1);
  for (const section of sections) {
    const [heading = "", ...bodyLines] = section.split(/\r?\n/);
    const body = bodyLines.join("\n");
    const prefixMatch = heading.match(/(raw\/[^—\n]+?\/)(?:\s|—|$)/);
    if (!prefixMatch) continue;
    const prefix = normalizeRelativePath(prefixMatch[1]);
    if (!prefix.startsWith("raw/")) continue;
    for (const item of body.matchAll(/^-\s+`?(.+?\.(?:md|markdown|txt|pdf|docx|png|jpe?g|webp|gif))`?(?:\s|$)/gim)) {
      const itemPath = normalizeRelativePath(item[1]);
      mark(itemPath.startsWith("raw/") ? itemPath : `${prefix}${itemPath}`);
    }
    const sectionSignalsProcessed = /全部|已处理|处理时间|处理新增|已消化|知识库重建|共\s*\d+\s*个文件/.test(`${heading}
${body}`);
    if (sectionSignalsProcessed) {
      for (const file of files) {
        if (file.path.startsWith(prefix) && file.mtime <= trackerMtime + TRACKER_MTIME_GRACE_MS) mark(file.path);
      }
    }
  }
  return { processedSources, updatedAt: trackerMtime };
}
function normalizeRelativePath(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
}

// src/knowledge-base/discovery.ts
var SUPPORTED_RAW_EXTENSIONS = /* @__PURE__ */ new Set([".md", ".markdown", ".txt", ".pdf", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);
async function discoverKnowledgeBaseSources(vaultPath, processed) {
  const rawDir = path11.join(vaultPath, "raw");
  const all = await walkFiles(rawDir).catch(() => []);
  const sources = [];
  for (const file of all) {
    const ext = path11.extname(file).toLowerCase();
    if (!SUPPORTED_RAW_EXTENSIONS.has(ext)) continue;
    const stat10 = await fsp5.stat(file);
    const relativePath = normalizeSlashes3(path11.relative(vaultPath, file));
    if (relativePath === "raw/index.md") continue;
    const lowerPath = relativePath.toLowerCase();
    if (lowerPath.endsWith(".base") || lowerPath.endsWith(".base.md") || lowerPath.includes(".assets/")) continue;
    const mime = mimeForKnowledgeFile(file);
    sources.push({
      relativePath,
      absolutePath: file,
      size: stat10.size,
      mtime: stat10.mtimeMs,
      mime,
      modality: requiredModalityForMime(mime),
      changed: true
    });
  }
  const trackerPath = path11.join(vaultPath, "outputs", ".ingest-tracker.md");
  const trackerSnapshot = await readKnowledgeBaseTrackerSnapshot(vaultPath, "outputs/.ingest-tracker.md", sources.map((source) => ({
    path: source.relativePath,
    size: source.size,
    mtime: source.mtime
  })));
  const mergedProcessed = { ...processed, ...trackerSnapshot.processedSources };
  const resolvedSources = sources.map((source) => {
    const previous = mergedProcessed[source.relativePath];
    return {
      ...source,
      changed: !previous || previous.size !== source.size || previous.mtime !== source.mtime
    };
  });
  const today = formatDateForFile(/* @__PURE__ */ new Date());
  return {
    vaultPath,
    sources: resolvedSources,
    changedSources: resolvedSources.filter((source) => source.changed),
    reportPath: `outputs/maintenance/kb-maintenance-${today}.md`,
    trackerPath
  };
}
async function walkFiles(dir) {
  const result = [];
  const entries = await fsp5.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path11.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walkFiles(full));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}
function formatDateForFile(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function pad(value) {
  return String(value).padStart(2, "0");
}
function normalizeSlashes3(value) {
  return value.split(path11.sep).join("/");
}

// src/knowledge-base/dashboard.ts
var fs5 = __toESM(require("fs"));
var fsp6 = __toESM(require("fs/promises"));
var path12 = __toESM(require("path"));
var MAX_DASHBOARD_FILES = 3e3;
var RECENT_FILE_LIMIT = 6;
var RAW_PROCESSING_EXTENSIONS = /* @__PURE__ */ new Set([".md", ".markdown", ".txt", ".pdf", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);
async function buildKnowledgeBaseDashboardSnapshot(vaultPath, settings) {
  const generatedAt = Date.now();
  const rulesFilePath = normalizeRelativePath2(settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE, AGENTS_RULES_FILE);
  const processedSources = settings.processedSources ?? {};
  const raw = await scanDashboardDirectory(vaultPath, "raw", { skipHidden: true });
  const wiki = await scanDashboardDirectory(vaultPath, "wiki", { skipHidden: true });
  const outputs = await scanDashboardDirectory(vaultPath, "outputs", { skipHidden: false, ignoreNames: /* @__PURE__ */ new Set([".DS_Store"]) });
  const inbox = await scanDashboardDirectory(vaultPath, "inbox", { skipHidden: true });
  const reportPath = await resolveLatestReportPath(vaultPath, settings.lastReportPath, outputs.files);
  const trackerPath = "outputs/.ingest-tracker.md";
  const rulesFileExists = await exists3(path12.join(vaultPath, rulesFilePath));
  const trackerExists = await exists3(path12.join(vaultPath, trackerPath));
  const reportExists = reportPath ? await exists3(path12.join(vaultPath, reportPath)) : false;
  const wikiIndexExists = await exists3(path12.join(vaultPath, "wiki/index.md"));
  const rawContentFiles = raw.files.filter(isRawProcessingSource);
  const trackerSnapshot = await readKnowledgeBaseTrackerSnapshot(vaultPath, trackerPath, rawContentFiles);
  const mergedProcessedSources = { ...processedSources, ...trackerSnapshot.processedSources };
  const reportFindings = await readReportFindings(vaultPath, reportPath);
  const maintenanceHistory = normalizeMaintenanceHistory(settings.maintenanceHistory ?? [], settings.healthHistory ?? []);
  const rawChangedCount = countChangedProcessed(rawContentFiles, mergedProcessedSources);
  const wikiGroups = buildWikiGroups(wiki.files, generatedAt);
  const rawTodayCount = countFilesChangedToday(rawContentFiles, generatedAt);
  const inboxTodayCount = countFilesChangedToday(inbox.files, generatedAt);
  const wikiTodayCount = countFilesChangedToday(wiki.files.filter((file) => file.path !== "wiki/index.md"), generatedAt);
  const warnings = buildWarnings({
    rulesFileExists,
    rawExists: raw.exists,
    wikiExists: wiki.exists,
    trackerExists,
    lastError: settings.lastError,
    scanLimited: raw.limited || wiki.limited || outputs.limited || inbox.limited
  });
  const health = buildHealth({
    settings,
    generatedAt,
    latestExternalCheckAt: 0,
    maintenanceHistory,
    latestReportFindings: reportFindings,
    rulesFileExists,
    rawExists: raw.exists,
    wikiExists: wiki.exists,
    wikiIndexExists,
    trackerExists,
    rawChangedCount,
    inboxCount: inbox.fileCount,
    warnings
  });
  const checkFreshness = buildCheckFreshness(settings.healthHistory ?? [], generatedAt, 0, maintenanceHistory);
  return {
    generatedAt,
    vaultName: path12.basename(vaultPath),
    vaultPath,
    rulesFilePath,
    rulesFileExists,
    initialization: {
      status: settings.initialization.status,
      rulesFilePath: settings.initialization.rulesFilePath,
      templateVersion: settings.initialization.templateVersion,
      initializedAt: settings.initialization.initializedAt
    },
    lastRun: {
      status: settings.lastRunStatus,
      at: settings.lastRunAt,
      reportPath,
      reportExists,
      error: settings.lastError
    },
    tracker: {
      path: trackerPath,
      exists: trackerExists,
      trackedCount: Object.keys(mergedProcessedSources).length
    },
    raw: {
      ...stripLimited(raw),
      changedCount: rawChangedCount,
      todayCount: rawTodayCount
    },
    wiki: {
      ...stripLimited(wiki),
      indexExists: wikiIndexExists,
      domainCount: await countImmediateDirectories(path12.join(vaultPath, "wiki")),
      todayCount: wikiTodayCount,
      groups: wikiGroups
    },
    outputs: {
      ...stripLimited(outputs),
      latestReportPath: reportPath,
      latestReportExists: reportExists
    },
    inbox: {
      ...stripLimited(inbox),
      todayCount: inboxTodayCount
    },
    health,
    checkFreshness,
    checkHeatmap: buildCheckHeatmap(settings.healthHistory ?? [], generatedAt, maintenanceHistory),
    warnings
  };
}
async function scanDashboardDirectory(vaultPath, relativeDir, options) {
  const root = path12.join(vaultPath, relativeDir);
  const files = [];
  const folderPaths = /* @__PURE__ */ new Set();
  const rootExists = await exists3(root);
  let limited = false;
  if (!rootExists) return { path: relativeDir, exists: false, fileCount: 0, folderCount: 0, totalSize: 0, recentFiles: [], files, limited };
  async function walk(current) {
    if (files.length >= MAX_DASHBOARD_FILES) {
      limited = true;
      return;
    }
    const entries = await fsp6.readdir(current, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (files.length >= MAX_DASHBOARD_FILES) {
        limited = true;
        return;
      }
      if (options.ignoreNames?.has(entry.name)) continue;
      if (options.skipHidden && entry.name.startsWith(".")) continue;
      const full = path12.join(current, entry.name);
      const relative10 = normalizeSlashes4(path12.relative(vaultPath, full));
      if (entry.isDirectory()) {
        folderPaths.add(relative10);
        await walk(full);
      } else if (entry.isFile()) {
        const stat10 = await fsp6.stat(full).catch(() => null);
        if (!stat10) continue;
        files.push({ path: relative10, size: stat10.size, mtime: stat10.mtimeMs });
      }
    }
  }
  await walk(root);
  const recentFiles = [...files].sort((left, right) => right.mtime - left.mtime).slice(0, RECENT_FILE_LIMIT);
  return {
    path: relativeDir,
    exists: true,
    fileCount: files.length,
    folderCount: folderPaths.size,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    recentFiles,
    files,
    limited
  };
}
function stripLimited(input) {
  return {
    path: input.path,
    exists: input.exists,
    fileCount: input.fileCount,
    folderCount: input.folderCount,
    totalSize: input.totalSize,
    recentFiles: input.recentFiles
  };
}
function countChangedProcessed(files, processed) {
  return files.filter((file) => {
    const previous = processed[file.path];
    return !previous || previous.size !== file.size || previous.mtime !== file.mtime;
  }).length;
}
async function readReportFindings(vaultPath, reportPath) {
  const empty = { checkedAt: 0, brokenLinks: 0, orphanPages: 0, staleItems: 0, indexInvalid: false };
  const normalized = normalizeRelativePath2(reportPath, "");
  if (!normalized) return empty;
  const absolute = path12.join(vaultPath, normalized);
  const [text, stat10] = await Promise.all([
    fsp6.readFile(absolute, "utf8").catch(() => ""),
    fsp6.stat(absolute).catch(() => null)
  ]);
  if (!text.trim() || !stat10) return empty;
  return {
    checkedAt: stat10.mtimeMs,
    brokenLinks: firstNumber(text, [
      /(?:实质性断链|硬断链|断链)[：:]\s*(\d+)/i,
      /(?:实质性断链|硬断链|断链)[^\d\n]*(\d+)\s*处/i
    ]),
    orphanPages: firstNumber(text, [
      /孤儿页面[：:]\s*(\d+)/i,
      /孤儿页面[^\d\n]*(\d+)\s*个/i
    ]),
    staleItems: firstNumber(text, [
      /(?:过时\/草稿内容|过时内容|过时或草稿内容)[：:]\s*(\d+)/i,
      /(?:过时|draft|草稿)[^\d\n]*(\d+)\s*处/i
    ]),
    indexInvalid: /索引链接[：:](?!\s*全部有效)/.test(text) || /wiki\/index\.md[^\n]*(缺失|无效|不存在)/i.test(text)
  };
}
function firstNumber(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return Number(match[1]) || 0;
  }
  return 0;
}
async function resolveLatestReportPath(vaultPath, configuredPath, outputFiles) {
  const normalized = normalizeRelativePath2(configuredPath, "");
  if (normalized && await exists3(path12.join(vaultPath, normalized))) return normalized;
  const latest = outputFiles.filter((file) => /^outputs\/(?:maintenance\/)?kb-maintenance-.+\.md$/i.test(file.path)).sort((left, right) => right.mtime - left.mtime)[0];
  return latest?.path ?? normalized;
}
async function countImmediateDirectories(root) {
  const entries = await fsp6.readdir(root, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).length;
}
function buildHealth(input) {
  const critical = [];
  const risk = [];
  if (!input.rulesFileExists) critical.push("\u89C4\u5219\u6587\u4EF6\u7F3A\u5931");
  if (!input.rawExists) critical.push("raw \u76EE\u5F55\u7F3A\u5931");
  if (!input.wikiExists) critical.push("wiki \u76EE\u5F55\u7F3A\u5931");
  if (!input.wikiIndexExists) critical.push("wiki/index.md \u7F3A\u5931");
  if (!input.trackerExists) critical.push("tracker \u7F3A\u5931");
  const history = normalizeHealthHistory(input.settings.healthHistory ?? []);
  const latestHistory = latestHealthEntry(history);
  const latestMaintenance = latestMaintenanceEntry(input.maintenanceHistory);
  const latestRecordedAt = Math.max(latestHistory?.at ?? 0, latestMaintenance?.at ?? 0);
  const latestRecordedStatus = latestMaintenance && latestMaintenance.at >= (latestHistory?.at ?? 0) ? latestMaintenance.status : latestHistory?.status;
  const latestCheckAt = Math.max(latestRecordedAt, input.latestExternalCheckAt);
  const latestCheckFailed = Boolean(latestRecordedStatus === "failed" && latestRecordedAt >= input.latestExternalCheckAt);
  if (latestCheckFailed) critical.push("\u6700\u8FD1\u4F53\u68C0\u5931\u8D25");
  if (input.rawChangedCount > 20) critical.push(`Raw \u5F85\u63D0\u70BC ${input.rawChangedCount} \u4E2A`);
  else if (input.rawChangedCount > 5) risk.push(`Raw \u5F85\u63D0\u70BC ${input.rawChangedCount} \u4E2A`);
  if (input.inboxCount > 30) critical.push(`Inbox \u79EF\u538B ${input.inboxCount} \u4E2A`);
  else if (input.inboxCount > 10) risk.push(`Inbox \u79EF\u538B ${input.inboxCount} \u4E2A`);
  if (input.latestReportFindings.indexInvalid) critical.push("\u7D22\u5F15\u94FE\u63A5\u5F02\u5E38");
  if (input.latestReportFindings.brokenLinks > 0) risk.push(`\u65AD\u94FE ${input.latestReportFindings.brokenLinks} \u5904`);
  if (input.latestReportFindings.orphanPages > 0) risk.push(`\u5B64\u513F\u9875\u9762 ${input.latestReportFindings.orphanPages} \u4E2A`);
  if (input.latestReportFindings.staleItems > 0) risk.push(`\u8FC7\u65F6/\u8349\u7A3F ${input.latestReportFindings.staleItems} \u5904`);
  const nonCriticalWarnings = input.warnings.filter((warning) => !critical.includes(warning));
  if (nonCriticalWarnings.length) risk.push(`\u5B58\u5728\u8B66\u544A\uFF1A${nonCriticalWarnings.join("\uFF0C")}`);
  const score = healthScore({
    criticalCount: critical.length,
    riskCount: risk.length,
    rawChangedCount: input.rawChangedCount,
    inboxCount: input.inboxCount,
    brokenLinks: input.latestReportFindings.brokenLinks,
    orphanPages: input.latestReportFindings.orphanPages,
    staleItems: input.latestReportFindings.staleItems
  });
  const scoreStatus = critical.length || score < 60 ? "bad" : risk.length || score < 85 ? "risk" : "healthy";
  const status = scoreStatus;
  const label = status === "healthy" ? "\u5065\u5EB7" : status === "risk" ? "\u98CE\u9669" : "\u5F02\u5E38";
  const scoreReasons = [...critical, ...risk];
  const reasons = scoreReasons.length ? scoreReasons : ["\u77E5\u8BC6\u5E93\u7ED3\u6784\u6B63\u5E38\uFF0C\u5F85\u5904\u7406\u6570\u91CF\u5728\u5B89\u5168\u8303\u56F4"];
  return {
    status,
    label,
    score,
    reasons,
    lastCheckAt: latestCheckAt,
    streakDays: countHealthStreakDays(history, input.maintenanceHistory)
  };
}
function buildCheckFreshness(history, generatedAt, externalCheckAt = 0, maintenanceHistory = []) {
  const normalized = normalizeHealthHistory(history);
  const latestHistory = latestHealthEntry(normalized);
  const latestMaintenance = latestMaintenanceEntry(maintenanceHistory);
  const latestCheckAt = Math.max(latestHistory?.at ?? 0, latestMaintenance?.at ?? 0, externalCheckAt);
  if (!latestCheckAt) {
    return {
      status: "missing",
      label: "\u65E0\u68C0",
      score: 0,
      lastCheckAt: 0,
      daysSinceCheck: -1,
      reasons: ["\u6CA1\u6709\u4F53\u68C0\u8BB0\u5F55\uFF1B\u8FD9\u53EA\u4EE3\u8868\u7F3A\u5C11\u786E\u8BA4\uFF0C\u4E0D\u4EE3\u8868\u77E5\u8BC6\u5E93\u5DF2\u7ECF\u574F\u4E86"]
    };
  }
  const days = daysBetweenDateKeys(formatLocalDateKey2(latestCheckAt), formatLocalDateKey2(generatedAt));
  const score = Math.max(0, Math.min(100, 100 - days * 8));
  const status = score >= 80 ? "fresh" : score >= 50 ? "stale" : "bad";
  const label = status === "fresh" ? "\u65B0\u9C9C" : status === "stale" ? "\u5F85\u68C0" : "\u8FC7\u671F";
  return {
    status,
    label,
    score,
    lastCheckAt: latestCheckAt,
    daysSinceCheck: days,
    reasons: [days === 0 ? "\u4ECA\u5929\u5DF2\u786E\u8BA4" : `${days} \u5929\u524D\u786E\u8BA4\uFF1B\u8FD9\u4E0D\u5F71\u54CD\u77E5\u8BC6\u5E93\u5065\u5EB7\u5206`]
  };
}
function healthScore(input) {
  const rawPenalty = input.rawChangedCount > 20 ? 20 : input.rawChangedCount > 5 ? 10 : 0;
  const inboxPenalty = input.inboxCount > 30 ? 20 : input.inboxCount > 10 ? 10 : 0;
  const reportPenalty = Math.min(24, input.brokenLinks * 6) + Math.min(12, input.orphanPages * 4) + Math.min(8, input.staleItems * 2);
  return Math.max(0, Math.min(100, 100 - input.criticalCount * 24 - input.riskCount * 2 - rawPenalty - inboxPenalty - reportPenalty));
}
function buildWikiGroups(files, generatedAt) {
  const groups = /* @__PURE__ */ new Map();
  for (const file of files) {
    const parts = file.path.split("/");
    if (parts.length < 3 || parts[0] !== "wiki") continue;
    const folder = parts[1];
    if (!folder || folder.startsWith(".")) continue;
    const groupPath = `wiki/${folder}`;
    const group = groups.get(groupPath) ?? { path: groupPath, label: folder, totalCount: 0, sharePercent: 0, todayCount: 0 };
    group.totalCount += 1;
    if (isSameLocalDay(file.mtime, generatedAt)) group.todayCount += 1;
    groups.set(groupPath, group);
  }
  const result = Array.from(groups.values()).sort((left, right) => left.path.localeCompare(right.path));
  const total = result.reduce((sum, group) => sum + group.totalCount, 0);
  for (const group of result) {
    group.sharePercent = total ? Math.round(group.totalCount / total * 100) : 0;
  }
  return result;
}
function countFilesChangedToday(files, generatedAt) {
  return files.filter((file) => isSameLocalDay(file.mtime, generatedAt)).length;
}
function isSameLocalDay(leftMs, rightMs) {
  return formatLocalDateKey2(leftMs) === formatLocalDateKey2(rightMs);
}
function normalizeMaintenanceHistory(history, legacyHistory) {
  const byDate = /* @__PURE__ */ new Map();
  const add = (entry) => {
    if (!isKnowledgeBaseHeatmapMode(entry.mode)) return;
    const current = byDate.get(entry.date);
    if (current && current.at > entry.at) return;
    byDate.set(entry.date, entry);
  };
  for (const entry of normalizeHealthHistory(legacyHistory)) {
    add({ ...entry, mode: "lint", reportPath: "" });
  }
  for (const entry of history) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || entry.status !== "success" && entry.status !== "failed") continue;
    add(entry);
  }
  return Array.from(byDate.values()).sort((left, right) => left.date.localeCompare(right.date));
}
function isKnowledgeBaseHeatmapMode(mode) {
  return mode === "lint" || mode === "maintain" || mode === "reingest";
}
function statusByCheckDate(history, maintenanceHistory) {
  const byDate = /* @__PURE__ */ new Map();
  for (const entry of normalizeMaintenanceHistory(maintenanceHistory, [])) {
    byDate.set(entry.date, entry.status);
  }
  for (const entry of normalizeHealthHistory(history)) {
    byDate.set(entry.date, entry.status);
  }
  return byDate;
}
function buildCheckHeatmap(history, generatedAt, maintenanceHistory = []) {
  const byDate = statusByCheckDate(history, maintenanceHistory);
  const year = new Date(generatedAt).getFullYear();
  const cursor = parseDateKey(`${year}-01-01`);
  const days = [];
  while (cursor.getFullYear() === year) {
    const date = formatLocalDateKey2(cursor.getTime());
    days.push({
      date,
      status: byDate.get(date) ?? "none"
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
function countHealthStreakDays(history, maintenanceHistory = []) {
  const byDate = statusByCheckDate(history, maintenanceHistory);
  const latest = Array.from(byDate.entries()).sort((left, right) => left[0].localeCompare(right[0])).at(-1);
  if (!latest || latest[1] !== "success") return 0;
  let count = 0;
  let cursor = latest[0];
  while (byDate.get(cursor) === "success") {
    count += 1;
    cursor = shiftDate(cursor, -1);
  }
  return count;
}
function latestMaintenanceEntry(history) {
  const normalized = normalizeMaintenanceHistory(history, []);
  return normalized.length ? normalized[normalized.length - 1] : null;
}
function latestHealthEntry(history) {
  return history.length ? history[history.length - 1] : null;
}
function normalizeHealthHistory(history) {
  return history.filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && (entry.status === "success" || entry.status === "failed")).sort((left, right) => left.date.localeCompare(right.date));
}
function daysBetweenDateKeys(left, right) {
  const leftDate = parseDateKey(left);
  const rightDate = parseDateKey(right);
  return Math.max(0, Math.round((rightDate.getTime() - leftDate.getTime()) / 864e5));
}
function shiftDate(dateKey, days) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return formatLocalDateKey2(date.getTime());
}
function parseDateKey(value) {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}
function formatLocalDateKey2(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function isRawProcessingSource(file) {
  if (file.path === "raw/index.md") return false;
  const lower = file.path.toLowerCase();
  if (lower.endsWith(".base") || lower.endsWith(".base.md")) return false;
  if (lower.includes(".assets/")) return false;
  return RAW_PROCESSING_EXTENSIONS.has(path12.extname(lower));
}
function buildWarnings(input) {
  const warnings = [];
  if (!input.rulesFileExists) warnings.push("\u89C4\u5219\u6587\u4EF6\u7F3A\u5931");
  if (!input.rawExists) warnings.push("raw \u76EE\u5F55\u7F3A\u5931");
  if (!input.wikiExists) warnings.push("wiki \u76EE\u5F55\u7F3A\u5931");
  if (!input.trackerExists) warnings.push("tracker \u7F3A\u5931");
  if (input.lastError.trim()) warnings.push("\u6700\u8FD1\u4EFB\u52A1\u6709\u9519\u8BEF");
  if (input.scanLimited) warnings.push("\u6587\u4EF6\u8F83\u591A\uFF0C\u4EC5\u7EDF\u8BA1\u524D 3000 \u4E2A");
  return warnings;
}
function normalizeRelativePath2(value, fallback) {
  const clean = value.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  return clean || fallback;
}
async function exists3(filePath) {
  return fsp6.access(filePath, fs5.constants.F_OK).then(() => true, () => false);
}
function normalizeSlashes4(value) {
  return value.split(path12.sep).join("/");
}

// src/knowledge-base/journal.ts
var fs6 = __toESM(require("fs"));
var fsp7 = __toESM(require("fs/promises"));
var os3 = __toESM(require("os"));
var path13 = __toESM(require("path"));
var WEEKDAYS = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"];
var DEFAULT_JOURNAL_ROOT = "journal";
var DEFAULT_DAILY_ROOT = "journal/daily";
function stripJournalPrefix(value) {
  return value.replace(/^(\/journal|\/daily|\/diary|\/日记|写日记|记日记|日报|journal)[:：\s]*/i, "").trim();
}
async function resolveJournalDailyTarget(vaultPath, userRequest, now = /* @__PURE__ */ new Date()) {
  const targetDate = parseJournalTargetDate(userRequest, now);
  const dateKey = formatDate2(targetDate);
  const monthKey = `${targetDate.getFullYear()}-${pad3(targetDate.getMonth() + 1)}`;
  const yearKey = String(targetDate.getFullYear());
  const weekday = WEEKDAYS[targetDate.getDay()];
  const layout = await detectJournalLayout(vaultPath);
  const dailyDir = layout.useMonthFolders ? `${layout.dailyRootPath}/${monthKey}` : layout.dailyRootPath;
  const relativePath = normalizeSlashes5(`${dailyDir}/${dateKey}-${weekday}.md`);
  const evidenceWindow = buildJournalEvidenceWindow(targetDate);
  return {
    targetDate,
    dateKey,
    monthKey,
    yearKey,
    weekday,
    rootPath: layout.rootPath,
    dailyRootPath: layout.dailyRootPath,
    relativePath,
    absolutePath: path13.join(vaultPath, relativePath),
    templateDirectories: buildJournalTemplateDirectories(layout.rootPath, layout.dailyRootPath, monthKey, yearKey),
    samplePaths: await collectRecentJournalSamples(vaultPath, layout.dailyRootPath, relativePath),
    evidenceWindow,
    codexSessionsPath: path13.join(os3.homedir(), ".codex", "sessions"),
    codexSessionGlobs: buildCodexSessionGlobs(evidenceWindow)
  };
}
async function ensureJournalTargetFolders(vaultPath, target) {
  for (const dir of target.templateDirectories) {
    await fsp7.mkdir(path13.join(vaultPath, dir), { recursive: true });
  }
  await fsp7.mkdir(path13.dirname(target.absolutePath), { recursive: true });
}
function buildKnowledgeBaseJournalPrompt(input) {
  const generatedAt = input.generatedAt ?? /* @__PURE__ */ new Date();
  const backend = input.backend ?? "codex-cli";
  const sourceLabel = backend === "opencode" ? "OpenCode API" : "Codex CLI";
  const workLabel = backend === "opencode" ? "OpenCode" : "Codex";
  return [
    "\u4F60\u6B63\u5728\u6267\u884C Codex Obsidian Daily Journal\u3002",
    "",
    `\u8FD9\u4E2A\u4EFB\u52A1\u9ED8\u8BA4\u4E0D\u662F\u751F\u6D3B\u6563\u6587\uFF0C\u800C\u662F\u628A\u65B9\u54E5\u5F53\u5929\u5728 ${workLabel} \u91CC\u5B9E\u9645\u63A8\u8FDB\u7684\u5DE5\u4F5C\u5199\u8FDB Obsidian \u65E5\u8BB0\u3002`,
    "\u5FC5\u987B\u4F7F\u7528\u4E2D\u6587\uFF0C\u5148\u7ED9\u7ED3\u8BBA\uFF0C\u518D\u7ED9\u5173\u952E\u4F9D\u636E\uFF1B\u4E0D\u8981\u5199\u7A7A\u8BDD\uFF0C\u4E0D\u8981\u628A\u547D\u4EE4\u6D41\u6C34\u8D26\u539F\u6837\u585E\u8FDB\u53BB\u3002",
    "",
    "## \u7528\u6237\u539F\u59CB\u6307\u4EE4",
    input.userRequest.trim() || "\u5199\u65E5\u8BB0",
    "",
    "## \u76EE\u6807 Vault",
    input.vaultPath,
    "",
    "## \u76EE\u6807\u65E5\u8BB0\u6587\u4EF6",
    `- \u65E5\u671F\uFF1A${input.target.dateKey} ${input.target.weekday}`,
    `- \u6587\u4EF6\uFF1A${input.target.relativePath}`,
    `- \u65E5\u8BB0\u6839\u76EE\u5F55\uFF1A${input.target.rootPath}`,
    `- Daily \u6839\u76EE\u5F55\uFF1A${input.target.dailyRootPath}`,
    `- \u8BB0\u5F55\u6765\u6E90\uFF1A${sourceLabel}`,
    `- \u5F53\u5929\u7A97\u53E3\uFF1A${input.target.evidenceWindow.label}\uFF08\u8D77\u59CB\u542B\uFF0C\u7ED3\u675F\u4E0D\u542B\uFF09`,
    "",
    "## \u5F53\u524D journal \u76EE\u5F55\u6A21\u677F",
    ...input.target.templateDirectories.map((dir) => `- ${dir}`),
    "",
    "## \u6700\u8FD1\u65E5\u8BB0\u6837\u672C",
    ...input.target.samplePaths.length ? input.target.samplePaths.map((sample) => `- ${sample}`) : ["- \u672A\u627E\u5230\u5386\u53F2\u6837\u672C\uFF1B\u4F7F\u7528\u4E0B\u9762\u7684\u515C\u5E95\u683C\u5F0F\u3002"],
    "",
    "## \u5F53\u5929\u8BB0\u5F55\u8BFB\u53D6\u89C4\u5219",
    ...buildJournalEvidenceInstructions(backend, input.target, input.openCodeHistory),
    "",
    "## \u6267\u884C\u6B65\u9AA4",
    `1. \u5148\u8BFB\u53D6\u6700\u8FD1\u65E5\u8BB0\u6837\u672C\uFF0C\u6CBF\u7528\u5B83\u4EEC\u7684 YAML\u3001\u6807\u9898\u3001\u5206\u8282\u548C\u8BED\u6C14\u3002`,
    `2. \u6309\u201C\u5F53\u5929\u8BB0\u5F55\u8BFB\u53D6\u89C4\u5219\u201D\u63D0\u53D6 ${workLabel} \u5728\u76EE\u6807\u7A97\u53E3\u5185\u7684\u6709\u6548\u5DE5\u4F5C\u8BB0\u5F55\u3002`,
    "3. \u5F53\u5929\u7A97\u53E3\u56FA\u5B9A\u4E3A\u76EE\u6807\u65E5 00:00 \u5230\u6B21\u65E5 06:00 \u524D\uFF1B\u4E0D\u8981\u518D\u4F7F\u7528 00:00-02:30 \u65E7\u53E3\u5F84\u3002",
    "4. \u8865\u770B\u5F53\u5929 Obsidian Vault\u3001\u5F53\u524D\u5DE5\u4F5C\u76EE\u5F55\u548C\u76F8\u5173 outputs \u91CC\u771F\u5B9E\u65B0\u589E\u6216\u66F4\u65B0\u7684\u5173\u952E\u6587\u4EF6\uFF0C\u907F\u514D\u53EA\u770B\u804A\u5929\u3002",
    "5. \u5982\u679C\u76EE\u6807\u65E5\u8BB0\u5DF2\u5B58\u5728\uFF0C\u53EA\u505A\u589E\u91CF\u66F4\u65B0\uFF1B\u4FDD\u7559\u7528\u6237\u539F\u6587\uFF0C\u4E0D\u8981\u5220\u65E7\u5185\u5BB9\uFF0C\u4E0D\u8981\u91CD\u590D\u5199\u540C\u4E00\u4EF6\u4E8B\u3002",
    "6. \u5982\u679C\u76EE\u6807\u65E5\u8BB0\u4E0D\u5B58\u5728\uFF0C\u521B\u5EFA\u7236\u76EE\u5F55\u5E76\u5199\u5165\u76EE\u6807\u6587\u4EF6\uFF1B\u4E0D\u8981\u5199\u5230\u6241\u5E73\u8DEF\u5F84 journal/daily/YYYY-MM-DD.md\u3002",
    "",
    "## \u65B0\u6587\u4EF6\u515C\u5E95\u683C\u5F0F",
    "---",
    'banner: ""',
    `created: ${input.target.dateKey}`,
    `updated: ${formatDateTimeLocal(generatedAt)}`,
    "tags:",
    "  - \u65E5\u8BB0",
    "---",
    "",
    `# ${input.target.dateKey} ${input.target.weekday}`,
    "",
    "---",
    "",
    "## \u{1F6B6} \u884C\u52A8\u8F68\u8FF9",
    "",
    "### \u4ECA\u5929\u4E3B\u8981\u505A\u7684\u4E8B",
    "",
    "## \u2B50 \u4ECA\u65E5\u91CD\u5927\u4E8B\u4EF6",
    "",
    "## \u2705 \u4ECA\u65E5\u5F85\u529E",
    "",
    "## \u{1F4AD} \u4ECA\u65E5\u601D\u8003",
    "",
    "## \u{1F4D6} \u8BFB\u4E66\u5FC3\u5F97\uFF08\u65E0\u5219\u5220\uFF09",
    "",
    "## \u5199\u4F5C\u8981\u6C42",
    "- \u91CD\u70B9\u5199\u4ECA\u5929\u771F\u5B9E\u505A\u6210\u4E86\u4EC0\u4E48\u3001\u505A\u51FA\u4EC0\u4E48\u51B3\u5B9A\u3001\u4EA7\u51FA\u54EA\u4E9B\u6587\u4EF6\u6216\u8D44\u6E90\u3002",
    "- \u5185\u5BB9\u4E0D\u591F\u5C31\u77ED\u4E00\u70B9\uFF1B\u8BC1\u636E\u4E0D\u8DB3\u5C31\u660E\u786E\u5C11\u5199\uFF0C\u4E0D\u8981\u7F16\u9020\u3002",
    "- \u5982\u679C\u7528\u6237\u53EA\u662F\u8BF4\u201C\u5199\u65E5\u8BB0\u201D\uFF0C\u4E5F\u8981\u81EA\u52A8\u6267\u884C\uFF0C\u4E0D\u8981\u53CD\u95EE\u3002",
    "- \u6700\u7EC8\u5FC5\u987B\u628A\u65E5\u8BB0\u5199\u5165\u76EE\u6807\u6587\u4EF6\u3002",
    "",
    "## \u5B8C\u6210\u540E\u56DE\u590D",
    `\u53EA\u7B80\u77ED\u8BF4\u660E\u5DF2\u5199\u5165\uFF1A${input.target.relativePath}`,
    "",
    "\u5F00\u59CB\u6267\u884C\u3002"
  ].join("\n");
}
function buildJournalEvidenceWindow(targetDate) {
  const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
  const end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1, 6, 0, 0, 0);
  return {
    start,
    end,
    startMs: start.getTime(),
    endMs: end.getTime(),
    label: `${formatDateTimeDisplay(start)} - ${formatDateTimeDisplay(end)}`
  };
}
function buildJournalEvidenceInstructions(backend, target, openCodeHistory) {
  if (backend === "opencode") {
    return [
      "- \u5F53\u524D\u77E5\u8BC6\u5E93\u540E\u7AEF\u662F OpenCode API\uFF0C\u6240\u4EE5\u201C\u5F53\u5929\u8BB0\u5F55\u201D\u5FC5\u987B\u6309 OpenCode \u804A\u5929\u8BB0\u5F55\u7406\u89E3\uFF0C\u4E0D\u8981\u518D\u8BFB\u53D6 Codex sessions \u5F53\u4F5C\u4E3B\u8BC1\u636E\u3002",
      "- \u63D2\u4EF6\u5DF2\u5728\u6267\u884C\u524D\u901A\u8FC7 OpenCode API \u7684 `session.list` / `session.messages` \u8BFB\u53D6\u76EE\u6807\u7A97\u53E3\u5185\u8BB0\u5F55\uFF1B\u4F18\u5148\u4F7F\u7528\u4E0B\u9762\u7684 OpenCode \u8BC1\u636E\u6458\u8981\u3002",
      "- \u5982\u679C\u6458\u8981\u4E3A\u7A7A\uFF0C\u8BF4\u660E OpenCode \u5728\u8BE5\u7A97\u53E3\u5185\u6CA1\u6709\u53EF\u7528\u804A\u5929\u8BB0\u5F55\uFF1B\u65B0\u7528\u6237\u9996\u6B21\u5199\u65E5\u8BB0\u65F6\u4ECD\u8981\u6309 journal \u6A21\u677F\u521B\u5EFA\u76EE\u6807\u6587\u4EF6\uFF0C\u4F46\u5185\u5BB9\u8981\u77ED\uFF0C\u4E0D\u8981\u7F16\u9020\u3002",
      "- \u5982\u9700\u590D\u6838\u672C\u673A\u539F\u59CB\u8BB0\u5F55\uFF0C\u53EF\u53C2\u8003 OpenCode \u672C\u5730\u5E93 `~/.opencode/opencode.db` \u7684 `sessions` / `messages` \u8868\uFF0C\u4F46\u4E0D\u8981\u628A\u5B83\u5F53\u6210 Codex \u8BB0\u5F55\u3002",
      "",
      "### OpenCode \u5F53\u5929\u804A\u5929\u8BB0\u5F55\u6458\u8981",
      ...formatOpenCodeHistoryForPrompt(openCodeHistory, target.evidenceWindow)
    ];
  }
  return [
    "- \u5F53\u524D\u77E5\u8BC6\u5E93\u540E\u7AEF\u662F Codex CLI\uFF0C\u6240\u4EE5\u201C\u5F53\u5929\u8BB0\u5F55\u201D\u9ED8\u8BA4\u8BFB\u53D6 Codex \u4F1A\u8BDD\u8BB0\u5F55\u3002",
    "- \u8BFB\u53D6\u4E0B\u9762\u4E24\u4E2A\u65E5\u671F\u76EE\u5F55\uFF0C\u5E76\u53EA\u4FDD\u7559\u76EE\u6807\u7A97\u53E3\u5185\u7684\u6D88\u606F\u3001\u5DE5\u5177\u8C03\u7528\u3001\u6587\u4EF6\u53D8\u66F4\u548C\u6700\u7EC8\u4EA7\u7269\uFF1A",
    ...target.codexSessionGlobs.map((glob) => `  - ${glob}`),
    `- \u8FC7\u6EE4\u7A97\u53E3\uFF1A${target.evidenceWindow.label}\uFF08\u8D77\u59CB\u542B\uFF0C\u7ED3\u675F\u4E0D\u542B\uFF09\u3002`,
    "- \u4E0D\u8981\u628A\u547D\u4EE4\u548C JSONL \u539F\u6837\u6284\u8FDB\u65E5\u8BB0\uFF0C\u8981\u5148\u6D88\u5316\u6210\u6B63\u5E38\u4EBA\u80FD\u8BFB\u61C2\u7684\u5DE5\u4F5C\u8FDB\u5C55\u3002"
  ];
}
function formatOpenCodeHistoryForPrompt(snapshot, window2) {
  if (!snapshot) {
    return [
      `- \u672A\u8BFB\u53D6\u5230 OpenCode API \u6458\u8981\uFF1B\u76EE\u6807\u7A97\u53E3\u4ECD\u662F ${window2.label}\u3002`,
      "- \u5982\u679C\u4F60\u65E0\u6CD5\u590D\u6838 OpenCode \u5386\u53F2\uFF0C\u53EA\u80FD\u57FA\u4E8E\u7528\u6237\u672C\u6B21\u6307\u4EE4\u3001\u6700\u8FD1\u65E5\u8BB0\u6837\u672C\u548C\u771F\u5B9E\u6587\u4EF6\u53D8\u66F4\u5199\u77ED\u7248\u3002"
    ];
  }
  const lines = [
    `- OpenCode Server\uFF1A${snapshot.serverUrl || "\u672A\u77E5"}`,
    `- \u626B\u63CF\u4F1A\u8BDD\uFF1A${snapshot.sessionsScanned} \u4E2A\uFF1B\u547D\u4E2D\u4F1A\u8BDD\uFF1A${snapshot.sessionsMatched} \u4E2A\uFF1B\u547D\u4E2D\u6D88\u606F\uFF1A${snapshot.messages.length} \u6761\u3002`,
    snapshot.truncated ? "- \u6458\u8981\u5DF2\u622A\u65AD\uFF0C\u53EA\u80FD\u4F7F\u7528\u5DF2\u63D0\u4F9B\u7684\u8BC1\u636E\uFF0C\u4E0D\u8981\u731C\u672A\u63D0\u4F9B\u5185\u5BB9\u3002" : ""
  ].filter(Boolean);
  if (!snapshot.messages.length) {
    lines.push("- \u8BE5\u7A97\u53E3\u5185\u6CA1\u6709 OpenCode \u804A\u5929\u8BB0\u5F55\u3002");
    return lines;
  }
  for (const message of snapshot.messages) {
    lines.push(
      [
        `- ${message.createdAtLabel} ${message.role} \xB7 ${message.sessionTitle || message.sessionId}`,
        message.modelLabel ? `  \u6A21\u578B\uFF1A${message.modelLabel}` : "",
        message.directory ? `  \u5DE5\u4F5C\u533A\uFF1A${message.directory}` : "",
        "  \u5185\u5BB9\uFF1A",
        ...message.text.split(/\r?\n/).filter(Boolean).map((line) => `  ${line}`)
      ].filter(Boolean).join("\n")
    );
  }
  return lines;
}
function parseJournalTargetDate(userRequest, now) {
  const normalized = userRequest.trim();
  const explicit = normalized.match(/(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?/);
  if (explicit) return localDate(Number(explicit[1]), Number(explicit[2]), Number(explicit[3]), now);
  const monthDay = normalized.match(/(?:^|[^\d])(\d{1,2})月(\d{1,2})日?/);
  if (monthDay) return localDate(now.getFullYear(), Number(monthDay[1]), Number(monthDay[2]), now);
  if (/前天/.test(normalized)) return addDays(now, -2);
  if (/昨天/.test(normalized)) return addDays(now, -1);
  if (/明天/.test(normalized)) return addDays(now, 1);
  return localDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now);
}
function localDate(year, month, day, sourceTime) {
  return new Date(year, month - 1, day, sourceTime.getHours(), sourceTime.getMinutes(), sourceTime.getSeconds(), sourceTime.getMilliseconds());
}
function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}
function buildCodexSessionGlobs(window2) {
  return [window2.start, addDays(window2.start, 1)].map((date) => path13.join(os3.homedir(), ".codex", "sessions", String(date.getFullYear()), pad3(date.getMonth() + 1), pad3(date.getDate()), "*.jsonl"));
}
async function detectJournalLayout(vaultPath) {
  const candidates = [
    { rootPath: DEFAULT_JOURNAL_ROOT, dailyRootPath: DEFAULT_DAILY_ROOT },
    { rootPath: "01-\u65E5\u8BB0", dailyRootPath: "01-\u65E5\u8BB0" }
  ];
  let best = candidates[0];
  let bestScore = -1;
  for (const candidate of candidates) {
    const root = path13.join(vaultPath, candidate.rootPath);
    const dailyRoot = path13.join(vaultPath, candidate.dailyRootPath);
    const score = Number(await exists4(root)) * 10 + Number(await exists4(dailyRoot)) * 20 + await countMonthDirs(dailyRoot) * 5 + await countMarkdownFiles(dailyRoot, 20);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  const dailyRootAbsolute = path13.join(vaultPath, best.dailyRootPath);
  const monthDirCount = await countMonthDirs(dailyRootAbsolute);
  const flatFileCount = await countFlatDailyFiles(dailyRootAbsolute);
  return {
    ...best,
    useMonthFolders: monthDirCount > 0 || flatFileCount === 0
  };
}
function buildJournalTemplateDirectories(rootPath, dailyRootPath, monthKey, yearKey) {
  if (rootPath === "01-\u65E5\u8BB0") {
    return [rootPath, `${dailyRootPath}/${monthKey}`].map(normalizeSlashes5);
  }
  return [
    rootPath,
    dailyRootPath,
    `${dailyRootPath}/${monthKey}`,
    `${rootPath}/weekly`,
    `${rootPath}/monthly`,
    `${rootPath}/monthly/${yearKey}`,
    `${rootPath}/quarterly`,
    `${rootPath}/yearly`
  ].map(normalizeSlashes5);
}
async function collectRecentJournalSamples(vaultPath, dailyRootPath, targetRelativePath) {
  const root = path13.join(vaultPath, dailyRootPath);
  const files = await walkMarkdownFiles(root).catch(() => []);
  const stats = await Promise.all(files.map(async (file) => ({
    file,
    mtime: await fsp7.stat(file).then((item) => item.mtimeMs, () => 0)
  })));
  return stats.map((item) => ({ ...item, relativePath: normalizeSlashes5(path13.relative(vaultPath, item.file)) })).filter((item) => item.relativePath !== targetRelativePath && /\/\d{4}-\d{2}\/\d{4}-\d{2}-\d{2}-周[一二三四五六日]\.md$/.test(`/${item.relativePath}`)).sort((left, right) => right.mtime - left.mtime || right.relativePath.localeCompare(left.relativePath)).slice(0, 3).map((item) => item.relativePath);
}
async function countMonthDirs(dir) {
  const entries = await fsp7.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}$/.test(entry.name)).length;
}
async function countFlatDailyFiles(dir) {
  const entries = await fsp7.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isFile() && /^\d{4}-\d{2}-\d{2}(?:-周[一二三四五六日])?\.md$/.test(entry.name)).length;
}
async function countMarkdownFiles(dir, limit) {
  const files = await walkMarkdownFiles(dir, limit).catch(() => []);
  return files.length;
}
async function walkMarkdownFiles(dir, limit = 200) {
  const result = [];
  async function walk(current) {
    if (result.length >= limit) return;
    const entries = await fsp7.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (result.length >= limit) return;
      const full = path13.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && /\.md$/i.test(entry.name)) result.push(full);
    }
  }
  await walk(dir);
  return result;
}
async function exists4(filePath) {
  return fsp7.access(filePath, fs6.constants.F_OK).then(() => true, () => false);
}
function formatDate2(date) {
  return `${date.getFullYear()}-${pad3(date.getMonth() + 1)}-${pad3(date.getDate())}`;
}
function formatDateTimeLocal(date) {
  return `${formatDate2(date)}T${pad3(date.getHours())}:${pad3(date.getMinutes())}`;
}
function formatDateTimeDisplay(date) {
  return `${formatDate2(date)} ${pad3(date.getHours())}:${pad3(date.getMinutes())}`;
}
function pad3(value) {
  return String(value).padStart(2, "0");
}
function normalizeSlashes5(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

// src/knowledge-base/query.ts
var fsp8 = __toESM(require("fs/promises"));
var path14 = __toESM(require("path"));
var WIKI_MATCH_LIMIT = 8;
var MAX_FILE_CHARS = 12e4;
var MAX_EXCERPT_LINES = 4;
var ASK_SOURCE_ROOTS = [
  { bucket: "wiki", dir: "wiki" },
  { bucket: "journal", dir: "journal" },
  { bucket: "outputs", dir: "outputs" }
];
async function findKnowledgeBaseAskMatches(vaultPath, question, limit = WIKI_MATCH_LIMIT) {
  const terms = extractSearchTerms(question);
  const matches = [];
  for (const root of ASK_SOURCE_ROOTS) {
    const files = await listMarkdownFiles(path14.join(vaultPath, root.dir)).catch(() => []);
    for (const absolutePath of files) {
      const relativePath = normalizeRelativePath3(path14.relative(vaultPath, absolutePath));
      const stat10 = await fsp8.stat(absolutePath).catch(() => null);
      if (!stat10?.isFile()) continue;
      const raw = await fsp8.readFile(absolutePath, "utf8").catch(() => "");
      const text = raw.slice(0, MAX_FILE_CHARS);
      const title = titleForKnowledgeFile(relativePath, text);
      const score = scoreKnowledgeNote(question, terms, relativePath, title, text);
      if (score <= 0) continue;
      const excerptLines = buildExcerptLines(text, terms);
      const relevance = relevanceForMatch(root.bucket, score);
      matches.push({
        relativePath,
        absolutePath,
        size: stat10.size,
        mtime: stat10.mtimeMs,
        mime: "text/markdown",
        modality: "text",
        changed: false,
        bucket: root.bucket,
        title,
        score,
        excerpt: excerptLines.join("\n"),
        excerptLines,
        relevance,
        reason: reasonForMatch(root.bucket, score, question, terms, relativePath, title, text)
      });
    }
  }
  return matches.sort((left, right) => right.score - left.score || left.relativePath.localeCompare(right.relativePath)).slice(0, limit);
}
function buildKnowledgeBaseCitationSummary(matches) {
  const counts = { wiki: 0, journal: 0, outputs: 0 };
  const citations = matches.map((match) => {
    counts[match.bucket] += 1;
    return {
      bucket: match.bucket,
      title: match.title,
      path: match.relativePath,
      excerptLines: match.excerptLines.slice(0, MAX_EXCERPT_LINES),
      relevance: match.relevance,
      reason: match.reason,
      score: match.score
    };
  });
  return {
    status: evidenceStatusForCitations(citations),
    counts,
    citations
  };
}
function stripAskCommand(text) {
  return text.replace(/^\/(?:ask|query|问|查询)(?:[\s:：?？]+)?/iu, "").trim() || text.trim();
}
function formatAskMatchesForPrompt(matches) {
  if (!matches.length) return "- \u672A\u627E\u5230\u76F8\u5173\u672C\u5730\u6765\u6E90\u3002";
  return matches.map((match, index) => {
    return [
      `### ${index + 1}. ${match.relativePath}`,
      `\u6765\u6E90\u96C6\u5408\uFF1A${bucketLabel(match.bucket)}`,
      `\u6807\u9898\uFF1A${match.title}`,
      `\u76F8\u5173\u5EA6\uFF1A${match.score}`,
      `\u8BC1\u636E\u5F3A\u5EA6\uFF1A${match.relevance === "strong" ? "\u5F3A\u8BC1\u636E" : "\u5F31\u76F8\u5173"}`,
      `\u4E3A\u4EC0\u4E48\u76F8\u5173\uFF1A${match.reason}`,
      "\u5F15\u7528\u7247\u6BB5\uFF1A",
      match.excerpt || "\uFF08\u65E0\u53EF\u7528\u6458\u5F55\uFF09"
    ].join("\n");
  }).join("\n\n");
}
async function listMarkdownFiles(root) {
  const entries = await fsp8.readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const absolutePath = path14.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdownFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) files.push(absolutePath);
  }
  return files;
}
function extractSearchTerms(question) {
  const terms = /* @__PURE__ */ new Set();
  const lower = question.toLowerCase();
  for (const match of lower.matchAll(/[a-z0-9][a-z0-9_-]{1,}/g)) {
    if (!isStopWord(match[0])) terms.add(match[0]);
  }
  for (const match of question.matchAll(/[\u3400-\u9fff]{2,}/g)) {
    const text = match[0];
    if (!isStopWord(text)) terms.add(text);
    for (let size = 2; size <= Math.min(4, text.length); size++) {
      for (let index = 0; index <= text.length - size; index++) {
        const term = text.slice(index, index + size);
        if (!isStopWord(term)) terms.add(term);
      }
    }
  }
  return Array.from(terms).slice(0, 80);
}
function scoreKnowledgeNote(question, terms, relativePath, title, text) {
  const normalizedQuestion = normalizeForSearch(question);
  const normalizedPath = normalizeForSearch(relativePath);
  const normalizedTitle = normalizeForSearch(title);
  const normalizedText = normalizeForSearch(text);
  let score = 0;
  if (normalizedQuestion.length >= 4 && normalizedText.includes(normalizedQuestion)) score += 80;
  for (const term of terms) {
    const normalizedTerm = normalizeForSearch(term);
    if (!normalizedTerm) continue;
    if (normalizedPath.includes(normalizedTerm)) score += 18;
    if (normalizedTitle.includes(normalizedTerm)) score += 24;
    const hits = countOccurrences(normalizedText, normalizedTerm);
    if (hits) score += Math.min(hits, 8) * Math.max(2, Math.min(normalizedTerm.length, 8));
  }
  return score;
}
function buildExcerptLines(text, terms) {
  const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trimEnd());
  const nonEmpty = lines.findIndex((line) => line.trim());
  if (nonEmpty < 0) return [];
  const hitIndex = lines.findIndex((line) => lineMatchesTerms(line, terms));
  const start = Math.max(0, (hitIndex >= 0 ? hitIndex : nonEmpty) - 1);
  const excerpt = lines.slice(start, start + MAX_EXCERPT_LINES).map((line) => line.trim()).filter(Boolean);
  if (excerpt.length >= 2 || start + MAX_EXCERPT_LINES >= lines.length) return excerpt;
  for (let index = start + MAX_EXCERPT_LINES; index < lines.length && excerpt.length < 2; index++) {
    const line = lines[index].trim();
    if (line) excerpt.push(line);
  }
  return excerpt;
}
function titleForKnowledgeFile(relativePath, text) {
  const heading = text.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;
  return path14.basename(relativePath).replace(/\.(md|markdown)$/i, "");
}
function normalizeForSearch(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}
function countOccurrences(text, term) {
  if (!term) return 0;
  let count = 0;
  let index = text.indexOf(term);
  while (index >= 0 && count < 20) {
    count++;
    index = text.indexOf(term, index + term.length);
  }
  return count;
}
function normalizeRelativePath3(value) {
  return value.replace(/\\/g, "/");
}
function relevanceForMatch(bucket, score) {
  if (bucket === "wiki" && score >= 32) return "strong";
  if (score >= 72) return "strong";
  return "weak";
}
function evidenceStatusForCitations(citations) {
  if (!citations.length) return "none";
  return citations.some((citation) => citation.relevance === "strong") ? "strong" : "weak";
}
function reasonForMatch(bucket, score, question, terms, relativePath, title, text) {
  const normalizedQuestion = normalizeForSearch(question);
  const normalizedPath = normalizeForSearch(relativePath);
  const normalizedTitle = normalizeForSearch(title);
  const normalizedText = normalizeForSearch(text);
  const matchedTerms = terms.filter((term) => normalizedText.includes(normalizeForSearch(term)));
  const titleOrPathHit = terms.some((term) => {
    const normalizedTerm = normalizeForSearch(term);
    return normalizedPath.includes(normalizedTerm) || normalizedTitle.includes(normalizedTerm);
  });
  if (normalizedQuestion.length >= 4 && normalizedText.includes(normalizedQuestion)) return "\u95EE\u9898\u539F\u6587\u5728\u6B63\u6587\u4E2D\u76F4\u63A5\u51FA\u73B0\u3002";
  if (titleOrPathHit && matchedTerms.length >= 2) return "\u6807\u9898\u6216\u8DEF\u5F84\u4E0E\u6B63\u6587\u540C\u65F6\u547D\u4E2D\u95EE\u9898\u5173\u952E\u8BCD\u3002";
  if (bucket === "wiki" && matchedTerms.length >= 2) return "Wiki \u7B14\u8BB0\u6B63\u6587\u591A\u5904\u547D\u4E2D\u95EE\u9898\u5173\u952E\u8BCD\u3002";
  if (matchedTerms.length >= 2) return "\u6B63\u6587\u547D\u4E2D\u591A\u4E2A\u95EE\u9898\u5173\u952E\u8BCD\uFF0C\u53EF\u4F5C\u4E3A\u80CC\u666F\u4F9D\u636E\u3002";
  if (titleOrPathHit) return "\u6807\u9898\u6216\u8DEF\u5F84\u547D\u4E2D\u95EE\u9898\u5173\u952E\u8BCD\u3002";
  return score >= 32 ? "\u6B63\u6587\u547D\u4E2D\u95EE\u9898\u5173\u952E\u8BCD\u3002" : "\u53EA\u6709\u5C11\u91CF\u5173\u952E\u8BCD\u547D\u4E2D\uFF0C\u76F8\u5173\u6027\u8F83\u5F31\u3002";
}
function lineMatchesTerms(line, terms) {
  const normalizedLine = normalizeForSearch(line);
  return terms.some((term) => {
    const normalizedTerm = normalizeForSearch(term);
    return normalizedTerm && normalizedLine.includes(normalizedTerm);
  });
}
function bucketLabel(bucket) {
  if (bucket === "wiki") return "Wiki";
  if (bucket === "journal") return "Journal";
  return "Outputs";
}
function isStopWord(value) {
  return (/* @__PURE__ */ new Set([
    "\u4EC0\u4E48",
    "\u600E\u4E48",
    "\u600E\u6837",
    "\u5982\u4F55",
    "\u662F\u5426",
    "\u662F\u4E0D\u662F",
    "\u80FD\u4E0D\u80FD",
    "\u6709\u6CA1\u6709",
    "\u5173\u7CFB",
    "\u533A\u522B",
    "\u4ECA\u5929",
    "\u77E5\u8BC6\u5E93",
    "where",
    "what",
    "why",
    "how",
    "answer",
    "base",
    "check",
    "citation",
    "citations",
    "context",
    "evidence",
    "file",
    "files",
    "knowledge",
    "local",
    "note",
    "notes",
    "question",
    "related",
    "source",
    "sources",
    "should",
    "test",
    "testing",
    "totally",
    "unrelated",
    "vault",
    "could",
    "can",
    "the",
    "and",
    "with"
  ])).has(value.toLowerCase());
}

// src/knowledge-base/prompt.ts
function buildKnowledgeBasePrompt(input) {
  const sourceLines = input.sources.length ? input.sources.map((source) => `- ${source.relativePath} | ${source.mime} | ${Math.round(source.size / 1024)} KB | ${source.changed ? "\u65B0\u589E/\u53D8\u66F4" : "\u5DF2\u5904\u7406"}`).join("\n") : "- \u672C\u8F6E\u6CA1\u6709\u68C0\u6D4B\u5230\u65B0\u589E\u6216\u53D8\u66F4 raw \u6587\u4EF6\uFF1B\u8BF7\u6267\u884C\u4F53\u68C0\u5E76\u751F\u6210 no-op \u7EF4\u62A4\u62A5\u544A\u3002";
  const task = taskForMode(input.mode);
  const rulesMode = input.useCustomRulesFile ? `\u81EA\u5B9A\u4E49\u89C4\u5219\u6587\u4EF6\uFF1A${input.rulesFilePath}\u3002\u77E5\u8BC6\u5E93\u7ED3\u6784\u4EE5\u8FD9\u4E2A\u6587\u4EF6\u4E3A\u51C6\uFF1B\u4E0D\u8981\u628A ${AGENTS_RULES_FILE} \u5F53\u4F5C\u77E5\u8BC6\u5E93\u89C4\u5219\u5408\u5E76\u3002` : `\u9ED8\u8BA4\u89C4\u5219\u6587\u4EF6\uFF1A${input.rulesFilePath}\u3002\u5982\u679C\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6\uFF1B\u5982\u679C\u4E0D\u5B58\u5728\uFF0C\u6309\u672C\u63D0\u793A\u7684\u5B89\u5168\u8FB9\u754C\u6267\u884C\u3002`;
  return [
    "\u4F60\u6B63\u5728 Obsidian Vault \u5185\u6267\u884C\u77E5\u8BC6\u5E93\u7EF4\u62A4\u4EFB\u52A1\u3002",
    "",
    "\u5FC5\u987B\u4F7F\u7528\u4E2D\u6587\uFF0C\u5148\u7ED9\u7ED3\u8BBA\uFF0C\u518D\u7ED9\u4F9D\u636E\u3002",
    "\u8BF7\u9075\u5B88\u4E0B\u9762\u6307\u5B9A\u7684\u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357\u6587\u4EF6\u3002",
    "",
    "## \u4EFB\u52A1",
    task,
    input.userRequest?.trim() ? `\u7528\u6237\u539F\u59CB\u6307\u4EE4\uFF1A${input.userRequest.trim()}` : "",
    "",
    "## Vault",
    input.vaultPath,
    "",
    "## \u5FC5\u8BFB\u6587\u4EF6\u72B6\u6001",
    `- \u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357\uFF1A${rulesMode}`,
    `- ${input.rulesFilePath}: ${input.rulesFileExists ? "\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6" : "\u4E0D\u5B58\u5728"}`,
    `- raw/index.md: ${input.hasRawIndex ? "\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6" : "\u4E0D\u5B58\u5728"}`,
    `- wiki/index.md: ${input.hasWikiIndex ? "\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6" : "\u4E0D\u5B58\u5728"}`,
    `- outputs/.ingest-tracker.md: ${input.hasTracker ? "\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6" : "\u4E0D\u5B58\u5728\uFF0C\u53EF\u521B\u5EFA\u6216\u8865\u9F50"}`,
    "",
    "## \u6807\u51C6\u6267\u884C\u6B65\u9AA4",
    "1. Discover \u589E\u91CF\u68C0\u6D4B\uFF1A\u8BFB\u53D6 raw/index.md\uFF1B\u7528 find \u5217\u51FA raw/\u3001inbox/\u3001outputs/\u3001projects/ \u4E0B\u77E5\u8BC6\u533A\u6587\u4EF6\u53CA\u4FEE\u6539\u65F6\u95F4\uFF0C\u91CD\u70B9\u5BF9\u6BD4 raw/ \u4E0E outputs/.ingest-tracker.md\u3002\u8DF3\u8FC7 raw/ \u4E2D\u4EE5 .base \u7ED3\u5C3E\u7684\u8F85\u52A9\u6587\u4EF6\u3002",
    "2. Ingest \u6D88\u5316\uFF1A\u53EA\u5904\u7406\u65B0\u589E/\u53D8\u66F4\u8D44\u6599\uFF1B\u4ECE wiki/index.md \u4E2D\u9009\u62E9\u6700\u5339\u914D\u9886\u57DF\uFF1B\u5199\u5165 wiki/<\u9886\u57DF>/ \u7684 concepts/\u3001guides/\u3001references/ \u7B49\u5408\u9002\u5B50\u6587\u4EF6\u5939\u3002",
    "3. Structure Normalize\uFF1A\u4F60\u53EF\u4EE5\u6574\u7406 wiki/\u3001outputs/\u3001inbox/\u3001projects/ \u7684\u6587\u4EF6\u5939\u7ED3\u6784\uFF1Braw \u8DEF\u5F84\u6574\u7406\u7531\u63D2\u4EF6\u5728\u4EFB\u52A1\u7ED3\u675F\u540E\u6267\u884C\u786E\u5B9A\u6027\u79FB\u52A8\uFF0C\u4E0D\u8981\u76F4\u63A5\u79FB\u52A8\u3001\u91CD\u547D\u540D\u6216\u6539\u5199 raw \u6E90\u6587\u4EF6\u3002",
    "4. Wiki \u7B14\u8BB0\u683C\u5F0F\uFF1A\u5305\u542B frontmatter\uFF08created/updated/tags\uFF09\u3001raw \u539F\u6587\u56DE\u94FE\u30013-5 \u53E5\u6838\u5FC3\u8981\u70B9\u3001\u5173\u952E\u6982\u5FF5\u548C\u672F\u8BED\u3001\u4E0E\u65E2\u6709 wiki \u6982\u5FF5\u7684\u53CC\u5411\u94FE\u63A5\u3002",
    "5. \u7D22\u5F15\u66F4\u65B0\uFF1A\u65B0\u589E\u3001\u79FB\u52A8\u6216\u66F4\u65B0\u9875\u9762\u540E\uFF0C\u540C\u6B65\u66F4\u65B0 wiki/index.md\u3001\u5BF9\u5E94\u9886\u57DF 00-\u7D22\u5F15.md\u3001raw/index.md\u3001projects/00-\u7D22\u5F15.md \u548C outputs/.ingest-tracker.md\u3002",
    "6. Lint \u4F53\u68C0\uFF1A\u626B\u63CF wiki/ \u4E0B [[\u94FE\u63A5]]\uFF0C\u68C0\u67E5\u65AD\u94FE\u3001\u5B64\u513F\u9875\u9762\u3001\u8FC7\u65F6\u6216 draft \u5185\u5BB9\u3001\u6839\u76EE\u5F55\u6563\u843D\u666E\u901A\u7B14\u8BB0\u3001\u4E2D\u6587\u76EE\u5F55\u6B8B\u7559\uFF0C\u4EE5\u53CA wiki/index.md \u94FE\u63A5\u6709\u6548\u6027\u3002",
    "7. \u62A5\u544A\u8F93\u51FA\uFF1A\u5982\u679C\u6CA1\u6709\u4EFB\u4F55\u53D8\u5316\uFF0C\u62A5\u544A\u5199\u201C\u65E0\u53D8\u5316\u201D\uFF1B\u5982\u679C\u65E0\u6CD5\u5224\u65AD\u5F52\u5C5E\u9886\u57DF\uFF0C\u8DF3\u8FC7\u5E76\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u3002",
    "",
    "## \u672C\u8F6E raw \u6765\u6E90",
    sourceLines,
    "",
    "## \u77E5\u8BC6\u5E93\u7BA1\u7406\u5199\u5165\u8FB9\u754C",
    "- \u4EE5\u4E0B\u8FB9\u754C\u53EA\u9002\u7528\u4E8E\u672C\u6B21\u77E5\u8BC6\u5E93\u7BA1\u7406\u4EFB\u52A1\uFF1B\u4E0D\u8981\u628A\u5B83\u6269\u5C55\u6210\u666E\u901A Agent \u5BF9\u8BDD\u7684\u5168\u5C40\u9650\u5236\u3002",
    "- \u53EF\u4EE5\u5199\u5165\u548C\u6574\u7406\uFF1Awiki/\u3001outputs/\u3001inbox/\u3001projects/\uFF1Braw/index.md \u53EF\u66F4\u65B0\u7D22\u5F15\u3002",
    "- \u4E0D\u7EB3\u5165\u6BCF\u65E5\u81EA\u52A8\u6574\u7406\uFF1Ajournal/\u3001work/\u3001templates/\u3001testing/\u3001\u9876\u5C42 assets/\u3002",
    "- raw/ \u6E90\u6587\u4EF6\u6B63\u6587\u53EA\u8BFB\uFF1A\u4E0D\u5F97\u5199\u5165\u3001\u8986\u76D6\u3001\u683C\u5F0F\u5316\u3001\u8865 frontmatter\u3001\u6539 updated \u5B57\u6BB5\u3001\u79FB\u52A8\u6216\u91CD\u547D\u540D raw \u6E90\u6587\u4EF6\u53CA\u5BF9\u5E94 .assets \u9644\u4EF6\u76EE\u5F55\u3002",
    "- raw \u8DEF\u5F84\u5141\u8BB8\u7ED3\u6784\u6574\u7406\uFF0C\u4F46\u53EA\u80FD\u7531\u63D2\u4EF6\u7684 Structure Normalize \u5728 Agent \u7ED3\u675F\u540E\u6267\u884C\uFF1B\u4F60\u53EA\u9700\u8981\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u5EFA\u8BAE\u6216\u98CE\u9669\u3002",
    "- \u7981\u6B62\u5220\u9664 raw/\uFF0C\u7981\u6B62\u81EA\u52A8\u5F52\u6863 raw/\uFF0C\u7981\u6B62\u5408\u5E76 raw/ \u539F\u6587\u3002",
    "- \u4F4E\u98CE\u9669\u81EA\u52A8\u6267\u884C\uFF1A\u53EA\u79FB\u52A8 wiki/outputs/inbox/projects \u6587\u4EF6\u6216\u76EE\u5F55\uFF1B\u76EE\u6807\u76EE\u5F55\u89C4\u5219\u660E\u786E\uFF1B\u65E0\u540C\u540D\u51B2\u7A81\uFF1B\u5F15\u7528\u548C tracker \u53EF\u81EA\u52A8\u540C\u6B65\u3002",
    "- \u4E0D\u786E\u5B9A\u6216\u4F1A\u65AD\u94FE\u7684\u6539\u52A8\u53EA\u5199\u8FDB\u62A5\u544A\uFF1A\u76EE\u6807\u76EE\u5F55\u4E0D\u786E\u5B9A\u3001\u540C\u540D\u51B2\u7A81\u3001\u9644\u4EF6\u4E0D\u5339\u914D\u3001\u8DE8\u51FA\u77E5\u8BC6\u533A\u3001\u6D89\u53CA\u5220\u9664/\u5408\u5E76/\u5F52\u6863\u3001\u6D89\u53CA journal/work/templates/testing/assets\u3002",
    "- \u6587\u4EF6\u79FB\u52A8\u540E\u5FC5\u987B\u540C\u6B65 wiki \u4E2D\u65E7 raw \u94FE\u63A5\u3001raw/index.md\u3001wiki/index.md\u3001\u9886\u57DF 00-\u7D22\u5F15.md\u3001outputs/.ingest-tracker.md\u3001projects/00-\u7D22\u5F15.md\u3002",
    "",
    "## \u8F93\u51FA\u8981\u6C42",
    `- \u7EF4\u62A4\u62A5\u544A\u5FC5\u987B\u5199\u5165\uFF1A${input.reportPath}`,
    "- \u62A5\u544A\u5305\u542B\uFF1A\u4E00\u773C\u7ED3\u8BBA\u3001\u65B0\u589E/\u53D8\u66F4\u6587\u4EF6\u3001\u5DF2\u6D88\u5316\u3001\u7ED3\u6784\u6574\u7406\u3001\u4F53\u68C0\u53D1\u73B0\u3001\u7D22\u5F15\u66F4\u65B0\u3001\u98CE\u9669/\u9700\u786E\u8BA4\u3002",
    "- \u5982\u679C\u672C\u8F6E\u6D88\u5316\u4E86 raw \u6587\u4EF6\uFF0C\u5FC5\u987B\u66F4\u65B0 outputs/.ingest-tracker.md\u3002",
    "- \u6D88\u5316\u540E\u7684 wiki \u9875\u9762\u5FC5\u987B\u5305\u542B raw \u6765\u6E90\u56DE\u94FE\u3002",
    "- \u5BF9\u56FE\u7247/PDF \u7684\u7406\u89E3\u5FC5\u987B\u57FA\u4E8E\u6A21\u578B\u5B9E\u9645\u8BFB\u53D6\u5230\u7684\u5185\u5BB9\uFF1B\u5982\u679C\u4E0D\u80FD\u8BFB\u53D6\uFF0C\u5199\u660E\u5931\u8D25\u539F\u56E0\uFF0C\u4E0D\u8981\u7F16\u9020\u3002",
    "",
    "\u5F00\u59CB\u6267\u884C\u3002"
  ].join("\n");
}
function buildKnowledgeBaseAskPrompt(input) {
  const rulesMode = input.useCustomRulesFile ? `\u81EA\u5B9A\u4E49\u89C4\u5219\u6587\u4EF6\uFF1A${input.rulesFilePath}\u3002\u77E5\u8BC6\u5E93\u7ED3\u6784\u4EE5\u8FD9\u4E2A\u6587\u4EF6\u4E3A\u51C6\uFF1B\u4E0D\u8981\u628A ${AGENTS_RULES_FILE} \u5F53\u4F5C\u77E5\u8BC6\u5E93\u89C4\u5219\u5408\u5E76\u3002` : `\u9ED8\u8BA4\u89C4\u5219\u6587\u4EF6\uFF1A${input.rulesFilePath}\u3002\u5982\u679C\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6\uFF1B\u5982\u679C\u4E0D\u5B58\u5728\uFF0C\u6309\u672C\u63D0\u793A\u7684\u5B89\u5168\u8FB9\u754C\u6267\u884C\u3002`;
  return [
    "\u4F60\u6B63\u5728 Obsidian Vault \u5185\u56DE\u7B54\u77E5\u8BC6\u5E93\u95EE\u9898\u3002",
    "",
    "\u5FC5\u987B\u4F7F\u7528\u4E2D\u6587\uFF0C\u5148\u7ED9\u7ED3\u8BBA\uFF0C\u518D\u7ED9\u4F9D\u636E\u3002",
    "\u8FD9\u662F\u53EA\u8BFB\u95EE\u7B54\u4EFB\u52A1\uFF1A\u4E0D\u8981\u521B\u5EFA\u3001\u4FEE\u6539\u3001\u5220\u9664\u6216\u79FB\u52A8\u4EFB\u4F55\u6587\u4EF6\u3002",
    "",
    "## \u7528\u6237\u95EE\u9898",
    input.userRequest.trim(),
    "",
    "## Vault",
    input.vaultPath,
    "",
    "## \u5FC5\u8BFB\u6587\u4EF6\u72B6\u6001",
    `- \u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357\uFF1A${rulesMode}`,
    `- ${input.rulesFilePath}: ${input.rulesFileExists ? "\u5B58\u5728\uFF0C\u5FC5\u987B\u8BFB\u53D6" : "\u4E0D\u5B58\u5728"}`,
    "",
    "## \u76F8\u5173\u672C\u5730\u6765\u6E90",
    formatAskMatchesForPrompt(input.matches),
    "",
    "## \u56DE\u7B54\u89C4\u5219",
    "- \u5148\u68C0\u67E5\u5E76\u4F18\u5148\u5F15\u7528\u4E0A\u9762\u7684\u672C\u5730\u6765\u6E90\uFF1B\u5982\u679C\u5DF2\u9644\u5E26\u6587\u4EF6\uFF0C\u8BF7\u8BFB\u53D6\u6587\u4EF6\u786E\u8BA4\u4E0A\u4E0B\u6587\uFF0C\u4E0D\u8981\u53EA\u770B\u6458\u5F55\u3002",
    "- Wiki \u662F\u4F18\u5148\u4F9D\u636E\uFF1BJournal / Outputs \u53EA\u4F5C\u4E3A\u80CC\u666F\u6216\u8FC7\u7A0B\u4F9D\u636E\uFF0C\u4E0D\u80FD\u5938\u5927\u6210\u7A33\u5B9A\u7ED3\u8BBA\u3002",
    "- \u672C\u5730\u6765\u6E90\u4E0D\u662F\u552F\u4E00\u4F9D\u636E\uFF1B\u53EF\u4EE5\u4F7F\u7528\u53EF\u7528\u641C\u7D22\u5DE5\u5177\u3001\u5916\u90E8\u8D44\u6599\u6216\u6A21\u578B\u5DF2\u6709\u77E5\u8BC6\u8865\u5145\u3002",
    "- \u5FC5\u987B\u533A\u5206\u201C\u6765\u81EA Vault \u7684\u4F9D\u636E\u201D\u548C\u201C\u8865\u5145\u4FE1\u606F / \u63A8\u65AD\u201D\u3002",
    "- \u5982\u679C\u6CA1\u6709\u547D\u4E2D\u76F8\u5173\u672C\u5730\u6765\u6E90\uFF0C\u660E\u786E\u8BF4\u660E\u201C\u672A\u627E\u5230\u76F8\u5173\u672C\u5730\u4F9D\u636E\u201D\uFF0C\u518D\u57FA\u4E8E\u53EF\u7528\u641C\u7D22\u6216\u901A\u7528\u77E5\u8BC6\u56DE\u7B54\u3002",
    "- \u4E0D\u786E\u5B9A\u7684\u4FE1\u606F\u8981\u660E\u786E\u6807\u6CE8\uFF0C\u4E0D\u8981\u7F16\u9020\u6765\u6E90\u3002",
    "- \u5F15\u7528 Vault \u5185\u5BB9\u65F6\u5199\u51FA\u76F8\u5BF9\u8DEF\u5F84\uFF1B\u5F15\u7528\u5916\u90E8\u641C\u7D22\u65F6\u5199\u51FA\u6765\u6E90\u540D\u79F0\u6216\u94FE\u63A5\u3002",
    "",
    "## \u8F93\u51FA\u683C\u5F0F",
    "1. \u4E00\u773C\u7ED3\u8BBA",
    "2. Vault \u4F9D\u636E",
    "3. \u8865\u5145\u4FE1\u606F",
    "4. \u4E0D\u786E\u5B9A / \u4E0B\u4E00\u6B65",
    "",
    "\u5F00\u59CB\u56DE\u7B54\u3002"
  ].join("\n");
}
function taskForMode(mode) {
  if (mode === "lint") return "\u53EA\u6267\u884C Lint \u4F53\u68C0\uFF0C\u4E0D\u505A\u65B0\u589E\u6D88\u5316\u3002";
  if (mode === "reingest") return "\u6267\u884C\u91CD\u65B0\u63D0\u70BC\uFF1A\u6309\u7528\u6237\u6307\u5B9A\u8D44\u6599\u91CD\u65B0\u751F\u6210\u6216\u66F4\u65B0 wiki\uFF1B\u5982\u679C\u672A\u6307\u5B9A\u5177\u4F53\u8D44\u6599\uFF0C\u53EA\u5904\u7406\u6700\u8FD1 raw\uFF0C\u4E0D\u5168\u5E93\u91CD\u5199\u3002";
  if (mode === "outputs") return "\u5904\u7406 outputs\uFF1A\u626B\u63CF outputs/ \u4E2D\u7684\u534F\u4F5C\u4EA7\u7269\uFF0C\u53EA\u628A\u6709\u957F\u671F\u590D\u7528\u4EF7\u503C\u7684\u89C2\u70B9\u3001\u65B9\u6CD5\u3001\u6846\u67B6\u3001\u51B3\u7B56\u63D0\u70BC\u56DE wiki\uFF1B\u4E34\u65F6\u62A5\u544A\u3001\u53D1\u5E03\u8349\u7A3F\u3001\u4E00\u6B21\u6027\u8FC7\u7A0B\u8BB0\u5F55\u53EA\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\uFF0C\u4E0D\u8981\u5168\u91CF\u642C\u8FD0\u3002";
  if (mode === "inbox") return "\u5904\u7406 inbox\uFF1A\u6309\u77E5\u8BC6\u5E93\u89C4\u5219\u5F52\u7C7B inbox \u5185\u5BB9\uFF0C\u5FC5\u8981\u65F6\u6C89\u6DC0\u5230 wiki/journal/outputs\uFF1B\u4E0D\u8981\u5220\u9664\u539F\u6587\u4EF6\uFF0C\u5904\u7406\u7ED3\u679C\u5199\u62A5\u544A\u3002";
  return "\u6267\u884C Ingest + Structure Normalize + Lint\uFF1A\u6D88\u5316\u65B0\u589E/\u53D8\u66F4 raw \u8D44\u6599\uFF0C\u6574\u7406\u77E5\u8BC6\u533A\u6587\u4EF6\u5939\u7ED3\u6784\uFF0C\u66F4\u65B0 wiki\u3001\u7D22\u5F15\u3001tracker \u4E0E\u7EF4\u62A4\u62A5\u544A\u3002";
}

// src/knowledge-base/raw-integrity.ts
var fsp10 = __toESM(require("fs/promises"));
var path16 = __toESM(require("path"));

// src/knowledge-base/structure-normalizer.ts
var fs7 = __toESM(require("fs"));
var fsp9 = __toESM(require("fs/promises"));
var path15 = __toESM(require("path"));
var KNOWLEDGE_ROOTS = ["raw", "wiki", "outputs", "inbox", "projects"];
var TEXT_EXTENSIONS = /* @__PURE__ */ new Set([".md", ".markdown", ".txt", ".html"]);
var CHINESE_TEXT = /\p{Script=Han}/u;
var FIXED_MOVES = [
  { from: "raw/articles/GitHub\u9879\u76EE\u6536\u96C6", to: "raw/articles/github-trending", kind: "directory", reason: "raw \u6765\u6E90\u76EE\u5F55\u82F1\u6587\u5316" },
  { from: "raw/articles/OpenAI\u5B98\u65B9\u6587\u6863", to: "raw/articles/openai-docs", kind: "directory", reason: "raw \u6765\u6E90\u76EE\u5F55\u82F1\u6587\u5316" },
  { from: "raw/articles/\u5FAE\u4FE1\u516C\u4F17\u53F7", to: "raw/articles/wechat-official-accounts", kind: "directory", reason: "raw \u6765\u6E90\u76EE\u5F55\u82F1\u6587\u5316" },
  { from: "raw/articles/\u98DE\u4E66\u6587\u6863", to: "raw/articles/feishu-docs", kind: "directory", reason: "raw \u6765\u6E90\u76EE\u5F55\u82F1\u6587\u5316" },
  { from: "raw/clippings/\u6587\u7AE0", to: "raw/clippings/articles", kind: "directory", reason: "raw \u526A\u85CF\u76EE\u5F55\u82F1\u6587\u5316" },
  { from: "raw/\u7B56\u7565\u4FE1\u53F7\u7CFB\u7EDF\u4ECB\u7ECD.md", to: "raw/articles/investment/\u7B56\u7565\u4FE1\u53F7\u7CFB\u7EDF\u4ECB\u7ECD.md", kind: "file", reason: "raw \u6839\u76EE\u5F55\u666E\u901A\u8D44\u6599\u5F52\u5165\u6295\u8D44\u6765\u6E90", moveAssetsWithMarkdown: true },
  { from: "inbox/Clippings", to: "inbox/clippings", kind: "directory", reason: "inbox \u526A\u85CF\u76EE\u5F55\u82F1\u6587\u5316" },
  { from: "inbox/\u684C\u9762 TodoList \u8C03\u7814", to: "inbox/research/desktop-todolist", kind: "directory", reason: "inbox \u8C03\u7814\u8D44\u6599\u5F52\u5165 research" },
  { from: "inbox/skills-local-audit.md", to: "inbox/research/skills-local-audit.md", kind: "file", reason: "inbox \u6839\u76EE\u5F55\u8C03\u7814\u7B14\u8BB0\u5F52\u5165 research" },
  { from: "inbox/\u65E5\u5E38\u8BB0\u5F55.md", to: "inbox/ideas/\u65E5\u5E38\u8BB0\u5F55.md", kind: "file", reason: "inbox \u6839\u76EE\u5F55\u60F3\u6CD5\u7B14\u8BB0\u5F52\u5165 ideas" }
];
var PROJECT_PHASE_DIRS = [
  { fromName: "10-\u6C89\u6DC0", toName: "insights", reason: "\u9879\u76EE\u6C89\u6DC0\u9636\u6BB5\u76EE\u5F55\u82F1\u6587\u5316" },
  { fromName: "20-\u5B9E\u8DF5", toName: "execution", reason: "\u9879\u76EE\u5B9E\u8DF5\u9636\u6BB5\u76EE\u5F55\u82F1\u6587\u5316" },
  { fromName: "30-\u539F\u59CB\u8D44\u6599", toName: "sources", reason: "\u9879\u76EE\u539F\u59CB\u8D44\u6599\u9636\u6BB5\u76EE\u5F55\u82F1\u6587\u5316" },
  { fromName: "99-\u5F52\u6863", toName: "archive", reason: "\u9879\u76EE\u5F52\u6863\u9636\u6BB5\u76EE\u5F55\u82F1\u6587\u5316" }
];
async function normalizeKnowledgeBaseStructure(vaultPath, options = {}) {
  const result = {
    moves: [],
    skipped: [],
    updatedLinks: [],
    remainingRootNotes: [],
    remainingChineseDirs: [],
    risks: [],
    pathRewrites: []
  };
  const candidates = await buildMoveCandidates(vaultPath);
  const seen = /* @__PURE__ */ new Set();
  for (const candidate of candidates) {
    if (seen.has(candidate.from)) continue;
    seen.add(candidate.from);
    await applyMoveCandidate(vaultPath, candidate, result);
  }
  if (result.pathRewrites.length) {
    result.updatedLinks = await updateKnowledgeBaseTextReferences(vaultPath, result.pathRewrites);
  }
  result.remainingRootNotes = await findRemainingRootNotes(vaultPath);
  result.remainingChineseDirs = await findRemainingChineseDirs(vaultPath);
  if (options.lastReportPath) {
    const rewritten = rewriteKnowledgeBaseRelativePath(options.lastReportPath, result.pathRewrites);
    if (rewritten !== normalizeSlashes6(options.lastReportPath)) result.updatedLastReportPath = rewritten;
  }
  return result;
}
function rewriteKnowledgeBaseRelativePath(relativePath, rewrites) {
  let next = normalizeSlashes6(relativePath);
  for (const rewrite2 of [...rewrites].sort((left, right) => right.from.length - left.from.length)) {
    if (next === rewrite2.from) {
      next = rewrite2.to;
      continue;
    }
    if (rewrite2.kind === "directory" && next.startsWith(`${rewrite2.from}/`)) {
      next = `${rewrite2.to}${next.slice(rewrite2.from.length)}`;
    }
  }
  return next;
}
async function buildMoveCandidates(vaultPath) {
  return [
    ...FIXED_MOVES,
    ...await outputMoveCandidates(vaultPath),
    ...await projectPhaseMoveCandidates(vaultPath)
  ];
}
async function outputMoveCandidates(vaultPath) {
  const outputsPath = path15.join(vaultPath, "outputs");
  const entries = await fsp9.readdir(outputsPath, { withFileTypes: true }).catch(() => []);
  const candidates = [];
  for (const entry of entries) {
    if (entry.name === ".DS_Store" || entry.name === ".ingest-tracker.md") continue;
    const from = `outputs/${entry.name}`;
    if (entry.isDirectory() && ["maintenance", "reviews", "publishing", "instructions", "migrations"].includes(entry.name)) continue;
    if (entry.isFile() && /^kb-maintenance-\d{4}-\d{2}-\d{2}\.md$/i.test(entry.name)) {
      candidates.push({ from, to: `outputs/maintenance/${entry.name}`, kind: "file", reason: "\u7EF4\u62A4\u62A5\u544A\u5F52\u5165 maintenance" });
      continue;
    }
    if (entry.isFile() && /^knowledge-base-review-/i.test(entry.name)) {
      candidates.push({ from, to: `outputs/reviews/${entry.name}`, kind: "file", reason: "\u77E5\u8BC6\u5E93\u5468\u62A5\u5F52\u5165 reviews" });
      continue;
    }
    if (/xhs/i.test(entry.name)) {
      candidates.push({ from, to: `outputs/publishing/xiaohongshu/${entry.name}`, kind: entry.isDirectory() ? "directory" : "file", reason: "\u5C0F\u7EA2\u4E66\u53D1\u5E03\u7D20\u6750\u5F52\u5165 publishing/xiaohongshu" });
      continue;
    }
    if (/instructions/i.test(entry.name)) {
      candidates.push({ from, to: `outputs/instructions/${entry.name}`, kind: entry.isDirectory() ? "directory" : "file", reason: "\u8BF4\u660E\u6587\u6863\u5F52\u5165 instructions" });
      continue;
    }
    if (/^old-wiki-merge-/i.test(entry.name)) {
      candidates.push({ from, to: `outputs/migrations/${entry.name}`, kind: entry.isDirectory() ? "directory" : "file", reason: "\u8FC1\u79FB\u62A5\u544A\u5F52\u5165 migrations" });
    }
  }
  return candidates;
}
async function projectPhaseMoveCandidates(vaultPath) {
  const projectsPath = path15.join(vaultPath, "projects");
  const projects = await fsp9.readdir(projectsPath, { withFileTypes: true }).catch(() => []);
  const candidates = [];
  for (const project of projects) {
    if (!project.isDirectory() || project.name.startsWith(".")) continue;
    for (const phase of PROJECT_PHASE_DIRS) {
      candidates.push({
        from: `projects/${project.name}/${phase.fromName}`,
        to: `projects/${project.name}/${phase.toName}`,
        kind: "directory",
        reason: phase.reason
      });
    }
  }
  return candidates;
}
async function applyMoveCandidate(vaultPath, candidate, result) {
  const from = normalizeSlashes6(candidate.from);
  const to = normalizeSlashes6(candidate.to);
  if (!isKnowledgeRelativePath(from) || !isKnowledgeRelativePath(to)) {
    addSkip(result, { from, to, reason: "\u8DE8\u51FA\u77E5\u8BC6\u533A\uFF0C\u8DF3\u8FC7" });
    return;
  }
  const fromAbs = path15.join(vaultPath, from);
  const toAbs = path15.join(vaultPath, to);
  if (!await exists5(fromAbs)) return;
  const stat10 = await fsp9.stat(fromAbs).catch(() => null);
  if (!stat10 || (candidate.kind === "directory" ? !stat10.isDirectory() : !stat10.isFile())) {
    addSkip(result, { from, to, reason: "\u6E90\u7C7B\u578B\u4E0D\u5339\u914D\uFF0C\u8DF3\u8FC7" });
    return;
  }
  const caseOnlyMove = await exists5(toAbs) && isCaseOnlyMove(fromAbs, toAbs);
  if (await exists5(toAbs) && !caseOnlyMove) {
    addSkip(result, { from, to, reason: "\u76EE\u6807\u8DEF\u5F84\u5DF2\u5B58\u5728\uFF0C\u5B58\u5728\u540C\u540D\u51B2\u7A81\uFF0C\u8DF3\u8FC7" });
    return;
  }
  const assetMove = await companionAssetMove(vaultPath, candidate);
  if (assetMove?.blockedReason) {
    addSkip(result, { from, to, reason: assetMove.blockedReason });
    return;
  }
  await fsp9.mkdir(path15.dirname(toAbs), { recursive: true });
  if (caseOnlyMove) await renameCaseOnly(fromAbs, toAbs);
  else await fsp9.rename(fromAbs, toAbs);
  if (assetMove?.fromAbs && assetMove.toAbs) {
    await fsp9.mkdir(path15.dirname(assetMove.toAbs), { recursive: true });
    await fsp9.rename(assetMove.fromAbs, assetMove.toAbs);
    result.pathRewrites.push({
      from: normalizeSlashes6(path15.relative(vaultPath, assetMove.fromAbs)),
      to: normalizeSlashes6(path15.relative(vaultPath, assetMove.toAbs)),
      kind: "directory"
    });
  }
  const move = { from, to, kind: candidate.kind, reason: candidate.reason };
  result.moves.push(move);
  result.pathRewrites.push({ from, to, kind: candidate.kind });
}
async function renameCaseOnly(fromAbs, toAbs) {
  const temp = await uniqueTempSibling(fromAbs);
  await fsp9.rename(fromAbs, temp);
  await fsp9.rename(temp, toAbs);
}
async function uniqueTempSibling(fromAbs) {
  const dir = path15.dirname(fromAbs);
  const base = path15.basename(fromAbs);
  for (let index = 0; index < 20; index += 1) {
    const candidate = path15.join(dir, `.codex-rename-${Date.now()}-${index}-${base}`);
    if (!await exists5(candidate)) return candidate;
  }
  throw new Error(`\u65E0\u6CD5\u521B\u5EFA\u4E34\u65F6\u91CD\u547D\u540D\u8DEF\u5F84\uFF1A${fromAbs}`);
}
async function companionAssetMove(vaultPath, candidate) {
  if (!candidate.moveAssetsWithMarkdown || candidate.kind !== "file" || path15.extname(candidate.from).toLowerCase() !== ".md") return null;
  const fromAssets = path15.join(vaultPath, stripMarkdownExtension(candidate.from) + ".assets");
  if (!await exists5(fromAssets)) return null;
  const toAssets = path15.join(vaultPath, stripMarkdownExtension(candidate.to) + ".assets");
  const stat10 = await fsp9.stat(fromAssets).catch(() => null);
  if (!stat10?.isDirectory()) return { blockedReason: "\u9644\u4EF6\u76EE\u5F55\u4E0D\u662F\u6587\u4EF6\u5939\uFF0C\u8DF3\u8FC7" };
  if (await exists5(toAssets)) return { blockedReason: "\u9644\u4EF6\u76EE\u5F55\u76EE\u6807\u5DF2\u5B58\u5728\uFF0C\u5B58\u5728\u540C\u540D\u51B2\u7A81\uFF0C\u8DF3\u8FC7" };
  return { fromAbs: fromAssets, toAbs: toAssets };
}
async function updateKnowledgeBaseTextReferences(vaultPath, rewrites) {
  const files = await walkKnowledgeTextFiles(vaultPath);
  const updated = [];
  for (const file of files) {
    const relativePath = normalizeSlashes6(path15.relative(vaultPath, file));
    const replacements = buildTextReplacementPairs(rewrites, relativePath);
    const text = await fsp9.readFile(file, "utf8").catch(() => "");
    if (!text) continue;
    let next = text;
    let count = 0;
    for (const replacement of replacements) {
      const currentCount = countOccurrences2(next, replacement.from);
      if (!currentCount) continue;
      next = next.split(replacement.from).join(replacement.to);
      count += currentCount;
    }
    if (!count || next === text) continue;
    await fsp9.writeFile(file, next, "utf8");
    updated.push({ path: relativePath, replacements: count });
  }
  return updated;
}
function buildTextReplacementPairs(rewrites, fileRelativePath) {
  const pairs = /* @__PURE__ */ new Map();
  for (const rewrite2 of rewrites) {
    pairs.set(rewrite2.from, rewrite2.to);
    if (rewrite2.kind === "file" && /\.md$/i.test(rewrite2.from)) {
      pairs.set(stripMarkdownExtension(rewrite2.from), stripMarkdownExtension(rewrite2.to));
    }
    if (rewrite2.kind === "directory" && rewrite2.from.startsWith("raw/")) {
      pairs.set(rewrite2.from.slice("raw/".length), rewrite2.to.slice("raw/".length));
    }
    if (rewrite2.kind === "directory" && rewrite2.from.startsWith("projects/")) {
      const parent = normalizeSlashes6(path15.dirname(rewrite2.from));
      if (fileRelativePath === parent || fileRelativePath.startsWith(`${parent}/`)) {
        pairs.set(path15.basename(rewrite2.from), path15.basename(rewrite2.to));
      }
    }
  }
  return Array.from(pairs.entries()).map(([from, to]) => ({ from, to })).sort((left, right) => right.from.length - left.from.length);
}
async function walkKnowledgeTextFiles(vaultPath) {
  const result = [];
  for (const root of KNOWLEDGE_ROOTS) {
    if (root === "raw") {
      const rawIndex = path15.join(vaultPath, "raw", "index.md");
      if (await exists5(rawIndex)) result.push(rawIndex);
      continue;
    }
    const rootPath = path15.join(vaultPath, root);
    result.push(...await walkTextFiles(rootPath));
  }
  return result;
}
async function walkTextFiles(dir) {
  const entries = await fsp9.readdir(dir, { withFileTypes: true }).catch(() => []);
  const result = [];
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const full = path15.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) continue;
      result.push(...await walkTextFiles(full));
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path15.extname(entry.name).toLowerCase();
    if (TEXT_EXTENSIONS.has(ext) || entry.name === ".ingest-tracker.md") result.push(full);
  }
  return result;
}
async function findRemainingRootNotes(vaultPath) {
  const allowed = {
    raw: /* @__PURE__ */ new Set(["index.md", "README.md"]),
    wiki: /* @__PURE__ */ new Set(["index.md", "README.md", "00-\u7D22\u5F15.md"]),
    outputs: /* @__PURE__ */ new Set([".ingest-tracker.md", "README.md", "index.md"]),
    inbox: /* @__PURE__ */ new Set(["README.md", "index.md"]),
    projects: /* @__PURE__ */ new Set(["00-\u7D22\u5F15.md", "README.md", "index.md"])
  };
  const notes = [];
  for (const root of KNOWLEDGE_ROOTS) {
    const entries = await fsp9.readdir(path15.join(vaultPath, root), { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile() || entry.name.startsWith(".") || path15.extname(entry.name).toLowerCase() !== ".md") continue;
      if (allowed[root]?.has(entry.name)) continue;
      notes.push(`${root}/${entry.name}`);
    }
  }
  return notes.sort((left, right) => left.localeCompare(right));
}
async function findRemainingChineseDirs(vaultPath) {
  const result = [];
  for (const root of KNOWLEDGE_ROOTS) {
    await walkDirs(path15.join(vaultPath, root), vaultPath, result);
  }
  return result.sort((left, right) => left.localeCompare(right));
}
async function walkDirs(dir, vaultPath, result) {
  const entries = await fsp9.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const full = path15.join(dir, entry.name);
    if (CHINESE_TEXT.test(entry.name) && !entry.name.endsWith(".assets")) {
      result.push(normalizeSlashes6(path15.relative(vaultPath, full)));
    }
    await walkDirs(full, vaultPath, result);
  }
}
function isKnowledgeRelativePath(relativePath) {
  const first = normalizeSlashes6(relativePath).split("/")[0];
  return KNOWLEDGE_ROOTS.includes(first);
}
function isCaseOnlyMove(fromAbs, toAbs) {
  const from = path15.resolve(fromAbs);
  const to = path15.resolve(toAbs);
  return from !== to && from.toLowerCase() === to.toLowerCase();
}
function addSkip(result, skipped) {
  result.skipped.push(skipped);
  result.risks.push(`${skipped.from}${skipped.to ? ` -> ${skipped.to}` : ""}\uFF1A${skipped.reason}`);
}
function stripMarkdownExtension(value) {
  return value.replace(/\.md$/i, "");
}
function countOccurrences2(text, search) {
  if (!search) return 0;
  return text.split(search).length - 1;
}
function normalizeSlashes6(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}
async function exists5(filePath) {
  return fsp9.access(filePath, fs7.constants.F_OK).then(() => true, () => false);
}

// src/knowledge-base/raw-integrity.ts
async function snapshotRawFiles(vaultPath) {
  const rawDir = path16.join(vaultPath, "raw");
  const files = await walkFiles2(rawDir).catch(() => []);
  const snapshot = /* @__PURE__ */ new Map();
  for (const file of files) {
    const relativePath = normalizeSlashes7(path16.relative(vaultPath, file));
    const content = await fsp10.readFile(file);
    snapshot.set(relativePath, contentFingerprint(content));
  }
  return snapshot;
}
function contentFingerprint(content) {
  let hash = 2166136261;
  for (const byte of content) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return `${content.length}:${hash.toString(16).padStart(8, "0")}`;
}
function diffRawSnapshot(before, after, rewrites = []) {
  const changed = [];
  const expectedAfterPaths = /* @__PURE__ */ new Set();
  for (const [file, hash] of sortedSnapshotEntries(before)) {
    if (isRawIndex(file)) continue;
    const mapped = rewriteKnowledgeBaseRelativePath(file, rewrites);
    expectedAfterPaths.add(mapped);
    const afterHash = after.get(mapped);
    const label = file === mapped ? file : `${file} -> ${mapped}`;
    if (!afterHash) {
      changed.push(`${label} \u5185\u5BB9\u7F3A\u5931\u6216\u88AB\u6539\u5199`);
      continue;
    }
    if (afterHash !== hash) changed.push(`${label} \u5185\u5BB9\u88AB\u6539\u5199`);
  }
  for (const [file] of sortedSnapshotEntries(after)) {
    if (isRawIndex(file) || expectedAfterPaths.has(file) || before.has(file)) continue;
    changed.push(`${file} \u65B0\u589E\u6216\u5185\u5BB9\u5F02\u5E38`);
  }
  return changed;
}
function sortedSnapshotEntries(snapshot) {
  return Array.from(snapshot.entries()).sort(([left], [right]) => left.localeCompare(right));
}
function isRawIndex(file) {
  return normalizeSlashes7(file) === "raw/index.md";
}
async function walkFiles2(dir) {
  const result = [];
  const entries = await fsp10.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path16.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walkFiles2(full));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}
function normalizeSlashes7(value) {
  return value.split(path16.sep).join("/");
}

// src/knowledge-base/schedule.ts
function shouldRunScheduledKnowledgeBaseMaintenance(settings, now = /* @__PURE__ */ new Date(), schedulerStartedAt = 0, forceCatchUp = false) {
  if (!settings.enabled || !settings.scheduleEnabled) return false;
  const scheduled = scheduledTimeForToday(settings.scheduleTime, now);
  if (!scheduled || now.getTime() < scheduled.getTime()) return false;
  const last = settings.lastRunAt ? new Date(settings.lastRunAt) : null;
  if (last && last.toDateString() === now.toDateString()) return false;
  if (forceCatchUp) return settings.catchUpOnStartup;
  if (schedulerStartedAt > scheduled.getTime() && !settings.catchUpOnStartup) return false;
  return true;
}
function scheduledTimeForToday(value, now) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  const scheduled = new Date(now);
  scheduled.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return scheduled;
}

// src/knowledge-base/scheduled-message.ts
function buildScheduledKnowledgeBaseMessage(result, reportText = "") {
  const status = result.status === "success" ? "\u6210\u529F" : result.status === "canceled" ? "\u5DF2\u53D6\u6D88" : "\u5931\u8D25";
  const summary = result.status === "success" ? extractKnowledgeBaseReportConclusion(reportText) || compactScheduledSummary(result.summary) : compactScheduledSummary(result.error || result.summary || "\u672A\u77E5\u9519\u8BEF");
  return [
    result.status === "success" ? "\u6BCF\u65E5\u7EF4\u62A4\u6267\u884C\u5B8C\u6BD5\u3002" : result.status === "canceled" ? "\u6BCF\u65E5\u7EF4\u62A4\u5DF2\u53D6\u6D88\u3002" : "\u6BCF\u65E5\u7EF4\u62A4\u6267\u884C\u5931\u8D25\u3002",
    "",
    "\u7B80\u77ED\u62A5\u544A\uFF1A",
    `- \u72B6\u6001\uFF1A${status}`,
    result.reportPath ? `- \u62A5\u544A\uFF1A${result.reportPath}` : "",
    summary ? `- \u6458\u8981\uFF1A${summary}` : ""
  ].filter(Boolean).join("\n");
}
function extractKnowledgeBaseReportConclusion(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  const match = /(?:^|\n)##\s*一眼结论\s*\n+([\s\S]*?)(?=\n##\s+|$)/.exec(normalized);
  return compactScheduledSummary(match?.[1] ?? "");
}
function compactScheduledSummary(value, maxLength = 220) {
  const compact = value.replace(/^---[\s\S]*?---/m, "").split("\n").map((line) => line.replace(/^[-*]\s+/, "").trim()).filter(Boolean).join(" ");
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 3)}...` : compact;
}

// src/knowledge-base/manager.ts
var MAX_ATTACHED_SOURCES = 20;
var KNOWLEDGE_FILE_CAPTURE_EXTENSIONS = /* @__PURE__ */ new Set([".pdf", ".docx", ".md", ".markdown", ".txt"]);
var URL_PATTERN2 = /https?:\/\/[^\s<>"')]+/i;
var KnowledgeBaseManager = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  running = false;
  scheduleTimer = null;
  schedulerStartedAt = 0;
  activeOpenCode = null;
  register() {
    this.plugin.addCommand({
      id: "knowledge-base-initialize",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u521D\u59CB\u5316 LLM Wiki",
      callback: async () => {
        await this.plugin.activateKnowledgeBaseChannel();
        this.plugin.getXiaoyuanView()?.fillKnowledgeBaseCommand("/init ");
      }
    });
    this.plugin.addCommand({
      id: "knowledge-base-maintain-now",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u7ACB\u5373\u7EF4\u62A4",
      callback: () => void this.runMaintenance("maintain")
    });
    this.plugin.addCommand({
      id: "knowledge-base-lint-now",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u53EA\u4F53\u68C0",
      callback: () => void this.runMaintenance("lint")
    });
    this.plugin.addCommand({
      id: "knowledge-base-capture-idea",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u8BB0\u5F55\u60F3\u6CD5\u5230 inbox",
      callback: () => void this.captureText("inbox")
    });
    this.plugin.addCommand({
      id: "knowledge-base-capture-link",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u6536\u96C6\u94FE\u63A5\u5230 raw",
      callback: () => void this.captureText("raw-articles")
    });
    this.plugin.addCommand({
      id: "knowledge-base-capture-active-attachment",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u6536\u96C6\u5F53\u524D\u56FE\u7247\u6216 PDF",
      callback: () => void this.captureActiveAttachment()
    });
    this.plugin.addCommand({
      id: "knowledge-base-cancel",
      name: "\u77E5\u8BC6\u5E93\uFF1A\u53D6\u6D88\u5F53\u524D\u4EFB\u52A1",
      callback: () => void this.cancelMaintenance()
    });
    this.plugin.addRibbonIcon("library", "\u77E5\u8BC6\u5E93\u7BA1\u7406", () => void this.plugin.activateKnowledgeBaseChannel());
    this.plugin.app.workspace.onLayoutReady(() => {
      this.schedulerStartedAt = Date.now();
      this.armSchedule();
      void this.runCatchUpIfNeeded();
    });
  }
  unload() {
    if (this.scheduleTimer) {
      window.clearInterval(this.scheduleTimer);
      this.scheduleTimer = null;
    }
    this.activeOpenCode = null;
  }
  get isRunning() {
    return this.running;
  }
  async getDashboardSnapshot() {
    return buildKnowledgeBaseDashboardSnapshot(this.plugin.getVaultPath(), this.plugin.settings.knowledgeBase);
  }
  async cancelMaintenance() {
    const openCodeRun = this.activeOpenCode;
    if (!this.running && !openCodeRun) {
      new import_obsidian6.Notice("\u5F53\u524D\u6CA1\u6709\u77E5\u8BC6\u5E93\u4EFB\u52A1");
      return;
    }
    if (openCodeRun?.sessionId) {
      await openCodeRun.backend.abort(openCodeRun.sessionId).catch(() => void 0);
    }
    this.activeOpenCode = null;
    this.running = false;
    this.plugin.settings.knowledgeBase.lastRunStatus = "canceled";
    this.plugin.settings.knowledgeBase.lastError = "\u7528\u6237\u53D6\u6D88";
    await this.plugin.saveSettings(true);
    new import_obsidian6.Notice("\u5DF2\u53D6\u6D88\u77E5\u8BC6\u5E93\u4EFB\u52A1");
  }
  async testOpenCodeConnection() {
    const backend = new OpenCodeBackend({
      ...this.plugin.settings.opencode,
      vaultPath: this.plugin.getVaultPath()
    });
    try {
      await backend.connect();
      const models = await backend.listModels();
      const selected = selectOpenCodeModel(
        models,
        this.plugin.settings.opencode.providerId,
        this.plugin.settings.opencode.modelId,
        ["text"]
      );
      if (selected) {
        this.plugin.settings.opencode.providerId = selected.providerId;
        this.plugin.settings.opencode.modelId = selected.modelId;
        this.plugin.settings.opencode.textEnabled = selected.inputModalities.includes("text");
        this.plugin.settings.opencode.imageEnabled = selected.inputModalities.includes("image");
        this.plugin.settings.opencode.pdfEnabled = selected.inputModalities.includes("pdf");
      }
      this.plugin.settings.opencode.lastConnectedAt = Date.now();
      this.plugin.settings.opencode.lastError = "";
      await this.plugin.saveSettings(true);
      new import_obsidian6.Notice(`OpenCode \u5DF2\u8FDE\u63A5\uFF0C\u8BFB\u53D6\u5230 ${models.length} \u4E2A\u6A21\u578B`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.plugin.settings.opencode.lastError = message;
      await this.plugin.saveSettings(true);
      new import_obsidian6.Notice(`OpenCode \u8FDE\u63A5\u5931\u8D25\uFF1A${message}`);
    } finally {
      await backend.disconnect();
    }
  }
  async handleUserMessage(text, attachments = []) {
    const command = parseKnowledgeBaseCommand(text, attachments.length);
    try {
      if (command.intent === "help") {
        return { status: "success", message: knowledgeBaseHelpText() };
      }
      if (command.intent === "chat") {
        return { status: "success", message: "\u8FD9\u6761\u6D88\u606F\u4F1A\u6309\u666E\u901A Agent \u5BF9\u8BDD\u5904\u7406\uFF1B\u9700\u8981\u67E5\u8BE2\u77E5\u8BC6\u5E93\u65F6\u8BF7\u4F7F\u7528 `/ask ...`\u3002" };
      }
      if (command.intent === "init") {
        if (command.confirm) {
          const preview2 = await this.previewInitialization();
          const result = await this.executeInitialization(preview2);
          return {
            status: "success",
            message: result.summary,
            followUpCommand: "/check \u521D\u59CB\u5316\u540E\u4F53\u68C0\u5F53\u524D vault\uFF0C\u53EA\u62A5\u544A\u95EE\u9898\uFF0C\u4E0D\u79FB\u52A8\u6587\u4EF6\uFF0C\u4E0D\u5220\u9664\u6587\u4EF6\u3002"
          };
        }
        const preview = await this.previewInitialization();
        return { status: "success", message: preview.summary };
      }
      if (command.intent === "cancel") {
        await this.cancelMaintenance();
        return { status: "success", message: "\u5DF2\u8BF7\u6C42\u53D6\u6D88\u5F53\u524D\u77E5\u8BC6\u5E93\u4EFB\u52A1\u3002" };
      }
      if (command.intent === "lint" || command.intent === "maintain" || command.intent === "reingest" || command.intent === "process-outputs" || command.intent === "process-inbox") {
        const mode = command.intent === "process-inbox" ? "inbox" : command.intent === "process-outputs" ? "outputs" : command.intent;
        const result = await this.runMaintenance(mode, text);
        if (result.status === "success") {
          return {
            status: "success",
            message: [
              `\u77E5\u8BC6\u5E93${labelForRunMode(mode)}\u5B8C\u6210\u3002`,
              result.reportPath ? `\u62A5\u544A\uFF1A${result.reportPath}` : "",
              result.summary ? `
${result.summary}` : ""
            ].filter(Boolean).join("\n")
          };
        }
        return {
          status: "failed",
          message: [
            `\u77E5\u8BC6\u5E93${labelForRunMode(mode)}\u5931\u8D25\uFF1A${result.error || "\u672A\u77E5\u9519\u8BEF"}`,
            this.formatFailureContext(result.reportPath)
          ].filter(Boolean).join("\n")
        };
      }
      if (command.intent === "ask") {
        return await this.answerQuestion(text);
      }
      if (command.intent === "review") {
        return await this.runWeeklyReview(command.reviewKind ?? "knowledge-base");
      }
      if (command.intent === "journal") {
        return await this.writeDailyJournal(text, attachments);
      }
      const target = command.target === "journal" ? "inbox" : command.target ?? (attachments.length ? "raw-attachments" : "inbox");
      const paths = await this.captureChatInput(target, text, attachments);
      return {
        status: "success",
        message: paths.length ? `\u5DF2\u6536\u96C6\u5230\uFF1A
${paths.map((item) => `- ${item}`).join("\n")}` : "\u6CA1\u6709\u53EF\u6536\u96C6\u7684\u5185\u5BB9\u3002"
      };
    } catch (error) {
      if (command.intent === "init") {
        this.plugin.settings.knowledgeBase.initialization.status = "failed";
        await this.plugin.saveSettings(true);
      }
      return {
        status: "failed",
        message: error instanceof Error ? error.message : String(error)
      };
    }
  }
  async previewInitialization() {
    const preview = await buildKnowledgeBaseInitializationPreview(this.plugin.getVaultPath());
    const init = this.plugin.settings.knowledgeBase.initialization;
    init.status = "preview-ready";
    init.rulesFilePath = preview.rulesFilePath;
    init.templateVersion = preview.templateVersion;
    init.lastPreviewSummary = preview.summary.slice(0, 2e3);
    await this.plugin.saveSettings(true);
    return preview;
  }
  async runWeeklyReview(kind) {
    const manager = this.plugin.getReviewManager();
    if (!manager) {
      return { status: "failed", message: "\u590D\u76D8\u7BA1\u7406\u5668\u672A\u521D\u59CB\u5316\u3002" };
    }
    const result = await manager.runReview(kind);
    if (result.status !== "success") {
      return {
        status: "failed",
        message: `${reviewKindLabel(kind)}\u751F\u6210\u5931\u8D25\uFF1A${result.error || "\u672A\u77E5\u9519\u8BEF"}`
      };
    }
    return {
      status: "success",
      message: [
        `${reviewKindLabel(kind)}\u5DF2\u751F\u6210\u3002`,
        `Markdown\uFF1A${result.markdownPath}`,
        `HTML\uFF1A${result.htmlPath}`
      ].join("\n")
    };
  }
  async executeInitialization(preview) {
    const result = await executeKnowledgeBaseInitialization(this.plugin.getVaultPath(), preview);
    const settings = this.plugin.settings.knowledgeBase;
    settings.initialization.status = "initialized";
    settings.initialization.initializedAt = Date.now();
    settings.initialization.rulesFilePath = result.rulesFilePath;
    settings.initialization.templateVersion = result.templateVersion;
    settings.initialization.lastPreviewSummary = preview.summary.slice(0, 2e3);
    settings.useCustomRulesFile = result.rulesFilePath !== AGENTS_RULES_FILE;
    settings.rulesFilePath = result.rulesFilePath;
    await this.plugin.saveSettings(true);
    return { summary: result.summary, rulesFilePath: result.rulesFilePath };
  }
  async runMaintenance(mode = "maintain", userRequest = "") {
    if (this.running) {
      new import_obsidian6.Notice("\u77E5\u8BC6\u5E93\u7EF4\u62A4\u6B63\u5728\u8FD0\u884C");
      return {
        status: "failed",
        reportPath: this.plugin.settings.knowledgeBase.lastReportPath,
        summary: "",
        processedSources: [],
        error: "\u5DF2\u6709\u4EFB\u52A1\u6B63\u5728\u8FD0\u884C"
      };
    }
    this.running = true;
    const settings = this.plugin.settings.knowledgeBase;
    settings.lastRunStatus = "running";
    settings.lastError = "";
    await this.plugin.saveSettings(true);
    const startedAt = Date.now();
    const vaultPath = this.plugin.getVaultPath();
    const rawBefore = await snapshotRawFiles(vaultPath);
    let discovery = null;
    try {
      discovery = await discoverKnowledgeBaseSources(vaultPath, settings.processedSources);
      await ensureKnowledgeBaseFolders(vaultPath);
      const rules = await this.resolveRulesFile();
      if (rules.useCustomRulesFile && !rules.exists) {
        throw new Error(`\u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357\u6587\u4EF6\u4E0D\u5B58\u5728\uFF1A${rules.relativePath}\u3002\u8BF7\u5728\u8BBE\u7F6E\u91CC\u4FEE\u6B63\u8DEF\u5F84\u3002`);
      }
      const promptSources = selectSourcesForRunMode(mode, discovery);
      const prompt = buildKnowledgeBasePrompt({
        vaultPath,
        mode,
        userRequest,
        reportPath: discovery.reportPath,
        sources: promptSources,
        rulesFilePath: rules.relativePath,
        rulesFileExists: rules.exists,
        useCustomRulesFile: rules.useCustomRulesFile,
        hasRawIndex: await exists6(path17.join(vaultPath, "raw", "index.md")),
        hasWikiIndex: await exists6(path17.join(vaultPath, "wiki", "index.md")),
        hasTracker: await exists6(discovery.trackerPath)
      });
      const sources = promptSources.slice(0, MAX_ATTACHED_SOURCES);
      const output = await this.runOpenCodeKnowledgeTask(prompt, sources, "workspace-write");
      const structure = mode === "maintain" ? await normalizeKnowledgeBaseStructure(vaultPath, { lastReportPath: settings.lastReportPath || discovery.reportPath }) : void 0;
      if (structure?.pathRewrites.length) {
        settings.processedSources = rewriteProcessedSources(settings.processedSources, structure.pathRewrites);
      }
      const reportPath = structure ? rewriteKnowledgeBaseRelativePath(discovery.reportPath, structure.pathRewrites) : discovery.reportPath;
      const rawAfter = await snapshotRawFiles(vaultPath);
      const rawChanges = diffRawSnapshot(rawBefore, rawAfter, structure?.pathRewrites ?? []);
      if (rawChanges.length) {
        throw new Error(`\u77E5\u8BC6\u5E93\u4EFB\u52A1\u8BD5\u56FE\u6539\u5199 raw/ \u6B63\u6587\uFF1A${rawChanges.slice(0, 5).join("\uFF0C")}`);
      }
      const processedChangedSources = await normalizeProcessedSources(vaultPath, discovery.changedSources, structure?.pathRewrites ?? []);
      if (mode === "maintain" && structure?.pathRewrites.length) {
        settings.processedSources = await syncRewrittenRawProcessedSourceStats(vaultPath, settings.processedSources, structure.pathRewrites);
      }
      if (mode === "maintain" || mode === "reingest") {
        for (const source of processedChangedSources) {
          settings.processedSources[source.relativePath] = {
            path: source.relativePath,
            size: source.size,
            mtime: source.mtime,
            digestedAt: startedAt
          };
        }
        await writeKnowledgeBaseTracker(vaultPath, settings.processedSources, startedAt);
      }
      await ensureFallbackReport(vaultPath, reportPath, {
        mode,
        output,
        sources: processedChangedSources,
        startedAt
      });
      if (structure) await appendStructureNormalizationReport(vaultPath, reportPath, structure);
      settings.lastRunAt = Date.now();
      settings.lastRunStatus = "success";
      settings.lastReportPath = reportPath;
      settings.lastSummary = buildMaintenanceSummary(output, mode, structure);
      recordKnowledgeBaseMaintenanceRun(settings, { status: "success", mode, reportPath });
      await this.plugin.saveSettings(true);
      new import_obsidian6.Notice(`\u77E5\u8BC6\u5E93${labelForRunMode(mode)}\u5B8C\u6210`);
      return {
        status: "success",
        reportPath,
        summary: settings.lastSummary,
        processedSources: processedChangedSources,
        structure
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (mode === "lint" && discovery?.reportPath) {
        const rawAfter = await snapshotRawFiles(this.plugin.getVaultPath()).catch(() => rawBefore);
        const rawChanges = diffRawSnapshot(rawBefore, rawAfter);
        const reportExcerpt = rawChanges.length ? null : await readKnowledgeBaseReportExcerpt(this.plugin.getVaultPath(), discovery.reportPath);
        if (reportExcerpt) {
          settings.lastRunAt = Date.now();
          settings.lastRunStatus = "success";
          settings.lastReportPath = discovery.reportPath;
          settings.lastError = "";
          settings.lastSummary = recoveredLintReportSummary(discovery.reportPath);
          recordKnowledgeBaseMaintenanceRun(settings, { status: "success", mode, reportPath: discovery.reportPath });
          await this.plugin.saveSettings(true);
          new import_obsidian6.Notice("\u77E5\u8BC6\u5E93\u4F53\u68C0\u5B8C\u6210\uFF0CCodex \u72B6\u6001\u6709\u8B66\u544A");
          return {
            status: "success",
            reportPath: discovery.reportPath,
            summary: settings.lastSummary,
            processedSources: []
          };
        }
      }
      settings.lastRunAt = Date.now();
      settings.lastRunStatus = "failed";
      settings.lastError = message;
      if (discovery?.reportPath) settings.lastReportPath = discovery.reportPath;
      recordKnowledgeBaseMaintenanceRun(settings, { status: "failed", mode, reportPath: discovery?.reportPath ?? "" });
      await this.plugin.saveSettings(true);
      new import_obsidian6.Notice(`\u77E5\u8BC6\u5E93${labelForRunMode(mode)}\u5931\u8D25\uFF1A${message}`);
      return {
        status: "failed",
        reportPath: discovery?.reportPath ?? "",
        summary: "",
        processedSources: discovery?.changedSources ?? [],
        error: message
      };
    } finally {
      this.activeCodexRun = null;
      this.activeOpenCode = null;
      this.running = false;
      this.plugin.getXiaoyuanView()?.refreshKnowledgeBaseDashboard();
    }
  }
  async answerQuestion(text) {
    if (this.running) {
      return { status: "failed", message: "\u5DF2\u6709\u77E5\u8BC6\u5E93\u4EFB\u52A1\u6B63\u5728\u8FD0\u884C" };
    }
    this.running = true;
    try {
      const question = stripAskCommand(text);
      const rules = await this.resolveRulesFile();
      if (rules.useCustomRulesFile && !rules.exists) {
        throw new Error(`\u77E5\u8BC6\u5E93\u64CD\u4F5C\u6307\u5357\u6587\u4EF6\u4E0D\u5B58\u5728\uFF1A${rules.relativePath}\u3002\u8BF7\u5728\u8BBE\u7F6E\u91CC\u4FEE\u6B63\u8DEF\u5F84\u3002`);
      }
      const matches = await findKnowledgeBaseAskMatches(this.plugin.getVaultPath(), question);
      const citations = buildKnowledgeBaseCitationSummary(matches);
      const prompt = buildKnowledgeBaseAskPrompt({
        vaultPath: this.plugin.getVaultPath(),
        userRequest: question,
        rulesFilePath: rules.relativePath,
        rulesFileExists: rules.exists,
        useCustomRulesFile: rules.useCustomRulesFile,
        matches
      });
      const output = await this.runOpenCodeKnowledgeTask(prompt, matches, "read-only");
      return {
        status: "success",
        message: formatAskAnswer(output, citations),
        citations
      };
    } catch (error) {
      return {
        status: "failed",
        message: error instanceof Error ? error.message : String(error)
      };
    } finally {
      this.activeCodexRun = null;
      this.activeOpenCode = null;
      this.running = false;
      this.plugin.getXiaoyuanView()?.refreshKnowledgeBaseDashboard();
    }
  }
  async writeDailyJournal(text, attachments) {
    if (this.running) {
      return { status: "failed", message: "\u5DF2\u6709\u77E5\u8BC6\u5E93\u4EFB\u52A1\u6B63\u5728\u8FD0\u884C" };
    }
    this.running = true;
    try {
      const vaultPath = this.plugin.getVaultPath();
      const copiedAttachments = await this.copyAttachmentsToRaw(attachments);
      const request = stripJournalPrefix(text).trim() || "\u5199\u65E5\u8BB0";
      const target = await resolveJournalDailyTarget(vaultPath, text);
      await ensureJournalTargetFolders(vaultPath, target);
      const openCodeHistory = await this.collectOpenCodeJournalHistory(target);
      const prompt = buildKnowledgeBaseJournalPrompt({
        vaultPath,
        userRequest: copiedAttachments.length ? [
          request,
          "",
          "\u672C\u6B21\u9644\u5E26\u9644\u4EF6\u5DF2\u590D\u5236\u5230 raw/attachments\uFF1A",
          ...copiedAttachments.map((item) => `- ${item}`)
        ].join("\n") : request,
        target,
        backend: "opencode",
        openCodeHistory
      });
      const output = await this.runOpenCodeKnowledgeTask(prompt, [], "workspace-write");
      if (!await exists6(target.absolutePath)) {
        throw new Error(`\u65E5\u8BB0\u4EFB\u52A1\u7ED3\u675F\uFF0C\u4F46\u672A\u627E\u5230\u76EE\u6807\u6587\u4EF6\uFF1A${target.relativePath}${output.trim() ? `

Agent \u8F93\u51FA\uFF1A${output.trim().slice(0, 800)}` : ""}`);
      }
      return {
        status: "success",
        message: [`\u5DF2\u5199\u5165\u65E5\u8BB0\uFF1A`, `- ${target.relativePath}`, output.trim() ? `
${output.trim().slice(0, 800)}` : ""].filter(Boolean).join("\n")
      };
    } catch (error) {
      return {
        status: "failed",
        message: error instanceof Error ? error.message : String(error)
      };
    } finally {
      this.activeCodexRun = null;
      this.activeOpenCode = null;
      this.running = false;
      this.plugin.getXiaoyuanView()?.refreshKnowledgeBaseDashboard();
    }
  }
  async collectOpenCodeJournalHistory(target) {
    const backend = new OpenCodeBackend({
      ...this.plugin.settings.opencode,
      vaultPath: this.plugin.getVaultPath()
    });
    try {
      await backend.connect();
      this.plugin.settings.opencode.lastConnectedAt = Date.now();
      this.plugin.settings.opencode.lastError = "";
      await this.plugin.saveSettings();
      return await backend.collectHistoryMessages({
        startMs: target.evidenceWindow.startMs,
        endMs: target.evidenceWindow.endMs
      });
    } catch (error) {
      this.plugin.settings.opencode.lastError = error instanceof Error ? error.message : String(error);
      await this.plugin.saveSettings();
      throw error;
    } finally {
      await backend.disconnect();
    }
  }
  async runOpenCodeKnowledgeTask(prompt, sources, permission = "workspace-write") {
    const backend = new OpenCodeBackend({
      ...this.plugin.settings.opencode,
      vaultPath: this.plugin.getVaultPath()
    });
    try {
      await backend.connect();
      const info = backend.getConnectionInfo();
      this.plugin.settings.opencode.lastConnectedAt = Date.now();
      this.plugin.settings.opencode.lastError = "";
      const models = await backend.listModels();
      const parts = buildOpenCodeKnowledgeParts(prompt, sources);
      const selectedModel = selectOpenCodeModel(models, this.plugin.settings.opencode.providerId, this.plugin.settings.opencode.modelId, requiredModalities(parts));
      ensureOpenCodeModelSupportsFiles(selectedModel, parts);
      if (selectedModel) {
        this.plugin.settings.opencode.providerId = selectedModel.providerId;
        this.plugin.settings.opencode.modelId = selectedModel.modelId;
        this.plugin.settings.opencode.textEnabled = selectedModel.inputModalities.includes("text");
        this.plugin.settings.opencode.imageEnabled = selectedModel.inputModalities.includes("image");
        this.plugin.settings.opencode.pdfEnabled = selectedModel.inputModalities.includes("pdf");
      }
      await this.plugin.saveSettings();
      const session = await backend.startSession({
        title: permission === "read-only" ? "Obsidian \u77E5\u8BC6\u5E93\u95EE\u7B54" : "Obsidian \u77E5\u8BC6\u5E93\u7EF4\u62A4",
        agent: this.plugin.settings.opencode.agent,
        permission,
        ...selectedModel ? { model: { providerId: selectedModel.providerId, modelId: selectedModel.modelId } } : {}
      });
      this.activeOpenCode = { backend, sessionId: session.sessionId };
      return await backend.sendPrompt({
        sessionId: session.sessionId,
        parts,
        agent: this.plugin.settings.opencode.agent,
        ...selectedModel ? { model: { providerId: selectedModel.providerId, modelId: selectedModel.modelId } } : {},
        tools: {
          write: permission !== "read-only",
          edit: permission !== "read-only",
          read: true,
          bash: false
        }
      });
    } catch (error) {
      this.plugin.settings.opencode.lastError = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      await backend.disconnect();
    }
  }
  formatFailureContext(reportPath = "") {
    const opencode = this.plugin.settings.opencode;
    const kb = this.plugin.settings.knowledgeBase;
    return [
      `\u540E\u7AEF\uFF1Aopencode`,
      opencode.providerId && opencode.modelId ? `\u6A21\u578B\uFF1A${opencode.providerId}/${opencode.modelId}` : "",
      `\u89C4\u5219\u6587\u4EF6\uFF1A${kb.useCustomRulesFile ? kb.rulesFilePath : AGENTS_RULES_FILE}`,
      reportPath ? `\u62A5\u544A\uFF1A${reportPath}` : ""
    ].filter(Boolean).join("\n");
  }
  async resolveRulesFile() {
    const settings = this.plugin.settings.knowledgeBase;
    const relativePath = normalizeRulesPath2(settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE);
    const absolutePath = path17.join(this.plugin.getVaultPath(), relativePath);
    return {
      relativePath,
      absolutePath,
      exists: await exists6(absolutePath),
      useCustomRulesFile: settings.useCustomRulesFile
    };
  }
  armSchedule() {
    if (this.scheduleTimer) window.clearInterval(this.scheduleTimer);
    this.scheduleTimer = window.setInterval(() => void this.runScheduledIfDue(), 60 * 1e3);
    this.plugin.registerInterval(this.scheduleTimer);
  }
  async runCatchUpIfNeeded() {
    if (!this.plugin.settings.knowledgeBase.catchUpOnStartup) return;
    await this.runScheduledIfDue(true);
  }
  async runScheduledIfDue(forceCatchUp = false) {
    const settings = this.plugin.settings.knowledgeBase;
    if (this.running) return;
    if (shouldRunScheduledKnowledgeBaseMaintenance(settings, /* @__PURE__ */ new Date(), this.schedulerStartedAt, forceCatchUp)) {
      const result = await this.runMaintenance("maintain");
      await this.appendScheduledMaintenanceMessage(result);
    }
  }
  async appendScheduledMaintenanceMessage(result) {
    const session = ensureKnowledgeBaseSession(this.plugin.settings, this.plugin.getVaultPath());
    const reportText = result.reportPath ? await readKnowledgeBaseReportExcerpt(this.plugin.getVaultPath(), result.reportPath, 3e3).catch(() => null) : null;
    const message = {
      id: newId("msg"),
      role: "assistant",
      title: "\u6BCF\u65E5\u77E5\u8BC6\u5E93\u7EF4\u62A4",
      itemType: "knowledgeBase",
      status: result.status === "success" ? "completed" : "failed",
      text: buildScheduledKnowledgeBaseMessage(result, reportText ?? ""),
      createdAt: Date.now()
    };
    await this.plugin.externalizeMessageText(message, message.text);
    session.messages.push(message);
    session.title = "\u77E5\u8BC6\u5E93\u7BA1\u7406";
    session.updatedAt = message.createdAt;
    await this.plugin.saveSettings(true);
    this.plugin.getXiaoyuanView()?.refreshAfterBackgroundKnowledgeMessage();
  }
  async captureText(target) {
    const { textInputModal: textInputModal2 } = await Promise.resolve().then(() => (init_modals(), modals_exports));
    const value = await textInputModal2(this.plugin.app, target === "inbox" ? "\u8BB0\u5F55\u77E5\u8BC6\u5E93\u60F3\u6CD5" : "\u6536\u96C6\u94FE\u63A5\u5230 raw", "\u8F93\u5165\u5185\u5BB9\u6216\u94FE\u63A5");
    if (!value?.trim()) return;
    const paths = target === "raw-articles" ? await this.captureRawArticleInput(value.trim()) : [await this.writeCollectedText(target, value.trim())];
    new import_obsidian6.Notice(`\u5DF2\u5199\u5165 ${paths.join("\uFF0C")}`);
  }
  async captureWeChatArticle() {
    const { textInputModal: textInputModal2 } = await Promise.resolve().then(() => (init_modals(), modals_exports));
    const value = await textInputModal2(this.plugin.app, "\u516C\u4F17\u53F7\u6536\u96C6", "\u7C98\u8D34 mp.weixin.qq.com \u94FE\u63A5");
    if (!value?.trim()) return [];
    const url = extractFirstUrl(value);
    if (!url || !isWeChatUrl(url)) throw new Error("\u8BF7\u8F93\u5165\u5FAE\u4FE1\u516C\u4F17\u53F7\u6587\u7AE0\u94FE\u63A5");
    return this.captureWeChatUrl(url);
  }
  async captureWebPage() {
    const { textInputModal: textInputModal2 } = await Promise.resolve().then(() => (init_modals(), modals_exports));
    const value = await textInputModal2(this.plugin.app, "\u7F51\u9875\u6536\u85CF", "\u7C98\u8D34\u516C\u5F00\u7F51\u9875\u94FE\u63A5");
    if (!value?.trim()) return [];
    const url = extractFirstUrl(value);
    if (!url) throw new Error("\u8BF7\u8F93\u5165\u7F51\u9875\u94FE\u63A5");
    return this.captureWebUrl(url);
  }
  async captureExternalFiles(files) {
    return this.copyFilesToRaw(files);
  }
  async captureChatInput(target, text, attachments) {
    const paths = [];
    const copiedAttachments = await this.copyAttachmentsToRaw(attachments);
    paths.push(...copiedAttachments);
    const trimmed = text.trim();
    if (target === "raw-articles" && trimmed && !copiedAttachments.length) {
      paths.push(...await this.captureRawArticleInput(trimmed));
      return paths;
    }
    if (trimmed || copiedAttachments.length) {
      const textTarget = target === "inbox" && !copiedAttachments.length ? "inbox" : "raw-articles";
      const body = copiedAttachments.length ? [
        trimmed,
        "",
        "## \u9644\u4EF6",
        ...copiedAttachments.map((item) => `- [[${item}]]`)
      ].join("\n").trim() : trimmed;
      if (body) paths.push(await this.writeCollectedText(textTarget, body));
    }
    return paths;
  }
  async captureRawArticleInput(value) {
    const url = extractFirstUrl(value);
    if (!url) return [await this.writeCollectedText("raw-articles", stripCollectPrefix(value))];
    if (isWeChatUrl(url)) return this.captureWeChatUrl(url);
    return this.captureWebUrl(url, value);
  }
  async writeCollectedText(target, value) {
    const vaultPath = this.plugin.getVaultPath();
    const now = /* @__PURE__ */ new Date();
    const stamp = formatDateTimeForFile(now);
    const dir = target === "inbox" ? path17.join(vaultPath, "inbox") : path17.join(vaultPath, "raw", "articles", "\u624B\u52A8\u6536\u96C6");
    await fsp11.mkdir(dir, { recursive: true });
    const fileName = target === "inbox" ? `${stamp} \u77E5\u8BC6\u5E93\u60F3\u6CD5.md` : `${stamp} \u624B\u52A8\u6536\u96C6.md`;
    const body = [
      "---",
      `created: ${now.toISOString()}`,
      `source: ${target}`,
      "---",
      "",
      value.trim(),
      ""
    ].join("\n");
    const absolute = path17.join(dir, fileName);
    await fsp11.writeFile(absolute, body, "utf8");
    return (0, import_obsidian6.normalizePath)(path17.relative(vaultPath, absolute));
  }
  async captureWeChatUrl(url) {
    const vaultPath = this.plugin.getVaultPath();
    const dest = path17.join(vaultPath, "raw", "articles", "\u5FAE\u4FE1\u516C\u4F17\u53F7");
    await fsp11.mkdir(dest, { recursive: true });
    const skillScript = path17.join(process.env.HOME || "", ".codex", "skills", "wechat-article-to-obsidian-raw", "scripts", "wechat_capture.mjs");
    if (await exists6(skillScript)) {
      try {
        const { stdout } = await execFilePromise("node", [skillScript, url, "--dest", dest], {
          maxBuffer: 30 * 1024 * 1024
        });
        const parsed = JSON.parse(stdout.trim());
        if (parsed?.notePath) return [(0, import_obsidian6.normalizePath)(path17.relative(vaultPath, parsed.notePath))];
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/verification|captcha|环境异常|验证/i.test(message)) throw new Error(`\u516C\u4F17\u53F7\u6536\u96C6\u5931\u8D25\uFF1A\u5FAE\u4FE1\u9A8C\u8BC1\u62E6\u622A\u3002${message}`);
      }
    }
    return [await this.captureHtmlLikePage(url, dest, "\u5FAE\u4FE1\u516C\u4F17\u53F7")];
  }
  async captureWebUrl(url, originalInput = "") {
    const vaultPath = this.plugin.getVaultPath();
    const dest = path17.join(vaultPath, "raw", "articles", "\u7F51\u9875\u6536\u85CF");
    await fsp11.mkdir(dest, { recursive: true });
    return [await this.captureHtmlLikePage(url, dest, "web", originalInput)];
  }
  async captureHtmlLikePage(url, dest, source, originalInput = "") {
    const vaultPath = this.plugin.getVaultPath();
    const response = await (0, import_obsidian6.requestUrl)({
      url,
      method: "GET",
      headers: {
        "User-Agent": source === "\u5FAE\u4FE1\u516C\u4F17\u53F7" ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.50" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/125 Safari/537.36",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    const html = response.text;
    if (/环境异常|wappoc_appmsgcaptcha|完成验证后即可继续访问|captcha/i.test(html)) {
      throw new Error(`${source}\u6536\u85CF\u5931\u8D25\uFF1A\u7F51\u9875\u9700\u8981\u9A8C\u8BC1\u6216\u767B\u5F55\uFF0C\u63D2\u4EF6\u4E0D\u4F1A\u7ED5\u8FC7\u9A8C\u8BC1\u3002`);
    }
    const article = extractArticleMarkdown(html, url);
    const now = /* @__PURE__ */ new Date();
    const title = article.title || source;
    const fileName = `${formatDateTimeForFile(now)} ${sanitizeFileName(title)}.md`;
    const absolute = path17.join(dest, fileName);
    const body = [
      "---",
      `created: ${now.toISOString()}`,
      `source: ${source}`,
      `url: ${url}`,
      "---",
      "",
      `# ${title}`,
      "",
      `> \u539F\u6587\uFF1A${url}`,
      originalInput && originalInput.trim() !== url ? `> \u6536\u96C6\u8BF4\u660E\uFF1A${originalInput.trim()}` : "",
      "",
      article.markdown || "\u6B63\u6587\u63D0\u53D6\u5931\u8D25\uFF0C\u4EC5\u4FDD\u7559\u6765\u6E90\u94FE\u63A5\u3002",
      ""
    ].filter((line) => line !== "").join("\n");
    await fsp11.writeFile(absolute, body, "utf8");
    return (0, import_obsidian6.normalizePath)(path17.relative(vaultPath, absolute));
  }
  async copyFilesToRaw(files) {
    const vaultPath = this.plugin.getVaultPath();
    const copied = [];
    for (const file of files) {
      const ext = path17.extname(file.path).toLowerCase();
      if (!KNOWLEDGE_FILE_CAPTURE_EXTENSIONS.has(ext)) continue;
      const textLike = [".md", ".markdown", ".txt"].includes(ext);
      const targetDir = textLike ? path17.join(vaultPath, "raw", "articles", "\u6587\u4EF6\u6536\u85CF") : path17.join(vaultPath, "raw", "attachments");
      await fsp11.mkdir(targetDir, { recursive: true });
      const target = path17.join(targetDir, `${formatDateTimeForFile(/* @__PURE__ */ new Date())}-${path17.basename(file.path)}`);
      await fsp11.copyFile(file.path, target);
      copied.push((0, import_obsidian6.normalizePath)(path17.relative(vaultPath, target)));
    }
    if (!copied.length) throw new Error("\u8BF7\u9009\u62E9 PDF\u3001DOCX\u3001Markdown \u6216 TXT \u6587\u4EF6\u3002");
    return copied;
  }
  async copyAttachmentsToRaw(attachments) {
    if (!attachments.length) return [];
    const vaultPath = this.plugin.getVaultPath();
    const targetDir = path17.join(vaultPath, "raw", "attachments");
    await fsp11.mkdir(targetDir, { recursive: true });
    const copied = [];
    for (const attachment of attachments) {
      const ext = path17.extname(attachment.path).toLowerCase();
      if (!SUPPORTED_RAW_EXTENSIONS.has(ext) || [".md", ".markdown", ".txt"].includes(ext)) continue;
      const target = path17.join(targetDir, `${formatDateTimeForFile(/* @__PURE__ */ new Date())}-${path17.basename(attachment.path)}`);
      await fsp11.copyFile(attachment.path, target);
      copied.push((0, import_obsidian6.normalizePath)(path17.relative(vaultPath, target)));
    }
    return copied;
  }
  async captureActiveAttachment() {
    const file = this.plugin.app.workspace.getActiveFile();
    if (!(file instanceof import_obsidian6.TFile)) {
      new import_obsidian6.Notice("\u6CA1\u6709\u53EF\u6536\u96C6\u7684\u5F53\u524D\u6587\u4EF6");
      return;
    }
    const ext = path17.extname(file.path).toLowerCase();
    if (!SUPPORTED_RAW_EXTENSIONS.has(ext) || [".md", ".markdown", ".txt"].includes(ext)) {
      new import_obsidian6.Notice("\u5F53\u524D\u6587\u4EF6\u4E0D\u662F\u56FE\u7247\u6216 PDF");
      return;
    }
    const vaultPath = this.plugin.getVaultPath();
    const source = path17.join(vaultPath, file.path);
    const targetDir = path17.join(vaultPath, "raw", "attachments");
    await fsp11.mkdir(targetDir, { recursive: true });
    const target = path17.join(targetDir, `${formatDateTimeForFile(/* @__PURE__ */ new Date())}-${path17.basename(file.path)}`);
    await fsp11.copyFile(source, target);
    new import_obsidian6.Notice(`\u5DF2\u6536\u96C6\u5230 ${(0, import_obsidian6.normalizePath)(path17.relative(vaultPath, target))}`);
  }
};
function buildOpenCodeKnowledgeParts(prompt, sources) {
  return [
    { type: "text", text: prompt },
    ...sources.slice(0, MAX_ATTACHED_SOURCES).map((source) => ({
      type: "file",
      path: source.absolutePath,
      filename: path17.basename(source.absolutePath),
      mime: source.mime
    }))
  ];
}
function requiredModalities(parts) {
  const modalities = /* @__PURE__ */ new Set(["text"]);
  for (const part of parts) {
    if (part.type === "file") modalities.add(requiredModalityForMime(part.mime));
  }
  return Array.from(modalities);
}
function selectOpenCodeModel(models, providerId, modelId, required) {
  const configured = models.find((model) => model.providerId === providerId && model.modelId === modelId);
  if (configured) return configured;
  return models.find((model) => required.every((modality) => model.inputModalities.includes(modality))) ?? models[0] ?? null;
}
function formatAskAnswer(output, citations) {
  const text = output.trim();
  if (!text) return citations.status === "none" ? "\u672A\u627E\u5230\u76F8\u5173\u672C\u5730\u4F9D\u636E\uFF0CAgent \u672A\u8FD4\u56DE\u56DE\u7B54\u3002" : "Agent \u672A\u8FD4\u56DE\u56DE\u7B54\u3002";
  if (citations.status !== "none") return text;
  if (/未找到相关本地依据|无本地依据|未找到相关本地来源|未找到相关\s*(wiki|Wiki)\s*笔记/.test(text)) return text;
  return `\u672A\u627E\u5230\u76F8\u5173\u672C\u5730\u4F9D\u636E\u3002

${text}`;
}
async function ensureKnowledgeBaseFolders(vaultPath) {
  await fsp11.mkdir(path17.join(vaultPath, "outputs"), { recursive: true });
  await fsp11.mkdir(path17.join(vaultPath, "outputs", "maintenance"), { recursive: true });
  await fsp11.mkdir(path17.join(vaultPath, "outputs", "reviews"), { recursive: true });
  await fsp11.mkdir(path17.join(vaultPath, "outputs", "publishing", "xiaohongshu"), { recursive: true });
  await fsp11.mkdir(path17.join(vaultPath, "outputs", "instructions"), { recursive: true });
  await fsp11.mkdir(path17.join(vaultPath, "outputs", "migrations"), { recursive: true });
  await fsp11.mkdir(path17.join(vaultPath, "wiki"), { recursive: true });
}
async function ensureFallbackReport(vaultPath, reportPath, input) {
  const absolute = path17.join(vaultPath, reportPath);
  if (await exists6(absolute)) return;
  const lines = [
    "---",
    `created: ${new Date(input.startedAt).toISOString()}`,
    "source: codex-echoink",
    "---",
    "",
    `# \u77E5\u8BC6\u5E93${labelForRunMode(input.mode)}\u62A5\u544A \u2014 ${formatDateForTitle(new Date(input.startedAt))}`,
    "",
    "## \u4E00\u773C\u7ED3\u8BBA",
    input.output.trim() || "\u4EFB\u52A1\u5DF2\u5B8C\u6210\uFF0C\u4F46 Agent \u672A\u8FD4\u56DE\u6458\u8981\u3002",
    "",
    "## \u672C\u8F6E\u6765\u6E90",
    ...input.sources.length ? input.sources.map((source) => `- [[${source.relativePath}]]`) : ["- \u65E0\u65B0\u589E\u6216\u53D8\u66F4 raw \u6587\u4EF6"],
    ""
  ];
  await fsp11.writeFile(absolute, lines.join("\n"), "utf8");
}
async function appendStructureNormalizationReport(vaultPath, reportPath, structure) {
  const absolute = path17.join(vaultPath, reportPath);
  const current = await fsp11.readFile(absolute, "utf8").catch(() => "");
  const markerStart = "<!-- codex-echoink-structure:start -->";
  const markerEnd = "<!-- codex-echoink-structure:end -->";
  const lines = [
    markerStart,
    "",
    "## \u7ED3\u6784\u6574\u7406",
    "",
    `\u4E00\u773C\u7ED3\u8BBA\uFF1A\u81EA\u52A8\u79FB\u52A8 ${structure.moves.length} \u9879\uFF0C\u66F4\u65B0\u5F15\u7528 ${structure.updatedLinks.reduce((sum, item) => sum + item.replacements, 0)} \u5904\uFF0C\u8DF3\u8FC7\u98CE\u9669\u9879 ${structure.skipped.length} \u9879\u3002`,
    "",
    "### \u5DF2\u81EA\u52A8\u6574\u7406",
    ...structure.moves.length ? structure.moves.slice(0, 30).map((move) => `- ${move.from} -> ${move.to}\uFF08${move.reason}\uFF09`) : ["- \u65E0"],
    structure.moves.length > 30 ? `- \u5176\u4F59 ${structure.moves.length - 30} \u9879\u7565\u3002` : "",
    "",
    "### \u5F15\u7528\u540C\u6B65",
    ...structure.updatedLinks.length ? structure.updatedLinks.slice(0, 30).map((item) => `- ${item.path}\uFF1A${item.replacements} \u5904`) : ["- \u65E0"],
    structure.updatedLinks.length > 30 ? `- \u5176\u4F59 ${structure.updatedLinks.length - 30} \u4E2A\u6587\u4EF6\u7565\u3002` : "",
    "",
    "### \u8DF3\u8FC7 / \u9700\u786E\u8BA4",
    ...structure.skipped.length ? structure.skipped.map((item) => `- ${item.from}${item.to ? ` -> ${item.to}` : ""}\uFF1A${item.reason}`) : ["- \u65E0"],
    "",
    "### \u6B8B\u7559\u7ED3\u6784\u95EE\u9898",
    ...structure.remainingRootNotes.length ? ["- \u6839\u76EE\u5F55\u6563\u843D\u7B14\u8BB0\uFF1A", ...structure.remainingRootNotes.map((item) => `  - ${item}`)] : ["- \u6839\u76EE\u5F55\u6563\u843D\u7B14\u8BB0\uFF1A\u65E0"],
    ...structure.remainingChineseDirs.length ? ["- \u4E2D\u6587\u76EE\u5F55\u6B8B\u7559\uFF1A", ...structure.remainingChineseDirs.map((item) => `  - ${item}`)] : ["- \u4E2D\u6587\u76EE\u5F55\u6B8B\u7559\uFF1A\u65E0"],
    "",
    markerEnd,
    ""
  ].filter((line) => line !== "").join("\n");
  const pattern = new RegExp(`${escapeRegExp3(markerStart)}[\\s\\S]*?${escapeRegExp3(markerEnd)}`);
  const next = pattern.test(current) ? current.replace(pattern, lines.trimEnd()) : `${current.trimEnd()}

${lines}`;
  await fsp11.writeFile(absolute, next, "utf8");
}
async function writeKnowledgeBaseTracker(vaultPath, processed, updatedAt) {
  const tracker = path17.join(vaultPath, "outputs", ".ingest-tracker.md");
  await fsp11.mkdir(path17.dirname(tracker), { recursive: true });
  const markerStart = "<!-- codex-echoink-kb:start -->";
  const markerEnd = "<!-- codex-echoink-kb:end -->";
  const current = await fsp11.readFile(tracker, "utf8").catch(() => "---\nupdated: \n---\n\n# Ingest Tracker\n");
  const entries = Object.values(processed).sort((left, right) => left.path.localeCompare(right.path)).map((item) => `- \`${item.path}\` | size=${item.size} | mtime=${Math.round(item.mtime)} | digested=${new Date(item.digestedAt).toISOString()}`);
  const block = [
    markerStart,
    "",
    `## Codex EchoInk \u5904\u7406\u8BB0\u5F55\uFF08${new Date(updatedAt).toISOString()}\uFF09`,
    "",
    ...entries.length ? entries : ["- \u6682\u65E0"],
    "",
    markerEnd
  ].join("\n");
  const pattern = new RegExp(`${escapeRegExp3(markerStart)}[\\s\\S]*?${escapeRegExp3(markerEnd)}`);
  const next = pattern.test(current) ? current.replace(pattern, block) : `${current.trim()}

${block}
`;
  await fsp11.writeFile(tracker, next, "utf8");
}
function selectSourcesForRunMode(mode, discovery) {
  if (mode === "lint" || mode === "inbox" || mode === "outputs") return [];
  if (mode === "reingest") {
    const changed = discovery.changedSources;
    if (changed.length) return changed;
    return [...discovery.sources].sort((left, right) => right.mtime - left.mtime).slice(0, MAX_ATTACHED_SOURCES);
  }
  return discovery.changedSources;
}
async function normalizeProcessedSources(vaultPath, sources, rewrites) {
  if (!rewrites.length) return sources;
  const normalized = [];
  for (const source of sources) {
    const relativePath = rewriteKnowledgeBaseRelativePath(source.relativePath, rewrites);
    const absolutePath = path17.join(vaultPath, relativePath);
    const stat10 = await fsp11.stat(absolutePath).catch(() => null);
    normalized.push({
      ...source,
      relativePath,
      absolutePath,
      ...stat10 ? { size: stat10.size, mtime: stat10.mtimeMs } : {}
    });
  }
  return normalized;
}
function rewriteProcessedSources(processed, rewrites) {
  if (!rewrites.length) return processed;
  const next = {};
  for (const [key, source] of Object.entries(processed ?? {})) {
    const rewritten = rewriteKnowledgeBaseRelativePath(source.path || key, rewrites);
    next[rewritten] = { ...source, path: rewritten };
  }
  return next;
}
async function syncRewrittenRawProcessedSourceStats(vaultPath, processed, rewrites) {
  if (!rewrites.length) return processed;
  const next = {};
  for (const [key, source] of Object.entries(processed ?? {})) {
    const relativePath = source.path || key;
    if (!isRewrittenRawPath(relativePath, rewrites)) {
      next[key] = source;
      continue;
    }
    const stat10 = await fsp11.stat(path17.join(vaultPath, relativePath)).catch(() => null);
    next[key] = stat10?.isFile() ? { ...source, path: relativePath, size: stat10.size, mtime: stat10.mtimeMs } : source;
  }
  return next;
}
function isRewrittenRawPath(relativePath, rewrites) {
  const normalized = (0, import_obsidian6.normalizePath)(relativePath);
  return rewrites.some((rewrite2) => {
    if (!rewrite2.to.startsWith("raw/")) return false;
    return normalized === rewrite2.to || normalized.startsWith(`${rewrite2.to}/`);
  });
}
function buildMaintenanceSummary(output, mode, structure) {
  const base = output.trim().slice(0, 800) || `\u77E5\u8BC6\u5E93${labelForRunMode(mode)}\u5B8C\u6210`;
  if (!structure) return base;
  const line = `\u7ED3\u6784\u6574\u7406\uFF1A\u79FB\u52A8 ${structure.moves.length} \u9879\uFF0C\u66F4\u65B0\u5F15\u7528 ${structure.updatedLinks.reduce((sum, item) => sum + item.replacements, 0)} \u5904\uFF0C\u8DF3\u8FC7 ${structure.skipped.length} \u9879\u3002`;
  return `${base}
${line}`.slice(0, 1e3);
}
function labelForRunMode(mode) {
  if (mode === "lint") return "\u4F53\u68C0";
  if (mode === "reingest") return "\u91CD\u65B0\u63D0\u70BC";
  if (mode === "outputs") return "outputs \u5904\u7406";
  if (mode === "inbox") return "\u6536\u4EF6\u7BB1\u5904\u7406";
  return "\u7EF4\u62A4";
}
function reviewKindLabel(kind) {
  return kind === "knowledge-base" ? "\u77E5\u8BC6\u5E93\u5468\u62A5" : "Agent \u5468\u62A5";
}
function normalizeRulesPath2(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/") || AGENTS_RULES_FILE;
}
function extractFirstUrl(value) {
  return value.match(URL_PATTERN2)?.[0] ?? null;
}
function isWeChatUrl(value) {
  try {
    return new URL(value).hostname === "mp.weixin.qq.com";
  } catch {
    return false;
  }
}
function stripCollectPrefix(value) {
  return value.replace(/^(收集|收藏|剪藏|保存到\s*raw|网页收藏|公众号收集)[:：\s]*/i, "").trim();
}
function extractArticleMarkdown(html, url) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  for (const selector of ["script", "style", "noscript", "svg", "iframe"]) {
    for (const node of Array.from(doc.querySelectorAll(selector))) node.remove();
  }
  const title = cleanInlineText(
    doc.querySelector("meta[property='og:title']")?.getAttribute("content") || doc.querySelector("title")?.textContent || new URL(url).hostname
  );
  const content = doc.querySelector("#js_content") || doc.querySelector("article") || doc.querySelector("main") || doc.body;
  const markdown = content ? domNodeToMarkdown(content).replace(/\n{3,}/g, "\n\n").trim() : "";
  return { title, markdown };
}
function domNodeToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) return cleanTextNode(node.textContent ?? "");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes).map(domNodeToMarkdown).join("");
  if (tag === "br") return "\n";
  if (/^h[1-6]$/.test(tag)) return `

${"#".repeat(Number(tag.slice(1)))} ${cleanInlineText(children)}

`;
  if (tag === "p" || tag === "section" || tag === "div" || tag === "article") return children.trim() ? `

${children.trim()}

` : "";
  if (tag === "li") return `
- ${children.trim()}`;
  if (tag === "blockquote") return children.trim().split("\n").map((line) => `> ${line.trim()}`).join("\n");
  if (tag === "a") {
    const href = el.getAttribute("href");
    const text = cleanInlineText(children) || href || "";
    return href ? `[${text}](${href})` : text;
  }
  if (tag === "img") {
    const src = el.getAttribute("data-src") || el.getAttribute("src");
    const alt = el.getAttribute("alt") || "image";
    return src ? `

![${alt}](${src})

` : "";
  }
  if (tag === "pre" || tag === "code") return `

\`\`\`
${el.textContent?.trim() ?? ""}
\`\`\`

`;
  return children;
}
function cleanTextNode(value) {
  return value.replace(/\s+/g, " ");
}
function cleanInlineText(value) {
  return value.replace(/\s+/g, " ").trim();
}
function sanitizeFileName(value) {
  return cleanInlineText(value).replace(/[\\/:*?"<>|#\[\]]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "\u672A\u547D\u540D\u8D44\u6599";
}
function execFilePromise(command, args, options) {
  return new Promise((resolve5, reject) => {
    (0, import_child_process2.execFile)(command, args, options, (error, stdout, stderr) => {
      if (error) {
        const message = stderr || error.message;
        reject(new Error(message));
        return;
      }
      resolve5({ stdout, stderr });
    });
  });
}
async function exists6(filePath) {
  return fsp11.access(filePath, fs8.constants.F_OK).then(() => true, () => false);
}
function formatDateForFile2(date) {
  return `${date.getFullYear()}-${pad4(date.getMonth() + 1)}-${pad4(date.getDate())}`;
}
function formatDateForTitle(date) {
  return `${date.getFullYear()}-${pad4(date.getMonth() + 1)}-${pad4(date.getDate())}`;
}
function formatDateTimeForFile(date) {
  return `${formatDateForFile2(date)}-${pad4(date.getHours())}${pad4(date.getMinutes())}${pad4(date.getSeconds())}`;
}
function pad4(value) {
  return String(value).padStart(2, "0");
}
function escapeRegExp3(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/review/manager.ts
var fsp12 = __toESM(require("fs/promises"));
var path18 = __toESM(require("path"));
var import_obsidian7 = require("obsidian");

// src/review/review-html-template.ts
var REVIEW_SECTION_HEADINGS = [
  "1. \u603B\u4F53\u8BC4\u5206",
  "2. \u4F7F\u7528\u5206\u5E03",
  "3. \u63D0\u793A\u8BCD\u8D28\u91CF",
  "4. \u51B3\u7B56\u8D28\u91CF",
  "5. \u8FD4\u5DE5\u5730\u56FE",
  "6. \u4F7F\u7528\u4E60\u60EF\u5BA1\u67E5",
  "7. \u63D0\u793A\u8BCD\u4FEE\u6B63\u6A21\u677F",
  "8. \u56FA\u5B9A\u5BA1\u67E5\u9879",
  "9. \u6700\u7EC8\u5224\u65AD"
];
var REVIEW_HTML_CSS = `:root{--bg:#fffdf8;--card:#ffffff;--line:#dce8e2;--mint:#d8f1e7;--mint2:#edf8f3;--blue:#e7f0f7;--green:#4f8b72;--text:#24312d;--muted:#687772;--amber:#fff2cf;--shadow:0 8px 24px rgba(40,72,62,.08);}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;line-height:1.55}.wrap{max-width:1180px;margin:0 auto;padding:28px 18px 56px}.hero{border:1px solid var(--line);background:linear-gradient(180deg,var(--mint2),#fff);border-radius:8px;padding:28px;box-shadow:var(--shadow)}h1{margin:0 0 8px;font-size:30px;letter-spacing:0}h2{margin:34px 0 14px;font-size:20px}h3{margin:20px 0 10px;font-size:16px}p{margin:8px 0;color:var(--muted)}.verdict{font-size:17px;color:var(--text);max-width:900px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px}.card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;box-shadow:var(--shadow)}.metric b{display:block;font-size:22px;margin-top:4px}.score{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.pill{display:inline-block;border:1px solid var(--line);background:var(--mint);border-radius:999px;padding:2px 8px;font-size:12px;color:#315f4e}.table{display:block;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff}.tr{display:grid;grid-template-columns:1.1fr 1fr 1.6fr;gap:0;border-top:1px solid var(--line)}.tr:first-child{border-top:0}.tr>div{padding:12px;border-left:1px solid var(--line);min-width:0;overflow-wrap:anywhere}.tr>div:first-child{border-left:0}.head{background:var(--blue);font-weight:700}.wide .tr{grid-template-columns:1fr 1.4fr 1fr 1.5fr}.low .tr{grid-template-columns:.9fr 1.4fr .8fr 1fr 1.2fr}.decision .tr{grid-template-columns:1fr 1.4fr}.baddecision .tr{grid-template-columns:1fr 1fr 1.2fr}.barrow{background:#fff;border:1px solid var(--line);border-radius:8px;padding:14px;margin:10px 0;box-shadow:var(--shadow)}.barlabel{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.bar{height:10px;background:#eef4f1;border-radius:999px;overflow:hidden;margin:10px 0}.bar i{display:block;height:100%;background:linear-gradient(90deg,#9bd8c1,#9fc9df)}.templates{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f7fbf8;border:1px solid var(--line);border-radius:8px;padding:12px;font-size:13px}.note{background:var(--amber)}@media(max-width:760px){.grid,.score,.templates{grid-template-columns:1fr}.tr,.wide .tr,.low .tr,.decision .tr,.baddecision .tr{grid-template-columns:1fr}.tr>div{border-left:0;border-top:1px solid var(--line)}.tr>div:first-child{border-top:0}h1{font-size:24px}}`;
function renderReviewHtml(data) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(data.title)} ${escapeHtml(data.periodLabel)}</title><style>
${REVIEW_HTML_CSS}
</style></head><body><main class="wrap"><section class="hero"><span class="pill">${escapeHtml(data.scopeLabel)}</span><h1>${escapeHtml(data.title)}</h1><p>\u5468\u671F\uFF1A${escapeHtml(data.periodLabel)}</p><p class="verdict">${escapeHtml(data.verdict)}</p><div class="grid">${data.metrics.map(renderMetric).join("")}</div></section><h2>${REVIEW_SECTION_HEADINGS[0]}</h2><section class="score">${data.scores.map(renderScore).join("")}</section><h2>${REVIEW_SECTION_HEADINGS[1]}</h2>${data.distribution.map(renderDistribution).join("")}<h2>${REVIEW_SECTION_HEADINGS[2]}</h2><h3>\u9AD8\u8D28\u91CF\u63D0\u793A\u8BCD</h3><div class="wide"><div class="table"><div class="tr head"><div>\u65E5\u671F / \u573A\u666F</div><div>\u539F\u59CB\u6458\u5F55</div><div>\u5224\u65AD</div><div>\u539F\u56E0</div></div>${data.highQualityPrompts.map(renderGoodPrompt).join("")}</div></div><h3>\u4F4E\u6548\u63D0\u793A\u8BCD</h3><div class="low"><div class="table"><div class="tr head"><div>\u65E5\u671F / \u573A\u666F</div><div>\u539F\u59CB\u6458\u5F55</div><div>\u95EE\u9898</div><div>\u5F71\u54CD</div><div>\u4FEE\u6B63\u65B9\u5F0F</div></div>${data.lowEfficiencyPrompts.map(renderBadPrompt).join("")}</div></div><h2>${REVIEW_SECTION_HEADINGS[3]}</h2><h3>\u597D\u51B3\u7B56</h3><div class="decision"><div class="table"><div class="tr head"><div>\u51B3\u7B56</div><div>\u8BC4\u4EF7</div></div>${data.goodDecisions.map(renderDecision).join("")}</div></div><h3>\u95EE\u9898\u51B3\u7B56</h3><div class="baddecision"><div class="table"><div class="tr head"><div>\u51B3\u7B56/\u884C\u4E3A</div><div>\u95EE\u9898</div><div>\u4FEE\u6B63\u65B9\u5F0F</div></div>${data.problemDecisions.map(renderProblemDecision).join("")}</div></div><h2>${REVIEW_SECTION_HEADINGS[4]}</h2><div class="wide"><div class="table"><div class="tr head"><div>\u8FD4\u5DE5\u70B9</div><div>\u8868\u9762\u539F\u56E0</div><div>\u6DF1\u5C42\u539F\u56E0</div><div>\u4FEE\u6B63\u65B9\u5F0F</div></div>${data.reworkItems.map(renderRework).join("")}</div></div><h2>${REVIEW_SECTION_HEADINGS[5]}</h2><h3>\u597D\u4E60\u60EF</h3><div class="decision"><div class="table"><div class="tr head"><div>\u4E60\u60EF</div><div>\u8BC4\u4EF7</div></div>${data.goodHabits.map(renderHabit).join("")}</div></div><h3>\u574F\u4E60\u60EF</h3><div class="baddecision"><div class="table"><div class="tr head"><div>\u4E60\u60EF</div><div>\u95EE\u9898</div><div>\u4FEE\u6B63\u65B9\u5F0F</div></div>${data.badHabits.map(renderBadHabit).join("")}</div></div><h2>${REVIEW_SECTION_HEADINGS[6]}</h2><section class="templates">${data.templates.map(renderTemplateBlock).join("")}</section><h2>${REVIEW_SECTION_HEADINGS[7]}</h2><div class="decision"><div class="table"><div class="tr head"><div>\u5BA1\u67E5\u9879</div><div>\u5224\u65AD</div></div>${data.checklist.map(renderChecklist).join("")}</div></div><h2>${REVIEW_SECTION_HEADINGS[8]}</h2><section class="card note"><p>${escapeHtml(data.finalJudgement)}</p></section></main></body></html>`;
}
function renderMetric(item) {
  return `<div class="card metric"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}</b></div>`;
}
function renderScore(item) {
  return `<div class="card"><span class="pill">${escapeHtml(item.label)}</span><h3>${escapeHtml(item.rating)}</h3><p>${escapeHtml(item.description)}</p></div>`;
}
function renderDistribution(item) {
  const width = Math.max(0, Math.min(100, item.value));
  return `<div class="barrow"><div class="barlabel"><b>${escapeHtml(item.label)}</b><span>${escapeHtml(item.countLabel)}</span></div><div class="bar"><i style="width:${width.toFixed(1)}%"></i></div><p>${escapeHtml(item.description)}</p></div>`;
}
function renderGoodPrompt(item) {
  return `<div class="tr"><div>${escapeHtml(item.scene)}</div><div>${escapeHtml(item.excerpt)}</div><div>${escapeHtml(item.judgement)}</div><div>${escapeHtml(item.reason)}</div></div>`;
}
function renderBadPrompt(item) {
  return `<div class="tr"><div>${escapeHtml(item.scene)}</div><div>${escapeHtml(item.excerpt)}</div><div>${escapeHtml(item.problem)}</div><div>${escapeHtml(item.impact)}</div><div>${escapeHtml(item.correction)}</div></div>`;
}
function renderDecision(item) {
  return `<div class="tr"><div>${escapeHtml(item.decision)}</div><div>${escapeHtml(item.evaluation)}</div></div>`;
}
function renderProblemDecision(item) {
  return `<div class="tr"><div>${escapeHtml(item.decision)}</div><div>${escapeHtml(item.problem)}</div><div>${escapeHtml(item.correction)}</div></div>`;
}
function renderRework(item) {
  return `<div class="tr"><div>${escapeHtml(item.item)}</div><div>${escapeHtml(item.surfaceCause)}</div><div>${escapeHtml(item.deepCause)}</div><div>${escapeHtml(item.correction)}</div></div>`;
}
function renderHabit(item) {
  return `<div class="tr"><div>${escapeHtml(item.habit)}</div><div>${escapeHtml(item.evaluation)}</div></div>`;
}
function renderBadHabit(item) {
  return `<div class="tr"><div>${escapeHtml(item.habit)}</div><div>${escapeHtml(item.problem)}</div><div>${escapeHtml(item.correction)}</div></div>`;
}
function renderTemplateBlock(item) {
  return `<div class="card"><h3>${escapeHtml(item.title)}</h3><pre>${escapeHtml(item.body)}</pre></div>`;
}
function renderChecklist(item) {
  return `<div class="tr"><div>${escapeHtml(item.item)}</div><div>${escapeHtml(item.judgement)}</div></div>`;
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/review/schedule.ts
function currentReviewRange(now = /* @__PURE__ */ new Date()) {
  const start = startOfLocalWeek(now);
  return {
    startAt: start.getTime(),
    endAt: now.getTime(),
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(now)
  };
}
function reviewRangeForMode(mode, now = /* @__PURE__ */ new Date()) {
  if (mode === "current-week") return currentReviewRange(now);
  const currentStart = startOfLocalWeek(now);
  const previousEnd = new Date(currentStart);
  previousEnd.setMilliseconds(-1);
  previousEnd.setHours(23, 59, 59, 999);
  const previousStart = startOfLocalWeek(previousEnd);
  return {
    startAt: previousStart.getTime(),
    endAt: previousEnd.getTime(),
    startDate: formatLocalDate(previousStart),
    endDate: formatLocalDate(previousEnd)
  };
}
function latestScheduledReviewRange(now = /* @__PURE__ */ new Date(), scheduleTime = "21:00") {
  const [hour, minute] = parseScheduleTime(scheduleTime);
  const scheduled = new Date(now);
  scheduled.setHours(hour, minute, 0, 0);
  scheduled.setDate(scheduled.getDate() - scheduled.getDay());
  if (scheduled.getTime() > now.getTime()) scheduled.setDate(scheduled.getDate() - 7);
  const start = new Date(scheduled);
  start.setDate(scheduled.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return {
    startAt: start.getTime(),
    endAt: scheduled.getTime(),
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(scheduled)
  };
}
function shouldRunScheduledReview(settings, kind, now = /* @__PURE__ */ new Date()) {
  if (!settings.enabled) return false;
  if (kind === "knowledge-base" && !settings.knowledgeBaseEnabled) return false;
  if (kind === "agent-chat" && !settings.agentChatEnabled) return false;
  const range = latestScheduledReviewRange(now, settings.scheduleTime);
  if (!range) return false;
  const state = kind === "knowledge-base" ? settings.reports.knowledgeBase : settings.reports.agentChat;
  return state.lastRangeKey !== reviewRangeKey(range);
}
function reviewRangeKey(range) {
  return `${range.startDate}-to-${range.endDate}`;
}
function isReviewHtmlPath(value, outputDir = DEFAULT_REVIEW_OUTPUT_DIR) {
  const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized.endsWith(".html")) return false;
  if (normalized.split("/").some((part) => part === ".." || part === "." || !part)) return false;
  const allowedDirs = Array.from(/* @__PURE__ */ new Set([
    normalizeReviewOutputDir(outputDir, DEFAULT_REVIEW_OUTPUT_DIR),
    DEFAULT_REVIEW_OUTPUT_DIR
  ]));
  return allowedDirs.some((dir) => normalized.startsWith(`${dir}/`));
}
function startOfLocalWeek(date) {
  const start = new Date(date);
  const day = start.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - daysFromMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}
function parseScheduleTime(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return [21, 0];
  return [Number(match[1]), Number(match[2])];
}
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// src/review/report.ts
var REVIEW_OUTPUT_DIR = DEFAULT_REVIEW_OUTPUT_DIR;
function collectAgentChatReviewEvidence(settings, range) {
  const sessions = settings.sessions.filter((session) => !isKnowledgeBaseSession(session, settings.knowledgeBase.sessionId));
  const activeSessions = sessions.filter((session) => messagesInRange(session.messages, range).length > 0);
  const messages = activeSessions.flatMap((session) => messagesInRange(session.messages, range));
  const userMessages = messages.filter((message) => message.role === "user");
  return {
    kind: "agent-chat",
    sessionCount: activeSessions.length,
    userMessageCount: userMessages.length,
    assistantMessageCount: messages.filter((message) => message.role === "assistant").length,
    totalMessageCount: messages.length,
    totalTokens: activeSessions.reduce((sum, session) => sum + readTotalTokens(session), 0),
    contextCompactionCount: messages.filter((message) => message.itemType === "contextCompaction").length,
    failedMessageCount: messages.filter((message) => message.status === "failed" || message.status === "error").length,
    interruptedMessageCount: messages.filter((message) => message.status === "interrupted").length,
    toolEventCount: messages.filter((message) => isToolLikeMessage(message)).length,
    longSessionCount: activeSessions.filter((session) => messagesInRange(session.messages, range).length >= 20 || readTotalTokens(session) >= 5e5).length,
    promptSamples: userMessages.slice(0, 8).map((message) => ({
      scene: formatMessageScene(message),
      text: trimText(message.text, 120)
    }))
  };
}
function collectKnowledgeBaseReviewEvidence(settings, range, extras = {}) {
  const session = settings.sessions.find((item) => isKnowledgeBaseSession(item, settings.knowledgeBase.sessionId));
  const messages = session ? messagesInRange(session.messages, range) : [];
  const userMessages = messages.filter((message) => message.role === "user");
  const commandCounts = {
    init: 0,
    maintain: 0,
    lint: 0,
    ask: 0,
    outputs: 0,
    inbox: 0,
    journal: 0,
    collect: 0,
    other: 0
  };
  for (const message of userMessages) {
    const command = parseKnowledgeBaseCommand(message.text, message.attachments?.length ?? 0);
    if (command.intent === "process-outputs") commandCounts.outputs += 1;
    else if (command.intent === "process-inbox") commandCounts.inbox += 1;
    else if (command.intent === "reingest") commandCounts.maintain += 1;
    else if (command.intent in commandCounts) commandCounts[command.intent] += 1;
    else commandCounts.other += 1;
  }
  return {
    kind: "knowledge-base",
    messageCount: messages.length,
    userMessageCount: userMessages.length,
    assistantMessageCount: messages.filter((message) => message.role === "assistant").length,
    failedMessageCount: messages.filter((message) => message.status === "failed" || message.status === "error").length,
    commandCounts,
    dashboard: extras.dashboard ?? {},
    maintenanceReports: extras.maintenanceReports ?? [],
    lastStatus: settings.knowledgeBase.lastRunStatus,
    lastReportPath: settings.knowledgeBase.lastReportPath,
    lastSummary: settings.knowledgeBase.lastSummary
  };
}
function reportBaseName(kind, range) {
  return `${kind === "knowledge-base" ? "knowledge-base" : "agent-chat"}-review-${reviewRangeKey(range)}`;
}
function buildReviewDocuments(kind, range, evidence) {
  const baseName = reportBaseName(kind, range);
  const htmlFileName = `${baseName}.html`;
  const markdownFileName = `${baseName}.md`;
  const data = kind === "knowledge-base" ? buildKnowledgeBaseHtmlData(range, evidence) : buildAgentChatHtmlData(range, evidence);
  const html = renderReviewHtml(data);
  const markdown = buildReviewMarkdown(data, htmlFileName);
  return {
    baseName,
    markdown,
    html,
    markdownFileName,
    htmlFileName,
    summary: data.verdict
  };
}
function buildAgentChatHtmlData(range, evidence) {
  const promptRows = splitPromptSamples(evidence.promptSamples);
  const hasPromptSamples = evidence.promptSamples.length > 0;
  return {
    title: "Agent \u5BF9\u8BDD\u4F7F\u7528\u5468\u590D\u76D8",
    periodLabel: `${range.startDate} \u81F3 ${range.endDate}`,
    scopeLabel: "Obsidian / \u975E\u77E5\u8BC6\u5E93\u9891\u9053",
    verdict: evidence.sessionCount ? `\u4E00\u773C\u7ED3\u8BBA\uFF1A\u672C\u5468\u666E\u901A Agent \u5BF9\u8BDD\u5171 ${evidence.sessionCount} \u4E2A\u4F1A\u8BDD\uFF0C\u91CD\u70B9\u95EE\u9898\u662F\u957F\u7EBF\u7A0B\u3001\u5931\u8D25\u4E2D\u65AD\u548C\u63D0\u793A\u8BCD\u662F\u5426\u524D\u7F6E\u9A8C\u6536\u3002` : "\u4E00\u773C\u7ED3\u8BBA\uFF1A\u672C\u5468\u6CA1\u6709\u666E\u901A Agent \u5BF9\u8BDD\u8BB0\u5F55\u3002",
    metrics: [
      { label: "\u6709\u6548\u4F1A\u8BDD", value: String(evidence.sessionCount) },
      { label: "\u7528\u6237\u6D88\u606F", value: String(evidence.userMessageCount) },
      { label: "\u672C\u673A tokens", value: formatNumber(evidence.totalTokens) },
      { label: "\u538B\u7F29\u6B21\u6570", value: String(evidence.contextCompactionCount) }
    ],
    scores: [
      { label: "\u65B9\u5411\u9009\u62E9", rating: evidence.sessionCount ? "\u4E2D\u4E0A" : "\u672A\u53D1\u751F", description: evidence.sessionCount ? "\u4EE5\u7528\u6237\u4E3B\u52A8\u53D1\u8D77\u7684\u666E\u901A Agent \u5BF9\u8BDD\u4E3A\u51C6\u3002" : "\u6CA1\u6709\u53EF\u8BC4\u4EF7\u6837\u672C\u3002" },
      { label: "\u6267\u884C\u6548\u7387", rating: evidence.longSessionCount ? "\u4E2D" : "\u597D", description: evidence.longSessionCount ? "\u5B58\u5728\u957F\u7EBF\u7A0B\u6216\u9AD8 token \u4F1A\u8BDD\u3002" : "\u6CA1\u6709\u660E\u663E\u957F\u7EBF\u7A0B\u4FE1\u53F7\u3002" },
      { label: "\u63D0\u793A\u8BCD\u8D28\u91CF", rating: hasPromptSamples && promptRows.high.some((row) => row.judgement === "\u9AD8\u8D28\u91CF") ? "\u4E2D\u4E0A" : "\u5F85\u89C2\u5BDF", description: hasPromptSamples ? "\u6309\u672C\u5468\u7528\u6237\u539F\u59CB\u63D0\u793A\u8BCD\u6837\u672C\u5224\u65AD\u3002" : "\u63D0\u793A\u8BCD\u6837\u672C\u4E0D\u8DB3\u3002" },
      { label: "\u51B3\u7B56\u8D28\u91CF", rating: evidence.failedMessageCount ? "\u4E2D" : "\u4E2D\u4E0A", description: evidence.failedMessageCount ? "\u5B58\u5728\u5931\u8D25\u8BB0\u5F55\uFF0C\u9700\u8981\u770B\u5931\u8D25\u524D\u7684\u51B3\u7B56\u3002" : "\u5931\u8D25\u8BB0\u5F55\u5C11\u3002" },
      { label: "token \u4F7F\u7528\u6548\u7387", rating: evidence.totalTokens > 1e6 ? "\u4E2D\u504F\u4F4E" : "\u4E2D\u4E0A", description: "token \u53EA\u4F5C\u4E3A\u672C\u673A\u4F7F\u7528\u8BC1\u636E\uFF0C\u4E0D\u7B49\u4E8E\u7CBE\u786E\u8D26\u5355\u3002" },
      { label: "\u4F7F\u7528\u65B9\u5F0F", rating: evidence.sessionCount ? evidence.toolEventCount ? "\u597D" : "\u4E2D" : "\u5F85\u89C2\u5BDF", description: evidence.sessionCount ? evidence.toolEventCount ? "\u5305\u542B\u771F\u5B9E\u5DE5\u5177\u6267\u884C\u8BB0\u5F55\u3002" : "\u4E3B\u8981\u662F\u5BF9\u8BDD\u8BB0\u5F55\u3002" : "\u6837\u672C\u4E0D\u8DB3\u3002" }
    ],
    distribution: [
      { label: "\u666E\u901A Agent \u5BF9\u8BDD", countLabel: `${evidence.sessionCount} \u4F1A\u8BDD / ${evidence.totalMessageCount} \u6D88\u606F`, value: evidence.sessionCount ? 100 : 0, description: "\u53EA\u7EDF\u8BA1\u975E\u77E5\u8BC6\u5E93\u9891\u9053\u3002" },
      { label: "\u5DE5\u5177/\u8FC7\u7A0B\u4E8B\u4EF6", countLabel: `${evidence.toolEventCount} \u6761`, value: percentOf(evidence.toolEventCount, evidence.totalMessageCount), description: "\u547D\u4EE4\u3001\u6587\u4EF6\u3001MCP \u7B49\u8FC7\u7A0B\u8BB0\u5F55\u3002" },
      { label: "\u5931\u8D25/\u4E2D\u65AD\u4FE1\u53F7", countLabel: `${evidence.failedMessageCount + evidence.interruptedMessageCount} \u6761`, value: percentOf(evidence.failedMessageCount + evidence.interruptedMessageCount, evidence.totalMessageCount), description: "\u7528\u4E8E\u5224\u65AD\u8FD4\u5DE5\u548C\u963B\u585E\u3002" }
    ],
    highQualityPrompts: promptRows.high,
    lowEfficiencyPrompts: promptRows.low,
    goodDecisions: [
      { decision: "\u628A\u666E\u901A\u5BF9\u8BDD\u548C\u77E5\u8BC6\u5E93\u9891\u9053\u5206\u5F00\u590D\u76D8", evaluation: "\u907F\u514D\u628A\u77E5\u8BC6\u5E93\u7EF4\u62A4\u7684\u81EA\u52A8\u5316\u6210\u672C\u6DF7\u8FDB\u666E\u901A Agent \u4F7F\u7528\u6548\u7387\u3002" },
      { decision: "\u4FDD\u7559 token\u3001\u5931\u8D25\u3001\u538B\u7F29\u7B49\u672C\u673A\u8BC1\u636E", evaluation: "\u80FD\u5BA2\u89C2\u5B9A\u4F4D\u6548\u7387\u95EE\u9898\u3002" }
    ],
    problemDecisions: [
      { decision: "\u957F\u7EBF\u7A0B\u627F\u8F7D\u8FC7\u591A\u9636\u6BB5", problem: `${evidence.longSessionCount} \u4E2A\u4F1A\u8BDD\u89E6\u53D1\u957F\u7EBF\u7A0B\u4FE1\u53F7\u3002`, correction: "\u9636\u6BB5\u5207\u6362\u65F6\u5F00\u65B0\u4F1A\u8BDD\uFF0C\u5E76\u5728\u9996\u6761\u6D88\u606F\u5199\u6E05\u76EE\u6807\u3001\u8FB9\u754C\u548C\u9A8C\u6536\u3002" },
      { decision: "\u5931\u8D25\u540E\u7EE7\u7EED\u8FFD\u52A0", problem: `${evidence.failedMessageCount} \u6761\u5931\u8D25\u8BB0\u5F55\u53EF\u80FD\u5BFC\u81F4\u4E0A\u4E0B\u6587\u6C61\u67D3\u3002`, correction: "\u5931\u8D25\u540E\u5148\u8981\u6C42\u6839\u56E0\u548C\u8BC1\u636E\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u7EE7\u7EED\u3002" }
    ],
    reworkItems: [
      { item: "\u63D0\u793A\u8BCD\u8FB9\u754C\u4E0D\u6E05", surfaceCause: "\u9996\u8F6E\u6307\u4EE4\u8FC7\u77ED", deepCause: "\u76EE\u6807\u3001\u7EA6\u675F\u3001\u9A8C\u6536\u6CA1\u6709\u524D\u7F6E", correction: "\u9996\u8F6E\u56FA\u5B9A\u5199\u76EE\u6807\u3001\u73B0\u72B6\u3001\u8303\u56F4\u3001\u9A8C\u6536\u3002" },
      { item: "\u4E0A\u4E0B\u6587\u538B\u7F29", surfaceCause: `${evidence.contextCompactionCount} \u6B21\u538B\u7F29`, deepCause: "\u7EBF\u7A0B\u8FC7\u957F\u6216\u8FC7\u7A0B\u8BB0\u5F55\u8FC7\u591A", correction: "\u957F\u4EFB\u52A1\u62C6\u9636\u6BB5\uFF0C\u5E76\u6C89\u6DC0 brief\u3002" }
    ],
    goodHabits: [
      { habit: "\u8981\u6C42\u8BC1\u636E\u94FE", evaluation: "\u80FD\u51CF\u5C11\u731C\u6D4B\uFF0C\u9002\u5408\u5DE5\u7A0B\u548C\u672C\u673A\u6392\u67E5\u3002" },
      { habit: "\u8BA9 Agent \u5148\u5224\u65AD\u518D\u6267\u884C", evaluation: "\u80FD\u964D\u4F4E\u8FD4\u5DE5\u3002" }
    ],
    badHabits: [
      { habit: "\u4E00\u53E5\u8BDD\u542F\u52A8\u5927\u4EFB\u52A1", problem: "\u5BB9\u6613\u8BA9 Agent \u5148\u505A\u540E\u6821\u51C6\u3002", correction: "\u5148\u8BA9 Agent \u62C6\u76EE\u6807\u548C\u98CE\u9669\u3002" },
      { habit: "\u957F\u7EBF\u7A0B\u7EE7\u7EED\u8FFD\u52A0", problem: "\u4E0A\u4E0B\u6587\u8D8A\u6765\u8D8A\u91CD\u3002", correction: "\u6309\u9636\u6BB5\u91CD\u5F00\u4F1A\u8BDD\u3002" }
    ],
    templates: defaultPromptTemplates(),
    checklist: defaultChecklist(evidence.failedMessageCount, evidence.longSessionCount),
    finalJudgement: evidence.sessionCount ? "\u672C\u5468\u666E\u901A Agent \u5BF9\u8BDD\u5DF2\u7ECF\u6709\u53EF\u590D\u76D8\u8BC1\u636E\u3002\u91CD\u70B9\u4E0D\u662F\u589E\u52A0\u4F7F\u7528\u6B21\u6570\uFF0C\u800C\u662F\u538B\u4F4E\u957F\u7EBF\u7A0B\u3001\u5931\u8D25\u540E\u8FFD\u52A0\u548C\u9A8C\u6536\u540E\u7F6E\u3002" : "\u672C\u5468\u666E\u901A Agent \u5BF9\u8BDD\u6837\u672C\u4E0D\u8DB3\uFF0C\u6682\u4E0D\u8BC4\u4EF7\u6548\u7387\u3002"
  };
}
function buildKnowledgeBaseHtmlData(range, evidence) {
  const commandTotal = Object.values(evidence.commandCounts).reduce((sum, value) => sum + value, 0);
  const reportPaths = uniqueCompact([
    ...evidence.maintenanceReports.map((report) => report.path),
    evidence.lastReportPath,
    evidence.dashboard.latestReportPath
  ]);
  return {
    title: "\u77E5\u8BC6\u5E93\u4F7F\u7528\u5468\u590D\u76D8",
    periodLabel: `${range.startDate} \u81F3 ${range.endDate}`,
    scopeLabel: "Obsidian / \u77E5\u8BC6\u5E93\u9891\u9053",
    verdict: commandTotal ? `\u4E00\u773C\u7ED3\u8BBA\uFF1A\u672C\u5468\u77E5\u8BC6\u5E93\u9891\u9053\u53D1\u751F ${commandTotal} \u6B21\u7528\u6237\u8BF7\u6C42\uFF0C\u91CD\u70B9\u770B\u7EF4\u62A4\u3001\u4F53\u68C0\u3001\u95EE\u7B54\u548C\u5065\u5EB7\u72B6\u6001\u662F\u5426\u7A33\u5B9A\u3002` : "\u4E00\u773C\u7ED3\u8BBA\uFF1A\u672C\u5468\u77E5\u8BC6\u5E93\u9891\u9053\u6CA1\u6709\u660E\u663E\u4F7F\u7528\u8BB0\u5F55\u3002",
    metrics: [
      { label: "\u9891\u9053\u6D88\u606F", value: String(evidence.messageCount) },
      { label: "\u7528\u6237\u8BF7\u6C42", value: String(evidence.userMessageCount) },
      { label: "\u5065\u5EB7\u5206", value: evidence.dashboard.healthScore === void 0 ? "\u672A\u77E5" : String(evidence.dashboard.healthScore) },
      { label: "\u5931\u8D25\u6570", value: String(evidence.failedMessageCount) }
    ],
    scores: [
      { label: "\u65B9\u5411\u9009\u62E9", rating: commandTotal ? "\u597D" : "\u672A\u53D1\u751F", description: "\u53EA\u8BC4\u4EF7\u77E5\u8BC6\u5E93\u9891\u9053\uFF0C\u4E0D\u6DF7\u5165\u666E\u901A Agent \u5BF9\u8BDD\u3002" },
      { label: "\u6267\u884C\u6548\u7387", rating: evidence.failedMessageCount ? "\u4E2D" : "\u4E2D\u4E0A", description: evidence.failedMessageCount ? "\u5B58\u5728\u5931\u8D25\u8BB0\u5F55\u3002" : "\u5931\u8D25\u4FE1\u53F7\u5C11\u3002" },
      { label: "\u63D0\u793A\u8BCD\u8D28\u91CF", rating: evidence.commandCounts.ask || evidence.commandCounts.lint ? "\u4E2D\u4E0A" : "\u5F85\u89C2\u5BDF", description: "\u547D\u4EE4\u8D8A\u660E\u786E\uFF0C\u8D8A\u5BB9\u6613\u7A33\u5B9A\u590D\u76D8\u3002" },
      { label: "\u51B3\u7B56\u8D28\u91CF", rating: "\u4E2D\u4E0A", description: "\u77E5\u8BC6\u5E93\u4EFB\u52A1\u56F4\u7ED5 raw/wiki/outputs/inbox \u5C55\u5F00\u3002" },
      { label: "token \u4F7F\u7528\u6548\u7387", rating: "\u4E2D", description: "\u63D2\u4EF6\u5185\u53EA\u4FDD\u7559\u5468\u62A5\u884C\u4E3A\u8BC1\u636E\uFF0C\u4E0D\u505A\u7CBE\u786E\u8D26\u5355\u5224\u65AD\u3002" },
      { label: "\u4F7F\u7528\u65B9\u5F0F", rating: commandTotal ? "\u597D" : "\u5F85\u89C2\u5BDF", description: commandTotal ? "\u5DF2\u5F62\u6210\u77E5\u8BC6\u5E93\u9891\u9053\u4F7F\u7528\u8BB0\u5F55\u3002" : "\u6837\u672C\u4E0D\u8DB3\u3002" }
    ],
    distribution: [
      { label: "\u4F53\u68C0", countLabel: `${evidence.commandCounts.lint} \u6B21`, value: percentOf(evidence.commandCounts.lint, Math.max(1, commandTotal)), description: "\u68C0\u67E5\u65AD\u94FE\u3001\u5B64\u513F\u9875\u548C\u7EF4\u62A4\u98CE\u9669\u3002" },
      { label: "\u7EF4\u62A4/\u91CD\u63D0\u70BC", countLabel: `${evidence.commandCounts.maintain} \u6B21`, value: percentOf(evidence.commandCounts.maintain, Math.max(1, commandTotal)), description: "\u6D88\u5316 raw \u6216\u91CD\u65B0\u63D0\u70BC\u8D44\u6599\u3002" },
      { label: "\u95EE\u7B54", countLabel: `${evidence.commandCounts.ask} \u6B21`, value: percentOf(evidence.commandCounts.ask, Math.max(1, commandTotal)), description: "\u53EA\u8BFB\u67E5\u8BE2 wiki \u4F9D\u636E\u3002" },
      { label: "\u6536\u96C6/\u65E5\u8BB0/\u6574\u7406", countLabel: `${evidence.commandCounts.collect + evidence.commandCounts.journal + evidence.commandCounts.outputs + evidence.commandCounts.inbox} \u6B21`, value: percentOf(evidence.commandCounts.collect + evidence.commandCounts.journal + evidence.commandCounts.outputs + evidence.commandCounts.inbox, Math.max(1, commandTotal)), description: "\u8FDB\u5165 raw\u3001journal\u3001outputs \u6216 inbox \u7684\u52A8\u4F5C\u3002" }
    ],
    highQualityPrompts: [
      { scene: "\u77E5\u8BC6\u5E93\u9891\u9053", excerpt: "\u4F7F\u7528 /check\u3001/ask\u3001/maintain \u7B49\u660E\u786E\u547D\u4EE4", judgement: "\u9AD8\u8D28\u91CF", reason: "\u547D\u4EE4\u610F\u56FE\u6E05\u695A\uFF0C\u53EF\u590D\u76D8\u3002" },
      { scene: "\u4F53\u68C0\u4EFB\u52A1", excerpt: "\u53EA\u4F53\u68C0\u3001\u53EA\u770B\u65AD\u94FE\u3001\u53EA\u8BFB\u95EE\u7B54", judgement: "\u9AD8\u8D28\u91CF", reason: "\u80FD\u9650\u5236\u5199\u5165\u8303\u56F4\u3002" }
    ],
    lowEfficiencyPrompts: [
      { scene: "\u77E5\u8BC6\u5E93\u9891\u9053", excerpt: "\u6574\u7406\u4E00\u4E0B", problem: "\u8303\u56F4\u8FC7\u6CDB", impact: "Agent \u53EF\u80FD\u4E0D\u77E5\u9053\u5904\u7406 raw\u3001wiki\u3001outputs \u8FD8\u662F inbox\u3002", correction: "\u6539\u6210 /check\u3001/maintain\u3001/outputs\u3001/inbox \u6216 /ask\u3002" },
      { scene: "\u77E5\u8BC6\u5E93\u9891\u9053", excerpt: "\u5168\u90E8\u91CD\u505A", problem: "\u98CE\u9669\u9AD8", impact: "\u5BB9\u6613\u89E6\u53D1\u5927\u8303\u56F4\u91CD\u5199\u3002", correction: "\u9650\u5B9A\u5177\u4F53\u76EE\u5F55\u3001\u6587\u4EF6\u548C\u9A8C\u6536\u6807\u51C6\u3002" }
    ],
    goodDecisions: [
      { decision: "\u628A\u77E5\u8BC6\u5E93\u9891\u9053\u5355\u72EC\u590D\u76D8", evaluation: "\u80FD\u770B\u6E05 raw/wiki/outputs/inbox \u7684\u771F\u5B9E\u4F7F\u7528\u60C5\u51B5\u3002" },
      { decision: "\u4FDD\u7559\u6700\u8FD1\u7EF4\u62A4\u62A5\u544A", evaluation: "\u62A5\u544A\u6587\u4EF6\u53EF\u4EE5\u4F5C\u4E3A\u4E0B\u6B21\u4F53\u68C0\u7684\u8BC1\u636E\u3002" }
    ],
    problemDecisions: [
      { decision: "\u672A\u6307\u5B9A\u77E5\u8BC6\u5E93\u52A8\u4F5C", problem: "\u547D\u4EE4\u4E0D\u6E05\u4F1A\u6269\u5927\u4EFB\u52A1\u8303\u56F4\u3002", correction: "\u9996\u8BCD\u4F7F\u7528 /check\u3001/maintain\u3001/outputs\u3001/inbox\u3001/ask\u3002" },
      { decision: "\u5931\u8D25\u540E\u4E0D\u590D\u67E5\u62A5\u544A", problem: `${evidence.failedMessageCount} \u6761\u5931\u8D25\u4FE1\u53F7\u53EF\u80FD\u88AB\u5FFD\u7565\u3002`, correction: "\u5148\u6253\u5F00\u6700\u8FD1\u62A5\u544A\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u91CD\u8DD1\u3002" }
    ],
    reworkItems: [
      { item: "raw/wiki \u72B6\u6001\u6F02\u79FB", surfaceCause: "\u7D22\u5F15\u548C tracker \u53EF\u80FD\u4E0D\u540C\u6B65", deepCause: "\u65B0\u589E\u8D44\u6599\u672A\u53CA\u65F6\u7EF4\u62A4", correction: "\u5468\u62A5\u91CC\u6301\u7EED\u770B\u5065\u5EB7\u5206\u548C\u6700\u8FD1\u62A5\u544A\u3002" },
      { item: "\u95EE\u7B54\u4F9D\u636E\u4E0D\u6E05", surfaceCause: "\u81EA\u7136\u8BED\u8A00\u95EE\u9898\u6CA1\u6709\u9650\u5B9A\u6765\u6E90", deepCause: "wiki \u547D\u4E2D\u548C\u8865\u5145\u4FE1\u606F\u6DF7\u5728\u4E00\u8D77", correction: "\u4F18\u5148\u7528 /ask \u5E76\u8981\u6C42\u533A\u5206 Vault \u4F9D\u636E\u3002" }
    ],
    goodHabits: [
      { habit: "\u4F7F\u7528\u77E5\u8BC6\u5E93\u9891\u9053", evaluation: "\u6BD4\u666E\u901A\u804A\u5929\u66F4\u9002\u5408\u5F53\u524D Vault \u7EF4\u62A4\u3002" },
      { habit: "\u751F\u6210\u7EF4\u62A4\u62A5\u544A", evaluation: "\u8BA9\u77E5\u8BC6\u5E93\u5065\u5EB7\u72B6\u6001\u53EF\u8FFD\u6EAF\u3002" }
    ],
    badHabits: [
      { habit: "\u547D\u4EE4\u592A\u6CDB", problem: "\u5BB9\u6613\u8BA9\u7EF4\u62A4\u4EFB\u52A1\u8D8A\u754C\u3002", correction: "\u9009\u62E9\u660E\u786E\u547D\u4EE4\u5E76\u8FFD\u52A0\u9650\u5236\u3002" },
      { habit: "\u4E0D\u770B\u6700\u8FD1\u62A5\u544A", problem: "\u5BB9\u6613\u91CD\u590D\u4F53\u68C0\u6216\u5FFD\u7565\u98CE\u9669\u3002", correction: "\u5148\u6253\u5F00\u6700\u8FD1\u62A5\u544A\uFF0C\u518D\u51B3\u5B9A\u4E0B\u4E00\u6B65\u3002" }
    ],
    templates: defaultPromptTemplates(),
    checklist: [
      { item: "raw/wiki/outputs/inbox \u5065\u5EB7\u4FE1\u53F7", judgement: formatKnowledgeBaseDirectorySignal(evidence.dashboard) },
      { item: "wiki \u662F\u5426\u5065\u5EB7", judgement: evidence.dashboard.healthScore === void 0 ? "\u5065\u5EB7\u5206\u672A\u77E5\u3002" : `\u5065\u5EB7\u5206\uFF1A${evidence.dashboard.healthScore}\u3002` },
      { item: "\u8FD1\u671F\u7EF4\u62A4\u62A5\u544A", judgement: reportPaths.length ? reportPaths.join("\uFF1B") : "\u672A\u8BB0\u5F55\u6700\u8FD1\u62A5\u544A\u3002" },
      { item: "\u662F\u5426\u6DF7\u5165\u666E\u901A\u5BF9\u8BDD", judgement: "\u5426\uFF0C\u672C\u62A5\u544A\u53EA\u7EDF\u8BA1\u77E5\u8BC6\u5E93\u9891\u9053\u3002" }
    ],
    finalJudgement: commandTotal ? "\u672C\u5468\u77E5\u8BC6\u5E93\u4F7F\u7528\u5DF2\u7ECF\u6709\u53EF\u89C2\u5BDF\u8BB0\u5F55\u3002\u91CD\u70B9\u662F\u7EE7\u7EED\u7528\u660E\u786E\u547D\u4EE4\u7EA6\u675F\u8303\u56F4\uFF0C\u5E76\u8BA9\u7EF4\u62A4\u62A5\u544A\u6210\u4E3A\u5224\u65AD\u77E5\u8BC6\u5E93\u5065\u5EB7\u7684\u8BC1\u636E\u3002" : "\u672C\u5468\u77E5\u8BC6\u5E93\u4F7F\u7528\u6837\u672C\u4E0D\u8DB3\uFF0C\u6682\u4E0D\u8BC4\u4EF7\u6548\u7387\u3002"
  };
}
function buildReviewMarkdown(data, htmlFileName) {
  return [
    "---",
    `created: ${formatLocalDateTime(/* @__PURE__ */ new Date())}`,
    `updated: ${formatLocalDateTime(/* @__PURE__ */ new Date())}`,
    "---",
    `# ${data.title}`,
    "",
    `[\u6253\u5F00\u540C\u540D HTML \u770B\u677F](./${htmlFileName})`,
    "",
    `\u5468\u671F\uFF1A${data.periodLabel}  `,
    `\u53E3\u5F84\uFF1A${data.scopeLabel}`,
    "",
    "## 1. \u4E00\u773C\u7ED3\u8BBA",
    "",
    data.verdict,
    "",
    "| \u7EF4\u5EA6 | \u8BC4\u4EF7 | \u8BF4\u660E |",
    "|---|---|---|",
    ...data.scores.map((item) => `| ${mdCell(item.label)} | ${mdCell(item.rating)} | ${mdCell(item.description)} |`),
    "",
    "## 2. \u4F7F\u7528\u5206\u5E03\u5BA1\u67E5",
    "",
    "| \u7C7B\u522B | \u4F7F\u7528\u60C5\u51B5 | \u8BC4\u4EF7 |",
    "|---|---|---|",
    ...data.distribution.map((item) => `| ${mdCell(item.label)} | ${mdCell(item.countLabel)} | ${mdCell(item.description)} |`),
    "",
    "## 3. \u63D0\u793A\u8BCD\u8D28\u91CF\u5BA1\u67E5",
    "",
    "### 3.1 \u9AD8\u8D28\u91CF\u63D0\u793A\u8BCD",
    "",
    "| \u65E5\u671F / \u573A\u666F | \u539F\u59CB\u63D0\u793A\u8BCD\u6458\u5F55 | \u5224\u65AD | \u4E3A\u4EC0\u4E48\u597D |",
    "|---|---|---|---|",
    ...data.highQualityPrompts.map((item) => `| ${mdCell(item.scene)} | ${mdCell(item.excerpt)} | ${mdCell(item.judgement)} | ${mdCell(item.reason)} |`),
    "",
    "### 3.2 \u4F4E\u6548\u63D0\u793A\u8BCD",
    "",
    "| \u65E5\u671F / \u573A\u666F | \u539F\u59CB\u63D0\u793A\u8BCD\u6458\u5F55 | \u95EE\u9898 | \u5F71\u54CD | \u4FEE\u6B63\u65B9\u5F0F |",
    "|---|---|---|---|---|",
    ...data.lowEfficiencyPrompts.map((item) => `| ${mdCell(item.scene)} | ${mdCell(item.excerpt)} | ${mdCell(item.problem)} | ${mdCell(item.impact)} | ${mdCell(item.correction)} |`),
    "",
    "## 4. \u51B3\u7B56\u8D28\u91CF\u5BA1\u67E5",
    "",
    "### 4.1 \u597D\u51B3\u7B56",
    "",
    "| \u51B3\u7B56 | \u8BC4\u4EF7 |",
    "|---|---|",
    ...data.goodDecisions.map((item) => `| ${mdCell(item.decision)} | ${mdCell(item.evaluation)} |`),
    "",
    "### 4.2 \u95EE\u9898\u51B3\u7B56",
    "",
    "| \u51B3\u7B56/\u884C\u4E3A | \u95EE\u9898 | \u4FEE\u6B63\u65B9\u5F0F |",
    "|---|---|---|",
    ...data.problemDecisions.map((item) => `| ${mdCell(item.decision)} | ${mdCell(item.problem)} | ${mdCell(item.correction)} |`),
    "",
    "## 5. \u91CD\u590D\u8FD4\u5DE5\u5BA1\u67E5",
    "",
    "| \u8FD4\u5DE5\u70B9 | \u8868\u9762\u539F\u56E0 | \u6DF1\u5C42\u539F\u56E0 | \u4FEE\u6B63\u65B9\u5F0F |",
    "|---|---|---|---|",
    ...data.reworkItems.map((item) => `| ${mdCell(item.item)} | ${mdCell(item.surfaceCause)} | ${mdCell(item.deepCause)} | ${mdCell(item.correction)} |`),
    "",
    "## 6. \u4F7F\u7528\u4E60\u60EF\u5BA1\u67E5",
    "",
    "### 6.1 \u597D\u4E60\u60EF",
    "",
    "| \u4E60\u60EF | \u8BC4\u4EF7 |",
    "|---|---|",
    ...data.goodHabits.map((item) => `| ${mdCell(item.habit)} | ${mdCell(item.evaluation)} |`),
    "",
    "### 6.2 \u574F\u4E60\u60EF",
    "",
    "| \u4E60\u60EF | \u95EE\u9898 | \u4FEE\u6B63\u65B9\u5F0F |",
    "|---|---|---|",
    ...data.badHabits.map((item) => `| ${mdCell(item.habit)} | ${mdCell(item.problem)} | ${mdCell(item.correction)} |`),
    "",
    "## 7. \u63D0\u793A\u8BCD\u4FEE\u6B63\u6A21\u677F",
    "",
    ...data.templates.flatMap((item) => [`### ${item.title}`, "", "```text", item.body, "```", ""]),
    "## 8. \u56FA\u5B9A\u5BA1\u67E5\u9879",
    "",
    "| \u5BA1\u67E5\u9879 | \u5224\u65AD |",
    "|---|---|",
    ...data.checklist.map((item) => `| ${mdCell(item.item)} | ${mdCell(item.judgement)} |`),
    "",
    "## 9. \u6700\u7EC8\u5224\u65AD",
    "",
    data.finalJudgement,
    ""
  ].join("\n");
}
function splitPromptSamples(samples) {
  const high = samples.filter((sample) => /先|判断|验收|证据|复现|根因|不要|范围|目标|确认/.test(sample.text)).slice(0, 5).map((sample) => ({ scene: sample.scene, excerpt: sample.text, judgement: "\u9AD8\u8D28\u91CF", reason: "\u76EE\u6807\u3001\u9650\u5236\u6216\u9A8C\u6536\u524D\u7F6E\u3002" }));
  const low = samples.filter((sample) => !/先|判断|验收|证据|复现|根因|不要|范围|目标|确认/.test(sample.text)).slice(0, 5).map((sample) => ({ scene: sample.scene, excerpt: sample.text, problem: "\u6307\u4EE4\u504F\u6CDB", impact: "\u5BB9\u6613\u8BA9 Agent \u81EA\u884C\u8865\u76EE\u6807\u3002", correction: "\u8865\u5145\u76EE\u6807\u3001\u4E0A\u4E0B\u6587\u3001\u8303\u56F4\u548C\u9A8C\u6536\u6807\u51C6\u3002" }));
  if (!high.length) high.push({ scene: "\u6837\u672C\u4E0D\u8DB3", excerpt: "\u672C\u5468\u672A\u53D1\u73B0\u660E\u663E\u9AD8\u8D28\u91CF\u63D0\u793A\u8BCD\u6837\u672C\u3002", judgement: "\u5F85\u89C2\u5BDF", reason: "\u9700\u8981\u66F4\u591A\u7528\u6237\u539F\u59CB\u63D0\u793A\u8BCD\u3002" });
  if (!low.length) low.push({ scene: "\u6837\u672C\u4E0D\u8DB3", excerpt: "\u672C\u5468\u672A\u53D1\u73B0\u660E\u663E\u4F4E\u6548\u63D0\u793A\u8BCD\u6837\u672C\u3002", problem: "\u5F85\u89C2\u5BDF", impact: "\u6682\u65E0", correction: "\u7EE7\u7EED\u4FDD\u6301\u524D\u7F6E\u9A8C\u6536\u548C\u8BC1\u636E\u8981\u6C42\u3002" });
  return { high, low };
}
function defaultPromptTemplates() {
  return [
    { title: "\u4EA7\u54C1\u5224\u65AD\u7C7B", body: "\u5148\u4E0D\u8981\u5B9E\u73B0\u3002\n\n\u8BF7\u5148\u5224\u65AD\u8FD9\u4E2A\u9700\u6C42\u662F\u5426\u6210\u7ACB\uFF1A\n1. \u771F\u5B9E\u76EE\u6807\u662F\u4EC0\u4E48\uFF1F\n2. \u53EF\u80FD\u6709\u54EA\u4E9B\u9519\u8BEF\u5047\u8BBE\uFF1F\n3. \u54EA\u4E9B\u90E8\u5206\u503C\u5F97\u505A\uFF0C\u54EA\u4E9B\u4E0D\u503C\u5F97\u505A\uFF1F\n4. \u5982\u679C\u8981\u505A\uFF0C\u9A8C\u6536\u6807\u51C6\u662F\u4EC0\u4E48\uFF1F\n5. \u54EA\u4E9B\u95EE\u9898\u5FC5\u987B\u5148\u786E\u8BA4\uFF1F" },
    { title: "Bug \u6392\u67E5\u7C7B", body: "\u8BF7\u6309 bug \u6392\u67E5\u65B9\u5F0F\u5904\u7406\uFF1A\n\n1. \u5148\u590D\u73B0\u6216\u786E\u8BA4\u73B0\u8C61\u3002\n2. \u627E\u5230\u76F8\u5173\u4EE3\u7801\u94FE\u8DEF\u3002\n3. \u8BF4\u660E\u6839\u56E0\uFF0C\u4E0D\u8981\u53EA\u731C\u3002\n4. \u7ED9\u4FEE\u590D\u65B9\u6848\u3002\n5. \u4FEE\u590D\u540E\u8DD1\u9A8C\u8BC1\u3002\n6. \u6700\u540E\u544A\u8BC9\u6211\u8BC1\u636E\u3002" },
    { title: "\u5927\u529F\u80FD\u7C7B", body: "\u8FD9\u4E2A\u4EFB\u52A1\u53EF\u80FD\u4F1A\u5F88\u5927\u3002\n\n\u5148\u62C6\u6210\uFF1A\n1. \u4EA7\u54C1\u76EE\u6807\n2. \u7528\u6237\u8DEF\u5F84\n3. \u6280\u672F\u8FB9\u754C\n4. \u98CE\u9669\u70B9\n5. \u9A8C\u6536\u6807\u51C6\n\n\u62C6\u5B8C\u540E\u5148\u7ED9\u6211\u770B\uFF0C\u4E0D\u8981\u76F4\u63A5\u5199\u4EE3\u7801\u3002" },
    { title: "\u9632\u6B62\u8FD4\u5DE5\u7C7B", body: "\u5728\u6267\u884C\u524D\uFF0C\u8BF7\u5148\u6307\u51FA\uFF1A\n1. \u8FD9\u4E2A\u9700\u6C42\u91CC\u6700\u53EF\u80FD\u5BFC\u81F4\u8FD4\u5DE5\u7684\u5730\u65B9\u3002\n2. \u54EA\u4E9B\u5224\u65AD\u5982\u679C\u9519\u4E86\uFF0C\u540E\u9762\u4F1A\u91CD\u505A\u3002\n3. \u4F60\u5EFA\u8BAE\u5148\u9A8C\u8BC1\u54EA 3 \u4EF6\u4E8B\u3002" }
  ];
}
function defaultChecklist(failedCount, longSessionCount) {
  return [
    { item: "\u65F6\u95F4\u662F\u5426\u96C6\u4E2D\u5728\u9AD8\u4EF7\u503C\u4E3B\u7EBF", judgement: "\u770B\u6709\u6548\u4F1A\u8BDD\u548C\u6D88\u606F\u5206\u5E03\u3002" },
    { item: "\u63D0\u793A\u8BCD\u662F\u5426\u524D\u7F6E\u9A8C\u6536", judgement: "\u770B\u9AD8\u8D28\u91CF\u63D0\u793A\u8BCD\u6837\u672C\u3002" },
    { item: "\u662F\u5426\u8FC7\u65E9\u5B9E\u73B0", judgement: failedCount ? "\u5B58\u5728\u5931\u8D25\u4FE1\u53F7\uFF0C\u9700\u8981\u590D\u67E5\u3002" : "\u6682\u65E0\u660E\u663E\u5931\u8D25\u4FE1\u53F7\u3002" },
    { item: "\u662F\u5426\u91CD\u590D\u8BFB\u4E0A\u4E0B\u6587", judgement: longSessionCount ? `${longSessionCount} \u4E2A\u957F\u7EBF\u7A0B\u4FE1\u53F7\u3002` : "\u6682\u65E0\u660E\u663E\u957F\u7EBF\u7A0B\u4FE1\u53F7\u3002" },
    { item: "\u662F\u5426\u53D1\u751F\u8FD4\u5DE5", judgement: "\u7528\u5931\u8D25\u3001\u4E2D\u65AD\u3001\u538B\u7F29\u548C\u91CD\u590D\u8981\u6C42\u5224\u65AD\u3002" },
    { item: "\u8F93\u51FA\u662F\u5426\u6709\u8BC1\u636E", judgement: "\u770B\u5DE5\u5177\u4E8B\u4EF6\u548C\u62A5\u544A\u6587\u4EF6\u3002" }
  ];
}
function messagesInRange(messages, range) {
  return messages.filter((message) => message.createdAt >= range.startAt && message.createdAt <= range.endAt);
}
function isToolLikeMessage(message) {
  return message.role === "tool" || ["commandExecution", "fileChange", "mcpToolCall", "dynamicToolCall", "collabAgentToolCall"].includes(message.itemType ?? "");
}
function readTotalTokens(session) {
  const total = session.tokenUsage?.total?.totalTokens;
  return typeof total === "number" && Number.isFinite(total) ? Math.max(0, Math.round(total)) : 0;
}
function formatMessageScene(message) {
  const date = new Date(message.createdAt);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} / \u7528\u6237\u63D0\u793A`;
}
function trimText(value, max) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}\u2026` : text;
}
function percentOf(value, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, value / total * 100));
}
function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
}
function formatKnowledgeBaseDirectorySignal(evidence) {
  const parts = [
    formatOptionalCount("raw", evidence.rawCount),
    formatOptionalCount("wiki", evidence.wikiCount),
    formatOptionalCount("outputs", evidence.outputsCount),
    formatOptionalCount("inbox", evidence.inboxCount)
  ].filter(Boolean);
  return parts.length ? parts.join("\uFF1B") : "\u672A\u8BFB\u53D6\u5230\u76EE\u5F55\u5FEB\u7167\u3002";
}
function formatOptionalCount(label, value) {
  return value === void 0 ? "" : `${label} ${value}`;
}
function uniqueCompact(values) {
  return Array.from(new Set(values.map((value) => value?.trim() ?? "").filter(Boolean)));
}
function mdCell(value) {
  return value.replace(/\|/g, "\\|").replace(/\n+/g, "<br>");
}
function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

// src/review/manager.ts
var ReviewManager = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  scheduleTimer = null;
  running = false;
  register() {
    this.plugin.addCommand({
      id: "review-run-knowledge-base-now",
      name: "\u590D\u76D8\uFF1A\u751F\u6210\u77E5\u8BC6\u5E93\u5468\u62A5",
      callback: () => void this.runReview("knowledge-base")
    });
    this.plugin.addCommand({
      id: "review-run-agent-chat-now",
      name: "\u590D\u76D8\uFF1A\u751F\u6210 Agent \u5BF9\u8BDD\u5468\u62A5",
      callback: () => void this.runReview("agent-chat")
    });
    this.plugin.addCommand({
      id: "review-open-latest-html",
      name: "\u590D\u76D8\uFF1A\u6253\u5F00\u6700\u8FD1 HTML \u770B\u677F",
      callback: () => void this.openLatestHtml()
    });
  }
  unload() {
    if (this.scheduleTimer) {
      window.clearInterval(this.scheduleTimer);
      this.scheduleTimer = null;
    }
  }
  async runReview(kind, range) {
    if (this.running) {
      new import_obsidian7.Notice("\u590D\u76D8\u5468\u62A5\u6B63\u5728\u751F\u6210");
      return {
        status: "failed",
        markdownPath: "",
        htmlPath: "",
        summary: "",
        error: "\u5DF2\u6709\u590D\u76D8\u4EFB\u52A1\u6B63\u5728\u8FD0\u884C"
      };
    }
    this.running = true;
    const targetRange = range ?? reviewRangeForMode(this.plugin.settings.review.rangeMode);
    const state = this.stateForKind(kind);
    state.lastRunStatus = "running";
    state.lastError = "";
    await this.plugin.saveSettings(true);
    try {
      const evidence = kind === "knowledge-base" ? collectKnowledgeBaseReviewEvidence(this.plugin.settings, targetRange, {
        dashboard: await this.readKnowledgeDashboardEvidence(),
        maintenanceReports: await this.readMaintenanceReports(targetRange)
      }) : collectAgentChatReviewEvidence(this.plugin.settings, targetRange);
      const outputPath = normalizeReviewOutputDir(this.plugin.settings.review.outputDir, REVIEW_OUTPUT_DIR);
      const documents = buildReviewDocuments(kind, targetRange, evidence);
      const outputDir = path18.join(this.plugin.getVaultPath(), outputPath);
      await fsp12.mkdir(outputDir, { recursive: true });
      const markdownPath = (0, import_obsidian7.normalizePath)(`${outputPath}/${documents.markdownFileName}`);
      const htmlPath = (0, import_obsidian7.normalizePath)(`${outputPath}/${documents.htmlFileName}`);
      await fsp12.writeFile(path18.join(this.plugin.getVaultPath(), markdownPath), documents.markdown, "utf8");
      await fsp12.writeFile(path18.join(this.plugin.getVaultPath(), htmlPath), documents.html, "utf8");
      state.lastRunAt = Date.now();
      state.lastRunStatus = "success";
      state.lastRangeKey = reviewRangeKey(targetRange);
      state.lastMarkdownPath = markdownPath;
      state.lastHtmlPath = htmlPath;
      state.lastError = "";
      state.lastSummary = documents.summary.slice(0, 1e3);
      await this.plugin.saveSettings(true);
      new import_obsidian7.Notice(`\u5DF2\u751F\u6210${kindLabel(kind)}\u5468\u62A5\uFF1A${markdownPath}`);
      if (this.plugin.settings.review.openHtmlAfterRun) await this.plugin.openReviewHtmlPreview(htmlPath);
      return { status: "success", markdownPath, htmlPath, summary: state.lastSummary };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      state.lastRunAt = Date.now();
      state.lastRunStatus = "failed";
      state.lastError = message;
      await this.plugin.saveSettings(true);
      new import_obsidian7.Notice(`${kindLabel(kind)}\u5468\u62A5\u751F\u6210\u5931\u8D25\uFF1A${message}`);
      return {
        status: "failed",
        markdownPath: state.lastMarkdownPath,
        htmlPath: state.lastHtmlPath,
        summary: "",
        error: message
      };
    } finally {
      this.running = false;
    }
  }
  async runScheduledIfDue(forceCatchUp = false) {
    const settings = this.plugin.settings.review;
    if (!settings.enabled || this.running) return;
    const now = /* @__PURE__ */ new Date();
    const range = latestScheduledReviewRange(now, settings.scheduleTime);
    if (!range) return;
    const kinds = [];
    if (settings.knowledgeBaseEnabled && shouldRunScheduledReview(settings, "knowledge-base", now)) kinds.push("knowledge-base");
    if (settings.agentChatEnabled && shouldRunScheduledReview(settings, "agent-chat", now)) kinds.push("agent-chat");
    if (!forceCatchUp && !kinds.length) return;
    for (const kind of kinds) {
      await this.runReview(kind, range);
    }
  }
  async openLatestHtml(kind) {
    const states = kind ? [this.stateForKind(kind)] : [this.plugin.settings.review.reports.knowledgeBase, this.plugin.settings.review.reports.agentChat].filter((state2) => state2.lastHtmlPath).sort((left, right) => right.lastRunAt - left.lastRunAt);
    const state = states[0];
    if (!state?.lastHtmlPath) {
      new import_obsidian7.Notice("\u8FD8\u6CA1\u6709\u53EF\u6253\u5F00\u7684\u590D\u76D8 HTML \u770B\u677F");
      return;
    }
    await this.plugin.openReviewHtmlPreview(state.lastHtmlPath);
  }
  armSchedule() {
    if (this.scheduleTimer) window.clearInterval(this.scheduleTimer);
    this.scheduleTimer = window.setInterval(() => void this.runScheduledIfDue(), 60 * 1e3);
    this.plugin.registerInterval(this.scheduleTimer);
  }
  async runCatchUpIfNeeded() {
    if (!this.plugin.settings.review.catchUpOnStartup) return;
    await this.runScheduledIfDue(true);
  }
  stateForKind(kind) {
    return kind === "knowledge-base" ? this.plugin.settings.review.reports.knowledgeBase : this.plugin.settings.review.reports.agentChat;
  }
  async readKnowledgeDashboardEvidence() {
    const snapshot = await this.plugin.getKnowledgeBaseManager()?.getDashboardSnapshot().catch(() => null);
    if (!snapshot) return {};
    return {
      healthScore: snapshot.health.score,
      rawCount: snapshot.raw.fileCount,
      wikiCount: snapshot.wiki.fileCount,
      outputsCount: snapshot.outputs.fileCount,
      inboxCount: snapshot.inbox.fileCount,
      latestReportPath: snapshot.outputs.latestReportPath
    };
  }
  async readMaintenanceReports(range) {
    const outputsDir = path18.join(this.plugin.getVaultPath(), "outputs");
    const entries = [
      ...await readMaintenanceReportEntries(outputsDir, "outputs"),
      ...await readMaintenanceReportEntries(path18.join(outputsDir, "maintenance"), "outputs/maintenance")
    ];
    const reports = [];
    for (const entry of entries) {
      const absolute = path18.join(this.plugin.getVaultPath(), entry.path);
      const stat10 = await fsp12.stat(absolute).catch(() => null);
      if (!stat10 || stat10.mtimeMs < range.startAt || stat10.mtimeMs > range.endAt + 24 * 60 * 60 * 1e3) continue;
      const excerpt = (await fsp12.readFile(absolute, "utf8").catch(() => "")).trim().slice(0, 1e3);
      reports.push({
        path: (0, import_obsidian7.normalizePath)(entry.path),
        excerpt,
        mtime: stat10.mtimeMs
      });
    }
    return reports.sort((left, right) => right.mtime - left.mtime).slice(0, 5).map(({ path: path21, excerpt }) => ({ path: path21, excerpt }));
  }
};
async function readMaintenanceReportEntries(dir, relativeDir) {
  const entries = await fsp12.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isFile() && /^kb-maintenance-\d{4}-\d{2}-\d{2}\.md$/.test(entry.name)).map((entry) => ({ path: `${relativeDir}/${entry.name}` }));
}
function kindLabel(kind) {
  return kind === "knowledge-base" ? "\u77E5\u8BC6\u5E93" : "Agent \u5BF9\u8BDD";
}

// src/review/preview-view.ts
var fsp13 = __toESM(require("fs/promises"));
var path19 = __toESM(require("path"));
var import_obsidian8 = require("obsidian");
var VIEW_TYPE_REVIEW_PREVIEW = "codex-review-preview";
var ReviewPreviewView = class extends import_obsidian8.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  htmlPath = "";
  getViewType() {
    return VIEW_TYPE_REVIEW_PREVIEW;
  }
  getDisplayText() {
    return "\u590D\u76D8 HTML \u770B\u677F";
  }
  getIcon() {
    return "bar-chart-3";
  }
  async openHtml(relativePath) {
    const normalized = (0, import_obsidian8.normalizePath)(relativePath);
    if (!isReviewHtmlPath(normalized, this.plugin.settings.review.outputDir)) {
      new import_obsidian8.Notice("\u53EA\u80FD\u6253\u5F00 EchoInk \u751F\u6210\u7684\u590D\u76D8 HTML");
      return;
    }
    this.htmlPath = normalized;
    await this.render();
  }
  async onOpen() {
    await this.render();
  }
  async render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("codex-review-preview");
    if (!this.htmlPath) {
      contentEl.createDiv({ cls: "codex-resource-empty", text: "\u8FD8\u6CA1\u6709\u9009\u62E9\u590D\u76D8 HTML\u3002" });
      return;
    }
    const title = contentEl.createDiv({ cls: "codex-review-preview-title" });
    title.createSpan({ text: this.htmlPath });
    const frame = contentEl.createEl("iframe", {
      cls: "codex-review-preview-frame",
      attr: {
        title: this.htmlPath,
        sandbox: "allow-same-origin"
      }
    });
    const absolute = path19.join(this.plugin.getVaultPath(), this.htmlPath);
    const html = await fsp13.readFile(absolute, "utf8").catch(() => "");
    if (!html) {
      frame.remove();
      contentEl.createDiv({ cls: "codex-resource-error", text: "HTML \u6587\u4EF6\u4E0D\u5B58\u5728\u6216\u65E0\u6CD5\u8BFB\u53D6\u3002" });
      return;
    }
    frame.srcdoc = html;
  }
};

// src/main.ts
var CodexForObsidianPlugin = class extends import_obsidian9.Plugin {
  settings;
  lastStatus = null;
  view = null;
  reviewPreviewView = null;
  editorActions = null;
  knowledgeBase = null;
  review = null;
  saveTimer = null;
  saveQueue = Promise.resolve();
  rawWrites = /* @__PURE__ */ new Set();
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE_XIAOYUAN, (leaf) => {
      this.view = new XiaoyuanView(leaf, this);
      return this.view;
    });
    this.registerView(VIEW_TYPE_REVIEW_PREVIEW, (leaf) => {
      this.reviewPreviewView = new ReviewPreviewView(leaf, this);
      return this.reviewPreviewView;
    });
    this.addRibbonIcon("bot", "\u6253\u5F00 \u5C0F\u5143 \u4FA7\u680F", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-xiaoyuan-sidebar",
      name: "\u6253\u5F00 \u5C0F\u5143 \u4FA7\u680F",
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "new-xiaoyuan-chat",
      name: "\u65B0\u5EFA \u5C0F\u5143 \u4F1A\u8BDD",
      callback: async () => {
        await this.activateView();
        new import_obsidian9.Notice("\u5DF2\u6253\u5F00 \u5C0F\u5143\uFF0C\u53EF\u70B9\u51FB + \u65B0\u5EFA\u4F1A\u8BDD");
      }
    });
    this.addCommand({
      id: "editor-action-rewrite",
      name: "\u6539\u5199\u9009\u4E2D\u6587\u5B57",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "rewrite")
    });
    this.addCommand({
      id: "editor-action-expand",
      name: "\u6269\u5199\u9009\u4E2D\u6587\u5B57",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "expand")
    });
    this.addCommand({
      id: "editor-action-continue",
      name: "\u7EED\u5199\u9009\u4E2D\u6587\u5B57",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "continue")
    });
    this.addCommand({
      id: "editor-action-translate",
      name: "\u7FFB\u8BD1\u9009\u4E2D\u6587\u5B57\u4E3A\u82F1\u6587",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "translate")
    });
    this.addSettingTab(new XiaoyuanAgentSettingTab(this));
    this.editorActions = new EditorActionController(this);
    this.editorActions.register();
    this.knowledgeBase = new KnowledgeBaseManager(this);
    this.knowledgeBase.register();
    this.review = new ReviewManager(this);
    this.review.register();
    if (this.settings.autoOpen) {
      this.app.workspace.onLayoutReady(() => void this.activateView());
    }
    if (this.settings.editorActions.enabled) {
      this.app.workspace.onLayoutReady(() => {
        window.setTimeout(() => void this.ensureOpenCodeConnected(false, { silent: true }), 800);
      });
    }
  }
  async onunload() {
    this.editorActions?.cancelActiveCandidate("canceled", false);
    this.knowledgeBase?.unload();
    this.review?.unload();
    await this.saveSettings(true);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_XIAOYUAN);
  }
  async activateView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_XIAOYUAN);
    let leaf = leaves[0];
    if (!leaf) {
      const rightLeaf = this.app.workspace.getRightLeaf(false);
      if (!rightLeaf) throw new Error("\u65E0\u6CD5\u521B\u5EFA \u5C0F\u5143 \u53F3\u4FA7\u680F");
      leaf = rightLeaf;
      await leaf.setViewState({ type: VIEW_TYPE_XIAOYUAN, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    this.view?.focusInput();
  }
  async activateKnowledgeBaseChannel() {
    const session = ensureKnowledgeBaseSession(this.settings, this.getVaultPath());
    this.settings.activeSessionId = session.id;
    await this.saveSettings(true);
    await this.activateView();
    this.view?.refreshActiveSession();
  }
  applyComposerDefaultsToView() {
    this.view?.applySavedComposerDefaults();
  }
  getXiaoyuanView() {
    return this.view;
  }
  async openWorkspaceResourceSettings(tab = "plugins") {
    this.settings.settingsTab = "resources";
    this.settings.resourceManagementTab = tab;
    await this.saveSettings(true);
    const setting = this.app.setting;
    if (!setting?.open || !setting?.openTabById) {
      new import_obsidian9.Notice("\u65E0\u6CD5\u6253\u5F00\u63D2\u4EF6\u8BBE\u7F6E\u9875");
      return;
    }
    setting.open();
    setting.openTabById(this.manifest.id);
  }
  async ensureOpenCodeConnected(force = false, options = {}) {
    if (this.lastStatus?.connected && !force) return this.lastStatus;
    let initialAccountLabel;
    if (this.settings.assistantMode === "custom-api") {
      const activeProvider = getActiveApiProvider(this.settings);
      if (activeProvider) {
        initialAccountLabel = this.settings.settingsLanguage === "en" ? `Custom API: ${activeProvider.name}` : `\u81EA\u5B9A\u4E49 API\uFF1A${activeProvider.name}`;
      } else {
        initialAccountLabel = this.settings.settingsLanguage === "en" ? "No API provider" : "\u672A\u914D\u7F6E API";
      }
    } else {
      initialAccountLabel = this.settings.settingsLanguage === "en" ? "Disconnected" : "\u672A\u8FDE\u63A5";
    }
    this.lastStatus = {
      connected: false,
      accountLabel: initialAccountLabel,
      serverUrl: "",
      models: [],
      agents: [],
      skills: [],
      mcpServers: [],
      errors: []
    };
    const backend = new OpenCodeBackend({
      ...this.settings.opencode,
      vaultPath: this.getVaultPath()
    });
    try {
      await backend.connect();
      const [models, agents] = await Promise.all([
        backend.listModels(),
        backend.listAgents()
      ]);
      const info = backend.getConnectionInfo();
      let successAccountLabel;
      if (this.settings.assistantMode === "custom-api") {
        const activeProvider = getActiveApiProvider(this.settings);
        if (activeProvider) {
          successAccountLabel = this.settings.settingsLanguage === "en" ? `Custom API: ${activeProvider.name}` : `\u81EA\u5B9A\u4E49 API\uFF1A${activeProvider.name}`;
        } else {
          successAccountLabel = this.settings.settingsLanguage === "en" ? "No API provider" : "\u672A\u914D\u7F6E API";
        }
      } else if (this.settings.assistantMode === "hybrid") {
        const activeProvider = getActiveApiProvider(this.settings);
        const openCodeLabel = this.settings.settingsLanguage === "en" ? "OpenCode" : "OpenCode";
        if (activeProvider) {
          const apiLabel = this.settings.settingsLanguage === "en" ? `Custom API: ${activeProvider.name}` : `\u81EA\u5B9A\u4E49 API\uFF1A${activeProvider.name}`;
          successAccountLabel = this.settings.settingsLanguage === "en" ? `${apiLabel} + ${openCodeLabel}` : `${apiLabel} + ${openCodeLabel}`;
        } else {
          successAccountLabel = openCodeLabel;
        }
      } else {
        successAccountLabel = this.settings.settingsLanguage === "en" ? "OpenCode" : "OpenCode";
      }
      this.lastStatus = {
        connected: true,
        accountLabel: successAccountLabel,
        serverUrl: info.serverUrl,
        models,
        agents,
        skills: [],
        mcpServers: [],
        errors: []
      };
      this.settings.opencode.lastConnectedAt = Date.now();
      this.settings.opencode.lastError = "";
      await this.saveSettings(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.lastStatus.errors = [message];
      this.settings.opencode.lastError = message;
      await this.saveSettings(true);
      if (!options.silent) {
        new import_obsidian9.Notice(this.settings.settingsLanguage === "en" ? `OpenCode connection failed: ${message}` : `OpenCode \u8FDE\u63A5\u5931\u8D25\uFF1A${message}`);
      }
    } finally {
      await backend.disconnect();
    }
    return this.lastStatus;
  }
  getVaultPath() {
    const adapter = this.app.vault.adapter;
    return adapter.basePath || adapter.path || "";
  }
  getPluginDataDirName() {
    const dir = this.manifest.dir;
    return typeof dir === "string" && dir.trim() ? dir : this.manifest.id;
  }
  async loadSettings() {
    const data = await this.loadData() ?? {};
    const previousVersion = typeof data?.settingsVersion === "number" ? data.settingsVersion : 0;
    const normalized = normalizeSettingsData(data);
    this.settings = normalized.settings;
    const sessionCountBefore = this.settings.sessions.length;
    const knowledgeSessionBefore = this.settings.knowledgeBase.sessionId;
    const knowledgeRulesMigrated = await this.applyKnowledgeBaseRulesFileDefault(data);
    ensureKnowledgeBaseSession(this.settings, this.getVaultPath());
    const legacyChatWorkspacesCleared = clearLegacyChatWorkspaceDefaults(this.settings, this.getVaultPath(), previousVersion);
    const knowledgeStatusRecovered = await this.recoverKnowledgeBaseLintStatus();
    let rawMigrated = 0;
    let historyMigrated = false;
    try {
      rawMigrated = await externalizeLargeMessages(this.getVaultPath(), this.settings, this.getPluginDataDirName());
    } catch (error) {
      console.error("OpenCode raw message migration failed", error);
    }
    try {
      historyMigrated = (await migrateKnowledgeBaseHistory(this.getVaultPath(), this.getPluginDataDirName(), this.settings)).changed;
    } catch (error) {
      console.error("OpenCode knowledge history migration failed", error);
    }
    const knowledgeSessionChanged = sessionCountBefore !== this.settings.sessions.length || knowledgeSessionBefore !== this.settings.knowledgeBase.sessionId;
    if (normalized.changed || rawMigrated > 0 || historyMigrated || legacyChatWorkspacesCleared > 0 || knowledgeSessionChanged || knowledgeStatusRecovered || knowledgeRulesMigrated) await this.saveSettings(true);
  }
  async applyKnowledgeBaseRulesFileDefault(data) {
    const rawSettings = data?.knowledgeBase;
    const hasExplicitRules = rawSettings && (typeof rawSettings.useCustomRulesFile === "boolean" || typeof rawSettings.rulesFilePath === "string");
    if (hasExplicitRules) return false;
    const vaultPath = this.getVaultPath();
    const agentsPath = path20.join(vaultPath, AGENTS_RULES_FILE);
    const llmWikiPath = path20.join(vaultPath, DEFAULT_KNOWLEDGE_BASE_RULES_FILE);
    const [agents, llmWiki] = await Promise.all([
      fsp14.readFile(agentsPath, "utf8").catch(() => ""),
      fsp14.readFile(llmWikiPath, "utf8").catch(() => "")
    ]);
    if (!agents || !llmWiki) return false;
    const agentsLooksLikeCodexMemory = /codex-memory|CODEX-MEMORY|项目级上下文管理/.test(agents);
    const llmWikiLooksLikeKnowledgeRules = /知识库|Raw Sources|Ingest|Lint|Wiki/.test(llmWiki);
    if (!agentsLooksLikeCodexMemory || !llmWikiLooksLikeKnowledgeRules) return false;
    this.settings.knowledgeBase.useCustomRulesFile = true;
    this.settings.knowledgeBase.rulesFilePath = DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
    return true;
  }
  async saveSettings(force = false) {
    if (force) {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      await this.flushSettingsSave();
      return;
    }
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.flushSettingsSave();
    }, 750);
  }
  async externalizeMessageText(message, fullText) {
    const write = prepareRawMessage(message, fullText);
    if (!write) return;
    let tracked;
    tracked = writeRawText(this.getVaultPath(), write.rawRef, write.text, this.getPluginDataDirName()).catch((error) => {
      console.error("OpenCode raw message write failed", error);
      if (message.rawRef === write.rawRef) {
        message.text = fullText;
        delete message.previewText;
        delete message.rawRef;
        delete message.rawSize;
        delete message.rawLines;
        delete message.rawTruncatedForPreview;
      }
    }).finally(() => this.rawWrites.delete(tracked));
    this.rawWrites.add(tracked);
    await tracked;
  }
  async readRawMessageText(rawRef) {
    return readRawText(this.getVaultPath(), rawRef, this.getPluginDataDirName());
  }
  async readKnowledgeBaseHistoryIndex() {
    return readKnowledgeBaseHistoryIndex(this.getVaultPath(), this.getPluginDataDirName());
  }
  async readKnowledgeBaseHistoryDay(sessionId, date) {
    return readKnowledgeBaseHistoryDay(this.getVaultPath(), this.getPluginDataDirName(), sessionId, date);
  }
  async rebuildKnowledgeBaseHistoryIndex() {
    return rebuildKnowledgeBaseHistoryIndex(this.getVaultPath(), this.getPluginDataDirName());
  }
  async getKnowledgeBaseStorageStats() {
    return collectKnowledgeBaseStorageStats(this.getVaultPath(), this.getPluginDataDirName());
  }
  async exportKnowledgeBaseHistory() {
    return exportKnowledgeBaseHistory(this.getVaultPath(), this.getPluginDataDirName());
  }
  async compactOldKnowledgeBaseProcessHistory() {
    return compactOldKnowledgeBaseProcessHistory(this.getVaultPath(), this.getPluginDataDirName());
  }
  getKnowledgeBaseManager() {
    return this.knowledgeBase;
  }
  getReviewManager() {
    return this.review;
  }
  async openReviewHtmlPreview(relativePath) {
    const normalized = relativePath.replace(/\\/g, "/");
    if (!isReviewHtmlPath(normalized, this.settings.review.outputDir)) {
      new import_obsidian9.Notice("\u53EA\u80FD\u6253\u5F00 \u5C0F\u5143 \u751F\u6210\u7684\u590D\u76D8 HTML");
      return;
    }
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_REVIEW_PREVIEW)[0];
    if (!leaf) {
      const rightLeaf = this.app.workspace.getRightLeaf(false);
      if (!rightLeaf) throw new Error("\u65E0\u6CD5\u521B\u5EFA\u590D\u76D8\u9884\u89C8\u9875");
      leaf = rightLeaf;
      await leaf.setViewState({ type: VIEW_TYPE_REVIEW_PREVIEW, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    await this.reviewPreviewView?.openHtml(normalized);
  }
  async recoverKnowledgeBaseLintStatus() {
    const settings = this.settings.knowledgeBase;
    if (settings.lastRunStatus !== "failed" || !settings.lastReportPath) return false;
    const report = await readKnowledgeBaseReportExcerpt(this.getVaultPath(), settings.lastReportPath, 2e3);
    if (!report || !isLintOnlyKnowledgeBaseReport(report)) return false;
    settings.lastRunStatus = "success";
    settings.lastError = "";
    settings.lastSummary = `\u4F53\u68C0\u62A5\u544A\u5DF2\u751F\u6210\u3002\u4E0A\u6B21 OpenCode \u8FD4\u56DE\u5931\u8D25\u72B6\u6001\uFF0C\u4F46 lint-only \u62A5\u544A\u6587\u4EF6\u5B58\u5728\uFF0C\u5DF2\u6062\u590D\u4E3A\u6210\u529F\u3002

${report}`.slice(0, 1e3);
    return true;
  }
  handleOpenCodeNotification(notification) {
    this.view?.handleOpenCodeNotification(notification);
  }
  async flushSettingsSave() {
    const run = this.saveQueue.then(async () => {
      await this.flushRawWrites();
      await this.flushKnowledgeBaseHistory();
      await this.saveData(this.settings);
    });
    this.saveQueue = run.catch(() => void 0);
    await run;
  }
  async flushRawWrites() {
    const pending = Array.from(this.rawWrites);
    if (pending.length) await Promise.allSettled(pending);
  }
  async flushKnowledgeBaseHistory() {
    try {
      await persistAndCompactKnowledgeBaseHistory(this.getVaultPath(), this.getPluginDataDirName(), this.settings);
    } catch (error) {
      console.error("OpenCode knowledge history save failed", error);
    }
  }
};
