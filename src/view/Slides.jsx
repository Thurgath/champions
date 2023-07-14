import './Slides.scss';
import classNames from 'classnames';

const Slides = {
    controller: function(data) {
    },
    view(ctrl, { slides, current }) {
        return (
            <div m="Slides" class="slides">
                    { slides.map((slide, index) => {

                        return (
                            <div class={ classNames('slide', {
                                'slide-previous': index < current,
                                'slide-current': index === current,
                                'slide-next': index > current,
                            }) }>
                                { (index === current)? slide: { subtree: 'retain' } }
                            </div>
                        );
                    }) }
            </div>
        );
    },
};

export default Slides;
