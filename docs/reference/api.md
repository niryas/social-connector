# APIAbstract & API

## APIAbstract

<<< ../../src/APIAbstract.ts

## API

Built-in extension of `APIAbstract`. A thin wrapper around `fetch()`.
Offers two public methods:

### get() method

-   Signature: `get<T>(url: string): Promise<T>`

Resolves to a promise of type `<T>` which are the results of calling `url` using GET.

### post() method

-   Signature: `post<T>(url: string, data: object): Promise<T>`

Resolves to a promise of type `<T>` which are the results of calling `url` with `data` serialized as JSON, using
POST.
