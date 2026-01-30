---
title: Documents Processing API
sidebar_position: 5
---

# Document Processing API

## Usage Example

This client can be used from both **TypeScript** and **JavaScript**. Below is a minimal end-to-end example using the generated API clients.

### 1. Setup

```ts
import {
  Configuration,
  ProfilesApi,
  DocumentsApi,
  EvalsApi,
  QueriesApi,
} from '@nestbox-ai/doc-processing-api';

const config = new Configuration({
  basePath: 'http://localhost',
});

const profilesApi = new ProfilesApi(config);
const documentsApi = new DocumentsApi(config);
const evalsApi = new EvalsApi(config);
const queriesApi = new QueriesApi(config);
```

---

### 2. Create a Profile (from YAML)

```ts
const profileYaml = `
name: invoice-profile
description: Extract fields from invoices
fields:
  - name: invoice_number
    type: string
  - name: total_amount
    type: number
`;

const profile = await profilesApi.profilesControllerCreateProfile({
  yaml: profileYaml,
});

console.log('Profile created:', profile.data.id);
```

---

### 3. Process a Document

```ts
const documentResponse =
  await documentsApi.documentsControllerCreateDocument({
    profileId: profile.data.id,
    file: /* File | Buffer | Stream */,
  });

const documentId = documentResponse.data.documentId;
console.log('Document ID:', documentId);
```

You can later fetch the processed document:

```ts
const document =
  await documentsApi.documentsControllerGetDocument(documentId);

console.log('Document status:', document.data.status);
```

---

### 4. Run Evals (from YAML)

```ts
const evalYaml = `
name: accuracy-check
assertions:
  - field: total_amount
    operator: exists
`;

const evalResponse =
  await evalsApi.evalsControllerCreateEval(
    documentId,
    { yaml: evalYaml }
  );

console.log('Eval created:', evalResponse.data.evalId);
```

---

### 5. Run Queries (Batch Query from YAML)

```ts
const queryYaml = `
name: invoice-query
filters:
  - field: total_amount
    operator: gt
    value: 1000
`;

const queryResponse =
  await queriesApi.queriesControllerCreateQuery({
    yaml: queryYaml,
  });

console.log('Query created:', queryResponse.data.queryId);
```

