import classNames from 'classnames';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

import './Icon.scss';

const BrandIcon = {
    view(ctrl, { icon, before, after }) {
        return icon && (
                <i m="BrandIcon"
                   class={ classNames(
                'font-icon fa-brands',
                `fa-${ icon }`,
                {'font-icon--before': before,
                'font-icon--after': after
                })
                }
                />
            );
    }
};

export default BrandIcon;