import './SynergyPage.scss';
import classNames from 'classnames';
import { effectIcon } from '../../data/effects';
import graph, { getLegend, updateGraph, getEffectColor } from '../../service/graph';
import lang from '../../service/lang';
import * as synergyOptions from '../../service/synergy';
import Icon from '../Icon.jsx';
import { loadImages } from '../../images';
import CHAMPIONS from '../../data/champions';

function SynergyPage() {
    return {
        oninit(vnode) {
        },
        oncreate(vnode) {
            const { stars, effect } = vnode.attrs;
            const useRoster = synergyOptions.getRoster();
            const championPortraitsToLoad = CHAMPIONS.map((champion) => `../images/champions/portrait_${ champion.attr.uid }.png`)
                //Remove duplicates
                .filter((imageSource, index, array) => array.indexOf(imageSource) === index);
            loadImages(vnode, ...championPortraitsToLoad).then(() => {
                const definition = { stars, effect, useRoster };
                const { top, left, width, height } = vnode.dom.getBoundingClientRect();
                vnode.dom.appendChild(graph.canvas);
                updateGraph(definition, vnode.state.images, top, left, width, height);
            });
        },
        view(vnode) {
            const { stars, effect } = vnode.attrs;
            const useRoster = synergyOptions.getRoster();
            const legend = getLegend({ stars, effect, useRoster });
            return (
                <div m="SynergyPage" class="synergy">
                    <div class={ classNames('legend', { 'legend--hidden': !synergyOptions.getLegend() }) }>
                        { legend && legend.map(({ effectId, selected, amount }) => (
                            <div
                                class={ classNames('no-select',
                                    'legend-effect',
                                    `legend-effect--${ effectId }`,
                                    { 'legend-effect--selected': selected }
                                ) }
                                style={ `border-color: ${ getEffectColor(effectId) }` }
                                onclick={ () => {
                                    graph.selectEdgeType(effectId);
                                }}
                                title={ lang.string(`effect-${ effectId }-description`) }
                            >
                                <Icon icon={ effectIcon(effectId) } before/>
                                <span class="legend-effect-title">
                                    { lang.string(`effect-${ effectId }-name`, null) || lang.string(`effect-${ effectId }-type`) }
                                    { amount && ` - ${ amount }%` }
                                </span>
                            </div>
                        )) || null }
                        { legend && legend.length === 0 && (
                            <div
                                class={ classNames('no-select', 'legend-effect', 'legend-effect--none') }
                                title={ lang.string('effects-none') }
                            >
                                <Icon icon="times-circle" before/>
                                <span class="legend-effect-title">
                                    <i>{ lang.string('effects-none') }</i>
                                </span>
                            </div>
                        ) || null }
                    </div>
                </div>
            );
        },
    };
}

export default SynergyPage;
