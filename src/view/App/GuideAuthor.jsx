import BrandIcon from '../BrandIcon.jsx';
import Icon from '../Icon.jsx';
import lang from '../../service/lang';

const GuideAuthor = {
    view(vnode) {
        const { name, type, profile } = vnode.attrs;
        let byline = 'profile-by';
        let href;
        let icon;
        let iconType = Icon;
        if (type) {
            switch(type) {
                case 'reddit': {
                    icon = 'reddit-alien';
                    iconType = BrandIcon
                    if(profile)
                        href = `http://reddit.com/u/${ profile }`;
                    break;
                }
                case 'kabam': {
                    icon = 'bomb';
                    if(profile)
                        href = `http://community.kabam.com/forums/member.php?${ profile }`;
                    break;
                }
                case 'spotlight': {
                    byline = 'profile-spotlight-by';
                    icon = 'bomb';
                    if(profile)
                        href = `${ profile }`;
                    break;
                }
                case 'email': {
                    icon = 'envelope';
                    if(profile)
                        href = `mailto:${ profile }`;
                    break;
                }
            }
        }
        return (
            <div m="GuideAuthor" class="guide-author">
                { `${ lang.string(byline) } ` }
                <a href={ href } target="_blank">
                    { icon && m(iconType, { icon: icon }) }
                    { name }
                </a>
            </div>
        );
    },
};

export default GuideAuthor;
