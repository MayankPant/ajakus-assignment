export function search(searchTerm, users) {
  if (searchTerm in ["", undefined, null]) return users;

  const parsed = searchTerm.toLowerCase();

  return users.filter((user) => {
    return (
      user.firstname?.toLowerCase().includes(parsed) ||
      user.lastname?.toLowerCase().includes(parsed) ||
      user.email?.toLowerCase().includes(parsed) ||
      user.department?.toLowerCase().includes(parsed)
    );
  });
}
