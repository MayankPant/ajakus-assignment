export const fetchMoreUsers = async (
  page,
  setUsers,
  setPage,
  setHasMore,
  setError,
  USERS_PER_PAGE
) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Failed to fetch more users");
    const data = await response.json();

    const nextPage = page + 1;
    const start = (nextPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    const newUsers = data.slice(start, end);

    if (newUsers.length > 0) {
      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setPage(nextPage);
      setHasMore(end < data.length);
    } else {
      setHasMore(false);
    }
  } catch (err) {
    setError(err.message);
  }
};
