import './Slides.scss';
import classNames from 'classnames';

function Slides() {
    return {
        oninit(vnode) {
            vnode.state.currentSlide = vnode.attrs.current;
        },
        view(vnode) {
            const { slides, current } = vnode.attrs;
            if (slides.length === 0) {
                return;
            }
            return (
                <div m="Slides" class="slides">
                    { slides.map((slide, index) => {

                        return (
                            <div id={ slide } class={ classNames('slide', {
                                'slide-previous': index < current,
                                'slide-current': index === current,
                                'slide-next': index > current,
                            }) }>
                            </div>
                        );
                    }) }
                </div>
            );
        },
    };
}

export default Slides;
