Localazy
===============

This is the README for the extension "localazy". This extension facilitates the localization process for your Visual Studio Code projects by integrating with Localazy.

Features
--------

### Localazy: Connect to Localazy

Add a new API key of your project. You can find your access token at https://localazy.com/console/tokens.

### Localazy Add Key Command

Easily add new keys to your Localazy project directly from Visual Studio Code with the `Localazy: Add Key` command. This feature streamlines the localization workflow, allowing you to manage keys seamlessly without leaving your development environment.

Requirements
------------

Before using the Localazy extension, ensure you have the following requirements in place:

1.  A Localazy account - Sign up for Localazy if you don't have an account yet.
2.  API Key - Obtain your Localazy API key from https://localazy.com/console/tokens.

Extension Settings
------------------

This extension contributes the following settings:

*   `localazy.languages`: The languages that you want to add translation to (default to `["fr", "en", "de", "it"]`).
*   `localazy.namespace`: The namespace of in which the keys will be added (default to `global`).
*   `localazy.skipPromptNamespace`: Skip the prompt for the namespace (default to `true`).

Known Issues
------------

If you encounter any issues while using the Localazy extension, check the issue tracker for known problems. Feel free to report new issues if necessary.

Release Notes
-------------

See [CHANGELOG.md](./CHANGELOG.md) file.

For More Information
--------------------

*   [Localazy](https://localazy.com)
