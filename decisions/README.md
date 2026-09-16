# Decisions

| Field | Value |
|---|---|
| Document type | Decision register |
| Owner | The project |
| Format | One record per decision, numbered, never rewritten after acceptance |

**Purpose.** This directory records the decisions taken while the AsheeUI release
and the two Ashee Softworks sites were built, so that a later reader can see what was
chosen, what was rejected, and what evidence the choice rests on. A decision record
is written once: a decision that changes is superseded by a new record that names
the one it replaces, rather than edited in place.

## When a record is written

A record is written when a choice is hard to reverse, when two reasonable options
existed, or when the reason for a choice would otherwise survive only in a commit
message.

## Format

```text
# <number>. <decision, stated as a fact>

| Field   | Value                                          |
|---|---|
| Status  | Accepted, Superseded by <number>, or Proposed  |
| Date    | When the decision was taken                     |
| Area    | The company site, the documentation site, the library, or documentation |
| Evidence| Commits, paths and commands that show the decision |

## Context      what made a decision necessary
## Decision     what was chosen, in one paragraph
## Alternatives what was rejected, and why
## Consequences what follows, including what is now open
```

## Index

| Number | Decision | Area | Status |
|---|---|---|---|
| 0001 | The sites are built from the plans, final state first | Both sites | Accepted |
| 0002 | The reveal is a phase model, not several sites | Company site | Accepted |
| 0003 | One file declares the palette | Both sites | Accepted |
| 0004 | The sites consume the published package | Both sites | Accepted |
| 0005 | The legacy company site is preserved and excluded | Company site | Accepted |
| 0006 | The reservation form states that it has no backend | Company site | Accepted |
| 0007 | The documentation site is restored rather than rebuilt | Documentation site | Accepted |
| 0008 | The validator reads the contract from the modules that own it | Documentation site | Accepted |
| 0009 | The 2.0 component renames are applied to the demos | Documentation site | Accepted |
| 0010 | The autocomplete gains a public option type | Library | Superseded by 0013 |
| 0011 | The package documentation carries the plans | Documentation | Accepted |
| 0012 | Decisions live at the repository root | Documentation | Accepted |
| 0013 | The autocomplete change is reverted | Library | Accepted |
| 0014 | Search visibility is implemented, and its owner inputs are listed | Both sites | Accepted |
| 0015 | The domains are split by product, and the previous branch stays out of production | Both sites | Accepted |
| 0016 | Hosting is arranged by one script at the workspace root | Both sites | Accepted |
| 0017 | The launch does not claim the method is published | Both sites, documentation | Accepted |
| 0018 | A template is a one-page installation, a playground is a stress test | Documentation, CLI | Accepted |
| 0019 | A failed deployment says what the platform refused | Both sites | Accepted |
| 0020 | A dependency pull request generated against an older main is closed, not merged | Library | Accepted |
