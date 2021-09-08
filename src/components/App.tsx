import React, { useEffect, useRef, useState } from 'react'
import { SqlJsStatic } from 'sql.js'
import BackupContext from '../contexts/BackupContext'
import ContactsContext from '../contexts/ContactsContext'
import DatabaseFactory from '../db/DatabaseFactory'
import SQL from '../db/SQL'
import ContactRepository, {
  ContactEntries,
} from '../repositories/ContactRepository'
import Button from './Button'
import Conversations from './Conversations'
import Details from './Details'
import Info from './Info'
import LoadingIndicator from './LoadingIndicator'
import Voicemails from './Voicemails'

enum Step {
  Backup,
  Locate,
  Open,
  View,
}

const App = () => {
  const [sql, setSql] = useState<SqlJsStatic | null>(null)
  const [backupFolder, setBackupFolder] =
    useState<FileSystemDirectoryHandle | null>(null)
  const [contacts, setContacts] = useState<ContactEntries | null>(null)
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false)
  const [step, setStep] = useState<Step>(Step.Backup)
  const backupBtn = useRef<HTMLButtonElement>(null)
  const locateBtn = useRef<HTMLButtonElement>(null)
  const openBtn = useRef<HTMLButtonElement>(null)
  const conversationsBtn = useRef<HTMLButtonElement>(null)
  const voicemailsBtn = useRef<HTMLButtonElement>(null)

  const locate = () => {
    setStep(Step.Locate)
    setTimeout(() => locateBtn.current?.focus(), 0)
  }

  const open = () => {
    setStep(Step.Open)
    setTimeout(() => openBtn.current?.focus(), 0)
  }

  const view = async () => {
    await showDirectoryPicker()
    setTimeout(() => conversationsBtn.current?.focus(), 0)
  }

  const showDirectoryPicker = async () => {
    if (typeof window === 'undefined') return
    try {
      setBackupFolder(await window.showDirectoryPicker())
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (sql && backupFolder) {
      const loadContacts = async () => {
        setLoadingContacts(true)
        const db = await DatabaseFactory.create(
          sql,
          backupFolder,
          'AddressBook'
        )
        const contacts = await new ContactRepository(db).getAll()
        setContacts(contacts)
        setLoadingContacts(false)
        setStep(Step.View)
      }
      loadContacts()
    }
  }, [sql, backupFolder])

  useEffect(() => backupBtn.current?.focus(), [backupBtn])

  useEffect(() => {
    SQL.getInstance().then((instance) => setSql(instance))
  }, [])

  return (
    <BackupContext.Provider value={{ sql, backupFolder }}>
      <ContactsContext.Provider value={contacts}>
        <main className="p-8 sm:py-32">
          <div className="w-full max-w-xl mx-auto">
            <header className="md:-ml-10">
              <h1>
                <a
                  className="flex items-center space-x-2 text-4xl font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  href="/"
                >
                  <svg
                    className="w-10 h-10 -mt-2 -ml-2 text-green-100"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                  >
                    <path d="M256 399.627c-11.782 0-21.333 9.551-21.333 21.333 0 11.782 9.551 21.333 21.333 21.333v-42.666zm.178 42.666c11.782 0 21.333-9.551 21.333-21.333 0-11.782-9.551-21.333-21.333-21.333v42.666zm-71.289-271.626v-21.334 21.334zm-35.556 33.372H128h21.333zm0 233.607H128h21.333zm149.334-288.313h-21.334V192h21.334v-42.667zM213.333 192h21.334v-42.667h-21.334V192zM256 442.293h.178v-42.666H256v42.666zm-71.111 50.059h142.222v-42.667H184.889v42.667zm142.222 0c14.667 0 28.984-5.456 39.741-15.553l-29.199-31.11c-2.579 2.42-6.349 3.996-10.542 3.996v42.667zm39.741-15.553C377.656 466.659 384 452.607 384 437.646h-42.667c0 2.741-1.147 5.666-3.68 8.043l29.199 31.11zM384 437.646V204.039h-42.667v233.607H384zm0-233.607c0-14.961-6.344-29.013-17.148-39.153l-29.199 31.11c2.533 2.377 3.68 5.302 3.68 8.043H384zm-17.148-39.153c-10.757-10.097-25.074-15.553-39.741-15.553V192c4.193 0 7.963 1.576 10.542 3.996l29.199-31.11zm-181.963-15.553c-14.667 0-28.984 5.456-39.742 15.553l29.2 31.11c2.579-2.42 6.349-3.996 10.542-3.996v-42.667zm-39.742 15.553C134.344 175.026 128 189.078 128 204.039h42.667c0-2.741 1.147-5.666 3.68-8.043l-29.2-31.11zM128 204.039v233.607h42.667V204.039H128zm0 233.607c0 14.961 6.344 29.013 17.147 39.153l29.2-31.11c-2.533-2.377-3.68-5.302-3.68-8.043H128zm17.147 39.153c10.758 10.097 25.075 15.553 39.742 15.553v-42.667c-4.193 0-7.963-1.576-10.542-3.996l-29.2 31.11zm181.964-327.466h-28.444V192h28.444v-42.667zm-113.778 0H184.892h-.003V192H213.333v-42.667zM156.076 107.103c-8.596 8.058-9.031 21.559-.973 30.154 8.058 8.596 21.559 9.031 30.154.973l-29.181-31.127zM256 42.667l14.591-15.564c-8.206-7.693-20.976-7.693-29.182 0L256 42.667zm70.743 95.563c8.595 8.058 22.096 7.623 30.154-.973 8.058-8.595 7.623-22.096-.973-30.154l-29.181 31.127zM234.667 128v21.333h42.666V128h-42.666zm-49.41 10.23l85.334-80-29.182-31.127-85.333 80 29.181 31.127zm56.152-80l85.334 80 29.181-31.127-85.333-80-29.182 31.127zm-6.742-15.563V128h42.666V42.667h-42.666z" />
                  </svg>

                  <span>Extro</span>
                </a>
              </h1>
            </header>

            <h2 className="mt-6 text-2xl font-bold text-green-200">
              View and save your backed up{' '}
              <span className="text-green-500">conversations</span> and{' '}
              <span className="text-green-500">voicemails</span> without having
              to download a thing
            </h2>

            <article className="mt-6 prose prose-xl text-gray-200">
              <p className="font-semibold">
                Follow the steps below to access your data:
              </p>

              <Info type="note">
                Please note that the given steps are currently only written for
                use on a Mac. Updated steps for Windows and Linux may be
                provided at a future date.
              </Info>

              <ol>
                <li>
                  <Details
                    summary="Back up your iPhone"
                    open={step === Step.Backup}
                  >
                    <p className="!mt-2 text-base">
                      Plug your iPhone into your Mac, then open Finder. You
                      should see your iPhone&apos;s name show up in
                      Finder&apos;s sidebar. Click that name. Then click the
                      &quot;Back Up&quot; button and wait for it to finish.
                    </p>

                    <Button ref={backupBtn} className="w-full" onClick={locate}>
                      I&apos;m backed up
                    </Button>
                  </Details>
                </li>
                <li>
                  <Details
                    summary="Locate your backup folder"
                    disabled={[Step.Backup].includes(step)}
                    open={step === Step.Locate}
                  >
                    <p className="!mt-2 text-base">
                      Open Finder and press <code>⌘+shift+g</code> on your
                      keyboard. In the box that opens, type{' '}
                      <code>
                        ~/Library/Application Support/MobileSync/Backup
                      </code>
                      , then press <code>enter</code>.
                    </p>

                    <p className="text-base">
                      You should now see a list of folders with names like{' '}
                      <br />
                      <code>00000000-0000000000000000</code>. Locate the folder
                      that was most recently modified. Move or copy this folder
                      to be another folder that is more easily accessible (e.g.
                      your <code>Downloads</code> folder).
                    </p>

                    <Info>
                      You will be able to find the most recent backup by
                      changing your Finder display mode to&nbsp;&nbsp;
                      <svg
                        viewBox="0 0 100 72"
                        fill="currentColor"
                        className="relative inline-block w-3 h-3 -mt-0.5 text-gray-400"
                      >
                        <path d="M6.803 12.406c3.418 0 6.153-2.734 6.153-6.103A6.127 6.127 0 006.803.15 6.127 6.127 0 00.651 6.303c0 3.369 2.734 6.103 6.152 6.103zm21.582-2.197h66.7c2.197 0 3.955-1.709 3.955-3.906 0-2.246-1.758-3.955-3.955-3.955h-66.7c-2.246 0-3.955 1.709-3.955 3.955 0 2.197 1.71 3.906 3.955 3.906zM6.803 41.947a6.127 6.127 0 006.153-6.152 6.127 6.127 0 00-6.153-6.152 6.127 6.127 0 00-6.152 6.152 6.127 6.127 0 006.152 6.152zm21.582-2.197h66.7a3.939 3.939 0 003.955-3.955c0-2.197-1.758-3.906-3.955-3.906h-66.7c-2.246 0-3.955 1.709-3.955 3.906s1.71 3.955 3.955 3.955zM6.803 71.488c3.418 0 6.153-2.783 6.153-6.152a6.127 6.127 0 00-6.153-6.152 6.127 6.127 0 00-6.152 6.152c0 3.37 2.734 6.152 6.152 6.152zm21.582-2.246h66.7c2.197 0 3.955-1.709 3.955-3.906 0-2.246-1.758-3.955-3.955-3.955h-66.7c-2.246 0-3.955 1.709-3.955 3.955 0 2.197 1.71 3.906 3.955 3.906z" />
                      </svg>
                      . It will be the most recently modified folder.
                    </Info>

                    <Button
                      ref={locateBtn}
                      className="w-full mt-6"
                      onClick={open}
                    >
                      Found It
                    </Button>
                  </Details>
                </li>
                <li>
                  <Details
                    summary="Open your backup folder"
                    disabled={[Step.Backup, Step.Locate].includes(step)}
                    open={step === Step.Open}
                  >
                    <p className="!mt-2 text-base">
                      Click the button below and navigate to and select the
                      folder you just moved (e.g.{' '}
                      <code>Downloads/00000000-0000000000000000</code>).
                    </p>

                    <Info type="note">
                      This will currently only work in the latest versions of{' '}
                      <a
                        className="focus:outline-none focus:ring-2 focus:ring-green-500"
                        href="https://www.google.com/chrome/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Chrome
                      </a>
                    </Info>

                    <Button
                      ref={openBtn}
                      className="w-full mt-6"
                      disabled={loadingContacts}
                      loading={loadingContacts}
                      onClick={view}
                    >
                      {loadingContacts && (
                        <span className="flex-shrink-0 inline-block w-5" />
                      )}

                      <span className="flex-1 mx-4 text-center">
                        Open Backup Folder
                      </span>

                      {loadingContacts && (
                        <LoadingIndicator color="text-green-100" />
                      )}
                    </Button>
                  </Details>
                </li>
                <li>
                  <Details
                    summary="Choose what you would like to export"
                    disabled={
                      [Step.Backup, Step.Locate, Step.Open].includes(step) ||
                      !parent
                    }
                    open={step === Step.View}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <Conversations ref={conversationsBtn} />

                      <Voicemails ref={voicemailsBtn} />
                    </div>
                  </Details>
                </li>
              </ol>
            </article>

            <footer>
              <p className="flex items-center justify-center mt-6 text-gray-500">
                Made with&nbsp;
                <svg
                  className="flex-shrink-0 w-4 h-4 text-green-500 animate-beat"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                &nbsp;by&nbsp;
                <a
                  className="font-medium hover:underline focus:ring-2 focus:outline-none focus:ring-green-500"
                  href="https://krafted.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Krafted
                </a>
              </p>
            </footer>
          </div>
        </main>
      </ContactsContext.Provider>
    </BackupContext.Provider>
  )
}

export default App
