#! /usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
// const yargs = require('yargs')
// const { hideBin } = require('yargs/helpers')
import * as fs from 'fs';
// const fs = require('fs')
import chalk from 'chalk'
// const chalk = require('chalk')
import boxen from 'boxen'
// const boxen = require('boxen')
import { rmNote } from './utils.js';

const argv = yargs(hideBin(process.argv))
  .scriptName('notes')
  // .usage(chalk.blue("notes --help"))
  .help(true)
  //commands
  .command({
    command: 'add',
    describe: "Add a new note",
    builder: {
      t: {
        describe: "Note title",
        demandOption: true,
        type: "string"
      },
      b: {
        describe: "Body of the note",
        demandOption: true,
        type: 'string'
      }
    },
    handler: function (argv) {
      const path = './notes.json'
      var t = argv.t
      var b = argv.b
      var welcome = JSON.stringify([{ id: 1, t: 'Welcome', b: "Welcome to notes by MarianoD27" }])

      if (!fs.existsSync(path)) {
        // Do something
        fs.writeFileSync(path, welcome)
        console.log(chalk.green('\nNotes file created'))
      }

      fs.readFile(path, (err, data) => {
        if (err) console.log(chalk.red("\nThe file couldn't be read\n"));
        else {
          const parsedData = JSON.parse(data);
          // console.log(parsedData)
          for (let i = 0; i < parsedData.length; i++) {
            if (t == parsedData[i].t) {
              console.log(chalk.red("\nThere is already a note with that title\n"));
              return;
            }
          }

          try {
            var newId = parsedData[parsedData.length - 1].id + 1
          } catch (error) {
            var newId = 1
          }

          var newNote = { id: newId, t: t, b: b }

          // console.log(newNote)
          parsedData.push(newNote)
          fs.writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
              console.log('Failed to write updated data to file\n');
              return;
            }
            console.log(chalk.green('Updated file successfully\n'));
          });
        }
      })
    }
  })
  .command({
    command: 'rm',
    describe: "Remove a note",
    builder: {
      t: {
        describe: "Title of the note to remove",
        demandOption: false,
        type: "string"
      },
      id: {
        describe: "Id of the note to remove",
        demandOption: false,
        type: 'number'
      }
    },
    handler: function (argv) {

      const path = './notes.json'
      var id = argv.id
      var t = argv.t
      if (!id && !t) {
        console.log(chalk.red("\nYou need to write an id or title to delete"))
        console.log("Usage: " + chalk.blue("notes --t 'title' or notes --id <N>\n"))
        return
      }

      if (!fs.existsSync(path)) {
        console.log(chalk.red('\nThere are no notes\n'))
        return
      }

      fs.readFile(path, (err, data) => {
        if (err) console.log("\nWe couldn't read the file\n")
        else {
          const parsedData = JSON.parse(data)
          // console.log(parsedData)
          if (id) {
            // console.log('using id')
            var newArray = rmNote(parsedData, id, 'id')
            // console.log(newArray)

          } else if (t) {
            // console.log('you using title')
            var newArray = rmNote(parsedData, t, 't')
            // console.log(newArray)
          }
          if (newArray == null) { return }

          fs.writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
              console.log('Failed to write updated data to file\n');
              return;
            }
            console.log(chalk.green('Updated file successfully\n'));
          });
        }
      })
    }
  })
  .command({
    command: 'list',
    describe: "List the notes",
    handler: function () {
      console.log(chalk.blue('\nListing all the notes:\n'))
      fs.readFile('notes.json', function (err, data) {
        if (err) throw err;
        const parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) {
          console.log(`id: ${parsedData[i].id}\t\ttitle: ${parsedData[i].t}`);
        }
        console.log('')
      });
    }
  })
  .command({
    command: 'read',
    describe: "Read a note",
    builder: {
      t: {
        describe: "Title of the note to read",
        demandOption: false,
        type: "string"
      },
      id: {
        describe: "Id of the note to read",
        demandOption: false,
        type: 'number'
      }
    },
    handler: function (argv) {
      var id = argv.id;
      var t = argv.t;
      if (!id && !t) {
        console.error(chalk.red("\nWrite the title or id of the note"))
        console.log("For more info: " + chalk.blue("read --help\n"))
        return;
      }
      console.log(chalk.yellow('\nReading a note:'))
      fs.readFile('notes.json', function (err, data) {
        if (err) throw err;
        const parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) {
          if (id == parsedData[i].id || t == parsedData[i].t) {
            console.log(boxen(`\n${parsedData[i].b}\n`, { title: parsedData[i].t, titleAlignment: 'center', borderStyle: 'double', padding: 1, borderColor: 'magenta' }));
            return
          }
        }
        console.error(chalk.red("\nWe couldn't find that note..."))
        console.log("You can see the available ones with: " + chalk.blue("notes list\n"))
      });
    }
  })
  .argv