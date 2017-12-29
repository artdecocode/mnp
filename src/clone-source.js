const { clone } = require('wrote')
const camelCase = require('camel-case')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

function getDefaultCreateDate() {
    const d = new Date()
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

async function cloneSource(from, to, {
    org,
    packageName,
    year,
    website,
    issuesUrl = `https://github.com/${org}/${packageName}/issues`,
    readmeUrl = `https://github.com/${org}/${packageName}#readme`,
    authorName,
    authorEmail,
    gitUrl = `git+https://github.com/${org}/${packageName}.git`,
    keywords = [packageName],
    description,
    createDate = getDefaultCreateDate(),
} = {}) {
    const keywordsReplacement = keywords.map(k => `"${k}"`).join(', ').replace(/^"/, '').replace(/"$/, '')
    const regexes = [
        {
            re: /myNewPackage/g,
            replacement: camelCase(packageName),
        }, {
            re: /my-new-package/g,
            replacement: packageName,
        }, {
            re: /{{ year }}/g,
            replacement: year,
        }, {
            re: /{{ org }}/g,
            replacement: org,
        }, {
            re: /{{ website }}/g,
            replacement: website,
        }, {
            re: /{{ issues_url }}/g,
            replacement: issuesUrl,
        }, {
            re: /{{ readme_url }}/g,
            replacement: readmeUrl,
        }, {
            re: /{{ author_name }}/g,
            replacement: authorName,
        }, {
            re: /{{ author_email }}/g,
            replacement: authorEmail,
        }, {
            re: /{{ keywords }}/g,
            replacement: keywordsReplacement,
        }, {
            re: /{{ git_url }}/g,
            replacement: gitUrl,
        }, {
            re: /{{ description }}/g,
            replacement: description,
        },
        {
            re: /{{ create_date }}/g,
            replacement: createDate,
        },
    ]
    const res = await clone({
        to,
        from,
        regexes,
    })
    return res
}

module.exports = cloneSource
