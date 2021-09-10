import React, { useEffect, useRef, useState } from 'react'
import { SqlJsStatic } from 'sql.js'
import BackupContext from '../contexts/BackupContext'
import ContactsContext from '../contexts/ContactsContext'
import DatabaseFactory from '../db/DatabaseFactory'
import SQL from '../db/SQL'
import ContactRepository, {
  ContactEntries,
} from '../repositories/ContactRepository'
import { scrollTo } from '../utils/scroll'
import Button from './Button'
import Conversations from './Conversations'
import Details from './Details'
import LoadingIndicator from './icons/LoadingIndicator'
import Info from './Info'
import Voicemails from './Voicemails'

enum Step {
  Backup,
  Locate,
  Open,
  View,
}

const Root = () => {
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
    setTimeout(() => {
      if (!locateBtn.current) return
      scrollTo(locateBtn.current)
      locateBtn.current.focus()
    }, 100)
  }

  const open = () => {
    setStep(Step.Open)
    setTimeout(() => {
      if (!openBtn.current) return
      scrollTo(openBtn.current)
      openBtn.current.focus()
    }, 100)
  }

  const view = async () => {
    await showDirectoryPicker()
    setStep(Step.View)
    setTimeout(() => {
      if (!conversationsBtn.current) return
      scrollTo(conversationsBtn.current)
      conversationsBtn.current.focus()
    }, 100)
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
        <div className="mt-6 prose prose-xl text-gray-200">
          <p className="font-semibold">
            Follow the steps below to access your data:
          </p>

          <Info type="note">
            Please note that the given steps are currently only written for use
            on a Mac. Updated steps for Windows and Linux may be provided at a
            future date.
          </Info>

          <ol>
            <li>
              <Details
                summary="Back up your iPhone"
                open={step === Step.Backup}
              >
                <p className="!mt-2 text-base">
                  Plug your iPhone into your Mac, then open Finder. You should
                  see your iPhone&apos;s name show up in Finder&apos;s sidebar.
                  Click that name. Then click the &quot;Back Up&quot; button and
                  wait for it to finish.
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
                  Open Finder and press <code>⌘+shift+g</code> on your keyboard.
                  In the box that opens, type{' '}
                  <code>~/Library/Application Support/MobileSync/Backup</code>,
                  then press <code>enter</code>.
                </p>

                <p className="text-base">
                  You should now see a list of folders with names like <br />
                  <code>00000000-0000000000000000</code>. Locate the folder that
                  was most recently modified. Move or copy this folder to be
                  another folder that is more easily accessible (e.g. your{' '}
                  <code>Downloads</code> folder).
                </p>

                <Info>
                  You will be able to find the most recent backup by changing
                  your Finder display mode to&nbsp;&nbsp;
                  <svg
                    viewBox="0 0 100 72"
                    fill="currentColor"
                    className="relative inline-block w-3 h-3 -mt-0.5 text-gray-400"
                  >
                    <path d="M6.803 12.406c3.418 0 6.153-2.734 6.153-6.103A6.127 6.127 0 006.803.15 6.127 6.127 0 00.651 6.303c0 3.369 2.734 6.103 6.152 6.103zm21.582-2.197h66.7c2.197 0 3.955-1.709 3.955-3.906 0-2.246-1.758-3.955-3.955-3.955h-66.7c-2.246 0-3.955 1.709-3.955 3.955 0 2.197 1.71 3.906 3.955 3.906zM6.803 41.947a6.127 6.127 0 006.153-6.152 6.127 6.127 0 00-6.153-6.152 6.127 6.127 0 00-6.152 6.152 6.127 6.127 0 006.152 6.152zm21.582-2.197h66.7a3.939 3.939 0 003.955-3.955c0-2.197-1.758-3.906-3.955-3.906h-66.7c-2.246 0-3.955 1.709-3.955 3.906s1.71 3.955 3.955 3.955zM6.803 71.488c3.418 0 6.153-2.783 6.153-6.152a6.127 6.127 0 00-6.153-6.152 6.127 6.127 0 00-6.152 6.152c0 3.37 2.734 6.152 6.152 6.152zm21.582-2.246h66.7c2.197 0 3.955-1.709 3.955-3.906 0-2.246-1.758-3.955-3.955-3.955h-66.7c-2.246 0-3.955 1.709-3.955 3.955 0 2.197 1.71 3.906 3.955 3.906z" />
                  </svg>
                  . It will be the most recently modified folder.
                </Info>

                <Button ref={locateBtn} className="w-full mt-6" onClick={open}>
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
                  Click the button below and navigate to and select the folder
                  you just moved (e.g.{' '}
                  <code>Downloads/00000000-0000000000000000</code>).
                </p>

                <Info type="note">
                  This will currently only work in the latest versions of{' '}
                  <a
                    className="focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    <LoadingIndicator color="text-brand-100" />
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
        </div>
      </ContactsContext.Provider>
    </BackupContext.Provider>
  )
}

Root.displayName = 'Root'

export default Root
