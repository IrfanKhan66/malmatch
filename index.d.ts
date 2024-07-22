interface DetailsFromSite {
  id: string | number;
  title: string;
  url: string | null;
  site: string;
  img: string | null;
  episodes?: number;
}

interface Sites {
  Zoro: DetailsFromSite[];
  Gogoanime: DetailsFromSite[];
  Animepahe: DetailsFromSite[];
  Aniwave: DetailsFromSite[];
  Animefox: DetailsFromSite[];
  Yugenanime: DetailsFromSite[];
  Bilibili: DetailsFromSite[];
}

interface IResponse {
  status: number;
  anilistId: number;
  malId: number;
  error?: string;
  data?: {
    Sites: Sites;
  };
}

interface ITitle {
  english: string | null;
  romaji: string | null;
  native: string | null;
  userPreferred: string | null;
}

interface IAnilistRes {
  id: number;
  title: ITitle;
}

interface AnimeInfo {
  id: number | string;
  title: string;
  img: string | null;
  url: string | null;
}
