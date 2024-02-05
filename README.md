# CCISD Skyward Manager (UNFINISHED)

## NOTE: This project is currently in a PoC state and may not operate as you might expect.

## Goals:
- [x] Create a structured slash command handler
- [x] Allow users to provide their Skyward credentials and save them
- [ ] Use these credentials to interface with [ccisd-skyward](https://github.com/NicholasCoppola21/ccisd-skyward)
- [ ] Cache all user info  to prevent as much spam as possible, include delete all data function.
- [ ] Use the cached assignment data to fetch new assignments automatically (after user enables)

## Current Setup Guide

### Note: This project is unfinished! Console contains a lot of unorganized debug logs and 0 input sanitization; and potentially can block your account!
### Use at your own risk!

### Prerequisites
- NodeJS v21 or later
- Yarn V4
- Postgresql database 
- General knowledge of Postgresql
- General knowledge of programming

### Setup
1. Clone the repository
1. Install all dependencies by using `yarn`
1. Create your enviroment file by copying the contents `.env.example` into a new file called `.env` and fill it out
1. Couple options for running the code:
    - Build and then run by doing `yarn build` and then run with `yarn start`
    - Build and then run in a single command (Used for testing) `yarn dev`
    - Rebuild & Restart on file save (Used for rapid prototyping) (**Dangerous**: Can block your account due to rapid login attempts) `yarn watch:start`

After you've setup & run the file, it should output a file called `gradebook_test.html` which cannot be opened with a browser (succesfully) but can be opened in a text editor and you can confirm that your grades are there.

## Contributing
- Follow the setup guide above

### Setting up the linter

If you're using VSCode.. (OPTIONAL)
- Grab the ESLint extension and set it up as a formatter
- After you get the official extension go into your settings and lookup `eslint format` and enable it.
- Then enable formatting on save to automatically have the file format on save.
- Open up a TypeScript file and hit `CTRL + SHIFT + P` and lookup `Format Document With..` and register ESLint as your default formatter
- Alternatively, you can just run `yarn lint`, or any of the precompiled scripts mentioned in setup, and it will automatically format and attempt to fix any issues.


1. Make your changes and be sure to test them and lint them.
2. Open up a PR on this repo and describe your changes!
3. For the commmit, you should try to follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), however it's not necessarily required as it can be edited later.


