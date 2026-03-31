import { insertPresetQuery } from "@/lib/db-queries/preset/insertPreset";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { createPresetSchema, presetDataSchemaMap } from "@/zod-schemas/preset";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

interface MutationResponse {
  success: boolean;
  message: string;
  presetId?: string;
}

export const insertPreset = authorizedProcedure
  .input(createPresetSchema)
  .mutation<MutationResponse>(async ({ ctx, input }) => {
    const insertPresetEffect = Effect.gen(function* () {
      // Validate data against the section-specific schema
      const dataSchema = presetDataSchemaMap[input.sectionType];
      const parseResult = dataSchema.safeParse(input.data);
      if (!parseResult.success) {
        return yield* Effect.fail(
          new TRPCError({ code: "BAD_REQUEST", message: "Invalid preset data for this section type." }),
        );
      }

      const presetId = yield* Effect.tryPromise({
        try: () => insertPresetQuery(ctx.auth.user.id, input.sectionType, input.name, parseResult.data),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      return {
        success: true,
        message: "Preset saved successfully",
        presetId,
      };
    });

    return Effect.runPromise(
      insertPresetEffect.pipe(
        Effect.catchTags({
          InternalServerError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
