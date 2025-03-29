---
sidebar_position: 1
---

# Documents API

## **Overview**

The **Documents API** is a TypeScript client library for storing and retrieving documents using vector embeddings, primarily designed for Retrieval-Augmented Generation (RAG) applications. It provides a unified interface to manage document collections and perform similarity search, without locking you into a specific vector database or document parser. This backend-agnostic design means you can use it with various vector databases (Pinecone, ChromaDB, Weaviate, etc.), and its parser-agnostic design lets you integrate any document parsing or embedding pipeline (for example, using LlamaIndex for chunking/embedding or custom parsers).

**Use Cases:** The Documents API is ideal for building RAG workflows such as knowledge base chatbots, semantic search engines, Q\&A systems, and other applications where you need to store large volumes of text and quickly retrieve relevant pieces based on similarity to a query. By abstracting the underlying vector DB, the same code can run against different backends, enabling flexibility and easy experimentation.

**High-Level Architecture:** Documents are stored as vector embeddings in collections:

* A **Collection** is a logical grouping of documents (akin to an index or namespace in a vector DB). For example, you might have separate collections for different data sources or subjects.

* Each **Document** consists of textual content and optional metadata. Under the hood, each document’s content is converted into a vector embedding (via an embedding model or parser). The vector, along with the metadata and an ID, is stored in the vector database.

* The Documents API client communicates with a backend service (or database) at a specified base URL (for example, a Pinecone index endpoint or a self-hosted Chroma server). The actual vector database and parsing logic are pluggable – you could configure the service to use a different vector DB or embedding model without changing your client code.

Using the Documents API, you can create new collections, add or update documents (the library will handle embedding the text if the backend is configured to do so), and perform similarity searches to retrieve the most relevant documents for a given query. All these operations are exposed through simple methods on the SDK, described below.

## **Authentication**

To use the Documents API, you need to configure the client with an API key and the base path (URL) of the backend service. The API key authenticates your requests, while the base path tells the client where to send the requests (this will typically be the URL or IP address of your vector database service or API).

**Setup:**

1. **API Key:** Obtain an API key for your Documents API backend. This might be provided by your vector DB service (for example, Pinecone provides an API key) or your own deployment’s authentication system. The API key is usually included as a bearer token in requests, but the SDK will handle that detail for you.

2. **Base Path:** Determine the base URL for the API. For cloud services like Pinecone, this would be the index endpoint URL (e.g. `https://YOUR-INDEXID.svc.pinecone.io`). For a local or self-hosted database like ChromaDB, it could be an address like `http://localhost:8000`. **Note:** The base path typically includes the protocol (`http://` or `https://`) and host (and port if needed), but not the endpoint paths – the SDK will append the appropriate paths for each operation.

**Initializing the Client:**

Below is an example of how to import and initialize the Documents API client with your API key and base path in both TypeScript and JavaScript:

```
import { Configuration, CollectionApi, AppApi } from 'documents-api';

// Set up configuration with your API key and base URL (e.g., DB IP or endpoint)
const config = new Configuration({
  apiKey: 'YOUR_API_KEY',
  basePath: 'http://YOUR_VECTOR_DB_HOST:PORT'  // e.g., 'https://your-pinecone-endpoint.io' or 'http://localhost:8000'
});

// Instantiate API clients
const collectionApi = new CollectionApi(config);
const appApi = new AppApi(config);
```

```javascript
// For Node.js using CommonJS syntax
const { Configuration, CollectionApi, AppApi } = require('documents-api');

// Set up configuration with API key and base path
const config = new Configuration({
  apiKey: 'YOUR_API_KEY',
  basePath: 'http://YOUR_VECTOR_DB_HOST:PORT'
});

// Instantiate API clients
const collectionApi = new CollectionApi(config);
const appApi = new AppApi(config);
```

Once configured, `collectionApi` provides methods to manage collections (creating, listing, deleting, etc.), and `appApi` provides methods to manage documents within those collections (adding documents, searching, updating, etc.). In the following sections, we’ll cover each of these methods in detail.

## **Usage Instructions**

The Documents API SDK is organized into two main classes:

* **CollectionApi** – for managing collections of documents.

* **AppApi** – for managing documents within a collection and performing searches.

Each method in these classes is described below with its purpose, parameters, return type, and examples in both TypeScript and JavaScript.

### **CollectionApi Methods**

#### **`createCollection`**

**Description:** Creates a new collection in your vector database. A collection is a container for documents, typically corresponding to a distinct index or namespace in the backend. You might create a collection for each project or data domain.

**Input parameters:**

* `name` *(string)* – The name of the new collection. This name must be unique. Choose a name that reflects the content (e.g., `"financial_reports"` or `"support_articles"`).

* `description` *(string, optional)* – A human-readable description of the collection. This can be used to store notes about what the collection contains. *(Optional – not all backends support storing a description.)*

**Return value:** A Promise that resolves to a **Collection** object representing the created collection. This object typically includes properties such as:

* `id` – The unique identifier of the collection (generated by the system).

* `name` – The name of the collection (as provided).

* `description` – The description of the collection (if provided).

* Possibly other info (e.g., creation time or number of documents, depending on backend).

**TypeScript Example:**

```
// Create a new collection
const newCollection = await collectionApi.createCollection('KnowledgeBase', 'Collection of support articles');
console.log(`New collection created with ID: ${newCollection.id}, name: ${newCollection.name}`);
```

**JavaScript Example:**

```javascript
// Create a new collection
collectionApi.createCollection('KnowledgeBase', 'Collection of support articles')
  .then(newCollection => {
    console.log(`New collection created with ID: ${newCollection.id}, name: ${newCollection.name}`);
  })
  .catch(error => {
    console.error('Error creating collection:', error);
  });
```

#### **`listCollections`**

**Description:** Retrieves all collections that exist (and are accessible with your API key). Use this to list the available collections along with their details.

**Input parameters:** *None.* (The method uses the credentials from the configuration to fetch collections.)

