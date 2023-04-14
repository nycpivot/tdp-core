import { compile } from 'handlebars';
import { RawContent } from './File';

export class HandlebarGenerator {
  static generate(template: RawContent, config: any) {
    return compile(template)(config);
  }
}
