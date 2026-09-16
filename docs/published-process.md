# How AsheeUI is built

| Field | Value |
|---|---|
| Document type | Public explanation |
| Owner | The project |
| Applies to | Every release of `asheeui` |

**Purpose.** This page states how AsheeUI is produced, what the automated part of
that work is allowed to decide, and what remains a person's decision. It exists
because the library is built with AI, and a claim about how a project was produced
is worth only what a reader can check.

---

## 1. The statement

AsheeUI is built with AI. The library is open, so the result can be inspected; this
page describes the process, so the claim about the result can be judged rather than
believed.

The process is not "ask a model for a component". It is a written loop with a
state, a plan, a verification, a repair step and a boundary at which a person
decides.

## 2. The loop

Every stage ends in a state a person can inspect.

```text
objective  intent, constraints and acceptance criteria, written first
state      requirements, decisions, tests and the current implementation, read together
plan       steps small enough to test, each with the evidence that would satisfy it
act        the implementation, written with the project's own tools and conventions
verify     tests, types, builds and audits; not an opinion about the code
diagnose   the class of a failure, decided before any repair
repair     the correction, then verification again; two failures of a kind stop the loop
review     the state, the evidence and the open questions, presented to a person
```

## 3. The authority boundary

The automated part may inspect, plan, implement, test, classify a failure, repair
it, refactor, document and prepare a release for review.

It stops, and asks, before:

- anything irreversible: a publish, a deletion or a migration;
- a change to the architecture or to the meaning of a requirement;
- a conflict between requirements that only the owner can settle;
- work outside the authority the project granted it;
- a verification it cannot satisfy after two attempts.

The boundary is part of the design rather than a property of the current model, so
it does not move when a better model arrives.

## 4. The evidence a reader can check

AsheeUI is the first case study of the process, and it is the one that can be
inspected today:

- the source is public, and each release records what changed and why;
- the component reference in this documentation is derived from the installed
  package rather than typed into a page, so it cannot disagree with the code;
- the playground applications run the same package a consumer installs;
- the verification the project requires (`pnpm verify`) is the same one a
  contributor can run.

## 5. The wider work

The process is maintained by Ashee Softworks, with the measurements of
the experiments run against it, by Ashee Softworks.

The company's site is at [asheesoftworks.com](https://asheesoftworks.com). It is in
its opening state and announces nothing yet: the algorithm, the standards position
and the two events are documented there as the launch proceeds, and each step of
that reveal replaces the one before it rather than adding to it.

The AsheeUI documentation states what is true of AsheeUI. It does not claim to
document the specification, and it does not restate the company's positions.

## 6. What this page does not claim

It does not claim that a machine replaces an engineering team, and it does not
claim that generated code is correct because it compiles. The claim is narrower and
testable: a written process can carry work through implementation, verification and
repair while a person remains responsible for the decisions that matter.
