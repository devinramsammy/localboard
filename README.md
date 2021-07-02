<p align="center">
  <a href="" rel="noopener">
 <img height=60px src="https://i.imgur.com/lAvFIAi.png" alt="Project logo"></a>
</p>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/devinramsammy/localboard.svg)](https://github.com/devinramsammy/localboard/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/devinramsammy/localboard.svg)](https://github.com/devinramsammy/localboard/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Multi Platform Offline Project Management Tool
    <br> 
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Localboard is an offline project management tool that was created to help circumvent web connection issues I was facing at college. This project allows for the user to create multiple kanban boards, attach descriptions and dates to each task, and to view the tasks in a calendar. 

## 🏁 Getting Started <a name = "getting_started"></a>
This repository contains the release files for both windows and mac. However, if you would like to compile the files yourself, please follow the steps below:

### Prerequisites
yarn version 1.22.10

### Installing

```
# Clone the project repository:
git clone https://github.com/devinramsammy/localboard

cd localboard

# Install dependencies with yarn:
yarn
```

Then package the file into your respective OS

```
# Package into mac
yarn package --mac

# Package into windows
yarn package --win
```

The packaged app will be located in the release directory

### Running the tests

This project uses jest for testing.

```
# Run tests
yarn test
```

## 🎈 Usage <a name="usage"></a>

The landing page dashboard contains your upcoming tasks and your available boards. You can click on the boards or tasks.

<img height='400px' src="https://i.imgur.com/fgE94Wh.png">

Expand each task to add description or date attributes and modify the initial content. You can drag and drop columns, or tasks.

<img height='400px' src="https://i.imgur.com/egRaDIj.png">

Access the calendar from the left hand drawer to keep track of upcoming tasks across all boards.

<img height='400px' src="https://i.imgur.com/wuF37l2.png">


## ⛏️ Built Using <a name = "built_using"></a>
- [NeDB](https://github.com/louischatriot/nedb) - Database
- [Electron](https://www.electronjs.org/) - Software Framework
- [React](https://reactjs.org/) - Web Framework
- [Typescript](https://www.typescriptlang.org/) - Typed Javascript


## 🎉 Acknowledgements <a name = "acknowledgement"></a>
- [React Electron Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) - Template for electron and react
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - Driver behind drag and drop
- [Material UI](https://material-ui.com/) - UI elements
