"use client";

/**
 * The web utility blocks.
 *
 * The empty state is the one utility block a marketing or application page needs from a
 * builder: a region that has nothing in it yet, which a non-developer can word and
 * justify without touching code. The fields and the defaults come from `src/shared`.
 */

import { EmptyState } from "@asheeui/web";
import type { AsheeBlock, EmptyStateBlockProps } from "../../shared";
import { EMPTY_STATE_SPEC, toAction } from "../../shared";

/**
 * A region with nothing in it.
 */
export const emptyStateBlock: AsheeBlock<EmptyStateBlockProps> = {
  ...EMPTY_STATE_SPEC,
  render: ({ title, description, type, panel, primaryAction }) => (
    <div className="p-6">
      <EmptyState
        title={title ?? ""}
        description={description || undefined}
        type={type ?? "info"}
        panel={panel ?? false}
        primaryAction={toAction(primaryAction)}
      />
    </div>
  ),
};
