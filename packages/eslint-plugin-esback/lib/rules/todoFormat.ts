import type { Rule } from 'eslint'
import type { Comment, Program } from 'estree'

export const BAD_TODO_COMMENT_MESSAGE =
  'TODO comment must match expected format, including Jira ticket ID: `// TODO: ABC-123 - Short description of ticket`'

const IS_TODO_COMMENT = /^.*TO\s*DO.*$/mu
const IS_VALID_TODO_COMMENT = /^(?:[\t ]*\*)? TODO: [A-Z]{3,}-\d+ - \S.*$/mu

export const meta: Rule.RuleMetaData = {
  type: 'suggestion',
  docs: {
    description: 'Requires that TODO comments have a corresponding Jira ticket as well as a short inline description',
  },
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Program: (program: Program): void => {
    program.comments?.forEach((commentNode: Comment): void => {
      if (!IS_TODO_COMMENT.test(commentNode.value)) {
        return
      }

      if (!IS_VALID_TODO_COMMENT.test(commentNode.value)) {
        const loc = commentNode.loc !== undefined && commentNode.loc !== null ? commentNode.loc : { line: 0, column: 0 }

        context.report({
          loc: loc,
          message: BAD_TODO_COMMENT_MESSAGE,
        })
      }
    })
  },
})
