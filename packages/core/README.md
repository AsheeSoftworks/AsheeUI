# @asheeui/core

The platform-neutral layer the AsheeUI renderers are built from: the design
language as platform-neutral values, the component contracts an implementation
satisfies, the component registry that collects the defaults each implementation
registers, the cascade every component resolves through, the compatibility matrix
that states what each component means on each platform, the configuration pipeline
that turns a consumer's `asheeui.config.*` export into the values a component
reads, and the class dictionaries each renderer maps a resolved value into.

It depends on no platform — no DOM, no React runtime, no React Native — because a
layer that depends on a platform is not shared. Each renderer maps what it finds
here into its own technology: Tailwind class names on the web, NativeWind class
names and style objects on native.

## Installation

Both renderers depend on it, so installing `@asheeui/web`, `@asheeui/native` or
`@asheeui/ui` brings it with them. Install it directly when you import its
contracts, its tokens or its configuration utilities yourself:

```bash
npm install @asheeui/core
```

```ts
import { defineConfig, resolveConfig, COMPONENT_SUPPORT } from "@asheeui/core";
```

`defineConfig` and `resolveConfig` are the two halves of the configuration
pipeline a provider reads; `COMPONENT_SUPPORT` is the compatibility matrix, and
`findComponentSupport` answers for one component name.

## Documentation

The framework documentation lives in the repository:

- [Installation](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/installation.md)
- [Configuration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/configuration.md)
- [Components](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/components.md)
- [React Native](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/native.md)
- [Migration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/migration.md)

## Links

- Documentation: https://asheeui.com
- Repository: https://github.com/AsheeSoftworks/AsheeUI
- Issues: https://github.com/AsheeSoftworks/AsheeUI/issues

## License

AsheeUI is licensed under the [Apache License 2.0](../../LICENSE). Copyright and
attribution notices are in the root [NOTICE](../../NOTICE) file; the repository's
[licensing guide](../../docs/licensing.md) explains what redistribution requires.
