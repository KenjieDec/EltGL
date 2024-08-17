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
        id = url.substringAfter("https://learn.eltngl.com/cdn_proxy/").substringAfter("https://learn.eltngl.com/api/interactives/").substringAfter("https://learn.eltngl.com/api/interactives/").substringBefore("?").substringBefore("/");
    }

    try {
        if(id == "e") throw new Error("Invalid URL");
        let response = await fetch(`https://learn.eltngl.com/cdn_proxy/${id}/data.js`);
        let text = await response.text();

        let get = text.substringAfter("ajaxData = ").removeSuffix(";");
        let json = JSON.parse(get);

        function getAnswers(document) {
            let infos = {};
            document.querySelectorAll("responsedeclaration").forEach((el, i) => {
                el.querySelectorAll("value").forEach(el2 => {
                    const text = el2.textContent; // n
                    const el3 = document.querySelector(`[responseidentifier="${el.getAttribute("identifier")}"] [identifier="${text}"]`);
                    var number = i + 1
                    infos["Q" + number] = infos["Q" + number] || [];
                    if (text.startsWith("C") && text.includes("_")) {
                        infos["Q" + number].push(el3 ? el3.textContent : '');
                    } else {
                        infos["Q" + number] = el3 ? el3.textContent : text;
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
        
        if (answers.length > 1) {
            let temp = {};
            answers.forEach((obj, i) => {
                const value = Object.values(obj);
                temp["Q" + (i + 1)] = value.length === 1 ? value[0] : value;
            });
            answers = temp; // e
        } else {
            answers = answers[0]; 
        }

        // Dec
        document.querySelector('.output').textContent = JSON.stringify(answers, null, 2);
    } catch (error) {
        document.querySelector('.output').textContent = 'Error: ' + error.message;
    }
});
