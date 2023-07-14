import SvgIcon from './SvgIcon.jsx';

const ClassTypeIcon = {
    view(ctrl, { icon, before, after }) {
        return icon && (<SvgIcon icon={ icon } before={ before } after={ after} />);
    }
};

export default ClassTypeIcon;