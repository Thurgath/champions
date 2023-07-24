import classNames from 'classnames';
import './Icon.scss';

function BrandIcon(initialVnode) {
    return {
        view(vnode) {
            const {icon, before, after} = vnode.attrs;
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
        },
    };
};

export default BrandIcon;