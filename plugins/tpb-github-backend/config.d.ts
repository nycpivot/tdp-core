export interface Config {
  esback?: {
    catalog?: {
      providers?: {
        github?: {
          orgEntity?: {
            id?: string;
            orgUrl: string;
          };
        };
      };
    };
  };
}
