import Icon from '../../Icon.jsx';

function ChampionSectionAddButton() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { onClick } = vnode.attrs;
            return (
                <div class="champion-section-button-container">
                    <button class="champion-section-button add-button" onclick={ onClick }>
                        <Icon icon="plus" />
                    </button>
                </div>
            );
        },
    };
}

export default ChampionSectionAddButton;
