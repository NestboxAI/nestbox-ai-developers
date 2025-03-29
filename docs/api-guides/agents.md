---
sidebar_position: 2
---

# Agent Operations API

Welcome to the Agent Management SDK documentation. This SDK allows you to manage and interact with your AI agents programmatically. It provides four main APIs for agent management:

* **Query API** – Send queries to your agents and receive responses.

* **Webhooks API** – Manage webhook endpoints to get real-time agent event notifications.

* **Event Logs API** – Retrieve logs of agent events for auditing and debugging.

* **Guardrails API** – Define and control rules (guardrails) to constrain agent behavior.

Below, you'll find guidance on authenticating with the SDK and detailed documentation for each API, including method descriptions, parameters, return values, and usage examples in both TypeScript and JavaScript.

## **Authentication and Configuration**

Before using any API, you must configure the SDK with your credentials. The SDK uses a **Configuration** object to handle authentication (API key) and connection settings (such as the base API URL).

**How to set up the Configuration:**

* **API Key**: Obtain an API key for the agent management service. This key authenticates your requests.

* **Base Path (API URL)**: The base URL endpoint for the API (e.g., `https://api.example.com`). This may be provided by the service; if not specified, the SDK uses a default.

Typically, you'll create a single `Configuration` instance and reuse it for all API classes.

**Example (TypeScript):**

```
import { Configuration, QueryApi, WebhooksApi, EventLogsApi, GuardrailsApi } from 'agents-sdk';  // Import SDK classes

// Initialize configuration with your API credentials
const config = new Configuration({
  apiKey: 'YOUR_API_KEY',                      // replace with your actual API key
  basePath: 'https://api.example.com'          // replace with the service base URL, if needed
});

// Now use this configuration to create API clients
const queryApi = new QueryApi(config);
const webhooksApi = new WebhooksApi(config);
const eventLogsApi = new EventLogsApi(config);
const guardrailsApi = new GuardrailsApi(config);
```

**Example (JavaScript):**

```javascript
const { Configuration, QueryApi, WebhooksApi, EventLogsApi, GuardrailsApi } = require('agents-sdk');

// Initialize configuration with API key and base URL
const config = new Configuration({
  apiKey: 'YOUR_API_KEY',
  basePath: 'https://api.example.com'
});

// Create API client instances using the configuration
const queryApi = new QueryApi(config);
const webhooksApi = new WebhooksApi(config);
const eventLogsApi = new EventLogsApi(config);
const guardrailsApi = new GuardrailsApi(config);
```

In the examples above, we configured the SDK with an API key and base path, then instantiated the specific API clients. Once configured, you can call the methods of the Query, Webhooks, Event Logs, and Guardrails APIs as shown in the sections below.

---

## **Query API**

The Query API allows your application to send a query or question to an agent and receive the agent’s response. Use this API to interact with the agent’s knowledge base or conversational logic in real time. For example, you might use `queryAgent()` to get an answer from a customer support bot or an AI assistant.

### **`queryAgent(agentId, query, [userId])`**

Send a query (question or message) to a specified agent and get a response. This is the primary method to interact with an agent.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent to query.

* `query` *(string)* – The question or message you want to send to the agent.

* `userId` *(string, optional)* – An optional identifier for the end-user who is asking the question. Providing a userId can help associate the query with a user (useful for personalization or logging).

**What it does:** Sends the query text to the agent identified by `agentId`. The agent processes the query (using its underlying AI model or knowledge base) and formulates a response.

**Returns:** A **Promise** that resolves to a `QueryResponse` object containing the agent’s answer and related metadata. The `QueryResponse` typically includes:

* `answer` *(string)* – The agent’s answer or message in response to the query.

* `queryId` *(string)* – An identifier for the query interaction (useful for logs or follow-up).

* *Additional fields* – e.g., `confidence` score, `timestamp`, etc., depending on the implementation.

**Example (TypeScript):**

```
import { QueryApi, Configuration } from 'agents-sdk';

const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const queryApi = new QueryApi(config);

// Example: Query an agent for information about the weather
const agentId: string = 'agent-12345';
const question: string = 'What is the weather forecast for today?';

async function askAgent() {
  try {
    const response = await queryApi.queryAgent(agentId, question);
    console.log('Agent answer:', response.answer);
    // e.g., "Agent answer: The forecast today is sunny with a high of 25°C."
  } catch (error) {
    console.error('Query failed:', error);
  }
}

askAgent();
```

