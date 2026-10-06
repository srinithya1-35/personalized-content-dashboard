import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@/services/storageService';

const FEED_ORDER_STORAGE_KEY = 'aura_feed_order';

interface FeedOrderState {
  customOrderIds: string[];
}

const initialState: FeedOrderState = {
  customOrderIds: storageService.getItem<string[]>(FEED_ORDER_STORAGE_KEY, []),
};

export const feedOrderSlice = createSlice({
  name: 'feedOrder',
  initialState,
  reducers: {
    setFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.customOrderIds = action.payload;
      storageService.setItem(FEED_ORDER_STORAGE_KEY, state.customOrderIds);
    },
    resetFeedOrder: (state) => {
      state.customOrderIds = [];
      storageService.setItem(FEED_ORDER_STORAGE_KEY, []);
    },
  },
});

export const { setFeedOrder, resetFeedOrder } = feedOrderSlice.actions;
export default feedOrderSlice.reducer;
