import SvgIcon from './SvgIcon.jsx';

function ClassTypeIcon() {
    return {
        view(vnode) {
            const { icon, before, after } = vnode.attrs;
            return icon && (<SvgIcon icon={ icon } before={ before } after={ after} />);
        },
    };
}

export default ClassTypeIcon;
