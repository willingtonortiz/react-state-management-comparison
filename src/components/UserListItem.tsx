import clsx from "clsx";
import { CheckCircle2 } from "lucide-react";

import { User } from "../models/user";

type UserItemProps = {
  user: User;
  onSelectUser: (user: User) => void;
  isSelected: boolean;
};

export function UserItemList({
  user,
  onSelectUser,
  isSelected,
}: UserItemProps) {
  return (
    <li>
      <button
        className={clsx(
          "w-full p-4 transition-colors border rounded-lg cursor-pointer text-gray-600 text-start hover:bg-gray-200 flex flex-nowrap justify-between"
        )}
        onClick={() => onSelectUser(user)}
      >
        {user.name} {isSelected && <CheckCircle2 className="text-green-500" />}
      </button>
    </li>
  );
}
