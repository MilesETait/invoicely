"use client";

import { OpenPanelComponent } from "@openpanel/nextjs";
import { env } from "@invoicely/utilities";

export const OpenPanelProvider = ({ children }: { children: React.ReactNode }) => {
  // OpenPanel is optional; without a client id no tracking script is loaded
  const clientId = env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;

  return (
    <>
      {clientId && (
        <OpenPanelComponent
          clientId={clientId}
          trackScreenViews={true}
          trackAttributes={true}
          trackOutgoingLinks={true}
          trackHashChanges={true}
        />
      )}
      {children}
    </>
  );
};
