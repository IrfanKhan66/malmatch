import jaro from "jaro-winkler";

const similarity = (arr: AnimeInfo[], title: string) => {
  const resp = arr.map((anime, i) => ({
    similarity: jaro(anime.title.toLowerCase(), title) * 10,
    index: i,
    title: anime.title,
  }));

  const sortedArr = resp.sort((a, b) => b.similarity - a.similarity);
  return [sortedArr[0], sortedArr[1]];
};

export default similarity;
