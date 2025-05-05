---
title: For Running Agents
sidebar_position: 2
---

# For Running Agents

In <SiteName/>, AI agents allow you to build custom, intelligent workflows by combining a large language model with your own business logic and prompt design. This guide covers how to create, configure, and properly run an agent, including how to test it and capture responses through webhooks.

## 1. Creating an Agent

1. Navigate to **Agents** in the dashboard.
2. Click **Add New Agent**.
3. Follow the guided creation process:
    - **Agent Name and Goal**: Enter a descriptive name and a clear goal for your agent.
    - **Select Base Model**: Choose a pre-deployed model instance that will power your agent (for example, DeepSeek, CodeLlama, or LlamaIndex).
    - **Set Parameters**: Define the **prompt parameters** that your agent will expect at runtime. At least **one parameter** must be created for the agent to function correctly. These parameters are injected into your agent’s code and control how the query input is processed.
    - **Upload Prompt Code**: Upload a **ZIP file** containing your agent's source code and logic.
    - **Review and Confirm**:  
      Review all configuration steps and complete the setup.

Once created, your agent will appear in the **Agents** list, ready for testing.

:::note
Only **ZIP uploads** are currently supported. GitHub integration will be available in the future.
:::

## 2. Running and Testing the Agent

In this section, you will learn how to run a query against your agent and view the response. To fully test an agent, you must configure a webhook — without a webhook, you will not be able to see the results of your queries.

The next steps will demonstrate how to set up a webhook, submit a test query using the Sandbox, and inspect the agent’s response.

### Setting Up a Webhook

Before sending a query, you need to configure a webhook so the agent has a destination to deliver the result:

1. Go to the **Webhooks** tab inside your agent page.
2. Click **Add Webhook**.
3. Enter a **Webhook URL**.
    - For testing purposes, we recommend using a temporary URL from [**https://webhook.site/**](https://webhook.site/).
4. Select the notifications you want to receive:
    - **Query Created**
    - **Query Completed**
    - **Query Failed**
5. Save the webhook.

:::note
Without a webhook in place, your agent's responses will not be captured or visible during testing.
:::

:::danger **Important**
The webhook event handling logic must be implemented inside your uploaded agent code if you want the agent to dynamically respond or trigger actions based on results.
:::

### Running a Query

After configuring the webhook:

1. Go to the **Sandbox** tab inside your agent.
2. Fill in the required **prompt parameters** with example values.
3. Click **Run** to submit a query.
4. Open your webhook URL (for example, your [webhook.site](https://webhook.site/) page) to inspect the incoming response.

When a query is submitted, the agent will process the input and send the output data to the webhook you have configured.

:::warning Warning
In real production environments, you would typically **send queries programmatically** and **handle responses automatically** using server-side webhook handlers.

The Sandbox and manual webhook configuration process described here is intended primarily for **testing and validation**.
:::
