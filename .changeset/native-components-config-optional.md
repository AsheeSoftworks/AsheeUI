---
"@asheeui/native": patch
---

`NativeExternalConfig` accepts the web renderer's configuration with `components` explicitly `undefined`.

Found while wiring an application that passes one configuration object to both providers: under
`exactOptionalPropertyTypes`, a value typed as `@asheeui/web`'s `ExternalConfig` was refused by
`NativeExternalConfig`, because `components` on the web's type is `ComponentsConfig | undefined` and the device's
intersection did not admit the `undefined` arm. The property now states the union with `undefined`, so the promise
`AsheeNativeProvider` makes — it accepts the web renderer's configuration, made when the two types were unified — holds
under the strict flags applications enable.