**Return value:** A Promise that resolves to an array of **Collection** objects. Each object in the array contains details of a collection (id, name, description, etc.). If no collections exist, an empty array is returned.

**TypeScript Example:**

```
const collections = await collectionApi.listCollections();
collections.forEach(col => {
  console.log(`Collection ${col.name} (ID: ${col.id})`);
});
```

**JavaScript Example:**

```javascript
collectionApi.listCollections()
  .then(collections => {
    collections.forEach(col => {
      console.log(`Collection ${col.name} (ID: ${col.id})`);
    });
  })
  .catch(err => {
    console.error('Failed to list collections:', err);
  });
```

#### **`getCollection`**

**Description:** Fetches the details of a specific collection by its ID. Use this to retrieve metadata about the collection, such as its name or other settings, or to confirm that a collection exists.

**Input parameters:**

* `collectionId` *(string)* – The unique identifier of the collection you want to retrieve. This ID is typically obtained from `createCollection` or `listCollections`.

**Return value:** A Promise that resolves to a **Collection** object for the given ID. If the collection is found, you’ll get its details (id, name, description, etc.). If the ID does not correspond to an existing collection, the promise will reject (with a 404 error).

**TypeScript Example:**

```
const collectionId = 'abc123';  // ID of the collection to fetch
try {
  const collection = await collectionApi.getCollection(collectionId);
  console.log(`Collection name: ${collection.name}, contains ${collection.documentCount} documents.`);
} catch (err) {
  console.error('Collection not found:', err);
}
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';  // ID of the collection to fetch
collectionApi.getCollection(collectionId)
  .then(collection => {
    console.log(`Collection name: ${collection.name}, contains ${collection.documentCount} documents.`);
  })
  .catch(err => {
    console.error('Collection not found or error fetching collection:', err);
  });
```

*(In the above example, `documentCount` is an imaginary property representing number of documents in the collection. Actual returned fields may vary by backend.)*

#### **`updateCollection`**

**Description:** Updates the metadata of an existing collection, such as its name or description. This is useful if you want to rename a collection or add/update a description.

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection to update.

* `update` *(object)* – An object containing the fields to update. This can include:

  * `name` *(string, optional)* – A new name for the collection.

  * `description` *(string, optional)* – A new description for the collection.

* You can provide one or both fields. Fields not included in the `update` object will remain unchanged.

**Return value:** A Promise that resolves to the updated **Collection** object. The returned object will reflect the new name/description. In some cases, the API may return a simple success status instead; in such cases, you may call `getCollection` to retrieve the updated info.

**TypeScript Example:**

```
const collectionId = 'abc123';
const updates = { name: 'KnowledgeBase_v2', description: 'Updated description for the collection' };
const updatedCollection = await collectionApi.updateCollection(collectionId, updates);
console.log(`Collection updated. New name: ${updatedCollection.name}`);
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const updates = { name: 'KnowledgeBase_v2', description: 'Updated description for the collection' };
collectionApi.updateCollection(collectionId, updates)
  .then(updatedCollection => {
    console.log(`Collection updated. New name: ${updatedCollection.name}`);
  })
  .catch(err => {
    console.error('Failed to update collection:', err);
  });
```

#### **`deleteCollection`**

**Description:** Deletes a collection and all documents within it. **Warning:** This operation is irreversible – all documents (and their embeddings) stored in the collection will be removed. Use this when you no longer need a collection or want to free up resources.

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection to delete.

**Return value:** A Promise that resolves to an acknowledgment of deletion. In many cases, the API returns an object with a success flag or a message. For example: `{ success: true, message: "Collection deleted." }`. In the SDK, this might be returned as a plain object or handled internally. If the collection did not exist, the promise may reject with an error.

**TypeScript Example:**

```
const collectionId = 'abc123';
await collectionApi.deleteCollection(collectionId);
console.log('Collection deleted successfully.');
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
collectionApi.deleteCollection(collectionId)
  .then(() => {
    console.log('Collection deleted successfully.');
  })
  .catch(err => {
    console.error('Error deleting collection:', err);
  });
```

---

### **AppApi Methods (Document Operations)**

#### **`addDocuments`**

**Description:** Adds one or multiple documents to a specified collection. This is how you ingest data into the vector store. You provide the raw document content (text) and any metadata, and the backend will handle embedding the content into a vector and storing it. If a document with the same ID already exists, some backends will update (upsert) it, while others may return an error or create a duplicate entry – see notes on best practices for handling this.

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection to which you want to add documents.

* `documents` *(array of objects)* – An array of document objects to add. Each document object can include:

  * `id` *(string, optional)* – A unique identifier for the document. If you don’t provide one, the system will generate an ID (often a UUID). Providing your own IDs is useful if you want to later update or delete specific documents.

  * `content` *(string)* – The content of the document. This should be the raw text that you want to be retrievable (e.g., the text of an article or a chunk of a larger document). **Note:** If your content is very large, consider chunking it into smaller pieces (see Best Practices).

  * `metadata` *(object, optional)* – A JSON object with additional metadata to associate with the document. Metadata can include anything relevant, like `{"author": "Alice", "topic": "Finance", "source": "Manual Upload"}`. You can use metadata later to filter search results or manage documents.

**Return value:** A Promise that resolves to a result object. Typically, this may include a list of document IDs that were successfully added (especially for auto-generated IDs) or a count of how many documents were indexed. For example: `{ ids: ["doc1", "doc2"] }` or `{ insertedCount: 2 }`. The exact structure can depend on the backend, but the SDK aims to present a unified interface. Check the `ids` in the result if you need to reference newly added documents.

**TypeScript Example:**

