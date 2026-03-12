# sparql-endpoint-service

A middleware service designed to proxy SPARQL queries to the database via the [_mu-javascript (v1.9.0)_](https://github.com/mu-semtech/mu-javascript-template) package.

This service ensures that all incoming queries are validated and passing by the project's central authentication layer. (_[sparql-parser](https://github.com/mu-semtech/sparql-parser)_)

## Features

| Feature          | Description                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query Validation | Every incoming query is validated. If the syntax is incorrect, the service returns detailed feedback in the response.                                    |
| Secure Proxying  | Validated queries are executed using the query or update functions from the _mu package_.                                                                |
| Scoped Access    | This architecture allows you to assign a specific auth scope to the service, effectively restricting its data access based on defined security policies. |

## Example

### Semtech stack

In the **docker-compose.yml** file add the service and assign the **auth scope**.

```yml
services:
  sparql-endpoint:
    logging: *default-logging
    labels:
      - "logging=true"
    image: local-sparql-endpoint
    environment:
      DEFAULT_MU_AUTH_SCOPE: "http://services.semantic.works/sparql-endpoint"
```

In the **dispatcher.ex** change the sparql endpoint path from the database to the _sparql-endpoint_ service.

```ex
  post "/sparql/*path", %{ accept: [:sparql_json], layer: :api } do
    #Proxy.forward conn, path, "http://database:8890/sparql/"
    Proxy.forward conn, path, "http://sparql-endpoint/"
  end
```

In Authorization/config.lisp make use of the **scopes** and add or use an allowed group from the config.

```lisp
(with-scope "http://services.semantic.works/sparql-endpoint"
  (grant (read)
         :to shared
         :for "authenticated"))
```

```lisp
(supply-allowed-group "authenticated"
  :query "PREFIX session: <http://mu.semte.ch/vocabularies/session/>
          SELECT DISTINCT ?account WHERE {
            <SESSION_ID> session:account ?account.
          }")
```