**Example (JavaScript):**

```javascript
const { QueryApi, Configuration } = require('agents-sdk');

const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const queryApi = new QueryApi(config);

// Example: Query an agent (e.g., customer support bot) for store hours
const agentId = 'agent-12345';
const question = 'What time does the store open on weekends?';

queryApi.queryAgent(agentId, question)
  .then(response => {
    console.log('Agent response:', response.answer);
    // e.g., "Agent response: Our store opens at 9 AM on Saturdays and 10 AM on Sundays."
  })
  .catch(error => {
    console.error('Error querying agent:', error);
  });
```

In these examples, we send a text query to an agent and log the returned answer. The `queryAgent` method handles the request/response cycle with the agent, abstracting away the HTTP calls. You can use this method in day-to-day scenarios such as getting answers to user questions or performing tasks via the agent.

---

## **Webhooks API**

The Webhooks API lets you manage webhook endpoints for receiving real-time notifications about agent events. Webhooks are useful for asynchronous workflows – for instance, if you want your application to be notified whenever an agent finishes processing a query, encounters an error, or triggers a guardrail. Using the Webhooks API, you can create and configure these callbacks without continuously polling for events.

**Common agent events you might subscribe to via webhooks include:**

* Agent completed a query and produced a response.

* A guardrail was triggered (e.g., agent blocked certain content).

* An error or exception occurred during agent processing.

The following methods are available in the Webhooks API to manage your webhook subscriptions.

### **`listWebhooks()`**

Retrieve all webhook configurations registered in your account (or for a specific agent, if applicable). Use this to see what webhooks are currently set up.

**Parameters:** *None.* (The SDK uses the configured credentials to determine the scope, e.g., all webhooks for your account or project.)

**Returns:** A **Promise** resolving to an array of **Webhook** objects. Each Webhook object typically contains:

* `id` *(string)* – Unique identifier for the webhook.

* `url` *(string)* – The callback URL where events are sent.

* `events` *(string\[\])* – List of event types this webhook is subscribed to (e.g., `["AgentResponse", "GuardrailTriggered"]`).

* `active` *(boolean)* – Whether the webhook is currently active (enabled to receive events).

* `description` *(string)* – Optional description of the webhook.

* `createdAt` *(Date or string)* – Timestamp when the webhook was created.

**Example (TypeScript):**

```
import { WebhooksApi, Configuration } from 'agents-sdk';
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const webhooksApi = new WebhooksApi(config);

async function showWebhooks() {
  try {
    const webhooks = await webhooksApi.listWebhooks();
    console.log(`You have ${webhooks.length} webhooks configured.`);
    for (const webhook of webhooks) {
      console.log(`- ID: ${webhook.id}, URL: ${webhook.url}, Events: ${webhook.events.join(", ")}`);
    }
  } catch (err) {
    console.error('Failed to list webhooks:', err);
  }
}

showWebhooks();
```

**Example (JavaScript):**

```javascript
const { WebhooksApi, Configuration } = require('agents-sdk');
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const webhooksApi = new WebhooksApi(config);

webhooksApi.listWebhooks()
  .then(webhooks => {
    console.log(`Found ${webhooks.length} webhooks:`);
    webhooks.forEach(wh => {
      console.log(`Webhook ${wh.id} -> URL: ${wh.url}, Events: ${wh.events.join(", ")}`);
    });
  })
  .catch(error => {
    console.error('Error fetching webhooks:', error);
  });
```

### **`getWebhook(webhookId)`**

Fetch the configuration details of a single webhook by its ID. Use this to inspect a specific webhook’s settings.

**Parameters:**

* `webhookId` *(string)* – The unique identifier of the webhook you want to retrieve.

**Returns:** A **Promise** that resolves to a **Webhook** object (see the fields described in `listWebhooks`). If the `webhookId` is not found, the promise may reject with an error (e.g., not found).

**Example (TypeScript):**

