import './ChampionSection.scss';
import { RATINGS, GRADES, RANGES, DAMAGE_TYPES } from '../../data/guides';
import { ABILITY_VALUES } from '../../data/model/Ability';
import { abilityIcon } from '../../data/abilities';
import lang from '../../service/lang';
import ChampionGrade from './ChampionGrade.jsx';
import ChampionRating from './ChampionRating.jsx';
import ChampionSectionAddButton from './section/ChampionSectionAddButton.jsx';
import Icon from '../Icon.jsx';

function ChampionSection() {
    const editableText = (key, onEdit, noEdit) => noEdit.includes(key)
        ? ({})
        : ({
        'contenteditable': true,
        'class': 'champion-section-textarea',
        'oninput': (event) => onEdit(key, event.target.innerText.trim()),
        'onpaste': (event) => {
            event.preventDefault();
            const text = (event.originalEvent || event).clipboardData.getData('text/plain');
            document.execCommand('insertHTML', false, text);
        },
    });
    const editableValue = (value) => value === true ? '' : value;
    const editableSelect = (list, key, initialValue, onEdit) => (
        <select
            class="champion-section-select"
            onchange={ (event) => onEdit(key, event.target.selectedOptions[ 0 ].value) }
        >
            <option value=""/>
            {
                list.map((value) => (
                    <option
                        value={ `${ value }` }
                        selected={ initialValue && value === initialValue }
                    >{
                        value
                    }</option>
                ))
            }
        </select>
    );
    const editableSelectAdd = (list, key, array, stringify, image, onEdit) => [
        (
            <select
                class="champion-section-select champion-section-select-item"
                onchange={ (event) => onEdit(key, [
                                ...array,
                                event.target.selectedOptions[ 0 ].value,
                            ]) }
            >
                <option value="">+</option>
                {
                    list.map((value) => (
                        <option
                            value={ value }
                        >{
                            lang.string(stringify(value))
                        }</option>
                    ))
                }
            </select>
        ),
        array.length ? (
            <div class="champion-section-items">
                {
                    array.map((value, index) => (
                        <span
                            class="champion-section-item"
                            onclick={ () => onEdit(key, array.filter((v, i) => i !== index)) }
                        >
                                        { image && image(value) }{ lang.string(stringify(value)) }
                                    </span>
                    ))
                }
            </div>
        ) : null,
    ];

    function addSection(sections, index) {
        sections.splice(index, 0, {
            name: lang.string('name', 'Name'),
            description: lang.string('description', 'Description'),
            note: lang.string('note', 'Note'),
        });
    }

    function addSectionBefore(sections, section) {
        const indexOfSection = sections.indexOf(section);
        addSection(sections, indexOfSection);
    }

    function addSectionLast(sections) {
        addSection(sections, sections.length);
    }

    function deleteSection(sections, section) {
        const indexOfSection = sections.indexOf(section);
        sections.splice(indexOfSection, 1);
    }

    return {
        oninit(vnode) {
        },
        view(vnode) {
            const {
                title, icon, name, help, description, note, heavy,
                ranges, damagetypes, abilities, sections, button, noHeading,
                rating, grade, gradeAwakened,
                youtube,
                raw, onEdit, noEdit = [],
            } = vnode.attrs;
            const elements = [];
            if (!noHeading) {
                const headingDiv = onEdit ? (
                    <div style="float:right;">
                        { editableSelect(RATINGS, 'rating', Number.parseInt(rating, 10), onEdit) }
                        / 5
                    </div>
                ) : <ChampionRating rating={ rating }/>
                elements.push(
                    <div
                        role="section"
                        aria-label={ title }
                        class="champion-section-title"
                    >
                        { icon && (
                            <Icon icon={icon} before/>
                        ) || null }
                        { title }
                        { rating !== undefined ? headingDiv : null}
                    </div>);
            }
            if (grade) {
                elements.push(onEdit ?
                    (<div class="champion-section-text">
                        <b>{ lang.string('grade') }:</b>
                        { editableSelect(GRADES, 'grades.normal', grade, onEdit) }
                    </div>) : <ChampionGrade title="grade" grade={ grade }/>
                );
            }
            if (gradeAwakened) {
                elements.push(onEdit ?
                    (<div class="champion-section-text">
                        <b>{ lang.string('awakened') }:</b>
                        { editableSelect(GRADES, 'grades.awakened', gradeAwakened, onEdit) }
                    </div>) : <ChampionGrade title="awakened" grade={ gradeAwakened }/>
                );
            }
            if (name) {
                elements.push(onEdit ?
                    (<div class="champion-section-text">
                        <b {...editableText('name', onEdit, noEdit)}>{ m.trust(editableValue(name)) }</b>
                    </div>) :
                    (<div class="champion-section-text">
                        <b>{ name.replace('\n', '').trim() }</b>
                    </div>)
                );
            }
            if (help) {
                elements.push(
                    <div class="champion-section-text champion-section-text-description">{
                        help.replace(/(\s*\n\s*)+/g, '\n\n').trim()
                    }</div>
                );
            }
            if (sections) {
                sections.forEach((section) => {
                    if (onEdit) {
                        elements.push(<ChampionSectionAddButton onClick={ () => addSectionBefore(sections, section) } />);
                    }
                    const deleteButton = <div class="champion-section-button-container">
                            <button class="champion-section-button delete-button" onclick={ () => deleteSection(sections, section) }>
                                <Icon icon="minus" />
                            </button>
                        </div>;
                    elements.push(<ChampionSection
                        name={ section.name }
                        description={ section.description }
                        note={ section.note }
                        button={ deleteButton }
                        noHeading="true"
                        onEdit={ onEdit }
                        noEdit={ noEdit }
                    />);
                });
                if (onEdit) {
                    elements.push(<ChampionSectionAddButton onClick={ () => addSectionLast(sections) }/>);
                }
            }
            if (description) {
                elements.push(onEdit ?
                    <div class="champion-section-text champion-section-text-description">
                        <div {...editableText('description', onEdit, noEdit)}>{ m.trust(editableValue(description)) }</div>
                    </div> :
                    <div class="champion-section-text champion-section-text-description">{
                        description.replace(/(\s*\n\s*)+/g, '\n\n').trim()
                    }</div>
                );
            }
            if (heavy) {
                elements.push(onEdit ?
                    <div class="champion-section-text">
                        <b>{ lang.string('heavy-attack') }:</b>
                        <span {...editableText('heavy', onEdit, noEdit)}>{ m.trust(editableValue(heavy)) }</span>
                    </div> :
                    <div class="champion-section-text">
                        <b>{ lang.string('heavy-attack') }:</b>
                        <span>{ heavy.replace('\n', '').trim() }</span>
                    </div>
                );
            }
            if (ranges) {
                if (onEdit) {
                    elements.push(
                        <div class="champion-section-text">
                            <b>{ lang.string('range') }:</b>
                            { editableSelectAdd(
                                RANGES,
                                'ranges',
                                ranges === true ? [] : ranges,
                                (range) => `range-${ range }`,
                                onEdit
                            ) }
                        </div>
                    );
                }
                else if (ranges.length) {
                    elements.push(
                        <div class="champion-section-text">
                            <b>{ lang.string('range') }:</b>
                            { ranges.map((range, index) => (
                                <span class={ `champion-section-range champion-section-range-${ range }` }>{
                                    (index < ranges.length - 1)
                                        ? `${ lang.string(`range-${ range }`) }, `
                                        : lang.string(`range-${ range }`)
                                }</span>
                            )) }
                        </div>
                    );
                }
            }
            if (damagetypes) {
                if (onEdit) {
                    elements.push(
                        <div class="champion-section-text">
                            <b>{ lang.string('damage-type') }:</b>
                            { editableSelectAdd(
                                DAMAGE_TYPES,
                                'damagetypes',
                                damagetypes === true ? [] : damagetypes,
                                (damage) => `damage-${ damage }`,
                                onEdit
                            ) }
                        </div>
                    );
                }
                else if (damagetypes.length) {
                    elements.push(
                        <div class="champion-section-text">
                            <b>{ lang.string('damage-type') }:</b>
                            { damagetypes.map((damage, index) => (
                                <span class={ `champion-section-damage champion-section-damage-${ damage }` }>{
                                    (index < damagetypes.length - 1)
                                        ? `${ lang.string(`damage-${ damage }`) }, `
                                        : lang.string(`damage-${ damage }`)
                                }</span>
                            )) }
                        </div>
                    );
                }
            }
            if (abilities) {
                if (onEdit) {
                    elements.push(
                        <div class="champion-section-text">
                            <b>{ lang.string('abilities') }:</b>
                            { editableSelectAdd(
                                ABILITY_VALUES,
                                'abilities',
                                abilities === true ? [] : abilities,
                                (ability) => `ability-${ ability }-name`,
                                (ability) => abilityIcon(ability) && (
                                    <Icon icon={ abilityIcon(ability) } before/>
                                ) || null,
                                onEdit
                            ) }
                        </div>
                    );
                } else if (abilities.length) {
                    const abilitiesWithIcon = abilities.filter((ability) => abilityIcon(ability));
                    if (abilitiesWithIcon.length) {
                        elements.push(
                            <div class="champion-section-text">
                                <b>{ lang.string('abilities') }:</b>
                                { abilitiesWithIcon.map((ability, index) => {
                                        const icon = abilityIcon(ability);
                                        const abilityName = lang.string(`ability-${ ability }-name`);
                                        const abilityDescription = lang.string(`ability-${ ability }-description`);
                                        return <span
                                                class={ `champion-section-ability champion-section-ability-${ ability }` }
                                                title={ abilityDescription }>
                                                    <Icon icon={ icon } before after={ index !== 0 }/>
                                                        { abilityName }
                                                        {
                                                            (index < abilities.length - 1) ? ',' : ''
                                                        }
                                            </span>;
                                    }
                                )}
                            </div>
                        );
                    }
                }
            }
            if (youtube) {
                elements.push( onEdit ?
                    <div class="champion-section-text">
                        <b>{ lang.string('youtube-video') }:</b>
                        <span {...editableText('youtube', onEdit, noEdit)}>{ m.trust(editableValue(youtube)) }</span>
                    </div> :
                    <div class="champion-section-youtube">
                        <iframe
                            type="text/html"
                            width="640"
                            height="390"
                            src={ `//www.youtube.com/embed/${ youtube.replace('\n', '').trim() }?modestbranding=1` }
                            frameborder="0"
                        />
                    </div>
                );
            }
            if (note) {
                elements.push(onEdit ?
                    <div class="champion-section-text">
                        <b>{ lang.string('note') }:</b>
                        <span {...editableText('note', onEdit, noEdit)}>{ m.trust(editableValue(note)) }</span>
                    </div> :
                    <div class="champion-section-text">
                        <b>{ lang.string('note') }:</b>
                            <span>{
                                note.replace(/(\s*\n\s*)+/g, '\n\n').trim()
                            }</span>
                    </div>
                );
                if (onEdit && button) {
                    elements.push(button);
                }
            }
            if (raw) {
                elements.push(
                    <div class="champion-section-raw">{ raw }</div>
                );
            }
            return (
                <div
                    m="ChampionSection"
                    role="section"
                    class="champion-section"
                >
                    { elements }
                </div>
            );
        },
    };
}

export default ChampionSection;