```
const collectionId = 'abc123';  // ID of the collection to add documents to
const docsToAdd = [
  {
    id: 'doc1',
    content: 'Cats are small, carnivorous mammals that are often kept as pets.',
    metadata: { species: 'cat', category: 'animal', title: 'About Cats' }
  },
  {
    id: 'doc2',
    content: 'Dogs are domesticated mammals, not natural wild animals. They were bred by humans.',
    metadata: { species: 'dog', category: 'animal', title: 'About Dogs' }
  }
];
const addResult = await appApi.addDocuments(collectionId, docsToAdd);
console.log('Documents added with IDs:', addResult.ids);
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const docsToAdd = [
  {
    id: 'doc1',
    content: 'Cats are small, carnivorous mammals that are often kept as pets.',
    metadata: { species: 'cat', category: 'animal', title: 'About Cats' }
  },
  {
    id: 'doc2',
    content: 'Dogs are domesticated mammals, not natural wild animals. They were bred by humans.',
    metadata: { species: 'dog', category: 'animal', title: 'About Dogs' }
  }
];
appApi.addDocuments(collectionId, docsToAdd)
  .then(addResult => {
    console.log('Documents added with IDs:', addResult.ids);
  })
  .catch(err => {
    console.error('Failed to add documents:', err);
  });
```

*(In this example, we explicitly set `id` for each document. If you omit the `id`, you can retrieve the generated IDs from `addResult.ids`.)*

*Absolutely\! Here's how to clearly document and provide usage examples for the `collectionControllerChunkFileToCollection` operation within your **Documents API** documentation. I've prepared it in the same structure for consistency.*

---

## ***`chunkFileToCollection`***

***Description:** The `chunkFileToCollection` method allows you to automatically ingest and chunk an external file (like a PDF, document, or webpage) directly into your vector database collection. Under the hood, this method fetches the file from a URL or a provided file source, extracts textual content using a configured parser (like LlamaIndex), splits it into manageable chunks (for optimal semantic search), creates vector embeddings, and adds the resulting documents into the specified collection.*

*This is particularly useful when handling large documents, avoiding the manual effort of extracting text, splitting, and adding content individually.*

---

### ***Input Parameters***

* ***`collectionId`** (string):*  
   *The identifier of the collection into which the file's chunked contents will be stored.*

* ***`chunkFileRequestDTO`** (object): Contains details for chunking the file.*

  * ***`type`** (string): Specifies the file type or parsing method. Common options include:*

    * *`"pdf"`*

    * *`"html"`*

    * *`"markdown"`*

    * *`"txt"`*

    * *`"docx"`*

    * *or custom types supported by your parser.*

  * ***`url`** (string): The URL where the file is accessible (must be publicly accessible or accessible by your backend).*

  * ***`options`** (object, optional): Additional chunking or parsing parameters. These options depend on your parser but may include:*

    * *`chunkSize`: number of tokens or characters per chunk.*

    * *`chunkOverlap`: amount of overlapping content between chunks (in tokens or characters).*

    * *`metadata`: additional metadata that should be attached to each chunked document.*

---

### ***Return Value***

*Returns a Promise that resolves to a `MessageResponseDTO`, indicating success or containing information about the operation's outcome:*

```
{
  message: "File chunked and added successfully",
}
```

---

#### **`getDocument`**

**Description:** Retrieves a single document from the collection by its ID. This will return the document’s content and metadata as stored. Use this method to verify a document was added or to fetch the content for display/debugging. (In many RAG applications, you might not need to fetch a document by ID often – instead, you use `searchDocuments` to find relevant docs. However, this method is useful for direct access when needed.)

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection that contains the document.

* `documentId` *(string)* – The ID of the document to retrieve.

**Return value:** A Promise that resolves to a **Document** object if found. The Document object typically includes:

* `id` – Document ID

* `content` – The text content of the document

* `metadata` – The metadata object associated with the document

* (Some backends might also return the embedding vector or other internal fields, but those are usually not needed in the application layer.)

If no document with that ID exists in the collection, the promise will reject with an error (often a 404 Not Found).

**TypeScript Example:**

```
const collectionId = 'abc123';
const docId = 'doc1';
try {
  const document = await appApi.getDocument(collectionId, docId);
  console.log('Document content:', document.content);
  console.log('Metadata:', document.metadata);
} catch (err) {
  console.error('Document not found:', err);
}
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const docId = 'doc1';
appApi.getDocument(collectionId, docId)
  .then(document => {
    console.log('Document content:', document.content);
    console.log('Metadata:', document.metadata);
  })
  .catch(err => {
    console.error('Error retrieving document:', err);
  });
```

#### **`searchDocuments`**

**Description:** Performs a similarity search in a collection. Given a query (for example, a user’s question or a piece of text), this method finds the documents in the collection that are most similar to the query, based on their vector embeddings. This is the core operation for retrieval in RAG systems – you use it to fetch relevant context to feed into your LLM’s prompt.

Under the hood, the query text is converted into a vector embedding (using the same model that was used for the documents), and the vector database is queried for nearest neighbors. The result is a set of documents that have high semantic similarity to the query.

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection to search within.

* `query` *(string OR number\[\])* – The search query. Typically, you will pass a string (natural language query). The backend will handle embedding this query string into a vector. If you have pre-computed an embedding vector for the query (as an array of numbers), some implementations allow you to pass that instead of a string – but usually a string is simpler and recommended.

* `topK` *(number, optional)* – The number of results to return. For example, if `topK = 5`, the API will return the 5 most similar documents. If omitted, a default (commonly 5 or 10\) is used. Adjust this based on how many documents of context you want for your application.

* `filter` *(object, optional)* – A metadata filter to apply to the search. This allows you to restrict the search to documents that have certain metadata values. For instance, you might only want to search documents where `category: "finance"` or `source: "internal"`. The filter should be an object where keys are metadata field names and values are the required value (or a condition) for that field. Only documents whose metadata match the filter will be considered in the similarity search. If no filter is provided, all documents in the collection are candidates.

**Return value:** A Promise that resolves to an array of **SearchResult** objects. Each SearchResult typically contains:

* `document` – The retrieved document (or it might directly give you `id`, `content`, `metadata` similar to a Document object).

