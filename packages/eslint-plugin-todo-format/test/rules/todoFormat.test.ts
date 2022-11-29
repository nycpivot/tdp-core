import { RuleTester } from 'eslint'
import * as todoFormat from '../../lib/rules/todoFormat'

describe('todoFormat', () => {
  new RuleTester().run('todo-format', todoFormat, {
    valid: [
      {
        code: '// TODO: ABC-123 - Fix this',
      },
      {
        code: '/* TODO: ABC-123 - Fix this */',
      },
      {
        code: '/**\n * TODO: ABC-123 - Fix this\n */',
      },
      {
        code: '// Not a comment about doing anything',
      },
      {
        code: 'var andThisCode = "contains no comments at all"',
      },
    ],
    invalid: [
      // Bad spacing
      {
        code: '// TO DO: ABC-123 - Fix this',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // Bad spacing, multiline comment
      {
        code: '//TODO: ABC-123 - Fix this',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // Bad spacing, multiline comment
      {
        code: '/*TODO: ABC-123 - Fix this*/',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // No ticket, no description
      {
        code: '// TODO',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // No separator
      {
        code: '// TODO ABC-123 - Fix this',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // No ticket
      {
        code: '// TODO: Fix this',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // Bad separator
      {
        code: '// TODO - ABC-123 - Fix this',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // No description
      {
        code: '// TODO: ABC-123',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // Bad separator
      {
        code: '// TODO: ABC-123: Fix this',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },

      // Multiline comment without a ticket ID
      {
        code: '  /**\n * TODO: Fix this\n */',
        errors: [{ message: todoFormat.BAD_TODO_COMMENT_MESSAGE }],
      },
    ],
  })
})
