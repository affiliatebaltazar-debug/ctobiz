export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  status: "active" | "idle" | "configuring";
  icon: string;
}
