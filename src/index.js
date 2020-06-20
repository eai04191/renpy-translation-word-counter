document.querySelector("#button").addEventListener("click", (event) => {
    if (sourceIsBlank()) {
        alert("先にソースをペーストしてください。");
        return;
    }

    count(event);
});

document.querySelector("#source").addEventListener("paste", (event) => {
    count(event);
});

function sourceIsBlank() {
    return !document.querySelector("#source").value.length;
}

function count(event) {
    let wordsTotal = 0;
    document.querySelector("#error").classList.add("hidden");

    const source =
        event.clipboardData.getData("text") ||
        document.querySelector("#source").value;
    const regexString = /^\s+(old |# .+ )"(?<string>.+)"$/gm;
    let match = regexString.exec(source);
    let strings = [];
    try {
        do {
            if (!match) {
                throw new Error(
                    "エラー: 原文に一致する箇所が見つかりませんでした。おそらく対応していない形式です。"
                );
            }
            let string = match.groups.string;
            // console.log(string);
            strings.push(match.groups.string);
        } while ((match = regexString.exec(source)) !== null);
        // console.log(strings);
    } catch (error) {
        console.log(error);
        document.querySelector("#error-message").innerText = error.message;
        document.querySelector("#error").classList.remove("hidden");
    }

    strings.forEach((string) => {
        let sentence = string
            .replace(/{color=#.{6}}/g, "")
            .replace(/{\/color}/g, "")
            .replace(/\\n/g, "")
            .replace(/\.{2,}/g, "")
            .replace(/#/g, " ")
            .replace(/\s+/gm, " ")
            .trim();
        console.log("オリジナルのテキスト", string);
        console.log("カウントしない文字を消したテキスト", sentence);
        const wc = sentence.split(" ").length;
        console.log("その単語数", wc);
        wordsTotal += wc;
    });

    document.querySelector("#output").value = wordsTotal;
}

// https://www.tailwindtoolbox.com/components/modal
const openmodal = document.querySelectorAll(".modal-open");
openmodal.forEach((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        toggleModal();
    });
});

const overlay = document.querySelector(".modal-overlay");
overlay.addEventListener("click", toggleModal);

var closemodal = document.querySelectorAll(".modal-close");
closemodal.forEach((element) => {
    element.addEventListener("click", toggleModal);
});

document.onkeydown = (event) => {
    event = event || window.event;
    var isEscape = false;
    if ("key" in event) {
        isEscape = event.key === "Escape" || event.key === "Esc";
    } else {
        isEscape = event.keyCode === 27;
    }
    if (isEscape && document.body.classList.contains("modal-active")) {
        toggleModal();
    }
};

function toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("modal-active");
}
