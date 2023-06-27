import SvgIcon from './SvgIcon.jsx';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

const ClassTypeIcon = {
    view(ctrl, { icon, before, after }) {
        return icon && (<SvgIcon icon={ icon } before={ before } after={ after} />);
    }
};

export default ClassTypeIcon;