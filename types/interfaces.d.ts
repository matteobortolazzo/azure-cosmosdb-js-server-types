/**
 * SQL query string. This can also be an object to pass in a parameterized query along with the values.
 */
type FilterQuery = string | { query: string, parameters: { name: string, value: any }[]};

/**
 * Gets the context object that can be used for executing operations on DocumentDB storage.
 * 
 * @returns Object that is used for executing operations on DocumentDB storage inside the JavaScript function.
 */
declare function getContext(): Context;

/**
 * Holds the {@link __} object.
 */
declare let __: __object;

/**
 * The {@link __} object can be used as a shortcut to the {@link Collection} and {@link Context} objects.
 * It derives from the Collection object via prototype and defines request and response properties which are shortcuts to {@link Context.getRequest} and {@link Context.getResponse}.
 */
interface __object extends Collection {
    /**
     * Alias for {@link Context.getRequest}
     */
    request: Request;
    /**
     * Alias for {@link Context.getResponse}
     */
    response: Response;
}

/**
 * The Context object provides access to all operations that can be performed on DocumentDB data, as well as access to the request and response objects.
 */
interface Context {
    /**
     * Terminates the script and rolls back the transaction. The script is executed in the context of a transaction, which can be rolled back by using this method.
     * This method is the only way to prevent script transaction from committing in promise callback. For non-promise scenarios,
     * to abort the transaction, using unhandled exception is more recommended than this.
     * 
     * @param err The exception object to serve as the reason of the abort.
     */
    abort(err: any): void;

    /**
     * Gets the collection object.
     * 
     * @returns Object that provides server-side access to DocumentDB database. It supports operations on documents and attachments in the collection.
     */
    getCollection(): Collection;

    /**
     * Gets the request object.
     * 
     * @returns Object that provides access to the request message that was sent to the server.
     */
    getRequest(): Request;

    /**
     * Gets the response object.
     * 
     * @returns Object that provides access to output through the response message to be sent from the server.
     */
    getResponse(): Response;
}

/**
 * The Request object represents the request message that was sent to the server. This includes information about HTTP headers and the body of the HTTP request sent to the server.
 * For triggers, the request represents the operation that is executing when the trigger is run. For example, if the trigger is being run ("triggered") on the creation of a document, then
 * the request body contains the JSON body of the document to be created. This can be accessed through the request object and (as JSON) can be natively consumed in JavaScript.
 * For stored procedures, the request contains information about the request sent to execute the stored procedure.
 */
interface Request {
    /**
     * Gets the request body.
     * 
     * @returns The request body.
     */
    getBody(): any;

    /**
     * Gets the OperationType for the request with a pre-trigger or post-trigger
     * 
     * @returns The value of the operation type corresponding to the current request.
     */
    getOperationType(): 'Create' | 'Replace' | 'Upsert' | 'Delete';

    /**
     * Gets a specified request header value.
     * 
     * @param key The name of the header to retrieve
     * 
     * @returns The value of the requested header.
     */
    getValue(key: string): any;

    /**
     * Sets the request body.
     * 
     * @remarks This can be only used in a pre-trigger to overwrite the existing request body. The overwritten request body will then be used in the operation associated with this pre-trigger.
     * 
     * @param body the value to set in the request body
     */
    setBody(body: any): void;

    /**
     * Sets a specified request header value.
     * 
     * @remarks this method cannot be used to create new headers.
     * 
     * @param key the name of the header
     * @param value the value of the header
     */
    setValue(key: string, value: any): void;
}

/**
 * The Response object represents the response message that will be sent from the server in response to the requested operation. This includes information about the HTTP headers and body of the response from the server.
 * The Response object is not present in pre-triggers because they are run before the response is generated.
 * For post-triggers, the response represents the operation that was executed before the trigger. For example, if the post-trigger is being run ("triggered") after the creation of a document, then
 * the response body contains the JSON body of the document that was created. This can be accessed through the response object and (as JSON) can be natively consumed in JavaScript.
 * For stored procedures, the response can be manipulated to send output back to the client-side.
 * 
 * @remarks this object not available in pre-triggers
 */