```
const webhookId: string = 'wh_abc123';  // Example webhook ID

webhooksApi.getWebhook(webhookId)
  .then(webhook => {
    console.log('Webhook details:');
    console.log('ID:', webhook.id);
    console.log('URL:', webhook.url);
    console.log('Events subscribed:', webhook.events);
    console.log('Active:', webhook.active);
  })
  .catch(err => {
    console.error(`Could not get webhook ${webhookId}:`, err);
  });
```

**Example (JavaScript):**

```javascript
const webhookId = 'wh_abc123';  // Replace with your actual webhook ID

webhooksApi.getWebhook(webhookId)
  .then(webhook => {
    console.log('Webhook Info:', webhook);
    // You can access webhook.id, webhook.url, webhook.events, etc.
  })
  .catch(error => {
    console.error('Failed to retrieve webhook:', error);
  });
```

### **`createWebhook(url, events, [options])`**

Register a new webhook. This will set up a callback to the specified URL for the given event types. For example, you might create a webhook to call your service whenever the agent responds to a query.

**Parameters:**

* `url` *(string)* – The endpoint (HTTP URL) that should receive the webhook POST requests when events occur. This should be an endpoint under your control.

* `events` *(string\[\])* – An array of event type identifiers that this webhook will subscribe to. Only events in this list will trigger a call to the `url`. (For example: `["AgentResponse", "GuardrailTriggered"]`.)

* `options` *(object, optional)* – Additional optional settings for the webhook:

  * `description` *(string)* – A human-readable description of the webhook’s purpose (for your own record-keeping).

  * `secret` *(string)* – A secret token used to sign webhook requests (for verifying the authenticity of incoming webhooks in your server).

  * `active` *(boolean)* – Whether the webhook should be active immediately. Defaults to **true** (active). You can set this to false to create the webhook in a disabled state.

**What it does:** Creates a new webhook subscription on the server. After creation, any future events of the specified types will result in an HTTP POST request to the given URL with details of the event.

**Returns:** A **Promise** resolving to the created **Webhook** object, including its assigned `id` and all the settings (url, events, etc.). You can store the `id` to reference this webhook later for updates or deletion.

**Example (TypeScript):**

```
// Create a webhook to be notified when an agent responds or a guardrail triggers
const callbackUrl: string = 'https://myapp.com/agent-events';
const subscribeEvents: string[] = ['AgentResponse', 'GuardrailTriggered'];

async function setupWebhook() {
  try {
    const newWebhook = await webhooksApi.createWebhook(callbackUrl, subscribeEvents, {
      description: 'Notify my app of agent responses and guardrail events',
      secret: 'my-webhook-secret'  // a secret for verifying webhook payloads
    });
    console.log('Webhook created with ID:', newWebhook.id);
    console.log('Subscribed events:', newWebhook.events);
  } catch (err) {
    console.error('Error creating webhook:', err);
  }
}

setupWebhook();
```

**Example (JavaScript):**

```javascript
const callbackUrl = 'https://myapp.com/agent-events';
const events = ['AgentResponse', 'GuardrailTriggered'];
const options = {
  description: 'Receive notifications of agent responses and guardrail triggers',
  secret: 'my-webhook-secret'
};

webhooksApi.createWebhook(callbackUrl, events, options)
  .then(newWebhook => {
    console.log('Created webhook ID:', newWebhook.id);
    console.log('Webhook is listening for events:', newWebhook.events.join(', '));
  })
  .catch(error => {
    console.error('Failed to create webhook:', error);
  });
```

In the above example, we created a webhook so that our application (at `myapp.com`) will be notified whenever the agent sends a response or a guardrail is triggered. The `secret` will be used to sign the payload for security. The returned webhook object contains the new `id` which we log for reference.

### **`updateWebhook(webhookId, updates)`**

Modify an existing webhook’s configuration. Use this to change the URL, events, or other settings of a webhook you previously created.

**Parameters:**

* `webhookId` *(string)* – The unique ID of the webhook you want to update.

* `updates` *(object)* – An object specifying the fields to update. You can include one or more of the following:

  * `url` *(string)* – New callback URL if you want to send events to a different endpoint.

  * `events` *(string\[\])* – New list of event types to subscribe to (replacing the old list).

  * `description` *(string)* – Updated description.

  * `secret` *(string)* – New secret for signing webhooks.

  * `active` *(boolean)* – Set to **true** or **false** to enable/disable the webhook.

