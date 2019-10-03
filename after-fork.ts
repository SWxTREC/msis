/**
 * This script automates many of the post-fork tasks and shows further instructions to the user, which are at `after-fork.instructions`.
 * This should only be run as part of the "after-fork" npm script.
 */

import * as fs from 'fs';
import * as readline from 'readline';
const replaceInFile = require( 'replace-in-file' );

const allChangedFiles = [];

// prepare to prompt the user via stdin
const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Converts readline's `question` method to use a promise instead of a callback.
 * Takes a question to ask the user via command line and returns a Promise which resolves with the user's answer
 */
function question( read: readline.ReadLine, q: string ): Promise<string> {
    return new Promise( resolve => {
        read.question( q + '\n', answer => resolve(answer) );
    });
}

/** Takes an options object which is passed to the 'replace-in-file' method, and records the files which were changed */
async function replace( options: any ): Promise<void> {
    const scannedFiles: { hasChanged: boolean, file: string }[] = await replaceInFile( options );
    const changedFiles = scannedFiles.filter( scanned => scanned.hasChanged ).map( scanned => scanned.file );
    // record the changed files in a global variable
    allChangedFiles.push( ...changedFiles );
}

( async() => {
    // prompt the user for some answers
    const projectNamePlain = await question( reader, 'What is the name of your project? (i.e. "MinXSS SDC")' );
    const projectNameKebab = await question( reader, 'What is the name of your project in kebab-case? (i.e. "minxss-sdc")' );
    // convert kebab-case to camelCase
    const projectNameCamel = projectNameKebab.replace( /-[a-z]/g, substr => {
        // remove the dash and capitalize the letter after the dash
        return substr[1].toUpperCase();
    });
    const analyticsId = await question(
        reader,
        'What Google Analytics tracking ID will your project use? (i.e. UA-#######-#)\n' +
        '  (leave blank if the site will be hosted under lasp.colorado.edu)'
    );

    // replace instances of the generic "base app" name throughout the project

    // replace camel-case instances
    await replace({
        files: [ 'angular.json', 'package.json', 'e2e/**/*', 'src/**/*' ],
        from: /base-app/g,
        to: projectNameKebab
    });

    // revert some camel-case instances, which are URLs that still need the 'base-app' string in them
    await replace({
        files: [ 'src/**/*' ],
        from: new RegExp( `lasp.colorado.edu/media/projects/${projectNameKebab}/`, 'g' ),
        to: 'lasp.colorado.edu/media/projects/base-app/'
    });

    // replace camelCase instances
    await replace({
        files: [ 'src/**/*' ],
        from: /baseApp/g,
        to: projectNameCamel
    });

    // replace plain-english instances
    await replace({
        files: [ 'src/**/*' ],
        from: /BaseApp/g,
        to: projectNamePlain
    });

    // replace '{{Project-Name}}' in after-fork.README.md
    await replace({
        files: [ 'after-fork.README.md' ],
        from: new RegExp( '{{Project-Name}}', 'g' ),
        to: projectNamePlain
    });

    // remove the "after-fork" script from package.json
    await replace({
        files: [ 'package.json' ],
        from: /\n\s*"after-fork":.*/,
        to: ''
    });

    // set the version to 0.0.0
    await replace({
        files: [ 'package.json' ],
        from: /"version":[^,]*/,
        to: `"version": "0.0.0"`
    });

    // change google analytics ID
    if ( analyticsId.length > 0 ) {
        await replace({
            files: [ 'src/environments/environment.prod.ts' ],
            from: 'UA-8868040-1',
            to: analyticsId
        });
    }

    const uniqueChangedFiles = new Set( allChangedFiles );
    console.log( '\nChanged content in ' + uniqueChangedFiles.size + ' files.' );

    // replace README.md
    await fs.unlinkSync( 'README.md' );
    await fs.renameSync( 'after-fork.README.md', 'README.md' );
    console.log( 'Replaced README.md with after-fork.README.md' );

    // show additional instructions
    const instructions = await fs.readFileSync( 'after-fork.instructions' ).toString();
    const yellowEscSeq = '\x1b[33m'; // causes output text to be yellow
    const resetEscSeq = '\x1b[0m';
    console.log( `${yellowEscSeq}\n${instructions}\n${resetEscSeq}` );

    // self destruct
    [ 'after-fork.instructions', 'after-fork.ts', 'after-fork.js' ].forEach( file => fs.unlinkSync(file) );

    process.exit();
})();
