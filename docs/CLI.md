# ModelCap CLI

The `modelcap` command lets you inspect the catalog and validate request JSON without writing application code.

```bash
npm install github:Eva-Dengyh/ModelCap#v0.1.0
```

Until the npm registry package is published, the most stable package-local invocation is:

```bash
node node_modules/modelcap-catalog/bin/modelcap.mjs list --task generate --input reference_image
node node_modules/modelcap-catalog/bin/modelcap.mjs get wan-3.0
node node_modules/modelcap-catalog/bin/modelcap.mjs validate wan-3.0 examples/request-invalid.json
```

When installed from a registry package, run:

```bash
modelcap list --task generate --input reference_image
modelcap get wan-3.0
modelcap validate wan-3.0 examples/request-invalid.json
```

Inside this repository, run the same command through Node:

```bash
node bin/modelcap.mjs list --task generate --input reference_image
node bin/modelcap.mjs get wan-3.0
node bin/modelcap.mjs validate wan-3.0 examples/request-invalid.json
```

## list

```bash
modelcap list [--provider value] [--task value] [--input value] [--capability value] [--json]
```

Prints matching model IDs by default.

```bash
modelcap list --task generate --input reference_image
```

Use `--json` to print full model entries:

```bash
modelcap list --provider aliyun --json
```

Filters are combined with AND semantics.

## get

```bash
modelcap get <model_id>
```

Prints one model entry as JSON.

```bash
modelcap get wan-3.0
```

Unknown models exit with status `1`.

## validate

```bash
modelcap validate <model_id> <request.json>
```

Validates a request JSON file and prints the same `ValidationResult` returned by the SDK.

```bash
modelcap validate wan-3.0 examples/request-invalid.json
```

Exit status:

- `0` when the request is valid.
- `1` when the request is invalid, the model is unknown, or the JSON file cannot be read or parsed.

Validation is conservative: explicit structured hard-constraint violations are errors; missing or undocumented facts are warnings where possible.
