# seedgarden

This is a lightweight web app for managing a seedbox.

Requires Go 1.25 or later.

Use `-secret-path <secret>` to serve the app under `/<secret>/` with
[secretprefix](https://github.com/unixpickle/secretprefix). The secret must not
contain slashes. Omitting the flag serves the app at `/`.