**What it does:** Sends the updated settings to the server for the specified webhook. Only the fields provided in the `updates` object will be changed; other fields remain as before.

**Returns:** A **Promise** resolving to the updated **Webhook** object reflecting the changes. (In some implementations, this might return a status success with no content; but in this SDK assume it returns the new Webhook data for convenience.)

**Example (TypeScript):**

```
const webhookId: string = 'wh_abc123';  // ID of the webhook we want to update

async function changeWebhookUrl() {
  try {
    const updatedWebhook = await webhooksApi.updateWebhook(webhookId, {
      url: 'https://myapp.com/new-endpoint',  // update the URL
      events: ['AgentResponse']              // now only subscribe to agent responses
    });
    console.log('Webhook updated. New URL:', updatedWebhook.url);
    console.log('New subscribed events:', updatedWebhook.events);
  } catch (err) {
    console.error(`Failed to update webhook ${webhookId}:`, err);
  }
}

changeWebhookUrl();
```

**Example (JavaScript):**

```javascript
const webhookId = 'wh_abc123';

// We'll update the webhook to deactivate it (stop receiving events temporarily)
webhooksApi.updateWebhook(webhookId, { active: false, description: 'Temporarily disabled' })
  .then(updatedWebhook => {
    console.log(`Webhook ${webhookId} is now active?`, updatedWebhook.active);
    console.log('Updated description:', updatedWebhook.description);
  })
  .catch(error => {
    console.error('Webhook update failed:', error);
  });
```

In these examples, we demonstrated two types of updates: changing the endpoint URL and events list (TypeScript example), and deactivating the webhook (JavaScript example). After the update, the returned webhook object confirms the new settings.

### **`deleteWebhook(webhookId)`**

Remove a webhook subscription. Call this to stop receiving events at a particular webhook endpoint and delete its configuration.

**Parameters:**

* `webhookId` *(string)* – The unique identifier of the webhook to delete.

**What it does:** Permanently deletes the specified webhook from the server. After deletion, no more events will be sent to that webhook’s URL.

**Returns:** A **Promise** that resolves when the deletion is successful. (The promise may resolve to an empty object or success message. If the webhook does not exist or deletion fails, the promise will reject with an error.)

**Example (TypeScript):**

```
const webhookId: string = 'wh_abc123';

webhooksApi.deleteWebhook(webhookId)
  .then(() => {
    console.log(`Webhook ${webhookId} deleted successfully.`);
  })
  .catch(err => {
    console.error('Error deleting webhook:', err);
  });
```

**Example (JavaScript):**

```javascript
const webhookId = 'wh_abc123';

webhooksApi.deleteWebhook(webhookId)
  .then(() => {
    console.log('Webhook deleted:', webhookId);
  })
  .catch(error => {
    console.error('Failed to delete webhook:', error);
  });
```

---

## **Event Logs API**

The Event Logs API provides access to historical logs of agent activity and events. This is useful for debugging, auditing user interactions, or analytics. For instance, you can retrieve logs of all queries handled by an agent, including what the queries were, when they occurred, what the responses were, and whether any guardrails were triggered or errors occurred.

Using this API, you might build an admin dashboard showing recent conversations with an agent, or analyze the frequency of certain events.

### **`listEventLogs(agentId, [filterOptions])`**

Retrieve a list of event log entries for a given agent. You can optionally filter or limit the results.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent whose event logs you want to retrieve.

* `filterOptions` *(object, optional)* – An optional object to filter or limit the logs. You can include:

  * `eventType` *(string)* – Only return logs of this type (e.g., `"AgentResponse"`, `"GuardrailTriggered"`, `"Error"`).

  * `fromDate` *(string | Date)* – Only return events that occurred on or after this date/time.

  * `toDate` *(string | Date)* – Only return events that occurred on or before this date/time.

  * `limit` *(number)* – Maximum number of log entries to return (useful for pagination or fetching recent N events).

**What it does:** Queries the agent’s event log history and retrieves entries matching the filter. If no filterOptions are provided, it returns recent log events by default (the number may be capped by the system).

**Returns:** A **Promise** that resolves to an array of **EventLog** objects. Each EventLog entry typically includes:

* `id` *(string)* – Unique log entry ID.

* `timestamp` *(string)* – When the event occurred (ISO date string).

