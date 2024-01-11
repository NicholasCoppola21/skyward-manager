# CCISD Skyward Manager (UNFINISHED)

## NOTE: This project is currently in a PoC state and may not operate as you might expect.

## Goals:
- Log into Skyward [ ]
- Pull grades [x]
- Parse out all grade information by class [ ]
- Calculate GPA by finding the tier of class [ ]
- Format into a Discord Bot [ ]
- Integrate data into a database [ ]
- Compare against other user feature (Leaderboard?) [ ] 
- Live monitor grades by checking every 30 minutes and notify user of any changes [ ] 
- Clean up code and make it look presentable [ ]

## Current Setup Guide

### Note: This project is unfinished! Console contains a lot of unorganized debug logs and 0 input sanitization; and potentially can block your account!
### Use at your own risk!

### Prerequisites
- NodeJS v21 or later
- Yarn V4
- General knowledge of programming

### Setup
1. Clone the repository
1. Install all dependencies by using `yarn`
1. Create your enviroment file by copying the contents `.env.example` into a new file called `.env` and fill it out
1. Couple options for running the code:
    - Build and then run by doing `yarn build` and then run with `yarn start`
    - Build and then run in a single command (Used for testing) `yarn dev`
    - Rebuild & Restart on file save (Used for rapid prototyping) (Dangerous: Can block your account due to rapid login attempts) `yarn watch:start`

After you've setup & run the file, it should output a file called `gradebook_test.html` which cannot be opened with a browser (succesfully) but can be opened in a text editor and you can confirm that your grades are there.