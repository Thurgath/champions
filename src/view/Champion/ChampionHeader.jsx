import './ChampionHeader.scss';
import classNames from 'classnames';
import ClassTypeIcon from '../ClassTypeIcon.jsx';
import ImageIcon from '../ImageIcon.jsx';
import { loadImages, IMAGE_STAR, IMAGE_STAR_AWAKENED } from '../../images';
import lang from '../../service/lang';

function ChampionHeader(initialVnode) {
    return {
        oninit(vnode) {
            const {uid} = vnode.attrs.champion.attr;
            vnode.state.fullsizePortrait = `../images/champions/fullsize_${ uid }.png`;
            vnode.state.portrait = `images/champions/portrait_${ uid }.png`;
            loadImages(vnode, vnode.state.fullsizePortrait,
                vnode.state.portrait,
                IMAGE_STAR_AWAKENED, IMAGE_STAR,
            );
        },
        view(vnode) {
            const {uid, stars, typeId, awakened} = vnode.attrs.champion.attr;
            const name = lang.string(`champion-${ uid }-name`);
            const starIcon = awakened ? IMAGE_STAR_AWAKENED : IMAGE_STAR;
            const starImages = [];
            for (let index = 0; index < stars; index++) {
                starImages.push(
                    <ImageIcon key={ `champion-header-star-icon-${index}` }
                        src={ starIcon }
                        icon="star"
                    />
                );
            }
            const image = vnode.state.images[vnode.state.fullsizePortrait];
            let imageStyle;
            if (image.loaded) {
                imageStyle = `background-image: url("${ image.src }");`;
            }
            const portrait = vnode.state.images[vnode.state.portrait];
            let portraitStyle;
            if (portrait.loaded) {
                portraitStyle = `background-image: url("${ portrait.src }");`;
            }
            return (
                <div
                    m="ChampionHeader"
                    role="banner"
                    aria-label={ lang.string(`champion-${ uid }-name`) }
                    class="champion-header"
                    title={ lang.string(`champion-${ uid }-name`) }
                >
                    <div
                        class={ classNames('champion-header-image',
                        'champion-header-image-portrait', {
                            'champion-header-image--loaded': portrait,
                        }
                    ) }
                        style={ portraitStyle }
                    />
                    <div
                        class={ classNames('champion-header-image', {
                        'champion-header-image--loaded': image,
                    }) }
                        style={ imageStyle }
                    />
                    <div class="champion-header-name">
                        <span class={ classNames('champion-header-name-type', `champion--${ typeId }`) }>
                            <ClassTypeIcon class="type" icon={ `type-${ typeId }` } before/>
                        </span>
                        { name }
                    </div>
                    <div
                        class={ classNames('champion-header-stars',
                           { 'champion-header-stars--awakened': awakened }
                        ) }
                    >
                        { starImages }
                    </div>
                    <div class={ classNames('champion-header-type', `champion--${ typeId }`)}/>
                </div>
            );
        },
    };
};

export default ChampionHeader;
