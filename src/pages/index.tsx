import { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import Details from '@/components/Details'
import Head from 'next/head'
import Info from '@/components/Info'
import Conversations from '@/components/Conversations'
import { SqlJsStatic } from 'sql.js'
import SQL from '@/db/SQL'
import ContactRepository, { ContactEntries } from '@/repositories/ContactRepository'
import DatabaseFactory from '@/db/DatabaseFactory'

enum Step {
  Backup,
  Locate,
  Open,
  View
}

export default function Home() {
  const [sql, setSql] = useState<SqlJsStatic | undefined>()
  const [contacts, setContacts] = useState<ContactEntries | undefined>()
  const [step, setStep] = useState<Step>(Step.Backup)
  const [backupFolder, setBackupFolder] = useState<FileSystemDirectoryHandle | undefined>()
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false)
  // const [loadingVoicemails, setLoadingVoicemails] = useState<boolean>(false)
  const backupBtn = useRef<HTMLButtonElement>(null)
  const locateBtn = useRef<HTMLButtonElement>(null)
  const openBtn = useRef<HTMLButtonElement>(null)
  const conversationsBtn = useRef<HTMLButtonElement>(null)
  // const voicemailsBtn = useRef<HTMLButtonElement>(null)

  const locate = () => {
    setStep(Step.Locate)
    setTimeout(() => locateBtn.current?.focus(), 0)
  }

  const open = () => {
    setStep(Step.Open)
    setTimeout(() => openBtn.current?.focus(), 0)
  }
  
  const view = async() => {
    await showDirectoryPicker()
    setTimeout(() => conversationsBtn.current?.focus(), 0)
  }

  const showDirectoryPicker = async() => {
    if (typeof window === 'undefined') return
    try {
      setBackupFolder(await window.showDirectoryPicker())
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (sql && backupFolder) {
      const loadContacts = async() => {
        setLoadingContacts(true)
        const db = await DatabaseFactory.create(sql, backupFolder, 'AddressBook')
        const contacts = await (new ContactRepository(db)).getAll()
        setContacts(contacts)
        setLoadingContacts(false)
        setStep(Step.View)
      }
      loadContacts()
    }
  }, [sql, backupFolder]);

  useEffect(() => backupBtn.current?.focus(), [backupBtn])

  useEffect(() => {
    SQL.getInstance().then(instance => setSql(instance))
  }, [])

  return (
    <>
      <Head>
        <title>Recover</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-8 sm:py-32">
        <div className="w-full max-w-lg mx-auto">
          <h1 className="text-4xl font-black text-white">Recover</h1>
          <h2 className="mt-2 text-2xl font-bold text-green-200">
            Save your{' '}
            <span className="text-green-500">conversations</span>
            {/* {' '}and{' '}
            <span className="text-green-500">voicemails</span> */}
          </h2>

          <article className="mt-6 prose prose-xl text-gray-200">
            <p className="font-semibold">
              Follow the steps below to access your data:
            </p>

            <Info type="note">
              Please note that the given steps are currently only written for use
              on a Mac. Updated steps for Windows and Linux may be provided
              at a future date.
            </Info>

            <ol>
              <li>
                <Details
                  summary="Back up your iPhone"
                  open={step === Step.Backup}
                >
                  <p className="!mt-2 text-base">
                    Plug your iPhone into your Mac, then open Finder. You should
                    see your iPhone&apos;s name show up in Finder&apos;s sidebar. Click
                    that name. Then click the &quot;Back Up&quot; button and wait for
                    it to finish.
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
                    Open Finder and press{' '} <code>⌘+shift+g</code> on your
                    keyboard. In the box that opens, type{' '}
                    <code>~/Library/Application Support/MobileSync/Backup</code>,{' '}
                    then press <code>enter</code>.
                  </p>

                  <p className="text-base">
                    You should now see a list of folders with names like <br /><code>00000000-0000000000000000</code>.
                    Locate the folder that was most recently modified. Move or copy this folder to be another folder
                    that is more easily accessible (e.g. your <code>Downloads</code> folder).
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
                    Click the button below and navigate to and select the folder you just moved (e.g.{' '}
                    <code>Downloads/00000000-0000000000000000</code>).
                  </p>

                  <Info type="note">
                    This will currently only work in the latest versions of{' '}
                    <a className="focus:outline-none focus:ring-2 focus:ring-green-500" href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
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
                    {loadingContacts && <span className="flex-shrink-0 inline-block w-5" />}

                    <span className="flex-1 mx-4 text-center">Open Backup Folder</span>

                    {loadingContacts && (
                      <svg className="flex-shrink-0 w-5 h-5 text-green-100 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                  </Button>
                </Details>
              </li>
              <li>
                <Details
                  summary="Choose what you would like to export"
                  disabled={[Step.Backup, Step.Locate, Step.Open].includes(step) || !parent}
                  open={step === Step.View}
                >
                  <Conversations
                    ref={conversationsBtn}
                    backupFolder={backupFolder}
                    contacts={contacts}
                    sql={sql}
                  />

                  {/* <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button
                      ref={voicemailsBtn}
                      disabled={loadingVoicemails}
                      loading={loadingVoicemails}
                      onClick={() => {setLoadingVoicemails(true); setTimeout(() => setLoadingVoicemails(false), 2000);}}
                    >
                      <span className="flex-shrink-0 inline-block w-5" />

                      <span className="flex-1 mx-4 text-center">Voicemails</span>

                      {loadingVoicemails ? (
                        <svg className="flex-shrink-0 w-5 h-5 text-green-100 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="flex-shrink-0 w-5 h-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )}
                    </Button>
                  </div> */}
                </Details>
              </li>
            </ol>
          </article>

          <footer>
            <p className="flex items-center justify-center mt-6 text-gray-500">
              Made with&nbsp;
              <svg className="flex-shrink-0 w-4 h-4 text-green-500 animate-beat" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              &nbsp;by&nbsp;
              <a className="font-medium hover:underline focus:ring-2 focus:outline-none focus:ring-green-500" href="https://krafted.dev" target="_blank" rel="noopener noreferrer">
                Krafted
              </a>
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