* `score` – The similarity score or distance for the result. Higher score (or lower distance, depending on backend) means the document is more similar to the query. Scores are useful for debugging or thresholding results but often you may ignore them and just use the ranked order.

The results array is sorted by relevance (most relevant first). If no documents are similar (or the collection is empty), you may receive an empty array.

**TypeScript Example:**

```
const collectionId = 'abc123';
const query = 'What are domesticated animals?';
const filter = { category: 'animal' };  // Only search within documents tagged as 'animal'
const results = await appApi.searchDocuments(collectionId, query, 5, filter);
console.log(`Found ${results.length} results.`);
for (const result of results) {
  console.log('- Document ID:', result.document.id);
  console.log('  Content snippet:', result.document.content.substring(0, 50), '...');  // print first 50 chars
  console.log('  Similarity score:', result.score);
}
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const query = 'What are domesticated animals?';
const filter = { category: 'animal' };  // Only search documents with category 'animal'
appApi.searchDocuments(collectionId, query, 5, filter)
  .then(results => {
    console.log(`Found ${results.length} results.`);
    results.forEach(result => {
      console.log('- Document ID:', result.document.id);
      console.log('  Content snippet:', result.document.content.substring(0, 50), '...');
      console.log('  Similarity score:', result.score);
    });
  })
  .catch(err => {
    console.error('Search failed:', err);
  });
```

*(In this example, we search for documents about domesticated animals in the collection. The filter ensures we only consider documents categorized as "animal". Each result’s content is potentially long, so we only print a snippet. The `score` indicates how closely the document matched the query.)*

#### **`updateDocuments`**

**Description:** Updates one or more documents in a collection. This allows you to modify the content or metadata of documents that have already been added, without needing to delete and re-add them. For instance, you might fix a typo in the content, append additional information, or correct the metadata (like changing a tag).

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection containing the documents to update.

* `updates` *(array of objects)* – An array of update instructions. Each object in the array should identify a document and provide new content or metadata:

  * `id` *(string)* – The ID of the document to update (this is required for each update entry, so the system knows which document to modify).

  * `content` *(string, optional)* – The new content for the document, if you want to replace or update the text. If provided, the backend will re-embed this content to update the stored vector.

  * `metadata` *(object, optional)* – New metadata for the document. You can either replace or merge metadata depending on backend behavior:

    * In many systems, providing a metadata object will replace the existing metadata for that document. Some backends may support partial metadata updates (merging or updating specific fields), but to be safe, assume it replaces the whole metadata.

    * Ensure that if you only want to change one field, you still include all other metadata fields (or confirm the partial update behavior in the backend docs).

  * You can include both `content` and `metadata` if you want to update both. If you include only one of them, the other aspect remains unchanged (e.g., updating metadata alone leaves content as-is; updating content alone keeps existing metadata).

**Return value:** A Promise that resolves to a result indicating the outcome. Often, this could be a list of document IDs that were updated successfully, or a count of updated documents. For example: `{ updatedCount: 1 }` or `{ ids: ["doc1"] }`. If any specified document ID does not exist, the backend might return an error or simply ignore that entry – check the behavior for your specific backend. On error (e.g., no permission or invalid data), the promise will reject.

**TypeScript Example:**

```
const collectionId = 'abc123';
const updates = [
  {
    id: 'doc2',
    metadata: { category: 'pet' }  // change the category metadata from 'animal' to 'pet'
    // (content not provided, so it will remain unchanged)
  }
];
const updateResult = await appApi.updateDocuments(collectionId, updates);
console.log(`Documents updated: ${updateResult.updatedCount || updateResult.ids}`);
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const updates = [
  {
    id: 'doc2',
    metadata: { category: 'pet' }
  }
];
appApi.updateDocuments(collectionId, updates)
  .then(updateResult => {
    const updatedInfo = updateResult.updatedCount || updateResult.ids;
    console.log('Documents updated:', updatedInfo);
  })
  .catch(err => {
    console.error('Error updating documents:', err);
  });
```

*(In the above example, we update the document with ID `"doc2"`, changing its `category` metadata from `"animal"` to `"pet"`. We did not provide new content, so the text remains the same. The result could be a count or list of IDs of updated docs, depending on the implementation.)*

#### **`deleteDocument`**

**Description:** Deletes a single document from a collection by its ID. Use this to remove an individual document when it’s no longer needed or if it was added erroneously.

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection containing the document.

* `documentId` *(string)* – The ID of the document to delete.

**Return value:** A Promise that resolves when the document is deleted. The result might include a confirmation object (e.g., `{ success: true }`) or it might simply resolve to an empty response with a success status code. If the document wasn’t found, the promise will reject with an error (404 Not Found).

**TypeScript Example:**

```
const collectionId = 'abc123';
const docId = 'doc1';
await appApi.deleteDocument(collectionId, docId);
console.log(`Document ${docId} deleted from collection.`);
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const docId = 'doc1';
appApi.deleteDocument(collectionId, docId)
  .then(() => {
    console.log(`Document ${docId} deleted from collection.`);
  })
  .catch(err => {
    console.error('Failed to delete document:', err);
  });
```

#### **`deleteDocumentsByMetadata`**

**Description:** Deletes all documents in a collection that match a given metadata filter. This method is useful for bulk deletions. For example, you can remove *all* documents of a certain category, from a certain source, or any arbitrary metadata criteria, in one call. It saves you from having to retrieve IDs and delete individually when dealing with many documents.

**Input parameters:**

* `collectionId` *(string)* – The ID of the collection from which to delete documents.

* `filter` *(object)* – A metadata filter object specifying which documents to delete. The structure is similar to the filter used in `searchDocuments`. All documents whose metadata match *all* the conditions in the filter will be deleted. For instance, `{ category: 'obsolete', year: 2020 }` would delete documents that have `category` metadata equal to `"obsolete"` **and** `year` equal to `2020`.

  * The filter conditions are typically equality checks on metadata values. More complex filters (like ranges or negations) may or may not be supported depending on the backend.

  * **Use with care:** If you pass an empty object `{}` as the filter, it could delete **all documents** in the collection (since all documents match an empty filter). Not all implementations allow an empty filter, but if they do, be cautious.

