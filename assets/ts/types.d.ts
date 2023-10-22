export type Starter = {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  club: string;
};

export type Start = {
  id: number;
  event: string;
  category: string;
  name: string;
  teamname?: string;
  starters: Starter[];
};

export type TimeplanEntry = {
  order: number;
  duration_min: number;
  earliest_start?: Date;
  estimated_start: Date;
  planned_start: Date;
  event_type: string;
  event_name?: string;
  label: string;
  start_group: string;
  started?: Date;
  startlist_id: number;
  status: "open" | "active" | "done";
  start?: Start;
};

export type Timeplan = TimeplanEntry[];

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
    startViewTransition?: (
      modifyHtml: () => Promise<unknown> | void
    ) => Promise<void>;
  }
  export interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
