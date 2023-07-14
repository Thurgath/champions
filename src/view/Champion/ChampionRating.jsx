import './ChampionRating.scss';

const ChampionRating = {
    controller: function(data) {
    },
    view(ctrl, { rating }) {
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

export default ChampionRating;
