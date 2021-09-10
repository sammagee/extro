# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- "green" is now referenced to as "brand," in case the color needs to be changed in the future

### Fixed

- Sometimes messages would show up duplicated in a conversation, this is now resolved

## [1.3.0] - 2021-09-10

### Added

- Preferences are now supported:
  - A toggle to turn on and off "private mode," which blurs messages and contact names
  - A toggle to switch between text/video mode (this will be disabled until videos are added)

## [1.2.1] - 2021-09-09

### Fixed

- Fixed the app loading in Safari by shrinking and changing the Address Book/Contacts usage

## [1.2.0] - 2021-09-09

### Added

- Browser support component to tell the user to upgrade or change their browser

## [1.1.0] - 2021-09-09

### Changed

- Rather than using a simple string for contact names, we now add a Contact for each "handle" associated with either a Conversation, Message, or Voicemail
- Changed Message conditional statements to be more readable

### Added

- Slide-out contact avatars for conversations
- Because we are now using handles to add separate contacts, this version also allows for viewing group conversations

## [1.0.0] - 2021-09-09

### Added

- Initial project, with support for basic conversations and voicemails
- This Changelog
