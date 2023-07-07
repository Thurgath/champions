import './index.jsx';
import { requestRedraw } from './util/animation';
import PACKAGE from '../package.json';

/* eslint-disable no-console */
global.console && console.info && console.info(`${ PACKAGE.description } v${ PACKAGE.version }`);
/* eslint-enable no-console */

const handleReload = () => requestRedraw(10);
window.addEventListener('resize', handleReload, true);
