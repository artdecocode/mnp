const { resolve, dirname } = require('path');
const        { spawn, fork } = require('../../stdlib');
const { existsSync } = require('fs');
const getArgs = require('./get-args');

const error = (text) => {
  const err = new Error(text)
  err.controlled = true
  throw err
}

const getStructure = (name = 'package') => {
  let path
  try {
    path = require(`mnp-${name}`)
  } catch (err) {
    try {
      path = require.resolve(`@mnpjs/${name}/package.json`)
      path = dirname(path)
    } catch (e) {
      error(`Could not require structure "${name}".`)
    }
  }
  const structure = resolve(path, 'structure')
  const { mnp: scripts = {} } = require(`${path}/package.json`)
  return {
    scripts,
    structure,
    structurePath: path,
  }
}

/**
 * The post-create hook.
 * @param {string} path The path to the newly created repo.
 * @param {string} structurePath The path to the structure.
 */
const create = async (path, structurePath, script) => {
  if (Array.isArray(script)) {
    await Promise.all(script.map(s => runOnCreate(path, structurePath, s)))
  } else {
    await runOnCreate(path, structurePath, script)
  }
}

/**
 * Parse the command with arguments.
 * @param {string} script
 */
const getProgWithArgs = (script) => {
  const [prog] = script.split(' ', 1)
  const a = script.slice(prog.length + 1)
  const args = getArgs(a)
  return { prog, args }
}

/**
 * @param {string} cwd The directory in which to execute the script.
 * @param {string} structurePath The path to the structure.
 * @param {string} script The string with a script and its arguments.
 */
const runOnCreate = async (cwd, structurePath, script) => {
  const { prog, args } = getProgWithArgs(script)
  const oc = resolve(structurePath, prog)

  let promise
  if (existsSync(oc)) {
    ({ promise } = fork(oc, args, {
      cwd,
      stdio: 'inherit',
      execArgv: [],
    }))
  } else {
    ({ promise } = spawn(prog, args, {
      cwd,
      stdio: 'inherit',
    }))
  }
  await promise
}

module.exports.getStructure = getStructure
module.exports.create = create
module.exports.getProgWithArgs = getProgWithArgs
module.exports.runOnCreate = runOnCreate