/**
 * Specifies indexing directives.
 */
declare enum IndexAction {
    /**
     * use the default indexing policy specified for this collection
     */
    default = 'default',
    /**
     * include this document in the index
     */
    include = 'include',
    /**
     * exclude this document from the index
     */
    exclude = 'exclude'
}

/**
 * Options associated with a create operation.
 */
interface CreateOptions {
    /**
     * Specifies indexing directives.
     */
    indexAction?: IndexAction;

    /**
     * Disables automatic generation of "id" field of the document to be created (if it is not provided)
     */
    disableAutomaticIdGeneration?: boolean;
}

/**
 * Options associated with a delete operation.
 */
interface DeleteOptions {
    /**
     * The entity tag associated with the resource.
     * This is matched with the persisted resource before deletion.
     */
    etag?: string;
}

/**
 * Options associated with a read feed or query operation.
 */
interface FeedOptions {
    /**
     * Max number of items to be returned in the enumeration operation.
     * Value is 100 by default
     */
    pageSize?: number;
    
    /**
     * Opaque token for continuing the enumeration.
     */
    continuation?: string;
    
    /**
     * Allow scan on the queries which couldn't be served as indexing was opted out on the requested paths (only for {@link Collection.queryDocuments} and {@link Collection.queryAttachments}())
     */
    enableScan?: boolean;
    
    /**
     * Allow order by with low precision (only for {@link Collection.queryDocuments}, {@link Collection.sortBy} and {@link Collection.sortByDescending})
     */
    enableLowPrecisionOrderBy?: boolean;
}

/**
 * Options associated with a read operation.
 */
interface ReadOptions {
    /**
     * The conditional HTTP method ifNoneMatch value.
     */
    ifNoneMatch?: string;
}

/**
 * Options associated with a replace operation.
 */
interface ReplaceOptions {
    /**
     * Specifies indexing directives.
     */    
    indexAction?: IndexAction;
    /**
     * The entity tag associated with the resource.
     * This is matched with the persisted resource before deletion.
     */
    etag?: string;
}

/**
 * Options associated with a upsert operation.
 */
interface UpsertOptions {
    /**
     * Specifies indexing directives.
     */
    indexAction?: IndexAction
    
    /**
     * Disables automatic generation of "id" field of the document to be upserted (if it is not provided)
     */
    disableAutomaticIdGeneration?: boolean;
}