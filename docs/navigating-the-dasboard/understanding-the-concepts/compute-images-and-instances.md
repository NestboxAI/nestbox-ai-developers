---
title: Compute, Images and Instances
sidebar_position: 2
---

# Compute, Images and Instances

Nestbox provides a flexible and powerful compute system that allows you to deploy and manage AI models, vector databases, and other services as instances based on predefined machine images. This section explains how compute resources are organized and how to create and manage them.

## Machine Images

A **Machine Image** is a pre-configured blueprint that defines a software environment you can deploy as a running instance.
Each image includes everything needed to launch a functional service, such as:

-   AI models (e.g., language models, coding assistants, retrieval-augmented generation agents)
-   Databases (e.g., vector databases like ChromaDB)
-   Specialized agents (e.g., LlamaIndex for data parsing)

## Runtime Instances

A **Runtime Instance** is a running, active deployment created from a machine image. Instances allow you to use the functionality defined in an image — whether that means interacting with a model, querying a database, or providing services to your AI agents.

Each instance is isolated within your project, ensuring that your operations are secure and scoped properly. Instances can later be stopped, restarted, updated, or deleted as your needs evolve.

## The Compute Tab

The **Compute tab** in the Nestbox dashboard brings these elements together:

-   Under **Machine Images**, you can browse all available blueprints ready to deploy.
-   Under **Runtime Instances**, you can manage all the services currently running in your project.

This setup provides a simple but powerful way to extend your AI workflows by dynamically adding specialized models, tools, and infrastructure — all from within the Nestbox ecosystem.
