export interface ExampleItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateExamplePayload {
  name: string;
  description?: string;
}