interface Response {
    /**
     * Gets the response body.
     * 
     * @returns The response body.
     */
    getBody(): any;

    /**
     * Gets a maximum quota allowed for the resource associated with a post-trigger
     * 
     * @remarks this method is only available in post-triggers
     * 
     * @returns The value of the maximum allowed quota usage.
     */
    getMaxResourceQuota(): string;

    /**
     * Gets a current quota usage for the resource associated with a post-trigger
     * 
     * @remarks this method is only available in post-triggers
     * 
     * @returns The value of the current quota usage.
     */
    getResourceQuotaCurrentUsage(): string;

    /**
     * Gets a specified response header value.
     * 
     * @param key the name of the header to retrieve
     * 
     * @returns The value of the response header.
     */
    getValue(key: string): any;

    /**
     * Sets the response body.
     * 
     * @remarks This cannot be done in pre-triggers. In post-triggers, the response body is already set with the requested resource and will be overwritten with this call. In stored procedures, this call can be used to set the response message body as output to the calling client.
     * 
     * @param value the value to set in the response body
     */
    setBody(value: any): void;

    /**
     * Sets a specified response header value.
     * 
     * @remarks this method cannot be used to create new headers.
     * 
     * @param key the name of the header
     * @param value the value of the header
     */
    setValue(key: string, value: any): void;
}

/**
 * Object return from document operation callbacks
 */
interface Document {
    /**
     * Get link of current document. 
     */
    _self: string;
}

/**
 * Metadata that defines the attachment media like media, contentType.
 * It can include any other properties as part of the metedata.
 */
interface Attachment {
    /**
     * MIME contentType of the attachment
     */
    contentType: string;

    /**
     * media link associated with the attachment content
     */
    media: string;
}


/**
 * Object returned from a query function, namely chain, filter, map, pluck, flatten, or value.
 * If the query is part of a chained call, then this object can be used to chain further queries until the final terminating value call.
 */
interface QueryResponse<TSource> {
    /**
     * True if the query has been queued, false if it is not queued because of a pending timeout.
     */
    isAccepted: boolean;
}

/** Collection 
 * 
 * Stored procedures and triggers are registered for a particular collection. The Collection object supports create, read, update and delete (CRUD) and query operations on documents and attachments in the current collection.
 * All collection operations are completed asynchronously. You can provide a callback to handle the result of the operation, and to perform error handling if necessary.
 * Stored procedures and triggers are executed in a time-limited manner. Long-running stored procedures and triggers are defensively timed out and all transactions performed are rolled back.
 * We stop queuing collection operations if the stored procedure is close to timing out. You can inspect the boolean return value of all collection operations to see if an operation was not queued and handle this situation gracefully.
 * 
 */
interface Collection {
    /**
     * Opening call to start a chained query. Should be used in conjunction with the closing value call to perform chained queries.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a chained call to call further queries.
     */
    chain<TSource>(): QueryResponse<TSource>;

    /**
     * Create an attachment for the document.
     * 
     * @param documentLink resource link of the document under which the attachment will be created
     * @param body the body of the attachment
     * @param options optional create options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    createAttachment<TSource extends Attachment>(documentLink: string, body: TSource, options?: CreateOptions, callback?: RequestCallback<TSource>): boolean;

    /**
     * Create a document under the collection.
     * 
     * @param collectionLink resource link of the collection under which the document will be created
     * @param body body of the document. The "id" property is required and will be generated automatically if not provided (this behaviour can be overriden using the {@link CreateOptions}). Any other properties can be added.
     * @param options optional create options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    createDocument<TSource>(collectionLink: string, body: TSource, options?: CreateOptions, callback?: RequestCallback<TSource & Document>): boolean;

    /**
     * Delete an attachment.
     * 
     * @param attachmentLink resource link of the attachment to be deleted
     * @param options optional delete options.
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    deleteAttachment<TSource>(attachmentLink: string, options?: DeleteOptions, callback?: RequestCallback<TSource>): boolean;

    /**
     * Delete a document.
     * 
     * @param documentLink resource link of the document to delete
     * @param options optional delete options.
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    deleteDocument<TSource>(documentLink: string, options?: DeleteOptions, callback?: RequestCallback<TSource & Document>): boolean;

    /**
     * Execute a filter on the input stream of documents, resulting in a subset of the input stream that matches the given filter.
     * When filter is called by itself, the input document stream is the set of all documents in the current document collection.
     * When used in {@link chain} call, the input document stream is the set of documents returned from the previous query function.
     * 
     * @param predicate Predicate function defining the filter
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    filter<TSource>(predicate: FilterPredicate<TSource>, options?: FeedOptions, callback?: FeedCallback<TSource>): QueryResponse<TSource>;

    /**
     * Flatten nested arrays from each document in the input document stream.
     * When filter is called by itself, the input document stream is the set of all documents in the current document collection.
     * When used in {@link chain} call, the input document stream is the set of documents returned from the previous query function.
     * 
     * @param isShallow If true, flattens only the first level of nested arrays (false by default)
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    flatten<TSource>(isShallow?: boolean, options?: FeedOptions, callback?: FeedCallback<TSource>): QueryResponse<TSource>;

    /**
     * Get alt link (name-based link) of current collection.
     * 
     * @returns Alt link of current collection.
     */
    getAltLink(): string;

