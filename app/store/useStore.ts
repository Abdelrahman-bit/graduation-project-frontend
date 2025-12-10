import { create } from 'zustand';
import { BearStore, User } from './types';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile } from '@/app/services/userService';

// Use the BearStore type to enforce correct state and actions
const useBearStore = create<BearStore>((set) => ({
   // --- STATE INITIALIZATION ---
   count: 0,
   user: null,
   isAuthenticated: false,
   loading: true,

   // --- ACTIONS ---
   increment: (by: number) => set((state) => ({ count: state.count + by })),
   decrement: () => set((state) => ({ count: state.count - 1 })),
   login: (userData: User) =>
      set({ user: userData, isAuthenticated: true, loading: false }),
   logout: () => {
      if (typeof window !== 'undefined') {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
      }
      set({ user: null, isAuthenticated: false, loading: false });
   },
   initializeAuth: async () => {
      if (typeof window !== 'undefined') {
         const token = localStorage.getItem('token');
         const userStr = localStorage.getItem('user');

         if (token) {
            try {
               // Verify token validity
               const decoded = jwtDecode<{ exp?: number; role?: string }>(
                  token
               );
               const currentTime = Date.now() / 1000;

               if (decoded.exp && decoded.exp > currentTime) {
                  // Token is valid
                  if (userStr && userStr !== 'undefined') {
                     // User exists in storage
                     try {
                        const user = JSON.parse(userStr);
                        set({ user, isAuthenticated: true, loading: false });
                     } catch (e) {
                        console.error(
                           'Store: Error parsing user from LS, fetching fresh profile'
                        );
                        // Fallback to fetch
                        const user = await getUserProfile();
                        localStorage.setItem('user', JSON.stringify(user));
                        set({ user, isAuthenticated: true, loading: false });
                     }
                  } else {
                     // User missing in storage, fetch it
                     // console.log('Store: Token valid but user missing, fetching profile...');
                     try {
                        const user = await getUserProfile();
                        localStorage.setItem('user', JSON.stringify(user));
                        set({ user, isAuthenticated: true, loading: false });
                     } catch (fetchError) {
                        console.error(
                           'Store: Failed to fetch user profile:',
                           fetchError
                        );
                        // If fetch fails (e.g. 401), clear everything
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        set({
                           user: null,
                           isAuthenticated: false,
                           loading: false,
                        });
                     }
                  }
               } else {
                  console.log('Store: Token expired');
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  set({ user: null, isAuthenticated: false, loading: false });
               }
            } catch (error) {
               console.error('Store: Invalid token:', error);
               localStorage.removeItem('token');
               localStorage.removeItem('user');
               set({ user: null, isAuthenticated: false, loading: false });
            }
         } else {
            // No token
            set({ user: null, isAuthenticated: false, loading: false });
         }
      } else {
         set({ loading: false });
      }
   },
}));

export default useBearStore;
