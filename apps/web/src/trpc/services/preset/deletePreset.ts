import { deletePresetQuery } from "@/lib/db-queries/preset/deletePreset";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { deletePresetSchema } from "@/zod-schemas/preset";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

interface MutationResponse {
  success: boolean;
  message: string;
}

export const deletePreset = authorizedProcedure
  .input(deletePresetSchema)
  .mutation<MutationResponse>(async ({ ctx, input }) => {
    const deletePresetEffect = Effect.gen(function* () {
      yield* Effect.tryPromise({
        try: () => deletePresetQuery(input.id, ctx.auth.user.id),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      return {
        success: true,
        message: "Preset deleted successfully",
      };
    });

    return Effect.runPromise(
      deletePresetEffect.pipe(
        Effect.catchTags({
          InternalServerError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
