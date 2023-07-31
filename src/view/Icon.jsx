import classNames from 'classnames';
import SvgIcon from './SvgIcon.jsx';
import './Icon.scss';

function Icon() {

    const svgIcons = new Map();

    function isSvgIcon(icon) {
        return svgIcons[ icon ] !== undefined;
    }

    return {
        oninit(vnode) {
            require
                .context('../icons', true, /\.svg$/)
                .keys()
                .map((filename) => filename.replace(/.*\//g, '').replace(/\.svg$/, ''))
                .reduce((map, key) => {
                    map[ key ] = true;
                    return map;
                }, svgIcons);
        },
        view(vnode) {
            const { icon, spin, before, after } = vnode.attrs;
            if (isSvgIcon(icon)) {
                return <SvgIcon icon={ icon } before={ before } after={ after} />;
            }
            const isSpinning = spin && (typeof spin === 'function')? spin(): spin;

            return icon && (
                <i
                    m="Icon"
                    class={ classNames(
                        'font-icon fa-solid',
                        `fa-${ icon }`,
                        { [ 'fa-spin' ]: isSpinning,
                            'font-icon--before': before,
                            'font-icon--after': after,
                        }) }
                />
            );
        },
    };
}

export default Icon;
