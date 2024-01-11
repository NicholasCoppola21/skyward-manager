// login website
// https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/seplog01.w

/**
  Currently logs into skyward succesfully and pulls the grades HTML file and puts it in your directory.
  Still have to parse everything out; that doesn't look fun at all.
  This is such a shitty fucking application.
 */

/**
 * There seems to be a lot of useless parameters.
 * I wonder how many you could safely remove?
 * Currently removed IP related headers only.
 */

import "dotenv/config";
import { writeFile } from "fs/promises";
import { request } from "undici";

const EMAIL = process.env.SYWARD_EMAIL;
const PASSWORD = process.env.SKYWARD_PASSWORD;

if (!EMAIL) {
  console.log(
    `Email not specified! Create a .env file with \`SKYWARD_EMAIL=youremail\` inside!`,
  );
  process.exit();
}

if (!PASSWORD) {
  console.log(
    `Password not specified! Create a .env file with \`SKYWARD_PASSWORD=yourpassword\` inside!`,
  );
  process.exit();
}

const prelimHTMLRequest = await request(
  "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/seplog01.w",
);

const hAnonHTMLReqest = await prelimHTMLRequest.body.text();

const hAnon = hAnonHTMLReqest.split('hAnon" value="')[1].split('"')[0];

console.log(hAnon);

const LOGIN_REQUEST_POST_PARAMS = [
  {
    name: "requestAction",
    value: "eel",
  },
  {
    name: "method",
    value: "extrainfo",
  },
  {
    name: "codeType",
    value: "tryLogin",
  },
  {
    name: "codeValue",
    value: EMAIL,
  },
  {
    name: "login",
    value: EMAIL,
  },
  {
    name: "password",
    value: PASSWORD,
  },
  {
    name: "SecurityMenuID",
    value: "0",
  },
  {
    name: "HomePageMenuID",
    value: "0",
  },
  {
    name: "nameid",
    value: "-1",
  },
  {
    name: "hNavSearchOption",
    value: "all",
  },
  {
    name: "hSecCache",
    value: "0 items in 0 entities",
  },
  {
    name: "CurrentProgram",
    value: "skyportlogin.w",
  },
  {
    name: "CurrentVersion",
    value: "010197",
  },
  {
    name: "SuperVersion",
    value: "012156",
  },
  {
    name: "PaCVersion",
    value: "05.23.10.00.06",
  },
  {
    name: "Browser",
    value: "Moz",
  },
  {
    name: "BrowserVersion",
    value: "121",
  },
  {
    name: "BrowserPlatform",
    value: "Undetermined",
  },
  {
    name: "TouchDevice",
    value: "false",
  },
  {
    name: "noheader",
    value: "yes",
  },
  {
    name: "duserid",
    value: "-1",
  },
  // {
  //   name: "hIPInfo",
  //   value: ip,
  // },
  {
    name: "HomePage",
    value: "sepadm01.w",
  },
  {
    name: "loginID",
    value: "-1",
  },
  {
    name: "hUseCGIIP",
    value: "yes",
  },
  {
    name: "hScrollBarWidth",
    value: "17",
  },
  {
    name: "UserSecLevel",
    value: "5",
  },
  {
    name: "UserLookupLevel",
    value: "5",
  },
  {
    name: "AllowSpecial",
    value: "false",
  },
  {
    name: "hAnon",
    value: hAnon,
  },
  {
    name: "pState",
    value: "TX",
  },
  {
    name: "pCountry",
    value: "US",
  },
  {
    name: "hDisplayBorder",
    value: "true",
  },
  {
    name: "hAlternateColors",
    value: "true",
  },
  {
    name: "screenWidth",
    value: "1920",
  },
  {
    name: "screenHeight",
    value: "1080",
  },
  {
    name: "hforgotLoginPage",
    value: "seplog01",
  },
  {
    name: "userAgent",
    value:
      "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
  },
  {
    name: "osName",
    value: "Undetermined",
  },
  {
    name: "brwsInfo",
    value: "Firefox 121",
  },
  {
    name: "subversion",
    value: "121",
  },
  {
    name: "supported",
    value: "true",
  },
  {
    name: "pageused",
    value: "Desktop",
  },
  {
    name: "recordLimit",
    value: "30",
  },
  {
    name: "disableAnimations",
    value: "yes",
  },
  {
    name: "hOpenSave",
    value: "no",
  },
  {
    name: "hAutoOpenPref",
    value: "no",
  },
  {
    name: "hButtonHotKeyIDs",
    value: "bCancel",
  },
  {
    name: "hButtonHotKeys",
    value: "B",
  },
  {
    name: "hLoadTime",
    value: ".07",
  },
  {
    name: "lip",
    value: "f3a34aab-271f-43e8-aa09-0c67761a45c7.local",
  },
  // {
  //   name: "cUserRole",
  //   value: "",
  // },
  {
    name: "fwtimestamp",
    value: Date.now(),
  },
]
  .map((s) => `${s.name}=${encodeURIComponent(s.value)}`)
  .join("&");

console.log(LOGIN_REQUEST_POST_PARAMS);

