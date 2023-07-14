import classNames from 'classnames';

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