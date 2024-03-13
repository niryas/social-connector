# Introduction

::: info
Documentation is still under constructions.
:::

## What is Social Connector?

Social Connector is a lightweight TypeScript-based client for communicating with _Instagram Basic Display API_.
The main use case for Social Connector is allowing users to upload photos from their Instagram to your app.
It is the first functionality that is available, but further functions can be added as well.
Adding more social networks, with the same API towards your app, is also a possibility.

It can also be an example on how to integrate _Instagram Basic Display API_ on your own, without using the package
directly.

::: warning
While the origins of Social Connector are in code living in production, this open-sourced package is still in
unstable version 0.x. The **API may change**. Bugs may appear. Take extra care if using in production,
and consider pinning to a specific patch version.
:::

## Why I've made Social Connector?

Facing the project of integrating an app with _Instagram Basic Display API_ to allow users to upload photos from
their Instagram account, I found that the information out there to do such project is lacking.
Unlike Facebook, which has a proper JavaScript SDK available, integrating with Instagram requires handling extra steps
for each app integrating with it - duplication of code without any real need for it.
The documentation for handling the entire flow is not complete and every developer working on such integration has to
fill in some steps on their own.

If your app is integrating with multiple social networks for the same features (such as, uploading a photo from the
social network to the app) - you can also abstract a lot to your own API, and simplify your app code accordingly.

The project's goal is to answer to both points: allow a simple and easy integration with _Instagram Basic Display API_,
while also abstracting other social networks' API to the same interface for simple integration.

## Note

This package is not connected, affiliated, endorsed or supported by Instagram or Meta Platforms in any way.
All trademarks and copyrights belong to their respective owners. You may only use Instagram Basic Display API according
to Instagram's terms of service and policies, and must go through Instagram's app review to go into production.
