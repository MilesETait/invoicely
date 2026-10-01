"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="dash-page gap-4 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold tracking-tight">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Database Connection
              <Badge variant="blue" className="text-xs">
                Server-side
              </Badge>
            </CardTitle>
            <CardDescription>Connect the app to your own Neon Postgres database.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p className="text-muted-foreground">
              This app uses Drizzle ORM with Neon&apos;s serverless HTTP driver, so the database must be a{" "}
              <span className="text-foreground font-medium">Neon</span> Postgres database. Other providers such as
              Supabase are not supported without changing the driver in{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">packages/db</code>. Point the app at it
              with the <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">DATABASE_URL</code>{" "}
              environment variable.
            </p>
            <div className="bg-muted rounded-md p-3 font-mono text-xs">
              <p className="text-muted-foreground"># .env</p>
              <p>
                DATABASE_URL=&quot;postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require&quot;
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-medium">On Vercel:</p>
              <ol className="text-muted-foreground list-inside list-decimal space-y-1">
                <li>
                  Open your project and go to{" "}
                  <span className="text-foreground font-medium">Storage → Create → Neon</span>
                </li>
                <li>
                  Connect the database to the project. Vercel sets{" "}
                  <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">DATABASE_URL</code> for you
                </li>
                <li>
                  Run <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">vercel env pull .env</code> to
                  use the same database locally
                </li>
              </ol>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-medium">After setting the connection string:</p>
              <div className="bg-muted rounded-md p-3 font-mono text-xs">
                <p className="text-muted-foreground"># Apply the database schema</p>
                <p>yarn db:migrate</p>
              </div>
              <p className="text-muted-foreground text-xs">
                The app must be restarted after changing the database connection.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Storage</CardTitle>
            <CardDescription>How your local data is stored in the browser.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p className="text-muted-foreground">
              Invoices and presets created without a database connection are stored in your browser&apos;s IndexedDB.
              This data persists automatically between sessions — no folder selection or manual export is needed.
            </p>
            <p className="text-muted-foreground">
              When you connect a database and sign in, you can migrate local invoices to the server using the
              &quot;Migrate to DB&quot; action in the invoice list.
            </p>
            <p className="text-muted-foreground">
              Presets behave the same way. Ones you save while signed out stay in IndexedDB on this browser; once you
              sign in, presets are saved to the server and follow you across devices. The preset dropdown shows both
              together.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