* `eventType` *(string)* – Type of event (e.g., `"AgentQuery"`, `"AgentResponse"`, `"GuardrailTriggered"`, `"Error"`).

* `details` *(object)* – Additional details specific to the event type. For example, for an AgentResponse event, details might include the query asked and the answer given; for a GuardrailTriggered event, details might include which rule was tripped; for an Error, details could include an error message or stack trace.

* `userId` *(string, optional)* – If the event is tied to a specific end-user (for example, a query from a user), their identifier if provided.

**Example (TypeScript):**

```
import { EventLogsApi, Configuration } from 'agents-sdk';
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const eventLogsApi = new EventLogsApi(config);

const agentId: string = 'agent-12345';

async function fetchRecentErrors() {
  try {
    // Fetch up to 50 error events from the past week for the agent
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const logs = await eventLogsApi.listEventLogs(agentId, { eventType: 'Error', fromDate: oneWeekAgo, limit: 50 });
    console.log(`Retrieved ${logs.length} error events in the past week:`);
    for (const log of logs) {
      console.log(`[${log.timestamp}] ${log.eventType} - ${log.details.message || log.details}`); 
      // If log.details has a message field (for errors), print it
    }
  } catch (err) {
    console.error('Failed to list event logs:', err);
  }
}

fetchRecentErrors();
```

**Example (JavaScript):**

```javascript
const { EventLogsApi, Configuration } = require('agents-sdk');
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const eventLogsApi = new EventLogsApi(config);

const agentId = 'agent-12345';

// Example: Fetch all guardrail-triggered events for an agent in a date range
const startDate = '2025-03-01T00:00:00Z';  // ISO date string for March 1, 2025
const endDate = '2025-03-25T23:59:59Z';    // ISO date string for March 25, 2025 (inclusive)

eventLogsApi.listEventLogs(agentId, { eventType: 'GuardrailTriggered', fromDate: startDate, toDate: endDate })
  .then(logs => {
    console.log(`Guardrail events from March 1 to 25, 2025: ${logs.length} events`);
    if (logs.length > 0) {
      const firstLog = logs[0];
      console.log('First event type:', firstLog.eventType);
      console.log('Occurred at:', firstLog.timestamp);
      console.log('Details:', firstLog.details);
    }
  })
  .catch(error => {
    console.error('Error retrieving event logs:', error);
  });
```

In the TypeScript example above, we fetched the last week’s error events for the agent and printed out their timestamps and messages. In the JavaScript example, we retrieved all guardrail-triggered events in a specific date range and displayed information about the first event. You can adjust the filter options as needed (or omit them to get a broad set of logs).

### **`getEventLog(agentId, eventId)`**

Get the details of a specific event log entry by its ID. Use this to retrieve full information for a particular event, for example after getting its ID from `listEventLogs`.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent whose log you want to retrieve. (For context consistency, provide the agentId associated with the event.)

* `eventId` *(string)* – The unique ID of the event log entry you want to fetch.

**What it does:** Looks up a specific event in the agent’s log by ID and returns its details.

**Returns:** A **Promise** resolving to an **EventLog** object representing the event. The structure is the same as described in `listEventLogs` (eventType, timestamp, details, etc.), providing the full record of that event.

**Example (TypeScript):**

```
const agentId: string = 'agent-12345';
const eventId: string = 'log_7890';  // example event log ID

eventLogsApi.getEventLog(agentId, eventId)
  .then(eventLog => {
    console.log('Event Log Details:');
    console.log('Type:', eventLog.eventType);
    console.log('Time:', eventLog.timestamp);
    console.log('Details:', eventLog.details);
  })
  .catch(err => {
    console.error(`Failed to get event ${eventId}:`, err);
  });
```

**Example (JavaScript):**

```javascript
const agentId = 'agent-12345';
const eventId = 'log_7890';  // replace with a real event log ID

eventLogsApi.getEventLog(agentId, eventId)
  .then(log => {
    console.log(`Event ${eventId}:`, log);
    // For example, log.eventType, log.timestamp, log.details, etc. can be accessed
  })
  .catch(error => {
    console.error('Error fetching event log:', error);
  });
```

This method is typically used after you have obtained an event ID from `listEventLogs` or perhaps from a webhook payload, and you want to get the full context of that event. The examples show how to fetch and print the details of one specific log entry.

