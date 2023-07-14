import './ChampionGrade.scss';
import lang from '../../service/lang';

const ChampionGrade = {
    controller: function(data) {
    },
    view(ctrl, { title, grade }) {
        return (
            <div m="ChampionGrade" class="champion-grade">
                <b>{ lang.string(title) }:</b>
                <span class={ `champion-grade--value-${ grade[ 0 ].toLowerCase() }` }>
                    { grade }
                </span>
            </div>
        );
    },
};

export default ChampionGrade;
