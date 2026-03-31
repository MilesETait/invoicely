"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

import { type ISidebarItem } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavigationItem({ title, items }: { title: string; items: ISidebarItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="select-none">{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                variant={isActive ? "active" : "default"}
                className={cn(
                  item.emphasis &&
                    !isActive &&
                    "bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/15",
                )}
              >
                <Link href={item.url}>
                  <span className="[&>svg]:size-4">{item.icon}</span>
                  <span className="text-[13px] font-medium tracking-tighter">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