const loginRequest = await request(
  "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/skyporthttp.w",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      referrer:
        "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/seplog01.w",
    },
    body: LOGIN_REQUEST_POST_PARAMS,
    method: "POST",
  },
);

console.log(loginRequest);

const loginRequestText = await loginRequest.body.text();

// trim <li> and </li> brackets from both sides and use ^ as a seperator

const extraInfo = loginRequestText
  .replace("<li>", "")
  .replace("</li>", "")
  .split("^");

console.log(extraInfo);

const homeRequestArgs = [
  ...Object.entries({
    login: "",
    password: "",
    cUserRole: "",
    dwd: extraInfo[0],
    wfaacl: extraInfo[3],
    encses: extraInfo[14],
    encsec: "",
    entity: "",
    entities: "",
    SecurityMenuID: "0",
    HomePageMenuID: "0",
    LinkNames: "",
    nameid: extraInfo[4],
    MobileId: "",
    hNavMenus: "",
    hNavSubMenus: "",
    hNavSearchOption: "all",
    hSecCache: "0+items+in+0+entities",
    LinkData: "",
    passedparams: "",
    vMaintOption: "",
    CurrentProgram: "skyportlogin.w",
    CurrentVersion: "010197",
    SuperVersion: "012156",
    PaCVersion: "05.23.10.00.06",
    currentrecord: "",
    encrow: "",
    BrowseRowNumber: "",
    Browser: "Moz",
    BrowserVersion: "121",
    BrowserPlatform: "Undetermined",
    TouchDevice: "false",
    OpenRow: "",
    OpenDetails: "",
    PopupWidth: "1013",
    PopupHeight: "671",
    noheader: "yes",
    vSelectMode: "N",
    PreviousProgram: "",
    duserid: EMAIL,
    RefreshMode: "",
    hExcelRandom: "",
    // hIPInfo: ip,
    hBrowseFirstRowid: "",
    HomePage: "sepadm01.w",
    hApplyingFilter: "",
    hRepositioning: "",
    loginID: "-1",
    pDesc: "",
    pProgram: "",
    pParams: "",
    pPath: "",
    pInfo: "",
    pType: "",
    pSrpplmIn: "",
    pPriority: "",
    pButtons: "",
    fileUploadLimit: "",
    blobid: "",
    pEnc: "",
    fileInputId: "",
    delAttachReturn: "",
    hUseCGIIP: "yes",
    hScrollBarWidth: "17",
    UserSecLevel: "5",
    UserLookupLevel: "5",
    AllowSpecial: "false",
    hAnon,
    pState: "TX",
    pCountry: "US",
    hDisplayBorder: "true",
    hAlternateColors: "true",
    BrowserName: "",
    "web-data-recid": extraInfo[1],
    "wfaacl-recid": extraInfo[2],
    "User-Type": "2",
    tempAccess: "",
    screenWidth: "1920",
    screenHeight: "1080",
    showTracker: "false",
    displaySecond: "no",
    insecure: "no",
    redirectTo: "",
    enc: extraInfo[13],
    hforgotLoginPage: "seplog01",
    userAgent:
      "Mozilla/5.0+(X11;+Linux+x86_64;+rv:121.0)+Gecko/20100101+Firefox/121.0",
    osName: "Undetermined",
    brwsInfo: "Firefox+121",
    subversion: "121",
    supported: "true",
    pageused: "Desktop",
    recordLimit: "30",
    hFilterOpen: "",
    filterElementList: "",
    currentbrowse: "",
    vSelectedColumn: "",
    vSelectedColumnDirection: "",
    disableAnimations: "yes",
    hOpenSave: "no",
    hAutoOpenPref: "no",
    hButtonHotKeyIDs: "bCancel",
    hButtonHotKeys: "B",
    hLoadTime: ".019",
    lip: "05ae65d7-c4b4-4e26-ba9f-b5f6aae3cf11.local",
  }),
]
  .map((entry) => `${entry[0]}=${entry[1]}`)
  .join("&");

const homeRequest = await request(
  "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/sfhome01.w",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "Sec-GPC": "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      referrer:
        "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/seplog01.w",
    },
    body: homeRequestArgs,
    method: "POST",
  },
);

console.log(homeRequest.statusCode);

const text = await homeRequest.body.text();

console.log(text);

const encses = text.split("sff.sv('encses', '")[1].split("');")[0];

const cookie = `${extraInfo[extraInfo.length - 2]}=${
  extraInfo[extraInfo.length - 1]
}`;

const sessionId = text.split("sff.sv('sessionid', '")[1].split("');")[0];

console.log(encses, sessionId);
console.log(extraInfo, cookie, sessionId, encses);

const gradebookRequest = await request(
  "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/sfgradebook001.w",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "Sec-GPC": "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      Cookie: cookie,
      referrer:
        "https://skyward-ccisdprod.iscorp.com/scripts/wsisa.dll/WService=wseduclearcreektx/sfhome01.w",
    },

    body: `sessionid=${encodeURIComponent(sessionId)}&encses=${encses}`,
    method: "POST",
  },
);

console.log(gradebookRequest.statusCode);

const gradeBook = await gradebookRequest.body.text();

await writeFile("./gradebook_test.html", gradeBook);
