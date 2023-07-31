import './TeamsSettingsPage.scss';
import effects, { effectIcon } from '../../data/effects';
import teams from '../../service/teams';
import lang from '../../service/lang';
import Icon from '../Icon.jsx';
import Checkbox from './ui/Checkbox.jsx';
import Field from './ui/Field.jsx';
import Slider from './ui/Slider.jsx';

function TeamsSettingsPage() {
    const DUPLICATE_TITLES = {
        2: 'double',
        3: 'triple',
        4: 'quadruple',
        5: 'quintuple',
    };

    return {
        oninit(vnode) {
        },
        view() {
            return (
                <div m="TeamsSettingsPage" class="teams-settings">
                    <div class="teams-settings-section">
                        <div class="header">
                            { lang.string('general-settings') }
                        </div>
                        <Field
                            title={ lang.string('arena-sandbagging') }
                            icon={(
                                <Icon icon="users" before />
                            )}
                            description={ lang.string('arena-sandbagging-description') }
                            inputComponent={ Checkbox }
                            inputParameters={ { object: teams, field: 'sandbagging' } }
                        />

                        <Field
                            title={ lang.string('willpower-safe') }
                            icon={(
                                <Icon icon="user-secret" before />
                            )}
                            description={ lang.string('willpower-safe-description') }
                            inputComponent={ Checkbox }
                            inputParameters={ { object: teams, field: 'willpowersafe' } }
                        />
                        <Field
                            title={ lang.string('base-weight') }
                            icon={(
                                <Icon icon="database" before />
                            )}
                            description={ lang.string('base-weight-description') }
                            input={
                                <Slider
                                    object={ teams.weights }
                                    field={ 'base' }
                                    toInputValue={ (value) => value * 1000 }
                                    fromInputValue={ (value) => value / 1000 }
                                />
                            }
                            value={ (teams.weights[ 'base' ] * 1000 | 0) / 10 }
                        />
                    </div>
                    <div class="teams-settings-section">
                        <div class="header">
                            { lang.string('synergy-weights') }
                        </div>
                        { effects.map(({ attr }) => (
                            <Field
                                title={ lang.string(`effect-${ attr.uid }-name`, null) || lang.string(`effect-${ attr.uid }-type`) }
                                description={ lang.string(`effect-${ attr.uid }-description`, null) }
                                icon={(
                                    <Icon icon={ effectIcon(attr.uid) } before />
                                )}
                                input={
                                    <Slider
                                        object={ teams.weights }
                                        field={ attr.uid }
                                        toInputValue={ (value) => value * 1000 }
                                        fromInputValue={ (value) => value / 1000 }
                                    />
                                }
                                value={ (teams.weights[ attr.uid ] * 1000 | 0) / 10 }
                            />
                        )) }
                    </div>
                    <div class="teams-settings-section">
                        <div class="header">
                            { lang.string('duplicate-weights') }
                        </div>
                        { [ 2, 3, 4, 5 ].map((count) => (
                            <Field
                                title={ `${ lang.string(DUPLICATE_TITLES[ count ]) }` }
                                icon={(
                                    <span class="field-name--bold">{ `${ count }x ` }</span>
                                )}
                                input={
                                    <Slider
                                        object={ teams.weights }
                                        field={ `duplicates-${ count }` }
                                        toInputValue={ (value) => value * 1000 }
                                        fromInputValue={ (value) => value / 1000 }
                                    />
                                }
                                value={ (teams.weights[ `duplicates-${ count }` ] * 1000 | 0) / 10 }
                            />
                        )) }
                    </div>
                    <div class="teams-settings-section">
                        <div class="header">
                            { lang.string('pi-range') }
                        </div>
                        { [
                            { which: 'minimum-champion', iconType: 'user', icon: 'step-backward', maximum: 20000 },
                            { which: 'maximum-champion', iconType: 'user', icon: 'step-forward', maximum: 20000 },
                            { which: 'minimum-team', iconType: 'users', icon: 'step-backward', maximum: 100000 },
                            { which: 'maximum-team', iconType: 'users', icon: 'step-forward', maximum: 100000 },
                        ].map(({ which, iconType, icon, maximum }) => (
                            <Field
                                title={ lang.string(`pi-range-${ which }`) }
                                icon={[
                                    (
                                        <Icon icon={ iconType } before />
                                    ),
                                    (
                                        <Icon icon={ icon } before />
                                    ),
                                ]}
                                input={
                                    <Slider
                                        object={ teams.range }
                                        field={ which }
                                        toInputValue={ (value) => 1000 * value / maximum }
                                        fromInputValue={ (value) => maximum * value / 1000 }
                                    />
                                }
                                value={ teams.range[ which ] | 0 }
                                hasLargeValue
                            />
                        )) }
                    </div>
                    <div class="clear"/>
                </div>
            );
        },
    };
}
export default TeamsSettingsPage;