---

## **Guardrails API**

The Guardrails API allows you to define and manage **guardrails** for your agents. Guardrails are rules or constraints that help ensure the agent behaves within acceptable boundaries. They can filter out disallowed content, prevent certain kinds of requests or responses, or enforce policy guidelines.

For example, you might set up guardrails to **block profanity or sensitive information** in user queries (input guardrails), or to **prevent the agent from giving certain types of answers** (output guardrails). By using the Guardrails API, you can create such rules, list existing rules, update them, or delete them as needed.

Each guardrail is generally defined by some conditions (what to check for in the input/output) and an action (what to do when the condition is met, such as block the response or flag it). Guardrails are usually applied at runtime for each agent query or response.

**Note:** The exact structure of guardrail rules may vary. In this SDK, guardrails are managed per agent – you specify which agent’s guardrails you are working with in each call.

### **`listGuardrails(agentId)`**

List all guardrail rules configured for a given agent. Use this to see what guardrails are currently active for the agent.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent whose guardrails you want to retrieve.

**Returns:** A **Promise** resolving to an array of **Guardrail** objects. Each Guardrail object might include:

* `id` *(string)* – Unique identifier of the guardrail.

* `name` *(string)* – A short name or label for the guardrail rule.

* `description` *(string)* – A description of what the guardrail does (if provided).

* `conditions` *(object)* – The condition(s) that will trigger this guardrail. This could be defined in various ways (e.g., a list of forbidden words, a regex pattern, a ML model for content detection, etc.).

* `action` *(string)* – The action taken when the guardrail triggers, e.g., `"block"` (prevent the response or input), `"flag"` (mark it but still allow), or `"replace"` (modify the content).

* `active` *(boolean)* – Whether the guardrail is currently active/enabled.

* `createdAt` *(Date/string)* – Timestamp when the guardrail was created.

* `updatedAt` *(Date/string)* – Timestamp of the last update to the guardrail.

**Example (TypeScript):**

```
import { GuardrailsApi, Configuration } from 'agents-sdk';
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const guardrailsApi = new GuardrailsApi(config);

const agentId: string = 'agent-12345';

async function showGuardrails() {
  try {
    const guardrails = await guardrailsApi.listGuardrails(agentId);
    console.log(`Guardrails configured for agent ${agentId}:`);
    guardrails.forEach(gr => {
      console.log(`- [${gr.id}] ${gr.name} (active: ${gr.active})`);
    });
  } catch (err) {
    console.error('Could not list guardrails:', err);
  }
}

showGuardrails();
```

**Example (JavaScript):**

```javascript
const { GuardrailsApi, Configuration } = require('agents-sdk');
const config = new Configuration({ apiKey: 'YOUR_API_KEY', basePath: 'https://api.example.com' });
const guardrailsApi = new GuardrailsApi(config);

const agentId = 'agent-12345';

guardrailsApi.listGuardrails(agentId)
  .then(rules => {
    console.log(`Found ${rules.length} guardrails for agent ${agentId}.`);
    for (const rule of rules) {
      console.log(`Guardrail "${rule.name}" is ${rule.active ? 'enabled' : 'disabled'}.`);
    }
  })
  .catch(error => {
    console.error('Error retrieving guardrails:', error);
  });
```

The examples above retrieve all guardrails for a specific agent and log each guardrail’s name and whether it’s active. This helps in understanding what safety measures are currently in place for the agent.

### **`createGuardrail(agentId, guardrailConfig)`**

Create a new guardrail rule for an agent. Use this to add a safety rule that the agent should follow.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent for which to create the guardrail.

* `guardrailConfig` *(object)* – An object defining the guardrail’s settings. This includes:

  * `name` *(string)* – A name for the guardrail (for reference).

  * `description` *(string, optional)* – A longer description of what the guardrail checks or why it's in place.

  * `conditions` *(object)* – Definition of the condition that triggers the guardrail. For example, this might specify a set of banned words, a regex pattern, or a reference to a predefined policy. *(The exact structure depends on the system’s rule language.)*

  * `action` *(string)* – What action to take when the condition is met. Common values could be `"block"` (block the input/output and possibly return an error or safe response), `"flag"` (mark it in logs and allow execution to continue), or `"notify"` (send an alert).

  * `active` *(boolean, optional)* – Whether the guardrail is active immediately upon creation. Defaults to **true**.

