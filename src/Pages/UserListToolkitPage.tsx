import { Provider, useDispatch, useSelector } from "react-redux";
import {
  PayloadAction,
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { User, getAllUsers, userListInitialState } from "../models/user";
import { UserList } from "../components/UserList";

const fetchAllUsers = createAsyncThunk("userList/fetchAllUsers", async () =>
  getAllUsers()
);

export const userListSlice = createSlice({
  name: "userList",
  initialState: userListInitialState,
  reducers: {
    selectUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.status = "success";
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error as Error;
    });
  },
});

const { selectUser } = userListSlice.actions;

export const store = configureStore({
  reducer: {
    userList: userListSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

const useAppDispatch: () => AppDispatch = useDispatch;

function UserListPage() {
  const state = useSelector((state: RootState) => state.userList);
  const dispatch = useAppDispatch();

  return (
    <main className="max-w-screen-md py-4 mx-auto">
      <h1 className="mb-4 text-xl text-gray-600">
        Users List with Redux-Toolkit
      </h1>

      <UserList
        state={state}
        onFetchUsers={() => dispatch(fetchAllUsers())}
        onSelectUser={(user) => dispatch(selectUser(user))}
      />
    </main>
  );
}

export function UserListToolkitPage() {
  return (
    <Provider store={store}>
      <UserListPage />
    </Provider>
  );
}
