# Lemmy Nanny

![LemmyNannyLogo](images/LemmyNannyLogo.png)

## Overview

A powerful tool to monitor Lemmy instances using AI (Ollama local models) and add them to moderation queues.

## Tech Stack

- .Net 8.0
- 🦙 ollama
- 🧑‍💻 dotNETLemmy
- 📅 SQLite

# LemmyNanny an AI bot for the Fediverse!

Are you a moderator or admin of a Lemmy instance? Feel your userbase is getting a bit unruly? Or
maybe you just want to play with Lemmy and AI? It's up to you how to use LemmyNanny!

It can be found on [GitHub](https://github.com/IsaaacD/LemmyNanny) so you can pull it
down and start playing. It requires
and [.Net 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) to run
LemmyNanny and [Ollama](https://ollama.com/) to run the AI model.

LemmyNanny writes to SQLite database locally, so you can keep records of what's been processed
or not. LemmyNanny stores all posts and comments in a SQLite DB that ensures posts aren't
processed more than once.

LemmyNanny is a software bot to retrieve posts and comments on Lemmy instances and using local
LLM (AI) models to assist with moderation. This site
showcases it being run and allows users on Twitch to interact with content LemmyNanny is
currently triaging.

The goal would be to have each instance running their own LemmyNanny to ensure clean and safe
content around the globe! Realtime insights!
It's open source, so check it out on [GitHub - LemmyNanny](https://github.com/IsaaacD/LemmyNanny).
The source code for a sister site can be found here [GitHub - LemmyNanny Web](https://github.com/IsaaacD/LemmyNannyWeb) (which was
created as a bit of realtime window into the actions of LemmyNanny).

## Technologies Used

Built with Node.js, Express, and integrated with Ollama for local AI processing.

## Installation

```
npm install lemmy-nanny
npm start
```
