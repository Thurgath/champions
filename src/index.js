import './index.jsx';
import PACKAGE from '../package.json';

/* eslint-disable no-console */
global.console && console.info && console.info(`${ PACKAGE.description } v${ PACKAGE.version }`);
/* eslint-enable no-console */

