const mothor = require('./mothor.js');
const fs = require('fs');

const run = (program, env) => {
    if (typeof program === 'string' && fs.existsSync(program))
        return mothor.run(fs.readFileSync(program), run);
    else 
        return mothor.run(program, env);
};