import * as fs from 'fs'
import chalk from 'chalk';


//rm
export function rmNote(array, x, titleorid) { //x is what we use to execute, either id or title,  array is in this case the parsedData
  if (titleorid == 'id') {
    var indexToRemove = array.findIndex((pl) => pl.id === x);
  } else {
    var indexToRemove = array.findIndex((pl) => pl.t === x);
  }

  // console.log(indexToRemove)
  if (indexToRemove >= 0) {
    // console.log('splicing')
    array.splice(indexToRemove, 1);
  } else {
    console.log(chalk.red("\nWe couldn't find a note with that id/title\n"))
    return null;
  }
  return array;
}