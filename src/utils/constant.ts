export const ANILIST_BASE = "https://graphql.anilist.co";

export const ANILIST_QUERY = `query($id: Int!) {
      Media(id: $id) {
    id
    title {
      romaji
      english
      native
      userPreferred
    }
  }
  }`;
