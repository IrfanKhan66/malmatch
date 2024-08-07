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

export const ACCEPT_ENCODING_HEADER = "gzip, deflate, br";
export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36";
export const ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";
export const XREQUESTED_HEADER = "XMLHttpRequest";
