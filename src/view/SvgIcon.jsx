import classNames from 'classnames';
import './Icon.scss';
import '../icons.font';

function SvgIcon() {
    return {
        view(vnode) {
            const { icon, before, after } = vnode.attrs;
            return icon && (
                <i m="SvgIcon"
                    class={ classNames(
                        'icon font-icon champion-icon',
                        `champion-icon-${ icon }`,
                        { 'font-icon--before': before,
                            'font-icon--after': after })
                    }
                />
            );
        },
    };
}

export default SvgIcon;
