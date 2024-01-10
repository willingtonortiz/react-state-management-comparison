import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { User, UserListState } from "../models/user";
import { UserItemList } from "./UserListItem";

export type UserListProps = {
  state: UserListState;
  onFetchUsers: () => void;
  onSelectUser: (user: User) => void;
};

// TODO: Add lucide-icons for the selected user

export function UserList({ state, onFetchUsers, onSelectUser }: UserListProps) {
  return (
    <>
      <Button onClick={onFetchUsers}>Fetch Users</Button>

      <div className="mt-4">
        {match(state)
          .with({ status: "idle" }, () => <span>No data</span>)
          .with({ status: "loading" }, () => <div>Loading...</div>)
          .with({ status: "success" }, ({ users, selectedUser }) => (
            <ul className="flex flex-col gap-4 flex-nowrap">
              {users.map((user) => (
                <UserItemList
                  key={user.id}
                  user={user}
                  onSelectUser={onSelectUser}
                  isSelected={selectedUser?.id === user.id}
                />
              ))}
            </ul>
          ))
          .with({ status: "error" }, ({ error }) => (
            <div>
              Error: <pre>{error?.message}</pre>
            </div>
          ))
          .exhaustive()}
      </div>
    </>
  );
}
