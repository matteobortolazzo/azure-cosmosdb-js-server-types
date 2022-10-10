/**
 * The predicate function for a {@link Collection.map}, {@link Collection.unwind}, which maps the input document's properties into a new document object.
 * 
 * @param document Input document.
 * 
 * @returns Output document, containing only the mapped properties. This output document will be added to the output result of the map call.
 */
type ProjectionPredicate<TSource, TResult> = (document: TSource) => TResult;

/**
 * The predicate function for a {@link Collection.filter} query, which acts as a truth test of whether a document should be filtered or not.
 * 
 * @param document Input document.
 * 
 * @returns True if this document matches the filter, false otherwise. If true, this document will be added to the output result of the filter call.
 */
type FilterPredicate<TSource> = (document: TSource) => boolean;

/**
 * The predicate function for a {@link Collection.sortBy} or a {@link Collection.sortByDescending} query, which defines the property of the document to be used for sorting.
 * 
 * @param document Input document.
 * 
 * @returns A property of the document to use for sorting.
 */
type SortByPredicate<TSource> = (document: TSource) => string | number;

/**
 * The predicate function for a {@link Collection.unwind}, which maps the input document's properties into a new document object.
 * 
 * @param documentItem Input document or top level item from previous projection.
 * @param innerCollectionItem The item selected from inner collection.
 * 
 * @returns Output document, containing only the mapped properties. This output document will be added to the output result of the map call.
 */
type ResultSelectorPredicate<TSource, TInnerSource, TResult> = (documentItem: TSource, innerCollectionItem: TInnerSource) => TResult;