/**
 * Information associated with the response to the operation.
 */
interface RequestCallbackOptions {
    /**
     * Comma delimited string containing the collection's current quota metrics (storage, number of stored procedure, triggers and UDFs) after completion of the operation.
     */
    currentCollectionSizeInMB: string;

    /**
     * Comma delimited string containing the collection's maximum quota metrics (storage, number of stored procedure, triggers and UDFs).
     */
    maxCollectionSizeInMB: string;

    /**
     * Set to true if the requested resource has not been modified compared to the provided ETag in the ifNoneMatch parameter for a read request.
     */
    notModified: boolean;
}

/**
 * Information associated with the response to the operation.
 */
interface FeedCallbackOptions {
    /**
     * Opaque token for continuing the read feed or query.
     */
    continuation: string;
    
    /**
     * Comma delimited string containing the collection's current quota metrics (storage, number of stored procedure, triggers and UDFs) after completion of the operation.
     */
    currentCollectionSizeInMB: string;

    /**
     * Comma delimited string containing the collection's maximum quota metrics (storage, number of stored procedure, triggers and UDFs).
     */
    maxCollectionSizeInMB: string;
}

/**
 * Will contain error information if an error occurs, undefined otherwise.
 */
interface Error {
    /**
     * The HTTP response code corresponding to the error.
     */
    number: number;

    /**
     * A string containing the error information.
     */
    body: string;
}

/**
 * Callback to execute after completion of a request.
 * 
 * @param error Will contain error information if an error occurs, undefined otherwise.
 * @param resource An object that represents the requested resource (document or attachment). This is `undefined` if an error occurs in the operation.
 * @param options Information associated with the response to the operation.
 */
type RequestCallback<TSource> = (error: Error, resource: TSource, options: RequestCallbackOptions) => void;

/**
 * The callback to execute after completion of read feed or query request.
 *
 * @param error Will contain error information if an error occurs, undefined otherwise.
 * @param resources An array or resources (documents or attachments) that was read. This is `undefined` if an error occurs in the operation.
 * @param options Information associated with the response to the operation.
 */
type FeedCallback<TSource> = (error: Error, resources: TSource[], options: FeedCallbackOptions) => void;