**What it does:** Sends the guardrail configuration to the server to be added to the agent. Once created and active, the agent will enforce this guardrail on relevant interactions (inputs or outputs) going forward.

**Returns:** A **Promise** resolving to the created **Guardrail** object, including its assigned `id` and all the details as stored. This confirms the guardrail was successfully added.

**Example (TypeScript):**

```
const agentId: string = 'agent-12345';

// Define a guardrail to block messages containing certain banned words
const newGuardrailConfig = {
  name: 'No Profanity',
  description: 'Block responses if they contain profanity.',
  conditions: {
    bannedWords: ['foo', 'bar', 'baz']  // example condition: banned words list
  },
  action: 'block'
};

async function addGuardrail() {
  try {
    const guardrail = await guardrailsApi.createGuardrail(agentId, newGuardrailConfig);
    console.log('Created guardrail:', guardrail.id);
    console.log('Name:', guardrail.name);
    console.log('Active status:', guardrail.active);
  } catch (err) {
    console.error('Failed to create guardrail:', err);
  }
}

addGuardrail();
```

**Example (JavaScript):**

```javascript
const agentId = 'agent-12345';

// Create a guardrail that flags any answer longer than 1000 characters
const guardrailConfig = {
  name: 'Response Length Check',
  description: 'Flag extremely long responses for review.',
  conditions: { maxOutputLength: 1000 },  // hypothetical condition
  action: 'flag'
};

guardrailsApi.createGuardrail(agentId, guardrailConfig)
  .then(newGuardrail => {
    console.log('New guardrail created with ID:', newGuardrail.id);
    console.log(`Guardrail "${newGuardrail.name}" is now ${newGuardrail.active ? 'active' : 'inactive'}.`);
  })
  .catch(error => {
    console.error('Error creating guardrail:', error);
  });
```

In the TypeScript example, we added a guardrail to block profanity by listing banned words. In the JavaScript example, we added a guardrail to flag overly long responses. The returned objects include the unique IDs and the active status of the new guardrails. These guardrails will start applying to the agent’s interactions immediately (since we did not set `active: false`).

### **`getGuardrail(agentId, guardrailId)`**

Retrieve details of a specific guardrail rule by its ID. Use this to inspect a guardrail’s configuration (conditions and action).

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent that the guardrail belongs to.

* `guardrailId` *(string)* – The unique identifier of the guardrail you want to fetch.

**Returns:** A **Promise** resolving to a **Guardrail** object with the guardrail’s details (`id`, `name`, `description`, `conditions`, `action`, `active`, etc.). If the guardrail is not found (for that agent), the promise will reject with an error.

**Example (TypeScript):**

```
const agentId: string = 'agent-12345';
const guardrailId: string = 'gr_4567';  // example guardrail ID

guardrailsApi.getGuardrail(agentId, guardrailId)
  .then(rule => {
    console.log('Guardrail Info:');
    console.log('Name:', rule.name);
    console.log('Active:', rule.active);
    console.log('Conditions:', JSON.stringify(rule.conditions));
    console.log('Action:', rule.action);
  })
  .catch(err => {
    console.error(`Could not retrieve guardrail ${guardrailId}:`, err);
  });
```

**Example (JavaScript):**

```javascript
const agentId = 'agent-12345';
const guardrailId = 'gr_4567';  // replace with a real guardrail ID

guardrailsApi.getGuardrail(agentId, guardrailId)
  .then(guardrail => {
    console.log(`Guardrail ${guardrailId} details:`, guardrail);
    // For example, guardrail.name, guardrail.conditions, guardrail.action, etc.
  })
  .catch(error => {
    console.error('Failed to get guardrail:', error);
  });
```

This will output the details of the specified guardrail, allowing you to verify what rules are in place. For instance, you might check what words are banned or what action is defined.

### **`updateGuardrail(agentId, guardrailId, updates)`**

Update an existing guardrail’s configuration. Use this to change a guardrail’s conditions, action, name, or activation status.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent that the guardrail belongs to.

* `guardrailId` *(string)* – The ID of the guardrail to update.

