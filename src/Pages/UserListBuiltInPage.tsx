import { produce } from "immer";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";
import { match, P } from "ts-pattern";
import {
  User,
  UserListState,
  getAllUsers,
  userListInitialState as USER_LIST_INITIAL_STATE,
} from "../models/user";
import { UserList } from "../components/UserList";
import { FeatureList } from "../components/FeatureList";
import { AppTitle } from "../components/AppTitle";

// Actions
type UsersLoadingAction = {
  type: "FETCH_USERS_LOADING";
};

function usersLoading(): UsersLoadingAction {
  return {
    type: "FETCH_USERS_LOADING",
  };
}

type UsersSuccessAction = {
  type: "FETCH_USERS_SUCCESS";
  payload: {
    users: User[];
  };
};

function usersSuccess(users: User[]): UsersSuccessAction {
  return {
    type: "FETCH_USERS_SUCCESS",
    payload: {
      users,
    },
  };
}

type UsersErrorAction = {
  type: "FETCH_USERS_ERROR";
  payload: {
    error: Error;
  };
};

function usersError(error: Error): UsersErrorAction {
  return {
    type: "FETCH_USERS_ERROR",
    payload: {
      error,
    },
  };
}

type SelectUserAction = {
  type: "SELECT_USER";
  payload: {
    user: User;
  };
};

function selectUser(user: User): SelectUserAction {
  return {
    type: "SELECT_USER",
    payload: {
      user,
    },
  };
}

type UserListActions =
  | UsersLoadingAction
  | UsersSuccessAction
  | UsersErrorAction
  | SelectUserAction;

function userListReducer(
  state: UserListState,
  action: UserListActions
): UserListState {
  return match(action)
    .with({ type: "FETCH_USERS_LOADING" }, () =>
      produce(state, (draft) => {
        draft.status = "loading";
      })
    )
    .with(
      { type: "FETCH_USERS_SUCCESS", payload: { users: P.select() } },
      (users) =>
        produce(state, (draft) => {
          draft.status = "success";
          draft.users = users;
        })
    )
    .with(
      { type: "FETCH_USERS_ERROR", payload: { error: P.select() } },
      (error) =>
        produce(state, (draft) => {
          draft.status = "error";
          draft.error = error;
        })
    )
    .with({ type: "SELECT_USER", payload: { user: P.select() } }, (user) =>
      produce(state, (draft) => {
        draft.selectedUser = user;
      })
    )
    .exhaustive();
}

function useUserList() {
  const [state, dispatch] = useReducer(
    userListReducer,
    USER_LIST_INITIAL_STATE
  );

  async function fetchUsers() {
    dispatch(usersLoading());

    try {
      const users = await getAllUsers();
      dispatch(usersSuccess(users));
    } catch (error) {
      dispatch(usersError(error as Error));
    }
  }

  return { state, dispatch, fetchUsers };
}

type UserListContextType = ReturnType<typeof useUserList>;

const UserListContext = createContext<UserListContextType>({
  state: USER_LIST_INITIAL_STATE,
  dispatch: () => {},
  fetchUsers: async () => {},
});

function UserListContextProvider({ children }: PropsWithChildren) {
  const data = useUserList();

  return (
    <UserListContext.Provider value={data}>{children}</UserListContext.Provider>
  );
}

function useUserListContext() {
  return useContext(UserListContext);
}

function UserListPage() {
  const { state, fetchUsers, dispatch } = useUserListContext();

  return (
    <UserList
      state={state}
      onFetchUsers={fetchUsers}
      onSelectUser={(user) => dispatch(selectUser(user))}
    />
  );
}

export function UserListBuiltInPage() {
  return (
    <>
      <AppTitle>Built-in useReducer</AppTitle>

      <div className="grid grid-cols-2 gap-4 my-4">
        <FeatureList
          title={"Pros"}
          features={[
            "✅ Can be used in global and local state passing down props or using Context API",
            "✅ No external dependencies needed",
            "✅ No need to learn a new API",
          ]}
        />

        <FeatureList
          title={"Cons"}
          features={[
            "❌ A lot of boilerplate code: actions, action creators, reducer, context",
            "❌ High complexity to add new features",
          ]}
        />
      </div>

      <UserListContextProvider>
        <UserListPage />
      </UserListContextProvider>
    </>
  );
}
