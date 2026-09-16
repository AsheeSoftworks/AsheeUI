# Licensing

AsheeUI is licensed under the **Apache License 2.0**. The full text is in
[LICENSE](../LICENSE).

## What the license gives you

| Right | Detail |
| --- | --- |
| Use | Any purpose, including commercial products |
| Modify | Change the source and ship the result |
| Distribute | Publish your own builds, forks and packages |
| Sublicense | Include it inside a larger distribution |
| Patents | An express patent license from the contributors (section 3), which a permissive license without a patent clause does not grant |

The license is perpetual and worldwide, and it needs no registration, fee or
notice to Ashee Softworks.

## What redistribution requires

If you distribute AsheeUI, or a product built from it, the license asks for four
things:

1. Include a copy of the license (`LICENSE`).
2. Keep the attribution notices (`NOTICE`, and any notice inside the source you
   redistribute).
3. State the changes you made, in the files you changed.
4. Do not use the Ashee Softworks name or its marks as if they endorsed your
   version (see the trademark section below).

AsheeUI's own published packages carry `LICENSE` and `NOTICE` in the tarball, so
a consumer that installs the package already has both.

## Source-file headers

The project does not put a license header on every source file. The license is
stated once, in `LICENSE`, in `NOTICE`, and in the `license` field of every
published package. That is enough to license the repository, and it keeps the
source readable. If you fork AsheeUI and redistribute it, you may add headers to
the files you change; the license asks you to state your changes either way.

## Trademark

The Apache License 2.0 licenses copyrights and patents, not names. Nothing in it
gives you the right to use the **Ashee**, **Ashee Softworks** or **AsheeUI** name
or logo as the name of your own product, or in a way that suggests your fork is
endorsed by Ashee Softworks.

You may, without asking:

- state truthfully that your product uses AsheeUI, or is built on it;
- keep the name in a fork's description, for example "a fork of AsheeUI";
- reproduce the notices the license requires.

You may not name your own framework, product or service AsheeUI, or brand it with
the Ashee marks, without written permission.

## The transition from MIT

AsheeUI was released under the MIT license up to and including `1.1.0`. From
`1.1.1` the project is licensed under Apache-2.0.

Two things are worth being precise about:

- **Versions already published under MIT stay MIT.** A license cannot be
  revoked retroactively, and it is not the project's intention to try. Anyone who
  received `1.1.0` or earlier may continue to use, modify and distribute that
  version under MIT.
- **The change is an addition, not a restriction.** Apache-2.0 grants everything
  MIT granted and adds an express patent license, a patent-retaliation clause, a
  requirement to state changes, and a trademark position that was previously
  implicit. For a consumer of AsheeUI, the practical difference is that the
  notices are explicit and the patent position is written down.

The reason for the change is scale: AsheeUI now ships a web package, a CLI and a
React Native package, and an explicit patent grant and attribution requirement is
a safer foundation for a framework that other companies embed.

## Dependency licenses

The framework depends only on permissively licensed software (MIT, ISC, BSD and
Apache-2.0). That is a project rule, not an accident: a dependency whose license
would restrict what a consumer may do with their own product does not belong in a
UI framework.

The dependencies that ship with a build are the ones you see in the package's
`dependencies` and `peerDependencies`. Their own notices are their own: if you
redistribute a bundle that includes them, keep those notices too.

## Contributions

Contributions are accepted under Apache-2.0 (section 5 of the license), and the
[contributing guide](../CONTRIBUTING.md) states what that means for a
contributor. You keep the copyright on your work.

## The methodology

AsheeUI is developed with the **AI Test Driven Development** methodology, created
by Ashee Softworks. This repository's license applies to the software rather than
to the methodology.

## Questions

If a planned use of AsheeUI is unclear under these terms, open an issue and ask.
A question about licensing is cheaper than a mistake about it.

---

Built with AI, using the process described in [How AsheeUI is built](published-process.md).
