# Auth0 Actions Management API helper

## Introduction

This package is designed as a helper for custom code running inside
Auth0 Actions.

It is often desirable to have custom Actions that invoke Auth0's Management API
to update attributes of a user record. This package provides two features:

- a simple method for creating a management API client object; and
- caching the management API token in the Auth0 Actions cache.

Caching the token means that it can be reused across all Actions in the same
flow, thus reducing the number of M2M API tokens issued.

**Note: you do not need this package if you only intend to update user app_metadata or user_metadata.**

You can use `api.user.setUserMetadata(name, value)` and `api.user.setAppMetadata(name, value)` for most user
update concerns. This library is for uses beyond updating metadata (such as root-level user attributes).

## Requirements

This package supports the following tooling versions:

- auth0: `>= 4.18`
- Node.js: `>=18`

## Installation

Add this package as a dependency to your Actions as per the
[Auth0 documentation on managing dependencies](https://auth0.com/docs/customize/actions/manage-dependencies).

Reference this package as `@australiangreens/auth0-actions-mgmtapi`.

## Configuration

The package expects the following secrets exist in your Action:

- `M2M_DOMAIN`
- `M2M_CLIENT_ID`
- `M2M_CLIENT_SECRET`
- `audience`

The values for these secrets can be obtained from [the Machine-to-Machine Application you must create for
your Actions](https://auth0.com/docs/get-started/apis/create-m2m-app-test) to be able to use the management API at all.

## Usage

Load the package at the top of your Action code:

`const { createManagementClient } = require('@australiangreens/auth0-actions-mgmtmapi');`

Create your management client _inside your Action handler functions_:

`const managementClient = await createManagementClient(event.secrets, api.cache);`

Note: you must create the client inside the handler functions to be able to properly
pass through the Action secrets and Action cache object to the function.

Use your management client as per [Auth0's node-auth0 documentation](https://auth0.github.io/node-auth0/classes/management.ManagementClient.html).
