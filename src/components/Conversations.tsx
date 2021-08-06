import { forwardRef, useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { SqlJsStatic } from 'sql.js'
import DatabaseFactory from '@/db/DatabaseFactory'
import ConversationRepository from '@/repositories/ConversationRepository'
import { ContactEntries } from '@/repositories/ContactRepository'
import { Conversation } from '@/models/Conversation'
import { Message } from '@/models/Message'
import MessageRepository from '@/repositories/MessageRepository'
import clsx from 'clsx'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '1min',
    mm: '%dmin',
    h: '1hr',
    hh: '%dhr',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
})

type ConversationsProps = {
  backupFolder?: FileSystemDirectoryHandle
  contacts?: ContactEntries
  sql?: SqlJsStatic
}

const Conversations = forwardRef<HTMLButtonElement, ConversationsProps>(({
  backupFolder,
  contacts,
  sql
}, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false)
  const [conversations, setConversations] = useState<Conversation[] | undefined>()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesPage, setMessagesPage] = useState(0)
  const [messagesEnd, setMessagesEnd] = useState(false)
  const messagesContainer = useRef<HTMLDivElement>(null)
  const messagesLoader = useRef<HTMLButtonElement>(null)

  const load = async() => {
    if (!sql || !backupFolder || !contacts) return
    setLoading(true)
    const db = await DatabaseFactory.create(sql, backupFolder, 'SMS')
    const conversations = await (new ConversationRepository(db, contacts)).getAll()
    setConversations(conversations)
    setIsOpen(true)
    setLoading(false)
  }

  const loadMessages = async() => {
    if (!sql || !backupFolder || !contacts || !selectedConversation) return
    setLoadingMessages(true)
    const db = await DatabaseFactory.create(sql, backupFolder, 'SMS')
    const messages = await (await (new MessageRepository(db, contacts, selectedConversation)).getAll(messagesPage)).reverse()
    if (!messages.length) {
      setMessagesEnd(true)
      return
    }
    setMessages(currentMessages => [...messages, ...currentMessages])
    setLoadingMessages(false)
  }

  const downloadMessages = async() => {
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().set({
      margin: 16,
      pagebreak: {mode: 'avoid-all'},
      filename: 'Messages.pdf',
      html2canvas:  { scale: 2 },
    }).from(document.getElementById('messages')).save();
  }

  const resetMessages = () => {
    setMessagesEnd(false)
    setMessagesPage(0)
    setMessages([])
    setSelectedConversation(undefined)
  }

  const selectConversation = async(conversation: Conversation) => {
    setSelectedConversation(conversation)
    await loadMessages()
  }

  useEffect(() => {
    if (!messagesContainer.current) return
    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
    const handleObserver = (entities: any) => entities[0].isIntersecting && setMessagesPage(page => page + 1)
    const observer = new IntersectionObserver(handleObserver, {root: messagesContainer.current, rootMargin: '0px', threshold: 1})
    messagesLoader.current && observer.observe(messagesLoader.current)
  }, [messagesContainer.current]);

  useEffect(() => {
    const load = async() => {
      if (!messagesContainer.current) return
      const currentScrollHeight = messagesContainer.current.scrollHeight
      selectedConversation && await loadMessages()
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight - currentScrollHeight
    }
    load()
  }, [messagesPage])

  return (
    <>
      <Button
        ref={ref}
        disabled={loading}
        loading={loading}
        onClick={load}
      >
        <span className="flex-shrink-0 inline-block w-5" />

        <span className="flex-1 mx-4 text-center">Conversations</span>

        {loading ? (
          <svg className="flex-shrink-0 w-5 h-5 text-green-100 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="flex-shrink-0 w-5 h-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </Button>

      <Modal
        actions={(
          <>
            {messages.length > 0 && <Button offsetClass="ml-3 focus:ring-offset-gray-800" onClick={downloadMessages}>Download Messages</Button>}
            <Button offsetClass="focus:ring-offset-gray-800" variant="secondary" onClick={() => setIsOpen(false)}>Close</Button>
          </>
        )}
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Messages"
      >
        <h3 className="text-sm font-semibold text-gray-500">
          {messages.length > 0 ? (
            <div className="flex items-center space-x-2">
              <button
                className="focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={resetMessages}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>

              <span>Conversation with <span className="text-gray-400">{selectedConversation?.name}</span></span>
            </div>
          ) : 'Choose a Conversation'}
        </h3>

        {messages.length > 0 && (
          <div
            id="messagesContainer"
            ref={messagesContainer}
            className="mt-3 overflow-y-auto max-h-48 shadow-scroll overscroll-contain"
          >
            {!messagesEnd ? (
              <button
                ref={messagesLoader}
                className={clsx(
                  'select-none flex items-center justify-center w-10 h-10 mx-auto mt-3 transition-colors duration-200 ease-in-out bg-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-gray-900 focus:ring-offset-2 focus:bg-gray-700',
                  loadingMessages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700',
                )}
                disabled={loadingMessages}
                onClick={() => setMessagesPage(page => page + 1)}
              >
                {!loadingMessages ? (
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            ) : <p className="py-4 mx-auto text-xs text-center text-gray-600">End of Messages</p>}

            <div id="messages">
              {messages.map((message, index) => (
                <div
                  className={clsx(
                    'max-w-xs flex items-end',
                    message.fromMe === 1 && 'ml-auto justify-end',
                    index > 0 && message.fromMe !== messages[index - 1].fromMe ? 'mt-2' : 'mt-px',
                  )}
                  key={message.datetime + index}
                >
                  {((index < messages.length - 1 && index > 0
                      && message.fromMe === 0
                      && message.fromMe !== messages[index + 1].fromMe
                      && message.fromMe === messages[index - 1].fromMe
                    ) || ((index < messages.length - 1 && index > 0)
                      && message.fromMe === 0
                      && message.fromMe !== messages[index - 1].fromMe
                      && message.fromMe !== messages[index + 1].fromMe
                    ) || ((index === 0
                        && message.fromMe === 0
                        && message.fromMe !== messages[index + 1].fromMe)
                      ) || (index === messages.length - 1
                        && message.fromMe === 0
                        && message.fromMe !== messages[index - 1].fromMe))
                    && (
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 text-gray-400 transition-colors duration-200 ease-in-out bg-gray-700 rounded-full select-none group-hover:border-gray-800 group-focus:border-gray-800">
                      {message.initials ? (
                        <span className="text-sm font-semibold">{message.initials}</span>
                      ) : (
                        <span className="inline-flex items-center justify-center overflow-hidden rounded-full">
                          <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83 89">
                            <path d="M41.864 43.258c10.45 0 19.532-9.375 19.532-21.582C61.396 9.616 52.314.68 41.864.68c-10.449 0-19.53 9.13-19.53 21.093 0 12.11 9.032 21.485 19.53 21.485zM11.152 88.473H72.48c7.715 0 10.449-2.198 10.449-6.495 0-12.597-15.772-29.98-41.113-29.98C16.523 51.998.75 69.381.75 81.978c0 4.297 2.735 6.495 10.4 6.495z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    className={clsx(
                      !((index < messages.length - 1 && index > 0
                        && message.fromMe === 0
                        && message.fromMe !== messages[index + 1].fromMe
                        && message.fromMe === messages[index - 1].fromMe
                      ) || ((index < messages.length - 1 && index > 0)
                        && message.fromMe === 0
                        && message.fromMe !== messages[index - 1].fromMe
                        && message.fromMe !== messages[index + 1].fromMe
                      ) || ((index === 0
                          && message.fromMe === 0
                          && message.fromMe !== messages[index + 1].fromMe)
                        ) || (index === messages.length - 1
                          && message.fromMe === 0
                          && message.fromMe !== messages[index - 1].fromMe)) && 'ml-10',
                      message.fromMe === 1 && 'text-right',
                    )}
                  >
                    {((index > 0 && message.fromMe === 0 && message.fromMe !== messages[index - 1].fromMe)
                      || (index === 0 && message.fromMe === 0)) && (
                      <span className="ml-3 text-xs text-gray-400">
                        {message.name}<span className="text-gray-500">{' '} &middot; {' '}{dayjs(message.datetime).fromNow()}</span>
                      </span>
                    )}

                    {((index > 0 && message.fromMe === 1 && message.fromMe !== messages[index - 1].fromMe)
                      || (index === 0 && message.fromMe === 1)) && (
                      <span className="mr-3 text-xs text-gray-400">
                        <span className="text-gray-500">{dayjs(message.datetime).fromNow()}{' '} &middot; {' '}</span>Me
                      </span>
                    )}

                    <div
                      className={clsx(
                        'py-1 px-3 rounded-2xl max-w-max',
                        message.fromMe === 1 ? message.service === 'SMS' ? 'bg-green-500 text-green-100' : 'bg-blue-500 text-blue-100' : 'bg-gray-700 text-gray-300',
                        message.fromMe === 1 && 'ml-auto',
                      )}
                    >
                      <p className="text-left break-word">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="w-full">
            <div className="mt-3 overflow-y-auto sm:-ml-6 max-h-48 shadow-scroll overscroll-contain">
              {conversations?.map(conversation => (
                <div key={conversation.id}>
                  <button
                    className="flex items-center justify-between w-full px-6 py-2 space-x-3 text-left transition-colors duration-200 ease-in-out rounded-xl focus:outline-none hover:bg-gray-800 focus:bg-gray-800 group overflow-hidden"
                    disabled={loadingMessages}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div>
                      <span className="font-semibold">{conversation.name}</span>
                      <p className="text-sm break-all line-clamp-1">{conversation.text}</p>
                    </div>

                    <div className="flex items-center flex-shrink-0 -space-x-6">
                      <div className="flex items-center justify-center w-12 h-12 transition-colors duration-200 ease-in-out bg-gray-700 border-4 border-gray-900 rounded-full select-none group-hover:border-gray-800 group-focus:border-gray-800">
                        {conversation.initials ? (
                          <span className="text-base font-semibold">{conversation.initials}</span>
                        ) : (
                          <span className="inline-flex items-center justify-center overflow-hidden rounded-full">
                            <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83 89">
                              <path d="M41.864 43.258c10.45 0 19.532-9.375 19.532-21.582C61.396 9.616 52.314.68 41.864.68c-10.449 0-19.53 9.13-19.53 21.093 0 12.11 9.032 21.485 19.53 21.485zM11.152 88.473H72.48c7.715 0 10.449-2.198 10.449-6.495 0-12.597-15.772-29.98-41.113-29.98C16.523 51.998.75 69.381.75 81.978c0 4.297 2.735 6.495 10.4 6.495z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
})

Conversations.displayName = 'Conversations';

export default Conversations
