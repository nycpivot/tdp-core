var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// index.ts
var eslint_plugin_todo_format_exports = {};
__export(eslint_plugin_todo_format_exports, {
  rules: () => rules
});

// lib/rules/todoFormat.ts
var todoFormat_exports = {};
__export(todoFormat_exports, {
  BAD_TODO_COMMENT_MESSAGE: () => BAD_TODO_COMMENT_MESSAGE,
  create: () => create,
  meta: () => meta
});
var BAD_TODO_COMMENT_MESSAGE = "TODO comment must match expected format, including Jira ticket ID: `// TODO: ABC-123 - Short description of ticket`";
var IS_TODO_COMMENT = /^.*TO\s*DO.*$/mu;
var IS_VALID_TODO_COMMENT = /^(?:[\t ]*\*)? TODO: [A-Z]{3,}-\d+ - \S.*$/mu;
var meta = {
  type: "suggestion",
  docs: {
    description: "Requires that TODO comments have a corresponding Jira ticket as well as a short inline description"
  }
};
var create = (context) => ({
  Program: (program) => {
    var _a;
    (_a = program.comments) == null ? void 0 : _a.forEach((commentNode) => {
      if (!IS_TODO_COMMENT.test(commentNode.value)) {
        return;
      }
      if (!IS_VALID_TODO_COMMENT.test(commentNode.value)) {
        const loc = commentNode.loc !== void 0 && commentNode.loc !== null ? commentNode.loc : { line: 0, column: 0 };
        context.report({
          loc,
          message: BAD_TODO_COMMENT_MESSAGE
        });
      }
    });
  }
});

// index.ts
var rules = {
  "todo-format": todoFormat_exports
};
module.exports = __toCommonJS(eslint_plugin_todo_format_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rules
});
