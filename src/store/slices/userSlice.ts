import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/services/types';
import { storageService } from '@/services/storageService';

const USER_STORAGE_KEY = 'aura_user_profile';

const DEFAULT_USER: UserProfile = {
  id: 'usr-108',
  name: 'Sathyabhama',
  handle: '@sathyabhama.creative',
  avatar: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop',
  bio: 'Classical arts connoisseur, filter coffee rituals, heritage textiles & exploring timeless Indian traditions 🪔🌸',
  joinedDate: 'October 2025',
  isLoggedIn: true,
};

interface UserState {
  profile: UserProfile;
  isProfileModalOpen: boolean;
}

const getInitialProfile = (): UserProfile => {
  const stored = storageService.getItem<UserProfile>(USER_STORAGE_KEY, DEFAULT_USER);
  if (!stored || !stored.name || stored.name.toLowerCase().includes('aurelia')) {
    storageService.setItem(USER_STORAGE_KEY, DEFAULT_USER);
    return DEFAULT_USER;
  }
  return stored;
};

const initialState: UserState = {
  profile: getInitialProfile(),
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
