import { supabase, isSupabaseConfigured } from '../../lib/supabase.js'

export function createMarketSlice(set, get) {
  return {
    marketListings: [],
    marketLoading: false,
    marketError: null,

    fetchMarketListings: async () => {
      if (!isSupabaseConfigured) return
      set({ marketLoading: true, marketError: null })
      try {
        const { data, error } = await supabase
          .from('market_listings')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('listed_at', { ascending: false })
          .limit(100)
        if (error) throw error
        set({ marketListings: data ?? [], marketLoading: false })
      } catch (err) {
        set({ marketError: err.message, marketLoading: false })
      }
    },

    listItem: async ({ itemType, itemId, qty, price }) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const userId = get().userId
      if (!userId) return { error: 'Not logged in' }

      if (!deductItem(set, get, itemType, itemId, qty)) return { error: 'Not enough items' }

      const { data, error } = await supabase
        .from('market_listings')
        .insert({ user_id: userId, username: get().username ?? 'Alchemist', item_type: itemType, item_id: itemId, qty, price })
        .select()
        .single()

      if (error) {
        addItem(set, get, itemType, itemId, qty)
        return { error: error.message }
      }

      set(state => ({ marketListings: [data, ...state.marketListings] }))
      return { success: true, listing: data }
    },

    buyListing: async (listingId) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const state = get()
      const listing = state.marketListings.find(l => l.id === listingId)
      if (!listing) return { error: 'Listing not found' }
      if ((state.gold ?? 0) < listing.price) return { error: 'Not enough gold' }

      const { data, error } = await supabase
        .from('market_listings')
        .delete()
        .eq('id', listingId)
        .select()
        .single()

      if (error || !data) return { error: 'Listing already sold' }

      get().spendGold(listing.price)
      addItem(set, get, listing.item_type, listing.item_id, listing.qty)
      set(state => ({ marketListings: state.marketListings.filter(l => l.id !== listingId) }))
      return { success: true }
    },

    cancelListing: async (listingId) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const listing = get().marketListings.find(l => l.id === listingId)
      if (!listing) return { error: 'Not found' }

      const { error } = await supabase.from('market_listings').delete().eq('id', listingId)
      if (error) return { error: error.message }

      addItem(set, get, listing.item_type, listing.item_id, listing.qty)
      set(state => ({ marketListings: state.marketListings.filter(l => l.id !== listingId) }))
      return { success: true }
    },
  }
}

function invKey(itemType) {
  if (itemType === 'potion')   return 'potionInventory'
  if (itemType === 'ore')      return 'oreInventory'
  if (itemType === 'ingot')    return 'ingotInventory'
  if (itemType === 'seed')     return 'seeds'
  return 'inventory' // herb, mushroom
}

function deductItem(set, get, itemType, itemId, qty) {
  const key = invKey(itemType)
  const inv = get()[key] ?? {}
  if ((inv[itemId] ?? 0) < qty) return false
  set(state => ({ [key]: { ...(state[key] ?? {}), [itemId]: (state[key]?.[itemId] ?? 0) - qty } }))
  return true
}

function addItem(set, get, itemType, itemId, qty) {
  const key = invKey(itemType)
  set(state => ({ [key]: { ...(state[key] ?? {}), [itemId]: (state[key]?.[itemId] ?? 0) + qty } }))
}
