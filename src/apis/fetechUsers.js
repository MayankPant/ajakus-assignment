export async function fetchUsers(setUsers, setError, setIsLoading, setSeverity){
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            setSeverity('error');
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setSeverity('success');
        setUsers(data);
      } catch (err) {
        setSeverity('error');
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
}