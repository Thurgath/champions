import { readFileSync, existsSync, writeFileSync } from 'fs';

class LangJsonFileToGuides {
    #tagsToRemoveRegExp = /(champion\-special\-([\d\w]+)\-\d)|(champion\-([\d\w]+)\-description)|(champion\-signature\-([\d\w]+)\-(name|description))/;
    #emptyGuide = {
        specials: {
            1: {
            },
            2: {
            },
            3: {
            }
        },
        signature: {
        },
        author: {
            name: "Kabam",
            type: "spotlight"
        }
    };
    constructor(pathForEnJson) {
        this._allLines = readFileSync(pathForEnJson, 'utf-8').split('\n')
        this._allLinesToRemove = this._allLines.filter((line) => {
                return this.#tagsToRemoveRegExp.test(line);
            });
        this._linesForChampion = new Map();
        this._guideForChampion = new Map();
        this._allLinesToRemove.forEach((line) => {
            const match = line.match(this.#tagsToRemoveRegExp);
            const championName = (match[2] || match[4] || match[6]).trim();
            if (!this._linesForChampion.has(championName)) {
                this._linesForChampion.set(championName, []);
            }
            this._linesForChampion.get(championName).push(line);
        });
    }
    
    #getChampionName(championKey) {
        const championNameRegExp = /champion\-([\d\w]+)\-name": "(.*)",/;
        const foundLine = this._allLines.find((line) => {
            const match = line.match(championNameRegExp);
            return match && match[ 1 ] === championKey
        });
        return foundLine.match(championNameRegExp)[ 2 ];
    }

    #addUrlForKabamSpotlight(spotlightUrl, guide) {
        if (!guide.author) {
            guide.author = {
                name: "Kabam",
                type: "spotlight",
                profile: spotlightUrl
            };
        } else if (guide.author.name === 'Kabam') {
            guide.author.profile = spotlightUrl;
        }
    }

    #getSpotlightUrl(championKey) {
        const championNameReplaceRegExp = /[^a-z\d\-]/g;
        const championName = this.#getChampionName(championKey);
        const probableUrlName = championName.toLowerCase().replace(/[\(\)’]/g, '').replace(championNameReplaceRegExp, '-');
        const spotlightUrl = `https://playcontestofchampions.com/news/champion-spotlight-${probableUrlName}/`;
        return spotlightUrl;
    }

    #readGuideFor(championKey) {
        const fileName = new URL(`../../src/data/guides/${championKey}.json`, import.meta.url);
        let guide;
        if (existsSync(fileName)) {
            guide = JSON.parse(readFileSync(fileName, 'utf-8'));
        } else  {
            //"Clone" to get a copy
            guide = JSON.parse(JSON.stringify(this.#emptyGuide));
        }
        this.#addUrlForKabamSpotlight(this.#getSpotlightUrl(championKey), guide);
        this._guideForChampion.set(championKey, guide);
        return guide;
    }

    #findLine(searchTermRegExp, lines) {
        return lines.find((line) => searchTermRegExp.test(line));
    }

    #removeLineFromOriginal(foundLine) {
        this._allLines.splice(this._allLines.indexOf(foundLine), 1);
    }

    #setNestedKey(guide, propertyArray, value) {
        if (propertyArray.length === 1) {
            if (!guide[ propertyArray ]) {
                guide[ propertyArray ] = value;
            }
            return;
        }
        if (!guide[ propertyArray[ 0 ] ]) {
            guide[ propertyArray[ 0 ] ] = {};
        }
        return this.#setNestedKey(guide[propertyArray[ 0 ]], propertyArray.slice(1), value);
    }

    #updateAndRemove(guide, lines, searchTermRegExp, propertyToUpdate) {
        const valueRegExp = /: "(.*)"/
        const foundLine = this.#findLine(searchTermRegExp, lines);
        if (foundLine) {
            const value = foundLine.match(valueRegExp)[1];
            this.#setNestedKey(guide, propertyToUpdate, value);
            this.#removeLineFromOriginal(foundLine);
        }
    }

    #updateSpecialsFor(guide, lines) {
        for (let index = 1; index <= 3; index++) {
            this.#updateAndRemove(guide, lines, new RegExp(`${index}\-name`), [ 'specials', `${index}`, 'name' ]);
            this.#updateAndRemove(guide, lines, new RegExp(`${index}\-description`), [ 'specials', `${index}`, 'description' ]);
        }
    }

    #updateSignatureFor(guide, lines) {
        this.#updateAndRemove(guide, lines, /champion\-signature\-[\w\d]+\-name/, [ 'signature', 'name' ]);
        this.#updateAndRemove(guide, lines, /champion\-signature\-[\w\d]+\-description/, [ 'signature', 'description' ]);
    }

    #updateDescriptionFor(guide, lines) {
        this.#updateAndRemove(guide, lines, /champion\-[\w\d]+\-description/, [ 'description' ]);
    }

    updateGuidesAndRemoveLines() {
        for (const [ championKey, lines ] of this._linesForChampion) {
            const guide = this.#readGuideFor(championKey);
            console.log('Updating ', championKey);
            this.#updateSpecialsFor(guide, lines);
            this.#updateSignatureFor(guide, lines);
            this.#updateDescriptionFor(guide, lines);
        }
    }

    saveGuidesToFile() {
        this._guideForChampion.forEach((guide, championKey) => {
            const fileName = new URL(`../../src/data/guides/${championKey}.json`, import.meta.url);
            writeFileSync(fileName, JSON.stringify(guide, null, 2), 'utf-8');
        });
    }

    saveEnJson(fileName) {
        //Remove trailing comma at the last entry
        this._allLines[ this._allLines.length - 3 ] = this._allLines[ this._allLines.length - 3 ].replace(',",', ',"');
        writeFileSync(new URL(fileName), this._allLines.join('\n'), 'utf-8');
    }
}

(() => {
    const fileName = new URL('../../src/data/lang/en.json', import.meta.url);
    const jsonFileToGuides = new LangJsonFileToGuides(fileName);
    jsonFileToGuides.updateGuidesAndRemoveLines();
    jsonFileToGuides.saveGuidesToFile();
    jsonFileToGuides.saveEnJson(fileName);
})();
