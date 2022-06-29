import { app, pages } from "@microsoft/teams-js";

const searchParams = new URL(window.location).searchParams;
const root = document.getElementById("content");


// STARTUP LOGIC

async function start() {

  // Check for page to display
  let view = searchParams.get('view') || 'stage';

  // Check if we are running on stage.
  if (!!searchParams.get('inTeams')) {

    // Initialize teams app
    await app.initialize();

    // Get our frameContext from context of our app in Teams
    const context = await app.getContext();
    if (context.page.frameContext == 'meetingStage') {
      view = 'stage';
    }
  }

  // Load the requested view
  switch (view) {
    case 'content':
      renderSideBar(root);
      break;
    case 'config':
      renderSettings(root);
      break;
    case 'stage':
    default:
      renderStage(root);
      break;
  }
}

// STAGE VIEW

const stageTemplate = document.createElement("template");

stageTemplate["innerHTML"] = `
  <style>
    .wrapper { text-align: center; color: white }
    .text { font-size: medium; }
  </style>
  <div class="wrapper">
	<p class="text">Meeting stage</p>
  </div>
`;

function renderStage(elem) {
    elem.appendChild(stageTemplate.content.cloneNode(true));
}

// SIDEBAR VIEW

const sideBarTemplate = document.createElement("template");

sideBarTemplate["innerHTML"] = `
  <style>
    .wrapper { text-align: center; color: white }
    .text { font-size: medium; }
  </style>
  <div class="wrapper">
    <p class="text">Press the share to stage button to share the app to meeting stage.</p>
  </div>
`;

function renderSideBar(elem) {
    elem.appendChild(sideBarTemplate.content.cloneNode(true));
}


// SETTINGS VIEW

const settingsTemplate = document.createElement("template");

settingsTemplate["innerHTML"] = `
  <style>
    .wrapper { text-align: center; color: white }
    .text { font-size: medium; }
  </style>
  <div class="wrapper">
    <p class="text">Press save to create the tab.</p>
  </div>
`;

function renderSettings(elem) {
    elem.appendChild(settingsTemplate.content.cloneNode(true));

    // Save the configurable tab
    pages.config.registerOnSaveHandler(saveEvent => {
      pages.config.setConfig({
        websiteUrl: window.location.origin,
        contentUrl: window.location.origin + '?inTeams=1&view=content',
        entityId: 'TeamsTabApp',
        suggestedDisplayName: 'TeamsTabApp'
      });
      saveEvent.notifySuccess();
    });

    // Enable the Save button in config dialog
    pages.config.setValidityState(true);
}


start().catch((error) => console.error(error));
