import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { listPresetsQuery } from "@/lib/db-queries/preset/listPresets";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { listPresetsSchema } from "@/zod-schemas/preset";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

export const listPresets = authorizedProcedure.input(listPresetsSchema).query(async ({ ctx, input }) => {
  const listPresetsEffect = Effect.gen(function* () {
    const presets = yield* Effect.tryPromise({
      try: () => listPresetsQuery(ctx.auth.user.id, input.sectionType),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    return presets;
  });

  return Effect.runPromise(
    listPresetsEffect.pipe(
      Effect.catchTags({
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
