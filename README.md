# MalMap

An API that takes in a MyAnimeList ID of an anime and returns the same anime's details from various anime streaming sites like Zoro.to, Bilibili, Animefox, Animepahe, Gogoanime, and more.

## Table of Contents

- [Introduction](#introduction)

- [Features](#features)

- [Installation](#installation)

- [Usage](#usage)

- [Contributing](#contributing)

- [License](#license)

## Introduction

This API allows you to fetch anime details from multiple streaming sites using the MyAnimeList (MAL) ID. It returns the most similar anime titles from different sites with information like id, image, url.

## Features

- Fetch anime details from multiple streaming sites.
- Easy-to-use API endpoint.
- Matches titles with jaro winkler.
- High performance with Bun.js, Hono and sqlite.

## Installation

#### 1. Clone the repository

```bash
 git clone https://github.com/IrfanKhan66/malmap.git
 cd malmap
```

#### 2. Install dependencies

```bash
 bun install
```

#### 3. Setup enviroment variables

```env
 MAL_API_ENDPOINT="https://api.myanimelist.net/v2"
 MAL_ID="<Your MAL client ID>"
 MAL_SECRET="<Your MAL client secret>"
 MAL_ACCESS_TOKEN="<Your MAL access token>"
 MAL_REFRESH_TOKEN="<Your MAL refresh token>"
 REFRESH_TOKEN_ENDPOINT="https://myanimelist.net/v1/oauth2/token"
```

#### 4. Run the server

```bash
 bun run start
```

## Usage

### Request

##### Send a GET request to the API endpoint with the MyAnimeList ID.

```curl
 curl -X GET "http://localhost:3000/anime/:malId"
```

### Response

##### The API will return a JSON response with the anime details from the specified streaming sites.

```json
 {
  "malId": 12345,
  "status": 200,
  "title": "Anime Title",
  "sites": {
    "Zoro": {...},
    "Bilibili": {...},
    "Animefox": {...},
    "Animepahe": {...},
    "Gogoanime": {...}
  }
}
```

## API Endpoints

### Get Anime Details

- **URL**: `/anime/:malId`
- **Method**: `GET`
- **URL Params**:
  - `malId` - The MyAnimeList ID of the anime.
- **Sucess Response**:
  - **status** - 200
  - **malId** - The MyAnimeList ID for the anime.
  - **data** - JSON Object containing various sites.
- **Error Response**:
  - **status** - 400/500
  - **malId** - The MyAnimeList ID for the anime.
  - **data** - "Failed to get MAL data !"

## Contributing

Contributions are welcome! Please open an issue or submit a pull request following the steps :

1. Fork this repository.
2. Clone the forked repository to your local machine.
3. Create your development branch like :
   - feature - `git checkout -b feat(<provider/file name>)/your-feature`.
   - fix - `git checkout -b fix/your-fix`.
   - refactor - `git checkout -b refactor/refactored-code`.
   - chore - `git checkout -b chore/your-chore`.
4. Add your changes - `git add <your-changes>`.
5. Commit your changes - `git commit -m '<Your changes/features>'`.
6. Push to the branch - `git push origin <your-branch-name>`.
7. Open a pull request.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License. [License](https://github.com/IrfanKhan66/malmap/blob/main/LICENSE)
