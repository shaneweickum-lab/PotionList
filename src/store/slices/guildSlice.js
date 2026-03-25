import { supabase, isSupabaseConfigured } from '../../lib/supabase.js'

export function createGuildSlice(set, get) {
  return {
    // ── Friends ────────────────────────────────────────────────────────────
    friends: [],           // accepted friendships: [{ id, user_id, friend_id, status, friend_profile }]
    friendRequests: [],    // incoming pending requests
    guildLoading: false,

    fetchFriends: async () => {
      if (!isSupabaseConfigured) return
      const state = get()
      if (!state.userId) return
      set({ guildLoading: true })
      try {
        // Fetch all friendship rows involving this user
        const { data: rows, error } = await supabase
          .from('friends')
          .select('*')
          .or(`user_id.eq.${state.userId},friend_id.eq.${state.userId}`)

        if (error) throw error

        // Collect all partner user IDs to fetch their profiles
        const partnerIds = [...new Set(
          (rows ?? []).map(r => r.user_id === state.userId ? r.friend_id : r.user_id)
        )]

        let profileMap = {}
        if (partnerIds.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('user_id, username, handle')
            .in('user_id', partnerIds)
          for (const p of profiles ?? []) profileMap[p.user_id] = p
        }

        const accepted = []
        const pending = []

        for (const row of rows ?? []) {
          const partnerId = row.user_id === state.userId ? row.friend_id : row.user_id
          const profile = profileMap[partnerId] ?? { username: 'Alchemist', handle: '' }
          const entry = { ...row, partner_id: partnerId, profile }

          if (row.status === 'accepted') {
            accepted.push(entry)
          } else if (row.status === 'pending' && row.friend_id === state.userId) {
            // Incoming request: we are the recipient
            pending.push(entry)
          }
        }

        set({ friends: accepted, friendRequests: pending, guildLoading: false })
      } catch {
        set({ guildLoading: false })
      }
    },

    // Search for a user by handle
    searchByHandle: async (handle) => {
      if (!isSupabaseConfigured) return { error: 'Requires Supabase configuration.' }
      const clean = handle.replace(/^@/, '').toLowerCase()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, username, handle')
        .eq('handle', clean)
        .maybeSingle()
      if (error) return { error: error.message }
      if (!data) return { error: `No user found with handle @${clean}.` }
      return { profile: data }
    },

    // Send a friend request
    sendFriendRequest: async (targetUserId) => {
      if (!isSupabaseConfigured) return { error: 'Requires Supabase configuration.' }
      const state = get()
      if (!state.userId) return { error: 'Sign in to add friends.' }
      if (targetUserId === state.userId) return { error: 'You cannot add yourself.' }

      // Check if relationship already exists
      const { data: existing } = await supabase
        .from('friends')
        .select('id, status')
        .or(
          `and(user_id.eq.${state.userId},friend_id.eq.${targetUserId}),` +
          `and(user_id.eq.${targetUserId},friend_id.eq.${state.userId})`
        )
        .maybeSingle()

      if (existing) {
        if (existing.status === 'accepted') return { error: 'Already friends.' }
        return { error: 'Friend request already sent.' }
      }

      const { error } = await supabase
        .from('friends')
        .insert({ user_id: state.userId, friend_id: targetUserId, status: 'pending' })

      if (error) return { error: error.message }
      return { success: true }
    },

    // Accept an incoming friend request
    acceptFriendRequest: async (rowId) => {
      if (!isSupabaseConfigured) return { error: 'Requires Supabase configuration.' }
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', rowId)
      if (error) return { error: error.message }
      await get().fetchFriends()
      return { success: true }
    },

    // Decline / remove a friend or request
    removeFriend: async (rowId) => {
      if (!isSupabaseConfigured) return { error: 'Requires Supabase configuration.' }
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', rowId)
      if (error) return { error: error.message }
      set(s => ({
        friends: s.friends.filter(f => f.id !== rowId),
        friendRequests: s.friendRequests.filter(r => r.id !== rowId),
      }))
      return { success: true }
    },

    // ── Messages ───────────────────────────────────────────────────────────
    // { [partnerId]: Message[] } keyed by conversation partner
    conversations: {},
    messagesLoading: false,
    activeConversation: null, // partnerId currently open

    setActiveConversation: (partnerId) => set({ activeConversation: partnerId }),

    fetchConversation: async (partnerId) => {
      if (!isSupabaseConfigured) return
      const state = get()
      if (!state.userId) return
      set({ messagesLoading: true })
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${state.userId},receiver_id.eq.${partnerId}),` +
            `and(sender_id.eq.${partnerId},receiver_id.eq.${state.userId})`
          )
          .order('created_at', { ascending: true })
          .limit(100)

        if (error) throw error

        // Mark unread messages from partner as read
        const unread = (data ?? []).filter(m => m.receiver_id === state.userId && !m.read)
        if (unread.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unread.map(m => m.id))
        }

        set(s => ({
          conversations: { ...s.conversations, [partnerId]: data ?? [] },
          messagesLoading: false,
        }))
      } catch {
        set({ messagesLoading: false })
      }
    },

    sendMessage: async (receiverId, content) => {
      if (!isSupabaseConfigured) return { error: 'Requires Supabase configuration.' }
      const state = get()
      if (!state.userId) return { error: 'Sign in to send messages.' }
      const trimmed = content.trim()
      if (!trimmed) return { error: 'Message cannot be empty.' }
      if (trimmed.length > 500) return { error: 'Message too long (max 500 characters).' }

      const { data, error } = await supabase
        .from('messages')
        .insert({ sender_id: state.userId, receiver_id: receiverId, content: trimmed })
        .select()
        .single()

      if (error) return { error: error.message }

      set(s => ({
        conversations: {
          ...s.conversations,
          [receiverId]: [...(s.conversations[receiverId] ?? []), data],
        },
      }))
      return { success: true }
    },

    // Fetch unread counts across all conversations
    unreadCounts: {},

    fetchUnreadCounts: async () => {
      if (!isSupabaseConfigured) return
      const state = get()
      if (!state.userId) return
      const { data } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', state.userId)
        .eq('read', false)

      const counts = {}
      for (const row of data ?? []) {
        counts[row.sender_id] = (counts[row.sender_id] ?? 0) + 1
      }
      set({ unreadCounts: counts })
    },
  }
}
