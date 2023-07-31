import './ChampionGrade.scss';
import lang from '../../service/lang';

function ChampionGrade() {
    return {
        oninit(vnode) {
        },
        view(vnode) {
            const { title, grade } = vnode.attrs;
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
}

export default ChampionGrade;
