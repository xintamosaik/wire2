interface Node {
  id: string;
  label: string;
  connections: Set<string>;
}

export type { Node };
