import { compile } from 'handlebars';

export class HandlebarGenerator {
  static generate(templateString: string, config: any) {
    return compile(templateString)(config);
  }
}
