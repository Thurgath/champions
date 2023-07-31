import './ImageIcon.scss';
import { getTypeColor } from '../service/graph';
import classNames from 'classnames';
import Icon from './Icon.jsx';
import { loadImages } from '../images';

function ImageIcon() {
    return {
        oninit(vnode) {
            loadImages(vnode, vnode.attrs.src);
        },
        onbeforeupdate(newVnode, oldVnode) {
            if (oldVnode.attrs.src !== newVnode.attrs.src) {
                this.oninit(newVnode);
                return true;
            }
            return false;
        },
        view(vnode) {
            const { src, icon, type, before, after } = vnode.attrs;
            const image = vnode.state.images[ src ];
            if (!image || (!image.loaded && icon)) {
                return (
                    <Icon icon={ icon } before={ before } after={ after } type={ type }/>
                );
            }
            let style = '';
            if (type) {
                style = `border-bottom: solid 3px ${ getTypeColor(type) }`;
            }
            return src && (
                <div
                    style={ style }
                    class={ classNames('image-icon', {
                        'image-icon--before': before,
                        'image-icon--after': after,
                    }) }
                >
                    <img class={ classNames('image') } src={ image.src }/>
                </div>
            );
        },
    };
}

export default ImageIcon;
