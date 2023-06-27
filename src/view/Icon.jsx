import classNames from 'classnames';
import SvgIcon from './SvgIcon.jsx';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */
import './Icon.scss';

const svgIcons = require
    .context('../icons', true, /\.svg$/)
    .keys()
    .map((filename) => filename.replace(/.*\//g, '').replace(/\.svg$/, ''))
    .reduce((map, key) => {
        map[ key ] = true;
        return map;
    }, {});

function isSvgIcon(icon) {
    return svgIcons[ icon ] !== undefined;
}

const Icon = {
    view(ctrl, { icon, spin, before, after }) {
        if (isSvgIcon(icon)) {
            return <SvgIcon icon={ icon } before={ before } after={ after}  />
        }
        const isSpinning = spin && (typeof spin === 'function')? spin(): spin;

        return icon && (
            <i
                m="Icon"
                class={ classNames(
                    'font-icon fa-solid',
                    `fa-${ icon }`,
                    {[ 'fa-spin' ]: isSpinning,
                    'font-icon--before': before,
                    'font-icon--after': after,
                }) }
            />
        );
    },
};

export default Icon;
