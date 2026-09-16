# 0006. The reservation form states that it has no backend

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Company site |
| Evidence | as-site components/reserve-form.tsx |

## Context

The strategy calls for a form that reserves a seat at an event. The site has no
backend, no mailbox and no database, and a reservation that appears to be taken and
is not would be a false statement on a site whose argument is that claims must be
checkable.

## Decision

The form is real and complete: it collects a name, an email, an organisation, a
reason and a note, and it validates what it can. It says, in the interface and
before submission, that it is not connected yet, and after submission it says the
same thing rather than showing a confirmation.

## Alternatives considered

Removing the form was rejected: the reservation is the one interactive element the
launch needs, and its shape is worth reviewing now. Hiding the disclaimer was
rejected as the single cheapest way to lose the credibility the rest of the site is
built to earn. A third-party form endpoint was rejected because no owner has chosen
one yet.

## Consequences

The form is a specification of what the reservation will collect, and it is honest
at every step. Wiring it up is a small change: the fields and their validation stay
as they are.
