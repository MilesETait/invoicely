import { updatePresetQuery } from "@/lib/db-queries/preset/updatePreset";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { updatePresetSchema } from "@/zod-schemas/preset";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

interface MutationResponse {
  success: boolean;
  message: string;
}

export const updatePreset = authorizedProcedure
  .input(updatePresetSchema)
  .mutation<MutationResponse>(async ({ ctx, input }) => {
    const updatePresetEffect = Effect.gen(function* () {
      yield* Effect.tryPromise({
        try: () => updatePresetQuery(input.id, ctx.auth.user.id, { name: input.name, data: input.data }),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      return {
        success: true,
        message: "Preset updated successfully",
      };
    });

    return Effect.runPromise(
      updatePresetEffect.pipe(
        Effect.catchTags({
          InternalServerError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
