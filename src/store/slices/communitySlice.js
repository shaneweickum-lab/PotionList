import { supabase, isSupabaseConfigured } from '../../lib/supabase.js'

// ── Shared inventory helpers ─────────────────────────────────────────────────

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

// ── Slice ────────────────────────────────────────────────────────────────────

export function createCommunitySlice(set, get) {
  return {
    // ── Item Requests ──────────────────────────────────────────────────────
    itemRequests: [],
    requestsLoading: false,

    fetchItemRequests: async () => {
      if (!isSupabaseConfigured) return
      set({ requestsLoading: true })
      try {
        const { data, error } = await supabase
          .from('item_requests')
          .select('*')
          .eq('is_fulfilled', false)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(60)
        if (error) throw error
        set({ itemRequests: data ?? [], requestsLoading: false })
      } catch {
        set({ requestsLoading: false })
      }
    },

    // Post a request: escrows gold until fulfilled or cancelled
    postRequest: async ({ itemType, itemId, qty, priceEach }) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const state = get()
      if (!state.userId) return { error: 'Sign in to post requests' }
      const totalGold = qty * priceEach
      if ((state.gold ?? 0) < totalGold) return { error: 'Not enough gold' }

      state.spendGold(totalGold)

      const expiresAt = new Date(Date.now() + 7 * 86400 * 1000).toISOString()
      const { data, error } = await supabase
        .from('item_requests')
        .insert({
          user_id: state.userId,
          username: state.username ?? 'Alchemist',
          item_type: itemType,
          item_id: itemId,
          qty,
          price_each: priceEach,
          escrowed_gold: totalGold,
          is_fulfilled: false,
          expires_at: expiresAt,
        })
        .select()
        .single()

      if (error) {
        get().addGold(totalGold)
        return { error: error.message }
      }

      set(s => ({ itemRequests: [data, ...s.itemRequests] }))
      return { success: true }
    },

    // Fulfill someone else's request: provide items, receive escrowed gold
    fulfillRequest: async (requestId) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const state = get()
      if (!state.userId) return { error: 'Sign in to fulfill requests' }
      const req = state.itemRequests.find(r => r.id === requestId)
      if (!req) return { error: 'Request not found' }
      if (req.user_id === state.userId) return { error: 'Cannot fulfill your own request' }

      if (!deductItem(set, get, req.item_type, req.item_id, req.qty)) {
        return { error: `Need ${req.qty}× ${req.item_id}` }
      }

      const { data, error } = await supabase
        .from('item_requests')
        .update({
          is_fulfilled: true,
          fulfilled_by: state.userId,
          fulfilled_by_username: state.username ?? 'Alchemist',
          fulfilled_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .eq('is_fulfilled', false)
        .select()
        .single()

      if (error || !data) {
        addItem(set, get, req.item_type, req.item_id, req.qty)
        return { error: 'Request already fulfilled' }
      }

      get().addGold(req.escrowed_gold)
      set(s => ({ itemRequests: s.itemRequests.filter(r => r.id !== requestId) }))
      return { success: true, goldEarned: req.escrowed_gold }
    },

    // Cancel own request: recover escrowed gold
    cancelRequest: async (requestId) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const state = get()
      const req = state.itemRequests.find(r => r.id === requestId)
      if (!req || req.user_id !== state.userId) return { error: 'Not your request' }

      const { error } = await supabase
        .from('item_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', state.userId)

      if (error) return { error: error.message }

      get().addGold(req.escrowed_gold)
      set(s => ({ itemRequests: s.itemRequests.filter(r => r.id !== requestId) }))
      return { success: true }
    },

    // ── Community Orders ───────────────────────────────────────────────────
    // { [poolId]: totalQtyContributed } for the current week
    communityOrderProgress: {},
    communityLoading: false,

    fetchCommunityOrderProgress: async (weekString) => {
      if (!isSupabaseConfigured) return
      set({ communityLoading: true })
      try {
        const { data, error } = await supabase
          .from('community_contributions')
          .select('order_pool_id, qty')
          .eq('week_string', weekString)
        if (error) throw error
        const progress = {}
        for (const row of data ?? []) {
          progress[row.order_pool_id] = (progress[row.order_pool_id] ?? 0) + row.qty
        }
        set({ communityOrderProgress: progress, communityLoading: false })
      } catch {
        set({ communityLoading: false })
      }
    },

    // Contribute items; receive immediate proportional reward
    contributeToOrder: async ({ poolId, qty, weekString, order }) => {
      if (!isSupabaseConfigured) return { error: 'Not configured' }
      const state = get()
      if (!state.userId) return { error: 'Sign in to contribute' }
      if (qty < 1) return { error: 'Quantity must be at least 1' }

      if (!deductItem(set, get, order.itemType, order.itemId, qty)) {
        return { error: `Need ${qty}× ${order.itemId}` }
      }

      const { error } = await supabase
        .from('community_contributions')
        .insert({
          order_pool_id: poolId,
          week_string: weekString,
          user_id: state.userId,
          username: state.username ?? 'Alchemist',
          qty,
        })

      if (error) {
        addItem(set, get, order.itemType, order.itemId, qty)
        return { error: error.message }
      }

      // Proportional reward (capped so late contributors don't over-earn)
      const currentProgress = state.communityOrderProgress[poolId] ?? 0
      const effectiveQty = Math.min(qty, Math.max(0, order.totalQty - currentProgress))
      const fraction = effectiveQty / order.totalQty
      const goldReward = Math.floor(fraction * order.rewardGold)
      const xpReward   = Math.floor(fraction * order.rewardXP)
      if (goldReward > 0) get().addGold(goldReward)
      if (xpReward   > 0) get().awardXP(xpReward)

      set(s => ({
        communityOrderProgress: {
          ...s.communityOrderProgress,
          [poolId]: (s.communityOrderProgress[poolId] ?? 0) + qty,
        },
      }))

      return { success: true, goldReward, xpReward }
    },
  }
}
