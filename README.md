# Azure CosmosDB JS Server Types

TypeScript type definitions for the *Azure CosmosDB JS Server SDK*.

Based on the official [Azure CosmosDB JS Server Docs](http://azure.github.io/azure-cosmosdb-js-server/Collection.html).

## Example

Write the script in *TypeScript*:

```typescript
interface User {
    name: string;
    age: number;
    addresses: Address[];    
}

interface Address {
    city: string;
}

function runQuery() {  
    const result = __.chain<User>()
        .filter(doc => doc.age > 30)
        .sortBy(user => user.age)
        .map(user => user.addresses)
        .flatten<Address>()
        .value(null, callback)
    if(!result.isAccepted)
    throw new Error("The call was not accepted");

    function callback(err: Error, items: Address[]) {
        if(err) throw err;

        // or getContext().getResponse().setBody({    
        __.response.setBody({
            result: items
        })
    }  
}
```

It will be compiled to *JavaScript*:

```javascript
function runQuery() {
    var result = __.chain()
        .filter(function (doc) { return doc.age > 30; })
        .sortBy(function (user) { return user.age; })
        .map(function (user) { return user.addresses; })
        .flatten()
        .value(null, callback);
    if (!result.isAccepted)
        throw new Error("The call was not accepted");
    function callback(err, items) {
        if (err)
            throw err;
        // or getContext().getResponse().setBody({    
        __.response.setBody({
            result: items
        });
    }
}

```
