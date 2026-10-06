import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/services/types';
import { storageService } from '@/services/storageService';

const USER_STORAGE_KEY = 'aura_user_profile';

const DEFAULT_USER: UserProfile = {
  id: 'usr-108',
  name: 'Aurelia Song',
  handle: '@aurelia.studio',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  bio: 'Ceramicist, ambient audio curator & creative technologist based in Kyoto 🌸',
  joinedDate: 'October 2025',
  isLoggedIn: true,
};

interface UserState {
  profile: UserProfile;
  isProfileModalOpen: boolean;
}

const initialState: UserState = {
  profile: storageService.getItem<UserProfile>(USER_STORAGE_KEY, DEFAULT_USER),
  isProfileModalOpen: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      storageService.setItem(USER_STORAGE_KEY, state.profile);
    },
    toggleLogin: (state) => {
      state.profile.isLoggedIn = !state.profile.isLoggedIn;
      storageService.setItem(USER_STORAGE_KEY, state.profile);
    },
    setProfileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProfileModalOpen = action.payload;
    },
  },
});

export const { updateProfile, toggleLogin, setProfileModalOpen } = userSlice.actions;
export default userSlice.reducer;
