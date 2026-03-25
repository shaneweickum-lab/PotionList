import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/index.js'
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import { isSupabaseConfigured } from '../../lib/supabase.js'
import styles from './GuildTab.module.css'

// ── Add Friend Modal ──────────────────────────────────────────────────────────

function AddFriendModal({ onClose }) {
  const [handleInput, setHandleInput] = useState('')
  const [searchResult, setSearchResult] = useState(null) // { profile } or { error }
  const [searching, setSearching] = useState(false)
  const [sending, setSending] = useState(false)
  const { searchByHandle, sendFriendRequest } = useStore()

  const handleSearch = async () => {
    const clean = handleInput.trim().replace(/^@/, '')
    if (!clean) return
    setSearching(true)
    setSearchResult(null)
    const result = await searchByHandle(clean)
    setSearchResult(result)
    setSearching(false)
  }

  const handleAdd = async () => {
    if (!searchResult?.profile) return
    setSending(true)
    const result = await sendFriendRequest(searchResult.profile.user_id)
    setSending(false)
    if (result.error) showToast(result.error, 'error')
    else {
      showToast(`Friend request sent to @${searchResult.profile.handle}!`, 'success')
      onClose()
    }
  }

  return (
    <Modal title="Find an Alchemist" onClose={onClose}>
      <div className={styles.addFriendForm}>
        <p className={styles.formNote}>
          Enter a player's handle to find and add them as a friend.
        </p>
        <div className={styles.searchRow}>
          <span className={styles.atSign}>@</span>
          <input
            className={styles.handleInput}
            type="text"
            placeholder="handle"
            value={handleInput}
            onChange={e => setHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          <Button variant="ghost" size="sm" disabled={!handleInput.trim() || searching} onClick={handleSearch}>
            {searching ? '…' : 'Search'}
          </Button>
        </div>

        {searchResult?.error && (
          <p className={styles.searchError}>{searchResult.error}</p>
        )}

        {searchResult?.profile && (
          <div className={styles.searchFound}>
            <div className={styles.foundAvatar}>⚗️</div>
            <div className={styles.foundInfo}>
              <span className={styles.foundUsername}>{searchResult.profile.username}</span>
              <span className={styles.foundHandle}>@{searchResult.profile.handle}</span>
            </div>
            <Button variant="gold" size="sm" disabled={sending} onClick={handleAdd}>
              {sending ? '…' : 'Add Friend'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── Conversation View ─────────────────────────────────────────────────────────

function ConversationView({ partner, onBack }) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const {
    userId, conversations, messagesLoading,
    fetchConversation, sendMessage,
  } = useStore()

  const messages = conversations[partner.partner_id] ?? []

  useEffect(() => {
    fetchConversation(partner.partner_id)
  }, [partner.partner_id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async () => {
    if (!draft.trim() || sending) return
    setSending(true)
    const result = await sendMessage(partner.partner_id, draft)
    setSending(false)
    if (result.error) showToast(result.error, 'error')
    else setDraft('')
  }

  return (
    <div className={styles.convoView}>
      <div className={styles.convoHeader}>
        <button className={styles.backBtn} onClick={onBack}>←</button>
        <div className={styles.convoPartner}>
          <span className={styles.convoName}>{partner.profile.username}</span>
          <span className={styles.convoHandle}>@{partner.profile.handle}</span>
        </div>
      </div>

      <div className={styles.messageList}>
        {messagesLoading && <p className={styles.loading}>Loading…</p>}
        {!messagesLoading && messages.length === 0 && (
          <p className={styles.emptyMessages}>No messages yet. Say hello!</p>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.bubble} ${msg.sender_id === userId ? styles.bubbleSent : styles.bubbleReceived}`}
          >
            <span className={styles.bubbleText}>{msg.content}</span>
            <span className={styles.bubbleTime}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.composeRow}>
        <input
          className={styles.composeInput}
          type="text"
          placeholder="Send a message…"
          value={draft}
          maxLength={500}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <Button variant="gold" size="sm" disabled={!draft.trim() || sending} onClick={handleSend}>
          {sending ? '…' : 'Send'}
        </Button>
      </div>
    </div>
  )
}

// ── Friends List ──────────────────────────────────────────────────────────────

function FriendsSection({ onOpenConversation }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const {
    userId, friends, friendRequests, guildLoading,
    fetchFriends, acceptFriendRequest, removeFriend, unreadCounts,
    fetchUnreadCounts,
  } = useStore()

  useEffect(() => {
    if (userId && isSupabaseConfigured) {
      fetchFriends()
      fetchUnreadCounts()
    }
  }, [userId])

  const handleAccept = async (req) => {
    const result = await acceptFriendRequest(req.id)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Now friends with ${req.profile.username}!`, 'success')
  }

  const handleRemove = async (entry) => {
    const result = await removeFriend(entry.id)
    if (result.error) showToast(result.error, 'error')
  }

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.section}>
        <p className={styles.notice}>The Guild requires Supabase configuration to connect with other players.</p>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className={styles.section}>
        <p className={styles.notice}>Sign in to connect with other alchemists.</p>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <div className={styles.toolbar}>
        <p className={styles.lore}>Your circle of fellow alchemists. Find friends by their handle.</p>
        <Button variant="gold" size="sm" onClick={() => setShowAddModal(true)}>
          + Add Friend
        </Button>
      </div>

      {guildLoading && <p className={styles.loading}>Loading…</p>}

      {/* Pending incoming requests */}
      {friendRequests.length > 0 && (
        <div className={styles.requestsBlock}>
          <h3 className={styles.blockTitle}>Friend Requests</h3>
          {friendRequests.map(req => (
            <div key={req.id} className={styles.friendCard}>
              <div className={styles.friendAvatar}>⚗️</div>
              <div className={styles.friendInfo}>
                <span className={styles.friendName}>{req.profile.username}</span>
                <span className={styles.friendHandle}>@{req.profile.handle}</span>
              </div>
              <div className={styles.friendActions}>
                <Button variant="gold" size="sm" onClick={() => handleAccept(req)}>Accept</Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(req)}>Decline</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends list */}
      <div className={styles.friendsBlock}>
        {friends.length === 0 && !guildLoading && (
          <div className={styles.empty}>
            <p className={styles.lore}>Your guild hall is empty. Add friends by their @handle.</p>
          </div>
        )}
        {friends.map(f => {
          const unread = unreadCounts[f.partner_id] ?? 0
          return (
            <div key={f.id} className={styles.friendCard}>
              <div className={styles.friendAvatar}>⚗️</div>
              <div className={styles.friendInfo}>
                <span className={styles.friendName}>{f.profile.username}</span>
                <span className={styles.friendHandle}>@{f.profile.handle}</span>
              </div>
              <div className={styles.friendActions}>
                <button
                  className={styles.msgBtn}
                  onClick={() => onOpenConversation(f)}
                >
                  {unread > 0 ? (
                    <span className={styles.msgBadge}>{unread > 9 ? '9+' : unread}</span>
                  ) : '✉'}
                </button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(f)}>Remove</Button>
              </div>
            </div>
          )
        })}
      </div>

      {showAddModal && <AddFriendModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}

// ── Main Guild Tab ────────────────────────────────────────────────────────────

export default function GuildTab() {
  const [openConvo, setOpenConvo] = useState(null) // friend entry or null

  if (openConvo) {
    return <ConversationView partner={openConvo} onBack={() => setOpenConvo(null)} />
  }

  return <FriendsSection onOpenConversation={setOpenConvo} />
}
