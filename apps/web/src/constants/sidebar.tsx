import { FolderFeatherIcon, GearIcon, ReceiptIcon, VersionsIcon } from "@/assets/icons";
import type { ISidebar } from "@/types";
import { LINKS } from "./links";

export const SIDEBAR_ITEMS: ISidebar = {
  Create: [
    {
      name: "Create Invoice",
      url: LINKS.CREATE.INVOICE,
      icon: <ReceiptIcon />,
      emphasis: true,
    },
  ],
  Navigation: [
    {
      name: "Invoices",
      url: LINKS.INVOICES,
      icon: <VersionsIcon />,
    },
    {
      name: "Manage Assets",
      url: LINKS.ASSETS,
      icon: <FolderFeatherIcon />,
    },
    {
      name: "Settings",
      url: LINKS.SETTINGS,
      icon: <GearIcon />,
    },
  ],
};
