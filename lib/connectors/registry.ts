import type { MayaConnectorDefinition } from "./types";

export const whiteBoardroomConnectors: MayaConnectorDefinition[] = [
  {
    id: "microsoft-powerpoint",
    provider: "Microsoft 365",
    label: "PowerPoint",
    category: "presentations",
    capabilities: ["open", "import", "export", "present", "edit", "create", "share", "sync"],
    status: "requires-auth",
    authProvider: "microsoft",
  },
  {
    id: "adobe-photoshop",
    provider: "Adobe",
    label: "Photoshop",
    category: "creative",
    capabilities: ["open", "import", "export", "edit", "create", "share"],
    status: "requires-auth",
    authProvider: "adobe",
  },
  {
    id: "adobe-illustrator",
    provider: "Adobe",
    label: "Illustrator",
    category: "creative",
    capabilities: ["open", "import", "export", "edit", "create", "share"],
    status: "requires-auth",
    authProvider: "adobe",
  },
  {
    id: "adobe-indesign",
    provider: "Adobe",
    label: "InDesign",
    category: "creative",
    capabilities: ["open", "import", "export", "edit", "create", "share"],
    status: "requires-auth",
    authProvider: "adobe",
  },
  {
    id: "adobe-acrobat",
    provider: "Adobe",
    label: "Acrobat / PDF",
    category: "documents",
    capabilities: ["open", "import", "export", "edit", "create", "share"],
    status: "requires-auth",
    authProvider: "adobe",
  },
  {
    id: "adobe-pagemaker-legacy",
    provider: "Adobe",
    label: "PageMaker (Legacy Import)",
    category: "creative",
    capabilities: ["import", "legacy-import", "export"],
    status: "legacy",
    notes: "Legacy PageMaker files are treated as import/convert workflows rather than a live application connector.",
  },
  {
    id: "microsoft-teams",
    provider: "Microsoft 365",
    label: "Teams",
    category: "meetings",
    capabilities: ["open", "create", "share", "sync"],
    status: "requires-auth",
    authProvider: "microsoft",
  },
];

export function getWhiteBoardroomConnector(id: string) {
  return whiteBoardroomConnectors.find((connector) => connector.id === id);
}
