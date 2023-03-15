export type Starter = {
  number: number;
  name: string;
}

export type Start = {
  type: "paar" | "einzel" | "gruppe";
  category: string;
  time: string;
  name: string;
  imageSrc: string;
  starters: Starter[];
}

export type StartGroup = {
  type: "startgroup";
  category: string;
  starts: Start[];
}

export type Startlist = StartGroup[];

declare global {
  export interface Document {
    startViewTransition?: (modifyHtml: () => Promise<any> | void) => ReturnType<typeof modifyHtml>;
  }
}
