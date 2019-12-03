const { writeFileSync, readFileSync } = require('fs');
const { join, dirname } = require('path');

module.exports={
  license: {
    text: 'Choose a license (e.g., agpl-3.0, apache-2.0, bsd-3-clause, gpl-3.0, mit, custom)\nSee full list at https://github.com/mnpjs/licenses\nLicense',
    getDefault() {
      return 'agpl-3.0'
    },
    // https://spdx.org/licenses/
    afterQuestions({ warn, addFile, resolve: res }, license) {
      if (license == 'custom') return {
        name: 'SEE LICENSE IN LICENSE',
        spdx: 'SEE LICENSE IN LICENSE',
      }
      const r = require('@mnpjs/licenses')
      const e = license in r
      if (!e) {
        warn(`Unknown license ${license}, settings custom`)
        return {
          name: 'SEE LICENSE IN LICENSE',
          spdx: 'SEE LICENSE IN LICENSE',
        }
      }

      const l = join(dirname(require.resolve('@mnpjs/licenses/package.json')), 'licenses', `${license}.txt`)
      const li = readFileSync(l, 'utf8')
      writeFileSync(res('LICENSE'), li)
      addFile('LICENSE')
      return {
        license_spdx: r[license].spdx,
        license_name: r[license].name,
      }
    },
  },
  wiki: {
    text: 'Init Github Wiki',
    confirm: true,
    async afterQuestions({ confirm, spawn, warn }, answer, { name, org }) {
      if (answer) {
        const a = await confirm(`Please go to https://github.com/${org}/${name}/wiki/_new
to create the first page and press enter when done.`)
        if (!a) return warn('Wiki not created.')
        const m = `git@github.com:${org}/${name}.wiki.git`
        await spawn('git', ['submodule', 'add', m, 'wiki'])
        return m
      }
    },
  },
  homepage: {
    text: 'Homepage',
    getDefault({ repo }) {
      // give a choice here
      // - https://github.com/mnpjs/package#readme
      // - https://mnpjs.github.io/package
      // - https://mnpjs.org
      return `${repo.html_url}#readme`
    },
    async afterQuestions({ github, loading }, homepage, { repo, org, name }) {
      const def = `${repo.html_url}#readme`
      if (def == homepage) return
      await loading('Setting GitHub homepage', github.repos.edit(org, name, {
        homepage,
      }))
    },
  },
  keywords: {
    getText: ({ org, name }) => `Keywords (e.g., ${org}, ${name})`,
    async afterQuestions({ warn, loading, packageJson, updatePackageJson, github }, answer, { name, org }) {
      if (!answer) return
      const tags = answer.split(',').map(a => a.trim())
      if (!tags.length) return
      packageJson.keywords = tags
      updatePackageJson(packageJson)
      const { body, statusCode, statusMessage } = await loading('Setting topics', github._request({
        endpoint: `/repos/${org}/${name}/topics`,
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        data: {
          names: tags,
        },
      }))
      if (statusCode != 200) {
        warn('Could not set GitHub topics: %s:%s', statusCode, statusMessage)
        warn(JSON.stringify(body, null, 2))
      }
    },
  },
}