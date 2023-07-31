import './ChampionRating.scss';

function ChampionRating() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { rating } = vnode.attrs;
            return (
                <div
                    m="ChampionRating"
                    class="champion-rating"
                >
                    <span class={ `champion-rating--value-${ rating }` }>
                        { rating }
                    </span> / 5
                </div>
            );
        },
    };
}

export default ChampionRating;
