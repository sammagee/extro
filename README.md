# Extro
### View and save your backed up conversations and voicemails without having to download a thing

This project allows you to save or view your conversations/messages and voicemails from an iOS backup folder.
You can use the app hosted at [extro.app](https://extro.app) or use the steps below
to run it locally.

## Getting Started Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

> Please note that this project uses new web technologies, such as the File System Access API.
> As such, you may only be able to use it on modern browsers (currently only Chrome supports this technology).
> The steps are also currently only documented to work on Mac, but a similar process may work on Windows and
> Linux, so long as you are using a modern iOS backup folder and a modern browser as previously noted.

Steps are included on the home page of the app. They are as follows:

1. Plug your iPhone into your Mac, then open Finder. You should see your iPhone&apos;s name show up
    in Finder&apos;s sidebar. Click that name. Then click the &quot;Back Up&quot; button and wait for
    it to finish.

2. Open Finder and press <code>⌘+shift+g</code> on your keyboard. In the box that opens, type
    <code>~/Library/Application Support/MobileSync/Backup</code>, then press <code>enter</code>.

    You should now see a list of folders with names like <br /><code>00000000-0000000000000000</code>.
    Locate the folder that was most recently modified. Move or copy this folder to be another folder
    that is more easily accessible (e.g. your <code>Downloads</code> folder).

3. Click the "Open Backup Folder" button and navigate to and select the folder you just moved (e.g.
    `Downloads/00000000-0000000000000000`). As noted above, this currently only works with Google Chrome.

4. Choose what you would like to view. We currently support viewing and downloading Messages; more features
    will be added in the future.
