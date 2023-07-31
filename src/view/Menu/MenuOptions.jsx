import lang from '../../service/lang';
import MenuSection from './MenuSection.jsx';
import MenuOptionGroup from './MenuOptionGroup.jsx';
import MenuOption from './MenuOption.jsx';
import Icon from '../Icon.jsx';
import BrandIcon from '../BrandIcon.jsx';
import ImageIcon from '../ImageIcon.jsx';
import appState from '../../service/appState.js';

function MenuOptions() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { menu, parameters } = vnode.attrs;
            const options = [];
            const tabs = appState().getTabs();
            const currentTab = appState().getCurrentTab();
            options.push(
                <div class="menu-tabs">
                    <MenuOptionGroup
                        options={ tabs.filter((tab) => !tab.isHidden()).map((tab) => (
                            <MenuOption
                                info={ tab.getTitle() }
                                icon={
                                    <Icon icon={ tab.getIcon() } />
                                }
                                selected={ currentTab.getId() === tab.getId() }
                                href={ `/${ tab.getId() }` }
                            />
                        )) }
                        tabs="true"
                    />
                </div>
            );
            //Menu placeholder
            options.push(
                <div>
                    { m(menu, parameters) }
                </div>
            );
            //language
            options.push(
                <MenuSection
                    icon={
                        <Icon icon="globe" before />
                    }
                    title="language"
                />
            );
            for (const id in lang.messages) {
                const selectLanguage = lang.change.bind(lang, id);
                options.push(
                    <MenuOption
                        selected={ lang.current === id }
                        icon={
                            <ImageIcon src={ `images/lang/${ id }.png` } icon="flag" before />
                        }
                        raw={ lang.messages[ id ].lang }
                        onclick={ selectLanguage }
                    />
                );
            }
            // links
            options.push(
                <MenuSection
                    icon={
                        <Icon icon="share" before />
                    }
                    title="links"
                />
            );
            options.push(
                <MenuOption
                    icon={
                        <Icon icon="bomb" before />
                    }
                    title="link-kabam"
                    href="https://forums.playcontestofchampions.com/en/discussions"
                />
            );
            options.push(
                <MenuOption
                    icon={
                        <BrandIcon icon="wikipedia-w" before />
                    }
                    title="link-wikia"
                    href="http://marvel-contestofchampions.wikia.com/wiki/"
                />
            );
            options.push(
                <MenuOption
                    icon={
                        <Icon icon="trophy" before />
                    }
                    title="link-auntm.ai"
                    href="https://www.auntm.ai/"
                />
            );
            options.push(
                <MenuOption
                    icon={
                        <BrandIcon icon="github" before />
                    }
                    title="link-github"
                    href="https://github.com/hook/champions"
                />
            );
            // links
            options.push(
                <MenuSection
                    icon={
                        <Icon icon="share-alt" before />
                    }
                    title="share-to"
                />
            );
            const escapedUrl = encodeURIComponent('https://hook.github.io/champions');
            options.push(
                <MenuOptionGroup
                    options={[
                        (
                            <MenuOption
                                icon={
                                    <BrandIcon icon="facebook-f" before />
                                }
                                href={ `http://www.facebook.com/sharer/sharer.php?u=${ escapedUrl }` }
                            />
                        ),
                        (
                            <MenuOption
                                icon={
                                    <BrandIcon icon="twitter" before />
                                }
                                href={ `https://twitter.com/share?url=${ escapedUrl }` }
                            />
                        ),
                        (
                            <MenuOption
                                icon={
                                    <BrandIcon icon="pinterest-p" before />
                                }
                                href={ `http://pinterest.com/pin/create/link/?url=${ escapedUrl }` }
                            />
                        ),
                        (
                            <MenuOption
                                icon={
                                    <BrandIcon icon="linkedin" before />
                                }
                                href={ `https://www.linkedin.com/cws/share?url=${ escapedUrl }` }
                            />
                        ),
                    ]}
                />
            );
            return (
                <div class="menu-options">
                    { options }
                </div>
            );
        },
    };
}

export default MenuOptions;
