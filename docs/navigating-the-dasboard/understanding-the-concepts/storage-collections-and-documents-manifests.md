---
title: Storage, Collections and Documents & Manifests
sidebar_position: 3
---

# Storage, Collections and Documents & Manifests

<SiteName/> provides a robust document management system designed specifically for Retrieval-Augmented Generation (RAG) applications. It allows you to store, embed, and search documents efficiently, while remaining fully backend-agnostic — giving you the flexibility to work with any vector database or parsing pipeline.

## Storage

In <SiteName/>, **Storage** refers to the system that manages your deployed document databases, collections, and the documents inside them.
Each project can connect to one or more document instances (such as ChromaDB) for storing and retrieving embedded documents.

## Document Instances

A **Document Instance** is a running vector database, such as ChromaDB, used to store and search your documents. Each instance provides isolated storage, meaning documents and collections are tied to the specific instance they belong to.

You can deploy and manage multiple document instances depending on your needs — for example, separating different projects, environments, or workflows.

## Collections

A **Collection** is a logical group of related documents within a document instance.
Collections help organize data into specific areas — for example, separate collections for different products, teams, or knowledge bases.

When creating a collection, you can specify:

-   **Collection Name** — A unique identifier for the collection.
-   **Metadata (optional)** — Key-value pairs to describe additional properties of the collection (e.g., source, domain, intended use).

Each collection belongs to exactly one document instance and is scoped to that instance only.

## Documents

A **Document** is an individual piece of data stored inside a collection.
Each document includes:

-   **ID** — A unique identifier for the document within the collection.
-   **Content** — The textual body of the document.
-   **Metadata (optional)** — Key-value pairs that provide extra context (e.g., author, category, timestamps).

When you add a document:

-   The text content is automatically embedded into a vector using the configured embedding model.
-   The resulting vector, along with its ID and metadata, is stored inside the vector database.
-   Documents are then available for similarity-based search operations.
