# 0001. The sites are built from the plans, final state first

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | as-site 9ec5c42, then 7fef259 to 992f802; asheeui-website ae10fa8 and a0bea2d |

## Context

Two site repositories already existed. The company site served a consultancy, and the documentation site served AsheeUI. The strategy the founding team recorded describes one company whose site becomes less mysterious over four months, and one library whose documentation carries a single honest claim about how it was built.

## Decision

Each site is written to its final state first, and the reveal is then produced by stepping backwards in commits. The company site ends as the full institution: the algorithm, the journey, the two events, the standards position, the moral framework, the two entities, the roles and the research.

## Alternatives considered

Building the reveal forward from a holding page was rejected: the final state is what the content has to support, and a step backwards is easier to review than a step forwards is to design. Keeping the consultancy site and adding the institutional pages beside it was rejected: the two argue different things about the same company.

## Consequences

The final state and the opening state both build, and every intermediate phase is one line and one commit. The content is a distillation of the plans by an implementer, so the founding team has to approve the claims before the site is public.
