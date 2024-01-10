import { type UseBoundStore, type StoreApi, create } from "zustand";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  User,
  UserListState,
  getAllUsers,
  userListInitialState,
} from "../models/user";
import { UserList } from "../components/UserList";

/**
 * Higher-order function to create a context provider and a custom hook for a given Zustand store.
 *
 * @param createStore - A factory function that creates a new Zustand store.
 * @returns A tuple containing the context provider and the custom hook.
 */
export function createStoreContext<TState>(
  createStore: () => UseBoundStore<StoreApi<TState>>
) {
  /**
   * React context created to provide the Zustand store to components.
   * This context will hold the Zustand store created by `createStore`.
   */
  const StoreContext = createContext<UseBoundStore<StoreApi<TState>>>(
    createStore()
  );

  /**
   * React component that provides the Zustand store to its children components.
   * It uses the `createStore` function to create a store instance and provides it via `StoreContext`.
   */
  const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [useStore] = useState(createStore);
    return (
      <StoreContext.Provider value={useStore}>{children}</StoreContext.Provider>
    );
  };

  /**
   * Custom hook that provides access to the Zustand store within components.
   * It uses `useContext` to access the store from `RowStoreContext` and returns the hook returned by the Zustand store.
   */
  const useStore = () => {
    const useStore = useContext(StoreContext);
    return useStore();
  };

  return [StoreProvider, useStore] as const;
}

type State = UserListState & {
  fetchAllUsers: () => Promise<void>;
  selectUser: (user: User) => void;
};

const createUserListStore = () =>
  create<State>((set, _) => ({
    ...userListInitialState,
    fetchAllUsers: async () => {
      set({ status: "loading" });

      try {
        const users = await getAllUsers();
        set({ status: "success", users });
      } catch (error) {
        set({ status: "error", error: error as Error });
      }
    },
    selectUser: (user) => {
      set({ selectedUser: user });
    },
  }));

const [UserListProvider, useUserListStore] =
  createStoreContext(createUserListStore);

export function UserListPage() {
  const state = useUserListStore();

  return (
    <main className="max-w-screen-md py-4 mx-auto">
      <h1 className="mb-4 text-xl text-gray-600">Users List with Zustand</h1>

      <UserList
        state={state}
        onFetchUsers={state.fetchAllUsers}
        onSelectUser={state.selectUser}
      />
    </main>
  );
}

export function UserListZustandPage() {
  return (
    <UserListProvider>
      <UserListPage />
    </UserListProvider>
  );
}
