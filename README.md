# Demo for Azure App Configuration toggles using the Node/JS library

This repo demonstrates how a serverless (Azure Functions) application using Clean Architecture can be structured to use App Configuration toggles to display two completely different API responses (both in body shape and content). It will demonstrate using a single toggle that has a varying degree of rollout per user group (developers, UAT, public).

Microsoft has produced less documentation for their (as far as I can tell, smaller) Node implementation of their Azure App Configuration library than their other language variants.

What I like about App Config is that you have to provide your own processing and that it carries little logic. So in order to evaluate toggles, you'll have to write a bit of logic and have your own business process for how to use them.

The minimal demo for toggles is usually something simple as a single file (maybe you'd call it `index.js`) which loads the App Configuration library, and then do something like:

```
if (MY_FLAG) {
  ... code
} else {
  ... other code
}
```

The way I am presenting it here is to give you a more complete, realistic look at an implementation. It is based around an abstraction around the implementations, rather than in-lining the code. If you follow Clean Architecture and SOLID and similar, you'll of course have this as second nature, but for the rest this type of pattern is highly recommended. You do not want get stuck with doing the feature toggling at multiple (potentially "moving") places in the codebase.

**Stack**

- [Serverless Framework](https://www.serverless.com)
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) + [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) for storing the function + [Azure App Configuration](https://azure.microsoft.com/en-us/services/app-configuration/) for dynamic feature toggles
- [Webpack](https://webpack.js.org) for bundling and optimizing
- [Babel](https://babeljs.io) for transpiling files
- [Typescript](https://www.typescriptlang.org) so we can write better code

## Prerequisites

- Azure account
- Logged in to Azure through environment
- High enough credentials to create new function and storage resources
- Serverless Framework installed on your system
- Created an App Configuration inside of Azure

See below for how I have set up my example:

![Example App Configuration toggle](docs/example-appconfig-toggle.png 'Example App Configuration toggle')

If you want to follow along, please make sure to use a label for your toggle as I have not tested a toggle without one.

Note also that I am using the feature flag option, having created the toggle in `Feature manager` rather than in `Configuration explorer` in Azure > App Configuration.

## Application structure

![Arkit application structure map](arkit.svg 'Arkit application structure map')

## Log in to Azure

1. `az account clear`
2. `az login`

Then set credentials as per instructions at [https://github.com/serverless/serverless-azure-functions#advanced-authentication](https://github.com/serverless/serverless-azure-functions#advanced-authentication).

## Install

Install dependencies with `npm install` or `yarn add`.

## Configure

You can get your key name in Azure > App Configuration > Configuration explorer. Using feature toggles, it will look like `.appconfig.featureflag/HappyResponse`. If you have a label, pick that up as well.

Now place those values in our code, at `src/config/config.ts`. Use `toggleName` for the value that looks like `.appconfig.featureflag/HappyResponse` and set `toggleLabel` to your label value if any.

If you use my three example groups, set `fallbackUserGroup` to `Public`.

Set `connectionString` to the primary or secondary connection string found in Azure > App Configuration > Access keys. **Make sure you only use a read-only key!**

## Development

Run `sls offline`. After a bit of building files and doing its magic, you get a prompt looking like:

```
Http Functions:

toggleDemo: [GET] http://localhost:7071/toggleDemo
```

Hit that URL and you're ready!

### Using group-specific toggles

Pass in a `group` header with a value that your toggle configuration has specified. In my example (HappyResponse) I am using

- Developers
- UAT
- Public

All these group have varying degrees of rollout, meaning we can block functionality from those who should not see the feature.

![Using the API with a group](docs/request-with-group.png 'Using the API with a group')

**NOTE!**
_Your Node version will need to be 12_ (or whatever version is used on Azure). One way of handling multiple Node versions is with [`nvm`](https://github.com/nvm-sh/nvm). If you are set on using it, these instructions should get you up and ready for development:

1. `nvm install 12`, to install Node 12
2. `nvm use 12`, to use Node 12
3. When you are done, run `nvm unload` but this will also eject the environment variables so `nvm` will be an unknown command from that point on (just run the commands again from `~/.zshrc` or where ever those got put in the first place)

## Deploy

Run `npm run deploy`, `yarn run deploy` or `sls deploy` to deploy the stack to Azure.

## Remove

Run `npm run remove`, `yarn run remove` or `sls remove` to remove the function stack.
