---
title: For Storing Documents DB
sidebar_position: 1
---

# For Storing Documents DB

In Nestbox, document storage and retrieval are handled by deploying dedicated vector database instances, such as ChromaDB.
These databases allow you to store documents as vector embeddings and perform efficient similarity searches across your content.

This guide walks you through the general process of:

-   Creating a runtime instance for document storage
-   Setting up a collection
-   Adding documents
-   Performing a basic search

## 1. Create a Runtime Instance

1. Navigate to **Compute > Machine Images** in the dashboard.
2. Select an appropriate machine image for document storage — for example, **ChromaDB**.
3. Click **Create Instance**.
4. Configure your machine instance:
    - Set a **Name** for your instance.
    - Specify any required resources (e.g., number and type of GPUs, CPU type, disk size).
5. Confirm and launch the instance.

Once the instance is running, it will be listed under **Compute > Runtime Instances**. You can also find it under the **Document** section, where document operations are managed.

## 2. Create a Collection

After your runtime instance is active:

1. Go to **Document** in the sidebar and click on your running document instance.
2. Click **New Collection**.
3. Enter the **Collection Name**.
4. _(Optional)_ Add any **metadata** (key-value pairs) to describe the collection.
5. Click **Add** to create the collection.

Collections group related documents together and serve as logical indexes for retrieval operations.

## 3. Add Documents

Once your collection is created:

1. Locate the collection in the list.
2. Open the options menu (three dots) next to the collection name.
3. Select **Add Document**.
4. Fill in the document fields:
    - **ID** (a unique identifier for the document)
    - **Document** (the text content you want to store)
    - _(Optional)_ Metadata fields such as tags, categories, or any custom information.
5. Click **Add** to save the document.

The document will be embedded automatically into a vector and stored inside the vector database.

## 4. Perform a Search

To test retrieval:

1. Open the options menu next to your collection.
2. Select **Search**.
3. Enter a **query** — a text phrase that you want to match against your stored documents.
4. _(Optional)_ Add **search parameters**, **filters**, or **inclusions** based on your setup.
5. Click **Search**.

The system will return documents most similar to the query, based on vector similarity search.
