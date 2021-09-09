import BenzAMRRecorder from 'benz-amr-recorder'
import clsx from 'clsx'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
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
import Contact from '../models/Contact'
import Voicemail from '../models/Voicemail'
import { ContactEntries } from '../repositories/ContactRepository'
import VoicemailRepository from '../repositories/VoicemailRepository'
import { filehash } from '../utils/file'
import Avatar from './Avatar'
import Button from './Button'
import LoadingIndicator from './icons/LoadingIndicator'
import Modal from './Modal'
import RadialProgress from './RadialProgress'
import Tooltip from './Tooltip'

let amr: BenzAMRRecorder

const Voicemails = forwardRef<HTMLButtonElement>(({}, ref) => {
  const { sql, backupFolder } = useContext<IBackupContext>(BackupContext)
  const contacts = useContext<ContactEntries | null>(ContactsContext)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [voicemails, setVoicemails] = useState<Voicemail[]>([])
  const [currentVoicemail, setCurrentVoicemail] = useState<string | undefined>()
  const [currentVoicemailProgress, setCurrentVoicemailProgress] = useState<
    number | undefined
  >()
  const [loadingPage, setLoadingPage] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [end, setEnd] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)
  const loader = useRef<HTMLButtonElement>(null)

  const load = async () => {
    if (!sql || !backupFolder || !contacts) return
    setLoadingPage(true)
    const db = await DatabaseFactory.create(sql, backupFolder, 'Voicemails')
    const newVoicemails = await new VoicemailRepository(db, contacts).getAll(
      page
    )
    if (!newVoicemails.length) {
      setEnd(true)
      return
    }
    setVoicemails((currentVoicemails) => [
      ...currentVoicemails,
      ...newVoicemails,
    ])
    setLoadingPage(false)
  }

  const open = async () => {
    setLoading(true)
    await load()
    setIsOpen(true)
    setLoading(false)
  }

  const getFile = async (id: string) => {
    const location = filehash(`Library/Voicemail/${id}.amr`)
    const dirHandle = await backupFolder?.getDirectoryHandle(
      location.slice(0, 2)
    )
    const fileHandle = await dirHandle?.getFileHandle(location)

    return await fileHandle?.getFile()
  }

  const play = async (id: string) => {
    if (amr) amr.stop()

    const file = await getFile(id)

    amr = new BenzAMRRecorder()

    if (file) {
      setCurrentVoicemail(id)

      await amr.initWithBlob(file)

      amr.play()
      amr.onEnded(() => setCurrentVoicemail(undefined))
    }
  }

  const stop = () => {
    amr.stop()
  }

  const download = async (id: string, datetime: string, name: string) => {
    const file = await getFile(id)

    if (amr) amr.stop()

    amr = new BenzAMRRecorder()

    if (file) {
      await amr.initWithBlob(file)

      const link = document.createElement('a')

      link.href = window.URL.createObjectURL(amr.getBlob())
      link.download = `${dayjs(datetime).format('YYYYMMDDHHmmss')}_${name
        .toLowerCase()
        .split(' ')
        .join('_')}.amr`

      document.body.appendChild(link)

      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      )

      document.body.removeChild(link)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!amr?.getDuration() || !amr?.getCurrentPosition()) return

      setCurrentVoicemailProgress(
        (amr.getCurrentPosition() / amr.getDuration()) * 100
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Load next page of voicemails when user scrolls to loader
  useEffect(() => {
    if (!container.current) return
    const handleObserver = (entries: IntersectionObserverEntry[]) =>
      entries[0].isIntersecting && setPage((page) => page + 1)
    const observer = new IntersectionObserver(handleObserver, {
      root: container.current,
      rootMargin: '128px',
      threshold: 1,
    })
    loader.current && observer.observe(loader.current)
  }, [container.current])

  // Load voicemails when page changes
  useEffect(() => {
    const loadVoicemails = async () => {
      if (!isOpen) return
      await load()
    }
    loadVoicemails()
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

        <span className="flex-1 mx-4 text-center">Voicemails</span>

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
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        )}
      </Button>

      <Modal
        actions={
          <Button
            offsetClass="focus:ring-offset-gray-800"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        }
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Voicemails"
      >
        {voicemails.length > 0 && (
          <div className="w-full">
            <div
              id="voicemailsContainer"
              ref={container}
              className="mt-3 overflow-y-auto sm:-ml-6 max-h-48 shadow-scroll overscroll-contain"
            >
              {voicemails.map((voicemail) => (
                <div key={uniqueId('voicemail')}>
                  <div className="flex items-center justify-between w-full px-6 py-2 space-x-3 overflow-hidden text-left group">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center flex-shrink-0 -space-x-6">
                        <Avatar contact={voicemail.contact} disableTooltip />
                      </div>

                      <div>
                        <span className="block font-semibold">
                          {voicemail.contact instanceof Contact
                            ? voicemail.contact.getFullName()
                            : voicemail.contact}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Tooltip
                            content={
                              voicemail.getDuration('m') !== '0'
                                ? voicemail.getDuration(
                                    'm [minutes], s [seconds]'
                                  )
                                : voicemail.getDuration('s [seconds]')
                            }
                            placement="right"
                          >
                            <time>{voicemail.getDuration()}</time>
                          </Tooltip>
                          <span>&middot;</span>
                          <Tooltip
                            content={voicemail.datetime}
                            placement="right"
                          >
                            <span>{dayjs(voicemail.datetime).fromNow()}</span>
                          </Tooltip>
                          {voicemail.trashed && (
                            <>
                              <span>&middot;</span>
                              <Tooltip
                                content="This voicemail was deleted"
                                placement="right"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center flex-shrink-0 space-x-2">
                      {currentVoicemail && currentVoicemail === voicemail.id ? (
                        <button
                          className="flex items-center justify-center w-10 h-10 transition-colors duration-200 ease-in-out bg-gray-800 rounded-full select-none hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800"
                          onClick={() => stop()}
                        >
                          <RadialProgress
                            className="absolute"
                            color="text-green-500"
                            radius={24}
                            stroke={2}
                            progress={currentVoicemailProgress || 0}
                          />

                          <svg
                            className="w-5 h-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="flex items-center justify-center w-10 h-10 transition-colors duration-200 ease-in-out bg-gray-800 rounded-full select-none hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800"
                          onClick={() => play(voicemail.id)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}

                      <button
                        className="flex items-center justify-center w-10 h-10 transition-colors duration-200 ease-in-out bg-gray-800 rounded-full select-none hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800"
                        onClick={() =>
                          download(
                            voicemail.id,
                            voicemail.datetime,
                            voicemail.contact instanceof Contact
                              ? voicemail.contact.getFullName()
                              : voicemail.contact
                          )
                        }
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
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
                  End of Voicemails
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
})

Voicemails.displayName = 'Voicemails'

export default Voicemails
