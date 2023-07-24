import appState from '../../../src/service/appState.js';
import { CHAMPION } from '../../../src/data/model/Champion';
import guides from '../../../src/data/guides.js';
import { forChampion } from '../../../src/data/synergies';
import lang from '../../../src/service/lang';

describe('GuidePage', () => {

    describe('When opening the Guide page for Kitty Pryde', () => {
        const KITTYPRYDE = CHAMPION.KITTYPRYDE;
        const appStateResult = appState().guidePage(KITTYPRYDE);
        const guidePage = mq(appStateResult.page, appStateResult.parameters);
        const guide = guides.getGuideFor(KITTYPRYDE);

        function assertSection(title, description, name) {
            const elementWithText = guidePage.find('.champion-section-title').find((element) => element.textContent === title);
            expect(elementWithText && elementWithText.textContent).to.equal(title);
            let nextElement = elementWithText.nextSibling;
            if (name) {
                expect(nextElement.textContent).to.equal(name);
                nextElement = nextElement.nextSibling;
            }
            expect(nextElement.textContent).to.equal(description.replace(/(\s*\n\s*)+/g, '\n\n').trim());
        }
        function getSynergiesText(ownSynergies) {
            const synergies = forChampion(KITTYPRYDE, ownSynergies);
            return synergies.map((synergy) => {
                const attributes = synergy.attr;
                const directionId = ownSynergies ? attributes.toId : attributes.fromId;
                const championName = lang.string(`champion-${directionId}-shortname`, lang.string(`champion-${directionId}-name`));
                const effectName = lang.string(`effect-${attributes.effectId}-name`, lang.string(`effect-${attributes.effectId}-type`));
                return `${attributes.fromStars}★${championName}${effectName}`;
            }).join('');
        }

        describe('then header should be showing', () => {
            const championName = 'Kitty Pryde';
            it('title', () => {
                expect(guidePage.first('.champion-header').title).to.equal(championName);
            });
            it('champion name', () => {
                expect(guidePage.first('.champion-header-name').textContent).to.equal(championName);
            });
            it('full size image', () => {
                expect(guidePage.first('.champion-header').innerHTML).to.include(`fullsize_${KITTYPRYDE}.png`);
            });
            it('portrait image', () => {
                expect(guidePage.first('.champion-header').innerHTML).to.include(`portrait_${KITTYPRYDE}.png`);
            });
        });
        it('then description should be showing', () => {
            assertSection('Description', guide.description);
        });
        it('then gameplay should be showing', () => {
            assertSection('Gameplay', guide.gameplay.description);
        });
        it('then special 1, special 2, special 3 should be showing', () => {
            [ 1, 2, 3 ].forEach((index) => {
                assertSection(`Special ${index}`, guide.specials[ index ].description, guide.specials[ index ].name);
            });
        });
        it('then signature ability should be showing', () => {
            assertSection('Signature Ability', guide.signature.description, guide.signature.name);
        });
        it('then synergies should be showing', () => {
            const allSynergiesText = getSynergiesText(true);
            assertSection('Synergies', allSynergiesText);
        });
        it('then external synergies should be showing', () => {
            const allExternalSynergiesText = getSynergiesText(false);
            assertSection('External Synergies', allExternalSynergiesText);
        });
        it('then champion spotlight should be showing', () => {
            guidePage.should.contain('Spotlight by');
            expect(guidePage.first('.guide-author').firstElementChild.href).to.equal('https://playcontestofchampions.com/champion-spotlight-kitty-pryde/');
        });
    });

    describe('When opening the menu, ', () => {
        it('clicking Mystic, clicking on Diablo, then Diablo should be shown as Champion and Diablo should be selected in the menu', () => {
        });
    });
});
