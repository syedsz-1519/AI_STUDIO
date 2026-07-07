export interface PocketExample {
  id: string;
  title: string;
  iconName: string;
  description: string;
  explanation: string;
}

export interface AIType {
  title: string;
  short: string;
  description: string;
  badge: string;
}

export interface MLType {
  title: string;
  analogy: string;
  description: string;
}

export interface PromptingType {
  title: string;
  definition: string;
  example: string;
}

export interface GoDeeperItem {
  id: string;
  title: string;
  oneLiner: string;
  expandedDetails: string;
  iconName: string;
}
