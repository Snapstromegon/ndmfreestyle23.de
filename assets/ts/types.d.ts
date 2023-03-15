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

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  export interface Document {
    startViewTransition?: (modifyHtml: () => Promise<unknown> | void) => Promise<void>;
  }
  export interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
