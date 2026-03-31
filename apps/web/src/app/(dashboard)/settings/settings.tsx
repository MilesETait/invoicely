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
            <CardDescription>Connect to your own PostgreSQL database (Supabase, Neon, or any provider).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p className="text-muted-foreground">
              This app uses Drizzle ORM with PostgreSQL. To connect your own database, set the{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 text-xs font-mono">DATABASE_URL</code> environment
              variable in your <code className="bg-muted rounded px-1.5 py-0.5 text-xs font-mono">.env</code> file.
            </p>
            <div className="bg-muted rounded-md p-3 font-mono text-xs">
              <p className="text-muted-foreground"># .env</p>
              <p>DATABASE_URL=&quot;postgresql://[user]:[password]@[host]:[port]/[database]&quot;</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-medium">For Supabase:</p>
              <ol className="text-muted-foreground list-inside list-decimal space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>
                  Navigate to <span className="font-medium text-foreground">Project Settings → Database</span>
                </li>
                <li>Copy the &quot;Connection string&quot; (URI format)</li>
                <li>
                  Paste it as your <code className="bg-muted rounded px-1 py-0.5 text-xs font-mono">DATABASE_URL</code>
                </li>
              </ol>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-medium">After setting the connection string:</p>
              <div className="bg-muted rounded-md p-3 font-mono text-xs">
                <p className="text-muted-foreground"># Apply the database schema</p>
                <p>pnpm drizzle-kit push</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
