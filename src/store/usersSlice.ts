import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserFormData, UsersState } from '../types/user';
import { usersApi, extractErrorMessage } from '../api/usersApi';

const initialState: UsersState = {
  items: [],
  selectedUser: null,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  page: 0,
  rowsPerPage: 5,
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await usersApi.getAll();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchUserById = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      return await usersApi.getById(id);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createUser = createAsyncThunk<User, UserFormData, { rejectValue: string }>(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await usersApi.create(userData);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; data: UserFormData },
  { rejectValue: string }
>('users/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await usersApi.update(id, data);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    clearError(state) {
      state.error = null;
    },
    clearActionError(state) {
      state.actionError = null;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при загрузке списка пользователей';
      });

    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка при загрузке данных пользователя';
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Не удалось создать пользователя';
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || 'Не удалось обновить пользователя';
      });
  },
});

export const {
  setPage,
  setRowsPerPage,
  clearError,
  clearActionError,
  clearSelectedUser,
} = usersSlice.actions;

export default usersSlice.reducer;