**Return value:** A Promise that resolves to a result indicating deletion outcome. Often this could be something like `{ deletedCount: X }` indicating how many documents were removed. Some systems might just return a success flag. If no documents matched the filter, `deletedCount` might be 0\. If the filter syntax is wrong or unsupported, the promise will reject with an error.

**TypeScript Example:**

```
const collectionId = 'abc123';
const filter = { category: 'pet' };  // delete all documents where category is 'pet'
const deleteResult = await appApi.deleteDocumentsByMetadata(collectionId, filter);
console.log(`Documents deleted: ${deleteResult.deletedCount}`);
```

**JavaScript Example:**

```javascript
const collectionId = 'abc123';
const filter = { category: 'pet' };
appApi.deleteDocumentsByMetadata(collectionId, filter)
  .then(deleteResult => {
    console.log('Documents deleted:', deleteResult.deletedCount);
  })
  .catch(err => {
    console.error('Error deleting documents by filter:', err);
  });
```

*(In this example, we delete all documents categorized as "pet". If we had previously updated a document’s category to "pet", that document will be removed. The result indicates how many documents were deleted.)*

---

## **Full Workflow Examples**

Bringing it all together, here are some common workflows step-by-step, with examples in both TypeScript and JavaScript. These illustrate how you might use the Documents API in a real scenario.

### **Example 1: Creating a Collection**

Let’s start by creating a new collection to store documents for our RAG application. Suppose we’re building a knowledge base of articles. We’ll create a collection called `"KnowledgeBase"`.

**TypeScript:**

```
import { Configuration, CollectionApi } from 'documents-api';
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'http://YOUR_DB_HOST' });
const collectionApi = new CollectionApi(config);

async function createCollectionExample() {
  const collection = await collectionApi.createCollection('KnowledgeBase', 'Collection of support articles');
  console.log(`Created collection "${collection.name}" with ID: ${collection.id}`);
  return collection.id;  // we'll use this ID in subsequent examples
}

const collectionId = await createCollectionExample();
```

**JavaScript:**

```javascript
const { Configuration, CollectionApi } = require('documents-api');
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'http://YOUR_DB_HOST' });
const collectionApi = new CollectionApi(config);

function createCollectionExample() {
  return collectionApi.createCollection('KnowledgeBase', 'Collection of support articles');
}

createCollectionExample()
  .then(collection => {
    console.log(`Created collection "${collection.name}" with ID: ${collection.id}`);
    // Save the ID for use in later operations
    global.collectionId = collection.id;
  })
  .catch(err => console.error('Could not create collection:', err));
```

In the above, we created a collection named "KnowledgeBase". The returned `collection.id` is important – we’ll use it to add documents to that collection.

### **Example 2: Adding Documents to a Collection**

Now that we have a collection, let’s add some documents to it. Imagine we have two articles: one about cats and one about dogs. We’ll add each as a document in the collection, with some metadata to describe them.

**TypeScript:**

```
import { AppApi } from 'documents-api';
const appApi = new AppApi(config);  // using the same config from previous example

async function addDocumentsExample(collectionId: string) {
  const docs = [
    {
      id: 'doc1',
      content: 'Cats are popular pets known for their independence and playful behavior.',
      metadata: { animal: 'cat', type: 'article', title: 'All About Cats' }
    },
    {
      id: 'doc2',
      content: 'Dogs have been bred by humans for companionship and work, making them incredibly loyal pets.',
      metadata: { animal: 'dog', type: 'article', title: 'All About Dogs' }
    }
  ];
  const result = await appApi.addDocuments(collectionId, docs);
  console.log(`Added documents: ${result.ids.join(', ')}`);
}

await addDocumentsExample(collectionId);
```

**JavaScript:**

```javascript
const { AppApi } = require('documents-api');
const appApi = new AppApi(config);  // using config from previous example

function addDocumentsExample(collectionId) {
  const docs = [
    {
      id: 'doc1',
      content: 'Cats are popular pets known for their independence and playful behavior.',
      metadata: { animal: 'cat', type: 'article', title: 'All About Cats' }
    },
    {
      id: 'doc2',
      content: 'Dogs have been bred by humans for companionship and work, making them incredibly loyal pets.',
      metadata: { animal: 'dog', type: 'article', title: 'All About Dogs' }
    }
  ];
  return appApi.addDocuments(collectionId, docs);
}

addDocumentsExample(global.collectionId)
  .then(result => {
    console.log('Added documents:', result.ids.join(', '));
  })
  .catch(err => console.error('Error adding documents:', err));
```

*Explanation:* We added two documents with IDs "doc1" and "doc2". Each has some metadata: an `animal` type and a `title`. After this operation, the collection contains these documents (with their content vectorized and stored in the backend).

### **Example 3: Performing a Similarity Search**

With documents in the collection, we can perform a similarity search. Let’s say the user asks a question: "Why are cats independent?" We want to find the document chunks that are most relevant to this query. We’ll search our collection for the top 2 most similar documents. We’ll also demonstrate using a filter – for example, ensure we only search in documents of type "article" (in this case all our docs are articles, but imagine your collection had various types).

**TypeScript:**

```
async function searchExample(collectionId: string) {
  const query = 'Why are cats independent?';
  const filter = { type: 'article' };
  const results = await appApi.searchDocuments(collectionId, query, 2, filter);
  console.log(`Search query: "${query}"`);
  results.forEach((res, i) => {
    console.log(`Result #${i+1}:`);
    console.log(`  ID: ${res.document.id}`);
    console.log(`  Title: ${res.document.metadata.title}`);
    console.log(`  Score: ${res.score}`);
    console.log(`  Excerpt: "${res.document.content.substring(0,60)}..."`);
  });
}