    /**
     * Get self link of current collection.
     * 
     * @returns Self link of current collection.
     */
    getSelfLink(): string;

    /**
     * Produce a new set of documents by mapping/projecting the properties of the documents in the input document stream through the given mapping predicate.
     * When filter is called by itself, the input document stream is the set of all documents in the current document collection.
     * When used in {@link chain} call, the input document stream is the set of documents returned from the previous query function.
     *  
     * @param predicate Predicate function defining the projection
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    map<TSource, TResult>(predicate: ProjectionPredicate<TSource, TResult>, options?: FeedOptions, callback?: FeedCallback<TResult>): QueryResponse<TSource>;

    /**
     * Produce a new set of documents by extracting a single property from each document in the input document stream. This is equivalent to a {@link map} call that projects only propertyName.
     * When filter is called by itself, the input document stream is the set of all documents in the current document collection.
     * When used in {@link chain} call, the input document stream is the set of documents returned from the previous query function.
     * 
     * @param propertyName Name of the property to pluck from all documents in the current collection
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    pluck<TSource>(propertyName: string, options?: FeedOptions, callback?: FeedCallback<TSource>): QueryResponse<TSource>;

    /**
     * Execute a SQL query on the attachments for the document.
     * 
     * @param documentLink resource link of the document whose attachments are being queried
     * @param query SQL query string. This can also be a JSON object to pass in a parameterized query along with the values.
     * @param options optional query options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    queryAttachment<TSource extends Attachment>(documentLink: string, query: FilterQuery, options?: FeedOptions, callback?: FeedCallback<TSource>): boolean;

    /**
     * Execute a SQL query on the documents of the collection.
     * 
     * @param collectionLink resource link of the collection whose documents are being queried
     * @param filterQuery SQL query string. This can also be a JSON object to pass in a parameterized query along with the values.
     * @param options optional query options.
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    queryDocuments<TSource>(collectionLink: string, filterQuery: FilterQuery, options?: FeedOptions, callback?: FeedCallback<TSource>): boolean;

    /**
     * Read an Attachment.
     * 
     * @param attachmentLink resource link of the attachment to read
     * @param options optional read options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    readAttachment<TSource extends Attachment>(attachmentLink: string, options?: ReadOptions, callback?: RequestCallback<TSource>): boolean;

   /**
     * Read a document.
     * 
     * @param documentLink resource link of the document to read
     * @param options optional read options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    readDocument<TSource>(documentLink: string, options?: ReadOptions, callback?: RequestCallback<TSource & Document>): boolean;

    /**
     * Get all documents for the collection.
     * 
     * @param collectionLink resource link of the collection whose documents are being read
     * @param options optional read options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    readDocuments<TSource>(collectionLink: string, options?: FeedOptions, callback?: FeedCallback<TSource & Document>): boolean;

    /**
     * Replace an attachment.
     * 
     * @param attachmentLink resource link of the attachment to be replaced
     * @param attachment new attachment body
     * @param options optional replace options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    replaceAttachment<TSource extends Attachment>(attachmentLink: string, attachment: TSource, options?: ReplaceOptions, callback?: RequestCallback<TSource>): boolean;

    /**
     * Replace a document.
     * 
     * @param documentLink 	resource link of the document
     * @param document new document body
     * @param options optional replace options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    replaceDocument<TSource>(documentLink: string, document: TSource, options?: ReplaceOptions, callback?: RequestCallback<TSource & Document>): boolean;

    /**
     * Produce a new set of documents by sorting the documents in the input document stream in ascending order using the given predicate.
     * When filter is called by itself, the input document stream is the set of all documents in the current document collection.
     * When used in {@link chain} call, the input document stream is the set of documents returned from the previous query function. 
     * 
     * @param predicate Predicate function defining the property to sort by.
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    sortBy<TSource>(predicate: SortByPredicate<TSource>, options?: FeedOptions, callback?: FeedCallback<TSource>): QueryResponse<TSource>;

    /**
     * Produce a new set of documents by sorting the documents in the input document stream in descending order using the given predicate.
     * When filter is called by itself, the input document stream is the set of all documents in the current document collection.
     * When used in {@link chain} call, the input document stream is the set of documents returned from the previous query function. 
     * 
     * @param predicate Predicate function defining the property to sort by.
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    sortByDescending<TSource>(predicate: SortByPredicate<TSource>, options?: FeedOptions, callback?: FeedCallback<TSource>): QueryResponse<TSource>;

    /**
     * Performs a join with inner collection with both top level document item and inner collection item added to the result projection.
     * When resultSelector is provided, resultSelector is called for each pair of <current document, inner collection item>.
     * When resultSelector is not provided, {@link unwind} just adds inner collection to the result projection. In this case {@link unwind} is equivalent to `map(innerCollectionSelector).flatten()`. Calls to unwind can be chained to perform multiple joins.
     * 
     * @param innerCollectionSelector Predicate function defining the projection for inner collection.
     * @param resultSelector Optional predicate function defining result projection.
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    unwind<TSource, TInnerSource, TResult>(innerCollectionSelector: ProjectionPredicate<TSource, TInnerSource>, resultSelector: ResultSelectorPredicate<TSource, TInnerSource, TResult>, options?: FeedOptions, callback?: FeedCallback<TSource>): QueryResponse<TResult>;

    /**
     * Upsert an attachment for the document.
     * 
     * @param documentLink resource link of the document under which the attachment will be upserted
     * @param body metadata that defines the attachment media like media, contentType. It can include any other properties as part of the metadata.
     * @param options optional upsert options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    upsertAttachment<TSource extends Attachment>(documentLink: string, body: TSource, options?: UpsertOptions, callback?: RequestCallback<TSource>): boolean;

    /**
     * Upsert a document under the collection.
     * 
     * @param collectionLink resource link of the collection under which the document will be upserted
     * @param body body of the document. The "id" property is required and will be generated automatically if not provided (this behaviour can be overriden using the {@link UpsertOptions}). Any other properties can be added.
     * @param options optional upsert options
     * @param callback optional callback for the operation. If no callback is provided, any error in the operation will be thrown.
     * 
     * @returns True if the create has been queued, false if it is not queued because of a pending timeout.
     */
    upsertDocument<TSource>(collectionLink: string, body: TSource, options?: UpsertOptions, callback?: RequestCallback<TSource & Document>): boolean;

    /**
     * Terminating call for a chained query. Should be used in conjunction with the opening chain call to perform chained queries.
     * When value is called, the query is queued for execution with the given options and callback.
     * 
     * @param options Optional query options. Should not be used in a {@link chain} call.
     * @param callback Optional callback for the operation. If no callback is provided, any error in the operation will be thrown and the result document set will be written to the {@link Response} body. Should not be used in a {@link chain} call.
     * 
     * @returns Response which contains whether or not the query was accepted. Can be used in a {@link chain} call to call further queries.
     */
    value<TSource>(options?: FeedOptions, callback?: RequestCallback<TSource>): QueryResponse<TSource>
}