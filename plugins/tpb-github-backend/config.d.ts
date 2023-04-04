export interface Config {
  tpb?: {
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
