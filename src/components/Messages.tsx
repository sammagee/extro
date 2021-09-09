import clsx from 'clsx'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import React, { useContext, useEffect, useRef, useState } from 'react'
import BackupContext, { IBackupContext } from '../contexts/BackupContext'
import ContactsContext from '../contexts/ContactsContext'
import DatabaseFactory from '../db/DatabaseFactory'
import Contact from '../models/Contact'
import Conversation from '../models/Conversation'
import Message from '../models/Message'
import { ContactEntries } from '../repositories/ContactRepository'
import MessageRepository from '../repositories/MessageRepository'
import Avatar from './Avatar'
import LoadingIndicator from './icons/LoadingIndicator'
import Tooltip from './Tooltip'

interface MessagesProps {
  conversation?: Conversation
}

const Messages = ({ conversation }: MessagesProps) => {
  const { sql, backupFolder } = useContext<IBackupContext>(BackupContext)
  const contacts = useContext<ContactEntries | null>(ContactsContext)
  const [loading, setLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingPage, setLoadingPage] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [end, setEnd] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)
  const loader = useRef<HTMLButtonElement>(null)

  const load = async () => {
    if (!sql || !backupFolder || !contacts || !conversation) return
    setLoadingPage(true)
    const db = await DatabaseFactory.create(sql, backupFolder, 'SMS')
    const messages = await (
      await new MessageRepository(db, contacts, conversation).getAll(page)
    ).reverse()
    if (!messages.length) {
      setEnd(true)
      return
    }
    setMessages((currentMessages) => [...messages, ...currentMessages])
    setLoadingPage(false)
  }

  // Load next page of messages when user scrolls to loader
  useEffect(() => {
    if (!container.current) return
    container.current.scrollTop = container.current.scrollHeight
    const handleObserver = (entities: any) =>
      entities[0].isIntersecting && setPage((page) => page + 1)
    const observer = new IntersectionObserver(handleObserver, {
      root: container.current,
      rootMargin: '128px',
      threshold: 1,
    })
    loader.current && observer.observe(loader.current)
  }, [container.current])

  // Scroll to bottom of messages container
  useEffect(() => {
    const loadMessages = async () => {
      if (!container.current || loading || !conversation) return
      const currentScrollHeight = container.current.scrollHeight
      await load()
      if (container.current)
        container.current.scrollTop =
          container.current.scrollHeight - currentScrollHeight
    }

    loadMessages()
  }, [page])

  // Reset messages if there is no conversation, load messages if there is
  useEffect(() => {
    if (!conversation) {
      setEnd(false)
      setPage(0)
      setMessages([])

      return
    }

    const loadMessages = async () => {
      setLoading(true)
      await load()
      setLoading(false)
      if (container.current)
        container.current.scrollTop = container.current.scrollHeight
    }
    loadMessages()
  }, [conversation])

  return (
    <>
      {!loading && (
        <div
          id="messagesContainer"
          ref={container}
          className="mt-3 overflow-y-auto max-h-48 shadow-scroll overscroll-contain"
        >
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
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <LoadingIndicator size="w-4 h-4" />
              )}
            </button>
          ) : (
            <p className="py-4 mx-auto text-xs text-center text-gray-600">
              End of Messages
            </p>
          )}

          <div id="messages">
            {messages.map((message, index) => (
              <div
                className={clsx(
                  'max-w-xs flex items-end',
                  message.fromMe && 'ml-auto justify-end',
                  !message.isFirst(index) &&
                    !message.isFromSameContact(messages[index - 1])
                    ? 'mt-2'
                    : 'mt-px'
                )}
                key={uniqueId('message')}
              >
                {((!message.isLast(index, messages.length) &&
                  !message.isFirst(index) &&
                  !message.fromMe &&
                  !message.isFromSameContact(messages[index + 1]) &&
                  message.isFromSameContact(messages[index - 1])) ||
                  (!message.isLast(index, messages.length) &&
                    !message.isFirst(index) &&
                    !message.fromMe &&
                    !message.isFromSameContact(messages[index - 1]) &&
                    !message.isFromSameContact(messages[index + 1])) ||
                  (message.isFirst(index) &&
                    !message.fromMe &&
                    !message.isFromSameContact(messages[index + 1])) ||
                  (message.isLast(index, messages.length) &&
                    !message.fromMe &&
                    !message.isFromSameContact(messages[index - 1]))) && (
                  <Avatar contact={message.contact} size="w-8 h-8" />
                )}

                <div
                  className={clsx(
                    !(
                      (!message.isLast(index, messages.length) &&
                        !message.isFirst(index) &&
                        !message.fromMe &&
                        !message.isFromSameContact(messages[index + 1]) &&
                        message.isFromSameContact(messages[index - 1])) ||
                      (!message.isLast(index, messages.length) &&
                        !message.isFirst(index) &&
                        !message.fromMe &&
                        !message.isFromSameContact(messages[index - 1]) &&
                        !message.isFromSameContact(messages[index + 1])) ||
                      (message.isFirst(index) &&
                        !message.fromMe &&
                        !message.isFromSameContact(messages[index + 1])) ||
                      (message.isLast(index, messages.length) &&
                        !message.fromMe &&
                        !message.isFromSameContact(messages[index - 1]))
                    )
                      ? 'ml-10'
                      : 'ml-2',
                    message.fromMe && 'text-right'
                  )}
                >
                  {((!message.isFirst(index) &&
                    !message.fromMe &&
                    !message.isFromSameContact(messages[index - 1])) ||
                    (message.isFirst(index) && !message.fromMe)) && (
                    <span className="ml-3 text-xs text-gray-400">
                      {message.contact instanceof Contact
                        ? message.contact.getFullName()
                        : message.contact}
                      <span className="text-gray-500">
                        {' '}
                        &middot;{' '}
                        <Tooltip content={message.datetime} placement="right">
                          <span>{dayjs(message.datetime).fromNow()}</span>
                        </Tooltip>
                      </span>
                    </span>
                  )}

                  {((!message.isFirst(index) &&
                    message.fromMe &&
                    !message.isFromSameContact(messages[index - 1])) ||
                    (message.isFirst(index) && message.fromMe)) && (
                    <span className="mr-3 text-xs text-gray-400">
                      <span className="text-gray-500">
                        <Tooltip content={message.datetime} placement="left">
                          <span>{dayjs(message.datetime).fromNow()}</span>
                        </Tooltip>{' '}
                        &middot;{' '}
                      </span>
                      Me
                    </span>
                  )}

                  <div
                    className={clsx(
                      'py-1 px-3 rounded-2xl max-w-max',
                      message.fromMe
                        ? message.service === 'SMS'
                          ? 'bg-green-500 text-green-100'
                          : 'bg-blue-500 text-blue-100'
                        : 'bg-gray-700 text-gray-300',
                      message.fromMe && 'ml-auto'
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

      {loading && (
        <div className="flex items-center justify-center h-48 p-12">
          <LoadingIndicator />
        </div>
      )}
    </>
  )
}

Messages.displayName = 'Messages'

export default Messages
