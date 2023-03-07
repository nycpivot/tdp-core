import * as todoFormat from './lib/rules/todoFormat'
import type { Rule } from 'eslint'

export const rules: Record<string, Rule.RuleModule> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'todo-format': todoFormat,
}
