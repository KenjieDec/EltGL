String.prototype.indexesOf = function (item) {
    let index = -1;
    let val = [];
    while ((index = this.indexOf(item, index + 1)) > -1) {
        val.push(index);
    }
    return val[0] === -1 ? [] : val;
};

String.prototype.substringAfter = function (separator, indexed = 0) {
    const index = this.indexesOf(separator)[indexed];
    return index === undefined ? this : this.substring(index + separator.length);
};

String.prototype.substringBefore = function (separator, indexed = 0) {
    const index = this.indexesOf(separator)[indexed];
    return index === undefined ? this : this.substring(0, index);
};

String.prototype.removeSuffix = function (suffix) {
    return this.endsWith(suffix) ? this.slice(0, -suffix.length) : this;
};

document.querySelector('.get').addEventListener('click', async () => {
    let url = document.querySelector('.input').value.trim();
    let id = "e";
    
    if (url) {
        id = url.substringAfter("/cdn_proxy/").substringAfter("api/interactives/").substringBefore("?").substringBefore("/");
    }

    try {
        if(id == "e") throw new Error("Invalid URL");
        let response = await fetch(`https://learn.eltngl.com/cdn_proxy/${id.trim()}/data.js`);
        let text = await response.text();

        let get = text.substringAfter("ajaxData = ").removeSuffix(";");
        let json = JSON.parse(get);

        // console.log(json["cat2588317.xml"])
        function getAnswers(document) {
            let infos = {};
            const reDec = document.querySelectorAll('[id="contentblock"]')
            const reDec2 = document.querySelectorAll('[identifier="Input:Creative:Free writing"]')
            var howMany = 0;
            var ret = 0;
            
            if(reDec2[0]) {
                var idd = document.querySelectorAll('option[id="319"] p');
                idd.forEach((el, i) => {
                    const index = i + 1
                    infos[index] = infos[index] || [];
                    infos[index].push(el ? el.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim() : '');
                })
            }

            reDec.forEach((el, i) => {
                var val = el.querySelectorAll(`[identifier]`);
                if(val.length == 0) val = el.querySelectorAll(`[responseidentifier]`);
                val.forEach((el2, i2) => {
                    if(ret == 1) return
                    const attr = el2.getAttribute("responseidentifier");
                    var text = el2.textContent; // n
                    
                    if(text.length == 0){
                        text = document.querySelector(`[identifier="${attr}"]`).textContent
                    }
                    console.log(text)
                    if(text.startsWith("GT")) return;
                    var el3 = document.querySelector(`[identifier="${el2.getAttribute("responseidentifier")}"]`);
                    var number
                    try {
                        var responseIdentifier = el2.getAttribute("responseidentifier");
                        if (responseIdentifier) {
                            number = parseInt(responseIdentifier.replace("RESPONSE", "")) + 1 - howMany || i2 + 1 - howMany;
                        } else {
                            throw new Error('Attribute "responseidentifier" is missing or empty');
                        }
                    } catch (error) {
                        number = i2 + 1 - howMany;
                    }
                    if(!el3){
                        el3 = document.querySelector(`[responseidentifier]`).getAttribute("responseidentifier");
                        el3 = document.querySelector(`[identifier="${el3}"]`);
                       
                        const baseType = el3.getAttribute("basetype")
                        console.log(baseType)
                        
                        const cardinality = el3.getAttribute("cardinality")
                        if (baseType == "pair"){
                            var identifier = el2.getAttribute("identifier")
                            number = identifier.replace("A", "").replace("B", "")

                            infos["Q" + number] = infos["Q" + number] || [];
                            console.log(identifier)
                            if(identifier.startsWith("A")) infos["Q" + number][0] = el2 ? el2.textContent : '';
                            if(identifier.startsWith("B")) infos["Q" + number][1] = el2 ? el2.textContent : '';
                        } else if (baseType == "directedPair"){
                            el3 = document.querySelector(`[id="${el2.getAttribute("id")}"]`);

                            number = i + 1
                            infos["Q" + number] = infos["Q" + number] || [];
    
                            infos["Q" + number].push(el3 ? el3.textContent : '');
                        } else if (cardinality == "single" || cardinality == "multiple"){
                            ret = 1
                            document.querySelectorAll("responsedeclaration").forEach((el5, i4) => {
                                el5.querySelectorAll("value").forEach(el6 => {
                                    const text2 = el6.textContent; // n
                                    const el4 = document.querySelector(`[responseidentifier="${el5.getAttribute("identifier")}"] [identifier="${text2}"]`);
                                    var number2 = i4 + 1
                                    infos["Q" + number2] = infos["Q" + number2] || [];
                                    infos["Q" + number2].push(el4 ? el4.textContent : '');
                                });
                            });
                        } else if (baseType == "identifier") {
                        }
                    } else {
                        if(el2.parentElement.hasAttribute("responseidentifier")) {
                            number = number -  1
                            howMany++
                        }
                        infos["Q" + number] = infos["Q" + number] || [];

                        infos["Q" + number].push(el3 ? el3.textContent : '');
                    }
                });
            });
            return infos;
        }

        function getValuesWithPrefix(obj, value) {
            const keys = Object.keys(obj).filter(key => key.startsWith(value));
            const sorted = keys.sort((a, b) => {
                const numA = parseInt(a.replace(value, ""));
                const numB = parseInt(b.replace(value, ""));
                return numA - numB;
            });
            return sorted.map(key => obj[key]); // j
        }

        let answers = getValuesWithPrefix(json, "cat").map(e => getAnswers(new DOMParser().parseFromString(e, 'text/html'))); // i
        
        function checker(value) {
            if (value.length == 1) {
                if (Array.isArray(value[0])) {
                    if (value[0].length == 1) {
                        return value[0][0];
                    } else {
                        return value[0];
                    }
                } else {
                    return value[0];
                }
            } else {
                return value;
            }
        }

        function checker2(obj) {
            const otput = document.querySelector('.output');
            otput.innerHTML = '';
            
            for (const q in obj) {
                var quest = obj[q];

                const pan = document.createElement('p');
                const spank = document.createElement('span');
                spank.className = 'num';
                spank.textContent = `${q}: `;

                if(q != Object.keys(obj)[0]) otput.appendChild(pan);
                if(Array.isArray(quest)){
                    otput.appendChild(spank);
                    quest.forEach((t, i) => {
                        const spant = document.createElement('span');
                        spant.className = 'answer';
                        spant.textContent = `${t.replaceAll("&quot;", "\"")}`;
                        const spont = document.createElement('span');
                        spont.textContent = `, `;
                        spant.addEventListener('click', (e) => {
                            var target = e.target
                            if(target.classList.contains("disabled")) return;
                            navigator.clipboard.writeText(target.textContent).then(() => {
                                target.classList.add('success');
                                target.classList.add('disabled');
                                setTimeout(() => {
                                    target.classList.remove('success');
                                    target.classList.remove('disabled');
                                }, 750);
                            })
                        });
                        otput.appendChild(spant);
                        if(i < quest.length - 1) otput.appendChild(spont);
                    })
                } else {
                    const spant = document.createElement('span');

                    spant.className = 'answer';
                    spant.textContent = quest.replaceAll("&quot;", "\"");
                    
                    spant.addEventListener('click', (e) => {
                        var target = e.target
                        if(target.classList.contains("disabled")) return;
                        navigator.clipboard.writeText(target.textContent).then(() => {
                            target.classList.add('success');
                            target.classList.add('disabled');
                            setTimeout(() => {
                                target.classList.remove('success');
                                target.classList.remove('disabled');
                            }, 750);
                        })
                    });
                    
                    otput.appendChild(spank);
                    otput.appendChild(spant);
                }
            }
        }

        if (answers.length > 1) {
            let temp = {};
            console.log(answers)
            answers.forEach((obj, i) => {
                const value = Object.values(obj);
                
                temp["Q" + (i + 1)] = checker(value);
            });
            answers = temp; // e
        } else {
            answers = answers[0]; 
        }

        // Dec
        checker2(answers) // JSON.stringify(answers, null, 2)
    } catch (error) {
        if(error.message.includes("Unexpected token")) error.message = "Invalid URL";
        document.querySelector('.output').textContent = 'Error: ' + error.message;
    }
});