await searchExample(collectionId);
```

**JavaScript:**

```javascript
function searchExample(collectionId) {
  const query = 'Why are cats independent?';
  const filter = { type: 'article' };
  return appApi.searchDocuments(collectionId, query, 2, filter);
}

searchExample(global.collectionId)
  .then(results => {
    const query = 'Why are cats independent?';
    console.log(`Search query: "${query}"`);
    results.forEach((res, i) => {
      console.log(`Result #${i+1}:`);
      console.log(`  ID: ${res.document.id}`);
      console.log(`  Title: ${res.document.metadata.title}`);
      console.log(`  Score: ${res.score}`);
      console.log(`  Excerpt: "${res.document.content.substring(0,60)}..."`);
    });
  })
  .catch(err => console.error('Search failed:', err));
```

*Explanation:* We searched for a query about cats. The search results (likely the cat article, and possibly the dog article if it had some overlapping content about pets) are printed with their IDs, titles, and a snippet of content. The similarity score is also shown. We applied a filter `{ type: 'article' }` to restrict search, though in this simple example all docs are articles. In a more complex collection, filters can ensure we only search relevant subsets of data.

### **Example 4: Updating a Document**

Suppose we want to update a document’s metadata or content. Maybe we realize that the "All About Dogs" article should have the category metadata "pet" instead of "animal". We can update the metadata of that document without re-uploading it entirely. (If we wanted to update content, we’d include a new content string and the system would re-embed it.)

**TypeScript:**

```
async function updateDocumentExample(collectionId: string) {
  const updates = [
    {
      id: 'doc2',
      metadata: { animal: 'dog', type: 'article', title: 'All About Dogs', category: 'pet' }
      // In this case, we add a new metadata field "category" or change it from 'animal' to 'pet'.
      // We include existing metadata fields as well to avoid losing them (depending on backend).
    }
  ];
  const result = await appApi.updateDocuments(collectionId, updates);
  console.log(`Updated document ${updates[0].id}.`, result);
}
await updateDocumentExample(collectionId);
```

**JavaScript:**

```javascript
function updateDocumentExample(collectionId) {
  const updates = [
    {
      id: 'doc2',
      metadata: { animal: 'dog', type: 'article', title: 'All About Dogs', category: 'pet' }
    }
  ];
  return appApi.updateDocuments(collectionId, updates);
}

updateDocumentExample(global.collectionId)
  .then(result => {
    console.log('Document doc2 updated.', result);
  })
  .catch(err => console.error('Failed to update document:', err));
```

*Explanation:* We updated document "doc2" by adding/changing a metadata field `category` to "pet". The example shows sending the full set of metadata for doc2 (including existing fields) to ensure a complete update. After this, the document doc2 now has `category: "pet"` in its metadata. The console log shows confirmation of the update (the `result` might contain an updated count or similar).

### **Example 5: Deleting Documents by Metadata**

Finally, let’s demonstrate deleting documents using a metadata filter. Continuing the scenario, suppose we want to remove all documents that are categorized as "pet" from the collection (perhaps we decided to separate pet-related content elsewhere). We can use the filter `{ category: 'pet' }` to delete all such documents in one call. In our case, that would delete the "All About Dogs" document which we just categorized as `pet`.

**TypeScript:**

```
async function deleteByMetadataExample(collectionId: string) {
  const filter = { category: 'pet' };
  const result = await appApi.deleteDocumentsByMetadata(collectionId, filter);
  console.log(`Deleted ${result.deletedCount} documents with category "pet".`);
}
await deleteByMetadataExample(collectionId);
```

**JavaScript:**

```javascript
function deleteByMetadataExample(collectionId) {
  const filter = { category: 'pet' };
  return appApi.deleteDocumentsByMetadata(collectionId, filter);
}

deleteByMetadataExample(global.collectionId)
  .then(result => {
    console.log('Deleted', result.deletedCount, 'documents with category "pet".');
  })
  .catch(err => console.error('Error deleting documents by metadata:', err));
```

*Explanation:* The filter `{ category: 'pet' }` matched all pet-category documents. In our example, that was the "doc2" we updated. The result’s `deletedCount` should be 1, indicating one document was removed. If there were multiple pet documents, they’d all be deleted. This method makes it easy to clean up subsets of data. If we wanted to delete all documents in the collection, we could potentially call this with a broader filter or no filter (depending on backend support), but using `deleteCollection` might be more straightforward in that case.

These examples covered creating a collection, adding documents, searching, updating, and deleting by metadata – which form the typical workflow of managing and querying a knowledge base for RAG.

### **Example 6: Chunking of a Document**

***TypeScript Example***

```
import { CollectionApi, Configuration } from 'documents-api';

// Configure the API client
const config = new Configuration({
  apiKey: 'YOUR_API_KEY',
  basePath: 'http://YOUR_VECTOR_DB_HOST:PORT'
});

const collectionApi = new CollectionApi(config);

async function chunkFileToCollectionExample() {
  const collectionId = 'YOUR_COLLECTION_ID';
  const chunkFileRequestDTO = {
    type: 'pdf', // or 'html', 'docx', etc.
    url: 'https://example.com/path/to/document.pdf',
    options: {
      chunkSize: 500,          // Optional, size of each chunk
      chunkOverlap: 50,        // Optional, overlap between chunks
      metadata: {
        source: 'example.com',
        author: 'John Doe'
      }
    }
  };

  try {
    const response = await collectionApi.collectionControllerChunkFileToCollection(collectionId, chunkFileRequestDTO);
    console.log(response.message); // "File chunked and added successfully"
  } catch (error) {
    console.error('Error chunking file into collection:', error);
  }
}

chunkFileToCollectionExample();
```

---

***JavaScript Example***

```javascript
const { CollectionApi, Configuration } = require('documents-api');

