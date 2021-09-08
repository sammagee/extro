import clsx from 'clsx'
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import BackupContext, { IBackupContext } from '../contexts/BackupContext'
import ContactsContext from '../contexts/ContactsContext'
import DatabaseFactory from '../db/DatabaseFactory'
import Conversation from '../models/Conversation'
import ConversationRepository from '../repositories/ConversationRepository'
import { downloadHtml } from '../utils/html'
import Button from './Button'
import LoadingIndicator from './LoadingIndicator'
import Messages from './Messages'
import Modal from './Modal'

const Conversations = forwardRef<HTMLButtonElement>(({}, ref) => {
  const { sql, backupFolder } = useContext<IBackupContext>(BackupContext)
  const contacts = useContext(ContactsContext)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<
    Conversation | undefined
  >()
  const [loadingPage, setLoadingPage] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [end, setEnd] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)
  const loader = useRef<HTMLButtonElement>(null)

  const load = async () => {
    if (!sql || !backupFolder || !contacts) return
    setLoadingPage(true)
    const db = await DatabaseFactory.create(sql, backupFolder, 'SMS')
    const newConversations = await new ConversationRepository(
      db,
      contacts
    ).getAll(page)
    if (!newConversations.length) {
      setEnd(true)
      return
    }
    setConversations((currentConversations) => [
      ...currentConversations,
      ...newConversations,
    ])
    setLoadingPage(false)
  }

  const open = async () => {
    setLoading(true)
    await load()
    setIsOpen(true)
    setLoading(false)
  }

  const downloadMessages = async () => {
    if (!selectedConversation) return
    downloadHtml(`Conversation_${selectedConversation.name}`, 'messages')
  }

  const resetMessages = () => {
    setSelectedConversation(undefined)
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  // Load next page of conversations when user scrolls to loader
  useEffect(() => {
    if (!container.current) return
    const handleObserver = (entries: IntersectionObserverEntry[]) =>
      entries[0].isIntersecting && setPage((page) => page + 1)
    const observer = new IntersectionObserver(handleObserver, {
      root: container.current,
      rootMargin: '0px',
      threshold: 1,
    })
    loader.current && observer.observe(loader.current)
  }, [container.current])

  // Load conversations when page changes
  useEffect(() => {
    const loadConversations = async () => {
      if (!isOpen) return
      await load()
    }
    loadConversations()
  }, [page])

  return (
    <>
      <Button
        ref={ref}
        className="w-full mt-6"
        disabled={loading}
        loading={loading}
        onClick={open}
      >
        <span className="flex-shrink-0 inline-block w-5" />

        <span className="flex-1 mx-4 text-center">Conversations</span>

        {loading ? (
          <LoadingIndicator color="text-green-100" />
        ) : (
          <svg
            className="flex-shrink-0 w-5 h-5 opacity-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </Button>

      <Modal
        actions={
          <>
            {selectedConversation && (
              <Button
                offsetClass="ml-3 focus:ring-offset-gray-800"
                onClick={downloadMessages}
              >
                Download Messages
              </Button>
            )}
            <Button
              offsetClass="focus:ring-offset-gray-800"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </>
        }
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Conversations"
      >
        <h3 className="text-sm font-semibold text-gray-500">
          {selectedConversation ? (
            <div className="flex items-center space-x-2">
              <button
                className="focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={resetMessages}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>

              <span>
                Conversation with{' '}
                <span className="text-gray-400">
                  {selectedConversation?.name}
                </span>
              </span>
            </div>
          ) : (
            'Choose a Conversation'
          )}
        </h3>

        {!selectedConversation && (
          <div className="w-full">
            <div
              id="conversationsContainer"
              ref={container}
              className="mt-3 overflow-y-auto max-h-48 sm:-ml-6 shadow-scroll overscroll-contain"
            >
              {conversations?.map((conversation) => (
                <div key={conversation.id}>
                  <button
                    className="flex items-center justify-between w-full px-6 py-2 space-x-3 overflow-hidden text-left transition-colors duration-200 ease-in-out rounded-xl focus:outline-none hover:bg-gray-800 focus:bg-gray-800 group"
                    onClick={() => selectConversation(conversation)}
                  >
                    <div>
                      <span className="font-semibold">{conversation.name}</span>
                      <p className="text-sm break-all line-clamp-1">
                        {conversation.text}
                      </p>
                    </div>

                    <div className="flex items-center flex-shrink-0 -space-x-6">
                      <div className="flex items-center justify-center w-12 h-12 transition-colors duration-200 ease-in-out bg-gray-700 border-4 border-gray-900 rounded-full select-none group-hover:border-gray-800 group-focus:border-gray-800">
                        {conversation.initials ? (
                          <span className="text-base font-semibold">
                            {conversation.initials}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center overflow-hidden rounded-full">
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 83 89"
                            >
                              <path d="M41.864 43.258c10.45 0 19.532-9.375 19.532-21.582C61.396 9.616 52.314.68 41.864.68c-10.449 0-19.53 9.13-19.53 21.093 0 12.11 9.032 21.485 19.53 21.485zM11.152 88.473H72.48c7.715 0 10.449-2.198 10.449-6.495 0-12.597-15.772-29.98-41.113-29.98C16.523 51.998.75 69.381.75 81.978c0 4.297 2.735 6.495 10.4 6.495z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}

              {!end ? (
                <button
                  ref={loader}
                  className={clsx(
                    'select-none flex items-center justify-center w-10 h-10 mx-auto mt-3 transition-colors duration-200 ease-in-out bg-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-gray-900 focus:ring-offset-2 focus:bg-gray-700',
                    loadingPage
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-700'
                  )}
                  disabled={loadingPage}
                  onClick={() => setPage((page) => page + 1)}
                >
                  {!loadingPage ? (
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  ) : (
                    <LoadingIndicator size="w-4 h-4" />
                  )}
                </button>
              ) : (
                <p className="py-4 mx-auto text-xs text-center text-gray-600">
                  End of Conversations
                </p>
              )}
            </div>
          </div>
        )}

        {!!selectedConversation && (
          <div className="w-full">
            <Messages conversation={selectedConversation} />
          </div>
        )}
      </Modal>
    </>
  )
})

Conversations.displayName = 'Conversations'

export default Conversations
