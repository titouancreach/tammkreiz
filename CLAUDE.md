<!-- effect-solutions:start -->

## Effect Best Practices

**IMPORTANT:** Always consult effect-solutions before writing Effect code.

1. Run `pnpm effect-solutions list` to see available guides
2. Run `pnpm effect-solutions show <topic>...` for relevant patterns (supports multiple topics)
3. Search `~/.local/share/effect-solutions/effect` for real implementations

Topics: quick-start, project-setup, tsconfig, basics, services-and-layers, data-modeling, error-handling, config, testing, cli.

Never guess at Effect patterns - check the guide first.
<!-- effect-solutions:end -->

## Effect version

The project uses the published `effect` package (see `package.json`). The guides and `~/.local/share/effect-solutions/effect` follow the unreleased `main` branch, so some APIs differ: check `node_modules/effect/src` when an import does not exist (e.g. use `Schema.TaggedError`, not `Schema.TaggedErrorClass`).
