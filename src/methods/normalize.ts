const t = (title: ITitle) => {
  const availableTitle =
    title.english || title.romaji || title.userPreferred || title.native;
  return availableTitle!.toLowerCase();
};

export default t;
