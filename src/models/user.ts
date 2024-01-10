export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
}

export type UserListState = {
  status: "idle" | "loading" | "success" | "error";
  users: User[];
  selectedUser?: User;
  error?: Error;
};

export const userListInitialState: UserListState = {
  status: "idle",
  users: [],
};