* `updates` *(object)* – An object specifying which fields to update and their new values. You can include:

  * `name` *(string)* – A new name for the guardrail.

  * `description` *(string)* – An updated description.

  * `conditions` *(object)* – Updated conditions for triggering the guardrail (for example, modify the list of banned words, change a threshold, etc.).

  * `action` *(string)* – Change the action (e.g., switch from `"flag"` to `"block"`).

  * `active` *(boolean)* – Enable or disable the guardrail.

**What it does:** Submits the changes to the server for the specified guardrail. Only the provided fields are changed; any fields not included in `updates` remain as they were.

**Returns:** A **Promise** resolving to the updated **Guardrail** object reflecting the new settings.

**Example (TypeScript):**

```
const agentId: string = 'agent-12345';
const guardrailId: string = 'gr_4567';

async function disableGuardrail() {
  try {
    const updated = await guardrailsApi.updateGuardrail(agentId, guardrailId, { 
      active: false,
      description: 'Temporarily disabled this guardrail'
    });
    console.log(`Guardrail ${updated.id} is now active?`, updated.active);
  } catch (err) {
    console.error('Error updating guardrail:', err);
  }
}

disableGuardrail();
```

**Example (JavaScript):**

```javascript
const agentId = 'agent-12345';
const guardrailId = 'gr_4567';

// Example: Add a new word to the banned words list of a guardrail
guardrailsApi.getGuardrail(agentId, guardrailId)
  .then(rule => {
    if (rule.conditions.bannedWords) {
      // Append a new word to bannedWords list
      const newConditions = { ...rule.conditions };
      newConditions.bannedWords.push('qux');
      return guardrailsApi.updateGuardrail(agentId, guardrailId, { conditions: newConditions });
    } else {
      console.log('Guardrail has no bannedWords condition to update.');
    }
  })
  .then(updatedRule => {
    if (updatedRule) {
      console.log('Updated guardrail conditions:', updatedRule.conditions);
    }
  })
  .catch(error => {
    console.error('Failed to update guardrail:', error);
  });
```

In the TypeScript example, we disabled a guardrail (perhaps for maintenance or testing) and updated its description to note it’s disabled. In the JavaScript example, we first fetched a guardrail, then updated its conditions by adding a new banned word (demonstrating how you might modify a nested condition structure). The updated guardrail object returned lets us verify the changes.

### **`deleteGuardrail(agentId, guardrailId)`**

Delete a guardrail from an agent. This permanently removes the rule, so the agent will no longer enforce it.

**Parameters:**

* `agentId` *(string)* – The unique identifier of the agent from which to remove the guardrail.

* `guardrailId` *(string)* – The unique identifier of the guardrail to delete.

**What it does:** Removes the guardrail rule from the agent’s configuration on the server.

**Returns:** A **Promise** that resolves when the deletion is successful. It may resolve to some confirmation object or simply be empty upon success. If the guardrail does not exist or cannot be deleted, the promise will reject with an error.

**Example (TypeScript):**

```
const agentId: string = 'agent-12345';
const guardrailId: string = 'gr_4567';

guardrailsApi.deleteGuardrail(agentId, guardrailId)
  .then(() => {
    console.log(`Guardrail ${guardrailId} deleted successfully.`);
  })
  .catch(err => {
    console.error('Error deleting guardrail:', err);
  });
```

**Example (JavaScript):**

```javascript
const agentId = 'agent-12345';
const guardrailId = 'gr_4567';

guardrailsApi.deleteGuardrail(agentId, guardrailId)
  .then(() => {
    console.log('Deleted guardrail:', guardrailId);
  })
  .catch(error => {
    console.error('Failed to delete guardrail:', error);
  });
```

After calling this, the specified guardrail will no longer be in effect. If you need to enforce that rule again in the future, you would have to create a new guardrail.

---

**Conclusion:** Using the above APIs (Query, Webhooks, Event Logs, and Guardrails), you can fully manage your agents programmatically. Always ensure you initialize the SDK with the correct configuration (API key and base path) before calling these methods. The examples provided illustrate common day-to-day usage scenarios in both TypeScript and JavaScript, which you can adapt to your application’s needs. By combining these APIs, you can query agents for information, get notified of important events in real time, review past interactions, and enforce important rules to guide agent behavior. Happy coding with the Agent Management SDK\!

