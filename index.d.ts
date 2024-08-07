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
  // Aniwave: DetailsFromSite[];
  Animefox: DetailsFromSite[];
  Yugenanime: DetailsFromSite[];
  Bilibili: DetailsFromSite[];
}

interface IResponse {
  status: number;
  malId: number;
  error?: string;
  data?: {
    Sites: Sites;
  };
}

interface IMalRes {
  status: number;
  data: {
    id: number;
    title: string;
    alternative_titles: {
      synonyms: string[];
      en: string;
      ja: string;
    };
    main_picture: {
      medium: string;
      large: string;
    };
  } | null;
}

interface AnimeInfo {
  id: number | string;
  title: string;
  img: string | null;
  url: string | null;
}
