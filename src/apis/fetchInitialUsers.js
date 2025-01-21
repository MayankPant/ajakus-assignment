export const fetchInitialUsers = async (
  setUsers,
  setHasMore,
  setError,
  setIsLoading,
  USERS_PER_PAGE,
  setSeverity
) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
        setSeverity('error');
            throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    setSeverity('success');
    // Simulate pagination by slicing the initial data
    setUsers(data.slice(0, USERS_PER_PAGE));
    setHasMore(data.length > USERS_PER_PAGE);
    setIsLoading(false);
  } catch (err) {
    setSeverity('error');
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