// Configure the API client
const config = new Configuration({
  apiKey: 'YOUR_API_KEY',
  basePath: 'http://YOUR_VECTOR_DB_HOST:PORT'
});

const collectionApi = new CollectionApi(config);

function chunkFileToCollectionExample() {
  const collectionId = 'YOUR_COLLECTION_ID';
  const chunkFileRequestDTO = {
    type: 'pdf', // or 'html', 'docx', etc.
    url: 'https://example.com/path/to/document.pdf',
    options: {
      chunkSize: 500,          // Optional, size of each chunk
      chunkOverlap: 50,        // Optional, overlap between chunks
      metadata: {
        source: 'example.com',
        author: 'John Doe'
      }
    }
  };

  collectionApi.collectionControllerChunkFileToCollection(collectionId, chunkFileRequestDTO)
    .then(response => {
      console.log(response.message); // "File chunked and added successfully"
    })
    .catch(error => {
      console.error('Error chunking file into collection:', error);
    });
}

chunkFileToCollectionExample();
```

---

### ***Common Use Cases***

* *Quickly ingest and chunk external documents (like PDFs or webpages) directly into your semantic search system.*

* *Automate knowledge base maintenance by periodically fetching and indexing updated documents from external URLs.*

* *Simplify the data pipeline for document-heavy applications by avoiding manual chunking and text extraction.*

---

## **Best Practices**

When using the Documents API in your projects, consider the following best practices to make the most of the SDK and underlying vector database:

* **Managing Document IDs and Metadata:**  
   Decide how you will use document IDs upfront. If you provide custom IDs (e.g., `"article_123"` or `"doc-abc"`), ensure they are unique within each collection. Using meaningful IDs (like a filename or a slug) can help with debugging and manual management. If you don’t care about IDs, let the system generate them – but store any returned IDs if you might need to update or delete those documents later.  
   Leverage metadata to store important attributes of each document. Good metadata choices include: source of the document (e.g., `"source": "user_upload"` or `"source": "wikipedia"`), document type or category (e.g., `"type": "article"` or `"domain": "finance"`), authorship or date, and any tags that would help filter or group documents. Metadata should be concise – avoid storing large text in metadata. Use it to annotate documents with information that you might use as filters or for analysis. Managing metadata consistently (for example, using a fixed set of keys or controlled vocabulary for values) will make your searches more effective and your data more organized.

* **Chunking Large Documents:**  
   For very large documents (long PDFs, lengthy articles, etc.), it's generally better to split or **chunk** them into smaller pieces before adding to the vector database. Each chunk becomes a separate document entry with its own embedding. This improves retrieval because the similarity search can target the specific chunk relevant to a query, rather than an entire huge document which might dilute relevance. A common strategy is to chunk text by paragraphs or by a fixed token count (e.g., 500 tokens per chunk) with some overlap to maintain context. Tools like *LlamaIndex* or *LangChain* can assist with automatic chunking and embedding of large documents. When chunking, you can use metadata to keep track of the source document (e.g., add a `sourceDocumentId` or `filename` metadata to each chunk) so you know which chunks came from the same original file. In summary: **smaller, self-contained chunks lead to better and more precise search results.**

* **Filtering in Similarity Search:**  
   Make use of the `filter` parameter in `searchDocuments` to scope your searches, especially as your dataset grows. If you know the user’s query should only apply to a subset of documents, filtering can both speed up the search and improve result relevance. For example, if you have documents in multiple languages, store the language in metadata (e.g., `"lang": "en"` or `"lang": "fr"`). Then, when a query is in English, use `filter: { lang: "en" }` to search only English documents. Another example: for a multi-tenant application, include a `tenantId` or `customerId` in metadata for each document, and filter on it so that each customer’s queries only retrieve their own documents. Filters are typically much faster than scanning irrelevant vectors and help maintain separation of concerns. Design your metadata schema with the types of filters you’ll need in mind.

* **Batch Operations and Rate Limiting:**  
   When adding or updating a large number of documents, consider batching your calls to `addDocuments` (e.g., in chunks of a few hundred at a time, if supported) rather than one huge call or many single-document calls. This can be more efficient and kinder to the API. Similarly, if performing a lot of search queries in a short time (for example, to handle high user traffic), ensure you handle promise rejections that indicate rate limits or slow down as needed. The Documents API and the underlying vector DB may have rate limits – these are often communicated via error messages (429 Too Many Requests or similar). Plan to catch and handle such cases gracefully (e.g., retry after a delay or degrade functionality).

* **Consistency between Parser and Vector DB:**  
   Because the Documents API is parser-agnostic, you might use different tools to generate embeddings or parse documents. Ensure that the vector dimension of your embeddings matches what the vector database expects. For instance, if you use OpenAI’s text-embedding-ada-002 model (which produces 1536-dimensional vectors), your collection (index) in the vector DB should be set to dimension 1536\. If you change embedding models or methods, it’s best to create a new collection for those, or re-index the data, to avoid dimension mismatches or inconsistent results. Also, maintain the same text preprocessing steps between adding documents and querying (e.g., if you lowercased or removed stopwords for embeddings, ensure the query is treated similarly) – however, most modern embeddings work well on raw text, so heavy preprocessing isn’t usually needed beyond maybe stripping out irrelevant markup.

* **Monitoring and Logging:**  
   While developing, use console logs (as shown in the examples) or other logging to verify that operations are performing as expected – for example, log the number of results from a search and some sample content. In production, you might want to record metrics like how many documents were added, how long searches take, etc. Many vector DBs provide stats on vector count and index size; consider using `listCollections` or collection metadata to keep track of how your dataset grows. Additionally, handle errors in each operation; for instance, if `addDocuments` fails for some documents, you might log which ones failed and why (maybe due to size limits or bad data), so you can reprocess or clean that data.

By following these practices, you can maintain a robust and scalable RAG system using the Documents API, ensuring data quality and query performance.

## **Notes**

Finally, here are some additional notes and clarifications about the Documents API SDK that will help you integrate it smoothly:

* **Pluggable Backends and Parsers:** The strength of the Documents API is that it is not tied to one specific database or embedding technique. The actual vector storage backend can be configured on the server side or via the base path you use. For example, you might start development using a local ChromaDB (no external dependencies, quick iterations) by setting `basePath` to your local service. Later, you could switch to Pinecone or Weaviate for a hosted solution by simply changing the `basePath` (and `apiKey` if needed) – your code would remain the same. Similarly, the method of embedding text (the "parser") is swappable: one deployment of the Documents API might use OpenAI’s embeddings, another might use Cohere, or a local model. As a developer using this SDK, you don’t have to manage those embeddings directly; just be aware that different deployments might have different capabilities (e.g., maximum document size or supported query types) depending on the configured parser. Always ensure your Documents API endpoint is set up with a backend that suits your needs (dimensions, performance, etc.).

* **Supported Content Types:** The SDK methods assume that the `content` you provide in documents is text (string). Most vector databases and embedding models work with text data. If your use case involves non-textual data (images, audio, etc.), typically you would convert those into text (e.g., image captions, OCR for PDFs, transcripts for audio) or directly into embeddings using a suitable model, then store them. Some advanced deployments of a Documents API might accept file uploads or URLs and handle the parsing internally (for example, fetching a PDF and extracting text). If your Documents API deployment supports such features, you might see methods or metadata indicating content type (like a `documentType` or a need to base64-encode binary content). By default, assume **plain text is the content type**. You can store things like JSON or code as text too. Just ensure the content is UTF-8 text and not an unsupported binary blob. For PDFs or docs, typically you’d extract text first. The SDK itself doesn’t limit content beyond it being a string, but the backend might have size limits (e.g., not more than a few thousand tokens per document for embedding). When in doubt, chunk the content (as discussed) or consult the backend’s documentation for any content size limitations.

* **Error Handling and Response Types:** The Documents API SDK will throw exceptions (or return rejected promises) for error cases such as:

  * **Authentication errors (401/403):** If your API key is missing or invalid, operations will fail. Ensure your `apiKey` is correct and has access to the base path/collection you’re targeting. An authentication error typically results in no operations being performed; check that you set the key in `Configuration`.

  * **Not Found (404):** If you reference a collection or document ID that doesn’t exist (e.g., calling `getCollection` on a wrong ID, or `searchDocuments` on a non-existent collection), you’ll get a not found error. The error message usually indicates what was not found. You might handle this by creating the collection if it’s missing, or informing the user that no such document exists.

  * **Validation or Bad Request (400):** If input data is not valid (for instance, a filter object in wrong format, or providing an empty document content), the API might return a 400\. The error message will guide what was wrong. Always ensure required fields like `content` are provided and of correct type.

  * **Rate limits or Server errors (429, 500):** If the service is overloaded or an internal error occurs, you might get these responses. The SDK will throw an error in these cases as well. Implement retries with backoff for 429 responses, and for 500-series errors you might want to log them and possibly alert, as they indicate something unexpected on the backend.

* In TypeScript, these errors might be of a specific error class or a generic `Error`. You can use try/catch around `await` calls or `.catch` on promises (as shown in the examples) to handle them. It’s good practice to at least log the `error.message` and perhaps the `error.response` (if available) which might contain more details or an error code from the backend.

   **Response Types:** The SDK methods return JavaScript objects (deserialized from JSON responses of the API). These correspond to the data structures we described (Collection, Document, SearchResult, etc.). If you’re using TypeScript, you get type definitions for these return values, which helps in development (for example, you can see that `collection.name` is a string, `result.score` is a number, etc.). When printing or using these objects, treat them as read-only data transfer objects. If you need to keep them, you can store them in your application state or database, but remember that any changes you make to them in your code won’t affect the actual stored data in the vector DB unless you call an update method.

* **Underlying Implementation Details:** While not necessary to use the SDK, it can help to know a bit about what’s happening behind the scenes:

  * When you call `addDocuments`, the SDK likely calls a RESTful API endpoint (like `POST /collections/{collectionId}/documents`) sending your content and metadata. The backend service receives the text, converts it into an embedding vector via an embedding model (unless you provided a vector directly, which is less common) and stores it in the vector database. The vector DB could be Pinecone, Chroma, etc., depending on your setup.

  * When you call `searchDocuments`, there’s often an endpoint like `POST /collections/{collectionId}/query` where your query text is embedded (again via the model) and a similarity search (e.g., k-NN search) is executed in the vector index. The results are then looked up to fetch the corresponding metadata and text for returning to you.

  * The **CollectionApi** calls might correspond to endpoints like `POST /collections` (to create one), `GET /collections` (to list), etc. Some vector databases (like Pinecone) require specifying a dimension and metric type when creating an index; in a backend-agnostic system, those might be set to defaults or configured server-side. If your backend requires such parameters, ensure they are configured on that side. The SDK doesn’t usually require you to pass those in the code (unless the API explicitly asks for it) – the goal is to keep the client usage simple.

* **Extensibility:** The Documents API is meant to cover common needs. If you have advanced requirements not covered by the SDK methods (for example, you want to do a keyword search or a hybrid search combining vectors and keywords, or you need to stream in documents from a file), you might need to use additional services or pre-process data. The SDK might not directly provide those, but you can integrate it with other libraries. For instance, you could use the SDK to store vectors and at the same time store full-text in a separate database for keyword search, then combine results. This goes beyond the SDK’s scope but remember that the SDK’s focus is vector similarity operations – anything beyond that might require custom handling.

In summary, the Documents API SDK is a flexible tool that abstracts away the specifics of different vector databases and embedding pipelines. By understanding the methods, following best practices, and noting the above considerations, you can effectively build a scalable RAG system or any vector-search powered application in TypeScript/JavaScript. The examples and guidelines in this documentation should serve as a solid starting point for implementation. Happy coding, and may your relevant documents always be within reach\!

