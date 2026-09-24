export const sortByNewest = (orders) =>
  [...orders].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
