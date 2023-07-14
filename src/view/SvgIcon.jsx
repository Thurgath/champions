import classNames from 'classnames';
import './Icon.scss';
import '../icons.font';

const SvgIcon = {
    view(ctrl, { icon, before, after }) {
        return icon && (
                <i m="SvgIcon"
                   class={ classNames(
                'icon font-icon champion-icon',
                `champion-icon-${ icon }`,
                {'font-icon--before': before,
                'font-icon--after': after
                })
                }
                />
            );
    }
};

export default SvgIcon;